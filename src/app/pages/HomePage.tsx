import { PageLayout, Hero, QuickStats, HomeGrid } from "@/components/layout";

export default function HomePage() {
  return (
    <PageLayout>
      <Hero />
      <QuickStats />
      <HomeGrid />
    </PageLayout>
  );
}
