'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getFeedingLogs, getMedicineLogs, getNursingLogs, getKittens } from '@/lib/storage';
import { isToday } from '@/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StatsPage() {
  const [feedingData, setFeedingData] = useState<any>(null);
  const [medicineData, setMedicineData] = useState<any>(null);
  const [nursingData, setNursingData] = useState<any>(null);
  const [summary, setSummary] = useState({
    totalFeeding: 0,
    totalMedicine: 0,
    totalNursing: 0,
    todayFeeding: 0,
    todayMedicine: 0,
    todayNursing: 0,
    kittenCount: 0,
  });

  useEffect(() => {
    const feedingLogs = getFeedingLogs();
    const medicineLogs = getMedicineLogs();
    const nursingLogs = getNursingLogs();
    const kittens = getKittens();

    // Calculate summary
    const todayFeeding = feedingLogs.filter(l => isToday(l.recorded_at)).length;
    const todayMedicine = medicineLogs.filter(l => isToday(l.recorded_at)).length;
    const todayNursing = nursingLogs.filter(l => isToday(l.start_time)).length;

    setSummary({
      totalFeeding: feedingLogs.length,
      totalMedicine: medicineLogs.length,
      totalNursing: nursingLogs.length,
      todayFeeding,
      todayMedicine,
      todayNursing,
      kittenCount: kittens.length,
    });

    // Generate last 7 days data for charts
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push(date.toISOString().split('T')[0]);
    }

    const dayLabels = last7Days.map(d => {
      const date = new Date(d);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    // Feeding chart data
    const feedingCounts = last7Days.map(day =>
      feedingLogs.filter(l => l.recorded_at.startsWith(day)).length
    );

    setFeedingData({
      labels: dayLabels,
      datasets: [
        {
          label: '喂食次数',
          data: feedingCounts,
          borderColor: '#A78BFA',
          backgroundColor: 'rgba(167, 139, 250, 0.1)',
          fill: true,
          tension: 0.4,
        },
      ],
    });

    // Medicine chart data
    const medicineCounts = last7Days.map(day =>
      medicineLogs.filter(l => l.recorded_at.startsWith(day)).length
    );

    setMedicineData({
      labels: dayLabels,
      datasets: [
        {
          label: '喂药次数',
          data: medicineCounts,
          backgroundColor: 'rgba(249, 168, 212, 0.6)',
          borderColor: '#F9A8D4',
          borderWidth: 2,
        },
      ],
    });

    // Nursing chart data
    const nursingCounts = last7Days.map(day =>
      nursingLogs.filter(l => l.start_time.startsWith(day)).length
    );

    const nursingDurations = last7Days.map(day => {
      const dayLogs = nursingLogs.filter(l => l.start_time.startsWith(day));
      return dayLogs.reduce((sum, l) => sum + (l.duration_minutes || 0), 0);
    });

    setNursingData({
      labels: dayLabels,
      datasets: [
        {
          label: '吃奶次数',
          data: nursingCounts,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
        },
        {
          label: '总时长(分钟)',
          data: nursingDurations,
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: false,
          tension: 0.4,
          yAxisID: 'y1',
        },
      ],
    });
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: { size: 11 },
          usePointStyle: true,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: 10 } },
      },
      x: {
        ticks: { font: { size: 10 } },
      },
    },
  };

  const nursingChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y1: {
        beginAtZero: true,
        position: 'right' as const,
        ticks: { font: { size: 10 } },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen">
      <Header title="数据统计" />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Summary cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary/10 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-primary">{summary.todayFeeding}</div>
              <div className="text-xs text-muted-foreground mt-1">今日喂食</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">累计 {summary.totalFeeding}</div>
            </div>
            <div className="bg-secondary/20 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{summary.todayMedicine}</div>
              <div className="text-xs text-muted-foreground mt-1">今日喂药</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">累计 {summary.totalMedicine}</div>
            </div>
            <div className="bg-amber-100 rounded-2xl p-4 text-center">
              <div className="text-2xl font-bold text-amber-500">{summary.todayNursing}</div>
              <div className="text-xs text-muted-foreground mt-1">今日吃奶</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">累计 {summary.totalNursing}</div>
            </div>
          </div>
        </motion.div>

        {/* Charts */}
        <Tabs defaultValue="feeding">
          <TabsList className="w-full">
            <TabsTrigger value="feeding" className="flex-1">喂食</TabsTrigger>
            <TabsTrigger value="medicine" className="flex-1">喂药</TabsTrigger>
            <TabsTrigger value="nursing" className="flex-1">吃奶</TabsTrigger>
          </TabsList>

          <TabsContent value="feeding">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">近7天喂食趋势</h3>
                <div className="h-64">
                  {feedingData && <Line data={feedingData} options={chartOptions} />}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="medicine">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">近7天喂药统计</h3>
                <div className="h-64">
                  {medicineData && <Bar data={medicineData} options={chartOptions} />}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nursing">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">近7天吃奶趋势</h3>
                <div className="h-64">
                  {nursingData && <Line data={nursingData} options={nursingChartOptions} />}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Kitten stats */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4">幼崽概览</h3>
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-primary mb-2">{summary.kittenCount}</div>
              <p className="text-sm text-muted-foreground">只幼崽</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
