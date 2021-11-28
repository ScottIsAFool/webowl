import { ReactNode } from 'react'

export type ActionResultWithValue<T> =
    | { type: 'success'; value: T }
    | { type: 'error'; message: string }
    | { type: 'idle' }

export type ActionResult = ActionResultWithValue<never>

export type WithChildren = {
    children?: ReactNode
}
