import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { destinationService } from '../../services/destinationService';
import { partnerService } from '../../services/partnerService';
import { expeditionService } from '../../services/expeditionService';
import { MOOD_CATEGORIES } from '../../constants/theme';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatRating, formatReviewsCount } from '../../utils/formatters';

export const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Search State
  const [activeTab, setActiveTab] = useState('trips');
  const [searchWhere, setSearchWhere] = useState('');
  const [searchDates, setSearchDates] = useState('18 Oct - 25 Oct 2025');
  const [searchBudget, setSearchBudget] = useState('Moderate ($500 - $1.2k)');
  const [searchTravelers, setSearchTravelers] = useState('2 Buddies • Duo');

  // Live Data State
  const [destinations, setDestinations] = useState([]);
  const [partners, setPartners] = useState([]);
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [connectMessage, setConnectMessage] = useState('');
  const [connectSuccess, setConnectSuccess] = useState(false);

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [spotsToBook, setSpotsToBook] = useState(1);
  const [joinSuccess, setJoinSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, partnerRes, expRes] = await Promise.allSettled([
          destinationService.getTrending(),
          partnerService.getAll(),
          expeditionService.getAll(),
        ]);

        if (destRes.status === 'fulfilled' && destRes.value?.data) {
          setDestinations(destRes.value.data);
        }
        if (partnerRes.status === 'fulfilled' && partnerRes.value?.data) {
          setPartners(partnerRes.value.data.slice(0, 4));
        }
        if (expRes.status === 'fulfilled' && expRes.value?.data) {
          setExpeditions(expRes.value.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'buddies') {
      navigate(`/partners?destination=${encodeURIComponent(searchWhere)}`);
    } else {
      navigate(`/destinations?search=${encodeURIComponent(searchWhere)}`);
    }
  };

  const handleConnectClick = (partner) => {
    setSelectedPartner(partner);
    setConnectMessage(`Hi ${partner.userName}! I saw your trip to ${partner.destination} and would love to connect and share plans.`);
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
      alert(err.response?.data?.message || 'Failed to send connection request.');
    }
  };

  const handleJoinClick = (exp) => {
    setSelectedExpedition(exp);
    setSpotsToBook(1);
    setJoinSuccess(false);
    setJoinModalOpen(true);
  };

  const submitJoin = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await expeditionService.join({
        expeditionId: selectedExpedition.id,
        spotsBooked: Number(spotsToBook),
      });
      setJoinSuccess(true);
      // Refresh expeditions
      const expRes = await expeditionService.getAll();
      if (expRes?.data) setExpeditions(expRes.data.slice(0, 3));
      setTimeout(() => setJoinModalOpen(false), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join expedition.');
    }
  };

  return (
    <div className="flex flex-col w-full font-body-md text-on-surface">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-on-background -mt-20 pt-24 md:pt-32 pb-24 md:pb-36">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCuCjAiWsXJSwHrioV518S91N26gYXMnjL3Ke9rsO4uSZpEgNOjHtxrBF7oDAayjcBLrxFDuHU3TrYE9VdBkXe3NRqT-7gteGU75iAfUxF8lT6MelkGAUfX5pY_3giGkLVEsN6FlqHa6hkAYeFIN0E6yJ-n9LWM3Amc8JLiFzpTB_cyolEsdV72TuD7X4joiSZQFn42BG_P1RZ2mew5jZJ7Lfld5GS3_AREiKGoDpdD1TN3-sNC8quh')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-on-background via-on-background/60 to-on-background/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-on-background/80 via-transparent to-on-background/50"></div>

        <div className="relative max-w-container-max mx-auto px-gutter-desktop z-10 flex flex-col items-center text-center">
          {/* Trust Pill Badge */}
          <div className="inline-flex items-center gap-space-xs px-space-md py-space-2xs rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-on-primary shadow-lg transition-transform hover:scale-105 duration-300">
            <span className="flex h-2 w-2 rounded-full bg-tertiary-container animate-ping"></span>
            <span className="font-label-caps text-label-caps uppercase tracking-wider text-surface-variant">
              ✨ #1 Travel Companion &amp; Partner Finder
            </span>
          </div>

          {/* Headline & Subtitle */}
          <h1 className="mt-space-md max-w-4xl font-display-hero text-display-hero text-on-primary tracking-tight drop-shadow-sm">
            Your Journey. Your People. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-surface-variant to-tertiary-container">
              Your TripPartner.
            </span>
          </h1>
          <p className="mt-space-sm max-w-2xl font-body-lg text-body-lg text-surface-container-low font-normal">
            Discover amazing destinations, plan collaborative unforgettable itineraries, and link up with verified travel buddies worldwide.
          </p>

          {/* Action CTAs */}
          <div className="mt-space-lg flex flex-wrap items-center justify-center gap-space-md">
            <Link
              to="/destinations"
              className="px-space-xl py-space-sm bg-primary-container text-on-primary font-title-sm text-title-sm rounded-full shadow-[0_12px_28px_-6px_rgba(14,165,233,0.5)] hover:bg-primary transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-xl">near_me</span>
              Explore Destinations
            </Link>
            <Link
              to="/partners"
              className="px-space-xl py-space-sm bg-surface-container-lowest/20 backdrop-blur-md text-on-primary font-title-sm text-title-sm rounded-full shadow-md hover:bg-surface-container-lowest/30 transition-all duration-300 flex items-center gap-space-xs"
            >
              <span className="material-symbols-outlined text-xl">group_add</span>
              Find a Travel Partner
            </Link>
          </div>

          {/* Live Micro-stats Pill */}
          <div className="mt-space-xl inline-flex items-center gap-space-md px-space-lg py-space-xs rounded-full bg-surface-container-lowest/10 backdrop-blur-md text-surface-bright text-body-sm">
            <div className="flex items-center gap-1 text-tertiary-fixed font-semibold">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span>4.9/5 Rating</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-surface-variant/40"></span>
            <span className="font-medium">85,000+ Journeys Planned</span>
            <span className="w-1.5 h-1.5 rounded-full bg-surface-variant/40 hidden sm:inline-block"></span>
            <span className="font-medium hidden sm:inline-block">120+ Countries</span>
          </div>
        </div>
      </section>

      {/* FLOATING TRAVEL SEARCH ENGINE CONSOLE */}
      <div className="relative z-20 max-w-container-max mx-auto px-gutter-desktop w-full -mt-14 sm:-mt-16">
        <div className="w-full bg-surface-container-lowest rounded-3xl shadow-[0_20px_50px_rgba(15,23,42,0.08)] p-space-md sm:p-space-lg">
          {/* Top Segmented Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-space-sm pb-space-md">
            <div className="inline-flex p-1 bg-surface-container-low rounded-full">
              <button
                type="button"
                onClick={() => setActiveTab('trips')}
                className={`px-space-md py-space-2xs rounded-full font-title-sm text-title-sm transition-all flex items-center gap-space-2xs ${
                  activeTab === 'trips' ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">explore</span>
                Find Trips
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('buddies')}
                className={`px-space-md py-space-2xs rounded-full font-title-sm text-title-sm transition-all flex items-center gap-space-2xs ${
                  activeTab === 'buddies' ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">person_search</span>
                Find Travel Buddies
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('custom');
                  navigate('/planner');
                }}
                className={`px-space-md py-space-2xs rounded-full font-title-sm text-title-sm transition-all flex items-center gap-space-2xs ${
                  activeTab === 'custom' ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-base">alt_route</span>
                Custom Itinerary
              </button>
            </div>
            <div className="hidden lg:flex items-center gap-space-xs text-on-surface-variant text-body-sm font-medium">
              <span className="material-symbols-outlined text-primary-container text-base">verified</span>
              100% ID-Verified Travelers Network
            </div>
          </div>

          {/* Compound Search Inputs */}
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-space-sm items-center">
            {/* Field 1: Destination */}
            <div className="lg:col-span-3 p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary-container group-hover:scale-110 transition-transform">location_on</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Where to?</span>
                  <input
                    className="w-full bg-transparent text-on-surface font-title-sm text-title-sm focus:outline-none placeholder:text-outline truncate"
                    placeholder="e.g. Manali, Goa, Bali"
                    type="text"
                    value={searchWhere}
                    onChange={(e) => setSearchWhere(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Field 2: Travel Date */}
            <div className="lg:col-span-3 p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary-container group-hover:scale-110 transition-transform">calendar_month</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Travel Dates</span>
                  <input
                    className="w-full bg-transparent text-on-surface font-title-sm text-title-sm focus:outline-none placeholder:text-outline truncate"
                    type="text"
                    value={searchDates}
                    onChange={(e) => setSearchDates(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Field 3: Budget Range */}
            <div className="lg:col-span-2 p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-tertiary-container group-hover:scale-110 transition-transform">account_balance_wallet</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Budget</span>
                  <select
                    className="w-full bg-transparent text-on-surface font-title-sm text-title-sm focus:outline-none cursor-pointer"
                    value={searchBudget}
                    onChange={(e) => setSearchBudget(e.target.value)}
                  >
                    <option>Moderate ($500 - $1.2k)</option>
                    <option>Backpacker (&lt; $400)</option>
                    <option>Luxury ($1.5k+)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Field 4: Travelers */}
            <div className="lg:col-span-2 p-space-sm rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors group">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary-container group-hover:scale-110 transition-transform">group</span>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Travelers</span>
                  <select
                    className="w-full bg-transparent text-on-surface font-title-sm text-title-sm focus:outline-none cursor-pointer"
                    value={searchTravelers}
                    onChange={(e) => setSearchTravelers(e.target.value)}
                  >
                    <option>2 Buddies • Duo</option>
                    <option>Solo Traveler</option>
                    <option>Group (3-5 nomads)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CTA Search */}
            <div className="lg:col-span-2 flex items-center justify-end">
              <button
                type="submit"
                className="w-full h-14 rounded-full bg-gradient-to-r from-primary-container via-primary to-tertiary-container text-on-primary font-title-sm text-title-sm shadow-[0_10px_24px_-4px_rgba(14,165,233,0.45)] hover:shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-space-xs transform hover:scale-[1.02]"
              >
                <span className="material-symbols-outlined text-xl">search</span>
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* TRAVEL CATEGORIES CAROUSEL */}
      <section className="max-w-container-max mx-auto px-gutter-desktop w-full pt-space-2xl pb-space-lg">
        <div className="flex items-center justify-between mb-space-md">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-primary uppercase">Browse by Style</span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Explore Journeys by Mood</h2>
          </div>
          <div className="flex items-center gap-space-xs">
            <Link
              to="/explore"
              className="text-primary font-title-sm text-sm hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-space-sm">
          {MOOD_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/destinations?category=${encodeURIComponent(cat.title)}`}
              className="flex flex-col items-center justify-center p-space-md rounded-2xl bg-surface-container-lowest hover:bg-surface-container transition-all group shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-full ${cat.bg} group-hover:bg-primary-container ${cat.color} group-hover:text-on-primary flex items-center justify-center transition-colors mb-space-xs`}>
                <span className="material-symbols-outlined text-2xl">{cat.icon}</span>
              </div>
              <span className="font-title-sm text-sm text-center text-on-surface group-hover:text-primary">
                {cat.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* POPULAR DESTINATIONS GRID */}
      <section className="max-w-container-max mx-auto px-gutter-desktop w-full py-space-xl" id="destinations">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
          <div>
            <div className="inline-flex items-center gap-space-2xs text-primary font-title-sm text-title-sm mb-space-2xs">
              <span className="material-symbols-outlined text-lg">flight_takeoff</span>
              Curated Wanderlust
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Trending Destinations</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-space-2xs">
              Handpicked scenic spots with surging companion match requests and live solo travel hubs.
            </p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-space-xs text-primary font-title-sm text-title-sm hover:underline self-start md:self-auto"
          >
            <span>View All Destinations</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>

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
      </section>

      {/* INTERACTIVE TRIP PLANNER PREVIEW WIDGET (Bento Showcase) */}
      <section className="max-w-container-max mx-auto px-gutter-desktop w-full py-space-xl">
        <div className="bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container rounded-3xl p-space-lg sm:p-space-2xl shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
          <div className="max-w-3xl mb-space-xl">
            <div className="inline-flex items-center gap-space-2xs px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-caps text-label-caps uppercase mb-space-xs">
              <span className="material-symbols-outlined text-sm">tune</span>
              Smart Travel Engine
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              How TripPartner Automatically Coordinates Your Journey
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-space-2xs">
              Dynamic multi-day itineraries, instant cost-sharing calculations, and synchronized route planning tailored for collaborative squads.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
            {/* Left Panel: Interactive Itinerary Builder Mockup */}
            <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-space-md sm:p-space-lg shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between flex-wrap gap-space-xs pb-space-sm border-b-0">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
                      <span className="material-symbols-outlined">map</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Manali Expedition</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">5 Days • Himalayan Circuit • $420 Est. Cost</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-2xs">
                    <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                      Active Plan
                    </span>
                  </div>
                </div>

                {/* Vertical Itinerary Chronology */}
                <div className="mt-space-md space-y-space-md relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container-high">
                  {/* Day 1 */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs ring-4 ring-surface-container-lowest">
                      <span className="material-symbols-outlined text-xs">check</span>
                    </div>
                    <div className="bg-surface-container-low p-space-sm rounded-2xl">
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="font-title-sm text-title-sm text-on-surface">Day 1: Arrival &amp; Old Manali Cafes</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-lowest font-medium text-primary">Completed</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Check-in at wooden hostel, Hadimba forest walk, and live folk jam session at Dylan's Cafe.
                      </p>
                    </div>
                  </div>

                  {/* Day 2 */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-tertiary-container text-on-primary flex items-center justify-center text-xs ring-4 ring-surface-container-lowest animate-pulse">
                      <span className="material-symbols-outlined text-xs">play_arrow</span>
                    </div>
                    <div className="bg-surface-container-low p-space-sm rounded-2xl">
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="font-title-sm text-title-sm text-on-surface">Day 2: Solang Valley Thrills</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-tertiary-fixed text-tertiary font-bold">In Progress</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Morning tandem paragliding from 8,000ft, zorbing races, and hot roadside thukpa lunch.
                      </p>
                    </div>
                  </div>

                  {/* Day 3 */}
                  <div className="relative group">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center text-xs ring-4 ring-surface-container-lowest">
                      <span className="material-symbols-outlined text-xs">schedule</span>
                    </div>
                    <div className="bg-surface-container-low p-space-sm rounded-2xl">
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="font-title-sm text-title-sm text-on-surface">Day 3: Rohtang Pass Glacial Drive</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-container-lowest text-on-surface-variant">Upcoming</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Scenic 4x4 high altitude pass crossing, snow photography at 13,058 ft, and return bonfire.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons in Mockup */}
              <div className="flex items-center justify-between pt-space-md mt-space-md">
                <Link
                  to="/planner"
                  className="px-space-md py-space-xs rounded-full bg-surface-container-low text-primary font-title-sm text-title-sm hover:bg-surface-container transition-colors flex items-center gap-space-2xs"
                >
                  <span className="material-symbols-outlined text-base">add_location_alt</span>
                  Add Place
                </Link>
                <Link
                  to="/planner"
                  className="px-space-md py-space-xs rounded-full bg-primary-container text-on-primary font-title-sm text-title-sm hover:bg-primary transition-colors shadow-sm flex items-center gap-space-2xs"
                >
                  <span className="material-symbols-outlined text-base">share</span>
                  Save &amp; Share Trip
                </Link>
              </div>
            </div>

            {/* Right Panel: Live Budget & Expense Splitter */}
            <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-space-md sm:p-space-lg shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-space-sm">
                  <div>
                    <span className="font-label-caps text-label-caps text-tertiary uppercase">Split &amp; Save</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Budget Splitter</h3>
                  </div>
                  <div className="text-right">
                    <span className="font-headline-md text-headline-md font-bold text-primary">$420</span>
                    <span className="text-xs text-on-surface-variant block">per nomad</span>
                  </div>
                </div>

                {/* Co-travelers strip */}
                <div className="mt-space-sm p-space-sm bg-surface-container-low rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs ring-2 ring-surface-container-lowest">A</div>
                      <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-primary flex items-center justify-center font-bold text-xs ring-2 ring-surface-container-lowest">M</div>
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs ring-2 ring-surface-container-lowest">E</div>
                    </div>
                    <span className="font-body-sm text-body-sm font-semibold text-on-surface">3 Buddies Joined</span>
                  </div>
                  <span className="text-xs text-primary font-semibold">+ 1 Slot Left</span>
                </div>

                {/* Breakdown Bars */}
                <div className="mt-space-md space-y-space-sm">
                  <div>
                    <div className="flex justify-between text-body-sm mb-1">
                      <span className="text-on-surface font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-primary">hotel</span>
                        Lodging (Hostel &amp; Camps)
                      </span>
                      <span className="font-bold text-on-surface">40% • $168</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '40%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-body-sm mb-1">
                      <span className="text-on-surface font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-primary-container">directions_car</span>
                        Local SUV Transfer
                      </span>
                      <span className="font-bold text-on-surface">25% • $105</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-primary-container rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-body-sm mb-1">
                      <span className="text-on-surface font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-tertiary-container">restaurant</span>
                        Food &amp; Local Treats
                      </span>
                      <span className="font-bold text-on-surface">20% • $84</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-tertiary-container rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-body-sm mb-1">
                      <span className="text-on-surface font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-base text-secondary">paragliding</span>
                        Permits &amp; Paragliding
                      </span>
                      <span className="font-bold text-on-surface">15% • $63</span>
                    </div>
                    <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                      <div className="h-full bg-secondary rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-space-md p-space-sm bg-surface-container-highest/60 rounded-2xl flex items-center gap-space-xs text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-tertiary-container text-base">savings</span>
                  <span>Splitting a rental SUV and private campsite saves each nomad ~38% compared to solo bookings!</span>
                </div>
              </div>

              <div className="pt-space-md mt-space-md">
                <Link
                  to="/planner"
                  className="w-full py-space-xs rounded-full bg-on-secondary-fixed text-on-primary font-title-sm text-title-sm hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-space-xs"
                >
                  <span className="material-symbols-outlined text-lg">calculate</span>
                  Auto-Split My Custom Trip
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIND YOUR TRAVEL PARTNER (INTERACTIVE MATCHING HUB) */}
      <section className="max-w-container-max mx-auto px-gutter-desktop w-full py-space-xl" id="partners">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-md gap-space-sm">
          <div>
            <div className="inline-flex items-center gap-space-2xs text-tertiary font-title-sm text-title-sm mb-space-2xs">
              <span className="material-symbols-outlined text-lg">supervised_user_circle</span>
              Global Wanderers Network
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Find Your Ideal Travel Companion</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-space-2xs">
              Connect with verified solo wanderers, co-explorers, and small groups heading your exact direction.
            </p>
          </div>
          <Link
            to="/partners"
            className="px-space-md py-space-xs rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface font-title-sm text-title-sm transition-colors flex items-center gap-space-2xs self-start md:self-auto"
          >
            <span>Post Your Trip Plan</span>
            <span className="material-symbols-outlined text-base">add_circle</span>
          </Link>
        </div>

        {/* 4 Travel Partner Profile Cards */}
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
      </section>

      {/* FEATURED UPCOMING OPEN TRIPS (CO-HOSTED EXPEDITIONS) */}
      <section className="max-w-container-max mx-auto px-gutter-desktop w-full py-space-xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-sm">
          <div>
            <div className="inline-flex items-center gap-space-2xs text-primary font-title-sm text-title-sm mb-space-2xs">
              <span className="material-symbols-outlined text-lg">event_available</span>
              Confirmed Itineraries
            </div>
            <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Open Group Expeditions to Join</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-space-2xs">
              Small squad adventures with verified hosts and limited spots left. Jump right in without the planning stress.
            </p>
          </div>
          <Link
            to="/open-trips"
            className="inline-flex items-center gap-space-xs text-primary font-title-sm text-title-sm hover:underline"
          >
            <span>Explore All Open Groups</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {expeditions.map((exp) => {
            const percentage = Math.round((exp.filledSlots / exp.totalSlots) * 100);
            const remaining = exp.totalSlots - exp.filledSlots;

            return (
              <div
                key={exp.id}
                className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(15,23,42,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img className="w-full h-full object-cover" src={exp.imageUrl} alt={exp.title} />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-on-background/70 backdrop-blur-md text-on-primary font-label-caps text-label-caps uppercase">
                      {exp.duration} • {exp.dateRange}
                    </span>
                    <span className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-tertiary-container text-on-primary font-title-sm text-xs font-bold shadow-md">
                      {formatCurrency(exp.pricePerPerson)} / person
                    </span>
                  </div>
                  <div className="p-space-md">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-space-2xs">{exp.title}</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
                      {exp.description}
                    </p>
                    <div className="space-y-space-2xs">
                      <div className="flex items-center justify-between text-body-sm">
                        <span className="text-on-surface font-medium">Slots Filled: {exp.filledSlots} of {exp.totalSlots}</span>
                        <span className="text-tertiary font-bold text-xs">
                          {remaining <= 2 ? `Only ${remaining} Left!` : `${remaining} Slots Open`}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                        <div className="h-full bg-tertiary-container rounded-full" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-space-md pt-0">
                  <button
                    type="button"
                    onClick={() => handleJoinClick(exp)}
                    className="w-full py-space-xs rounded-full bg-primary text-on-primary font-title-sm text-title-sm hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-space-2xs"
                  >
                    <span className="material-symbols-outlined text-base">group_add</span>
                    Join Trip
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* VALUE PROPS / WHY TRIPPARTNER */}
      <section className="max-w-container-max mx-auto px-gutter-desktop w-full py-space-2xl">
        <div className="text-center max-w-2xl mx-auto mb-space-xl">
          <span className="font-label-caps text-label-caps text-primary uppercase">Why Travel With Us</span>
          <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1">Built for Confident, Safe Exploration</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            We eliminate the friction of solo travel by combining community trust with intelligent planning software.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          <div className="p-space-xl rounded-3xl bg-surface-container-lowest shadow-[0_4px_24px_rgba(15,23,42,0.04)] text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-3xl">verified_user</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs">Verified Profiles &amp; Safe Community</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Every buddy submits government ID verification, phone check, and community social endorsements before joining chats or open groups.
            </p>
          </div>
          <div className="p-space-xl rounded-3xl bg-surface-container-lowest shadow-[0_4px_24px_rgba(15,23,42,0.04)] text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-3xl">pie_chart</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs">Smart Budget &amp; Expense Splitting</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              No more messy spreadsheet arguments. Track group cabs, rental villas, and shared meals with instant auto-currency settlements.
            </p>
          </div>
          <div className="p-space-xl rounded-3xl bg-surface-container-lowest shadow-[0_4px_24px_rgba(15,23,42,0.04)] text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-secondary-container text-secondary flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-3xl">explore</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs">Curated Local Secret Spots</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Access crowd-sourced hidden waterfalls, quiet cliff viewpoints, and non-commercial homestays shared only by fellow verified wanderers.
            </p>
          </div>
        </div>
      </section>

      {/* TRAVELER COMMUNITY TESTIMONIALS */}
      <section className="max-w-container-max mx-auto px-gutter-desktop w-full py-space-xl">
        <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-space-xl">
          <span className="font-label-caps text-label-caps text-primary uppercase">Real Wanderer Stories</span>
          <h2 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1">Loved by 85,000+ Explorers</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            See how simple connections turned nervous first-time solo travelers into lifelong global travel families.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          <div className="p-space-lg bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(15,23,42,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-tertiary-container mb-space-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface italic mb-space-md">
                "I was terrified to do Kashmir on my own. I matched with Tanvi on TripPartner, split a houseboat on Dal Lake, and we ended up saving over 40% on car rentals. Best trip of my life!"
              </p>
            </div>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <div className="w-11 h-11 rounded-full bg-primary-fixed text-primary font-bold flex items-center justify-center">SK</div>
              <div>
                <h4 className="font-title-sm text-title-sm text-on-surface">Sneha Kapoor</h4>
                <span className="text-xs text-on-surface-variant">Traveled to Srinagar • Nov 2024</span>
              </div>
            </div>
          </div>

          <div className="p-space-lg bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(15,23,42,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-tertiary-container mb-space-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface italic mb-space-md">
                "Finding riding partners for the Leh-Ladakh circuit usually takes weeks of messy forum posts. On TripPartner, our 4-person bike convoy was locked in and verified in 48 hours."
              </p>
            </div>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <div className="w-11 h-11 rounded-full bg-secondary-fixed text-secondary font-bold flex items-center justify-center">DA</div>
              <div>
                <h4 className="font-title-sm text-title-sm text-on-surface">David Armstrong</h4>
                <span className="text-xs text-on-surface-variant">Motorcycle Nomad • Sep 2024</span>
              </div>
            </div>
          </div>

          <div className="p-space-lg bg-surface-container-lowest rounded-3xl shadow-[0_4px_24px_rgba(15,23,42,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-tertiary-container mb-space-sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface italic mb-space-md">
                "The expense splitter alone is gold. No awkward Venmo calculations or forgotten dinners. You focus on the sun and waves while the app keeps everything fair and transparent."
              </p>
            </div>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <div className="w-11 h-11 rounded-full bg-tertiary-fixed text-tertiary font-bold flex items-center justify-center">RJ</div>
              <div>
                <h4 className="font-title-sm text-title-sm text-on-surface">Rhea Joshi</h4>
                <span className="text-xs text-on-surface-variant">Goa Remote Worker • Jan 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SIGN-UP / CONVERSION CTA BANNER */}
      <section className="max-w-container-max mx-auto px-gutter-desktop w-full py-space-2xl">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary via-primary-container to-tertiary-container p-space-xl md:p-space-2xl shadow-xl text-on-primary">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-surface-container-lowest/10 blur-2xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-tertiary-fixed/15 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
            <span className="px-space-md py-1 rounded-full bg-surface-container-lowest/20 backdrop-blur-md font-label-caps text-label-caps uppercase tracking-wider mb-space-sm">
              Join the Movement
            </span>
            <h2 className="font-headline-xl text-headline-xl md:text-display-hero-mobile font-extrabold tracking-tight text-on-primary">
              Ready to Explore the World Together?
            </h2>
            <p className="font-body-lg text-body-lg text-surface-container-lowest font-normal mt-space-xs max-w-lg">
              Join 50,000+ wanderers today. Match with travel partners, share itineraries, and create memories that last forever.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
              className="mt-space-lg w-full max-w-md flex flex-col sm:flex-row items-center gap-space-xs bg-surface-container-lowest p-1.5 rounded-full shadow-lg"
            >
              <input
                className="w-full px-space-md py-space-xs bg-transparent text-on-surface placeholder:text-outline font-body-md text-body-md focus:outline-none rounded-full"
                placeholder="Enter your email address..."
                type="email"
                required
              />
              <button
                className="w-full sm:w-auto px-space-xl py-space-sm bg-tertiary-container text-on-primary font-title-sm text-title-sm rounded-full shadow-md hover:bg-tertiary transition-all whitespace-nowrap"
                type="submit"
              >
                Get Started Free
              </button>
            </form>

            <div className="mt-space-md flex flex-wrap items-center justify-center gap-space-md text-surface-container-lowest text-xs font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">check_circle</span> Free Forever for Wanderers
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">lock</span> Zero Spam Promise
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">shield</span> Safe ID Verification
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Connect Modal */}
      <Modal
        isOpen={connectModalOpen}
        onClose={() => setConnectModalOpen(false)}
        title={selectedPartner ? `Connect with ${selectedPartner.userName}` : 'Connect with Traveler'}
      >
        {connectSuccess ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">check_circle</span>
            <h4 className="font-headline-md text-on-surface">Request Sent!</h4>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Your connection note has been dispatched. You'll be notified when {selectedPartner?.userName} responds.
            </p>
          </div>
        ) : (
          <form onSubmit={submitConnect} className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-2xl">
              <img
                src={selectedPartner?.userAvatar}
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-title-sm text-on-surface">{selectedPartner?.userName}</p>
                <p className="text-xs text-on-surface-variant">Going to {selectedPartner?.destination} • {selectedPartner?.dateRange}</p>
              </div>
            </div>

            <div>
              <label className="font-label-caps text-on-surface-variant uppercase text-xs block mb-1">
                Personal Intro Message
              </label>
              <textarea
                rows="4"
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
                className="w-full p-3 bg-surface-container-low rounded-2xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
                placeholder="Introduce yourself, mention dates or shared travel interests..."
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full" icon="send">
              Send Connection Request
            </Button>
          </form>
        )}
      </Modal>

      {/* Join Expedition Modal */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title={selectedExpedition ? `Join ${selectedExpedition.title}` : 'Join Expedition'}
      >
        {joinSuccess ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">celebration</span>
            <h4 className="font-headline-md text-on-surface">You're In!</h4>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Your reservation is confirmed. The group organizer will reach out with the expedition coordination channel.
            </p>
          </div>
        ) : (
          <form onSubmit={submitJoin} className="space-y-4">
            <div className="p-3 bg-surface-container-low rounded-2xl">
              <p className="font-title-sm text-on-surface">{selectedExpedition?.title}</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {selectedExpedition?.destination} • {selectedExpedition?.duration} • {formatCurrency(selectedExpedition?.pricePerPerson)}/person
              </p>
            </div>

            <div>
              <label className="font-label-caps text-on-surface-variant uppercase text-xs block mb-1">
                Number of Spots
              </label>
              <select
                value={spotsToBook}
                onChange={(e) => setSpotsToBook(e.target.value)}
                className="w-full p-2.5 bg-surface-container-low rounded-2xl text-on-surface text-sm focus:outline-none cursor-pointer"
              >
                {[1, 2, 3].map((num) => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Nomad' : 'Nomads'}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-between items-center p-3 bg-surface-container-low/60 rounded-2xl text-sm">
              <span className="text-on-surface-variant">Estimated Total:</span>
              <span className="font-bold text-primary">
                {formatCurrency((selectedExpedition?.pricePerPerson || 0) * spotsToBook)}
              </span>
            </div>

            <Button type="submit" variant="primary" className="w-full" icon="task_alt">
              Confirm &amp; Join Squad
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
