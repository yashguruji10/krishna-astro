import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';

export const dynamic = 'force-dynamic';

import { getMessages } from 'next-intl/server';
import { locales } from '@/i18n';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import { getSiteSettings } from '@/lib/siteSettings';
import { dbConnect } from '@/lib/dbConnect';
import Service from '@/models/Service';

export async function generateMetadata({ params: { locale } }) {
  const settings = await getSiteSettings();
  return {
    title: settings.siteName,
    description:
      settings.home?.heroSubtitle?.[locale] || settings.home?.heroSubtitle?.en,
    icons: settings.favicon ? [{ rel: 'icon', url: settings.favicon }] : undefined
  };
}

export default async function LocaleLayout({ children, params: { locale } }) {
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();
  const settings = await getSiteSettings();

  await dbConnect();
  const services = await Service.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header settings={settings} />
          <main className="min-h-screen">{children}</main>
          <Footer settings={settings} services={services} />
          <FloatingWhatsApp whatsappNumber={settings.contact.whatsappNumber} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
