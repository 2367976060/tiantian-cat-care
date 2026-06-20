'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Pill, Milk, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getFeedingLogs, getMedicineLogs, getNursingLogs } from '@/lib/storage';
import { isToday, formatTime } from '@/utils';

interface Stats {
  feedingCount: number;
  medicineCount: number;
  nursingCount: number;
  lastRecordTime?: string;
}

export function TodayOverview() {
  const [stats, setStats] = useState<Stats>({
    feedingCount: 0,
    medicineCount: 0,
    nursingCount: 0,
  });

  useEffect(() => {
    const feedingLogs = getFeedingLogs().filter(log => isToday(log.recorded_at));
    const medicineLogs = getMedicineLogs().filter(log => isToday(log.recorded_at));
    const nursingLogs = getNursingLogs().filter(log => isToday(log.start_time));

    const allTimes = [
      ...feedingLogs.map(l => l.recorded_at),
      ...medicineLogs.map(l => l.recorded_at),
      ...nursingLogs.map(l => l.start_time),
    ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    setStats({
      feedingCount: feedingLogs.length,
      medicineCount: medicineLogs.length,
      nursingCount: nursingLogs.length,
      lastRecordTime: allTimes[0],
    });
  }, []);

  const statItems = [
    { label: '喂食', value: stats.feedingCount, icon: Utensils, color: 'text-primary', bg: 'bg-primary/10' },
    { label: '喂药', value: stats.medicineCount, icon: Pill, color: 'text-secondary', bg: 'bg-secondary/20' },
    { label: '吃奶', value: stats.nursingCount, icon: Milk, color: 'text-amber-500', bg: 'bg-amber-100' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">今日概览</h3>
            {stats.lastRecordTime && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>最近 {formatTime(stats.lastRecordTime)}</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3">
            {statItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  className={`${item.bg} rounded-2xl p-4 text-center`}
                >
                  <div className={`${item.color} flex justify-center mb-2`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className={`text-2xl font-bold ${item.color}`}>
                    {item.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.label}次数
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
