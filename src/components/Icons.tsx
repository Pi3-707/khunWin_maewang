// Small line icons (24px grid, stroke = currentColor) so they take the colour of their container.
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

export const ChatIcon = () => (
  <svg {...base}><path d="M4 5h16v10H9l-5 4V5z" /><path d="M8 10h8" /></svg>
);
export const MessengerIcon = () => (
  <svg {...base}><path d="M12 3c5 0 9 3.6 9 8.2S17 19.4 12 19.4c-.9 0-1.8-.1-2.6-.3L5 21v-4c-1.3-1.5-2-3.3-2-5.8C3 6.6 7 3 12 3z" /><path d="m7.5 13 3-3 2.5 2 3.5-3" /></svg>
);
export const PhoneIcon = () => (
  <svg {...base}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" /></svg>
);
export const PinIcon = () => (
  <svg {...base}><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const ArrowIcon = () => (
  <svg {...base} width={18} height={18}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
