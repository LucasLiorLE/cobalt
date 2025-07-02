import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
    const { service, id } = params;
    
    // Use mock data for demo purposes
    const response = await fetch(`/api/mock-video?service=${service}&id=${id}`);
    const videoData = await response.json();
    
    return {
        videoData,
        service,
        id,
        originalUrl: `https://example.com/${service}/${id}` // Mock URL for demo
    };
};

export const prerender = false;
export const ssr = true;