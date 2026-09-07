export const metadata = {
  title: 'Website QA Audit Tool',
  description: 'Audit website performance, SEO, accessibility, and best practices.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}