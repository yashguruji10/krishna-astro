import { createNavigation } from 'next-intl/navigation';
import { locales, localePrefix, defaultLocale } from './i18n';

// These wrap Next.js' navigation APIs so locale-prefix handling
// (e.g. English has no prefix, Hindi/Gujarati use /hi and /gu) is
// always done consistently by next-intl instead of hand-written
// string manipulation, which is what previously caused the language
// switcher to break when switching to English.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation({ locales, localePrefix, defaultLocale });
