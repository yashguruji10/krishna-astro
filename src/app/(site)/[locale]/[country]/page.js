import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import LazyImage from '@/components/LazyImage';
import { Link } from '@/navigation';
import { getSiteSettings } from '@/lib/siteSettings';

const VALID_COUNTRIES = ['usa', 'canada', 'uk'];

export function generateStaticParams() {
  return VALID_COUNTRIES.map((country) => ({ country }));
}

export default async function CountryPage({ params }) {
  const { country } = params;
  if (!VALID_COUNTRIES.includes(country)) notFound();

  const locale = await getLocale();
  const t = await getTranslations();
  const settings = await getSiteSettings();
  const page = settings.countryPages?.[country];

  if (!page || page.enabled === false) notFound();

  const title = page.title?.[locale] || page.title?.en;
  const content = page.content?.[locale] || page.content?.en;

  return (
    <div className="container-page py-12">
      <h1 className="section-title text-center mb-8">{title}</h1>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative h-72 md:h-96 rounded-xl overflow-hidden bg-gray-100">
          {page.image ? (
            <LazyImage src={page.image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">🕉</div>
          )}
        </div>
        <div>
          <div
            className="prose max-w-none text-gray-700 leading-relaxed text-justify mb-6"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="btn-primary">{t('home.ctaContact')}</Link>
            <a
              href={`https://wa.me/${settings.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              {t('home.ctaWhatsapp')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
