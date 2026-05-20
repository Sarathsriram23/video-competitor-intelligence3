/**
 * Analytics and Scoring Engine
 */

// Simple ISO 8601 duration parser
// Example: "PT10M15S" -> 615 seconds, "PT1H2M10S" -> 3730 seconds, "PT45S" -> 45 seconds
export const parseISO8601Duration = (durationStr) => {
  if (!durationStr) return 0;
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = durationStr.match(regex);
  if (!matches) {
    // Check if it's a short (typically PT30S or similar, sometimes P1D etc)
    if (durationStr.includes('S')) {
      const sMatch = durationStr.match(/(\d+)S/);
      if (sMatch) return parseInt(sMatch[1], 10);
    }
    return 180; // default 3 mins fallback
  }
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
};

// Stop words for simple TF-IDF / Keyword extraction
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant',
  'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during',
  'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having',
  'he', 'hed', 'hell', 'hes', 'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets',
  'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only',
  'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she',
  'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 'thats', 'the',
  'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 'theyll',
  'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
  'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where',
  'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt',
  'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves',
  // common generic terms in video titles
  'video', 'youtube', 'official', 'channel', 'vs', 'new', 'get', 'use', 'using', 'best', 'top', 'make',
  'how-to', 'intro', 'introduction', 'tutorial', 'overview', 'review', 'guide', 'explained', 'explainer'
]);

/**
 * Detects the category of video based on duration and title keywords
 */
export const detectVideoFormat = (title, durationSec) => {
  const lowerTitle = title.toLowerCase();
  
  if (durationSec > 0 && durationSec < 60) {
    return 'Shorts';
  }
  if (lowerTitle.includes('#shorts') || lowerTitle.includes(' shorts')) {
    return 'Shorts';
  }
  if (durationSec > 1200 && (lowerTitle.includes('webinar') || lowerTitle.includes('masterclass') || lowerTitle.includes('workshop') || lowerTitle.includes('live stream') || lowerTitle.includes('livestream'))) {
    return 'Webinar';
  }
  if (durationSec > 900 && (lowerTitle.includes('podcast') || lowerTitle.includes('episode') || lowerTitle.includes('interview') || lowerTitle.includes('talks') || lowerTitle.includes('founder'))) {
    return 'Podcast';
  }
  if (lowerTitle.includes('tutorial') || lowerTitle.includes('how to') || lowerTitle.includes('guide') || lowerTitle.includes('learn') || lowerTitle.includes('course') || lowerTitle.includes('training')) {
    return 'Tutorial';
  }
  if (lowerTitle.includes('demo') || lowerTitle.includes('walkthrough') || lowerTitle.includes('product') || lowerTitle.includes('features') || lowerTitle.includes('tour') || lowerTitle.includes('integration')) {
    return 'Product Demo';
  }
  if (lowerTitle.includes('customer story') || lowerTitle.includes('case study') || lowerTitle.includes('testimonial') || lowerTitle.includes('success story') || lowerTitle.includes('review') || lowerTitle.includes('client')) {
    return 'Customer Story';
  }
  
  // Default classification by duration
  if (durationSec < 180) {
    return 'Promo/Explainer';
  }
  return 'Tutorial'; // standard video fallback
};

/**
 * Extracts key themes/topics from a collection of video titles
 */
