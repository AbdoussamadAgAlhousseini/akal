import type {Metadata} from 'next';
import '../globals.css';

export const metadata: Metadata = {
  title: 'AKAL — Administration',
  robots: {index: false, follow: false}
};

// Admin has its own root layout (French, not part of the trilingual site).
export default function AdminRootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-sable text-encre">{children}</body>
    </html>
  );
}
