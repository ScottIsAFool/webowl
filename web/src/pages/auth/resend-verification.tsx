import { Box, Button, Stack, Text } from '@doist/reactist'
import * as React from 'react'
import { Navigate } from 'react-router'
import { useAuth, useAccountCreation } from '../../hooks'

function ResendVerification(): JSX.Element {
    const { authenticatedUser } = useAuth()
    const { busy, resendVerification } = useAccountCreation()
    const [verificationSent, setVerificationSent] = React.useState(false)
    if (!authenticatedUser) {
        throw new Error('Should not have got here if not authenticated 🤔')
    }

    if (authenticatedUser.verified) {
        return <Navigate to="" replace={true} />
    }

    async function sendVerification(emailAddress: string) {
        const response = await resendVerification(emailAddress)
        if (response.type === 'error') {
            // Display error message
        } else {
            setVerificationSent(true)
        }
    }
    return (
        <Box>
            {!verificationSent ? (
                <Stack space="medium">
                    <Text>
                        In order to continue using this site, you need to verify your email address,
                        click the button below to resend an email to{' '}
                        <strong>{authenticatedUser.emailAddress}</strong>.
                    </Text>
                    <Button
                        variant="primary"
                        loading={busy}
                        disabled={busy}
                        onClick={() => sendVerification(authenticatedUser.emailAddress)}
                    >
                        Resend verification
                    </Button>
                    <Text tone="secondary">
                        Accounts not verified within 30 days of creation will automatically be
                        deleted, along with any leagues created by that account.
                    </Text>
                </Stack>
            ) : (
                <Stack>
                    <Text>
                        An email has been sent to <strong>{authenticatedUser.emailAddress}</strong>.
                        If you still do not see it, please check your junk/spam folder.
                    </Text>
                </Stack>
            )}
        </Box>
    )
}

export { ResendVerification }
