/* eslint-disable @typescript-eslint/no-unused-vars */
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

function Login(): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    const { login, busy } = useUserManagement()
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

            setErrorMessage('')

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
    return (
        <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            alignItems="center"
            height="full"
        >
            <Box border="secondary" borderRadius="full" padding="xlarge">
                <Box paddingBottom="large">
                    <Heading level="1" size="larger">
                        Login
                    </Heading>
                </Box>
                <form onSubmit={doLogin}>
                    <Stack space="medium">
                        <TextField
                            label="Email address"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                        <PasswordField
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Box width="full" display="flex" flexDirection="column" paddingTop="medium">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={!canLogIn || busy}
                                loading={busy}
                            >
                                Login
                            </Button>
                        </Box>
                    </Stack>
                </form>
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
