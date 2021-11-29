import { Stack, Text, TextLink } from '@doist/reactist'
import * as React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, useQuery, useUserManagement } from '../../hooks'

function VerifyEmail(): JSX.Element | null {
    const { authenticatedUser, setVerified } = useAuth()
    const query = useQuery()
    const { verifyEmail } = useUserManagement()
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
