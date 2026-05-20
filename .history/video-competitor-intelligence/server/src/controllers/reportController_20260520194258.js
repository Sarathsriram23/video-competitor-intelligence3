import { config } from '../config/env.js';
import * as youtubeService from '../services/youtube/youtubeService.js';
import * as analyticsService from '../services/analytics/analyticsService.js';
import * as pptGenerator from '../services/ppt/pptGenerator.js';
import { getDemoReport } from '../services/analytics/demoData.js';

/**
 * Helper to dynamically map custom names onto a realistic demo report structure.
 * This makes Demo Mode feel like a customized real-time report!
 */
const customizeDemoReport = (companyName, competitorsInput) => {
  const demoReport = getDemoReport();
  
  // Filter out empty input names
  const comps = (competitorsInput || []).filter(name => name && name.trim() !== '');
  
  if (!companyName && comps.length === 0) {
    return demoReport;
  }

  const clientName = companyName || "My Company";
  const competitorNames = comps.length > 0 ? comps : ["Competitor Alpha", "Competitor Beta", "Competitor Gamma"];
  
  const allNames = [clientName, ...competitorNames].slice(0, 5);
  
  // Map names on top of demo report channels
  const customizedAnalysis = demoReport.analysis.map((item, idx) => {
    if (idx >= allNames.length) return null;
    const newName = allNames[idx];
    const isMain = idx === 0;
    
    return {
      ...item,
      companyName: newName,
      isMainCompany: isMain,
      channelInfo: {
        ...item.channelInfo,
        title: `${newName} Official`,
        customUrl: `@${newName.toLowerCase().replace(/\s+/g, '')}`
      },
      videos: item.videos.map(v => ({
        ...v,
        title: v.title.replace(/HubSpot|Salesforce|monday\.com|Zoho|Freshworks/gi, newName)
      })),
      metrics: {
        ...item.metrics,
        topTopics: item.metrics.topTopics.map(topic => 
          topic.replace(/HubSpot|Salesforce|monday\.com|Zoho|Freshworks/gi, newName)
        )
      }
    };
  }).filter(Boolean);

  // Customize Leaderboard
  const customizedLeaderboard = demoReport.leaderboard.map((item, idx) => {
    if (idx >= allNames.length) return null;
    const correspondingAnalysis = customizedAnalysis[idx];
    return {
      ...item,
      companyName: correspondingAnalysis.companyName,
      isMainCompany: correspondingAnalysis.isMainCompany
    };
  }).filter(Boolean);

  // Customize Gap Analysis
  const customizedRecommendations = demoReport.gapAnalysis.recommendations.map(rec => ({
    ...rec,
    title: rec.title.replace(/HubSpot|Salesforce|monday\.com|Zoho/gi, clientName),
    desc: rec.desc.replace(/HubSpot/gi, clientName).replace(/Salesforce/gi, competitorNames[0] || 'Competitor')
  }));

  const narrativeText = demoReport.executiveSummary.narrative
    .replace(/Your brand \(HubSpot\)/gi, `Your brand (${clientName})`)
    .replace(/HubSpot/gi, clientName)
    .replace(/Salesforce dominates/gi, `${competitorNames[0] || 'Salesforce'} dominates`)
    .replace(/Salesforce/gi, competitorNames[0] || 'Salesforce')
    .replace(/monday\.com/gi, competitorNames[1] || 'monday.com')
    .replace(/Zoho/gi, competitorNames[2] || 'Zoho');

  return {
    ...demoReport,
    companies: allNames,
    mainCompany: clientName,
    analysis: customizedAnalysis,
    leaderboard: customizedLeaderboard,
    executiveSummary: {
      ...demoReport.executiveSummary,
      leader: customizedLeaderboard[0].companyName,
      narrative: narrativeText
    },
    gapAnalysis: {
      ...demoReport.gapAnalysis,
      recommendations: customizedRecommendations
    }
  };
};

/**
 * POST /api/report/generate
 * Accepts: { companyName: string, competitors: string[], demo?: boolean }
 */
