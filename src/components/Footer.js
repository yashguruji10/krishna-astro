import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer({ settings, services = [] }) {
  const t = useTranslations();
  const locale = useLocale();
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const year = new Date().getFullYear();

  return (
    <footer className="bg-maroon text-cream mt-12">
      <div className="container-page py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold text-gold mb-3">{settings.siteName}</h3>
          <p className="text-sm text-cream/80">{settings.footerText?.[locale] || settings.footerText?.en}</p>
          <div className="flex gap-3 mt-4">
            {settings.social?.facebook && (
              <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold" aria-label="Facebook">
                <i className="fa fa-facebook text-xl" />
              </a>
            )}
            {settings.social?.instagram && (
              <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold" aria-label="Instagram">
                <i className="fa fa-instagram text-xl" />
              </a>
            )}
            {settings.social?.youtube && (
              <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-gold" aria-label="YouTube">
                <i className="fa fa-youtube text-xl" />
              </a>
            )}
            {settings.social?.twitter && (
              <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-gold" aria-label="Twitter">
                <i className="fa fa-twitter text-xl" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gold mb-3">{t('footer.quickLinks')}</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li><Link href={`${prefix}/`} className="hover:text-gold">{t('nav.home')}</Link></li>
            <li><Link href={`${prefix}/about`} className="hover:text-gold">{t('nav.about')}</Link></li>
            <li><Link href={`${prefix}/services`} className="hover:text-gold">{t('nav.services')}</Link></li>
            <li><Link href={`${prefix}/contact`} className="hover:text-gold">{t('nav.contact')}</Link></li>
            <li><Link href={`${prefix}/terms`} className="hover:text-gold">{t('nav.terms')}</Link></li>
            <li><Link href={`${prefix}/privacy`} className="hover:text-gold">{t('nav.privacy')}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gold mb-3">{t('footer.ourServices')}</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            {services.slice(0, 5).map((s) => (
              <li key={s._id}>
                <Link href={`${prefix}/services/${s.slug}`} className="hover:text-gold">
                  {s.title?.[locale] || s.title?.en}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gold mb-3">{t('footer.contactInfo')}</h4>
          <ul className="space-y-2 text-sm text-cream/80">
            <li>📞 {settings.contact.phone}</li>
            <li>✉ {settings.contact.email}</li>
            <li>💬 {settings.contact.whatsappNumber}</li>
            <li>{settings.contact.address?.[locale] || settings.contact.address?.en}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 py-4 text-center text-sm text-cream/70">
        © {year} {settings.siteName}. {t('footer.rights')}
      </div>
    </footer>
  );
}
