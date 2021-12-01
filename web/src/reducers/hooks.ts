/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useDispatch, useStore, TypedUseSelectorHook, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from './store'

export function useAppStore() {
    return useStore<RootState>()
}

export function useAppDispatch() {
    return useDispatch<AppDispatch>()
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
