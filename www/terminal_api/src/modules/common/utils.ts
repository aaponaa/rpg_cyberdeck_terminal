import { Request } from 'express'
import { availableLocales, defaultLocale } from '@/locales'

export function getLocale(req: Request) {
    let language = (req.headers['accept-language'] ?? 'en').split(',')[0].trim().split('-')[0]
    return availableLocales.includes(language) ? language : defaultLocale
}