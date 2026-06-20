'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Database,
  Moon,
  Sun,
  Info,
  Heart,
  Trash2,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { exportAllData, importAllData, getTheme, setTheme } from '@/lib/storage';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return getTheme();
    }
    return 'light';
  });
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const router = useRouter();

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `甜甜育儿记录_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importText.trim()) {
      const success = importAllData(importText);
      if (success) {
        alert('数据导入成功！');
        setIsImportOpen(false);
        setImportText('');
        router.refresh();
      } else {
        alert('数据导入失败，请检查文件格式');
      }
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImportText(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleClearData = () => {
    if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
      if (confirm('再次确认：真的要删除所有记录吗？')) {
        localStorage.clear();
        alert('数据已清除，页面即将刷新');
        window.location.reload();
      }
    }
  };

  const settingsItems = [
    {
      icon: theme === 'light' ? Sun : Moon,
      label: '深色模式',
      value: theme === 'dark' ? '开启' : '关闭',
      onClick: toggleTheme,
      color: 'bg-primary/10 text-primary',
    },
    {
      icon: Download,
      label: '导出数据',
      value: 'JSON',
      onClick: handleExport,
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Upload,
      label: '导入数据',
      value: 'JSON',
      onClick: () => setIsImportOpen(true),
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Trash2,
      label: '清除数据',
      value: '危险操作',
      onClick: handleClearData,
      color: 'bg-red-100 text-red-600',
      danger: true,
    },
  ];

  return (
    <div className="min-h-screen">
      <Header title="设置" />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        {/* App info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-cream border-0">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold">甜甜育儿记录本</h2>
              <p className="text-sm text-muted-foreground mt-1">
                用心记录每一刻成长
              </p>
              <p className="text-xs text-muted-foreground mt-2">版本 1.0.0</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Settings list */}
        <Card>
          <CardContent className="p-0">
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  onClick={item.onClick}
                  className={`w-full flex items-center gap-3 p-4 border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors ${
                    item.danger ? 'text-destructive' : ''
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{item.value}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="m9 18 6-6-6-6"/></svg>
                </motion.button>
              );
            })}
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">关于</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  本应用数据默认存储在本地浏览器中，建议定期导出备份。
                  如需云端同步，请配置 Supabase 服务。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Import dialog */}
        <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>导入数据</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">选择文件</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">或粘贴JSON数据</label>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="粘贴JSON数据..."
                  className="w-full h-32 rounded-xl border border-input p-3 text-sm"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsImportOpen(false)}
                >
                  取消
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleImport}
                  disabled={!importText.trim()}
                >
                  导入
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
