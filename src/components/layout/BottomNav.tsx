'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Cat, Utensils, Pill, Calendar, BarChart3, Image, Bell } from 'lucide-react';
import { cn } from '@/utils';
import { motion } from 'framer-motion';

const navItems = [
  { href: '/', label: '首页', icon: Home },
  { href: '/kittens', label: '幼崽', icon: Cat },
  { href: '/feeding', label: '喂食', icon: Utensils },
  { href: '/medicine', label: '喂药', icon: Pill },
  { href: '/photos', label: '相册', icon: Image },
  { href: '/calendar', label: '日历', icon: Calendar },
  { href: '/stats', label: '统计', icon: BarChart3 },
  { href: '/reminders', label: '提醒', icon: Bell },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border safe-bottom">
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <Icon className={cn('w-5 h-5', isActive && 'stroke-[2.5px]')} />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </motion.div>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
