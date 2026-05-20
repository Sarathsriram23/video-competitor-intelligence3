/**
 * Pre-computed, hyper-realistic benchmarking data for "Demo Mode"
 * Represents HubSpot (Client) vs Salesforce, Monday.com, Zoho, Freshworks
 */

export const getDemoReport = () => {
  const createdAt = new Date().toISOString();
  
  return {
    id: "rep_demo_hubspot_001",
    createdAt,
    companies: ["HubSpot", "Salesforce", "Monday.com", "Zoho", "Freshworks"],
    mainCompany: "HubSpot",
    analysis: [
      {
        companyName: "HubSpot",
        isMainCompany: true,
        channelInfo: {
          id: "UCG58bU",
          title: "HubSpot",
          description: "HubSpot is a leading CRM platform that provides software and support to help businesses grow better.",
          customUrl: "@hubspot",
          publishedAt: "2007-06-12T00:00:00Z",
          thumbnails: {
            default: { url: "https://yt3.googleusercontent.com/ytc/AIdrodk_..." }
          },
          statistics: {
            subscriberCount: "385000",
            videoCount: "1240",
            viewCount: "45200000"
          }
        },
        videos: [
          { id: "v1", title: "ChatGPT for Beginners: AI Marketing Hacks", publishedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(), duration: "PT10M15S", viewCount: 24500, likeCount: 1250, commentCount: 145, engagementRate: 5.69, category: "Tutorial" },
          { id: "v2", title: "How to Build a High-Converting Sales Funnel", publishedAt: new Date(Date.now() - 10*24*60*60*1000).toISOString(), duration: "PT15M30S", viewCount: 18200, likeCount: 920, commentCount: 88, engagementRate: 5.54, category: "Tutorial" },
          { id: "v3", title: "7 Cold Email Templates That Actually Work", publishedAt: new Date(Date.now() - 15*24*60*60*1000).toISOString(), duration: "PT8M45S", viewCount: 31200, likeCount: 1980, commentCount: 210, engagementRate: 7.02, category: "Tutorial" },
          { id: "v4", title: "Repurposing Webinars into 30s Shorts #shorts", publishedAt: new Date(Date.now() - 20*24*60*60*1000).toISOString(), duration: "PT45S", viewCount: 42000, likeCount: 2200, commentCount: 120, engagementRate: 5.52, category: "Shorts" },
          { id: "v5", title: "HubSpot CRM Tutorial for Beginners (2026)", publishedAt: new Date(Date.now() - 28*24*60*60*1000).toISOString(), duration: "PT25M10S", viewCount: 65000, likeCount: 3400, commentCount: 450, engagementRate: 5.92, category: "Tutorial" }
        ],
        metrics: {
          avgViews: 36180,
          avgLikes: 1946,
          avgComments: 202,
          engagementRate: 5.94,
          uploadConsistencyScore: 82,
          videosPerMonth: 5.2,
          daysSinceLastUpload: 3,
          topTopics: ["CRM", "AI Marketing", "Sales Funnels", "Cold Email", "Workflows"],
          formatDistribution: { Shorts: 25, Tutorial: 45, Webinar: 15, Podcast: 0, "Product Demo": 10, "Customer Story": 0, "Promo/Explainer": 5 }
        }
      },
      {
        companyName: "Salesforce",
        isMainCompany: false,
        channelInfo: {
          id: "UCSforce",
          title: "Salesforce",
          description: "We bring companies and customers together. Salesforce is the global leader in customer relationship management.",
          customUrl: "@salesforce",
          publishedAt: "2005-03-10T00:00:00Z",
          thumbnails: {
            default: { url: "https://yt3.googleusercontent.com/ytc/AIdro..." }
          },
          statistics: {
            subscriberCount: "820000",
            videoCount: "3450",
            viewCount: "112000000"
          }
        },
        videos: [
          { id: "sf1", title: "Marc Benioff Keynote: The Future of Agentic AI", publishedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(), duration: "PT1H12M30S", viewCount: 52000, likeCount: 780, commentCount: 65, engagementRate: 1.62, category: "Webinar" },
          { id: "sf2", title: "Customer Success: How Gucci Scaled Operations", publishedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(), duration: "PT4M15S", viewCount: 12500, likeCount: 120, commentCount: 14, engagementRate: 1.07, category: "Customer Story" },
          { id: "sf3", title: "Salesforce Einstein Copilot Product Tour", publishedAt: new Date(Date.now() - 9*24*60*60*1000).toISOString(), duration: "PT6M45S", viewCount: 28400, likeCount: 390, commentCount: 42, engagementRate: 1.52, category: "Product Demo" },
          { id: "sf4", title: "What is a CRM? Explained in 2 Minutes", publishedAt: new Date(Date.now() - 12*24*60*60*1000).toISOString(), duration: "PT2M10S", viewCount: 95000, likeCount: 1100, commentCount: 82, engagementRate: 1.24, category: "Promo/Explainer" },
          { id: "sf5", title: "Salesforce Developer Podcast Ep 142: Apex Code tips", publishedAt: new Date(Date.now() - 20*24*60*60*1000).toISOString(), duration: "PT35M00S", viewCount: 8400, likeCount: 140, commentCount: 18, engagementRate: 1.88, category: "Podcast" }
        ],
        metrics: {
          avgViews: 39260,
          avgLikes: 506,
          avgComments: 44,
          engagementRate: 1.47,
          uploadConsistencyScore: 90,
          videosPerMonth: 8.4,
          daysSinceLastUpload: 1,
          topTopics: ["Agentic AI", "Einstein Copilot", "Apex Code", "Gucci Success", "CRM Intro"],
          formatDistribution: { Shorts: 15, Tutorial: 10, Webinar: 25, Podcast: 15, "Product Demo": 20, "Customer Story": 10, "Promo/Explainer": 5 }
        }
      },
      {
        companyName: "Monday.com",
        isMainCompany: false,
        channelInfo: {
          id: "UCMonday",
          title: "monday.com",
          description: "monday.com is a Work OS that powers teams to run processes, projects, and everyday work.",
          customUrl: "@mondaydotcom",
          publishedAt: "2014-02-15T00:00:00Z",
          thumbnails: {
            default: { url: "https://yt3.googleusercontent.com/ytc/AIdro..." }
          },
          statistics: {
            subscriberCount: "120000",
            videoCount: "480",
            viewCount: "28500000"
          }
        },
        videos: [
          { id: "m1", title: "Why Your Team Hates Project Management Tools", publishedAt: new Date(Date.now() - 8*24*60*60*1000).toISOString(), duration: "PT3M15S", viewCount: 110000, likeCount: 4200, commentCount: 380, engagementRate: 4.16, category: "Promo/Explainer" },
          { id: "m2", title: "Organizing Workflows as an Agency in 5 mins", publishedAt: new Date(Date.now() - 14*24*60*60*1000).toISOString(), duration: "PT5M10S", viewCount: 42000, likeCount: 1850, commentCount: 112, engagementRate: 4.67, category: "Tutorial" },
          { id: "m3", title: "POV: Trying to align marketing teams manually #shorts", publishedAt: new Date(Date.now() - 25*24*60*60*1000).toISOString(), duration: "PT35S", viewCount: 185000, likeCount: 7900, commentCount: 450, engagementRate: 4.51, category: "Shorts" },
          { id: "m4", title: "Monday Dev: Sprint Planning Walkthrough", publishedAt: new Date(Date.now() - 40*24*60*60*1000).toISOString(), duration: "PT8M45S", viewCount: 18000, likeCount: 680, commentCount: 52, engagementRate: 4.07, category: "Product Demo" }
        ],
        metrics: {
          avgViews: 88750,
          avgLikes: 3657,
          avgComments: 248,
          engagementRate: 4.35,
          uploadConsistencyScore: 55,
          videosPerMonth: 2.2,
          daysSinceLastUpload: 8,
          topTopics: ["Work OS", "Sprint Planning", "Agency Workflows", "Project Mgmt", "Manual POVs"],
          formatDistribution: { Shorts: 35, Tutorial: 30, Webinar: 0, Podcast: 0, "Product Demo": 15, "Customer Story": 0, "Promo/Explainer": 20 }
        }
      },
      {
        companyName: "Zoho",
        isMainCompany: false,
        channelInfo: {
          id: "UCZoho",
          title: "Zoho",
          description: "Zoho is the operating system for business - a single online platform with all the applications to run a business.",
          customUrl: "@zoho",
          publishedAt: "2008-04-18T00:00:00Z",
          thumbnails: {
            default: { url: "https://yt3.googleusercontent.com/ytc/AIdro..." }
          },
          statistics: {
            subscriberCount: "155000",
            videoCount: "1100",
            viewCount: "15800000"
          }
        },
        videos: [
          { id: "z1", title: "Zoho CRM Custom Customization: Tutorial for Admins", publishedAt: new Date(Date.now() - 6*24*60*60*1000).toISOString(), duration: "PT18M12S", viewCount: 8400, likeCount: 220, commentCount: 38, engagementRate: 3.07, category: "Tutorial" },
          { id: "z2", title: "How to Integrate Zoho Books with Stripe", publishedAt: new Date(Date.now() - 15*24*60*60*1000).toISOString(), duration: "PT12M45S", viewCount: 6200, likeCount: 140, commentCount: 15, engagementRate: 2.50, category: "Tutorial" },
          { id: "z3", title: "Zoho Projects: Managing Agile Boards", publishedAt: new Date(Date.now() - 25*24*60*60*1000).toISOString(), duration: "PT9M30S", viewCount: 9500, likeCount: 210, commentCount: 28, engagementRate: 2.50, category: "Product Demo" },
          { id: "z4", title: "Automating Email Workflows in Zoho Creator", publishedAt: new Date(Date.now() - 32*24*60*60*1000).toISOString(), duration: "PT15M00S", viewCount: 11200, likeCount: 280, commentCount: 34, engagementRate: 2.80, category: "Tutorial" }
        ],
        metrics: {
          avgViews: 8825,
          avgLikes: 212,
          avgComments: 28,
          engagementRate: 2.72,
          uploadConsistencyScore: 65,
          videosPerMonth: 3.1,
          daysSinceLastUpload: 6,
          topTopics: ["CRM Customization", "Stripe Integration", "Agile Boards", "Email Automation", "Workflows"],
          formatDistribution: { Shorts: 5, Tutorial: 60, Webinar: 10, Podcast: 0, "Product Demo": 20, "Customer Story": 0, "Promo/Explainer": 5 }
        }
      },
      {
        companyName: "Freshworks",
        isMainCompany: false,
        channelInfo: {
          id: "UCFresh",
          title: "Freshworks",
          description: "Freshworks makes it fast and easy for businesses to delight their customers and employees.",
          customUrl: "@freshworks",
          publishedAt: "2011-09-05T00:00:00Z",
          thumbnails: {
            default: { url: "https://yt3.googleusercontent.com/ytc/AIdro..." }
          },
          statistics: {
            subscriberCount: "420000",
            videoCount: "620",
            viewCount: "6100000"
          }
        },
        videos: [
          { id: "f1", title: "Introducing Freshservice Service Catalog", publishedAt: new Date(Date.now() - 12*24*60*60*1000).toISOString(), duration: "PT4M15S", viewCount: 3200, likeCount: 65, commentCount: 4, engagementRate: 2.15, category: "Product Demo" },
          { id: "f2", title: "Delighting Customers with Conversational AI", publishedAt: new Date(Date.now() - 19*24*60*60*1000).toISOString(), duration: "PT22M10S", viewCount: 5400, likeCount: 95, commentCount: 12, engagementRate: 1.98, category: "Webinar" },
          { id: "f3", title: "Freshdesk Admin Training Course (Complete)", publishedAt: new Date(Date.now() - 26*24*60*60*1000).toISOString(), duration: "PT45M00S", viewCount: 12400, likeCount: 220, commentCount: 32, engagementRate: 2.03, category: "Tutorial" }
        ],
        metrics: {
          avgViews: 7000,
          avgLikes: 126,
          avgComments: 16,
          engagementRate: 2.05,
          uploadConsistencyScore: 72,
          videosPerMonth: 4.1,
          daysSinceLastUpload: 12,
          topTopics: ["Service Catalog", "Conversational AI", "Freshdesk Admin", "Customer Delight", "Agile Support"],
          formatDistribution: { Shorts: 10, Tutorial: 40, Webinar: 20, Podcast: 0, "Product Demo": 20, "Customer Story": 0, "Promo/Explainer": 10 }
        }
      }
    ],
    executiveSummary: {
      leader: "HubSpot",
      biggestOpportunity: "YouTube Shorts",
      weakestArea: "Advanced search metadata tagging",
      narrative: "Your brand (HubSpot) is currently leading the competitive benchmark with a score of 79/100, driven by an exceptional average engagement rate of 5.94% and balanced content distribution (45% Tutorials, 25% Shorts). Salesforce dominates in absolute channel reach (820K subscribers) but fails to achieve strong interaction efficiency (1.47% engagement rate). monday.com represents a strategic viral threat, generating massive average views per video (88.7K) by leveraging creative product-led Shorts. Zoho is highly entrenched in organic tech queries through detailed tutorials (60% coverage). To maintain your leadership, HubSpot should capitalize on monday.com's Shorts blueprint by repurposing successful technical webinars into short-form, high-impact explainer reels."
    },
    gapAnalysis: {
      untappedTopics: ["Agentic AI", "Service Desk Automation", "Developer Tips"],
      underutilizedFormats: ["Podcast", "Customer Success Story"],
      recommendations: [
        {
          title: "Maintain Editorial Cadence & Optimize Metadata",
          desc: "Your consistency score is strong at 82/100, averaging 5.2 uploads per month. Shift focus toward advanced video metadata testing (A/B testing custom high-contrast thumbnails and keyword-rich tags) to lift organic recommendation signals.",
          impact: "Medium"
        },
        {
          title: "Repurpose Webinars into YouTube Shorts",
          desc: "monday.com is capturing massive reach via Shorts (35% of their total catalog). Repurpose your high-performing technical webinars and cold-email tutorials into 30-second snackable key takeaways to match their velocity.",
          impact: "High"
        },
        {
          title: "Convert High Engagement into CRM Registrations",
          desc: "Outstanding customer connection with a 5.94% average engagement rate! Capitalize on this by placing descriptive middle-of-funnel registration links (lead magnets, templates) in the first two lines of descriptions before the 'show more' fold.",
          impact: "High"
        },
        {
          title: "Target Untapped Theme: 'Agentic AI Workflows'",
          desc: "Salesforce is successfully indexing on search terms surrounding 'Agentic AI' which is completely missing from your recent themes. Launch a 3-part playlist series covering this sector to hijack search interest.",
          impact: "Medium"
        }
      ]
    },
    leaderboard: [
      { companyName: "HubSpot", isMainCompany: true, score: 79, rank: 1, subScore: 65, viewScore: 50, engScore: 98, constScore: 82, diversityScore: 80 },
      { companyName: "Monday.com", isMainCompany: false, score: 71, rank: 2, subScore: 55, viewScore: 78, engScore: 72, constScore: 55, diversityScore: 80 },
      { companyName: "Salesforce", isMainCompany: false, score: 68, rank: 3, subScore: 91, viewScore: 52, engScore: 24, constScore: 90, diversityScore: 90 },
      { companyName: "Zoho", isMainCompany: false, score: 58, rank: 4, subScore: 60, viewScore: 32, engScore: 45, constScore: 65, diversityScore: 70 },
      { companyName: "Freshworks", isMainCompany: false, score: 52, rank: 5, subScore: 40, viewScore: 28, engScore: 34, constScore: 72, diversityScore: 70 }
    ]
  };
};
