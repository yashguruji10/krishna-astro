import { getTranslations, getLocale } from 'next-intl/server';
import LazyImage from '@/components/LazyImage';
import { notFound } from 'next/navigation';
import { dbConnect } from '@/lib/dbConnect';
import Service from '@/models/Service';
import ServiceEnquiryForm from '@/components/ServiceEnquiryForm';

export default async function ServiceDetailPage({ params }) {
  const { slug } = params;
  const t = await getTranslations();
  const locale = await getLocale();

  await dbConnect();
  const service = await Service.findOne({ slug, isActive: true }).lean();
  if (!service) notFound();

  const title = service.title?.[locale] || service.title?.en;
  const description = service.description?.[locale] || service.description?.en;

  return (
    <div className="container-page py-12">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden bg-gray-100">
          {service.image ? (
            <LazyImage src={service.image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">🔮</div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-maroon mb-2">{title}</h1>
          <p className="text-xl text-saffron font-semibold mb-4">
            {service.price > 0 ? `₹ ${service.price}` : t('service.priceOnRequest')}
          </p>
          <div
            className="prose max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>
      </div>

      <div className="mt-12 max-w-2xl mx-auto card p-6 md:p-8">
        <h2 className="text-2xl font-bold text-maroon mb-1">{t('service.formTitle')}</h2>
        <p className="text-gray-600 mb-6">{t('service.formSubtitle')}</p>
        <ServiceEnquiryForm serviceId={service._id.toString()} serviceTitle={title} locale={locale} />
      </div>
    </div>
  );
}
