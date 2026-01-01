import alignmentsData from '$lib/data/alignments.json';
import type { AlignmentData } from '$lib/types';

const data = alignmentsData as AlignmentData;
const BASE_URL = 'https://scale-align.pages.dev';
const LAST_MOD = '2026-01-02';

export const prerender = true;

export async function GET() {
    const pages = [
        '',
        '/findings/'
    ];

    // Add all correspondence pages
    for (const corr of data.correspondences) {
        pages.push(`/compare/${corr.id}/`);
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${LAST_MOD}</lastmod>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
}
