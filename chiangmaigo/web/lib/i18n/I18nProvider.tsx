'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'
import th from '@/messages/th.json'
import en from '@/messages/en.json'
import zh from '@/messages/zh.json'

type Language = 'th' | 'en' | 'zh'
type Messages = Record<string, any>

const dictionaries: Record<Language, Messages> = { th, en, zh }

interface I18nContextValue {
  lang: Language
  t: (path: string) => string
  setLang: (lang: Language) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children, initialLang = 'th' as Language }: { children: React.ReactNode; initialLang?: Language }) {
  const [lang, setLang] = useState<Language>(initialLang)

  const t = useMemo(() => {
    const dict = dictionaries[lang]
    return (path: string) => {
      const parts = path.split('.')
      let cur: any = dict
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) {
          cur = cur[p]
        } else {
          return path
        }
      }
      return typeof cur === 'string' ? cur : path
    }
  }, [lang])

  const value: I18nContextValue = { lang, t, setLang }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}


