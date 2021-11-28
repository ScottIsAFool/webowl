import { ReactNode } from 'react'

export type ActionResultWithValue<T> =
    | { type: 'success'; value: T }
    | { type: 'error'; message: string }
    | { type: 'idle' }

export type ActionResult =
    | { type: 'success' }
    | { type: 'error'; message: string }
    | { type: 'idle' }

export type WithChildren = {
    children?: ReactNode
}
