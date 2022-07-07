import {createI18n} from "vue-i18n";
import messages from '@intlify/vite-plugin-vue-i18n/messages';
import axios from "axios";

export const availableLocales = ['en', 'fr']
const availableLanguages = ['en', 'fr'];

const LOCAL_STORAGE_LOCALE = "cyberdeck.locale";

let defaultLanguage = localStorage.getItem(LOCAL_STORAGE_LOCALE) ?? navigator.language;
if (!availableLocales.includes(defaultLanguage)) {
    defaultLanguage = 'en';
}

const i18n = createI18n({
    locale: defaultLanguage,
    globalInjection: true,
    messages,
})

// Request interceptor to set Accept header as chosen locale
axios.interceptors.request.use(request => {
    // @ts-ignore
    request.headers.common.Accept = `${i18n.global.locale}`;
    return request;
})

export default i18n;

export function updateLocale(locale: string): void {
    if (locale !== i18n.global.locale) {
        localStorage.setItem(LOCAL_STORAGE_LOCALE, locale);
        location.reload();
    }
}
