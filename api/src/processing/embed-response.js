import { createResponse } from "./request.js";

export function createEmbedResponse(videoData, originalUrl) {
    const embedInfo = {
        title: videoData?.fileMetadata?.title || videoData?.filename || 'Video Content',
        description: extractDescription(videoData, originalUrl),
        thumbnail: extractThumbnail(videoData),
        videoUrl: extractVideoUrl(videoData),
        videoDimensions: extractDimensions(videoData),
        videoType: extractVideoType(videoData),
        duration: videoData?.duration,
        author: videoData?.fileMetadata?.artist || videoData?.fileMetadata?.author,
        service: videoData?.service,
        originalUrl
    };

    return {
        status: 200,
        body: {
            status: "embed",
            ...embedInfo
        }
    };
}

function extractDescription(videoData, originalUrl) {
    if (videoData?.fileMetadata?.description) {
        return videoData.fileMetadata.description;
    }
    
    if (videoData?.fileMetadata?.title) {
        return `${videoData.fileMetadata.title} - processed by Cobalt`;
    }
    
    // Generate description based on the service
    if (originalUrl.includes('youtube.com') || originalUrl.includes('youtu.be')) {
        return 'YouTube video processed by Cobalt';
    } else if (originalUrl.includes('twitter.com') || originalUrl.includes('x.com')) {
        return 'Twitter video processed by Cobalt';
    } else if (originalUrl.includes('tiktok.com')) {
        return 'TikTok video processed by Cobalt';
    } else if (originalUrl.includes('instagram.com')) {
        return 'Instagram video processed by Cobalt';
    }
    
    return 'Video content processed by Cobalt';
}

function extractThumbnail(videoData) {
    if (videoData?.thumb) return videoData.thumb;
    if (videoData?.thumbnail) return videoData.thumbnail;
    if (videoData?.cover) return videoData.cover;
    
    // For picker responses, get the first thumbnail
    if (videoData?.picker && videoData.picker.length > 0) {
        return videoData.picker[0].thumb;
    }
    
    return null;
}

function extractVideoUrl(videoData) {
    if (videoData?.url) return videoData.url;
    if (videoData?.urls) return videoData.urls;
    
    // For picker responses, get the first video URL
    if (videoData?.picker && videoData.picker.length > 0) {
        return videoData.picker[0].url;
    }
    
    return null;
}

function extractDimensions(videoData) {
    // Default dimensions for video embeds
    const defaultDimensions = { width: 1280, height: 720 };
    
    if (videoData?.resolution) {
        const [width, height] = videoData.resolution.split('x').map(Number);
        if (width && height) {
            return { width, height };
        }
    }
    
    if (videoData?.filenameAttributes?.resolution) {
        const [width, height] = videoData.filenameAttributes.resolution.split('x').map(Number);
        if (width && height) {
            return { width, height };
        }
    }
    
    return defaultDimensions;
}

function extractVideoType(videoData) {
    if (videoData?.type) {
        // Map common types to MIME types
        switch (videoData.type) {
            case 'mp4':
                return 'video/mp4';
            case 'webm':
                return 'video/webm';
            case 'mov':
                return 'video/quicktime';
            default:
                return `video/${videoData.type}`;
        }
    }
    
    if (videoData?.filenameAttributes?.extension) {
        const ext = videoData.filenameAttributes.extension;
        switch (ext) {
            case 'mp4':
                return 'video/mp4';
            case 'webm':
                return 'video/webm';
            case 'mov':
                return 'video/quicktime';
            default:
                return `video/${ext}`;
        }
    }
    
    // Default to mp4
    return 'video/mp4';
}