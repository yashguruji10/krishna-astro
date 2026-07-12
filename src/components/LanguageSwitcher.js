'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { locales, localeNames } from '@/i18n';

export default function LanguageSwitcher() {
  const pathname = usePathname(); // locale-agnostic path, e.g. "/about"
  const router = useRouter();
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const newLocale = e.target.value;
    startTransition(() => {
      // next-intl works out the correct URL for the new locale
      // (no prefix for English, /hi or /gu for the others) so this
      // works the same on every page, including the homepage.
      router.replace(pathname, { locale: newLocale });
    });
  }

  return (
    <select
      value={currentLocale}
      onChange={handleChange}
      disabled={isPending}
      className="bg-white border border-saffron/40 rounded-md text-sm px-2 py-1 text-maroon font-medium focus:outline-none cursor-pointer disabled:opacity-60"
      aria-label="Select language"
    >
      {locales.map((loc) => (
        <option key={loc} value={loc}>
          {localeNames[loc]}
        </option>
      ))}
    </select>
  );
}