export const extractTopics = (videos, limit = 5) => {
  const wordFrequency = {};
  
  videos.forEach(video => {
    // Clean and split title
    const words = video.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove punctuation except dashes
      .split(/\s+/);
      
    words.forEach(word => {
      if (word.length > 2 && !STOP_WORDS.has(word) && !/^\d+$/.test(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });
  });

  // Convert to sorted array
  const sortedWords = Object.keys(wordFrequency)
    .map(word => ({
      topic: word.charAt(0).toUpperCase() + word.slice(1),
      count: wordFrequency[word]
    }))
    .sort((a, b) => b.count - a.count);

  return sortedWords.slice(0, limit).map(item => item.topic);
};

/**
 * Calculates posting consistency score (0 - 100)
 */
export const calculateConsistency = (videos) => {
  if (!videos || videos.length === 0) return 0;

  // 1. Calculate frequency (uploads in the last 3 months)
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  const recentVideos = videos.filter(v => new Date(v.publishedAt) >= threeMonthsAgo);
  const videosPerMonth = recentVideos.length / 3;

  // 2. Calculate recency factor
  const publishDates = videos.map(v => new Date(v.publishedAt).getTime());
  const latestPublishTime = Math.max(...publishDates);
  const daysSinceLastUpload = (now.getTime() - latestPublishTime) / (1000 * 60 * 60 * 24);

  let recencyFactor = 1.0;
  if (daysSinceLastUpload <= 7) recencyFactor = 1.0;
  else if (daysSinceLastUpload <= 14) recencyFactor = 0.85;
  else if (daysSinceLastUpload <= 30) recencyFactor = 0.65;
  else if (daysSinceLastUpload <= 90) recencyFactor = 0.35;
  else recencyFactor = 0.1;

  // 3. Consistency Score (normalized: 4 uploads/month with 1.0 recency = 100 score)
  const targetUploadsPerMonth = 4; // 1 per week is solid
  const volumeRatio = Math.min(videosPerMonth / targetUploadsPerMonth, 1.0);
  
  const score = Math.round((volumeRatio * 0.5 + recencyFactor * 0.5) * 100);
  return {
    score: Math.max(10, Math.min(100, score)),
    videosPerMonth: parseFloat(videosPerMonth.toFixed(1)),
    daysSinceLastUpload: Math.max(0, Math.round(daysSinceLastUpload))
  };
};

/**
 * Compiles comprehensive analytics for a company
 */
export const analyzeCompanyData = (companyName, isMainCompany, channelInfo, rawVideos) => {
  if (!rawVideos || rawVideos.length === 0) {
    return {
      companyName,
      isMainCompany,
      channelInfo,
      videos: [],
      metrics: {
        avgViews: 0,
        avgLikes: 0,
        avgComments: 0,
        engagementRate: 0,
        uploadConsistencyScore: 10,
        videosPerMonth: 0,
        daysSinceLastUpload: 999,
        topTopics: [],
        formatDistribution: { Shorts: 0, Tutorial: 0, Webinar: 0, Podcast: 0, "Product Demo": 0, "Customer Story": 0, "Promo/Explainer": 0 }
      }
    };
  }

  // Parse durations and categories
  const videos = rawVideos.map(v => {
    const durationSec = parseISO8601Duration(v.duration);
    const category = detectVideoFormat(v.title, durationSec);
    const engagementRate = v.viewCount > 0 ? ((v.likeCount + v.commentCount) / v.viewCount) * 100 : 0;
    
    return {
      id: v.videoId || v.id,
      title: v.title,
      publishedAt: v.publishedAt,
      duration: v.duration,
      durationSec,
      viewCount: v.viewCount,
      likeCount: v.likeCount,
      commentCount: v.commentCount,
      engagementRate: parseFloat(engagementRate.toFixed(3)),
      category
    };
  });

  // Metric averages
  const totalViews = videos.reduce((acc, v) => acc + v.viewCount, 0);
  const totalLikes = videos.reduce((acc, v) => acc + v.likeCount, 0);
  const totalComments = videos.reduce((acc, v) => acc + v.commentCount, 0);
  const count = videos.length;

  const avgViews = Math.round(totalViews / count);
  const avgLikes = Math.round(totalLikes / count);
  const avgComments = Math.round(totalComments / count);
  
  // Overall channel engagement rate based on recent averages (average of individual video rates to avoid skewing by outlier mega-viral videos)
  const avgEngagementRate = videos.reduce((acc, v) => acc + v.engagementRate, 0) / count;

  // Consistency
  const consistencyData = calculateConsistency(videos);

  // Topics
  const topTopics = extractTopics(videos, 5);

  // Format distributions
  const formatCounts = { Shorts: 0, Tutorial: 0, Webinar: 0, Podcast: 0, "Product Demo": 0, "Customer Story": 0, "Promo/Explainer": 0 };
  videos.forEach(v => {
    if (formatCounts[v.category] !== undefined) {
      formatCounts[v.category]++;
    } else {
      formatCounts[v.category] = 1;
    }
  });

  // Convert to percentages
  const formatDistribution = {};
  Object.keys(formatCounts).forEach(key => {
    formatDistribution[key] = count > 0 ? Math.round((formatCounts[key] / count) * 100) : 0;
  });

  return {
    companyName,
    isMainCompany,
    channelInfo,
    videos: videos.slice(0, 10), // keep top 10 in output for detailed view
    metrics: {
      avgViews,
      avgLikes,
      avgComments,
      engagementRate: parseFloat(avgEngagementRate.toFixed(2)),
      uploadConsistencyScore: consistencyData.score,
      videosPerMonth: consistencyData.videosPerMonth,
      daysSinceLastUpload: consistencyData.daysSinceLastUpload,
      topTopics,
      formatDistribution
    }
  };
};

/**
 * Calculates weighted score and builds rank leaderboard
 */
export const calculateLeaderboard = (analyses) => {
  // Metric weights:
  // Engagement: 30%, Consistency: 20%, Avg Views: 20%, Subscribers: 15%, Topic Diversity: 15%
  const scoreResults = analyses.map(analysis => {
    const { metrics, channelInfo } = analysis;
    const subs = parseInt(channelInfo.statistics.subscriberCount || '0', 10);
    
    // Normalize Subscriber score (log scale, cap at 5M)
    const subScore = Math.min(Math.round((Math.log10(subs + 1) / Math.log10(5000000)) * 100), 100);
    
    // Normalize Avg Views score (log scale, cap at 1M)
    const viewScore = Math.min(Math.round((Math.log10(metrics.avgViews + 1) / Math.log10(1000000)) * 100), 100);
    
    // Engagement score (cap at 6% engagement rate)
    const engScore = Math.min(Math.round((metrics.engagementRate / 6) * 100), 100);
    
    // Consistency score (already normalized 0-100)
    const constScore = metrics.uploadConsistencyScore;
    
    // Format/Topic diversity score (based on number of distinct formats used with >5% share)
    const activeFormats = Object.values(metrics.formatDistribution).filter(v => v >= 5).length;
    const diversityScore = Math.min(activeFormats * 20, 100);

    // Weighted average
    const finalScore = Math.round(
      engScore * 0.30 +
      constScore * 0.20 +
      viewScore * 0.20 +
      subScore * 0.15 +
      diversityScore * 0.15
    );

    return {
      companyName: analysis.companyName,
      isMainCompany: analysis.isMainCompany,
      score: Math.max(20, Math.min(finalScore, 100)),
      subScore,
      viewScore,
      engScore,
      constScore,
      diversityScore
    };
  });

  // Sort and assign rank
  return scoreResults
    .sort((a, b) => b.score - a.score)
    .map((item, idx) => ({
      ...item,
      rank: idx + 1
    }));
};

/**
 * Performs strategic Gap Analysis and custom recommendations based on data
 */
export const generateGapAnalysis = (analyses, mainCompany) => {
  const mainAnalysis = analyses.find(a => a.isMainCompany);
  const competitors = analyses.filter(a => !a.isMainCompany);
  
  if (!mainAnalysis) return { untappedTopics: [], underutilizedFormats: [], recommendations: [] };

  const untappedTopics = [];
  const underutilizedFormats = [];
  const recommendations = [];

  // 1. Topic Gaps
  // Find topics that competitors focus on heavily (top topics) that the main company doesn't list
  const mainTopics = new Set(mainAnalysis.metrics.topTopics.map(t => t.toLowerCase()));
  const compTopicFrequency = {};
  
  competitors.forEach(c => {
    c.metrics.topTopics.forEach(topic => {
      const lower = topic.toLowerCase();
      compTopicFrequency[lower] = (compTopicFrequency[lower] || 0) + 1;
    });
  });

  Object.keys(compTopicFrequency).forEach(topic => {
    if (!mainTopics.has(topic) && compTopicFrequency[topic] >= Math.max(1, competitors.length * 0.4)) {
      // Competitors cover it but we don't
      untappedTopics.push(topic.charAt(0).toUpperCase() + topic.slice(1));
    }
  });

  // Fallbacks if no gaps
  if (untappedTopics.length === 0) {
    untappedTopics.push('Case Studies', 'Product integrations', 'AI Workflows');
  }

  // 2. Format Gaps
  // Find formats that competitors are using but main company is underperforming in (< 5%)
  const mainFormats = mainAnalysis.metrics.formatDistribution;
  const compFormatsAvg = {};
  const formats = ['Shorts', 'Tutorial', 'Webinar', 'Podcast', 'Product Demo', 'Customer Story'];

  formats.forEach(f => {
    let sum = 0;
    competitors.forEach(c => {
      sum += c.metrics.formatDistribution[f] || 0;
    });
    compFormatsAvg[f] = sum / competitors.length;
  });

  formats.forEach(f => {
    if ((mainFormats[f] || 0) < 5 && compFormatsAvg[f] >= 15) {
      underutilizedFormats.push(f);
    }
  });

  if (underutilizedFormats.length === 0) {
    underutilizedFormats.push('Shorts', 'Podcast');
  }

  // 3. Strategic Recommendations
  // Dynamic Recommendations based on metrics
  
  // Recommendation 1: Upload Cadence
  if (mainAnalysis.metrics.uploadConsistencyScore < 60) {
    const leaderInConsistency = [...analyses].sort((a, b) => b.metrics.uploadConsistencyScore - a.metrics.uploadConsistencyScore)[0];
    recommendations.push({
      title: 'Establish a Consistent Publishing Cadence',
      desc: `Your current posting consistency score is ${mainAnalysis.metrics.uploadConsistencyScore}/100. Build a structured editorial calendar targeting at least 1-2 video uploads per week. Take inspiration from ${leaderInConsistency.companyName} who posts consistently (${leaderInConsistency.metrics.videosPerMonth} videos/month).`,
      impact: 'High'
    });
  } else {
    recommendations.push({
      title: 'Maintain Editorial Cadence & Optimize Metadata',
      desc: `Your consistency score is strong at ${mainAnalysis.metrics.uploadConsistencyScore}/100. Shift focus toward advanced video metadata testing (A/B testing custom thumbnails and keyword-rich tags) to lift CTR and organic recommendations.`,
      impact: 'Medium'
    });
  }

  // Recommendation 2: Shorts vs Long Form
  if (underutilizedFormats.includes('Shorts')) {
    recommendations.push({
      title: 'Accelerate YouTube Shorts Production',
      desc: `Competitors are capturing high-velocity reach via Shorts (averaging ${Math.round(compFormatsAvg['Shorts'])}% of their catalog), while your channel has only ${mainAnalysis.metrics.formatDistribution['Shorts']}% Shorts share. Repurpose webinars or tutorials into 30-second snackable key takeaways.`,
      impact: 'High'
    });
  } else {
    recommendations.push({
      title: 'Leverage In-Depth Technical Webinars',
      desc: 'To balance quick-reach Shorts, introduce comprehensive masterclasses (20+ minutes duration). This format strengthens search authority for technical search terms and builds high buyer intent.',
      impact: 'High'
    });
  }

  // Recommendation 3: Engagement Lift
  if (mainAnalysis.metrics.engagementRate < 2.5) {
    recommendations.push({
      title: 'Boost Video Engagement Rates',
      desc: `Your engagement rate is ${mainAnalysis.metrics.engagementRate}%, while top competitors are achieving over 3.5%. Drive interaction by ending videos with specific single-question polls, pinning a call-to-action in comments, and responding to every comment in the first 24 hours.`,
      impact: 'High'
    });
  } else {
    recommendations.push({
      title: 'Convert High Engagement into Leads',
      desc: `Outstanding audience connection with a ${mainAnalysis.metrics.engagementRate}% engagement rate! Capitalize on this by inserting middle-of-funnel conversion links (lead magnets, trial signups) within the first two lines of descriptions.`,
      impact: 'Medium'
    });
  }

  // Recommendation 4: Topic Expansion (un-tapped topics)
  const gapTopic = untappedTopics[0] || 'AI integrations';
  recommendations.push({
    title: `Target Untapped Theme: "${gapTopic}"`,
    desc: `Competitors are successfully indexing on queries surrounding "${gapTopic}" which is completely missing from your recent themes. Launch a 3-part playlist series covering this topic in-depth to hijack search volume.`,
    impact: 'Medium'
  });

  return {
    untappedTopics: untappedTopics.slice(0, 3),
    underutilizedFormats: underutilizedFormats.slice(0, 3),
    recommendations
  };
};

/**
 * Main logic to compile the comparative report
 */
export const compileComparativeReport = (mainCompanyName, competitorNames, rawChannelData) => {
  const analyses = rawChannelData.map((data) => {
    const isMain = data.companyName.toLowerCase() === mainCompanyName.toLowerCase();
    return analyzeCompanyData(data.companyName, isMain, data.channelInfo, data.videos);
  });

  const leaderboard = calculateLeaderboard(analyses);
  const gapAnalysis = generateGapAnalysis(analyses, mainCompanyName);

  // Determine leaders and narratives
  const mainCoMetrics = analyses.find(a => a.isMainCompany);
  const topCo = leaderboard[0];
  const strongestCompetitor = topCo.companyName;

  let narrative = '';
  if (topCo.companyName.toLowerCase() === mainCompanyName.toLowerCase()) {
    narrative = `Your brand (${mainCompanyName}) is currently the leader in this video intelligence intelligence benchmark with a score of ${topCo.score}/100, driven by excellent ${mainCoMetrics.metrics.engagementRate > 3.0 ? 'audience engagement rates' : 'consistent posting volume'}. However, key competitors are targeting strategic keywords that represent potential traffic hazards if left unchecked.`;
  } else {
    narrative = `${strongestCompetitor} dominates the benchmark with a score of ${topCo.score}/100, primarily due to their ${topCo.engScore > 80 ? 'hyper-active audience engagement' : 'high-frequency upload cadences'}. To bridge this divide, your company (${mainCompanyName}) should immediately execute on the tactical shorts and publishing consistency guidelines outlined in this report.`;
  }

  return {
    id: `rep_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    companies: analyses.map(a => a.companyName),
    mainCompany: mainCompanyName,
    analysis: analyses,
    executiveSummary: {
      leader: strongestCompetitor,
      biggestOpportunity: gapAnalysis.untappedTopics[0] || 'YouTube Shorts',
      weakestArea: mainCoMetrics.metrics.uploadConsistencyScore < 60 ? 'Posting consistency' : 'Audience interaction rates',
      narrative
    },
    gapAnalysis,
    leaderboard
  };
};
