import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { partnerService } from '../../services/partnerService';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency } from '../../utils/formatters';

export const TravelPartnersPage = () => {
  const [searchParams] = useSearchParams();
  const initialDestination = searchParams.get('destination') || '';

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterDestination, setFilterDestination] = useState(initialDestination);
  const [filterGender, setFilterGender] = useState('Any');
  const [filterStyle, setFilterStyle] = useState('');

  // Connect Modal
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [connectSuccess, setConnectSuccess] = useState(false);

  // Post Trip Modal
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [postForm, setPostForm] = useState({
    destination: '',
    travelStyle: 'Backpacker • Trekking',
    minBudget: 350,
    maxBudget: 550,
    dateRange: 'Nov 15 - Nov 25',
    note: '',
    preferredGender: 'Any',
  });
  const [posting, setPosting] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const res = await partnerService.getAll({
        destination: filterDestination || null,
        gender: filterGender === 'Any' ? null : filterGender,
        style: filterStyle || null,
      });
      if (res?.data) {
        setPartners(res.data);
      }
    } catch (err) {
      console.error('Failed to load partners:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [filterDestination, filterGender, filterStyle]);

  const handleConnectClick = (partner) => {
    setSelectedPartner(partner);
    setConnectMessage(`Hi ${partner.userName}! I would love to connect and talk about your trip to ${partner.destination}.`);
    setConnectSuccess(false);
    setConnectModalOpen(true);
  };

  const submitConnect = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await partnerService.sendConnectionRequest({
        partnerPostId: selectedPartner.id,
        message: connectMessage,
      });
      setConnectSuccess(true);
      setTimeout(() => setConnectModalOpen(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request.');
    }
  };

  const submitPostPlan = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setPosting(true);
    try {
      await partnerService.create({
        ...postForm,
        minBudget: Number(postForm.minBudget),
        maxBudget: Number(postForm.maxBudget),
      });
      setPostModalOpen(false);
      setPostForm({
        destination: '',
        travelStyle: 'Backpacker • Trekking',
        minBudget: 350,
        maxBudget: 550,
        dateRange: 'Nov 15 - Nov 25',
        note: '',
        preferredGender: 'Any',
      });
      fetchPartners();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish trip post.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-gutter-desktop py-space-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-md gap-space-sm">
        <div>
          <div className="inline-flex items-center gap-space-2xs text-tertiary font-title-sm text-title-sm mb-space-2xs">
            <span className="material-symbols-outlined text-lg">supervised_user_circle</span>
            Global Wanderers Network
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
            Find Your Ideal Travel Companion
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-space-2xs">
            Connect with verified solo wanderers, co-explorers, and small groups heading your exact direction.
          </p>
        </div>
        <Button
          variant="secondary"
          icon="add_circle"
          onClick={() => {
            if (!isAuthenticated) navigate('/login');
            else setPostModalOpen(true);
          }}
        >
          Post Your Trip Plan
        </Button>
      </div>

      {/* Filter Bar with Quick Chips */}
      <div className="p-space-sm bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-space-lg flex items-center gap-space-xs overflow-x-auto">
        <div className="flex items-center gap-space-2xs shrink-0 px-space-xs py-1 rounded-full bg-surface-container-low text-xs font-semibold text-on-surface-variant">
          <span className="material-symbols-outlined text-sm">filter_alt</span>
          Filters:
        </div>

        {/* Destination Quick Select */}
        <select
          value={filterDestination}
          onChange={(e) => setFilterDestination(e.target.value)}
          className="shrink-0 px-space-sm py-1.5 rounded-full bg-surface-container-low text-on-surface font-title-sm text-xs focus:outline-none cursor-pointer"
        >
          <option value="">Destination: All</option>
          <option value="Manali">Manali &amp; Spiti</option>
          <option value="Goa">Goa Beachfront</option>
          <option value="Ladakh">Ladakh &amp; Leh</option>
          <option value="Kerala">Kerala Backwaters</option>
        </select>

        {/* Gender Segmented Switch */}
        <div className="inline-flex shrink-0 p-0.5 bg-surface-container-low rounded-full">
          {['Any', 'Female', 'Male'].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setFilterGender(g)}
              className={`px-space-xs py-1 rounded-full text-xs font-medium transition-all ${
                filterGender === g
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Style Select */}
        <select
          value={filterStyle}
          onChange={(e) => setFilterStyle(e.target.value)}
          className="shrink-0 px-space-sm py-1.5 rounded-full bg-surface-container-low text-on-surface font-title-sm text-xs focus:outline-none cursor-pointer"
        >
          <option value="">Style: All Styles</option>
          <option value="Trekking">Hiking &amp; Trekking</option>
          <option value="Surfing">Chill &amp; Beach</option>
          <option value="Road Trip">Road Trip &amp; Convoy</option>
          <option value="Yoga">Yoga &amp; Wellness</option>
        </select>
      </div>

      {/* Partners Grid */}
      {loading ? (
        <Spinner size="lg" />
      ) : partners.length === 0 ? (
        <div className="p-12 text-center bg-surface-container-lowest rounded-3xl">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">sentiment_dissatisfied</span>
          <p className="font-title-sm text-on-surface">No travel partner posts found matching these filters.</p>
          <p className="text-sm text-on-surface-variant mt-1">Be the first to post a trip plan for this destination!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="bg-surface-container-lowest rounded-3xl p-space-md shadow-[0_4px_24px_rgba(15,23,42,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative flex items-center gap-space-sm mb-space-sm">
                  <div className="relative">
                    <img
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-primary-container"
                      src={partner.userAvatar}
                      alt={partner.userName}
                    />
                    {partner.isUserVerified && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary-container text-on-primary rounded-full flex items-center justify-center text-xs" title="Verified Wanderer">
                        <span className="material-symbols-outlined text-xs">verified</span>
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-headline-md text-headline-md text-on-surface truncate">{partner.userName}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{partner.userAge} yrs • {partner.userCity}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
                      Verified Nomad
                    </span>
                  </div>
                </div>

                <div className="p-space-xs bg-surface-container-low rounded-2xl mb-space-sm">
                  <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                    <span className="material-symbols-outlined text-sm">flight</span>
                    <span>Heading to:</span>
                  </div>
                  <p className="font-title-sm text-title-sm text-on-surface">{partner.destination}</p>
                </div>

                <div className="space-y-space-2xs text-body-sm mb-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Travel Style:</span>
                    <span className="font-medium text-on-surface">{partner.travelStyle}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Budget:</span>
                    <span className="font-bold text-on-surface">{formatCurrency(partner.minBudget)} - {formatCurrency(partner.maxBudget)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Dates:</span>
                    <span className="font-medium text-primary">{partner.dateRange}</span>
                  </div>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant bg-surface-container-lowest p-space-xs rounded-xl italic">
                  "{partner.note}"
                </p>
              </div>

              <div className="pt-space-md mt-space-sm">
                <button
                  type="button"
                  onClick={() => handleConnectClick(partner)}
                  className="w-full py-space-xs rounded-full bg-primary-container text-on-primary font-title-sm text-title-sm hover:bg-primary transition-colors shadow-sm flex items-center justify-center gap-space-2xs"
                >
                  <span className="material-symbols-outlined text-base">chat</span>
                  Connect &amp; Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect Modal */}
      <Modal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        title={selectedPartner ? `Connect with ${selectedPartner.userName}` : 'Connect with Traveler'}
      >
        {connectSuccess ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">check_circle</span>
            <h4 className="font-headline-md text-on-surface">Connection Request Sent!</h4>
            <p className="text-body-sm text-on-surface-variant mt-1">
              {selectedPartner?.userName} will review your message and connect back with you.
            </p>
          </div>
        ) : (
          <form onSubmit={submitConnect} className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
              <img src={selectedPartner?.userAvatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <p className="font-title-sm text-on-surface">{selectedPartner?.userName}</p>
                <p className="text-xs text-on-surface-variant">Destination: {selectedPartner?.destination}</p>
              </div>
            </div>

            <div>
              <label className="font-label-caps text-on-surface-variant uppercase text-xs block mb-1">
                Your Intro / Coordination Message
              </label>
              <textarea
                rows="4"
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
                className="w-full p-3 bg-surface-container-low rounded-2xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" icon="send">
              Send Message Request
            </Button>
          </form>
        )}
      </Modal>

      {/* Post Trip Plan Modal */}
      <Modal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        title="Post Your Trip Plan"
      >
        <form onSubmit={submitPostPlan} className="space-y-3">
          <Input
            label="Where are you heading?"
            placeholder="e.g. Kasol & Tosh, Pondicherry, Ladakh"
            value={postForm.destination}
            onChange={(e) => setPostForm({ ...postForm, destination: e.target.value })}
            required
          />
          <Input
            label="Travel Style"
            placeholder="e.g. Backpacker • Trekking, Remote Work • Surfing"
            value={postForm.travelStyle}
            onChange={(e) => setPostForm({ ...postForm, travelStyle: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Min Budget ($)"
              type="number"
              value={postForm.minBudget}
              onChange={(e) => setPostForm({ ...postForm, minBudget: e.target.value })}
              required
            />
            <Input
              label="Max Budget ($)"
              type="number"
              value={postForm.maxBudget}
              onChange={(e) => setPostForm({ ...postForm, maxBudget: e.target.value })}
              required
            />
          </div>
          <Input
            label="Target Travel Dates"
            placeholder="e.g. Nov 12 - Nov 20"
            value={postForm.dateRange}
            onChange={(e) => setPostForm({ ...postForm, dateRange: e.target.value })}
            required
          />
          <div>
            <label className="font-label-caps text-on-surface-variant uppercase text-xs block mb-1">
              Preferred Buddy Gender
            </label>
            <select
              value={postForm.preferredGender}
              onChange={(e) => setPostForm({ ...postForm, preferredGender: e.target.value })}
              className="w-full p-2.5 bg-surface-container-low rounded-2xl text-on-surface text-sm focus:outline-none"
            >
              <option value="Any">Any Gender</option>
              <option value="Female">Female Only</option>
              <option value="Male">Male Only</option>
            </select>
          </div>
          <div>
            <label className="font-label-caps text-on-surface-variant uppercase text-xs block mb-1">
              Trip Details &amp; Pitch
            </label>
            <textarea
              rows="3"
              className="w-full p-3 bg-surface-container-low rounded-2xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
              placeholder="What are you hoping to do? Looking to split cabs, share gear, or explore cafes?"
              value={postForm.note}
              onChange={(e) => setPostForm({ ...postForm, note: e.target.value })}
              required
            />
          </div>

          <Button type="submit" variant="primary" loading={posting} className="w-full" icon="publish">
            Publish Travel Partner Post
          </Button>
        </form>
      </Modal>
    </div>
  );
};
