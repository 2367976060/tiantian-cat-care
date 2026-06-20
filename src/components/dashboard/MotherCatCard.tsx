'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cat, Scale, Calendar, Edit3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getMotherCat, saveMotherCat } from '@/lib/storage';
import type { MotherCat } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

export function MotherCatCard() {
  const [cat, setCat] = useState<MotherCat | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm<Partial<MotherCat>>();

  useEffect(() => {
    const motherCat = getMotherCat();
    if (!motherCat) {
      // Initialize with default
      const defaultCat = saveMotherCat({
        name: '甜甜',
        breed: '英国短毛猫',
        age_months: 24,
        weight: 4.5,
      });
      setCat(defaultCat);
    } else {
      setCat(motherCat);
    }
  }, []);

  const onSubmit = (data: Partial<MotherCat>) => {
    const updated = saveMotherCat(data);
    setCat(updated);
    setIsEditOpen(false);
  };

  if (!cat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-cream border-0 overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
              <Cat className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">{cat.name}</h2>
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit3 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>编辑母猫信息</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                      <div className="space-y-2">
                        <Label>名字</Label>
                        <Input defaultValue={cat.name} {...register('name')} />
                      </div>
                      <div className="space-y-2">
                        <Label>品种</Label>
                        <Input defaultValue={cat.breed} {...register('breed')} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>年龄（月）</Label>
                          <Input
                            type="number"
                            defaultValue={cat.age_months}
                            {...register('age_months', { valueAsNumber: true })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>体重（kg）</Label>
                          <Input
                            type="number"
                            step="0.1"
                            defaultValue={cat.weight}
                            {...register('weight', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">保存</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{cat.breed}</p>
              <div className="flex gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-sm">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{cat.age_months}个月</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <Scale className="w-4 h-4 text-secondary" />
                  <span className="text-muted-foreground">{cat.weight}kg</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
