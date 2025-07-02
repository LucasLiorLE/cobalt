<script>
    import { t } from "$lib/i18n/translations";
</script>

<svelte:head>
    <title>Discord Video Embed Test - {$t("general.cobalt")}</title>
    <meta property="og:title" content="Discord Video Embed Test - Cobalt" />
    <meta property="og:description" content="Test page for Discord video embed functionality" />
</svelte:head>

<div class="test-container">
    <header>
        <h1>Discord Video Embed Test</h1>
        <p>This page demonstrates the new Discord video embed functionality for Cobalt.</p>
    </header>

    <main>
        <section class="how-it-works">
            <h2>How It Works</h2>
            <p>Cobalt now supports Discord video embeds through special URLs that include Open Graph meta tags.</p>
            
            <h3>Generic Embed URL</h3>
            <div class="url-example">
                <code>/embed?url=VIDEO_URL</code>
                <p>Use this format for any supported video URL.</p>
            </div>

            <h3>Service-Specific Embed URLs</h3>
            <div class="url-examples">
                <div class="url-example">
                    <code>/embed/youtube/VIDEO_ID</code>
                    <p>For YouTube videos: <code>/embed/youtube/dQw4w9WgXcQ</code></p>
                </div>
                
                <div class="url-example">
                    <code>/embed/twitter/TWEET_ID</code>
                    <p>For Twitter/X videos: <code>/embed/twitter/1234567890</code></p>
                </div>
                
                <div class="url-example">
                    <code>/embed/tiktok/VIDEO_ID</code>
                    <p>For TikTok videos: <code>/embed/tiktok/VIDEO_ID</code></p>
                </div>
                
                <div class="url-example">
                    <code>/embed/instagram/POST_ID</code>
                    <p>For Instagram videos: <code>/embed/instagram/POST_ID</code></p>
                </div>
            </div>
        </section>

        <section class="open-graph-tags">
            <h2>Open Graph Meta Tags</h2>
            <p>The embed pages automatically generate the following Discord-compatible meta tags:</p>
            
            <ul>
                <li><strong>og:title</strong> - Video title</li>
                <li><strong>og:description</strong> - Video description</li>
                <li><strong>og:type</strong> - "video.other"</li>
                <li><strong>og:video:url</strong> - Direct video URL</li>
                <li><strong>og:video:type</strong> - Video MIME type (video/mp4, etc.)</li>
                <li><strong>og:video:width</strong> - Video width</li>
                <li><strong>og:video:height</strong> - Video height</li>
                <li><strong>og:image</strong> - Video thumbnail</li>
                <li><strong>og:site_name</strong> - "Cobalt"</li>
            </ul>
        </section>

        <section class="test-links">
            <h2>Test Links</h2>
            <p>Try these example embed URLs:</p>
            
            <div class="test-link">
                <a href="/embed/youtube/dQw4w9WgXcQ" target="_blank">
                    /embed/youtube/dQw4w9WgXcQ
                </a>
                <span class="description">Sample YouTube video embed</span>
            </div>
            
            <div class="test-link">
                <a href="/embed?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ" target="_blank">
                    /embed?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ
                </a>
                <span class="description">Generic embed with YouTube URL</span>
            </div>
        </section>

        <section class="discord-usage">
            <h2>Using with Discord</h2>
            <ol>
                <li>Copy the embed URL for your video</li>
                <li>Paste it into Discord</li>
                <li>Discord will automatically generate a video embed preview</li>
                <li>Users can click to view the video directly in Discord</li>
            </ol>
            
            <div class="note">
                <p><strong>Note:</strong> The Cobalt API must be running and accessible for the embeds to work properly.</p>
            </div>
        </section>
    </main>
</div>

<style>
    .test-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 40px 20px;
        line-height: 1.6;
    }

    header {
        text-align: center;
        margin-bottom: 40px;
        padding-bottom: 20px;
        border-bottom: 1px solid var(--border);
    }

    h1 {
        color: var(--font);
        margin-bottom: 10px;
    }

    h2 {
        color: var(--font);
        margin-top: 30px;
        margin-bottom: 15px;
    }

    h3 {
        color: var(--font);
        margin-top: 20px;
        margin-bottom: 10px;
    }

    p {
        color: var(--gray);
        margin-bottom: 15px;
    }

    .url-example, .url-examples .url-example {
        background: var(--background-2);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        border: 1px solid var(--border);
    }

    .url-examples {
        display: grid;
        gap: 15px;
    }

    code {
        background: var(--background);
        padding: 4px 8px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        color: var(--primary);
        font-weight: 600;
    }

    ul {
        color: var(--gray);
        padding-left: 20px;
    }

    ul li {
        margin-bottom: 8px;
    }

    ol {
        color: var(--gray);
        padding-left: 20px;
    }

    ol li {
        margin-bottom: 10px;
    }

    .test-link {
        display: flex;
        flex-direction: column;
        background: var(--background-2);
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 15px;
        border: 1px solid var(--border);
    }

    .test-link a {
        color: var(--primary);
        text-decoration: none;
        font-weight: 600;
        margin-bottom: 5px;
    }

    .test-link a:hover {
        text-decoration: underline;
    }

    .test-link .description {
        color: var(--gray);
        font-size: 0.9em;
    }

    .note {
        background: var(--yellow-bg);
        border: 1px solid var(--yellow);
        border-radius: 8px;
        padding: 15px;
        margin-top: 20px;
    }

    .note p {
        color: var(--yellow-text);
        margin: 0;
    }

    @media (max-width: 768px) {
        .test-container {
            padding: 20px 15px;
        }
        
        .url-example {
            padding: 12px;
        }
        
        code {
            word-break: break-all;
        }
    }
</style>