import alignmentsData from '$lib/data/alignments.json';

interface Correspondence {
    id: string;
}

interface AlignmentsData {
    correspondences: Correspondence[];
}

const data = alignmentsData as AlignmentsData;
const BASE_URL = 'https://scale-align.pages.dev';

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
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml'
        }
    });
}
