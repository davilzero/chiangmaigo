'use client'

import { useI18n } from '@/lib/i18n/I18nProvider'

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n()

  return (
    <select
      className="input w-auto text-sm"
      value={lang}
      onChange={(e) => setLang(e.target.value as any)}
      aria-label="Select language"
    >
      <option value="th">ไทย</option>
      <option value="en">English</option>
      <option value="zh">中文</option>
    </select>
  )
}


