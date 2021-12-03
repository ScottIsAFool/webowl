import { Box, Button, Stack, Text } from '@doist/reactist'
import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Navigate } from 'react-router'
import { useAccountCreation, useUserManagement } from '../../hooks'

function ResendVerification(): JSX.Element {
    const { t } = useTranslation()
    const { authenticatedUser } = useUserManagement()
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
                        <Trans
                            i18nKey="auth.resendVerify.mainText"
                            values={{
                                email: authenticatedUser.emailAddress,
                            }}
                        />
                    </Text>
                    <Button
                        variant="primary"
                        loading={busy}
                        disabled={busy}
                        onClick={() => sendVerification(authenticatedUser.emailAddress)}
                    >
                        <>{t('auth.resendVerify.resend')}</>
                    </Button>
                    <Text tone="secondary">{t('auth.resendVerify.verificationHint')}</Text>
                </Stack>
            ) : (
                <Stack>
                    <Text>
                        <Trans
                            i18nKey="auth.resendVerify.emailSent"
                            values={{
                                email: authenticatedUser.emailAddress,
                            }}
                        />
                    </Text>
                </Stack>
            )}
        </Box>
    )
}

export { ResendVerification }
