import { PathRouteProps, LayoutRouteProps, IndexRouteProps } from 'react-router-dom'

export type GuardedRouteProps = (PathRouteProps | LayoutRouteProps | IndexRouteProps) & {
    isAuthenticated?: boolean
}

export type GuardedRouteState = {
    from?: Location
}
