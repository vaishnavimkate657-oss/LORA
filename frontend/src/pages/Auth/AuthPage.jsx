import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';

export const AuthPage = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState(25);
  const [city, setCity] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login({ email, password });
      } else {
        await register({ email, password, fullName, age: Number(age), city });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (userEmail) => {
    setEmail(userEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-space-2xl">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl p-space-xl shadow-[0_12px_40px_rgba(15,23,42,0.06)] border border-surface-container-high">
        {/* Brand Header */}
        <div className="text-center mb-space-lg">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-container/15 text-primary mb-2">
            <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
          </div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            {mode === 'login' ? 'Log in to manage your trips and partner connections.' : 'Join 85,000+ verified wanderers worldwide.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-surface-container-low p-1 rounded-full mb-space-lg">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2 text-center rounded-full font-title-sm text-sm transition-all ${
              mode === 'login' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-on-surface-variant'
            }`}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2 text-center rounded-full font-title-sm text-sm transition-all ${
              mode === 'register' ? 'bg-surface-container-lowest text-on-surface shadow-xs' : 'text-on-surface-variant'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="p-3 bg-error-container/40 text-error rounded-2xl text-xs font-semibold mb-4">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <Input
                label="Full Name"
                icon="person"
                placeholder="e.g. Maya Lin"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  label="Age"
                  icon="cake"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
                <Input
                  label="City"
                  icon="location_city"
                  placeholder="e.g. Mumbai"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </>
          )}

          <Input
            label="Email Address"
            icon="mail"
            type="email"
            placeholder="you@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            icon="lock"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="w-full mt-2"
          >
            {mode === 'login' ? 'Log In' : 'Create Free Account'}
          </Button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="mt-space-lg pt-space-md border-t border-surface-container-high">
          <p className="text-xs text-on-surface-variant text-center mb-2 font-medium">Quick Demo Accounts:</p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => setDemoCredentials('demo@trippartner.com')}
              className="px-2.5 py-1 rounded-full bg-surface-container-low text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
            >
              Demo Traveler
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('ananya@trippartner.com')}
              className="px-2.5 py-1 rounded-full bg-surface-container-low text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
            >
              Ananya
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('marcus@trippartner.com')}
              className="px-2.5 py-1 rounded-full bg-surface-container-low text-xs font-medium text-on-surface hover:bg-surface-container transition-colors"
            >
              Marcus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
