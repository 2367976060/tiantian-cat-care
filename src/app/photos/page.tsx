'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Plus, X, ChevronLeft, ChevronRight, Trash2, Upload } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getPhotos, addPhoto, deletePhoto } from '@/lib/storage';
import type { Photo } from '@/types';
import { PHOTO_CATEGORIES } from '@/types';
import { compressImage } from '@/utils';
import { useInView } from 'react-intersection-observer';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<Photo['category']>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(getPhotos());
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressed = await compressImage(file, 1200, 0.8);
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          addPhoto({
            url: dataUrl,
            thumbnail_url: dataUrl,
            category: uploadCategory,
            title: file.name,
          });
          setPhotos(getPhotos());
        };
        reader.readAsDataURL(compressed);
      } catch (error) {
        console.error('Failed to compress image:', error);
      }
    }
    setIsUploadOpen(false);
  };

  const openPhoto = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
  };

  const prevPhoto = () => {
    const newIndex = selectedIndex > 0 ? selectedIndex - 1 : photos.length - 1;
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const nextPhoto = () => {
    const newIndex = selectedIndex < photos.length - 1 ? selectedIndex + 1 : 0;
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  const handleDelete = () => {
    if (selectedPhoto && confirm('确定要删除这张照片吗？')) {
      deletePhoto(selectedPhoto.id);
      setPhotos(getPhotos());
      closePhoto();
    }
  };

  const getCategoryPhotos = (category: Photo['category']) => {
    if (category === 'general') return photos;
    return photos.filter(p => p.category === category);
  };

  const PhotoCard = ({ photo, index }: { photo: Photo; index: number }) => {
    const { ref, inView } = useInView({
      triggerOnce: true,
      rootMargin: '100px',
    });

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3, delay: index * 0.02 }}
        className="break-inside-avoid mb-2"
      >
        <button
          onClick={() => openPhoto(photo, index)}
          className="w-full rounded-xl overflow-hidden shadow-soft hover:shadow-card transition-shadow"
        >
          {inView && (
            <img
              src={photo.thumbnail_url || photo.url}
              alt={photo.title || ''}
              className="w-full object-cover"
              loading="lazy"
            />
          )}
        </button>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header title="照片相册" />
      <main className="max-w-md mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">照片相册</h2>
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Upload className="w-4 h-4 mr-1" />
                上传
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>上传照片</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">分类</label>
                  <div className="grid grid-cols-3 gap-2">
                    {PHOTO_CATEGORIES.filter(c => c.value !== 'general').map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => setUploadCategory(cat.value)}
                        className={`p-2 rounded-xl border-2 text-sm transition-all ${
                          uploadCategory === cat.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm font-medium">点击选择照片</p>
                  <p className="text-xs text-muted-foreground mt-1">支持批量上传</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="w-full overflow-x-auto flex-nowrap">
            {PHOTO_CATEGORIES.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value} className="flex-shrink-0">
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {PHOTO_CATEGORIES.map((cat) => {
            const categoryPhotos = getCategoryPhotos(cat.value);
            return (
              <TabsContent key={cat.value} value={cat.value}>
                {categoryPhotos.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Image className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                      <p className="text-muted-foreground">还没有照片</p>
                      <p className="text-sm text-muted-foreground mt-1">点击上方按钮上传照片</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="columns-2 gap-2">
                    {categoryPhotos.map((photo, index) => (
                      <PhotoCard key={photo.id} photo={photo} index={index} />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </main>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closePhoto}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10 z-10"
              onClick={closePhoto}
            >
              <X className="w-6 h-6" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
              onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10"
              onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-4 right-4 text-white hover:bg-white/10 z-10"
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            >
              <Trash2 className="w-5 h-5" />
            </Button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-full max-h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title || ''}
                className="max-w-full max-h-[70vh] object-contain rounded-xl"
              />
              {selectedPhoto.title && (
                <p className="text-white text-center mt-4 text-sm">{selectedPhoto.title}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
