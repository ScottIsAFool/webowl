import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GuardedRouteState } from '../routing/types'

function Login(): JSX.Element {
    const navigate = useNavigate()
    const location = useLocation()

    const state = location.state as GuardedRouteState

    const from = state.from?.pathname || '/'

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const doLogin = React.useCallback(() => {
        // do something, then
        navigate(from, { replace: true })
    }, [from, navigate])
    return <></>
}

export { Login }
