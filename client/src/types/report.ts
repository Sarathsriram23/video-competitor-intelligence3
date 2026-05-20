export interface ChannelStats {
  id: string;
  title: string;
  description: string;
  customUrl: string;
  publishedAt: string;
  thumbnails: {
    default: { url: string };
    medium?: { url: string };
    high?: { url: string };
  };
  statistics: {
    viewCount: string;
    subscriberCount: string;
    videoCount: string;
  };
}

export interface VideoItem {
  id: string;
  title: string;
  publishedAt: string;
  duration: string;
  durationSec?: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  engagementRate: number;
  category: string;
}

export interface CompetitorAnalysis {
  companyName: string;
  isMainCompany: boolean;
  channelInfo: ChannelStats;
  videos: VideoItem[];
  metrics: {
    avgViews: number;
    avgLikes: number;
    avgComments: number;
    engagementRate: number;
    uploadConsistencyScore: number;
    videosPerMonth: number;
    daysSinceLastUpload: number;
    topTopics: string[];
    formatDistribution: {
      [key: string]: number;
    };
  };
}

export interface ComparativeReport {
  id: string;
  createdAt: string;
  companies: string[];
  mainCompany: string;
  analysis: CompetitorAnalysis[];
  executiveSummary: {
    leader: string;
    biggestOpportunity: string;
    weakestArea: string;
    narrative: string;
  };
  gapAnalysis: {
    untappedTopics: string[];
    underutilizedFormats: string[];
    recommendations: {
      title: string;
      desc: string;
      impact: string;
    }[];
  };
  leaderboard: {
    companyName: string;
    isMainCompany: boolean;
    score: number;
    rank: number;
    subScore: number;
    viewScore: number;
    engScore: number;
    constScore: number;
    diversityScore: number;
  }[];
}
