import './globals.css';

export const metadata = {
  title: 'Business dashboard',
  description: 'Daily and monthly tracking for your businesses'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
