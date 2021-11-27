export type GuardedRouteProps = {
    isAuthenticated?: boolean
    target: JSX.Element
}

export type GuardedRouteState = {
    from?: Location
}

export type RouteResult = React.ReactElement | JSX.Element | null
