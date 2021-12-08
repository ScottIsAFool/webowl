import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router-dom'

import { Box, Button, Heading, Hidden, PasswordField, Stack, Text, TextLink } from '@doist/reactist'

import { ReactComponent as ResetPasswordImage } from '../../assets/images/ResetPassword.svg'
import { useAccountCreation, useQuery } from '../../hooks'
import { authNavigate } from '../../routing/routes/auth-routes'

import styles from './auth.module.css'

function PasswordReset(): JSX.Element {
    const { t } = useTranslation()
    const { passwordReset, busy } = useAccountCreation()
    const navigate = useNavigate()
    const query = useQuery()
    const email = query.get('email')
    const code = query.get('code')

    const [password, setPassword] = React.useState('')

    async function resetPassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!email || !code || !password) return

        const response = await passwordReset(email, code, password)
        if (response.type === 'error') {
            // Display error message
        } else {
            navigate(authNavigate('login'), { replace: true })
        }
    }

    if (!email || !code) {
        return <Navigate to="/" replace={true} />
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
                <Box padding="xlarge" id="password-container" style={{ minWidth: '324px' }}>
                    <Stack paddingBottom="large" space="small">
                        <Heading level="1" size="larger">
                            {t('auth.passwordReset.header')}
                        </Heading>
                        <Text tone="secondary">
                            <Trans i18nKey="auth.passwordReset.subHeader" values={{ email }} />
                        </Text>
                    </Stack>
                    <form onSubmit={resetPassword}>
                        <Stack space="medium">
                            <Text>{t('auth.passwordReset.mainText')}</Text>
                            <PasswordField
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('auth.passwordReset.passwordPlaceholder')}
                                label={t('auth.passwordReset.passwordLabel')}
                                autoComplete="new-password"
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
                                    disabled={!password || busy}
                                    loading={busy}
                                >
                                    <>{t('auth.passwordReset.changePassword')}</>
                                </Button>
                            </Box>
                        </Stack>
                    </form>
                </Box>
                <Hidden below="desktop">
                    <Box className={styles.image}>
                        <ResetPasswordImage />
                    </Box>
                </Hidden>
            </Box>
        </Box>
    )
}

export { PasswordReset }
