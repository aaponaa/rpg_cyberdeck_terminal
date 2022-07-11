class TranslationService {
    translate(locale: string, key: string, ...args: string[]): string {
        let translation = require(`@/locales/${locale}.json`)[key]
        if (translation) {
            args.forEach((arg, i) => {
                translation = translation.replace(`{${i}}`, arg)
            })
            return translation
        }
        return `??${key}??`
    }
}

export default new TranslationService()