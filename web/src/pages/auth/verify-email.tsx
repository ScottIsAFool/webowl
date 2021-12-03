import { Stack, Text, TextLink } from '@doist/reactist'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { useQuery, useAccountCreation, useUserManagement } from '../../hooks'

function VerifyEmail(): JSX.Element | null {
    const { t } = useTranslation()
    const { authenticatedUser } = useUserManagement()
    const query = useQuery()
    const { verifyEmail } = useAccountCreation()
    const [isVerified, setIsVerified] = React.useState(false)

    const code = query.get('code')
    const email = query.get('email')

    const canVerify = Boolean(email) && Boolean(code) && !authenticatedUser?.verified

    const verify = React.useCallback(
        async function verify() {
            if (!email || !code) return
            const response = await verifyEmail(email, code)
            if (response.type === 'error') {
                // Display an error
            } else {
                setIsVerified(true)
            }
        },
        [code, email, verifyEmail],
    )

    React.useEffect(function pageLoad() {
        if (!canVerify) return
        verify().finally(() => {
            // noop
        })
        // Only do this on the page load, just the once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!canVerify && !isVerified) {
        return <Navigate to="/" replace={true} />
    }

    return isVerified ? (
        <Stack space="medium">
            <Text>{t('auth.verifyEmail.mainText')}</Text>
            <TextLink href="/">{t('auth.verifyEmail.goToLeagues')}</TextLink>
        </Stack>
    ) : null
}

export { VerifyEmail }
