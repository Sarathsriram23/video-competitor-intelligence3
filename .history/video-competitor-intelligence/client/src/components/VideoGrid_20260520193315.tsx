"use client";

import React from 'react';
import { Eye, ThumbsUp, MessageSquare, Calendar, Play } from 'lucide-react';
import { CompetitorAnalysis } from '../types/report';

interface VideoGridProps {
  analysis: CompetitorAnalysis[];
}

export const VideoGrid: React.FC<VideoGridProps> = ({ analysis }) => {
  const generateVideoThumbnail = (videoId: string, title: string, companyName: string) => {
    // For real YouTube video IDs (longer, alphanumeric), use YouTube service
    if (videoId && videoId.length > 3 && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
    
    // For demo IDs, create a colorful gradient thumbnail with text
    const colors = {
      'HubSpot': ['from-orange-500', 'to-red-600'],
      'Salesforce': ['from-blue-600', 'to-cyan-500'],
      'Monday.com': ['from-purple-600', 'to-pink-500'],
      'Zoho': ['from-indigo-600', 'to-purple-500'],
      'Freshworks': ['from-emerald-600', 'to-teal-500'],
      'AUDI': ['from-red-600', 'to-orange-500'],
      'BMW': ['from-blue-700', 'to-cyan-600'],
      'Mercedes': ['from-amber-600', 'to-yellow-500'],
    };
    const colorPair = colors[companyName] || ['from-slate-600', 'to-slate-700'];
    
    // Return a data URI with the company's color scheme
    const titleShort = title.substring(0, 30);
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23${companyName === 'HubSpot' ? 'ea580c' : companyName === 'Salesforce' ? '1e40af' : companyName === 'Monday.com' ? '9333ea' : companyName === 'Zoho' ? '4f46e5' : companyName === 'Freshworks' ? '059669' : companyName === 'AUDI' ? 'dc2626' : companyName === 'BMW' ? '1e3a8a' : companyName === 'Mercedes' ? 'b45309' : '475569'};stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23${companyName === 'HubSpot' ? 'dc2626' : companyName === 'Salesforce' ? '06b6d4' : companyName === 'Monday.com' ? 'ec4899' : companyName === 'Zoho' ? 'a855f7' : companyName === 'Freshworks' ? '14b8a6' : companyName === 'AUDI' ? 'ea580c' : companyName === 'BMW' ? '0891b2' : companyName === 'Mercedes' ? 'eab308' : '64748b'};stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='320' height='180' fill='url(%23grad)'/%3E%3Ctext x='160' y='60' font-size='18' font-weight='bold' fill='white' text-anchor='middle' font-family='Arial' dominant-baseline='middle'%3E${companyName}%3C/text%3E%3Ctext x='160' y='120' font-size='12' fill='rgba(255,255,255,0.8)' text-anchor='middle' font-family='Arial' dominant-baseline='middle' word-spacing='2'%3E${encodeURIComponent(titleShort)}%3C/text%3E%3C/svg%3E`;
  };

  const getYoutubeUrl = (videoId: string) => {
    // For real YouTube video IDs
    if (videoId && videoId.length > 3 && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
    // For demo videos, link to YouTube search
    return 'https://www.youtube.com';
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
    <div className="w-full space-y-8">
      {analysis.map((company, companyIdx) => (
        <div key={`${company.companyName}-${companyIdx}`} className="space-y-4">
          {/* Company Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-3 h-3 rounded-full ${company.isMainCompany ? 'bg-indigo-500' : 'bg-purple-500'}`} />
            <h3 className="text-lg font-bold text-white tracking-tight">
              {company.companyName}
              {company.isMainCompany && <span className="ml-2 text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">Your Brand</span>}
            </h3>
          </div>

          {/* Videos Grid - Only 2 Videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {company.videos.slice(0, 2).map((video, vidIdx) => {
              const uniqueKey = `${company.companyName}-${vidIdx}-${video.videoId || video.id}`;
              
              return (
                <a
                  key={uniqueKey}
                  href={getYoutubeUrl(video.videoId || video.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group glass-panel rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col h-full"
                >
                  {/* Video Thumbnail */}
                  <div className="relative overflow-hidden bg-slate-950 aspect-video">
                    <img
                      src={generateVideoThumbnail(video.videoId || video.id, video.title, company.companyName)}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="bg-red-600 rounded-full p-3 transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                    {/* YouTube Badge */}
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] font-bold px-2 py-1 rounded-full">
                      YouTube
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-3 flex flex-col flex-1">
                    {/* Title */}
                    <h4 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-indigo-300 transition-colors mb-2">
                      {video.title}
                    </h4>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-2 text-[10px]">
                      {/* Views */}
                      <div className="flex items-center gap-1 text-slate-400">
                        <Eye className="w-3 h-3 text-slate-500" />
                        <span className="font-semibold text-slate-300">{formatNumber(video.viewCount)}</span>
                      </div>

                      {/* Likes */}
                      <div className="flex items-center gap-1 text-slate-400">
                        <ThumbsUp className="w-3 h-3 text-slate-500" />
                        <span className="font-semibold text-slate-300">{formatNumber(video.likeCount)}</span>
                      </div>

                      {/* Comments */}
                      <div className="flex items-center gap-1 text-slate-400">
                        <MessageSquare className="w-3 h-3 text-slate-500" />
                        <span className="font-semibold text-slate-300">{formatNumber(video.commentCount)}</span>
                      </div>

                      {/* Engagement Rate */}
                      <div className="flex items-center gap-1 text-slate-400">
                        <span className="font-semibold text-emerald-400">{typeof video.engagementRate === 'string' ? video.engagementRate : video.engagementRate?.toFixed(2) || '0'}%</span>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 border-t border-white/5 pt-2 mt-auto">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(video.publishedAt)}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
