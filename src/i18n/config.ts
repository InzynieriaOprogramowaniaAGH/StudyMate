export const locales = ['en', 'pl'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];
