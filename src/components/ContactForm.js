'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { isValidPhoneNumber } from 'react-phone-number-input/max';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import PhoneField from './PhoneField';

export default function ContactForm({ locale }) {
  const t = useTranslations('service');
  const [status, setStatus] = useState('idle');
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [phoneError, setPhoneError] = useState('');

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhoneChange(value) {
    setForm((prev) => ({ ...prev, phone: value || '' }));
    if (phoneError) setPhoneError('');
  }

  function handlePhoneBlur() {
    if (form.phone && !isValidPhoneNumber(form.phone)) {
      setPhoneError(t('invalidPhone'));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.phone || !isValidPhoneNumber(form.phone)) {
      setPhoneError(t('invalidPhone'));
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, locale })
      });
      if (!res.ok) throw new Error('failed');
      const data = await res.json();
      const lines = [
        'New Contact Enquiry',
        `Name: ${form.name}`,
        `Phone: ${form.phone}`,
        form.email ? `Email: ${form.email}` : null,
        `Message: ${form.message}`
      ].filter(Boolean);
      setWhatsappLink(buildWhatsAppLink(data.adminWhatsapp, lines.join('\n')));
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
        <span className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</span>
        <input className="input-field" type="email" name="email" value={form.email} onChange={handleChange} />
      </label>
      <PhoneField label={`${t('phone')} *`} value={form.phone} onChange={handlePhoneChange} onBlur={handlePhoneBlur} error={phoneError} />
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
