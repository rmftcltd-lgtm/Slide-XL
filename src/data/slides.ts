export interface Slide {
  title: string
  body: string
  accent: string
}

export const slides: Slide[] = [
  {
    title: 'Welcome to Slide XL',
    body: 'The presentation studio built for teams that move fast.',
    accent: 'linear-gradient(135deg, #6366f1, #a855f7)',
  },
  {
    title: 'Design in flow',
    body: 'Smart layouts keep every slide balanced without the busywork.',
    accent: 'linear-gradient(135deg, #0ea5e9, #22d3ee)',
  },
  {
    title: 'Data that stays fresh',
    body: 'Connect a source once and your charts update themselves.',
    accent: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  {
    title: 'Present anywhere',
    body: 'Share a link and go live — no downloads, no drama.',
    accent: 'linear-gradient(135deg, #10b981, #14b8a6)',
  },
]
