import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

// eslint-disable-next-line import/no-named-as-default-member
i18next
    .use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        debug: true,
        backend: {
            loadPath: '/i18n/{{lng}}.json',
        },
        interpolation: {
            escapeValue: false,
        },
        react: {
            useSuspense: false,
            wait: true,
        },
    })
    .finally(() => {
        // noop
    })

export { i18next }
