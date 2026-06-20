'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Pill, Milk, Image, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getFeedingLogs, getMedicineLogs, getNursingLogs, getPhotos } from '@/lib/storage';
import { formatTime, isToday } from '@/utils';
import type { TimelineItem } from '@/types';

export function Timeline() {
  const [items, setItems] = useState<TimelineItem[]>([]);

  useEffect(() => {
    const feedingLogs = getFeedingLogs().filter(log => isToday(log.recorded_at));
    const medicineLogs = getMedicineLogs().filter(log => isToday(log.recorded_at));
    const nursingLogs = getNursingLogs().filter(log => isToday(log.start_time));
    const photos = getPhotos().filter(photo => isToday(photo.created_at));

    const timelineItems: TimelineItem[] = [
      ...feedingLogs.map(log => ({
        id: log.id,
        type: 'feeding' as const,
        time: log.recorded_at,
        title: '甜甜喂食',
        description: `${log.amount}${log.unit} ${log.food_type === 'custom' ? log.custom_food_name : log.food_type}`,
      })),
      ...medicineLogs.map(log => ({
        id: log.id,
        type: 'medicine' as const,
        time: log.recorded_at,
        title: '喂药记录',
        description: `${log.medicine_name} ${log.dosage}`,
      })),
      ...nursingLogs.map(log => ({
        id: log.id,
        type: 'nursing' as const,
        time: log.start_time,
        title: '幼崽吃奶',
        description: `${log.kitten_ids.length}只幼崽 ${log.duration_minutes || 0}分钟`,
      })),
      ...photos.slice(0, 5).map(photo => ({
        id: photo.id,
        type: 'photo' as const,
        time: photo.created_at,
        title: '照片记录',
        description: photo.title || '新照片',
        photoUrl: photo.thumbnail_url || photo.url,
      })),
    ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    setItems(timelineItems);
  }, []);

  const getIcon = (type: TimelineItem['type']) => {
    switch (type) {
      case 'feeding':
        return <Utensils className="w-4 h-4" />;
      case 'medicine':
        return <Pill className="w-4 h-4" />;
      case 'nursing':
        return <Milk className="w-4 h-4" />;
      case 'photo':
        return <Image className="w-4 h-4" />;
    }
  };

  const getColor = (type: TimelineItem['type']) => {
    switch (type) {
      case 'feeding':
        return 'bg-primary text-white';
      case 'medicine':
        return 'bg-secondary text-white';
      case 'nursing':
        return 'bg-amber-400 text-white';
      case 'photo':
        return 'bg-rose-400 text-white';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">今日时间轴</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{items.length}条记录</span>
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">今天还没有记录哦~</p>
              <p className="text-xs mt-1">点击上方按钮开始记录吧</p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />
              <div className="space-y-4">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="flex gap-3 relative"
                  >
                    <div className={`w-10 h-10 rounded-full ${getColor(item.type)} flex items-center justify-center z-10 flex-shrink-0 shadow-soft`}>
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{item.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(item.time)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                      {item.photoUrl && (
                        <div className="mt-2">
                          <img
                            src={item.photoUrl}
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
