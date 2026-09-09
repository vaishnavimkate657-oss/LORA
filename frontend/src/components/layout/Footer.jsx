import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-surface-container-lowest shadow-[0_-1px_8px_rgba(0,0,0,0.03)] pt-space-2xl pb-space-xl">
      <div className="max-w-container-max mx-auto px-gutter-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-space-xl mb-space-2xl">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col items-start gap-space-md">
            <div className="flex items-center gap-space-sm">
              <img
                alt="TripPartner Logo"
                className="h-8 w-auto object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQuA1gXBivhmTPOx-vwzSHZcvs--Sd3NgCf_bhBWpn7wBV9F7fD4tELD5-oPv081WfBeMjr2AH9iMeKd05fgXgaUk8Zp6xDFHFVpiU0FouptqeTvCYSe6_QvzlRvG3y5WCWdxpvs0IINQ-f8Zg1JY_1fOQte2Eq32VigwbCsGVDQ_yCucdmHl7TSfDaUuiDt3A3Bk4xQArPw0kz2XpdxK9Kavo3CkVTJi5WtWAI_7gCfckohOSamU7"
              />
              <span className="font-headline-md text-headline-md text-on-surface">TripPartner</span>
            </div>
            <p className="font-body-lg text-body-lg text-primary font-medium">Your Journey. Your People. Your TripPartner.</p>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              Discover like-minded companions, plan collaborative itineraries effortlessly, and explore the world safely with trusted global communities.
            </p>
            <div className="flex items-center gap-space-sm pt-space-2xs">
              <a aria-label="Twitter" className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-base">flutter</span>
              </a>
              <a aria-label="Instagram" className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-base">photo_camera</span>
              </a>
              <a aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-base">work</span>
              </a>
              <a aria-label="YouTube" className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" href="#">
                <span className="material-symbols-outlined text-base">smart_display</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-title-sm text-title-sm text-on-surface">Quick Links</h4>
            <ul className="flex flex-col gap-space-xs font-body-md text-body-md text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" to="/">Home</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/explore">Explore</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/partners">Find Partners</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/planner">Trip Planner</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/about">About Us</Link></li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-title-sm text-title-sm text-on-surface">Popular Destinations</h4>
            <ul className="flex flex-col gap-space-xs font-body-md text-body-md text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" to="/destinations?category=Beach+%26+Nightlife">Goa Beaches</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/destinations?category=Adventure+%26+Snow">Manali Trails</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/destinations?category=Scenic+Valley">Kashmir Valleys</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/destinations?category=Serene+Nature">Kerala Backwaters</Link></li>
            </ul>
            <h4 className="font-title-sm text-title-sm text-on-surface pt-space-xs">Safety</h4>
            <ul className="flex flex-col gap-space-xs font-body-md text-body-md text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" to="/about">Community Guidelines</Link></li>
              <li><Link className="hover:text-primary transition-colors" to="/about">Verified Profiles</Link></li>
            </ul>
          </div>

          {/* Stay Connected */}
          <div className="flex flex-col gap-space-sm">
            <h4 className="font-title-sm text-title-sm text-on-surface">Stay Connected</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Receive curated itineraries, travel partner invites, and secret spots weekly.
            </p>
            {subscribed ? (
              <div className="p-space-xs bg-secondary-container text-on-secondary-container rounded-2xl text-xs font-semibold">
                ✓ Subscribed! Check your inbox soon.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-space-xs pt-space-2xs">
                <div className="relative flex items-center">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-space-xs px-space-sm pr-space-xl bg-surface-container-low rounded-full text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none focus:bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                    placeholder="Your email address"
                    type="email"
                    required
                  />
                  <span className="material-symbols-outlined absolute right-space-sm text-outline text-lg pointer-events-none">
                    mail
                  </span>
                </div>
                <button
                  className="w-full py-space-xs px-space-md bg-tertiary-container text-on-primary font-title-sm text-title-sm rounded-full shadow-[0_4px_14px_rgba(250,116,23,0.3)] hover:opacity-95 transition-opacity"
                  type="submit"
                >
                  Subscribe
                </button>
              </form>
            )}
            <div className="pt-space-xs">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase">Contact Us</p>
              <p className="font-body-sm text-body-sm text-on-surface mt-space-2xs">support@trippartner.com</p>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-sm font-body-sm text-body-sm text-on-surface-variant border-t border-surface-container-high">
          <p>© 2025 TripPartner Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-space-md">
            <a className="hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-on-surface transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-on-surface transition-colors" href="#">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
