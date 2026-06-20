'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Cat, Scale, Calendar, Plus, Edit3, Trash2 } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getKittens, saveKitten, deleteKitten } from '@/lib/storage';
import type { Kitten } from '@/types';
import { useForm } from 'react-hook-form';
import { formatDate } from '@/utils';

export default function KittensPage() {
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingKitten, setEditingKitten] = useState<Kitten | null>(null);
  const { register, handleSubmit, reset } = useForm<Partial<Kitten>>();

  useEffect(() => {
    setKittens(getKittens());
  }, []);

  const onSubmit = (data: Partial<Kitten>) => {
    if (editingKitten) {
      saveKitten({ ...data, id: editingKitten.id });
    } else {
      saveKitten(data);
    }
    setKittens(getKittens());
    setIsAddOpen(false);
    setEditingKitten(null);
    reset();
  };

  const handleEdit = (kitten: Kitten) => {
    setEditingKitten(kitten);
    setIsAddOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这只幼崽吗？')) {
      deleteKitten(id);
      setKittens(getKittens());
    }
  };

  const kittenColors = [
    'from-primary to-primary/70',
    'from-secondary to-secondary/70',
    'from-amber-400 to-amber-500',
    'from-rose-400 to-pink-500',
    'from-emerald-400 to-teal-500',
  ];

  return (
    <div className="min-h-screen">
      <Header title="幼崽管理" />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">5只幼崽</h2>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                添加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingKitten ? '编辑幼崽' : '添加幼崽'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>编号</Label>
                    <Input
                      type="number"
                      defaultValue={editingKitten?.number}
                      {...register('number', { valueAsNumber: true })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>名字</Label>
                    <Input
                      defaultValue={editingKitten?.name}
                      {...register('name')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>性别</Label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm"
                      defaultValue={editingKitten?.gender || 'unknown'}
                      {...register('gender')}
                    >
                      <option value="male">公</option>
                      <option value="female">母</option>
                      <option value="unknown">未知</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>毛色</Label>
                    <Input
                      defaultValue={editingKitten?.fur_color}
                      {...register('fur_color')}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>出生日期</Label>
                    <Input
                      type="date"
                      defaultValue={editingKitten?.birth_date}
                      {...register('birth_date')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>当前体重(g)</Label>
                    <Input
                      type="number"
                      defaultValue={editingKitten?.current_weight}
                      {...register('current_weight', { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full">
                  {editingKitten ? '保存修改' : '添加幼崽'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {kittens.map((kitten, index) => (
            <motion.div
              key={kitten.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/kittens/${kitten.id}`}>
                <Card className="hover:shadow-card transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${kittenColors[index % kittenColors.length]} flex items-center justify-center shadow-soft`}>
                        <Cat className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full">
                            {kitten.number}号
                          </span>
                          <h3 className="font-semibold">{kitten.name}</h3>
                        </div>
                        <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Scale className="w-3 h-3" />
                            <span>{kitten.current_weight || '?'}g</span>
                          </div>
                          {kitten.birth_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(kitten.birth_date)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault();
                            handleEdit(kitten);
                          }}
                        >
                          <Edit3 className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(kitten.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
