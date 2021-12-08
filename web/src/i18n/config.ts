import { initReactI18next } from 'react-i18next'

import i18next from 'i18next'
import Backend from 'i18next-xhr-backend'

// eslint-disable-next-line import/no-named-as-default-member
i18next
    .use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        // debug: process.env.NODE_ENV === 'development',
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
