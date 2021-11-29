import { Stack, Text, TextLink } from '@doist/reactist'
import * as React from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useAuth, useUserManagement } from '../../hooks'

type UrlParams = {
    email: string | undefined
    code: string | undefined
}

function VerifyEmail(): JSX.Element | null {
    const { authenticatedUser, setVerified } = useAuth()
    const { email, code } = useParams() as UrlParams
    const { verifyEmail } = useUserManagement()
    const [isVerified, setIsVerified] = React.useState(false)

    const canVerify = Boolean(email) && Boolean(code) && !authenticatedUser?.verified

    const verify = React.useCallback(
        async function verify() {
            if (!email || !code) return
            const response = await verifyEmail(email, code)
            if (response.type === 'error') {
                // Display an error
            } else {
                setIsVerified(true)
                setVerified(true)
            }
        },
        [code, email, setVerified, verifyEmail],
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
            <Text>Thanks for verifying, please continue to enjoy the product</Text>
            <TextLink href="/">Go to your leagues</TextLink>
        </Stack>
    ) : null
}

export { VerifyEmail }
