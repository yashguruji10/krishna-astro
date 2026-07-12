import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import { dbConnect } from '@/lib/dbConnect';
import Service from '@/models/Service';
import { getSiteSettings } from '@/lib/siteSettings';
import HeroCarousel from '@/components/HeroCarousel';
import LazyImage from '@/components/LazyImage';

export default async function HomePage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const settings = await getSiteSettings();
  const prefix = locale === 'en' ? '' : `/${locale}`;

  await dbConnect();
  const services = await Service.find({ isActive: true, category: 'service' })
    .sort({ order: 1, createdAt: -1 }).limit(8).lean();
  const products = await Service.find({ isActive: true, category: 'product' })
    .sort({ order: 1, createdAt: -1 }).limit(4).lean();

  const heroTitle    = settings.home?.heroTitle?.[locale]    || settings.home?.heroTitle?.en    || t('home.heroDefaultTitle');
  const heroSubtitle = settings.home?.heroSubtitle?.[locale] || settings.home?.heroSubtitle?.en || t('home.heroDefaultSubtitle');
  const slides = settings.home?.heroSlides || [];
  const astro  = settings.home?.astrologerSection || {};
  const mapUrl = settings.contact?.mapEmbedUrl || '';

  const loc = (hi, gu, en) => locale === 'hi' ? hi : locale === 'gu' ? gu : en;

  return (
    <div>

      {/* ── Hero Banner ── */}
      <section className="relative bg-gradient-to-br from-maroon via-maroon to-saffron text-white">
        <div className="container-page py-10 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-2">🕉 Jay Durga Jyotish</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow leading-tight">{heroTitle}</h1>
            <p className="text-lg text-cream/90 mb-7 leading-relaxed">{heroSubtitle}</p>
            <div className="flex flex-wrap gap-4">
              <Link href={`${prefix}/contact`}
                className="inline-flex items-center gap-2 bg-gold text-maroon font-bold px-6 py-3 rounded-lg hover:bg-yellow-300 transition-colors shadow">
                {t('home.ctaContact')}
              </Link>
              <a href={`https://wa.me/${settings.contact.whatsappNumber}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-secondary">
                <i className="fa fa-whatsapp" /> {t('home.ctaWhatsapp')}
              </a>
            </div>
            {/* Quick contact strip */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-cream/80">
              <a href={`tel:${settings.contact.phone.replace(/\s/g,'')}`} className="flex items-center gap-1 hover:text-gold">
                📞 {settings.contact.phone}
              </a>
              <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-1 hover:text-gold">
                ✉ {settings.contact.email}
              </a>
            </div>
          </div>
          <div className="relative h-56 md:h-80 rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/30">
            {settings.home?.heroImage ? (
              <LazyImage src={settings.home.heroImage} alt={heroTitle} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" priority />
            ) : (
              <div className="flex items-center justify-center h-full text-7xl bg-white/10">🕉</div>
            )}
          </div>
        </div>
      </section>

      {/* ── Image Carousel Scroll ── */}
      {slides.length > 0 && (
        <section className="w-full shadow-inner">
          <HeroCarousel slides={slides} locale={locale} />
        </section>
      )}

      {/* ── Meet Famous Indian Astrologer ── */}
      {(astro.title?.[locale] || astro.title?.en) && (
        <section className="py-14 bg-cream">
          <div className="container-page">
            <div className="text-center mb-10">
              <h2 className="section-title">
                {(astro.title?.[locale] || astro.title?.en)}
              </h2>
              {(astro.subtitle?.[locale] || astro.subtitle?.en) && (
                <p className="text-saffron font-semibold text-base mt-1">
                  {astro.subtitle?.[locale] || astro.subtitle?.en}
                </p>
              )}
              <div className="w-20 h-1 bg-saffron mx-auto mt-3 rounded" />
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Astrologer photo */}
              <div className="flex justify-center">
                <div className="relative w-64 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-gold">
                  {astro.image ? (
                    <LazyImage src={astro.image} alt={astro.title?.en || 'Astrologer'} fill sizes="(max-width: 768px) 256px, 320px" className="object-cover object-top" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-7xl bg-saffron/10">🙏</div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <div
                  className="prose max-w-none text-gray-700 leading-relaxed mb-6"
                  dangerouslySetInnerHTML={{ __html: astro.content?.[locale] || astro.content?.en || '' }}
                />
                {/* Expertise badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {['Hast Rekha','Vashikaran','Black Magic Removal','Horoscope Reading',
                    'Love Problem','Business Problem','Santan Prapti','Spiritual Healing'].map((badge) => (
                    <span key={badge}
                      className="bg-maroon/10 text-maroon text-xs font-semibold px-3 py-1.5 rounded-full border border-maroon/20">
                      ✦ {badge}
                    </span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={`${prefix}/about`} className="btn-primary">
                    {t('home.readMore')}
                  </Link>
                  <a href={`https://wa.me/${settings.contact.whatsappNumber}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-secondary">
                    <i className="fa fa-whatsapp" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Services ── */}
      {services.length > 0 && (
        <section className="py-14 bg-white">
          <div className="container-page">
            <div className="text-center mb-10">
              <h2 className="section-title">
                {t('home.servicesTitle')} <span>{t('home.servicesTitleHighlight')}</span>
              </h2>
              <div className="w-20 h-1 bg-saffron mx-auto mt-3 rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {services.map((s) => <ServiceCard key={s._id} service={s} locale={locale} prefix={prefix} t={t} />)}
            </div>
            <div className="text-center mt-10">
              <Link href={`${prefix}/services`} className="btn-primary">{t('common.viewAll')}</Link>
            </div>
          </div>
        </section>
      )}

      {/* ── About Short ── */}
      <section className="py-14 bg-cream">
        <div className="container-page max-w-3xl mx-auto text-center">
          <h2 className="section-title">
            {t('home.aboutTitle')} <span>{t('home.aboutTitleHighlight')}</span>
          </h2>
          <div className="w-20 h-1 bg-saffron mx-auto mt-3 mb-6 rounded" />
          <div
            className="prose max-w-none text-gray-700 text-lg leading-relaxed"
            dangerouslySetInnerHTML={{ __html: settings.home?.aboutShort?.[locale] || settings.home?.aboutShort?.en || '' }}
          />
          <Link href={`${prefix}/about`} className="btn-primary mt-6 inline-flex">
            {t('home.readMore')}
          </Link>
        </div>
      </section>

      {/* ── Products ── */}
      {products.length > 0 && (
        <section className="py-14 bg-white">
          <div className="container-page">
            <div className="text-center mb-10">
              <h2 className="section-title">
                {t('home.productsTitle')} <span>{t('home.productsTitleHighlight')}</span>
              </h2>
              <div className="w-20 h-1 bg-saffron mx-auto mt-3 rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((s) => <ServiceCard key={s._id} service={s} locale={locale} prefix={prefix} t={t} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── Why Choose Us strip ── */}
      <section className="bg-maroon text-cream py-12">
        <div className="container-page grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '⭐', en: '25+ Years Experience', hi: '25+ वर्ष अनुभव', gu: '25+ વર્ષ અનુભવ' },
            { icon: '🌍', en: 'Worldwide Service',    hi: 'विश्वव्यापी सेवा', gu: 'વૈશ્વિક સેવા' },
            { icon: '🔒', en: '100% Confidential',   hi: '100% गोपनीय',   gu: '100% ગોપનીય' },
            { icon: '✅', en: 'Fast Solutions',       hi: 'तुरंत समाधान',  gu: 'ત્વરિત ઉકેલ' }
          ].map((item) => (
            <div key={item.en} className="py-2">
              <div className="text-4xl mb-2">{item.icon}</div>
              <p className="font-bold text-gold text-sm md:text-base">{loc(item.hi, item.gu, item.en)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Location / Map ── */}
      <section className="py-14 bg-cream">
        <div className="container-page">
          <div className="text-center mb-8">
            <h2 className="section-title">
              {loc('हमारा', 'અમારું', 'Our')} <span>{loc('स्थान', 'સ્થાન', 'Location')}</span>
            </h2>
            <p className="text-gray-600 mt-1 text-sm">
              {settings.contact.address?.[locale] || settings.contact.address?.en}
            </p>
            <div className="w-20 h-1 bg-saffron mx-auto mt-3 rounded" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            {/* Map embed */}
            <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gold/30 min-h-[280px]">
              {mapUrl ? (
                <iframe
                  src={mapUrl}
                  width="100%" height="100%"
                  style={{ border: 0, minHeight: '280px' }}
                  loading="lazy"
                  allowFullScreen
                  title="Jay Durga Jyotish location"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400 text-sm p-6 text-center">
                  Map not configured. Add Google Maps embed URL in Admin → Settings → Contact.
                </div>
              )}
            </div>

            {/* Contact info cards */}
            <div className="space-y-3 flex flex-col justify-center">
              {[
                { icon: '📍', lbl: loc('पता','સરનામું','Address'), val: settings.contact.address?.[locale] || settings.contact.address?.en },
                { icon: '📞', lbl: loc('फ़ोन','ફોન','Phone'), val: settings.contact.phone, href: `tel:${settings.contact.phone.replace(/\s/g,'')}` },
                { icon: '✉',  lbl: loc('ईमेल','ઈમેલ','Email'), val: settings.contact.email, href: `mailto:${settings.contact.email}` },
                { icon: '💬', lbl: 'WhatsApp', val: `+${settings.contact.whatsappNumber}`, href: `https://wa.me/${settings.contact.whatsappNumber}`, ext: true }
              ].map(({ icon, lbl, val, href, ext }) => (
                <div key={lbl} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gold/20">
                  <span className="text-2xl flex-shrink-0">{icon}</span>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{lbl}</p>
                    {href ? (
                      <a href={href} target={ext ? '_blank' : undefined} rel={ext ? 'noopener noreferrer' : undefined}
                        className="text-gray-800 font-medium hover:text-saffron transition-colors">{val}</a>
                    ) : (
                      <p className="text-gray-800 font-medium">{val}</p>
                    )}
                  </div>
                </div>
              ))}
              {settings.social?.facebook && (
                <div className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-gold/20">
                  <span className="text-2xl">👍</span>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Facebook</p>
                    <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer"
                      className="text-gray-800 font-medium hover:text-saffron transition-colors">
                      Jay Durga Jyotish
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Locations (branches) ── */}
      {(settings.home?.branches || []).length > 0 && (
        <section className="py-14 bg-white">
          <div className="container-page">
            <div className="text-center mb-10">
              <h2 className="section-title">
                {t('home.locationsTitle')} <span>{t('home.locationsTitleHighlight')}</span>
              </h2>
              <div className="w-20 h-1 bg-saffron mx-auto mt-3 rounded" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {settings.home.branches.map((branch, idx) => (
                <div key={idx} className="card overflow-hidden border border-gold/20">
                  {branch.mapEmbedUrl && (
                    <div className="h-40 w-full">
                      <iframe
                        src={branch.mapEmbedUrl}
                        width="100%" height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        title={branch.name?.[locale] || branch.name?.en || `location-${idx}`}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-maroon">{branch.name?.[locale] || branch.name?.en}</h3>
                    <p className="text-sm text-gray-500 mt-1">{branch.address?.[locale] || branch.address?.en}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Country pages */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {['usa', 'canada', 'uk']
                .filter((c) => settings.countryPages?.[c]?.enabled !== false)
                .map((c) => (
                  <Link key={c} href={`${prefix}/${c}`}
                    className="bg-cream border border-gold/30 text-maroon font-semibold px-5 py-2 rounded-full text-sm hover:bg-gold/20 transition-colors">
                    {t(`home.${c}Page`)}
                  </Link>
                ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

function ServiceCard({ service, locale, prefix, t }) {
  const title = service.title?.[locale] || service.title?.en;
  const desc  = service.shortDescription?.[locale] || service.shortDescription?.en;
  return (
    <Link href={`${prefix}/services/${service.slug}`} className="card group flex flex-col">
      <div className="relative h-44 w-full bg-gray-100 flex-shrink-0 overflow-hidden">
        {service.image ? (
          <LazyImage src={service.image} alt={title} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl">🔮</div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-maroon text-base group-hover:text-saffron leading-snug">{title}</h3>
        {desc && <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">{desc}</p>}
        <span className="inline-block mt-3 text-saffron font-semibold text-sm">
          {t('home.viewDetails')} →
        </span>
      </div>
    </Link>
  );
}
