export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary p-6">
      {children}
    </main>
  );
}
