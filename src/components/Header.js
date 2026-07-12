import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';

export default function Header({ settings }) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const prefix = locale === 'en' ? '' : `/${locale}`;

  const navLinks = [
    { href: `${prefix}/`, label: t('home') },
    { href: `${prefix}/about`, label: t('about') },
    { href: `${prefix}/services`, label: t('services') },
    { href: `${prefix}/usa`, label: t('usa') },
    { href: `${prefix}/canada`, label: t('canada') },
    { href: `${prefix}/uk`, label: t('uk') },
    { href: `${prefix}/contact`, label: t('contact') }
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream shadow-md">
      <div className="bg-maroon text-white text-sm">
        <div className="container-page flex items-center justify-between py-1.5 flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <a href={`mailto:${settings.contact.email}`} className="flex items-center gap-1 hover:text-gold">
              <span>✉</span> {settings.contact.email}
            </a>
            <a
              href={`tel:${settings.contact.phone.replace(/\s/g, '')}`}
              className="hidden sm:flex items-center gap-1 hover:text-gold"
            >
              <span>📞</span> {settings.contact.phone}
            </a>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <div className="container-page flex items-center justify-between py-3">
        <Link href={`${prefix}/`} className="flex items-center gap-2">
          {settings.logo ? (
            <Image src={settings.logo} alt={settings.siteName} width={150} height={50} className="h-12 w-auto object-contain" />
          ) : (
            <span className="text-2xl font-heading font-bold text-maroon">
              {settings.siteName}
            </span>
          )}
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-semibold text-maroon hover:text-saffron transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`https://wa.me/${settings.contact.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary !py-2 !px-4 text-sm"
          >
            WhatsApp
          </a>
        </nav>

        <MobileMenu navLinks={navLinks} whatsapp={settings.contact.whatsappNumber} />
      </div>
    </header>
  );
}
