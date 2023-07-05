import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import pl from './locales/pl/translation.json'
import en from './locales/en/translation.json'

export const defaultNS = 'translation';

const resources = {
    en,
    pl,
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        defaultNS,
        lng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;