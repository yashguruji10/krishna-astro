'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { isValidPhoneNumber } from 'react-phone-number-input/max';
import { buildWhatsAppLink, buildOrderWhatsAppMessage } from '@/lib/whatsapp';
import PhoneField from './PhoneField';

export default function ServiceEnquiryForm({ serviceId, serviceTitle, locale }) {
  const t = useTranslations('service');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    dob: '',
    birthTime: '',
    birthPlace: '',
    message: ''
  });
  const [errors, setErrors] = useState({ phone: '', whatsapp: '' });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePhoneChange(value) {
    setForm((prev) => ({ ...prev, phone: value || '' }));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
  }

  function handleWhatsappChange(value) {
    setForm((prev) => ({ ...prev, whatsapp: value || '' }));
    if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: '' }));
  }

  function handlePhoneBlur() {
    if (form.phone && !isValidPhoneNumber(form.phone)) {
      setErrors((prev) => ({ ...prev, phone: t('invalidPhone') }));
    }
  }

  function handleWhatsappBlur() {
    if (form.whatsapp && !isValidPhoneNumber(form.whatsapp)) {
      setErrors((prev) => ({ ...prev, whatsapp: t('invalidPhone') }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const nextErrors = { phone: '', whatsapp: '' };
    if (!form.phone || !isValidPhoneNumber(form.phone)) {
      nextErrors.phone = t('invalidPhone');
    }
    if (form.whatsapp && !isValidPhoneNumber(form.whatsapp)) {
      nextErrors.whatsapp = t('invalidPhone');
    }
    if (nextErrors.phone || nextErrors.whatsapp) {
      setErrors(nextErrors);
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          service: serviceId,
          serviceTitle,
          locale
        })
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();

      const waLink = buildWhatsAppLink(
        data.adminWhatsapp,
        buildOrderWhatsAppMessage(form, serviceTitle)
      );
      setWhatsappLink(waLink);
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
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
          >
            <i className="fa fa-whatsapp" /> {t('sendWhatsapp')}
          </a>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t('name')} required>
          <input className="input-field" type="text" name="name" required value={form.name} onChange={handleChange} />
        </Field>
        <Field label={t('email')}>
          <input className="input-field" type="email" name="email" value={form.email} onChange={handleChange} />
        </Field>
        <PhoneField label={t('phone')} required value={form.phone} onChange={handlePhoneChange} onBlur={handlePhoneBlur} error={errors.phone} />
        <PhoneField label={t('whatsapp')} value={form.whatsapp} onChange={handleWhatsappChange} onBlur={handleWhatsappBlur} error={errors.whatsapp} />
        <Field label={t('dob')}>
          <input className="input-field" type="date" name="dob" value={form.dob} onChange={handleChange} />
        </Field>
        <Field label={t('birthTime')}>
          <input className="input-field" type="time" name="birthTime" value={form.birthTime} onChange={handleChange} />
        </Field>
      </div>
      <Field label={t('birthPlace')}>
        <input className="input-field" type="text" name="birthPlace" value={form.birthPlace} onChange={handleChange} />
      </Field>
      <Field label={t('message')}>
        <textarea className="input-field" name="message" rows={4} value={form.message} onChange={handleChange} />
      </Field>

      {status === 'error' && (
        <p className="text-red-600 text-sm">{t('errorMessage')}</p>
      )}

      <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full justify-center disabled:opacity-60">
        {status === 'submitting' ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}
