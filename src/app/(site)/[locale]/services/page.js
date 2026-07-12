import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import LazyImage from '@/components/LazyImage';
import { dbConnect } from '@/lib/dbConnect';
import Service from '@/models/Service';

export default async function ServicesPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const prefix = locale === 'en' ? '' : `/${locale}`;

  await dbConnect();
  const services = await Service.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return (
    <div className="container-page py-12">
      <h1 className="section-title text-center">
        {t('home.servicesTitle')} <span>{t('home.servicesTitleHighlight')}</span> & {t('home.productsTitle')} <span>{t('home.productsTitleHighlight')}</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        {services.map((service) => {
          const title = service.title?.[locale] || service.title?.en;
          const desc = service.shortDescription?.[locale] || service.shortDescription?.en;
          return (
            <Link key={service._id} href={`${prefix}/services/${service.slug}`} className="card group">
              <div className="relative h-48 w-full bg-gray-100">
                {service.image ? (
                  <LazyImage src={service.image} alt={title} fill sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full text-5xl">🔮</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-maroon text-lg group-hover:text-saffron">{title}</h3>
                {desc && <p className="text-sm text-gray-600 mt-1 line-clamp-3">{desc}</p>}
                <span className="inline-block mt-3 text-saffron font-medium text-sm">
                  {t('home.viewDetails')} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {services.length === 0 && (
        <p className="text-center text-gray-500 mt-12">No services available yet.</p>
      )}
    </div>
  );
}
