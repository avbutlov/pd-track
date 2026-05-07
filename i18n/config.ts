"use client"

import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import enCommon from "./locales/en/common.json"
import ruCommon from "./locales/ru/common.json"

import Cookies from "js-cookie"

export type Locale = "en" | "ru"

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
}

const DEFAULT_LOCALE = "ru"

const savedLanguage = Cookies.get("locale")

const resources = {
  en: {
    common: enCommon,
  },

  ru: {
    common: ruCommon,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: savedLanguage,
  fallbackLng: DEFAULT_LOCALE,
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
