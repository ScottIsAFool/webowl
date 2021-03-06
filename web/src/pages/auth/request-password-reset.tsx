import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Button, Heading, Hidden, Stack, Text, TextField, TextLink } from '@doist/reactist'

import { ReactComponent as ForgotPasswordImage } from '../../assets/images/ForgotPassword.svg'
import { useAccountCreation, useQuery } from '../../hooks'

import styles from './auth.module.css'

function RequestPasswordReset(): JSX.Element {
    const { t } = useTranslation()
    const { requestPasswordReset, busy } = useAccountCreation()
    const query = useQuery()
    const [email, setEmail] = React.useState(query.get('email') ?? '')

    const [requestSent, setRequestSent] = React.useState(false)

    async function resetPassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!email) return

        const response = await requestPasswordReset(email)
        if (response.type === 'error') {
            // Display error message
        } else {
            setRequestSent(true)
        }
    }

    return (
        <Box display="flex" flexDirection="column" width="full" height="full">
            <Box id="header" width="fitContent">
                <TextLink href="/">
                    <Heading level="1" size="largest">
                        Webowl
                    </Heading>
                </TextLink>
            </Box>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                height="full"
                id="content"
            >
                <Box
                    padding="xlarge"
                    id="password-container"
                    style={{ minWidth: '324px', maxWidth: '324px' }}
                    display="flex"
                    alignItems="flexStart"
                    flexDirection="column"
                    justifyContent="flexStart"
                >
                    <Stack paddingBottom="large" space="small">
                        <Heading level="1" size="larger">
                            {t('auth.resetPasswordRequest.header')}
                        </Heading>
                        <Text tone="secondary">{t('auth.resetPasswordRequest.subHeader')}</Text>
                    </Stack>
                    {!requestSent ? (
                        <form onSubmit={resetPassword}>
                            <Stack space="medium">
                                <Text>{t('auth.resetPasswordRequest.mainText')}</Text>
                                <TextField
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('auth.resetPasswordRequest.emailPlaceholder')}
                                    label={t('auth.resetPasswordRequest.emailLabel')}
                                />
                                <Box
                                    width="full"
                                    display="flex"
                                    flexDirection="column"
                                    paddingTop="small"
                                >
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="large"
                                        disabled={!email || busy}
                                        loading={busy}
                                    >
                                        <>{t('auth.resetPasswordRequest.resetPassword')}</>
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    ) : (
                        <Box>
                            <Text>{t('auth.resetPasswordRequest.emailSent')}</Text>
                        </Box>
                    )}
                </Box>
                <Hidden below="desktop">
                    <Box className={styles.image}>
                        <ForgotPasswordImage />
                    </Box>
                </Hidden>
            </Box>
        </Box>
    )
}

export { RequestPasswordReset }
