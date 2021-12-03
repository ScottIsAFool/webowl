import {
    Box,
    Button,
    Heading,
    Hidden,
    PasswordField,
    Stack,
    Text,
    TextField,
    TextLink,
} from '@doist/reactist'
import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAccountCreation } from '../../hooks'
import type { GuardedRouteState } from '../../routing/types'
import { ReactComponent as LoginInitialImage } from '../../assets/images/LoginInitial.svg'
import { ReactComponent as LoginImage } from '../../assets/images/Login.svg'
import { ReactComponent as RegisterImage } from '../../assets/images/Register.svg'

import styles from './auth.module.css'
import { SocialAuthButtons } from '../../components'
import type { Result } from '../../utils/result-utils'
import { Trans, useTranslation } from 'react-i18next'
import { authNavigate } from '../../routing/routes/auth-routes'

type LoginStep = 'initial' | 'password' | 'register'

function Login(): JSX.Element {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const location = useLocation()
    const { login, checkEmail, register, busy } = useAccountCreation()
    const [loginStep, setLoginStep] = React.useState<LoginStep>('initial')
    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>()

    const state = location.state as GuardedRouteState | undefined

    const from = state?.from?.pathname || '/'

    const canLogIn = Boolean(emailAddress) && Boolean(password)
    const canRegister = canLogIn && Boolean(firstName) && Boolean(lastName)

    function onLeave() {
        setEmailAddress('')
        setPassword('')
        setErrorMessage('')
        setFirstName('')
        setLastName('')
    }

    const handleResponse = React.useCallback(
        function handleResponse(response: Result) {
            if (response.type === 'success') {
                onLeave()
                navigate(from, { replace: true })
            } else if (response.type === 'error') {
                setErrorMessage(response.message)
            }
        },
        [from, navigate],
    )

    const doLogin = React.useCallback(
        async function doLogin(event: React.FormEvent<HTMLFormElement>) {
            event.preventDefault()

            setErrorMessage(undefined)

            const response = await login(emailAddress, password)

            handleResponse(response)
        },
        [emailAddress, handleResponse, login, password],
    )

    const doCheckEmail = React.useCallback(
        async function doCheckEmail(event: React.FormEvent<HTMLFormElement>) {
            event.preventDefault()

            setErrorMessage(undefined)

            const response = await checkEmail(emailAddress)
            if (response.type === 'success') {
                setLoginStep(response.value.exists ? 'password' : 'register')
            } else if (response.type === 'error') {
                setErrorMessage(response.message)
            }
        },
        [checkEmail, emailAddress],
    )

    const doRegister = React.useCallback(
        async function doRegister(event: React.FormEvent<HTMLFormElement>) {
            event.preventDefault()
            setErrorMessage(undefined)

            const response = await register(emailAddress, password, firstName, lastName)
            handleResponse(response)
        },
        [emailAddress, firstName, handleResponse, lastName, password, register],
    )

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
                <Box padding="xlarge" id="login-container" style={{ minWidth: '324px' }}>
                    <Stack paddingBottom="large" space="small">
                        <Heading level="1" size="larger">
                            {t(`login.${loginStep}.header`)}
                        </Heading>
                        {loginStep !== 'initial' ? (
                            <Text tone="secondary">
                                <Trans
                                    i18nKey="login.as"
                                    values={{
                                        email: emailAddress,
                                    }}
                                />
                            </Text>
                        ) : null}
                    </Stack>

                    {loginStep === 'initial' ? (
                        <form onSubmit={doCheckEmail}>
                            <Stack space="medium">
                                <SocialAuthButtons />
                                <hr />
                                <TextField
                                    label={t('login.initial.emailLabel')}
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    placeholder={t('login.initial.emailPlaceholder')}
                                    autoFocus
                                    type="email"
                                    autoComplete="username"
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
                                        disabled={!emailAddress || busy}
                                        loading={busy}
                                        size="large"
                                    >
                                        <>{t('login.initial.continue')}</>
                                    </Button>
                                    {errorMessage ? (
                                        <Box paddingTop="medium">
                                            <Text tone="danger">{errorMessage}</Text>
                                        </Box>
                                    ) : null}
                                </Box>
                            </Stack>
                        </form>
                    ) : loginStep === 'password' ? (
                        <form onSubmit={doLogin}>
                            <Stack space="medium">
                                <PasswordField
                                    label={t('login.password.passwordLabel')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('login.password.passwordPlaceholder')}
                                    autoFocus
                                    autoComplete="current-password"
                                    auxiliaryLabel={
                                        <TextLink href={authNavigate('request-password-reset')}>
                                            {t('login.password.forgotPassword')}
                                        </TextLink>
                                    }
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
                                        disabled={!canLogIn || busy}
                                        loading={busy}
                                        size="large"
                                    >
                                        <>{t('login.password.login')}</>
                                    </Button>
                                    {errorMessage ? (
                                        <Box paddingTop="medium">
                                            <Text tone="danger">{errorMessage}</Text>
                                        </Box>
                                    ) : null}
                                </Box>
                            </Stack>
                        </form>
                    ) : (
                        <form onSubmit={doRegister}>
                            <Stack space="medium">
                                <TextField
                                    label={t('login.register.firstNameLabel')}
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder={t('login.register.firstNamePlaceholder')}
                                    autoFocus
                                />
                                <TextField
                                    label={t('login.register.lastNameLabel')}
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder={t('login.register.lastNameLabel')}
                                />
                                <PasswordField
                                    label={t('login.register.passwordLabel')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('login.register.passwordPlaceholder')}
                                    hint={t('login.register.passwordHint')}
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
                                        disabled={!canRegister || busy}
                                        loading={busy}
                                        size="large"
                                    >
                                        <>{t('login.register.signUp')}</>
                                    </Button>
                                    {errorMessage ? (
                                        <Box paddingTop="medium">
                                            <Text tone="danger">{errorMessage}</Text>
                                        </Box>
                                    ) : null}
                                </Box>
                            </Stack>
                        </form>
                    )}
                </Box>
                <Hidden below="desktop">
                    <Box className={styles.image}>
                        {loginStep === 'initial' ? (
                            <LoginInitialImage />
                        ) : loginStep === 'password' ? (
                            <LoginImage />
                        ) : (
                            <RegisterImage />
                        )}
                    </Box>
                </Hidden>
            </Box>
        </Box>
    )
}

export { Login }
