import pptxgen from 'pptxgenjs';

/**
 * Helper to parse a clean, readable date
 */
const formatDate = (isoString) => {
  if (!isoString) return new Date().toLocaleDateString();
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Helper to format large numbers (e.g. 1,234,567 -> 1.2M)
 */
const formatNumberCompact = (num) => {
  const parsed = parseInt(num, 10);
  if (isNaN(parsed)) return '0';
  if (parsed >= 1000000) return `${(parsed / 1000000).toFixed(1)}M`;
  if (parsed >= 1000) return `${(parsed / 1000).toFixed(1)}K`;
  return parsed.toString();
};

/**
 * Helper to safely truncate strings to avoid slide text overflows
 */
const truncateString = (str, maxLength = 60) => {
  if (!str) return 'N/A';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

export const generateReportPPTX = async (reportData) => {
  const ppt = new pptxgen();
  
  // Define standard widescreen layout (13.33 x 7.5 inches) to eliminate all canvas margins and overlaps
  ppt.defineLayout({ name: 'WIDE_16x9', width: 13.33, height: 7.5 });
  ppt.layout = 'WIDE_16x9';

  // Defensive Fallbacks for incoming payload
  const mainCompany = reportData.mainCompany || "Client";
  const rawAnalysis = reportData.analysis || [];
  const leaderboard = reportData.leaderboard || [];
  const gapAnalysis = reportData.gapAnalysis || { untappedTopics: [], underutilizedFormats: [], recommendations: [] };
  const executiveSummary = reportData.executiveSummary || { leader: "N/A", biggestOpportunity: "N/A", weakestArea: "N/A", narrative: "" };

  const mainCoAnalysis = rawAnalysis.find(a => a.isMainCompany) || { companyName: mainCompany, metrics: {}, channelInfo: { statistics: {} }, videos: [] };
  const competitors = rawAnalysis.filter(a => !a.isMainCompany);
  const reportDate = formatDate(reportData.createdAt);

  // Consolidated Analysis list ensuring safe fields
  const analysis = rawAnalysis.map(a => ({
    ...a,
    channelInfo: a.channelInfo || { title: a.companyName, statistics: { subscriberCount: '0', videoCount: '0', viewCount: '0' } },
    videos: a.videos || [],
    metrics: a.metrics || {
      avgViews: 0,
      avgLikes: 0,
      avgComments: 0,
      engagementRate: 0,
      uploadConsistencyScore: 0,
      videosPerMonth: 0,
      daysSinceLastUpload: 0,
      topTopics: [],
      formatDistribution: {}
    }
  }));

  // Brand Colors (SaaS Modern Tech Theme - White Labeled & Highly Professional)
  const COLORS = {
    darkBg: '0F172A',      // Slate 900
    lightBg: 'F8FAFC',     // Slate 50
    primary: '4F46E5',     // Indigo 600
    primaryLight: '818CF8',// Indigo 400
    accent: '9333EA',      // Purple 600
    accentLight: 'C084FC',  // Purple 400
    textDark: '0F172A',    // Slate 900
    textLight: 'F8FAFC',   // Slate 50
    textMutedDark: '475569',// Slate 600
    textMutedLight: '94A3B8',// Slate 400
    white: 'FFFFFF',
    border: 'E2E8F0',
    cardBg: 'FFFFFF',
    highlight: 'E0E7FF'    // Indigo 50
  };

  // ==========================================
  // SLIDE 1: COVER SLIDE (Professional Cover)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.darkBg };

    // Accent left bars
    slide.addShape(ppt.ShapeType.rect, { 
      x: 0, y: 0, w: 0.3, h: 7.5, fill: { color: COLORS.primary } 
    });
    slide.addShape(ppt.ShapeType.rect, { 
      x: 0.3, y: 0, w: 0.15, h: 7.5, fill: { color: COLORS.accent } 
    });

    // Sub-header category
    slide.addText('VIDEO MARKETING INTELLIGENCE & COMPETITOR AUDIT', {
      x: 1.0, y: 1.8, w: 10.0, h: 0.4,
      fontSize: 14, bold: true, color: COLORS.primaryLight, fontFace: 'Trebuchet MS'
    });

    // Primary Title
    slide.addText('Competitor Strategy & Content Audit', {
      x: 1.0, y: 2.2, w: 11.0, h: 1.5,
      fontSize: 38, bold: true, color: COLORS.textLight, fontFace: 'Trebuchet MS',
      lineSpacing: 45
    });

    // Horizontal Rule
    slide.addShape(ppt.ShapeType.rect, { 
      x: 1.0, y: 3.8, w: 4.5, h: 0.04, fill: { color: COLORS.primaryLight } 
    });

    // Companies Analyzed
    const companyList = [mainCompany.toUpperCase(), ...competitors.map(c => c.companyName.toUpperCase())].join('  |  ');
    slide.addText(`BENCHMARK GROUPS: ${companyList}`, {
      x: 1.0, y: 4.1, w: 11.0, h: 0.4,
      fontSize: 11, bold: true, color: COLORS.textMutedLight, fontFace: 'Arial'
    });

    // White-labeled Professional Footer Info
    slide.addText(`DATE: ${reportDate}\nPREPARED FOR: ${mainCompany.toUpperCase()} EXECUTIVE LEADERSHIP\nCOMPILED BY: MARKETING STRATEGY & OPERATIONS TEAM`, {
      x: 1.0, y: 5.3, w: 8.0, h: 1.0,
      fontSize: 10, color: COLORS.textMutedLight, fontFace: 'Arial', lineSpacing: 16
    });
  }

  // ==========================================
  // SLIDE 2: EXECUTIVE SUMMARY (Strategic Overview)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.darkBg };

    // Slide Header
    slide.addText('EXECUTIVE SUMMARY', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textLight, fontFace: 'Trebuchet MS'
    });
    slide.addText('Competitive landscape and key video marketing opportunities', {
      x: 0.8, y: 0.9, w: 11.0, h: 0.3,
      fontSize: 12, color: COLORS.primaryLight, fontFace: 'Arial'
    });

    // Left Column: Key Highlights Cards
    // Card 1: Leader
    slide.addShape(ppt.ShapeType.rect, { 
      x: 0.8, y: 1.5, w: 4.8, h: 1.5, fill: { color: '1E293B' }, line: { color: COLORS.primary, width: 1 } 
    });
    slide.addText('BENCHMARK LEADER', {
      x: 1.0, y: 1.65, w: 4.4, h: 0.25,
      fontSize: 9, bold: true, color: COLORS.primaryLight, fontFace: 'Arial'
    });
    slide.addText(truncateString(executiveSummary.leader, 30), {
      x: 1.0, y: 1.95, w: 4.4, h: 0.6,
      fontSize: 22, bold: true, color: COLORS.textLight, fontFace: 'Trebuchet MS'
    });

    // Card 2: Strategic Opportunity
    slide.addShape(ppt.ShapeType.rect, { 
      x: 0.8, y: 3.2, w: 4.8, h: 1.5, fill: { color: '1E293B' }, line: { color: COLORS.accent, width: 1 } 
    });
    slide.addText('BIGGEST GROWTH OPPORTUNITY', {
      x: 1.0, y: 3.35, w: 4.4, h: 0.25,
      fontSize: 9, bold: true, color: COLORS.accentLight, fontFace: 'Arial'
    });
    slide.addText(truncateString(executiveSummary.biggestOpportunity, 35), {
      x: 1.0, y: 3.65, w: 4.4, h: 0.6,
      fontSize: 18, bold: true, color: COLORS.textLight, fontFace: 'Trebuchet MS'
    });

    // Card 3: Vulnerability
    slide.addShape(ppt.ShapeType.rect, { 
      x: 0.8, y: 4.9, w: 4.8, h: 1.5, fill: { color: '1E293B' }, line: { color: 'EF4444', width: 1 } 
    });
    slide.addText('PRIMARY CHANNEL VULNERABILITY', {
      x: 1.0, y: 5.05, w: 4.4, h: 0.25,
      fontSize: 9, bold: true, color: 'F87171', fontFace: 'Arial'
    });
    slide.addText(truncateString(executiveSummary.weakestArea, 35), {
      x: 1.0, y: 5.35, w: 4.4, h: 0.6,
      fontSize: 18, bold: true, color: COLORS.textLight, fontFace: 'Trebuchet MS'
    });

    // Right Column: Narrative Panel
    slide.addShape(ppt.ShapeType.rect, { 
      x: 6.0, y: 1.5, w: 6.5, h: 4.9, fill: { color: '1E293B' } 
    });
    slide.addText('STRATEGIC SITUATION REPORT', {
      x: 6.3, y: 1.75, w: 5.9, h: 0.3,
      fontSize: 12, bold: true, color: COLORS.primaryLight, fontFace: 'Arial'
    });
    slide.addText(executiveSummary.narrative || "No narrative compiled.", {
      x: 6.3, y: 2.15, w: 5.9, h: 4.0,
      fontSize: 12.5, color: COLORS.textMutedLight, fontFace: 'Arial', lineSpacing: 20
    });
  }

  // ==========================================
  // SLIDE 3: CHANNEL OVERVIEW (Light Theme + Native Chart)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.lightBg };

    // Slide Header
    slide.addText('CHANNEL OVERVIEW & AUDIENCE REACH', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Trebuchet MS'
    });

    // Subscriber Comparison Native Bar Chart
    const chartLabels = analysis.map(a => a.companyName);
    const chartValues = analysis.map(a => parseInt(a.channelInfo.statistics?.subscriberCount || '0', 10));

    const chartData = [
      {
        name: 'Subscribers',
        labels: chartLabels,
        values: chartValues
      }
    ];

    slide.addChart(ppt.ChartType.bar, chartData, {
      x: 0.8, y: 1.3, w: 5.6, h: 5.0,
      showLegend: false,
      title: 'YouTube Subscriber Count Comparison',
      showTitle: true,
      chartColors: [COLORS.primary, COLORS.accent, '3B82F6', '10B981', 'F59E0B'],
      valAxisLabelFontSize: 9,
      catAxisLabelFontSize: 10
    });

    // Right Column: High-level channel metrics table
    const tableHeader = [
      { text: 'Company', options: { bold: true, fill: COLORS.primary, color: COLORS.white } },
      { text: 'Subscribers', options: { bold: true, fill: COLORS.primary, color: COLORS.white } },
      { text: 'Total Uploads', options: { bold: true, fill: COLORS.primary, color: COLORS.white } },
      { text: 'Total Views', options: { bold: true, fill: COLORS.primary, color: COLORS.white } }
    ];

    const tableRows = [
      tableHeader,
      ...analysis.map((a, idx) => {
        const isClient = a.isMainCompany;
        const rowBg = isClient ? COLORS.highlight : (idx % 2 === 0 ? COLORS.white : 'F8FAFC');
        return [
          { text: a.companyName + (isClient ? ' (You)' : ''), options: { fill: rowBg, bold: isClient } },
          { text: formatNumberCompact(a.channelInfo.statistics?.subscriberCount || 0), options: { fill: rowBg, bold: isClient } },
          { text: formatNumberCompact(a.channelInfo.statistics?.videoCount || 0), options: { fill: rowBg, bold: isClient } },
          { text: formatNumberCompact(a.channelInfo.statistics?.viewCount || 0), options: { fill: rowBg, bold: isClient } }
        ];
      })
    ];

    slide.addTable(tableRows, {
      x: 6.9, y: 1.3, w: 5.6, h: 5.0,
      fontSize: 10,
      border: { pt: 1, color: COLORS.border }
    });
  }

  // ==========================================
  // SLIDE 4: UPLOAD FREQUENCY & CONSISTENCY (Light Theme)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.lightBg };

    slide.addText('PUBLISHING FREQUENCY & CADENCE', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Trebuchet MS'
    });

    // Native Bar Chart comparing upload consistency scores
    const labels = analysis.map(a => a.companyName);
    const values = analysis.map(a => a.metrics?.uploadConsistencyScore || 0);

    const chartData = [
      {
        name: 'Consistency Score (0-100)',
        labels,
        values
      }
    ];

    slide.addChart(ppt.ChartType.bar, chartData, {
      x: 0.8, y: 1.3, w: 5.6, h: 5.0,
      showLegend: false,
      title: 'Posting Consistency Index (0-100)',
      showTitle: true,
      chartColors: [COLORS.accent, COLORS.primary, '3B82F6', '10B981', 'F59E0B'],
      valAxisMaxVal: 100,
      valAxisLabelFontSize: 9,
      catAxisLabelFontSize: 10,
      barDir: 'col'
    });

    // Right Column: Cadence Insights Panel
    slide.addShape(ppt.ShapeType.rect, { 
      x: 6.9, y: 1.3, w: 5.6, h: 5.0, fill: COLORS.white, line: { color: COLORS.border, width: 1 } 
    });
    
    slide.addText('CADENCE & UPLOAD ACTIVITY METRICS', {
      x: 7.2, y: 1.6, w: 5.0, h: 0.3,
      fontSize: 11, bold: true, color: COLORS.primary, fontFace: 'Arial'
    });

    // CONSOLIDATED BULLET POINTS TEXTBOX TO PREVENT ABSOLUTE OVERLAP BUGS
    const bulletLines = analysis.map(a => {
      const activeText = (a.metrics?.daysSinceLastUpload || 0) <= 14 ? 'Active' : 'Lapsed / Slow';
      return `• ${a.companyName}: Averaging ${a.metrics?.videosPerMonth || 0} videos/month. Last post was ${a.metrics?.daysSinceLastUpload || 0} days ago. Status: [${activeText}]`;
    }).join('\n\n');

    slide.addText(bulletLines, {
      x: 7.2, y: 2.1, w: 5.0, h: 3.8,
      fontSize: 10.5,
      color: COLORS.textMutedDark,
      fontFace: 'Arial',
      lineSpacing: 18
    });
  }

  // ==========================================
  // SLIDE 5: ENGAGEMENT ANALYSIS (Light Theme)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.lightBg };

    slide.addText('AUDIENCE ENGAGEMENT RATES', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Trebuchet MS'
    });

    // Column chart: Engagement Rate
    const labels = analysis.map(a => a.companyName);
    const values = analysis.map(a => a.metrics?.engagementRate || 0);

    const chartData = [
      {
        name: 'Engagement Rate (%)',
        labels,
        values
      }
    ];

    slide.addChart(ppt.ChartType.bar, chartData, {
      x: 0.8, y: 1.3, w: 5.6, h: 5.0,
      showLegend: false,
      title: 'Average Engagement Rate (%) on Recent Videos',
      showTitle: true,
      chartColors: [COLORS.primary, COLORS.accent, '3B82F6', '10B981', 'F59E0B'],
      valAxisLabelFontSize: 9,
      catAxisLabelFontSize: 10,
      barDir: 'col'
    });

    // Right side: Narrative & Averages
    slide.addShape(ppt.ShapeType.rect, { 
      x: 6.9, y: 1.3, w: 5.6, h: 5.0, fill: COLORS.white, line: { color: COLORS.border, width: 1 } 
    });

    slide.addText('ENGAGEMENT RATIO INSIGHTS', {
      x: 7.2, y: 1.6, w: 5.0, h: 0.3,
      fontSize: 11, bold: true, color: COLORS.accent, fontFace: 'Arial'
    });

    // CONSOLIDATED ENGAGEMENT TEXT TO AVOID ABSOLUTE POSITION LOOP CRASHES
    const engagementLines = analysis.map(a => {
      return `• ${a.companyName}: Engagement rate is ${(a.metrics?.engagementRate || 0).toFixed(2)}%. Garners average views of ${formatNumberCompact(a.metrics?.avgViews || 0)} and ${formatNumberCompact(a.metrics?.avgLikes || 0)} likes per video.`;
    }).join('\n\n');

    slide.addText(engagementLines, {
      x: 7.2, y: 2.1, w: 5.0, h: 3.8,
      fontSize: 10.5,
      color: COLORS.textMutedDark,
      fontFace: 'Arial',
      lineSpacing: 16
    });
  }

  // ==========================================
  // SLIDE 6: TOP PERFORMING VIDEOS (Safe and Compact Table)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.lightBg };

    slide.addText('TOP PERFORMING RECENT VIDEOS', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Trebuchet MS'
    });

    // Build top performing videos list with defensive structures
    const topVideos = analysis.map(a => {
      const sorted = [...a.videos].sort((x, y) => (y.viewCount || 0) - (x.viewCount || 0));
      return {
        company: a.companyName,
        isMain: a.isMainCompany,
        video: sorted[0] || { title: 'No recent uploads indexed.', viewCount: 0, category: 'N/A', engagementRate: 0 }
      };
    });

    const tableHeader = [
      { text: 'Brand', options: { bold: true, fill: COLORS.primary, color: COLORS.white } },
      { text: 'Highest-Performing Video Title', options: { bold: true, fill: COLORS.primary, color: COLORS.white } },
      { text: 'Views', options: { bold: true, fill: COLORS.primary, color: COLORS.white } },
      { text: 'Engagement %', options: { bold: true, fill: COLORS.primary, color: COLORS.white } },
      { text: 'Content Category', options: { bold: true, fill: COLORS.primary, color: COLORS.white } }
    ];

    const tableRows = [
      tableHeader,
      ...topVideos.map((item, idx) => {
        const isClient = item.isMain;
        const rowBg = isClient ? COLORS.highlight : (idx % 2 === 0 ? COLORS.white : 'F8FAFC');
        return [
          { text: item.company + (isClient ? ' (You)' : ''), options: { fill: rowBg, bold: isClient } },
          // TRUNCATE TITLE TO MAX 55 CHARACTERS TO PREVENT VERTICAL TABLE EXPLOSIONS
          { text: truncateString(item.video.title, 55), options: { fill: rowBg, bold: isClient } },
          { text: formatNumberCompact(item.video.viewCount || 0), options: { fill: rowBg, bold: isClient } },
          { text: (item.video.engagementRate || 0).toFixed(2) + '%', options: { fill: rowBg, bold: isClient } },
          { text: item.video.category || 'N/A', options: { fill: rowBg, bold: isClient } }
        ];
      })
    ];

    slide.addTable(tableRows, {
      x: 0.8, y: 1.3, w: 11.7, h: 5.0,
      fontSize: 9.5,
      border: { pt: 1, color: COLORS.border }
    });
  }

  // ==========================================
  // SLIDE 7: CONTENT THEMES & TOPICS (Safe Badge Placements)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.lightBg };

    slide.addText('CONTENT THEMES & FOCUS TOPICS', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Trebuchet MS'
    });
    slide.addText('Keywords and semantic focus areas extracted from video titles', {
      x: 0.8, y: 0.9, w: 11.0, h: 0.3,
      fontSize: 12, color: COLORS.primary, fontFace: 'Arial'
    });

    const numCompanies = analysis.length;
    const totalWidth = 11.7;
    const gap = 0.25;
    // Calculate mathematically perfect widths for cards
    const cardWidth = (totalWidth - (numCompanies - 1) * gap) / numCompanies;

    analysis.forEach((a, idx) => {
      const cardX = 0.8 + idx * (cardWidth + gap);
      const isClient = a.isMainCompany;
      
      // Card Frame
      slide.addShape(ppt.ShapeType.rect, {
        x: cardX, y: 1.5, w: cardWidth, h: 4.8,
        fill: COLORS.white,
        line: { color: isClient ? COLORS.primary : COLORS.border, width: isClient ? 2 : 1 }
      });

      // Card Header
      slide.addShape(ppt.ShapeType.rect, {
        x: cardX, y: 1.5, w: cardWidth, h: 0.6,
        fill: isClient ? COLORS.primary : 'E2E8F0'
      });
      slide.addText(truncateString(a.companyName, 12) + (isClient ? ' (You)' : ''), {
        x: cardX, y: 1.5, w: cardWidth, h: 0.6,
        fontSize: 11, bold: true, color: isClient ? COLORS.white : COLORS.textDark,
        align: 'center', fontFace: 'Trebuchet MS'
      });

      // List Top Topics - SAFE LIMIT TO 5 TOPICS MAX
      let wordY = 2.3;
      const topicsList = (a.metrics?.topTopics || []).slice(0, 5);
      
      topicsList.forEach((topic) => {
        // Tag badge (smaller height & spacing to fit safely)
        slide.addShape(ppt.ShapeType.roundRect, {
          x: cardX + 0.15, y: wordY, w: cardWidth - 0.3, h: 0.38,
          fill: COLORS.highlight,
          line: { color: COLORS.primaryLight, width: 1 }
        });
        slide.addText(truncateString(topic, 20), {
          x: cardX + 0.15, y: wordY, w: cardWidth - 0.3, h: 0.38,
          fontSize: 9.5, bold: true, color: COLORS.primary,
          align: 'center', fontFace: 'Arial'
        });
        wordY += 0.50; // tight spacing
      });
    });
  }

  // ==========================================
  // SLIDE 8: VIDEO FORMAT ANALYSIS (Light Theme)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.lightBg };

    slide.addText('CONTENT FORMAT DISTRIBUTION', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Trebuchet MS'
    });

    const formats = ['Shorts', 'Tutorial', 'Webinar', 'Podcast', 'Product Demo', 'Customer Story', 'Promo/Explainer'];
    const tableHeader = [
      { text: 'Company', options: { bold: true, fill: COLORS.primary, color: COLORS.white } },
      ...formats.map(f => ({ text: f, options: { bold: true, fill: COLORS.primary, color: COLORS.white } }))
    ];

    const tableRows = [
      tableHeader,
      ...analysis.map((a, idx) => {
        const isClient = a.isMainCompany;
        const rowBg = isClient ? COLORS.highlight : (idx % 2 === 0 ? COLORS.white : 'F8FAFC');
        return [
          { text: a.companyName + (isClient ? ' (You)' : ''), options: { fill: rowBg, bold: isClient } },
          ...formats.map(f => ({
            text: `${a.metrics?.formatDistribution?.[f] || 0}%`,
            options: { fill: rowBg, bold: isClient, align: 'center' }
          }))
        ];
      })
    ];

    slide.addTable(tableRows, {
      x: 0.8, y: 1.3, w: 11.7, h: 3.5,
      fontSize: 9.5,
      border: { pt: 1, color: COLORS.border }
    });

    // Narrative Insight below
    slide.addShape(ppt.ShapeType.rect, { 
      x: 0.8, y: 5.1, w: 11.7, h: 1.2, fill: 'E2E8F0' 
    });
    
    // Find format insights
    const mainShortsPct = mainCoAnalysis.metrics?.formatDistribution?.['Shorts'] || 0;
    const avgCompetitorsShorts = competitors.length > 0 
      ? competitors.reduce((acc, c) => acc + (c.metrics?.formatDistribution?.['Shorts'] || 0), 0) / competitors.length
      : 0;
    
    let formatInsight = '';
    if (mainShortsPct < avgCompetitorsShorts) {
      formatInsight = `FORMAT RATIO ANALYSIS: Competitors expand their reach with YouTube Shorts (averaging ${Math.round(avgCompetitorsShorts)}% of catalogs) to capture high-velocity organic lead streams. Your channel maintains a minor ${mainShortsPct}% Shorts ratio. A prompt expansion in short-form content is highly recommended to fill this competitive gap.`;
    } else {
      formatInsight = `FORMAT RATIO ANALYSIS: Your format matrix shows a strong ${mainCoAnalysis.metrics?.formatDistribution?.['Tutorial'] || 0}% focus on deep Tutorials and Demos. This locks in premium mid-funnel conversion queries. Maintain this education structure while slowly incorporating top-of-funnel Short clips.`;
    }

    slide.addText(formatInsight, {
      x: 1.1, y: 5.2, w: 11.1, h: 1.0,
      fontSize: 11, bold: true, color: COLORS.textDark, fontFace: 'Arial', lineSpacing: 14
    });
  }

  // ==========================================
  // SLIDE 9: COMPETITOR GAP ANALYSIS (Safe Slice Limits)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.lightBg };

    slide.addText('COMPETITOR GAP ANALYSIS & BLIND SPOTS', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Trebuchet MS'
    });

    // Panel 1: Untapped Topics
    slide.addShape(ppt.ShapeType.rect, { 
      x: 0.8, y: 1.3, w: 5.5, h: 5.0, fill: COLORS.white, line: { color: COLORS.border, width: 1 } 
    });
    slide.addText('UNTAPPED CONTENT THEMES', {
      x: 1.1, y: 1.6, w: 4.9, h: 0.3,
      fontSize: 13, bold: true, color: COLORS.primary, fontFace: 'Arial'
    });
    slide.addText('Themes heavily targeted by competitors but neglected in your recent uploads. These represent immediate keyword hijacks.', {
      x: 1.1, y: 1.9, w: 4.9, h: 0.6,
      fontSize: 10, color: COLORS.textMutedDark, fontFace: 'Arial', lineSpacing: 12
    });

    // SLICE TO SAFE LIMIT OF 3 TOPICS MAX TO ENSURE ZERO BOTTOM CARD OVERFLOW
    let gapTopicY = 2.6;
    const untappedTopicsList = (gapAnalysis.untappedTopics || []).slice(0, 3);
    
    untappedTopicsList.forEach(topic => {
      slide.addShape(ppt.ShapeType.roundRect, {
        x: 1.1, y: gapTopicY, w: 4.9, h: 0.6, fill: COLORS.highlight, line: { color: COLORS.primaryLight, width: 1 }
      });
      slide.addText(`Target keyword sector: "${truncateString(topic, 30)}"`, {
        x: 1.3, y: gapTopicY + 0.1, w: 4.5, h: 0.4,
        fontSize: 11, bold: true, color: COLORS.primary, fontFace: 'Arial'
      });
      gapTopicY += 0.75;
    });

    // Panel 2: Underutilized Formats
    slide.addShape(ppt.ShapeType.rect, { 
      x: 7.0, y: 1.3, w: 5.5, h: 5.0, fill: COLORS.white, line: { color: COLORS.border, width: 1 } 
    });
    slide.addText('UNDERUTILIZED CONTENT FORMATS', {
      x: 7.3, y: 1.6, w: 4.9, h: 0.3,
      fontSize: 13, bold: true, color: COLORS.accent, fontFace: 'Arial'
    });
    slide.addText('Format distribution categories where competitors capture audience volume but your channel lacks coverage.', {
      x: 7.3, y: 1.9, w: 4.9, h: 0.6,
      fontSize: 10, color: COLORS.textMutedDark, fontFace: 'Arial', lineSpacing: 12
    });

    // SLICE TO SAFE LIMIT OF 3 FORMATS MAX
    let gapFormatY = 2.6;
    const underutilizedFormatsList = (gapAnalysis.underutilizedFormats || []).slice(0, 3);

    underutilizedFormatsList.forEach(fmt => {
      slide.addShape(ppt.ShapeType.roundRect, {
        x: 7.3, y: gapFormatY, w: 4.9, h: 0.6, fill: 'F5F3FF', line: { color: COLORS.accentLight, width: 1 }
      });
      slide.addText(`Under-represented Format: ${fmt}`, {
        x: 7.5, y: gapFormatY + 0.1, w: 4.5, h: 0.4,
        fontSize: 11, bold: true, color: COLORS.accent, fontFace: 'Arial'
      });
      gapFormatY += 0.75;
    });
  }

  // ==========================================
  // SLIDE 10: STRATEGIC RECOMMENDATIONS (Safe Card Padding)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.lightBg };

    slide.addText('STRATEGIC VIDEO MARKETING RECOMMENDATIONS', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Trebuchet MS'
    });

    // 2x2 Grid of Recommendation Cards
    const recs = gapAnalysis.recommendations || [];
    const cardW = 5.6;
    const cardH = 2.2;
    const positions = [
      { x: 0.8, y: 1.3 },
      { x: 6.9, y: 1.3 },
      { x: 0.8, y: 3.8 },
      { x: 6.9, y: 3.8 }
    ];

    positions.forEach((pos, idx) => {
      const rec = recs[idx] || { title: 'Continuous Audit Optimization', desc: 'Consistently index and benchmark competitive keyword shares on a monthly basis to adapt to algorithmic search modifications.', impact: 'Medium' };
      
      slide.addShape(ppt.ShapeType.rect, {
        x: pos.x, y: pos.y, w: cardW, h: cardH,
        fill: COLORS.white,
        line: { color: COLORS.border, width: 1 }
      });

      // Impact badge
      const isHigh = rec.impact === 'High';
      slide.addShape(ppt.ShapeType.roundRect, {
        x: pos.x + cardW - 1.2, y: pos.y + 0.15, w: 1.0, h: 0.32,
        fill: isHigh ? 'FEE2E2' : 'E0E7FF'
      });
      slide.addText(`Impact: ${rec.impact}`, {
        x: pos.x + cardW - 1.2, y: pos.y + 0.15, w: 1.0, h: 0.32,
        fontSize: 8.5, bold: true, color: isHigh ? 'EF4444' : COLORS.primary,
        align: 'center', fontFace: 'Arial'
      });

      // Recommendation Title - font size 11 to avoid vertical height wrapping conflicts
      slide.addText(truncateString(rec.title, 40), {
        x: pos.x + 0.3, y: pos.y + 0.15, w: cardW - 1.6, h: 0.35,
        fontSize: 11.5, bold: true, color: COLORS.textDark, fontFace: 'Trebuchet MS'
      });

      // Description - generous height and 9.5 font size to fit descriptions safely
      slide.addText(rec.desc, {
        x: pos.x + 0.3, y: pos.y + 0.55, w: cardW - 0.6, h: 1.5,
        fontSize: 9.5, color: COLORS.textMutedDark, fontFace: 'Arial', lineSpacing: 13
      });
    });
  }

  // ==========================================
  // SLIDE 11: FINAL BENCHMARK RANKINGS & SCORES (Light Theme)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.lightBg };

    slide.addText('COMPETITIVE BENCHMARK & SCORES', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textDark, fontFace: 'Trebuchet MS'
    });

    // Native Bar Chart comparing final weighted leaderboard scores
    const labels = leaderboard.map(l => l.companyName);
    const values = leaderboard.map(l => l.score);

    const chartData = [
      {
        name: 'Weighted Score',
        labels,
        values
      }
    ];

    slide.addChart(ppt.ChartType.bar, chartData, {
      x: 0.8, y: 1.3, w: 5.6, h: 5.0,
      showLegend: false,
      title: 'Final Competitive Rating Score (out of 100)',
      showTitle: true,
      chartColors: [COLORS.primary, COLORS.accent, '3B82F6', '10B981', 'F59E0B'],
      valAxisMaxVal: 100,
      valAxisLabelFontSize: 9,
      catAxisLabelFontSize: 10,
      barDir: 'col'
    });

    // Right Column: Highly formatted leaderboard grid table
    const tableHeader = [
      { text: 'Rank', options: { bold: true, fill: COLORS.primary, color: COLORS.white, align: 'center' } },
      { text: 'Company', options: { bold: true, fill: COLORS.primary, color: COLORS.white } },
      { text: 'Rating Score', options: { bold: true, fill: COLORS.primary, color: COLORS.white, align: 'center' } }
    ];

    const tableRows = [
      tableHeader,
      ...leaderboard.map((item, idx) => {
        const isClient = item.isMainCompany;
        const rowBg = isClient ? COLORS.highlight : (idx % 2 === 0 ? COLORS.white : 'F8FAFC');
        return [
          { text: `#${item.rank}`, options: { fill: rowBg, bold: isClient, align: 'center' } },
          { text: item.companyName + (isClient ? ' (You)' : ''), options: { fill: rowBg, bold: isClient } },
          { text: `${item.score}/100`, options: { fill: rowBg, bold: isClient, align: 'center' } }
        ];
      })
    ];

    slide.addTable(tableRows, {
      x: 6.9, y: 1.3, w: 5.6, h: 5.0,
      fontSize: 10.5,
      border: { pt: 1, color: COLORS.border }
    });
  }

  // ==========================================
  // SLIDE 12: CONCLUSION & 90-DAY ACTION ROADMAP (Dark Theme)
  // ==========================================
  {
    const slide = ppt.addSlide();
    slide.background = { fill: COLORS.darkBg };

    slide.addText('CONCLUSION & 90-DAY ACTION ROADMAP', {
      x: 0.8, y: 0.5, w: 11.0, h: 0.4,
      fontSize: 22, bold: true, color: COLORS.textLight, fontFace: 'Trebuchet MS'
    });

    const stepW = 3.6;
    const stepH = 4.6;
    const steps = [
      {
        title: 'DAYS 1 - 30',
        subtitle: 'Foundation & Metadata Gaps',
        desc: '• Initialize keyword optimization on existing catalog description links.\n• Script and record the first 5 YouTube Shorts based on highest webinar metrics.\n• Launch tag A/B testing on call-to-action cards.'
      },
      {
        title: 'DAYS 31 - 60',
        subtitle: 'Consistency & Volume Scale',
        desc: '• Deploy a recurring weekly publishing timeline (e.g. weekly Tuesday uploads).\n• Begin targeted content series addressing the untapped topics identified in this audit.\n• Leverage YouTube community polls to lift algorithmic relevance.'
      },
      {
        title: 'DAYS 61 - 90',
        subtitle: 'Convert & Lead Redirection',
        desc: '• Review first-month Shorts click-through-rates and conversion ratios.\n• Initiate secondary competitor intelligence.\n• Expand backlink anchors to redirect high engagement to lead trials.'
      }
    ];

    steps.forEach((step, idx) => {
      const stepX = 0.8 + idx * (stepW + 0.45);
      
      // Step Card Outline
      slide.addShape(ppt.ShapeType.rect, {
        x: stepX, y: 1.4, w: stepW, h: stepH,
        fill: '1E293B',
        line: { color: COLORS.primaryLight, width: 1 }
      });

      // Banner Header
      slide.addShape(ppt.ShapeType.rect, {
        x: stepX, y: 1.4, w: stepW, h: 0.5,
        fill: COLORS.primary
      });
      slide.addText(step.title, {
        x: stepX, y: 1.4, w: stepW, h: 0.5,
        fontSize: 12, bold: true, color: COLORS.white,
        align: 'center', fontFace: 'Trebuchet MS'
      });

      // Subtitle
      slide.addText(step.subtitle, {
        x: stepX + 0.2, y: 2.1, w: stepW - 0.4, h: 0.35,
        fontSize: 12, bold: true, color: COLORS.primaryLight, fontFace: 'Trebuchet MS'
      });

      // Actions list (safe 9.0 font size with compact 12 line spacing to avoid card overflows)
      slide.addText(step.desc, {
        x: stepX + 0.2, y: 2.55, w: stepW - 0.4, h: 3.2,
        fontSize: 9, color: COLORS.textMutedLight, fontFace: 'Arial', lineSpacing: 12
      });
    });
  }

  // Compile and return as an in-memory Node buffer
  try {
    const buffer = await ppt.write('nodebuffer');
    return buffer;
  } catch (error) {
    console.error('[PPT Generator] Error during slide compilation:', error);
    throw error;
  }
};
