import { getLocale } from 'next-intl/server';
import { getSiteSettings } from '@/lib/siteSettings';

export default async function PrivacyPage() {
  const locale = await getLocale();
  const settings = await getSiteSettings();

  const title = settings.privacyPage?.title?.[locale] || settings.privacyPage?.title?.en;
  const content = settings.privacyPage?.content?.[locale] || settings.privacyPage?.content?.en;

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
