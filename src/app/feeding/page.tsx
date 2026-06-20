'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Utensils, Plus, Trash2, Camera, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getFeedingLogs, addFeedingLog, deleteFeedingLog } from '@/lib/storage';
import type { FeedingLog, FoodType } from '@/types';
import { FOOD_TYPES } from '@/types';
import { formatDateTime, formatTime } from '@/utils';
import { useForm } from 'react-hook-form';

interface FeedingFormData {
  food_type: FoodType;
  custom_food_name?: string;
  amount: number;
  unit: string;
  notes?: string;
}

export default function FeedingPage() {
  const [logs, setLogs] = useState<FeedingLog[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { register, handleSubmit, reset, watch } = useForm<FeedingFormData>({
    defaultValues: {
      food_type: 'kibble',
      amount: 50,
      unit: 'g',
    },
  });

  const selectedFoodType = watch('food_type');

  useEffect(() => {
    setLogs(getFeedingLogs());
  }, []);

  const onSubmit = (data: FeedingFormData) => {
    addFeedingLog({
      food_type: data.food_type,
      custom_food_name: data.custom_food_name,
      amount: data.amount,
      unit: data.unit,
      notes: data.notes,
      recorded_at: new Date().toISOString(),
    });
    setLogs(getFeedingLogs());
    setIsAddOpen(false);
    reset();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteFeedingLog(id);
      setLogs(getFeedingLogs());
    }
  };

  const getFoodLabel = (type: string, customName?: string) => {
    if (type === 'custom') return customName || '自定义';
    const found = FOOD_TYPES.find(f => f.value === type);
    return found?.label || type;
  };

  return (
    <div className="min-h-screen">
      <Header title="喂食记录" />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">喂食记录</h2>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                记录
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>记录喂食</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>食物类型</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {FOOD_TYPES.map((food) => (
                      <label
                        key={food.value}
                        className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedFoodType === food.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          value={food.value}
                          className="sr-only"
                          {...register('food_type')}
                        />
                        <span className="text-sm font-medium">{food.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {selectedFoodType === 'custom' && (
                  <div className="space-y-2">
                    <Label>自定义食物名称</Label>
                    <Input placeholder="请输入食物名称" {...register('custom_food_name')} />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>食用量</Label>
                    <Input
                      type="number"
                      {...register('amount', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>单位</Label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                      {...register('unit')}
                    >
                      <option value="g">g (克)</option>
                      <option value="ml">ml (毫升)</option>
                      <option value="piece">块/片</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>备注</Label>
                  <Textarea placeholder="可选备注..." {...register('notes')} />
                </div>

                <div className="space-y-2">
                  <Label>照片</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">点击上传照片</p>
                    <input type="file" accept="image/*" className="hidden" />
                  </div>
                </div>

                <Button type="submit" className="w-full">保存记录</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {logs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Utensils className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">还没有喂食记录</p>
              <p className="text-sm text-muted-foreground mt-1">点击上方按钮开始记录</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {logs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Utensils className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{getFoodLabel(log.food_type, log.custom_food_name)}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDelete(log.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          <span className="font-semibold text-primary">{log.amount}{log.unit}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(log.recorded_at)}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{log.notes}</p>
                        )}
                      </div>
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
