export interface PortfolioProject {
  id: string;
  type: 'website' | 'ad';
  title: string;
  description: string;
  youtubeUrl: string;
  tags: string[];
}

export const portfolioData: PortfolioProject[] = [
  {
    id: '1',
    type: 'website',
    title: 'Luxe Dining Experience',
    description: 'High-performance digital menu and reservation system with real-time analytics.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Replace with your Unlisted YouTube URL
    tags: ['React', 'Node.js', 'QR Integration']
  },
  {
    id: '2',
    type: 'ad',
    title: 'adshoot for cafe',
    description: 'Viral short-form ad campaign that generated 500k+ local impressions in 14 days.',
    youtubeUrl: 'https://youtube.com/shorts/sWFFewNpdWk?si=aYCI9f42V-EtRuRQ', // Replace with your Unlisted YouTube URL
    tags: ['Motion Graphics', 'Meta Ads', 'Viral Strategy']
  }
];

// Helper to extract YouTube Video ID
export const getYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};
