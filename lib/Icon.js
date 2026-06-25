export function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.6 }) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  switch (name) {
    case 'milk':
      return (
        <svg {...props}>
          <path d="M9 2h6l1 4-2 2v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V8L8 6l1-4z" />
          <path d="M8 13h8" />
        </svg>
      );
    case 'utensils':
      return (
        <svg {...props}>
          <path d="M7 2v8a2 2 0 002 2v10" />
          <path d="M5 2v6M9 2v6" />
          <path d="M17 2c-1.5 1.5-2 3-2 6 0 2 1 3 2 3v11" />
        </svg>
      );
    case 'antenna':
      return (
        <svg {...props}>
          <path d="M12 2l-3 6h6l-3-6z" />
          <path d="M12 8v14" />
          <path d="M8 22h8" />
          <path d="M5 9a8 8 0 010 6M19 9a8 8 0 010 6" />
        </svg>
      );
    case 'bot':
      return (
        <svg {...props}>
          <rect x="4" y="9" width="16" height="11" rx="2" />
          <path d="M12 9V5M9 5h6" />
          <circle cx="9" cy="14" r="1.2" fill={color} />
          <circle cx="15" cy="14" r="1.2" fill={color} />
          <path d="M2 13h2M20 13h2" />
        </svg>
      );
    case 'server':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="18" height="7" rx="1.5" />
          <rect x="3" y="14" width="18" height="7" rx="1.5" />
          <circle cx="7" cy="6.5" r="0.6" fill={color} />
          <circle cx="7" cy="17.5" r="0.6" fill={color} />
        </svg>
      );
    case 'chevron-left':
      return (
        <svg {...props}>
          <path d="M15 18l-6-6 6-6" />
        </svg>
      );
    case 'chevron-right':
      return (
        <svg {...props}>
          <path d="M9 18l6-6-6-6" />
        </svg>
      );
    case 'arrow-left':
      return (
        <svg {...props}>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      );
    case 'check':
      return (
        <svg {...props}>
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );
    case 'alert':
      return (
        <svg {...props}>
          <path d="M10.3 3.6L2.7 18a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.6a2 2 0 00-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    case 'bell':
      return (
        <svg {...props}>
          <path d="M6 8a6 6 0 0112 0c0 4 1.5 5.5 2 6.5H4c.5-1 2-2.5 2-6.5z" />
          <path d="M9.5 19a2.5 2.5 0 005 0" />
        </svg>
      );
    case 'file':
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M9 13h6M9 17h6" />
        </svg>
      );
    case 'arrow-down-right':
      return (
        <svg {...props}>
          <path d="M7 7l10 10M17 11v6h-6" />
        </svg>
      );
    case 'arrow-up-right':
      return (
        <svg {...props}>
          <path d="M7 17L17 7M11 7h6v6" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...props}>
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <path d="M16 17l5-5-5-5" />
          <path d="M21 12H9" />
        </svg>
      );
    case 'building':
      return (
        <svg {...props}>
          <rect x="4" y="2" width="16" height="20" rx="1" />
          <path d="M9 22v-4h6v4M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...props}>
          <path d="M2 8h11v8H2z" />
          <path d="M13 11h4l3 3v2h-7z" />
          <circle cx="6" cy="18" r="1.6" />
          <circle cx="17" cy="18" r="1.6" />
        </svg>
      );
    case 'briefcase':
      return (
        <svg {...props}>
          <rect x="3" y="7" width="18" height="13" rx="1.5" />
          <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
          <path d="M3 12h18" />
        </svg>
      );
    case 'store':
      return (
        <svg {...props}>
          <path d="M3 9l1.5-5h15L21 9" />
          <path d="M3 9v11h18V9" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case 'wrench':
      return (
        <svg {...props}>
          <path d="M14.7 6.3a4 4 0 10-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.1 2.1-2-2 2.1-2.1z" />
        </svg>
      );
    case 'leaf':
      return (
        <svg {...props}>
          <path d="M5 19c8 0 14-6 14-14-8 0-14 6-14 14z" />
          <path d="M5 19c0-5 3-9 7-11" />
        </svg>
      );
    case 'camera':
      return (
        <svg {...props}>
          <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
      );
    case 'plus':
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
    case 'trash':
      return (
        <svg {...props}>
          <path d="M3 6h18" />
          <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
          <path d="M19 6l-1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L5 6" />
          <path d="M10 11v6M14 11v6" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        </svg>
      );
    default:
      return null;
  }
}
