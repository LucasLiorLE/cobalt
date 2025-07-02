import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, url, fetch }) => {
    const { service, id } = params;
    
    if (!service || !id) {
        throw error(400, 'Service and ID parameters are required');
    }

    // Reconstruct the original URL based on service and ID
    let originalUrl = '';
    
    switch (service.toLowerCase()) {
        case 'youtube':
        case 'yt':
            originalUrl = `https://www.youtube.com/watch?v=${id}`;
            break;
        case 'twitter':
        case 'x':
            // For Twitter, we might need additional context since URLs are more complex
            // This is a simplified approach - in reality, you'd need the full tweet URL
            originalUrl = `https://twitter.com/i/status/${id}`;
            break;
        case 'tiktok':
            originalUrl = `https://www.tiktok.com/@user/video/${id}`;
            break;
        case 'instagram':
            originalUrl = `https://www.instagram.com/p/${id}`;
            break;
        default:
            throw error(400, `Unsupported service: ${service}`);
    }

    // Check if there's an override URL in query params
    const urlOverride = url.searchParams.get('url');
    if (urlOverride) {
        originalUrl = urlOverride;
    }

    try {
        // Call our video info API
        const response = await fetch('/api/video-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: originalUrl })
        });

        if (!response.ok) {
            throw error(response.status, `Failed to fetch video information: ${response.statusText}`);
        }

        const videoData = await response.json();
        
        return {
            videoData,
            originalUrl,
            service,
            id
        };
    } catch (err) {
        console.error('Error fetching video data:', err);
        throw error(500, 'Failed to fetch video information');
    }
};

export const prerender = false;
export const ssr = true;