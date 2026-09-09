import React, { useState, useEffect } from 'react';
import { expeditionService } from '../../services/expeditionService';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export const OpenTripsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Join Modal
  const [selectedExpedition, setSelectedExpedition] = useState(null);
  const [spotsToBook, setSpotsToBook] = useState(1);
  const [joining, setJoining] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);

  const fetchExpeditions = async () => {
    setLoading(true);
    try {
      const res = await expeditionService.getAll();
      if (res?.data) {
        setExpeditions(res.data);
      }
    } catch (err) {
      console.error('Failed to load expeditions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpeditions();
  }, []);

  const handleJoinClick = (exp) => {
    setSelectedExpedition(exp);
    setSpotsToBook(1);
    setJoinSuccess(false);
  };

  const submitJoin = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setJoining(true);
    try {
      await expeditionService.join({
        expeditionId: selectedExpedition.id,
        spotsBooked: Number(spotsToBook),
      });
      setJoinSuccess(true);
      fetchExpeditions();
      setTimeout(() => setSelectedExpedition(null), 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join trip.');
    } finally {
      setJoining(false);
    }
  };

  return (
    <div className="max-w-container-max mx-auto px-gutter-desktop py-space-xl">
      {/* Header */}
      <div className="mb-space-xl">
        <div className="inline-flex items-center gap-space-2xs text-primary font-title-sm text-title-sm mb-space-2xs">
          <span className="material-symbols-outlined text-lg">event_available</span>
          Confirmed Squads
        </div>
        <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight mt-1">
          Open Group Expeditions to Join
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-2">
          Co-hosted adventures with verified leaders and strictly capped slots. Book your spot and travel with an amazing crew without logistics stress.
        </p>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : (
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
      )}

      {/* Join Modal */}
      <Modal
        isOpen={!!selectedExpedition}
        onClose={() => setSelectedExpedition(null)}
        title={selectedExpedition ? `Join ${selectedExpedition.title}` : 'Join Expedition'}
      >
        {joinSuccess ? (
          <div className="text-center py-6">
            <span className="material-symbols-outlined text-4xl text-primary mb-2">celebration</span>
            <h4 className="font-headline-md text-on-surface">You're In!</h4>
            <p className="text-body-sm text-on-surface-variant mt-1">
              Your reservation is confirmed. The group leader will coordinate via your registered email.
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

            <Button type="submit" variant="primary" loading={joining} className="w-full" icon="task_alt">
              Confirm &amp; Join Squad
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
};
