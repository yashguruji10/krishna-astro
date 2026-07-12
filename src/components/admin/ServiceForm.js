'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LangTabs from '@/components/admin/LangTabs';
import ImageUploader from '@/components/admin/ImageUploader';

const EMPTY = { en: '', hi: '', gu: '' };

export default function ServiceForm({ initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial?._id);

  const [form, setForm] = useState({
    slug: initial?.slug || '',
    title: initial?.title || { ...EMPTY },
    shortDescription: initial?.shortDescription || { ...EMPTY },
    description: initial?.description || { ...EMPTY },
    image: initial?.image || '',
    price: initial?.price ?? 0,
    category: initial?.category || 'service',
    isActive: initial?.isActive ?? true,
    order: initial?.order ?? 0
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function autoSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEdit ? `/api/services/${initial._id}` : '/api/services';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        ...form,
        slug: form.slug || autoSlug(form.title.en),
        price: Number(form.price) || 0,
        order: Number(form.order) || 0
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save');
        setSaving(false);
        return;
      }

      router.push('/admin/services');
      router.refresh();
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="card p-5 space-y-4">
        <LangTabs label="Title" value={form.title} onChange={(v) => update('title', v)} />

        <label className="block">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            URL Slug {!isEdit && '(leave blank to auto-generate from English title)'}
          </span>
          <input
            type="text"
            className="input-field"
            value={form.slug}
            onChange={(e) => update('slug', e.target.value)}
            placeholder="e.g. love-marriage-specialist"
          />
        </label>

        <LangTabs
          label="Short Description (shown on cards)"
          value={form.shortDescription}
          onChange={(v) => update('shortDescription', v)}
          multiline
          rows={2}
        />

        <LangTabs
          label="Full Description (shown on detail page)"
          value={form.description}
          onChange={(v) => update('description', v)}
          multiline
          rich
          rows={6}
        />

        <ImageUploader label="Image" value={form.image} onChange={(v) => update('image', v)} />

        <div className="grid sm:grid-cols-3 gap-4">
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Category</span>
            <select className="input-field" value={form.category} onChange={(e) => update('category', e.target.value)}>
              <option value="service">Service</option>
              <option value="product">Product</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Price (0 = on request)</span>
            <input
              type="number"
              min="0"
              className="input-field"
              value={form.price}
              onChange={(e) => update('price', e.target.value)}
            />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-gray-700 mb-1">Display Order</span>
            <input
              type="number"
              className="input-field"
              value={form.order}
              onChange={(e) => update('order', e.target.value)}
            />
          </label>
        </div>

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isActive} onChange={(e) => update('isActive', e.target.checked)} />
          <span className="text-sm font-medium text-gray-700">Active (visible on website)</span>
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={() => router.push('/admin/services')} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
