'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        setError('Invalid email or password');
        setLoading(false);
        return;
      }
      router.push('/admin/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maroon to-saffron p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-maroon mb-1 text-center">Admin Login</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Jay Durga Jyotish</p>

        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">Email</span>
          <input
            type="email"
            required
            className="input-field"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </label>
        <label className="block mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-1">Password</span>
          <input
            type="password"
            required
            className="input-field"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </label>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
