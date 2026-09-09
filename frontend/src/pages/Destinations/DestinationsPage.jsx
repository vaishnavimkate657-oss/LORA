import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { destinationService } from '../../services/destinationService';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { formatCurrency, formatRating, formatReviewsCount } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';

export const DestinationsPage = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('rating');

  // Detail Modal
  const [selectedDest, setSelectedDest] = useState(null);

  // Add Destination Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    locationState: '',
    country: 'India',
    category: 'Adventure & Snow',
    description: '',
    startingPrice: 300,
    imageUrl: '',
    isTrending: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const { isAuthenticated } = useAuth();

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await destinationService.getAll({
        search: searchTerm || null,
        category: selectedCategory === 'All' ? null : selectedCategory,
      });
      if (res?.data) {
        let list = [...res.data];
        if (sortBy === 'price-low') {
          list.sort((a, b) => a.startingPrice - b.startingPrice);
        } else if (sortBy === 'price-high') {
          list.sort((a, b) => b.startingPrice - a.startingPrice);
        } else if (sortBy === 'rating') {
          list.sort((a, b) => b.rating - a.rating);
        }
        setDestinations(list);
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [searchTerm, selectedCategory, sortBy]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await destinationService.create({
        ...formData,
        startingPrice: Number(formData.startingPrice),
        rating: 5.0,
        reviewsCount: 1,
      });
      setAddModalOpen(false);
      setFormData({
        title: '',
        locationState: '',
        country: 'India',
        category: 'Adventure & Snow',
        description: '',
        startingPrice: 300,
        imageUrl: '',
        isTrending: false,
      });
      fetchDestinations();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create destination.');
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    'All',
    'Beach & Nightlife',
    'Adventure & Snow',
    'Scenic Valley',
    'Culture & Royalty',
    'Serene Nature',
    'Epic Roadtrip',
  ];

  return (
    <div className="max-w-container-max mx-auto px-gutter-desktop py-space-xl">
      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
        <div>
          <span className="font-label-caps text-label-caps text-primary uppercase">Destination Hub</span>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1">
            Browse All Global Destinations
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-1">
            Compare traveler ratings, starting budgets, and find curated travel companions for each location.
          </p>
        </div>

        <Button
          variant="primary"
          icon="add"
          onClick={() => setAddModalOpen(true)}
        >
          Add Destination
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-space-md bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] mb-space-xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
          <div className="md:col-span-8">
            <Input
              icon="search"
              placeholder="Search by city, region, or keyword (e.g. Manali, Goa, Dal Lake)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="md:col-span-4 flex items-center gap-2">
            <span className="text-xs font-semibold text-on-surface-variant shrink-0">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2.5 bg-surface-container-low rounded-2xl text-on-surface font-title-sm text-sm focus:outline-none cursor-pointer"
            >
              <option value="rating">Top Rated (Highest First)</option>
              <option value="price-low">Budget: Low to High</option>
              <option value="price-high">Budget: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full font-title-sm text-xs transition-all ${
                selectedCategory === cat
                  ? 'bg-secondary-container text-on-secondary-container font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(15,23,42,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
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
                <div className="p-space-md">
                  <p className="font-body-md text-body-md text-on-surface-variant mb-space-md line-clamp-2">
                    {dest.description}
                  </p>
                </div>
              </div>

              <div className="p-space-md pt-0">
                <div className="flex items-center justify-between pt-space-xs bg-surface-container-low/40 p-space-sm rounded-2xl">
                  <div>
                    <span className="font-label-caps text-label-caps text-on-surface-variant">Starting from</span>
                    <div className="font-headline-md text-headline-md text-on-surface font-bold">
                      {formatCurrency(dest.startingPrice)} <span className="text-xs font-normal text-on-surface-variant">/person</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDest(dest)}
                    className="px-space-md py-space-xs bg-primary text-on-primary rounded-full font-title-sm text-title-sm hover:bg-primary-container transition-colors shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedDest}
        onClose={() => setSelectedDest(null)}
        title={selectedDest?.title || 'Destination Details'}
      >
        {selectedDest && (
          <div className="space-y-4">
            <img
              src={selectedDest.imageUrl}
              alt=""
              className="w-full h-52 object-cover rounded-2xl"
            />
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                {selectedDest.category}
              </span>
              <div className="flex items-center gap-1 text-sm font-semibold">
                <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span>{formatRating(selectedDest.rating)}</span>
                <span className="text-on-surface-variant text-xs">({formatReviewsCount(selectedDest.reviewsCount)} wanderer reviews)</span>
              </div>
            </div>
            <div>
              <h4 className="font-title-sm text-on-surface">About {selectedDest.title}</h4>
              <p className="text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                {selectedDest.description}
              </p>
            </div>
            <div className="p-3 bg-surface-container-low rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs text-on-surface-variant">Est. Base Package</span>
                <p className="text-lg font-bold text-primary">{formatCurrency(selectedDest.startingPrice)} / nomad</p>
              </div>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedDest(null);
                  window.location.href = `/partners?destination=${encodeURIComponent(selectedDest.title)}`;
                }}
                icon="person_search"
              >
                Find Buddies
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Destination Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Destination"
      >
        <form onSubmit={handleAddSubmit} className="space-y-3">
          <Input
            label="Destination Name"
            placeholder="e.g. Rishikesh, Pondicherry"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Region / State"
              placeholder="e.g. Uttarakhand"
              value={formData.locationState}
              onChange={(e) => setFormData({ ...formData, locationState: e.target.value })}
              required
            />
            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full p-2.5 bg-surface-container-low rounded-2xl text-on-surface text-sm focus:outline-none"
            >
              {categories.filter(c => c !== 'All').map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Input
            label="Starting Price ($)"
            type="number"
            value={formData.startingPrice}
            onChange={(e) => setFormData({ ...formData, startingPrice: e.target.value })}
            required
          />
          <Input
            label="Cover Image URL"
            placeholder="https://..."
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            required
          />
          <div>
            <label className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider block mb-1">
              Description
            </label>
            <textarea
              rows="3"
              className="w-full p-3 bg-surface-container-low rounded-2xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
              placeholder="Highlight key attractions, vibe, and companion match reasons..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit" variant="primary" loading={submitting} className="w-full" icon="add_location">
            Create Destination
          </Button>
        </form>
      </Modal>
    </div>
  );
};
