import { getLocale } from 'next-intl/server';
import LazyImage from '@/components/LazyImage';
import { getSiteSettings } from '@/lib/siteSettings';

export default async function AboutPage() {
  const locale = await getLocale();
  const settings = await getSiteSettings();

  const title = settings.aboutPage?.title?.[locale] || settings.aboutPage?.title?.en;
  const content = settings.aboutPage?.content?.[locale] || settings.aboutPage?.content?.en;

  return (
    <div className="container-page py-12">
      <h1 className="section-title text-center mb-8">{title}</h1>
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="relative h-72 md:h-96 rounded-xl overflow-hidden bg-gray-100">
          {settings.aboutPage?.image ? (
            <LazyImage src={settings.aboutPage.image} alt={title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-6xl">🙏</div>
          )}
        </div>
        <div
          className="prose max-w-none text-gray-700 leading-relaxed text-justify"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}
