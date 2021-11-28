/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Heading, Text } from '@doist/reactist'
import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserManagement } from '../../hooks'
import type { GuardedRouteState } from '../../routing/types'

function Login(): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useUserManagement()
    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>()

    const state = location.state as GuardedRouteState | undefined

    const from = state?.from?.pathname || '/'

    function onLeave() {
        setEmailAddress('')
        setPassword('')
        setErrorMessage('')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const doLogin = React.useCallback(
        async function doLogin() {
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
        <Box>
            <Heading level="1">Login</Heading>
            {from ? <Text>Redirect to: {from}</Text> : null}
        </Box>
    )
}

export { Login }
