import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'Travel Partners', path: '/partners' },
    { name: 'Trip Planner', path: '/planner' },
    { name: 'Open Trips', path: '/open-trips' },
    { name: 'About Us', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-container-max mx-auto px-gutter-desktop flex items-center justify-between gap-space-md">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-space-sm shrink-0">
          <img
            alt="TripPartner Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQuA1gXBivhmTPOx-vwzSHZcvs--Sd3NgCf_bhBWpn7wBV9F7fD4tELD5-oPv081WfBeMjr2AH9iMeKd05fgXgaUk8Zp6xDFHFVpiU0FouptqeTvCYSe6_QvzlRvG3y5WCWdxpvs0IINQ-f8Zg1JY_1fOQte2Eq32VigwbCsGVDQ_yCucdmHl7TSfDaUuiDt3A3Bk4xQArPw0kz2XpdxK9Kavo3CkVTJi5WtWAI_7gCfckohOSamU7"
          />
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md tracking-tight text-on-surface">TripPartner</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase hidden sm:inline-block">Explore Together</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-space-xs p-space-2xs bg-surface-container-low/60 rounded-full px-space-sm">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-space-sm py-space-xs transition-colors rounded-full font-body-md text-body-md ${
                  active
                    ? 'bg-secondary-container text-on-secondary-container font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-space-sm shrink-0">
          {isAuthenticated ? (
            <div className="flex items-center gap-space-sm">
              <span className="hidden md:inline-block font-title-sm text-sm text-on-surface">
                {user?.fullName || 'Traveler'}
              </span>
              <button
                onClick={logout}
                className="px-space-sm py-space-2xs rounded-full font-body-md text-xs text-on-surface-variant hover:bg-surface-container-low hover:text-error transition-colors"
              >
                Logout
              </button>
              <div className="relative flex items-center ml-space-2xs">
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-container"
                  src={
                    user?.avatarUrl ||
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuCOnj1GQYR9gtTXRzmQL8_wCs0_AelRfvSfZJqu8sPWwaVINdPD0tCtVdmwP1SHswocQDb6l7AH5h-ekkTdSBU1wfEriCisgWD05DzCObGT7V6ZH9aH1bb_SbFMjALgdg7jM5j2V45_Z8bDCZodbdJ24bTAKsMLSp-0bTT01s5osdwABfUGW4_TnJq_eft8DaxfeDwg4FbeWi5Ol-vWr7QO-ZzpZWlXzj52_rAG0nP3q-PpFt967DhM'
                  }
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary-container rounded-full ring-2 ring-surface-container-lowest"></span>
              </div>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex px-space-md py-space-xs rounded-full font-body-md text-body-md text-on-surface hover:bg-surface-container-low hover:text-primary transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-space-lg py-space-xs bg-primary-container text-on-primary font-title-sm text-title-sm rounded-full shadow-[0_8px_20px_-4px_rgba(14,165,233,0.4)] hover:bg-primary transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
