import './globals.css';

export const metadata = {
  title: 'BugHunter AI — Website QA Audit',
  description: 'Analyze performance, SEO, accessibility, and best practices in one click.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
