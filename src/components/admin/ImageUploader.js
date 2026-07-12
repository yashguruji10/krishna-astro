'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageUploader({ value, onChange, label }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center flex-shrink-0">
          {value ? (
            <Image src={value} alt="preview" fill className="object-cover" />
          ) : (
            <span className="text-3xl text-gray-300">🖼</span>
          )}
        </div>
        <div className="flex-1">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
            onChange={handleFileChange}
            disabled={uploading}
            className="text-sm"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
          {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-sm text-red-600 mt-1 underline"
            >
              Remove image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
