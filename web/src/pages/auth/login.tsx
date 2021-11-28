import {
    Box,
    Button,
    Heading,
    Hidden,
    PasswordField,
    Stack,
    Text,
    TextField,
} from '@doist/reactist'
import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserManagement } from '../../hooks'
import type { GuardedRouteState } from '../../routing/types'
import { ReactComponent as LoginImage } from '../../assets/images/Login.svg'

type LoginStep = 'initial' | 'password' | 'register'

function Login(): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, checkEmail, busy } = useUserManagement()
    const [loginStep, setLoginStep] = React.useState<LoginStep>('initial')
    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>()

    const state = location.state as GuardedRouteState | undefined

    const from = state?.from?.pathname || '/'

    const canLogIn = Boolean(emailAddress) && Boolean(password)

    function onLeave() {
        setEmailAddress('')
        setPassword('')
        setErrorMessage('')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const doLogin = React.useCallback(
        async function doLogin(event: React.FormEvent<HTMLFormElement>) {
            event.preventDefault()

            setErrorMessage(undefined)

            const response = await login(emailAddress, password)

            if (response.type === 'success') {
                navigate(from, { replace: true })
                onLeave()
            } else if (response.type === 'error') {
                setErrorMessage(response.message)
            }
        },
        [emailAddress, from, login, navigate, password],
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

    return (
        <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            height="full"
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
                            With <strong>{emailAddress}</strong>
                        </Text>
                    ) : null}
                </Stack>

                {loginStep === 'initial' ? (
                    <form onSubmit={doCheckEmail}>
                        <Stack space="medium">
                            <TextField
                                label="Email address"
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                placeholder="Enter your email..."
                                autoFocus
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
                ) : null}
            </Box>
            <Hidden below="tablet">
                <Box>
                    <LoginImage height="300px" />
                </Box>
            </Hidden>
        </Box>
    )
}

export { Login }
