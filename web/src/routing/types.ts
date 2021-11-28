export type GuardedRouteProps = {
    isAuthenticated?: boolean
    target: JSX.Element
}

export type GuardedRouteState = {
    from?: Location
}
