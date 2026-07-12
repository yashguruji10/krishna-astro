'use client';

import { useState } from 'react';
import RichTextEditor from './RichTextEditor';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'gu', label: 'ગુજરાતી' }
];

/**
 * value: { en: '', hi: '', gu: '' }
 * onChange: (newValue) => void
 * multiline: render <textarea> instead of <input>
 * rich: use the WYSIWYG editor (bold/italic/lists/links) instead of a plain textarea,
 *       so the client never has to type HTML tags themselves.
 */
export default function LangTabs({ label, value, onChange, multiline = false, rich = false, rows = 4 }) {
  const [active, setActive] = useState('en');

  function handleFieldChange(e) {
    onChange({ ...value, [active]: e.target.value });
  }

  function handleRichChange(html) {
    onChange({ ...value, [active]: html });
  }

  return (
    <div>
      {label && <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>}
      <div className="flex gap-1 mb-2">
        {LANGS.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setActive(lang.code)}
            className={`px-3 py-1 text-sm rounded-md border ${
              active === lang.code
                ? 'bg-saffron text-white border-saffron'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {lang.label}
            {lang.code === 'en' && !value?.en && <span className="text-red-500 ml-1">*</span>}
          </button>
        ))}
      </div>

      {rich ? (
        <RichTextEditor
          key={active}
          value={value?.[active] || ''}
          onChange={handleRichChange}
          placeholder="Type your text here, then use the toolbar above to make it bold, add bullet points, links, etc."
        />
      ) : multiline ? (
        <textarea
          className="input-field text-sm"
          rows={rows}
          value={value?.[active] || ''}
          onChange={handleFieldChange}
        />
      ) : (
        <input
          type="text"
          className="input-field"
          value={value?.[active] || ''}
          onChange={handleFieldChange}
        />
      )}
    </div>
  );
}
