
// This layout can be very simple or removed if not needed for specific onboarding styling,
// as the page itself handles full-screen behavior.
// For now, just pass children through.

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
