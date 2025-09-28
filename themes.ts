import { Theme } from './types';

export const THEMES: Theme[] = [
  {
    id: 'default',
    name: 'Défaut',
    styles: {
      '--font-primary': '"Inter", sans-serif',
      '--font-url': 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
      '--color-bg': '#0f172a', // slate-900
      '--color-text': '#e2e8f0', // slate-200
      '--color-text-muted': '#94a3b8', // slate-400
      '--color-card': '#1e293b', // slate-800
      '--color-primary': '#6366f1', // indigo-500
      '--color-primary-accent': '#818cf8', // indigo-400
      '--color-secondary': '#a855f7', // purple-500
      '--color-secondary-accent': '#c084fc', // purple-400
      '--color-tertiary': '#0ea5e9', // sky-500
      '--color-tertiary-accent': '#38bdf8', // sky-400
      '--color-success': '#22c55e', // green-500
      '--color-danger': '#ef4444', // red-500
      '--color-danger-accent': '#f87171', // red-400
      '--color-border': '#334155', // slate-700
      '--color-input-bg': '#1e293b', // slate-800
      '--shadow-primary': '0 4px 14px 0 rgba(99, 102, 241, 0.3)',
      '--gradient-start': '#a855f7',
      '--gradient-mid': '#6366f1',
      '--gradient-end': '#0ea5e9',
    },
  },
  {
    id: 'forest',
    name: 'Forêt Tropicale',
    styles: {
      '--font-primary': '"Roboto Slab", serif',
      '--font-url': 'https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@400;700&display=swap',
      '--color-bg': '#1a2e29',
      '--color-text': '#e8f5e9',
      '--color-text-muted': '#a5d6a7',
      '--color-card': '#2e4d3f',
      '--color-primary': '#4caf50',
      '--color-primary-accent': '#81c784',
      '--color-secondary': '#ffb300',
      '--color-secondary-accent': '#ffd54f',
      '--color-tertiary': '#8d6e63',
      '--color-tertiary-accent': '#bcaaa4',
      '--color-success': '#4caf50',
      '--color-danger': '#e57373',
      '--color-danger-accent': '#ef9a9a',
      '--color-border': '#3e5e51',
      '--color-input-bg': '#2e4d3f',
      '--shadow-primary': '0 4px 14px 0 rgba(76, 175, 80, 0.3)',
      '--gradient-start': '#ffb300',
      '--gradient-mid': '#4caf50',
      '--gradient-end': '#8d6e63',
    },
  },
  {
    id: 'neon',
    name: 'Néon Nocturne',
    styles: {
      '--font-primary': '"Orbitron", sans-serif',
      '--font-url': 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap',
      '--color-bg': '#111827',
      '--color-text': '#f9fafb',
      '--color-text-muted': '#9ca3af',
      '--color-card': '#1f2937',
      '--color-primary': '#ec4899', // pink-500
      '--color-primary-accent': '#f472b6', // pink-400
      '--color-secondary': '#8b5cf6', // violet-500
      '--color-secondary-accent': '#a78bfa', // violet-400
      '--color-tertiary': '#3b82f6', // blue-500
      '--color-tertiary-accent': '#60a5fa', // blue-400
      '--color-success': '#10b981', // emerald-500
      '--color-danger': '#f43f5e', // rose-500
      '--color-danger-accent': '#fb7185', // rose-400
      '--color-border': '#374151',
      '--color-input-bg': '#1f2937',
      '--shadow-primary': '0 4px 14px 0 rgba(236, 72, 153, 0.3)',
      '--gradient-start': '#ec4899',
      '--gradient-mid': '#8b5cf6',
      '--gradient-end': '#3b82f6',
    },
  },
  {
    id: 'sunset',
    name: 'Coucher de Soleil',
    styles: {
      '--font-primary': '"Lato", sans-serif',
      '--font-url': 'https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap',
      '--color-bg': '#2d1b2d',
      '--color-text': '#fee2e2',
      '--color-text-muted': '#fca5a5',
      '--color-card': '#4a2c41',
      '--color-primary': '#f97316', // orange-500
      '--color-primary-accent': '#fb923c', // orange-400
      '--color-secondary': '#ef4444', // red-500
      '--color-secondary-accent': '#f87171', // red-400
      '--color-tertiary': '#f59e0b', // amber-500
      '--color-tertiary-accent': '#fbbf24', // amber-400
      '--color-success': '#84cc16', // lime-500
      '--color-danger': '#ef4444',
      '--color-danger-accent': '#f87171',
      '--color-border': '#6b3e5b',
      '--color-input-bg': '#4a2c41',
      '--shadow-primary': '0 4px 14px 0 rgba(249, 115, 22, 0.3)',
      '--gradient-start': '#f97316',
      '--gradient-mid': '#ef4444',
      '--gradient-end': '#f59e0b',
    },
  },
  {
    id: 'ocean',
    name: 'Océan Profond',
    styles: {
      '--font-primary': '"Poppins", sans-serif',
      '--font-url': 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
      '--color-bg': '#0d1b2a',
      '--color-text': '#e0fbfc',
      '--color-text-muted': '#98c1d9',
      '--color-card': '#1b263b',
      '--color-primary': '#3d5a80',
      '--color-primary-accent': '#98c1d9',
      '--color-secondary': '#29a19c',
      '--color-secondary-accent': '#56d1ca',
      '--color-tertiary': '#fca311',
      '--color-tertiary-accent': '#ffbe4f',
      '--color-success': '#06d6a0',
      '--color-danger': '#ef476f',
      '--color-danger-accent': '#f16889',
      '--color-border': '#415a77',
      '--color-input-bg': '#1b263b',
      '--shadow-primary': '0 4px 14px 0 rgba(61, 90, 128, 0.3)',
      '--gradient-start': '#3d5a80',
      '--gradient-mid': '#29a19c',
      '--gradient-end': '#fca311',
    },
  },
  {
    id: 'comic',
    name: 'Bande Dessinée',
    styles: {
      '--font-primary': '"Shantell Sans", cursive',
      '--font-url': 'https://fonts.googleapis.com/css2?family=Shantell+Sans:ital,wght@0,400;0,700;1,400&display=swap',
      '--color-bg': '#23242a',
      '--color-text': '#f8f8f8',
      '--color-text-muted': '#a9a9a9',
      '--color-card': '#2c2d34',
      '--color-primary': '#00a8e8',
      '--color-primary-accent': '#33b9ea',
      '--color-secondary': '#f9a620',
      '--color-secondary-accent': '#f9b84c',
      '--color-tertiary': '#e63946',
      '--color-tertiary-accent': '#e9606b',
      '--color-success': '#8ac926',
      '--color-danger': '#e63946',
      '--color-danger-accent': '#e9606b',
      '--color-border': '#4a4b53',
      '--color-input-bg': '#2c2d34',
      '--shadow-primary': '0 4px 14px 0 rgba(0, 168, 232, 0.3)',
      '--gradient-start': '#00a8e8',
      '--gradient-mid': '#f9a620',
      '--gradient-end': '#e63946',
    },
  },
  {
    id: 'pastel',
    name: 'Rêve Pastel',
    styles: {
      '--font-primary': '"Quicksand", sans-serif',
      '--font-url': 'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600;700&display=swap',
      '--color-bg': '#1e1e2e',
      '--color-text': '#f5e0e6',
      '--color-text-muted': '#c7a4b4',
      '--color-card': '#2e2e48',
      '--color-primary': '#a6c1ee',
      '--color-primary-accent': '#b9d0f4',
      '--color-secondary': '#f28fad',
      '--color-secondary-accent': '#f5a7c0',
      '--color-tertiary': '#b7e4c7',
      '--color-tertiary-accent': '#cae9d3',
      '--color-success': '#b7e4c7',
      '--color-danger': '#ffadad',
      '--color-danger-accent': '#ffc2c2',
      '--color-border': '#4e4e68',
      '--color-input-bg': '#2e2e48',
      '--shadow-primary': '0 4px 14px 0 rgba(166, 193, 238, 0.3)',
      '--gradient-start': '#a6c1ee',
      '--gradient-mid': '#f28fad',
      '--gradient-end': '#b7e4c7',
    },
  },
];