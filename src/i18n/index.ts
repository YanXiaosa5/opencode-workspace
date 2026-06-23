export { defineMessages, useIntl, FormattedMessage, IntlProvider } from 'react-intl'
export type { MessageDescriptor } from 'react-intl'

export type CompiledMessages = Record<string, string>

const messageCache = new Map<string, CompiledMessages>()

const localeModules: Record<string, () => Promise<{ default: CompiledMessages }>> = {
  en: () => import('./compiled/en.json'),
  'zh-CN': () => import('./compiled/zh-CN.json'),
  id: () => import('./compiled/id.json'),
  th: () => import('./compiled/th.json'),
  tl: () => import('./compiled/tl.json'),
  ms: () => import('./compiled/ms.json'),
  vi: () => import('./compiled/vi.json'),
  es: () => import('./compiled/es.json'),
  pt: () => import('./compiled/pt.json'),
  fr: () => import('./compiled/fr.json'),
  ja: () => import('./compiled/ja.json'),
  ko: () => import('./compiled/ko.json'),
  hi: () => import('./compiled/hi.json')
}

export const SUPPORTED_LOCALES = Object.keys(localeModules) as string[]

export function isSupportedLocale(locale: string): boolean {
  return locale in localeModules
}

export async function loadMessages(locale: string): Promise<CompiledMessages> {
  const cached = messageCache.get(locale)
  if (cached) return cached

  const loader = localeModules[locale]
  if (!loader) {
    const fallback = await localeModules.en()
    return fallback.default
  }

  const messages = (await loader()).default
  messageCache.set(locale, messages)
  return messages
}

export function getDefaultLocale(): string {
  return navigator.language.startsWith('zh') ? 'zh-CN' : 'en'
}

export function normalizeLocale(locale: string): string {
  if (isSupportedLocale(locale)) return locale
  const lang = locale.split('-')[0]
  if (isSupportedLocale(lang)) return lang
  return getDefaultLocale()
}
