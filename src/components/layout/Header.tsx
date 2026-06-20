'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings, Moon, Sun, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTheme, setTheme } from '@/lib/storage';
import { cn } from '@/utils';

interface HeaderProps {
  title: string;
  showBack?: boolean;
}

export function Header({ title, showBack = false }: HeaderProps) {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const savedTheme = getTheme();
    setThemeState(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(newTheme);
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border safe-top">
      <div className="flex items-center justify-between h-14 px-4 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          {showBack && (
            <Link href="javascript:history.back()" className="mr-1">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </Button>
            </Link>
          )}
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-1">
          {!isOnline && (
            <div className="flex items-center gap-1 text-amber-500 text-xs mr-2">
              <WifiOff className="w-4 h-4" />
              <span>离线</span>
            </div>
          )}
          {isOnline && (
            <Wifi className="w-4 h-4 text-green-500 mr-2" />
          )}
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
