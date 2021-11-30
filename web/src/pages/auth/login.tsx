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
import type { ActionResult } from '../../types'

type LoginStep = 'initial' | 'password' | 'register'

function Login(): JSX.Element {
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
        function handleResponse(response: ActionResult) {
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
                            {loginStep === 'initial'
                                ? 'Log in or Sign up'
                                : loginStep === 'password'
                                ? 'Log into Webowl'
                                : 'Complete your profile'}
                        </Heading>
                        {loginStep !== 'initial' ? (
                            <Text tone="secondary">
                                As <strong>{emailAddress}</strong>
                            </Text>
                        ) : null}
                    </Stack>

                    {loginStep === 'initial' ? (
                        <form onSubmit={doCheckEmail}>
                            <Stack space="medium">
                                <SocialAuthButtons />
                                <hr />
                                <TextField
                                    label="Email address"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    placeholder="Enter your email..."
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
                                        Continue with email
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
                                    label="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password..."
                                    autoFocus
                                    autoComplete="current-password"
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
                                        Log in
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
                                    label="First name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Enter your first name..."
                                    autoFocus
                                />
                                <TextField
                                    label="Last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Enter your last name..."
                                />
                                <PasswordField
                                    label="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter a password..."
                                    hint="Password must be at least 8 characters long with a number and special character"
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
                                        Sign up
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
