import { nanoid } from "nanoid";
import { env } from "../config.js";
import { createResponse } from "../processing/request.js";

// Mock CDN base URL for demonstration - in production this would be configurable
const CDN_BASE_URL = process.env.CDN_BASE_URL || "https://cdn.example.com";

// Mock video database - in production this would be a real database
const mockVideoDatabase = new Map([
    ["demo-video", { 
        id: "demo-video",
        title: "Demo Video",
        url: "https://example.com/videos/demo-video.mp4",
        duration: 120,
        format: "mp4"
    }],
    ["sample-clip", {
        id: "sample-clip", 
        title: "Sample Clip",
        url: "https://example.com/videos/sample-clip.mp4",
        duration: 60,
        format: "mp4"
    }],
    ["test-video", {
        id: "test-video",
        title: "Test Video", 
        url: "https://example.com/videos/test-video.mp4",
        duration: 90,
        format: "mp4"
    }]
]);

/**
 * Validates a video name/ID
 * @param {string} videoName - The video name to validate
 * @returns {boolean} - Whether the video name is valid
 */
export function validateVideoName(videoName) {
    if (!videoName || typeof videoName !== 'string') {
        return false;
    }
    
    // Basic validation: alphanumeric, hyphens, underscores, 1-50 characters
    return /^[a-zA-Z0-9_-]{1,50}$/.test(videoName);
}

/**
 * Checks if a video exists in the database
 * @param {string} videoName - The video name to check
 * @returns {object|null} - Video object if found, null otherwise
 */
export function getVideoInfo(videoName) {
    return mockVideoDatabase.get(videoName) || null;
}

/**
 * Generates a temporary CDN URL with time-based expiration
 * @param {string} videoUrl - Original video URL
 * @param {number} expirationMinutes - How many minutes the URL should be valid (default: 60)
 * @returns {object} - Object with CDN URL and expiration info
 */
export function generateCdnUrl(videoUrl, expirationMinutes = 60) {
    const expiration = new Date(Date.now() + (expirationMinutes * 60 * 1000));
    const expirationTimestamp = Math.floor(expiration.getTime() / 1000);
    
    // Generate a simple token for demo purposes
    // In production, this would be a proper signed URL with authentication
    const token = nanoid(16);
    
    // Extract filename from original URL
    const urlPath = new URL(videoUrl).pathname;
    const filename = urlPath.split('/').pop();
    
    const cdnUrl = `${CDN_BASE_URL}/secure/${token}/${filename}?exp=${expirationTimestamp}`;
    
    return {
        url: cdnUrl,
        expiration: expiration.toISOString(),
        expirationTimestamp,
        token,
        originalUrl: videoUrl
    };
}

/**
 * Formats a CDN URL into tunnel-like format
 * @param {string} cdnUrl - The CDN URL to format
 * @returns {string} - Formatted tunnel URL
 */
export function formatTunnelLink(cdnUrl) {
    // Convert CDN URL to tunnel format: url/cdn pattern
    const url = new URL(cdnUrl);
    
    // Extract path and query components
    const pathAndQuery = url.pathname + url.search;
    
    // Format as tunnel link: protocol://host/tunnel/cdn{pathAndQuery}
    return `${url.protocol}//${url.host}/tunnel/cdn${pathAndQuery}`;
}

/**
 * Handles video tunnel request
 * @param {string} videoName - The requested video name
 * @param {object} options - Additional options (expiration, format, etc.)
 * @returns {object} - Response object with tunnel link or error
 */
export function handleVideoRequest(videoName, options = {}) {
    // Validate video name
    if (!validateVideoName(videoName)) {
        return createResponse("error", {
            code: "error.api.video.invalid_name",
            context: { videoName }
        });
    }
    
    // Check if video exists
    const videoInfo = getVideoInfo(videoName);
    if (!videoInfo) {
        return createResponse("error", {
            code: "error.api.video.not_found", 
            context: { videoName }
        });
    }
    
    try {
        // Generate CDN URL
        const expirationMinutes = options.expiration || 60;
        const cdnInfo = generateCdnUrl(videoInfo.url, expirationMinutes);
        
        // Format as tunnel link
        const tunnelLink = formatTunnelLink(cdnInfo.url);
        
        return createResponse("success", {
            video: {
                id: videoInfo.id,
                title: videoInfo.title,
                duration: videoInfo.duration,
                format: videoInfo.format
            },
            cdn: {
                url: cdnInfo.url,
                expiration: cdnInfo.expiration,
                expirationTimestamp: cdnInfo.expirationTimestamp
            },
            tunnel: {
                link: tunnelLink,
                pattern: "url/cdn"
            }
        });
    } catch (error) {
        return createResponse("error", {
            code: "error.api.video.generation_failed",
            context: { videoName, error: error.message }
        });
    }
}

/**
 * Lists available videos (for demo purposes)
 * @returns {object} - Response with list of available videos
 */
export function listAvailableVideos() {
    const videos = Array.from(mockVideoDatabase.values()).map(video => ({
        id: video.id,
        title: video.title,
        duration: video.duration,
        format: video.format
    }));
    
    return createResponse("success", {
        videos,
        count: videos.length
    });
}