import React from 'react';

export const AboutUsPage = () => {
  return (
    <div className="max-w-container-max mx-auto px-gutter-desktop py-space-xl">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-space-2xl">
        <span className="font-label-caps text-label-caps text-primary uppercase">About TripPartner</span>
        <h1 className="font-headline-xl md:font-display-hero text-headline-xl md:text-headline-xl text-on-surface tracking-tight mt-2">
          Connecting Nomads &amp; Empowering Shared Wanderlust
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-4 leading-relaxed">
          TripPartner was born from a simple belief: no traveler should miss out on life-changing adventures because their circle wasn't free. We fuse intelligent itinerary engineering with verified safety standards so you can travel anywhere with confidence.
        </p>
      </div>

      {/* Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg mb-space-2xl">
        <div className="p-space-xl rounded-3xl bg-surface-container-lowest shadow-sm">
          <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center mb-space-md">
            <span className="material-symbols-outlined text-2xl">shield</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs">100% ID-Verified</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Every user completes government identification checks and community endorsements before initiating contact or joining convoys.
          </p>
        </div>

        <div className="p-space-xl rounded-3xl bg-surface-container-lowest shadow-sm">
          <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center mb-space-md">
            <span className="material-symbols-outlined text-2xl">equalizer</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs">Radical Transparency</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            From shared 4x4 rentals to backcountry camping gear, our budget tools track every dollar so group finances stay harmonious.
          </p>
        </div>

        <div className="p-space-xl rounded-3xl bg-surface-container-lowest shadow-sm">
          <div className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center mb-space-md">
            <span className="material-symbols-outlined text-2xl">public</span>
          </div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-space-xs">Global Wanderer Squad</h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Active in over 120+ countries, spanning solo backpackers, remote digital nomads, motorcycle convoy riders, and yoga retreat seekers.
          </p>
        </div>
      </div>

      {/* Safety & Guidelines */}
      <div className="bg-surface-container-lowest rounded-3xl p-space-xl md:p-space-2xl shadow-sm border border-surface-container-high mb-space-2xl">
        <h2 className="font-headline-xl text-headline-xl text-on-surface mb-space-md">
          Community Safety Guidelines
        </h2>
        <div className="space-y-space-md text-body-md text-on-surface-variant">
          <div className="flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">verified</span>
            <div>
              <h4 className="font-title-sm text-on-surface">Meet in Public Spaces First</h4>
              <p className="text-body-sm mt-0.5">Always plan your first meet-up at well-known hostels, tourist cafes, or popular transit hubs.</p>
            </div>
          </div>
          <div className="flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">verified</span>
            <div>
              <h4 className="font-title-sm text-on-surface">Share Live Itinerary with Family</h4>
              <p className="text-body-sm mt-0.5">Use the "Save &amp; Share Trip" link inside Trip Planner to keep emergency contacts updated on your day-by-day coordinates.</p>
            </div>
          </div>
          <div className="flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">verified</span>
            <div>
              <h4 className="font-title-sm text-on-surface">Verify Budget Expectations Upfront</h4>
              <p className="text-body-sm mt-0.5">Use the Budget Splitter widget before booking stays to agree on lodging class, transport modes, and shared meals.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
