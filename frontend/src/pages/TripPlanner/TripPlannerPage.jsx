import React, { useState, useEffect } from 'react';
import { tripService } from '../../services/tripService';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { formatCurrency } from '../../utils/formatters';
import { useAuth } from '../../hooks/useAuth';

export const TripPlannerPage = () => {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // Co-traveler count for splitting
  const [nomadCount, setNomadCount] = useState(3);

  // Add Day Item Modal
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [itemForm, setItemForm] = useState({
    dayNumber: 1,
    title: '',
    description: '',
    status: 'UPCOMING',
  });

  // Add Expense Modal
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    category: 'LODGING',
    description: '',
    amount: 100,
  });

  // Create Trip Modal
  const [createTripModalOpen, setCreateTripModalOpen] = useState(false);
  const [newTripForm, setNewTripForm] = useState({
    title: '',
    destination: '',
    durationDays: 5,
    estimatedCost: 500,
  });

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await tripService.getAll();
      if (res?.data && res.data.length > 0) {
        setTrips(res.data);
        setActiveTrip(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!activeTrip) return;
    try {
      await tripService.addItineraryItem(activeTrip.id, {
        ...itemForm,
        dayNumber: Number(itemForm.dayNumber),
      });
      setAddItemModalOpen(false);
      setItemForm({ dayNumber: (activeTrip.itineraryItems?.length || 0) + 1, title: '', description: '', status: 'UPCOMING' });
      // Refresh current trip
      const refreshed = await tripService.getById(activeTrip.id);
      if (refreshed?.data) setActiveTrip(refreshed.data);
    } catch (err) {
      alert('Failed to add itinerary stop');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!activeTrip) return;
    try {
      const totalCost = Number(activeTrip.estimatedCost || 1);
      const percentage = Math.min(100, (Number(expenseForm.amount) / totalCost) * 100);
      await tripService.addTripExpense(activeTrip.id, {
        ...expenseForm,
        amount: Number(expenseForm.amount),
        percentage: Number(percentage.toFixed(1)),
      });
      setAddExpenseModalOpen(false);
      setExpenseForm({ category: 'LODGING', description: '', amount: 100 });
      // Refresh current trip
      const refreshed = await tripService.getById(activeTrip.id);
      if (refreshed?.data) setActiveTrip(refreshed.data);
    } catch (err) {
      alert('Failed to add expense item');
    }
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    try {
      const res = await tripService.create({
        ...newTripForm,
        durationDays: Number(newTripForm.durationDays),
        estimatedCost: Number(newTripForm.estimatedCost),
        itineraryItems: [],
        tripExpenses: [],
      });
      setCreateTripModalOpen(false);
      fetchTrips();
    } catch (err) {
      alert('Failed to create trip');
    }
  };

  // Calculations for budget breakdown
  const expenses = activeTrip?.tripExpenses || [];
  const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0) || Number(activeTrip?.estimatedCost || 420);
  const costPerNomad = (totalExpenses / Math.max(1, nomadCount)).toFixed(0);

  return (
    <div className="max-w-container-max mx-auto px-gutter-desktop py-space-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-xl gap-space-md">
        <div>
          <div className="inline-flex items-center gap-space-2xs text-primary font-title-sm text-title-sm mb-space-2xs">
            <span className="material-symbols-outlined text-lg">tune</span>
            Interactive Engine
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
            Trip Planner &amp; Collaborative Splitter
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-1">
            Build day-by-day itineraries, track milestones, and automatically split rental transport, villas, and activities with your squad.
          </p>
        </div>

        <div className="flex items-center gap-space-xs">
          <Button
            variant="primary"
            icon="add"
            onClick={() => setCreateTripModalOpen(true)}
          >
            Plan New Trip
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="space-y-space-lg">
          {/* Active Trip Selector Tabs */}
          {trips.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {trips.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTrip(t)}
                  className={`px-4 py-2 rounded-full font-title-sm text-sm transition-all whitespace-nowrap ${
                    activeTrip?.id === t.id
                      ? 'bg-secondary-container text-on-secondary-container shadow-sm font-semibold'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {t.title} ({t.destination})
                </button>
              ))}
            </div>
          )}

          {/* Bento Showcase Container */}
          <div className="bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-surface-container rounded-3xl p-space-lg sm:p-space-2xl shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
              {/* Left Panel: Itinerary Chronology */}
              <div className="lg:col-span-7 bg-surface-container-lowest rounded-3xl p-space-md sm:p-space-lg shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between flex-wrap gap-space-xs pb-space-sm border-b border-surface-container-high/40">
                    <div className="flex items-center gap-space-xs">
                      <div className="w-10 h-10 rounded-full bg-primary-container/10 flex items-center justify-center text-primary-container">
                        <span className="material-symbols-outlined">map</span>
                      </div>
                      <div>
                        <h3 className="font-headline-md text-headline-md text-on-surface">
                          {activeTrip?.title || 'Manali Expedition'}
                        </h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {activeTrip?.durationDays || 5} Days • {activeTrip?.destination || 'Himalayan Circuit'} • {formatCurrency(activeTrip?.estimatedCost || 420)} Est. Cost
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-2xs">
                      <span className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold">
                        {activeTrip?.status || 'Active Plan'}
                      </span>
                    </div>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="mt-space-md space-y-space-md relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container-high">
                    {activeTrip?.itineraryItems?.length > 0 ? (
                      activeTrip.itineraryItems.map((item) => {
                        const isCompleted = item.status === 'COMPLETED';
                        const isInProgress = item.status === 'IN_PROGRESS';

                        return (
                          <div key={item.id} className="relative group">
                            <div
                              className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ring-4 ring-surface-container-lowest ${
                                isCompleted
                                  ? 'bg-primary-container text-on-primary'
                                  : isInProgress
                                  ? 'bg-tertiary-container text-on-primary animate-pulse'
                                  : 'bg-surface-variant text-on-surface-variant'
                              }`}
                            >
                              <span className="material-symbols-outlined text-xs">
                                {isCompleted ? 'check' : isInProgress ? 'play_arrow' : 'schedule'}
                              </span>
                            </div>
                            <div className="bg-surface-container-low p-space-sm rounded-2xl">
                              <div className="flex items-center justify-between text-body-sm">
                                <span className="font-title-sm text-title-sm text-on-surface">
                                  {item.title}
                                </span>
                                <span
                                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    isCompleted
                                      ? 'bg-surface-container-lowest text-primary'
                                      : isInProgress
                                      ? 'bg-tertiary-fixed text-tertiary font-bold'
                                      : 'bg-surface-container-lowest text-on-surface-variant'
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </div>
                              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-on-surface-variant italic">No itinerary stops added yet. Click "Add Place" below!</p>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center justify-between pt-space-md mt-space-md border-t border-surface-container-high/40">
                  <Button
                    variant="ghost"
                    icon="add_location_alt"
                    onClick={() => {
                      setItemForm({
                        dayNumber: (activeTrip?.itineraryItems?.length || 0) + 1,
                        title: '',
                        description: '',
                        status: 'UPCOMING',
                      });
                      setAddItemModalOpen(true);
                    }}
                  >
                    Add Place
                  </Button>
                  <Button
                    variant="primary"
                    icon="share"
                    onClick={() => {
                      navigator.clipboard?.writeText(window.location.href);
                      alert('Trip link copied to clipboard!');
                    }}
                  >
                    Save &amp; Share Trip
                  </Button>
                </div>
              </div>

              {/* Right Panel: Budget Splitter */}
              <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-space-md sm:p-space-lg shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-space-sm">
                    <div>
                      <span className="font-label-caps text-label-caps text-tertiary uppercase">Split &amp; Save</span>
                      <h3 className="font-headline-md text-headline-md text-on-surface">Budget Splitter</h3>
                    </div>
                    <div className="text-right">
                      <span className="font-headline-md text-headline-md font-bold text-primary">
                        ${costPerNomad}
                      </span>
                      <span className="text-xs text-on-surface-variant block">per nomad</span>
                    </div>
                  </div>

                  {/* Co-travelers Control */}
                  <div className="mt-space-sm p-space-sm bg-surface-container-low rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs ring-2 ring-surface-container-lowest">A</div>
                        <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-primary flex items-center justify-center font-bold text-xs ring-2 ring-surface-container-lowest">M</div>
                        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs ring-2 ring-surface-container-lowest">E</div>
                      </div>
                      <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                        {nomadCount} Buddies Joined
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setNomadCount(Math.max(1, nomadCount - 1))}
                        className="w-6 h-6 rounded-full bg-surface-container-lowest text-on-surface font-bold text-xs flex items-center justify-center shadow-xs"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold px-1">{nomadCount}</span>
                      <button
                        onClick={() => setNomadCount(nomadCount + 1)}
                        className="w-6 h-6 rounded-full bg-surface-container-lowest text-on-surface font-bold text-xs flex items-center justify-center shadow-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Expense Breakdown */}
                  <div className="mt-space-md space-y-space-sm">
                    {expenses.length > 0 ? (
                      expenses.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between text-body-sm mb-1">
                            <span className="text-on-surface font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-base text-primary">
                                {exp.category === 'LODGING' ? 'hotel' : exp.category === 'TRANSFER' ? 'directions_car' : exp.category === 'FOOD' ? 'restaurant' : 'paragliding'}
                              </span>
                              {exp.description}
                            </span>
                            <span className="font-bold text-on-surface">{exp.percentage}% • {formatCurrency(exp.amount)}</span>
                          </div>
                          <div className="w-full h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                exp.category === 'LODGING'
                                  ? 'bg-primary'
                                  : exp.category === 'TRANSFER'
                                  ? 'bg-primary-container'
                                  : exp.category === 'FOOD'
                                  ? 'bg-tertiary-container'
                                  : 'bg-secondary'
                              }`}
                              style={{ width: `${exp.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-on-surface-variant italic">No expense items logged yet.</p>
                    )}
                  </div>

                  <div className="mt-space-md p-space-sm bg-surface-container-highest/60 rounded-2xl flex items-center gap-space-xs text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-tertiary-container text-base">savings</span>
                    <span>Splitting rental SUV and campsite between {nomadCount} nomads saves ~38% compared to solo!</span>
                  </div>
                </div>

                <div className="pt-space-md mt-space-md flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    icon="add"
                    onClick={() => setAddExpenseModalOpen(true)}
                  >
                    Add Expense
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    icon="calculate"
                    onClick={() => alert(`Auto-split calculation: Total of ${formatCurrency(totalExpenses)} split equally across ${nomadCount} nomads is ${formatCurrency(totalExpenses / nomadCount)} each.`)}
                  >
                    Auto-Split
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Place Modal */}
      <Modal
        isOpen={addItemModalOpen}
        onClose={() => setAddItemModalOpen(false)}
        title="Add Itinerary Stop"
      >
        <form onSubmit={handleAddItem} className="space-y-3">
          <Input
            label="Day Number"
            type="number"
            value={itemForm.dayNumber}
            onChange={(e) => setItemForm({ ...itemForm, dayNumber: e.target.value })}
            required
          />
          <Input
            label="Stop Title"
            placeholder="e.g. Day 4: Vashisht Hot Springs Trek"
            value={itemForm.title}
            onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
            required
          />
          <div>
            <label className="font-label-caps text-on-surface-variant uppercase text-xs block mb-1">
              Status
            </label>
            <select
              value={itemForm.status}
              onChange={(e) => setItemForm({ ...itemForm, status: e.target.value })}
              className="w-full p-2.5 bg-surface-container-low rounded-2xl text-on-surface text-sm focus:outline-none"
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div>
            <label className="font-label-caps text-on-surface-variant uppercase text-xs block mb-1">
              Activities &amp; Highlights
            </label>
            <textarea
              rows="3"
              className="w-full p-3 bg-surface-container-low rounded-2xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
              placeholder="Describe morning activities, meal stops, or evening gathering..."
              value={itemForm.description}
              onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" icon="add">
            Add to Itinerary
          </Button>
        </form>
      </Modal>

      {/* Add Expense Modal */}
      <Modal
        isOpen={addExpenseModalOpen}
        onClose={() => setAddExpenseModalOpen(false)}
        title="Add Expense Category"
      >
        <form onSubmit={handleAddExpense} className="space-y-3">
          <div>
            <label className="font-label-caps text-on-surface-variant uppercase text-xs block mb-1">
              Category
            </label>
            <select
              value={expenseForm.category}
              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
              className="w-full p-2.5 bg-surface-container-low rounded-2xl text-on-surface text-sm focus:outline-none"
            >
              <option value="LODGING">Lodging (Hostel &amp; Camps)</option>
              <option value="TRANSFER">Transfer &amp; Vehicles</option>
              <option value="FOOD">Food &amp; Dining</option>
              <option value="ACTIVITIES">Activities &amp; Permits</option>
            </select>
          </div>
          <Input
            label="Description / Vendor"
            placeholder="e.g. Riverside wooden cottage &amp; camp"
            value={expenseForm.description}
            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
            required
          />
          <Input
            label="Total Amount ($)"
            type="number"
            value={expenseForm.amount}
            onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
            required
          />
          <Button type="submit" variant="primary" className="w-full" icon="receipt">
            Save Expense
          </Button>
        </form>
      </Modal>

      {/* Plan New Trip Modal */}
      <Modal
        isOpen={createTripModalOpen}
        onClose={() => setCreateTripModalOpen(false)}
        title="Plan New Custom Trip"
      >
        <form onSubmit={handleCreateTrip} className="space-y-3">
          <Input
            label="Trip Title"
            placeholder="e.g. Gokarna Beach Crawl &amp; Camping"
            value={newTripForm.title}
            onChange={(e) => setNewTripForm({ ...newTripForm, title: e.target.value })}
            required
          />
          <Input
            label="Destination"
            placeholder="e.g. Gokarna, Karnataka"
            value={newTripForm.destination}
            onChange={(e) => setNewTripForm({ ...newTripForm, destination: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <Input
              label="Duration (Days)"
              type="number"
              value={newTripForm.durationDays}
              onChange={(e) => setNewTripForm({ ...newTripForm, durationDays: e.target.value })}
              required
            />
            <Input
              label="Est. Total Cost ($)"
              type="number"
              value={newTripForm.estimatedCost}
              onChange={(e) => setNewTripForm({ ...newTripForm, estimatedCost: e.target.value })}
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full" icon="flight_takeoff">
            Create Trip Plan
          </Button>
        </form>
      </Modal>
    </div>
  );
};