export const generateReport = async (req, res, next) => {
  try {
    const { companyName, competitors, demo } = req.body;

    if (!companyName) {
      return res.status(400).json({
        status: 'error',
        message: 'Primary company name is required.'
      });
    }

    const compsList = (competitors || []).filter(c => c && c.trim() !== '');

    // Extract Authorization header key override if sent by client UI
    const authHeader = req.headers.authorization || '';
    const headerApiKey = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
    
    // Explicitly re-read .env to bypass any caching of environment states
    import('dotenv').then(d => d.config());
    const activeApiKey = headerApiKey || process.env.YOUTUBE_API_KEY || config.youtubeApiKey;

    console.log('[DEBUG KEY RESOLUTION]');
    console.log('  headerApiKey:', headerApiKey ? `PRESENT (starts with ${headerApiKey.substring(0, 5)})` : 'ABSENT');
    console.log('  config.youtubeApiKey:', config.youtubeApiKey ? `PRESENT (starts with ${config.youtubeApiKey.substring(0, 5)})` : 'ABSENT');
    console.log('  process.env.YOUTUBE_API_KEY:', process.env.YOUTUBE_API_KEY ? `PRESENT (starts with ${process.env.YOUTUBE_API_KEY.substring(0, 5)})` : 'ABSENT');
    console.log('  activeApiKey:', activeApiKey ? `PRESENT (starts with ${activeApiKey.substring(0, 5)})` : 'ABSENT');

    // Check if we should use demo mode:
    // Either the user explicitly requested 'demo' or there is no YouTube API key configured.
    const isDemoMode = demo === true || !activeApiKey;

    if (isDemoMode) {
      console.log(`[Report Controller] Operating in DEMO Mode. Customizing report for "${companyName}"...`);
      // Artificially delay a tiny bit to simulate real-time processing and trigger frontend loading states beautifully
      await new Promise(resolve => setTimeout(resolve, 2000));
      const customizedReport = customizeDemoReport(companyName, compsList);
      return res.status(200).json({
        status: 'success',
        mode: 'demo',
        report: customizedReport
      });
    }

    console.log(`[Report Controller] Starting LIVE API Report Generation using active API key...`);
    console.log(`  Main Company: "${companyName}"`);
    console.log(`  Competitors: ${JSON.stringify(compsList)}`);

    const allCompanies = [companyName, ...compsList].slice(0, 5); // limit to 5 total channels
    const rawChannelData = [];

    // Stage 1: Lookup channels and gather statistics
    for (const name of allCompanies) {
      try {
        // Search Channel
        const searchResult = await youtubeService.searchChannel(name, activeApiKey);
        
        // Fetch Details & uploads playlist ID
        const channelDetails = await youtubeService.fetchChannelDetails(searchResult.channelId, activeApiKey);

        // Fetch recent videos (limit to latest 30 videos to save quota)
        const recentVideos = await youtubeService.fetchRecentVideos(channelDetails.uploadsPlaylistId, 30, activeApiKey);

        // Fetch precise metrics for these videos
        const videoIds = recentVideos.map(v => v.videoId);
        let detailedMetrics = [];
        if (videoIds.length > 0) {
          detailedMetrics = await youtubeService.fetchVideoMetrics(videoIds, activeApiKey);
        }

        // Merge metrics back onto recent videos
        const fullVideos = recentVideos.map(v => {
          const metrics = detailedMetrics.find(m => m.id === v.videoId) || { viewCount: 0, likeCount: 0, commentCount: 0, duration: 'PT0S' };
          return {
            ...v,
            duration: metrics.duration,
            viewCount: metrics.viewCount,
            likeCount: metrics.likeCount,
            commentCount: metrics.commentCount
          };
        });

        rawChannelData.push({
          companyName: name,
          channelInfo: channelDetails,
          videos: fullVideos
        });

      } catch (err) {
        console.error(`[Report Controller] Error analyzing company "${name}":`, err);
        // Do not fail entire report if one competitor search fails, but fail if main company fails
        if (name.toLowerCase() === companyName.toLowerCase()) {
          throw new Error(`Failed to retrieve live YouTube channel for primary company: "${name}". Check spelling or API quota limits.`);
        }
      }
    }

    if (rawChannelData.length === 0) {
      throw new Error('Failed to analyze any of the provided companies.');
    }

    // Stage 2: Perform calculations and compile report
    const compiledReport = analyticsService.compileComparativeReport(
      companyName, 
      rawChannelData.map(d => d.companyName), 
      rawChannelData
    );

    res.status(200).json({
      status: 'success',
      mode: 'live',
      report: compiledReport
    });

  } catch (error) {
    console.error('[Report Controller] Live API Report generation failed:', error);
    next(error);
  }
};

/**
 * POST /api/report/search-videos
 * Search and fetch videos for car brands or any companies
 * Accepts: { brands: string[], maxResults?: number }
 * Returns: { status: 'success', videos: { [brandName]: VideoData[] } }
 */
