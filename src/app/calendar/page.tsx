'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Utensils, Pill, Milk, Calendar as CalendarIcon } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getFeedingLogs, getMedicineLogs, getNursingLogs } from '@/lib/storage';
import { getDaysInMonth, getFirstDayOfMonth, formatDate, formatTime } from '@/utils';

interface DayRecord {
  feeding: number;
  medicine: number;
  nursing: number;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [monthRecords, setMonthRecords] = useState<Record<string, DayRecord>>({});
  const [selectedDayRecords, setSelectedDayRecords] = useState<{
    feeding: any[];
    medicine: any[];
    nursing: any[];
  }>({ feeding: [], medicine: [], nursing: [] });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  useEffect(() => {
    const feedingLogs = getFeedingLogs();
    const medicineLogs = getMedicineLogs();
    const nursingLogs = getNursingLogs();

    const records: Record<string, DayRecord> = {};

    feedingLogs.forEach(log => {
      const date = new Date(log.recorded_at).toDateString();
      if (!records[date]) records[date] = { feeding: 0, medicine: 0, nursing: 0 };
      records[date].feeding++;
    });

    medicineLogs.forEach(log => {
      const date = new Date(log.recorded_at).toDateString();
      if (!records[date]) records[date] = { feeding: 0, medicine: 0, nursing: 0 };
      records[date].medicine++;
    });

    nursingLogs.forEach(log => {
      const date = new Date(log.start_time).toDateString();
      if (!records[date]) records[date] = { feeding: 0, medicine: 0, nursing: 0 };
      records[date].nursing++;
    });

    setMonthRecords(records);
  }, [currentDate]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);

    const feeding = getFeedingLogs().filter(log => {
      const logDate = new Date(log.recorded_at).toISOString().split('T')[0];
      return logDate === dateStr;
    });

    const medicine = getMedicineLogs().filter(log => {
      const logDate = new Date(log.recorded_at).toISOString().split('T')[0];
      return logDate === dateStr;
    });

    const nursing = getNursingLogs().filter(log => {
      const logDate = new Date(log.start_time).toISOString().split('T')[0];
      return logDate === dateStr;
    });

    setSelectedDayRecords({ feeding, medicine, nursing });
    setIsDetailOpen(true);
  };

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
  const today = new Date().toDateString();

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  return (
    <div className="min-h-screen">
      <Header title="日历记录" />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        <Card>
          <CardContent className="p-4">
            {/* Month header */}
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold">
                {year}年 {monthNames[month]}
              </h2>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-xs text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const date = new Date(year, month, day);
                const dateStr = date.toDateString();
                const isToday = dateStr === today;
                const records = monthRecords[dateStr];
                const hasRecords = records && (records.feeding > 0 || records.medicine > 0 || records.nursing > 0);

                return (
                  <motion.button
                    key={day}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDayClick(day)}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all ${
                      isToday
                        ? 'bg-primary text-white font-bold'
                        : hasRecords
                        ? 'bg-primary/10 hover:bg-primary/20'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <span>{day}</span>
                    {hasRecords && (
                      <div className="flex gap-0.5 mt-0.5">
                        {records.feeding > 0 && <span className="w-1 h-1 rounded-full bg-primary" />}
                        {records.medicine > 0 && <span className="w-1 h-1 rounded-full bg-secondary" />}
                        {records.nursing > 0 && <span className="w-1 h-1 rounded-full bg-amber-400" />}
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">喂食</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="text-xs text-muted-foreground">喂药</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-xs text-muted-foreground">吃奶</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day detail dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedDate && formatDate(selectedDate)}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {selectedDayRecords.feeding.length === 0 &&
               selectedDayRecords.medicine.length === 0 &&
               selectedDayRecords.nursing.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">这一天没有记录</p>
                </div>
              ) : (
                <>
                  {selectedDayRecords.feeding.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Utensils className="w-4 h-4 text-primary" />
                        喂食 ({selectedDayRecords.feeding.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedDayRecords.feeding.map((log: any) => (
                          <div key={log.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <span className="text-sm">{log.food_type}</span>
                            <span className="text-xs text-muted-foreground">{formatTime(log.recorded_at)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDayRecords.medicine.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Pill className="w-4 h-4 text-secondary" />
                        喂药 ({selectedDayRecords.medicine.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedDayRecords.medicine.map((log: any) => (
                          <div key={log.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <span className="text-sm">{log.medicine_name}</span>
                            <span className="text-xs text-muted-foreground">{formatTime(log.recorded_at)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDayRecords.nursing.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <Milk className="w-4 h-4 text-amber-500" />
                        吃奶 ({selectedDayRecords.nursing.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedDayRecords.nursing.map((log: any) => (
                          <div key={log.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <span className="text-sm">{log.kitten_ids.length}只幼崽</span>
                            <span className="text-xs text-muted-foreground">{formatTime(log.start_time)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
