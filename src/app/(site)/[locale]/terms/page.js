import { getLocale } from 'next-intl/server';
import { getSiteSettings } from '@/lib/siteSettings';

export default async function TermsPage() {
  const locale = await getLocale();
  const settings = await getSiteSettings();

  const title = settings.termsPage?.title?.[locale] || settings.termsPage?.title?.en;
  const content = settings.termsPage?.content?.[locale] || settings.termsPage?.content?.en;

  return (
    <div className="container-page py-12 max-w-3xl mx-auto">
      <h1 className="section-title text-center mb-8">{title}</h1>
      <div
        className="prose max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
