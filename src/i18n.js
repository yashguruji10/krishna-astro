import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

export const locales = ['en', 'hi', 'gu'];
export const defaultLocale = 'en';
export const localePrefix = 'as-needed';

export const localeNames = {
  en: 'English',
  hi: 'हिन्दी',
  gu: 'ગુજરાતી'
};

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
