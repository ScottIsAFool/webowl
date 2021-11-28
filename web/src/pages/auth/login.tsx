/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth, useUserManagement } from '../../hooks'
import { useApiClient } from '../../hooks/use-api-client'
import { GuardedRouteState } from '../../routing/types'

function Login(): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()
    const { login } = useUserManagement()
    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>()

    const state = location.state as GuardedRouteState

    const from = state.from?.pathname || '/'

    function onLeave() {
        setEmailAddress('')
        setPassword('')
        setErrorMessage('')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const doLogin = React.useCallback(
        async function doLogin() {
            if (!emailAddress || !password) return

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
    return <>Login</>
}

export { Login }
