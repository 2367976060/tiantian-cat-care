'use client';

import { Header } from '@/components/layout/Header';
import { MotherCatCard } from '@/components/dashboard/MotherCatCard';
import { TodayOverview } from '@/components/dashboard/TodayOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Timeline } from '@/components/dashboard/Timeline';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header title="甜甜育儿记录本" />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        <MotherCatCard />
        <TodayOverview />
        <QuickActions />
        <Timeline />
      </main>
    </div>
  );
}
