import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { HomePage } from '../pages/Home/HomePage';
import { ExplorePage } from '../pages/Explore/ExplorePage';
import { DestinationsPage } from '../pages/Destinations/DestinationsPage';
import { TravelPartnersPage } from '../pages/TravelPartners/TravelPartnersPage';
import { TripPlannerPage } from '../pages/TripPlanner/TripPlannerPage';
import { OpenTripsPage } from '../pages/OpenTrips/OpenTripsPage';
import { AuthPage } from '../pages/Auth/AuthPage';
import { AboutUsPage } from '../pages/AboutUs/AboutUsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/partners" element={<TravelPartnersPage />} />
        <Route path="/planner" element={<TripPlannerPage />} />
        <Route path="/open-trips" element={<OpenTripsPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/login" element={<AuthPage initialMode="login" />} />
        <Route path="/register" element={<AuthPage initialMode="register" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};
