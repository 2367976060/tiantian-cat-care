'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Milk, Plus, Trash2, Camera, Clock, Play, Square, Timer } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getNursingLogs, addNursingLog, deleteNursingLog, getKittens } from '@/lib/storage';
import type { NursingLog, Kitten } from '@/types';
import { formatTime, formatDuration, calculateDuration } from '@/utils';

export default function NursingPage() {
  const [logs, setLogs] = useState<NursingLog[]>([]);
  const [kittens, setKittens] = useState<Kitten[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedKittens, setSelectedKittens] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [isTiming, setIsTiming] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    setLogs(getNursingLogs());
    setKittens(getKittens());
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTiming && startTime) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTiming, startTime]);

  const toggleKitten = (kittenId: string) => {
    setSelectedKittens(prev =>
      prev.includes(kittenId)
        ? prev.filter(id => id !== kittenId)
        : [...prev, kittenId]
    );
  };

  const selectAll = () => {
    if (selectedKittens.length === kittens.length) {
      setSelectedKittens([]);
    } else {
      setSelectedKittens(kittens.map(k => k.id));
    }
  };

  const startTiming = () => {
    setStartTime(new Date());
    setIsTiming(true);
    setElapsedSeconds(0);
  };

  const stopTiming = () => {
    setIsTiming(false);
  };

  const handleSubmit = () => {
    const endTime = new Date();
    const start = startTime || new Date();
    const duration = calculateDuration(start, endTime);

    addNursingLog({
      start_time: start.toISOString(),
      end_time: endTime.toISOString(),
      duration_minutes: duration,
      kitten_ids: selectedKittens,
      notes: notes,
    });

    setLogs(getNursingLogs());
    setIsAddOpen(false);
    setSelectedKittens([]);
    setNotes('');
    setStartTime(null);
    setElapsedSeconds(0);
    setIsTiming(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      deleteNursingLog(id);
      setLogs(getNursingLogs());
    }
  };

  const formatElapsedTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getKittenNames = (ids: string[]) => {
    return ids
      .map(id => kittens.find(k => k.id === id)?.name || '')
      .filter(Boolean)
      .join('、');
  };

  return (
    <div className="min-h-screen">
      <Header title="吃奶记录" />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">幼崽吃奶记录</h2>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                记录
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>记录吃奶</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* 计时器 */}
                <div className="text-center py-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Timer className="w-5 h-5 text-amber-500" />
                    <span className="text-sm text-muted-foreground">吃奶时长</span>
                  </div>
                  <div className="text-4xl font-bold text-amber-500 font-mono">
                    {formatElapsedTime(elapsedSeconds)}
                  </div>
                  <div className="flex justify-center gap-3 mt-4">
                    {!isTiming ? (
                      <Button onClick={startTiming} className="bg-amber-500 hover:bg-amber-600">
                        <Play className="w-4 h-4 mr-1" />
                        开始计时
                      </Button>
                    ) : (
                      <Button onClick={stopTiming} variant="destructive">
                        <Square className="w-4 h-4 mr-1" />
                        结束
                      </Button>
                    )}
                  </div>
                </div>

                {/* 参与幼崽 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>参与幼崽</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={selectAll}
                      className="h-7 text-xs"
                    >
                      {selectedKittens.length === kittens.length ? '取消全选' : '全选'}
                    </Button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {kittens.map((kitten) => (
                      <button
                        key={kitten.id}
                        onClick={() => toggleKitten(kitten.id)}
                        className={`p-2 rounded-xl border-2 transition-all text-center ${
                          selectedKittens.includes(kitten.id)
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="text-xs font-medium">{kitten.number}号</div>
                        <div className="text-[10px] text-muted-foreground truncate">{kitten.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>备注</Label>
                  <Textarea
                    placeholder="可选备注..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>照片</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">点击上传照片</p>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full"
                  disabled={selectedKittens.length === 0}
                >
                  保存记录
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {logs.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Milk className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-muted-foreground">还没有吃奶记录</p>
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
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Milk className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            {log.kitten_ids.length}只幼崽吃奶
                          </h4>
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
                          <span className="font-semibold text-amber-500">
                            {formatDuration(log.duration_minutes)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(log.start_time)}
                          </span>
                        </div>
                        {log.kitten_ids.length > 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {getKittenNames(log.kitten_ids)}
                          </p>
                        )}
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
