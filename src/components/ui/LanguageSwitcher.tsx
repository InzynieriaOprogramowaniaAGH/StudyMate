'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { locales, type Locale } from '@/i18n/config';

export function LanguageSwitcher() {
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: Locale) => {
    startTransition(() => {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
      window.location.reload();
    });
  };

  return (
    <div className="flex items-center gap-1">
      {locales.map((loc) => (
        <button
          key={loc}
          onClick={() => switchLocale(loc)}
          disabled={isPending || locale === loc}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            locale === loc
              ? 'bg-primary text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          } ${isPending ? 'opacity-50 cursor-wait' : ''}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
