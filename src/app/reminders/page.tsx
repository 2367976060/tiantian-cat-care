'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Plus, Trash2, Clock, Utensils, Pill, Milk, Settings } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getReminders, addReminder, deleteReminder, updateReminder } from '@/lib/storage';
import type { Reminder } from '@/types';
import { useForm } from 'react-hook-form';

interface ReminderFormData {
  title: string;
  type: 'feeding' | 'medicine' | 'nursing' | 'custom';
  reminder_time: string;
  description?: string;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const { register, handleSubmit, reset } = useForm<ReminderFormData>({
    defaultValues: {
      type: 'feeding',
      reminder_time: '08:00',
    },
  });

  useEffect(() => {
    setReminders(getReminders());
    
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission as any);
    }
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission as any);
    }
  };

  const onSubmit = (data: ReminderFormData) => {
    addReminder({
      title: data.title,
      type: data.type,
      description: data.description,
      reminder_time: data.reminder_time,
      repeat_days: [0, 1, 2, 3, 4, 5, 6],
      start_date: new Date().toISOString().split('T')[0],
      is_active: true,
      notification_sent: false,
    });
    setReminders(getReminders());
    setIsAddOpen(false);
    reset();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个提醒吗？')) {
      deleteReminder(id);
      setReminders(getReminders());
    }
  };

  const toggleReminder = (id: string, isActive: boolean) => {
    updateReminder(id, { is_active: isActive });
    setReminders(getReminders());
  };

  const getTypeIcon = (type: Reminder['type']) => {
    switch (type) {
      case 'feeding':
        return <Utensils className="w-5 h-5" />;
      case 'medicine':
        return <Pill className="w-5 h-5" />;
      case 'nursing':
        return <Milk className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: Reminder['type']) => {
    switch (type) {
      case 'feeding':
        return 'bg-primary/10 text-primary';
      case 'medicine':
        return 'bg-secondary/20 text-secondary';
      case 'nursing':
        return 'bg-amber-100 text-amber-500';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeLabel = (type: Reminder['type']) => {
    switch (type) {
      case 'feeding':
        return '喂食提醒';
      case 'medicine':
        return '喂药提醒';
      case 'nursing':
        return '吃奶提醒';
      default:
        return '自定义提醒';
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="提醒设置" />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* Notification permission */}
        {notificationPermission !== 'granted' && (
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm">开启通知权限</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    开启后可以在到点时收到提醒通知
                  </p>
                  <Button
                    size="sm"
                    className="mt-2 bg-amber-500 hover:bg-amber-600"
                    onClick={requestNotificationPermission}
                  >
                    开启通知
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">我的提醒</h2>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                添加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>添加提醒</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>提醒类型</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'feeding', label: '喂食', icon: Utensils },
                      { value: 'medicine', label: '喂药', icon: Pill },
                      { value: 'nursing', label: '吃奶', icon: Milk },
                      { value: 'custom', label: '自定义', icon: Bell },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <label
                          key={item.value}
                          className="flex flex-col items-center p-3 rounded-xl border-2 cursor-pointer transition-all"
                        >
                          <input
                            type="radio"
                            value={item.value}
                            className="sr-only"
                            {...register('type')}
                          />
                          <Icon className="w-5 h-5 mb-1" />
                          <span className="text-xs">{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>提醒标题</Label>
                  <Input placeholder="例如：早餐时间" {...register('title')} />
                </div>

                <div className="space-y-2">
                  <Label>提醒时间</Label>
                  <Input type="time" {...register('reminder_time')} />
                </div>

                <div className="space-y-2">
                  <Label>备注（可选）</Label>
                  <Input placeholder="备注信息" {...register('description')} />
                </div>

                <Button type="submit" className="w-full">添加提醒</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {reminders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">还没有设置提醒</p>
              <p className="text-sm text-muted-foreground mt-1">点击上方按钮添加提醒</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {reminders.map((reminder, index) => (
              <motion.div
                key={reminder.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <Card className={!reminder.is_active ? 'opacity-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${getTypeColor(reminder.type)} flex items-center justify-center flex-shrink-0`}>
                        {getTypeIcon(reminder.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{reminder.title}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDelete(reminder.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {getTypeLabel(reminder.type)}
                          </span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                            <Clock className="w-3 h-3" />
                            {reminder.reminder_time}
                          </span>
                        </div>
                        {reminder.description && (
                          <p className="text-xs text-muted-foreground mt-1">{reminder.description}</p>
                        )}
                      </div>
                      <Switch
                        checked={reminder.is_active}
                        onCheckedChange={(checked) => toggleReminder(reminder.id, checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
