import { useState, useCallback, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OUTFITS, POSES, getImageUrl } from './data';

export default function App() {
  const [activeOutfit, setActiveOutfit] = useState(OUTFITS[0]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Handle keyboard navigation for the lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev !== null && prev < POSES.length - 1 ? prev + 1 : prev));
  }, []);

  return (
    <div className="min-h-screen font-sans pb-20">
      {/* Header and Outfit Filters */}
      <header className="bg-white/70 backdrop-blur-md sticky top-0 z-10 border-b border-rose-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6 flex flex-col items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-serif text-rose-800 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400 fill-rose-200" />
            컬렉션 앨범
            <Heart className="w-5 h-5 text-rose-400 fill-rose-200" />
          </h1>

          {/* Outfit Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {OUTFITS.map((outfit) => (
              <button
                key={outfit.id}
                onClick={() => setActiveOutfit(outfit)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 font-medium whitespace-nowrap
                  ${
                    activeOutfit.id === outfit.id
                      ? 'bg-rose-400 text-white shadow-md shadow-rose-200 scale-105'
                      : 'bg-white text-stone-600 hover:bg-rose-50 border border-rose-100 hover:text-rose-500'
                  }`}
              >
                {outfit.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Gallery Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {POSES.map((pose, index) => (
            <GalleryImage
              key={`${activeOutfit.id}-${pose.id}`}
              outfit={activeOutfit}
              pose={pose}
              index={index}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>
      </main>

      {/* Lightbox / Modal Modal Viewer */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#faf6f0]/95 backdrop-blur-sm p-4"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 text-stone-500 hover:text-rose-500 p-2 transition-colors duration-200"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-8 h-8" />
            </button>

            <div className="relative rounded-lg overflow-hidden bg-white shadow-xl ring-4 ring-rose-100 p-2">
              <img
                src={getImageUrl(activeOutfit.id, POSES[selectedIndex].id)}
                alt={POSES[selectedIndex].name}
                className="max-w-full max-h-[75vh] object-contain rounded"
              />
            </div>

            <div className="mt-4 text-center">
              <p className="text-rose-700 font-serif text-xl tracking-wide font-medium">
                {POSES[selectedIndex].name}
              </p>
              <p className="text-stone-400 text-sm mt-1">
                {selectedIndex + 1} / {POSES.length}
              </p>
            </div>

            {/* Navigation Arrows */}
            {selectedIndex > 0 && (
              <button
                className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 p-3 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all bg-white/50 backdrop-blur"
                onClick={handlePrev}
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            {selectedIndex < POSES.length - 1 && (
              <button
                className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 p-3 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all bg-white/50 backdrop-blur"
                onClick={handleNext}
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Individual Gallery Card Component
const GalleryImage = ({ outfit, pose, index, onClick }: any) => {
  const [hasError, setHasError] = useState(false);
  const url = getImageUrl(outfit.id, pose.id);

  // If the image image fails to load significantly, we hide the card entirely 
  // (to prevent broken image icons if specific poses don't exist for an outfit).
  if (hasError) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.02 }}
      className="group cursor-pointer bg-white p-3 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-stone-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
      onClick={onClick}
    >
      <div className="aspect-[3/4] bg-stone-50 rounded-lg overflow-hidden relative shadow-inner">
        {/* Loading skeleton placeholder */}
        <div className="absolute inset-0 bg-rose-50 animate-pulse -z-10" />
        <img
          src={url}
          alt={pose.name}
          loading="lazy"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 text-center">
        <span className="inline-block px-3 py-1 bg-rose-50 text-rose-800 rounded-full text-xs font-serif font-medium group-hover:bg-rose-100 transition-colors">
          #{pose.id} {pose.name}
        </span>
      </div>
    </motion.div>
  );
};
