'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Pill, Plus, Trash2, Camera, Clock } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getMedicineLogs, addMedicineLog, deleteMedicineLog } from '@/lib/storage';
import type { MedicineLog } from '@/types';
import { formatTime } from '@/utils';
import { useForm } from 'react-hook-form';

interface MedicineFormData {
  medicine_name: string;
  dosage: string;
  dosage_unit: string;
  notes?: string;
}

export default function MedicinePage() {
  const [logs, setLogs] = useState<MedicineLog[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<MedicineFormData>({
    defaultValues: {
      medicine_name: '',
      dosage: '1',
      dosage_unit: '片',
    },
  });

  useEffect(() => {
    setLogs(getMedicineLogs());
  }, []);

  const onSubmit = (data: MedicineFormData) => {
    addMedicineLog({
      medicine_name: data.medicine_name,
      dosage: data.dosage,
      dosage_unit: data.dosage_unit,
      notes: data.notes,
      recorded_at: new Date().toISOString(),
    });
    setLogs(getMedicineLogs());
    setIsAddOpen(false);
    reset();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteMedicineLog(id);
      setLogs(getMedicineLogs());
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="喂药记录" />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">喂药记录</h2>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                记录
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>记录喂药</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label>药品名称</Label>
                  <Input placeholder="例如：益生菌、驱虫药" {...register('medicine_name')} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>剂量</Label>
                    <Input
                      type="text"
                      placeholder="1/2"
                      {...register('dosage')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>单位</Label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                      {...register('dosage_unit')}
                    >
                      <option value="片">片</option>
                      <option value="ml">ml</option>
                      <option value="滴">滴</option>
                      <option value="袋">袋</option>
                      <option value="粒">粒</option>
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
              <Pill className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">还没有喂药记录</p>
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
                      <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                        <Pill className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{log.medicine_name}</h4>
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
                          <span className="font-semibold text-secondary">
                            {log.dosage}{log.dosage_unit}
                          </span>
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
