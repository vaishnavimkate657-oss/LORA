import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOOD_CATEGORIES } from '../../constants/theme';
import { destinationService } from '../../services/destinationService';
import { formatCurrency, formatRating, formatReviewsCount } from '../../utils/formatters';
import { Spinner } from '../../components/common/Spinner';

export const ExplorePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const res = await destinationService.getAll({
          category: selectedCategory === 'All' ? null : selectedCategory,
        });
        if (res?.data) {
          setDestinations(res.data);
        }
      } catch (err) {
        console.error('Failed to load explore destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [selectedCategory]);

  return (
    <div className="max-w-container-max mx-auto px-gutter-desktop py-space-xl">
      {/* Header Banner */}
      <div className="mb-space-xl">
        <span className="font-label-caps text-label-caps text-primary uppercase">Curated Catalog</span>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1">
          Explore Journeys by Style &amp; Mood
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-2">
          Whether you crave high-altitude adrenaline, tranquil backwaters, remote working beach villas, or cultural palaces — browse wanderer-approved routes.
        </p>
      </div>

      {/* Categories Horizontal Carousel */}
      <div className="flex items-center gap-space-xs overflow-x-auto pb-4 mb-space-lg">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`shrink-0 px-space-md py-space-xs rounded-full font-title-sm text-sm transition-all ${
            selectedCategory === 'All'
              ? 'bg-primary text-on-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
          }`}
        >
          All Styles
        </button>
        {MOOD_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.title)}
            className={`shrink-0 px-space-md py-space-xs rounded-full font-title-sm text-sm transition-all flex items-center gap-2 ${
              selectedCategory === cat.title
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-base">{cat.icon}</span>
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* Grid of Results */}
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(15,23,42,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-60 w-full overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={dest.imageUrl}
                  alt={dest.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-background/70 via-transparent to-transparent"></div>
                <span className="absolute top-4 left-4 px-space-sm py-1 rounded-full bg-surface-container-lowest/80 backdrop-blur-md font-label-caps text-label-caps uppercase text-primary">
                  {dest.category}
                </span>
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-on-primary">
                  <div>
                    <span className="font-label-caps text-label-caps text-surface-variant uppercase">{dest.locationState}</span>
                    <h3 className="font-headline-md text-headline-md font-bold">{dest.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-lowest/20 backdrop-blur-md px-space-xs py-1 rounded-full text-xs font-semibold">
                    <span className="material-symbols-outlined text-sm text-tertiary-fixed-dim" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                    <span>{formatRating(dest.rating)}</span>
                    <span className="text-surface-variant font-normal">({formatReviewsCount(dest.reviewsCount)})</span>
                  </div>
                </div>
              </div>
              <div className="p-space-md flex flex-col flex-1 justify-between">
                <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                  {dest.description}
                </p>
                <div className="flex items-center justify-between pt-space-xs bg-surface-container-low/40 p-space-sm rounded-2xl">
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Starting from</span>
                    <div className="font-headline-md text-headline-md text-on-surface font-bold">
                      {formatCurrency(dest.startingPrice)} <span className="text-xs font-normal text-on-surface-variant">/person</span>
                    </div>
                  </div>
                  <Link
                    to={`/destinations?search=${encodeURIComponent(dest.title)}`}
                    className="px-space-md py-space-xs bg-primary text-on-primary rounded-full font-title-sm text-title-sm hover:bg-primary-container transition-colors shadow-sm"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
