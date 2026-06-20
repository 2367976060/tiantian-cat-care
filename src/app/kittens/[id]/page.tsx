'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Cat, Scale, Calendar, TrendingUp, Image, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getKittens, getWeightRecords, getNursingLogs, getPhotos, addWeightRecord } from '@/lib/storage';
import type { Kitten, WeightRecord } from '@/types';
import { formatDate, formatDuration } from '@/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function KittenDetailPage() {
  const params = useParams();
  const [kitten, setKitten] = useState<Kitten | null>(null);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);
  const [nursingCount, setNursingCount] = useState(0);
  const [photos, setPhotos] = useState<any[]>([]);
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [weightInput, setWeightInput] = useState('');

  useEffect(() => {
    const id = params?.id as string;
    const kittens = getKittens();
    const found = kittens.find(k => k.id === id);
    setKitten(found || null);

    if (found) {
      setWeightRecords(getWeightRecords(found.id));
      const allNursing = getNursingLogs();
      const count = allNursing.filter(log => log.kitten_ids.includes(found.id)).length;
      setNursingCount(count);
      setPhotos(getPhotos().filter(p => p.category === 'kittens').slice(0, 9));
    }
  }, [params?.id]);

  const handleAddWeight = () => {
    if (kitten && weightInput) {
      addWeightRecord({
        kitten_id: kitten.id,
        weight: parseFloat(weightInput),
        recorded_at: new Date().toISOString(),
      });
      setWeightRecords(getWeightRecords(kitten.id));
      setIsWeightOpen(false);
      setWeightInput('');
    }
  };

  if (!kitten) {
    return (
      <div className="min-h-screen">
        <Header title="幼崽详情" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">幼崽不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title={kitten.name} showBack />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* 幼崽信息卡 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-cream border-0">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
                  <Cat className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/80 text-primary px-2 py-0.5 rounded-full font-medium">
                      {kitten.number}号
                    </span>
                    <h2 className="text-xl font-bold">{kitten.name}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{kitten.fur_color}</p>
                  <div className="flex gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Scale className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{kitten.current_weight || '?'}g</span>
                    </div>
                    {kitten.birth_date && (
                      <div className="flex items-center gap-1.5 text-sm">
                        <Calendar className="w-4 h-4 text-secondary" />
                        <span className="text-muted-foreground">{formatDate(kitten.birth_date)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 统计概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary/10 rounded-2xl p-4 text-center">
              <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
              <div className="text-xl font-bold text-primary">{weightRecords.length}</div>
              <div className="text-xs text-muted-foreground">体重记录</div>
            </div>
            <div className="bg-secondary/20 rounded-2xl p-4 text-center">
              <Cat className="w-5 h-5 text-secondary mx-auto mb-2" />
              <div className="text-xl font-bold text-secondary">{nursingCount}</div>
              <div className="text-xs text-muted-foreground">吃奶次数</div>
            </div>
            <div className="bg-amber-100 rounded-2xl p-4 text-center">
              <Image className="w-5 h-5 text-amber-500 mx-auto mb-2" />
              <div className="text-xl font-bold text-amber-500">{photos.length}</div>
              <div className="text-xs text-muted-foreground">照片</div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="growth">
          <TabsList className="w-full">
            <TabsTrigger value="growth" className="flex-1">成长记录</TabsTrigger>
            <TabsTrigger value="nursing" className="flex-1">吃奶统计</TabsTrigger>
            <TabsTrigger value="photos" className="flex-1">照片墙</TabsTrigger>
          </TabsList>

          <TabsContent value="growth">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">体重记录</h3>
                  <Dialog open={isWeightOpen} onOpenChange={setIsWeightOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        记录
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>记录体重</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>体重 (g)</Label>
                          <Input
                            type="number"
                            value={weightInput}
                            onChange={(e) => setWeightInput(e.target.value)}
                            placeholder="输入体重"
                          />
                        </div>
                        <Button onClick={handleAddWeight} className="w-full">
                          保存记录
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {weightRecords.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Scale className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">还没有体重记录</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {weightRecords.slice().reverse().map((record, index) => (
                      <div key={record.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(record.recorded_at)}
                        </span>
                        <span className="font-semibold text-primary">{record.weight}g</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nursing">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">吃奶统计</h3>
                <div className="text-center py-8">
                  <div className="text-4xl font-bold text-primary mb-2">{nursingCount}</div>
                  <p className="text-sm text-muted-foreground">累计吃奶次数</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <div className="grid grid-cols-3 gap-2">
              {photos.map((photo) => (
                <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-muted">
                  {photo.url ? (
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              ))}
              {photos.length === 0 && (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">还没有照片</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
