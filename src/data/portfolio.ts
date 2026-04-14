export interface PortfolioProject {
  id: string;
  type: 'website' | 'ad' | 'showcase';
  title: string;
  description: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  tags: string[];
}

export const portfolioData: PortfolioProject[] = [
  {
    id: '1',
    type: 'website',
    title: 'Luxe Dining Experience',
    description: 'High-performance digital menu and reservation system with real-time analytics.',
    youtubeUrl: 'https://youtube.com/shorts/3iNUzDrVKGs?feature=share', // Replace with your Unlisted YouTube URL
    tags: ['React', 'Node.js', 'QR Integration']
  },
  {
    id: '2',
    type: 'ad',
    title: 'Cafe Branding',
    description: 'Viral short-form ad campaign that generated 500k+ local impressions in 14 days.',
    youtubeUrl: 'https://youtube.com/shorts/sWFFewNpdWk?si=aYCI9f42V-EtRuRQ', // Replace with your Unlisted YouTube URL
    tags: ['Motion Graphics', 'Meta Ads', 'Viral Strategy']
  },
  {
    id: '3',
    type: 'ad',
    title: 'adshoot for cafe',
    description: 'Viral short-form ad campaign that generated 500k+ local impressions in 14 days.',
    youtubeUrl: 'https://youtube.com/shorts/q40ma3ASmGc?feature=share', // Replace with your Unlisted YouTube URL
    tags: ['Motion Graphics', 'Meta Ads', 'Viral Strategy']
  }
];

// ─── WEBSITE SHOWCASE ───
// Dedicated interface for website-only entries.
// Add your website URLs here — they'll auto-appear in the Portfolio page.
export interface WebsiteShowcase {
  id: string;
  title: string;
  description: string;
  websiteUrl: string;
  tags: string[];
}

export const websiteShowcaseData: WebsiteShowcase[] = [
  {
    id: 's1',
    title: "oncro ai",
    description: "AI-powered analytics platform for small businesses.",
    websiteUrl: "https://projectredkoenigsegg.netlify.app/",
    tags: ["React", "AI", "Analytics"],
  },
];

// Auto-map websiteShowcaseData → PortfolioProject[] for the renderer
export const showcaseData: PortfolioProject[] = websiteShowcaseData.map((site) => ({
  id: site.id,
  type: 'showcase' as const,
  title: site.title,
  description: site.description,
  websiteUrl: site.websiteUrl,
  tags: site.tags,
}));

// Combined data for the portfolio page
export const allPortfolioData: PortfolioProject[] = [...portfolioData, ...showcaseData];

// Helper to extract YouTube Video ID
export const getYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