export const searchAndFetchVideos = async (req, res, next) => {
  try {
    const { brands, maxResults } = req.body;

    if (!brands || !Array.isArray(brands) || brands.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'An array of brand names is required.'
      });
    }

    const videoLimit = maxResults || 15;
    
    // Get API key from header or env
    const authHeader = req.headers.authorization || '';
    const headerApiKey = authHeader.startsWith('Bearer ') ? authHeader.substring(7).trim() : '';
    const activeApiKey = headerApiKey || process.env.YOUTUBE_API_KEY || config.youtubeApiKey;

    if (!activeApiKey) {
      return res.status(400).json({
        status: 'error',
        message: 'YouTube API Key is not configured. Add YOUTUBE_API_KEY to .env'
      });
    }

    console.log(`[Search Videos Controller] Searching videos for ${brands.length} brands: ${brands.join(', ')}`);

    const brandVideos = {};
    const results = [];

    for (const brand of brands) {
      try {
        console.log(`  → Searching "${brand}"...`);
        
        // Search channel
        const channelInfo = await youtubeService.searchChannel(brand, activeApiKey);
        
        // Fetch channel details
        const channelDetails = await youtubeService.fetchChannelDetails(channelInfo.channelId, activeApiKey);

        // Fetch recent videos
        const recentVideos = await youtubeService.fetchRecentVideos(channelDetails.uploadsPlaylistId, videoLimit, activeApiKey);

        // Fetch metrics
        const videoIds = recentVideos.map(v => v.videoId);
        let detailedMetrics = [];
        if (videoIds.length > 0) {
          detailedMetrics = await youtubeService.fetchVideoMetrics(videoIds, activeApiKey);
        }

        // Merge metrics
        const fullVideos = recentVideos.map(v => {
          const metrics = detailedMetrics.find(m => m.id === v.videoId) || { 
            viewCount: 0, 
            likeCount: 0, 
            commentCount: 0, 
            duration: 'PT0S' 
          };
          return {
            videoId: v.videoId,
            title: v.title,
            description: v.description,
            publishedAt: v.publishedAt,
            thumbnails: v.thumbnails,
            duration: metrics.duration,
            viewCount: metrics.viewCount,
            likeCount: metrics.likeCount,
            commentCount: metrics.commentCount,
            engagementRate: metrics.viewCount > 0 ? ((metrics.likeCount + metrics.commentCount) / metrics.viewCount * 100).toFixed(2) : '0'
          };
        });

        brandVideos[brand] = {
          channelInfo: {
            id: channelInfo.channelId,
            title: channelDetails.title,
            customUrl: channelDetails.customUrl,
            thumbnail: channelDetails.thumbnails?.high?.url,
            subscriberCount: channelDetails.statistics.subscriberCount,
            viewCount: channelDetails.statistics.viewCount,
            videoCount: channelDetails.statistics.videoCount
          },
          videos: fullVideos.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        };

        results.push({
          brand,
          videoCount: fullVideos.length,
          topVideo: fullVideos[0]?.title || 'N/A'
        });

      } catch (err) {
        console.error(`  ✗ Error fetching videos for "${brand}":`, err.message);
        brandVideos[brand] = {
          error: err.message,
          videos: []
        };
      }
    }

    console.log(`[Search Videos Controller] Results:`, results);

    res.status(200).json({
      status: 'success',
      timestamp: new Date().toISOString(),
      brands: results,
      videos: brandVideos
    });

  } catch (error) {
    console.error('[Search Videos Controller] Error:', error);
    next(error);
  }
};

/**
 * POST /api/report/download
 * Accepts: { report: ComparativeReport }
 * Streams PPTX blob back as an attachment
 */
export const downloadReportPPTX = async (req, res, next) => {
  try {
    const { report } = req.body;

    if (!report || !report.mainCompany) {
      return res.status(400).json({
        status: 'error',
        message: 'Valid report object is required in the body to compile PowerPoint.'
      });
    }

    console.log(`[Report Controller] Compiling PPTX presentation for "${report.mainCompany}"...`);
    const pptxBuffer = await pptGenerator.generateReportPPTX(report);

    const safeFilename = `${report.mainCompany.toLowerCase().replace(/[^a-z0-9]/gi, '_')}_competitor_audit.pptx`;

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
    res.setHeader('Content-Disposition', `attachment; filename=${safeFilename}`);
    res.setHeader('Content-Length', pptxBuffer.length);
    
    res.send(pptxBuffer);

  } catch (error) {
    console.error('[Report Controller] PPTX download compilation failed:', error);
    next(error);
  }
};
