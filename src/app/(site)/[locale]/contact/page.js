import { getTranslations, getLocale } from 'next-intl/server';
import { getSiteSettings } from '@/lib/siteSettings';
import ContactForm from '@/components/ContactForm';

export default async function ContactPage() {
  const t = await getTranslations('contact');
  const locale = await getLocale();
  const settings = await getSiteSettings();

  return (
    <div className="container-page py-12">
      <h1 className="section-title text-center">
        {t('title')} <span>{t('titleHighlight')}</span>
      </h1>
      <p className="text-center text-gray-600 mb-10">{t('subtitle')}</p>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <InfoCard icon="📞" label={t('phone')} value={settings.contact.phone} href={`tel:${settings.contact.phone.replace(/\s/g, '')}`} />
          <InfoCard icon="✉" label={t('email')} value={settings.contact.email} href={`mailto:${settings.contact.email}`} />
          <InfoCard icon="💬" label={t('whatsapp')} value={settings.contact.whatsappNumber} href={`https://wa.me/${settings.contact.whatsappNumber}`} />
          <InfoCard icon="📍" label={t('address')} value={settings.contact.address?.[locale] || settings.contact.address?.en} />

          {settings.contact.mapEmbedUrl && (
            <div className="rounded-xl overflow-hidden h-72">
              <iframe
                src={settings.contact.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                title="Location map"
              />
            </div>
          )}
        </div>

        <div className="card p-6 md:p-8">
          <h2 className="text-2xl font-bold text-maroon mb-4">{t('formTitle')}</h2>
          <ContactForm locale={locale} />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value, href }) {
  const content = (
    <div className="card p-4 flex items-center gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-maroon">{value}</p>
      </div>
    </div>
  );
  if (href) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return content;
}
