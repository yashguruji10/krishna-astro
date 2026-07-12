'use client';

import { useState } from 'react';
import LangTabs from '@/components/admin/LangTabs';
import ImageUploader from '@/components/admin/ImageUploader';

const EMPTY = { en: '', hi: '', gu: '' };

const SECTIONS = [
  { id: 'branding', label: 'Branding' },
  { id: 'contact', label: 'Contact & Links' },
  { id: 'home', label: 'Home Page' },
  { id: 'locations', label: 'Locations' },
  { id: 'about', label: 'About Us' },
  { id: 'terms', label: 'Terms & Conditions' },
  { id: 'privacy', label: 'Privacy Policy' },
  { id: 'footer', label: 'Footer' }
];

export default function SettingsForm({ initial }) {
  const [section, setSection] = useState('branding');
  const [form, setForm] = useState(() => deepDefaults(initial));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function update(path, value) {
    setForm((prev) => {
      const next = structuredClone(prev);
      let obj = next;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setMessage('Saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl">
      <div className="flex gap-2 mb-4 flex-wrap">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSection(s.id)}
            className={`text-sm px-3 py-1.5 rounded-full font-medium ${
              section === s.id ? 'bg-saffron text-white' : 'bg-white border'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="card p-5 space-y-4">
        {section === 'branding' && (
          <>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Site Name</span>
              <input
                type="text"
                className="input-field"
                value={form.siteName}
                onChange={(e) => update('siteName', e.target.value)}
              />
            </label>
            <ImageUploader label="Logo" value={form.logo} onChange={(v) => update('logo', v)} />
            <ImageUploader label="Favicon" value={form.favicon} onChange={(v) => update('favicon', v)} />
          </>
        )}

        {section === 'contact' && (
          <>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Phone Number (displayed)</span>
              <input
                type="text"
                className="input-field"
                value={form.contact.phone}
                onChange={(e) => update('contact.phone', e.target.value)}
                placeholder="+91 94268 93180"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number (digits with country code, no + or spaces)
              </span>
              <input
                type="text"
                className="input-field"
                value={form.contact.whatsappNumber}
                onChange={(e) => update('contact.whatsappNumber', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="919426893180"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Email Address</span>
              <input
                type="email"
                className="input-field"
                value={form.contact.email}
                onChange={(e) => update('contact.email', e.target.value)}
              />
            </label>
            <LangTabs
              label="Address"
              value={form.contact.address}
              onChange={(v) => update('contact.address', v)}
              multiline
              rows={2}
            />
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed URL (optional)</span>
              <input
                type="text"
                className="input-field"
                value={form.contact.mapEmbedUrl}
                onChange={(e) => update('contact.mapEmbedUrl', e.target.value)}
                placeholder="https://www.google.com/maps/embed?..."
              />
            </label>

            <hr className="my-2" />
            <h3 className="font-semibold text-maroon">Social Media Links</h3>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</span>
              <input type="text" className="input-field" value={form.social.facebook} onChange={(e) => update('social.facebook', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</span>
              <input type="text" className="input-field" value={form.social.instagram} onChange={(e) => update('social.instagram', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">YouTube URL</span>
              <input type="text" className="input-field" value={form.social.youtube} onChange={(e) => update('social.youtube', e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-1">Twitter / X URL</span>
              <input type="text" className="input-field" value={form.social.twitter} onChange={(e) => update('social.twitter', e.target.value)} />
            </label>
          </>
        )}

        {section === 'home' && (
          <>
            <LangTabs label="Hero Title" value={form.home.heroTitle} onChange={(v) => update('home.heroTitle', v)} />
            <LangTabs label="Hero Subtitle" value={form.home.heroSubtitle} onChange={(v) => update('home.heroSubtitle', v)} multiline rows={2} />
            <ImageUploader label="Hero Image (right side)" value={form.home.heroImage} onChange={(v) => update('home.heroImage', v)} />

            <hr className="my-3" />
            <h3 className="font-semibold text-maroon text-sm">Image Carousel / Scroll Slides</h3>
            <p className="text-xs text-gray-400 mb-2">These images rotate automatically below the hero banner.</p>
            {form.home.heroSlides.map((slide, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Slide {idx + 1}</span>
                  <button type="button" onClick={() => {
                    const slides = form.home.heroSlides.filter((_, i) => i !== idx);
                    update('home.heroSlides', slides);
                  }} className="text-red-500 text-xs hover:underline">Remove</button>
                </div>
                <ImageUploader value={slide.image} onChange={(v) => {
                  const slides = structuredClone(form.home.heroSlides);
                  slides[idx].image = v;
                  update('home.heroSlides', slides);
                }} />
                <LangTabs label="Caption (optional)" value={slide.caption} onChange={(v) => {
                  const slides = structuredClone(form.home.heroSlides);
                  slides[idx].caption = v;
                  update('home.heroSlides', slides);
                }} />
              </div>
            ))}
            <button type="button"
              onClick={() => update('home.heroSlides', [...form.home.heroSlides, { image: '', caption: { en: '', hi: '', gu: '' } }])}
              className="btn-secondary text-sm !py-1.5">
              + Add Slide
            </button>

            <hr className="my-3" />
            <h3 className="font-semibold text-maroon text-sm">"Meet Famous Indian Astrologer" Section</h3>
            <LangTabs label="Section Title" value={form.home.astrologerSection.title} onChange={(v) => update('home.astrologerSection.title', v)} />
            <LangTabs label="Subtitle" value={form.home.astrologerSection.subtitle} onChange={(v) => update('home.astrologerSection.subtitle', v)} />
            <ImageUploader label="Astrologer Photo" value={form.home.astrologerSection.image} onChange={(v) => update('home.astrologerSection.image', v)} />
            <LangTabs label="Content" value={form.home.astrologerSection.content} onChange={(v) => update('home.astrologerSection.content', v)} multiline rich rows={5} />

            <hr className="my-3" />
            <LangTabs label="About Section (short text, shown on homepage)" value={form.home.aboutShort} onChange={(v) => update('home.aboutShort', v)} multiline rich rows={4} />
          </>
        )}

        {section === 'locations' && (
          <>
            <h3 className="font-semibold text-maroon text-sm">Office / Branch Locations</h3>
            <p className="text-xs text-gray-400 mb-2">
              These show on the homepage in the "Our Locations" section, each with its own map.
              To get a map link: open the location in Google Maps → Share → Embed a map → copy the link inside <code>src=&quot;...&quot;</code>.
            </p>
            {form.home.branches.map((branch, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Location {idx + 1}</span>
                  <button type="button" onClick={() => {
                    const branches = form.home.branches.filter((_, i) => i !== idx);
                    update('home.branches', branches);
                  }} className="text-red-500 text-xs hover:underline">Remove</button>
                </div>
                <LangTabs label="Location Name" value={branch.name} onChange={(v) => {
                  const branches = structuredClone(form.home.branches);
                  branches[idx].name = v;
                  update('home.branches', branches);
                }} />
                <LangTabs label="Address" value={branch.address} onChange={(v) => {
                  const branches = structuredClone(form.home.branches);
                  branches[idx].address = v;
                  update('home.branches', branches);
                }} multiline rows={2} />
                <label className="block">
                  <span className="block text-sm font-medium text-gray-700 mb-1">Google Maps Embed Link (optional)</span>
                  <input
                    type="text"
                    className="input-field"
                    value={branch.mapEmbedUrl}
                    onChange={(e) => {
                      const branches = structuredClone(form.home.branches);
                      branches[idx].mapEmbedUrl = e.target.value;
                      update('home.branches', branches);
                    }}
                    placeholder="https://maps.google.com/maps?q=...&output=embed"
                  />
                </label>
              </div>
            ))}
            <button type="button"
              onClick={() => update('home.branches', [...form.home.branches, {
                name: { en: '', hi: '', gu: '' }, address: { en: '', hi: '', gu: '' }, mapEmbedUrl: ''
              }])}
              className="btn-secondary text-sm !py-1.5">
              + Add Location
            </button>

            <hr className="my-4" />
            <h3 className="font-semibold text-maroon text-sm">Country Pages (USA / Canada / UK)</h3>
            <p className="text-xs text-gray-400 mb-2">
              Each of these becomes its own page on the site (linked in the menu) for people searching from that country.
            </p>
            {['usa', 'canada', 'uk'].map((c) => (
              <div key={c} className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-maroon uppercase">{c}</span>
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      checked={form.countryPages[c].enabled}
                      onChange={(e) => update(`countryPages.${c}.enabled`, e.target.checked)}
                    />
                    Show this page on the site
                  </label>
                </div>
                <LangTabs label="Page Title" value={form.countryPages[c].title} onChange={(v) => update(`countryPages.${c}.title`, v)} />
                <ImageUploader label="Image" value={form.countryPages[c].image} onChange={(v) => update(`countryPages.${c}.image`, v)} />
                <LangTabs label="Page Content" value={form.countryPages[c].content} onChange={(v) => update(`countryPages.${c}.content`, v)} multiline rich rows={6} />
              </div>
            ))}
          </>
        )}

        {section === 'about' && (
          <>
            <LangTabs label="Page Title" value={form.aboutPage.title} onChange={(v) => update('aboutPage.title', v)} />
            <ImageUploader label="Image" value={form.aboutPage.image} onChange={(v) => update('aboutPage.image', v)} />
            <LangTabs
              label="Page Content"
              value={form.aboutPage.content}
              onChange={(v) => update('aboutPage.content', v)}
              multiline
              rich
              rows={8}
            />
          </>
        )}

        {section === 'terms' && (
          <>
            <LangTabs label="Page Title" value={form.termsPage.title} onChange={(v) => update('termsPage.title', v)} />
            <LangTabs
              label="Page Content"
              value={form.termsPage.content}
              onChange={(v) => update('termsPage.content', v)}
              multiline
              rich
              rows={10}
            />
          </>
        )}

        {section === 'privacy' && (
          <>
            <LangTabs label="Page Title" value={form.privacyPage.title} onChange={(v) => update('privacyPage.title', v)} />
            <LangTabs
              label="Page Content"
              value={form.privacyPage.content}
              onChange={(v) => update('privacyPage.content', v)}
              multiline
              rich
              rows={10}
            />
          </>
        )}

        {section === 'footer' && (
          <LangTabs
            label="Footer Text"
            value={form.footerText}
            onChange={(v) => update('footerText', v)}
            multiline
            rows={2}
          />
        )}
      </div>

      {message && (
        <p className={`mt-3 text-sm ${message.startsWith('Saved') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary mt-4 disabled:opacity-60">
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

// Ensure all nested translated fields exist so controlled inputs don't break
function deepDefaults(initial) {
  const s = structuredClone(initial);
  s.siteName = s.siteName || '';
  s.logo = s.logo || '';
  s.favicon = s.favicon || '';

  s.contact = s.contact || {};
  s.contact.phone = s.contact.phone || '';
  s.contact.whatsappNumber = s.contact.whatsappNumber || '';
  s.contact.email = s.contact.email || '';
  s.contact.address = s.contact.address || { ...EMPTY };
  s.contact.mapEmbedUrl = s.contact.mapEmbedUrl || '';

  s.social = s.social || {};
  s.social.facebook = s.social.facebook || '';
  s.social.instagram = s.social.instagram || '';
  s.social.youtube = s.social.youtube || '';
  s.social.twitter = s.social.twitter || '';

  s.home = s.home || {};
  s.home.heroTitle = s.home.heroTitle || { ...EMPTY };
  s.home.heroSubtitle = s.home.heroSubtitle || { ...EMPTY };
  s.home.heroImage = s.home.heroImage || '';
  s.home.heroSlides = (s.home.heroSlides || []).map((slide) => ({
    image: slide.image || '',
    caption: slide.caption || { ...EMPTY }
  }));
  s.home.astrologerSection = s.home.astrologerSection || {};
  s.home.astrologerSection.title = s.home.astrologerSection.title || { ...EMPTY };
  s.home.astrologerSection.subtitle = s.home.astrologerSection.subtitle || { ...EMPTY };
  s.home.astrologerSection.image = s.home.astrologerSection.image || '';
  s.home.astrologerSection.content = s.home.astrologerSection.content || { ...EMPTY };
  s.home.aboutShort = s.home.aboutShort || { ...EMPTY };
  s.home.branches = (s.home.branches || []).map((b) => ({
    name: b.name || { ...EMPTY },
    address: b.address || { ...EMPTY },
    mapEmbedUrl: b.mapEmbedUrl || ''
  }));

  s.aboutPage = s.aboutPage || {};
  s.aboutPage.title = s.aboutPage.title || { ...EMPTY };
  s.aboutPage.content = s.aboutPage.content || { ...EMPTY };
  s.aboutPage.image = s.aboutPage.image || '';

  s.countryPages = s.countryPages || {};
  for (const c of ['usa', 'canada', 'uk']) {
    s.countryPages[c] = s.countryPages[c] || {};
    s.countryPages[c].enabled = s.countryPages[c].enabled !== false;
    s.countryPages[c].title = s.countryPages[c].title || { ...EMPTY };
    s.countryPages[c].content = s.countryPages[c].content || { ...EMPTY };
    s.countryPages[c].image = s.countryPages[c].image || '';
  }

  s.termsPage = s.termsPage || {};
  s.termsPage.title = s.termsPage.title || { ...EMPTY };
  s.termsPage.content = s.termsPage.content || { ...EMPTY };

  s.privacyPage = s.privacyPage || {};
  s.privacyPage.title = s.privacyPage.title || { ...EMPTY };
  s.privacyPage.content = s.privacyPage.content || { ...EMPTY };

  s.footerText = s.footerText || { ...EMPTY };

  return s;
}
