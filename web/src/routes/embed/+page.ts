import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ url, fetch }) => {
    const videoUrl = url.searchParams.get('url');
    
    if (!videoUrl) {
        throw error(400, 'URL parameter is required');
    }

    try {
        // Call the Cobalt API to get video metadata
        const response = await fetch('/api/video-info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ url: videoUrl })
        });

        if (!response.ok) {
            throw error(response.status, `Failed to fetch video information: ${response.statusText}`);
        }

        const videoData = await response.json();
        
        return {
            videoData,
            originalUrl: videoUrl
        };
    } catch (err) {
        console.error('Error fetching video data:', err);
        throw error(500, 'Failed to fetch video information');
    }
};

export const prerender = false;
export const ssr = true;