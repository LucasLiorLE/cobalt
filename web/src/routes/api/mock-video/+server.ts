import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
    const service = url.searchParams.get('service') || 'youtube';
    const id = url.searchParams.get('id') || 'dQw4w9WgXcQ';
    
    // Mock video data for testing
    const mockData = {
        title: `Sample ${service.toUpperCase()} Video`,
        description: `This is a sample ${service} video processed by Cobalt for Discord embed testing.`,
        thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
        videoUrl: `https://example.com/video/${service}/${id}.mp4`,
        dimensions: { width: 1280, height: 720 },
        type: 'video/mp4',
        duration: 180,
        author: `Sample ${service} Creator`,
        service: service
    };
    
    return json(mockData);
};