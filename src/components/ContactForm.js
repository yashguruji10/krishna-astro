'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { buildWhatsAppLink } from '@/lib/whatsapp';

export default function ContactForm({ locale }) {
  const t = useTranslations('service');
  const [status, setStatus] = useState('idle');
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale })
      });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      setWhatsappLink(
        buildWhatsAppLink(
          data.adminWhatsapp,
          `New Contact Enquiry\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nMessage: ${form.message}`
        )
      );
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-6">
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-xl font-bold text-maroon mb-2">{t('successTitle')}</h3>
        <p className="text-gray-600 mb-6">{t('successMessage')}</p>
        {whatsappLink && (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-secondary">
            <i className="fa fa-whatsapp" /> {t('sendWhatsapp')}
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-1">{t('name')} *</span>
        <input className="input-field" type="text" name="name" required value={form.name} onChange={handleChange} />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-1">{t('email')} *</span>
        <input className="input-field" type="email" name="email" required value={form.email} onChange={handleChange} />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-1">{t('phone')} *</span>
        <input className="input-field" type="tel" name="phone" required value={form.phone} onChange={handleChange} />
      </label>
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 mb-1">{t('message')}</span>
        <textarea className="input-field" name="message" rows={4} value={form.message} onChange={handleChange} />
      </label>

      {status === 'error' && <p className="text-red-600 text-sm">{t('errorMessage')}</p>}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full justify-center disabled:opacity-60">
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
