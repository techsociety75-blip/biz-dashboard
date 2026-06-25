export const STATUS_OPTIONS = [
  { value: 'on_track', label: 'On track', color: '#7FA882' },
  { value: 'attention', label: 'Needs attention', color: '#D9A441' },
  { value: 'urgent', label: 'Urgent', color: '#C2543D' }
];

export function getStatus(value) {
  return STATUS_OPTIONS.find((s) => s.value === value) || STATUS_OPTIONS[0];
}

// Icon choices available when adding or editing a business
export const ICON_CHOICES = [
  'milk',
  'utensils',
  'antenna',
  'bot',
  'server',
  'building',
  'truck',
  'briefcase',
  'store',
  'wrench',
  'leaf',
  'camera'
];

// Curated accent color pairs (bright accent + dim background) that stay legible on the dark theme
export const ACCENT_CHOICES = [
  { accent: '#D9C9A3', accentDim: '#3a3528' },
  { accent: '#E8744A', accentDim: '#3d2218' },
  { accent: '#5B8FE8', accentDim: '#1a2638' },
  { accent: '#9B7FE8', accentDim: '#28223d' },
  { accent: '#5BAFA0', accentDim: '#1a3530' },
  { accent: '#E8C14A', accentDim: '#3d3318' },
  { accent: '#E85B8F', accentDim: '#3d1d2a' },
  { accent: '#7FD9C4', accentDim: '#1c3a33' },
  { accent: '#C4A3E8', accentDim: '#2e2640' },
  { accent: '#A3C9E8', accentDim: '#1f2e3d' }
];
