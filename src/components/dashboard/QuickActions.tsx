'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Utensils, Pill, Milk, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

const actions = [
  { label: '记录喂食', icon: Utensils, href: '/feeding', color: 'from-primary to-primary/80', bg: 'bg-primary' },
  { label: '记录喂药', icon: Pill, href: '/medicine', color: 'from-secondary to-secondary/80', bg: 'bg-secondary' },
  { label: '记录吃奶', icon: Milk, href: '/nursing', color: 'from-amber-400 to-amber-500', bg: 'bg-amber-400' },
  { label: '上传照片', icon: Camera, href: '/photos', color: 'from-rose-400 to-pink-500', bg: 'bg-rose-400' },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="grid grid-cols-4 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href={action.href}>
                <Button
                  variant="default"
                  className={`w-full h-auto flex flex-col items-center justify-center py-4 px-2 ${action.bg} shadow-soft hover:shadow-card`}
                  style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xs font-medium text-white">{action.label}</span>
                </Button>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
