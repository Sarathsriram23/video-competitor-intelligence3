import { google } from 'googleapis';
import { config } from '../../config/env.js';

const getYoutubeClient = (customApiKey) => {
  const apiKey = customApiKey || config.youtubeApiKey;
  if (!apiKey) {
    console.warn('[YouTube Service] No YouTube API Key configured.');
    return null;
  }
  
  try {
    return google.youtube({
      version: 'v3',
      auth: apiKey
    });
  } catch (error) {
    console.error('[YouTube Service] Error initializing YouTube API client:', error);
    return null;
  }
};

/**
 * Search for a channel ID by query
 */
export const searchChannel = async (query, apiKey) => {
  const youtube = getYoutubeClient(apiKey);
  if (!youtube) {
    throw new Error('API_KEY_MISSING');
  }

  try {
    console.log(`[YouTube Service] Searching for channel: "${query}"`);
    const response = await youtube.search.list({
      part: ['snippet'],
      q: `${query} official channel`,
      type: ['channel'],
      maxResults: 1
    });

    const items = response.data.items || [];
    if (items.length === 0) {
      // Fallback: search for just channel type without suffix
      const fallbackResponse = await youtube.search.list({
        part: ['snippet'],
        q: query,
        type: ['channel'],
        maxResults: 1
      });
      const fallbackItems = fallbackResponse.data.items || [];
      if (fallbackItems.length === 0) {
        throw new Error(`No YouTube channel found for query: "${query}"`);
      }
      return {
        channelId: fallbackItems[0].snippet.channelId,
        title: fallbackItems[0].snippet.title,
        description: fallbackItems[0].snippet.description,
        thumbnails: fallbackItems[0].snippet.thumbnails
      };
    }

    return {
      channelId: items[0].snippet.channelId,
      title: items[0].snippet.title,
      description: items[0].snippet.description,
      thumbnails: items[0].snippet.thumbnails
    };
  } catch (error) {
    console.error(`[YouTube Service] Error searching channel "${query}":`, error);
    throw error;
  }
};

/**
 * Fetch detailed channel statistics and upload playlist ID
 */
export const fetchChannelDetails = async (channelId, apiKey) => {
  const youtube = getYoutubeClient(apiKey);
  if (!youtube) throw new Error('API_KEY_MISSING');

  try {
    console.log(`[YouTube Service] Fetching details for channel ID: ${channelId}`);
    const response = await youtube.channels.list({
      part: ['snippet', 'statistics', 'contentDetails'],
      id: [channelId]
    });

    const items = response.data.items || [];
    if (items.length === 0) {
      throw new Error(`Channel details not found for ID: ${channelId}`);
    }

    const channel = items[0];
    return {
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      customUrl: channel.snippet.customUrl || '',
      publishedAt: channel.snippet.publishedAt,
      thumbnails: channel.snippet.thumbnails,
      statistics: {
        viewCount: channel.statistics.viewCount,
        subscriberCount: channel.statistics.subscriberCount,
        videoCount: channel.statistics.videoCount
      },
      uploadsPlaylistId: channel.contentDetails.relatedPlaylists.uploads
    };
  } catch (error) {
    console.error(`[YouTube Service] Error fetching channel details:`, error);
    throw error;
  }
};

/**
 * Fetch recent videos from a channel's uploads playlist
 */
export const fetchRecentVideos = async (uploadsPlaylistId, maxResults = 30, apiKey) => {
  const youtube = getYoutubeClient(apiKey);
  if (!youtube) throw new Error('API_KEY_MISSING');

  try {
    console.log(`[YouTube Service] Fetching videos from playlist ID: ${uploadsPlaylistId}`);
    const response = await youtube.playlistItems.list({
      part: ['snippet', 'contentDetails'],
      playlistId: uploadsPlaylistId,
      maxResults: maxResults
    });

    const items = response.data.items || [];
    return items.map(item => ({
      videoId: item.contentDetails.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      thumbnails: item.snippet.thumbnails
    }));
  } catch (error) {
    console.error(`[YouTube Service] Error fetching playlist items:`, error);
    throw error;
  }
};

/**
 * Fetch detailed metrics for a list of video IDs (batched in 50s)
 */
export const fetchVideoMetrics = async (videoIds, apiKey) => {
  const youtube = getYoutubeClient(apiKey);
  if (!youtube) throw new Error('API_KEY_MISSING');

  if (!videoIds || videoIds.length === 0) return [];

  try {
    console.log(`[YouTube Service] Fetching metrics for ${videoIds.length} videos`);
    
    // Batch query in groups of 50
    const batches = [];
    for (let i = 0; i < videoIds.length; i += 50) {
      batches.push(videoIds.slice(i, i + 50));
    }

    const allVideoDetails = [];
    for (const batch of batches) {
      const response = await youtube.videos.list({
        part: ['statistics', 'contentDetails'],
        id: batch
      });
      allVideoDetails.push(...(response.data.items || []));
    }

    return allVideoDetails.map(video => ({
      id: video.id,
      duration: video.contentDetails.duration, // ISO 8601 duration
      viewCount: parseInt(video.statistics.viewCount || '0', 10),
      likeCount: parseInt(video.statistics.likeCount || '0', 10),
      commentCount: parseInt(video.statistics.commentCount || '0', 10)
    }));
  } catch (error) {
    console.error(`[YouTube Service] Error fetching video metrics:`, error);
    throw error;
  }
};
