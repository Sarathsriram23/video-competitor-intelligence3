"use client";

import React from 'react';
import { Eye, ThumbsUp, MessageSquare, Calendar, Play } from 'lucide-react';
import { CompetitorAnalysis } from '../types/report';

interface VideoGridProps {
  analysis: CompetitorAnalysis[];
}

export const VideoGrid: React.FC<VideoGridProps> = ({ analysis }) => {
  const getVideoThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const getYoutubeUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatNumber = (num: number | string) => {
    const n = typeof num === 'string' ? parseInt(num) : num;
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  return (
    <div className="w-full space-y-10">
      {analysis.map((company) => (
        <div key={company.companyName} className="space-y-4">
          {/* Company Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-3 h-3 rounded-full ${company.isMainCompany ? 'bg-indigo-500' : 'bg-purple-500'}`} />
            <h3 className="text-xl font-bold text-white tracking-tight">
              {company.companyName}
              {company.isMainCompany && <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">(Your Brand)</span>}
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {company.videos.length} videos • {formatNumber(company.channelInfo.statistics.subscriberCount)} subscribers
            </span>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {company.videos.slice(0, 9).map((video) => (
              <a
                key={video.videoId}
                href={getYoutubeUrl(video.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="group glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col h-full"
              >
                {/* Video Thumbnail */}
                <div className="relative overflow-hidden bg-slate-950 aspect-video">
                  <img
                    src={getVideoThumbnail(video.videoId)}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-red-600 rounded-full p-3 transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                  {/* YouTube Badge */}
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-full">
                    YouTube
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-4 flex flex-col flex-1">
                  {/* Title */}
                  <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors mb-3">
                    {video.title}
                  </h4>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {/* Views */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-300">{formatNumber(video.viewCount)}</span>
                    </div>

                    {/* Likes */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-300">{formatNumber(video.likeCount)}</span>
                    </div>

                    {/* Comments */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span className="font-semibold text-slate-300">{formatNumber(video.commentCount)}</span>
                    </div>

                    {/* Engagement Rate */}
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <span className="font-semibold text-emerald-400">{video.engagementRate}%</span>
                      <span className="text-slate-500">engagement</span>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 border-t border-white/5 pt-3">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(video.publishedAt)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
