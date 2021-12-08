import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { getFromStorage, saveToStorage } from '../../utils/storage-utils'

import type { League } from '@webowl/apiclient'
import type { LeaguesState } from './types'

const LEAGUES_FILE = 'l'

const initialState: LeaguesState = getFromStorage<League[]>(LEAGUES_FILE) ?? []

function save(leagues: League[]): League[] {
    saveToStorage(LEAGUES_FILE, leagues)
    return leagues
}

export const leaguesSlice = createSlice({
    name: 'leagues',
    initialState,
    reducers: {
        addOrUpdateLeague(state, action: PayloadAction<League>) {
            const league = action.payload
            const existingLeague = state.find((x) => x.id === league.id)
            if (existingLeague) {
                const index = state.indexOf(existingLeague)
                state[index] = league
            } else {
                state.push(league)
            }
            return save(state)
        },
        deleteLeague(state, action: PayloadAction<League>) {
            const league = action.payload
            state = state.filter((x) => x.id !== league.id)
            save(state)
        },
        mergeLeagues(state, action: PayloadAction<League[]>) {
            const externalLeagues = action.payload
            const allLeagues: League[] = externalLeagues.slice()
            const stateWithRemovedLeagues = state.filter((x) => !isRemoved(x, allLeagues))

            stateWithRemovedLeagues.forEach((league) => {
                const existingLeague = allLeagues.find((x) => x.id === league.id)
                if (!existingLeague) {
                    externalLeagues.push(league)
                }
            })
            state = externalLeagues
            return save(state)
        },
    },
})

function isRemoved(league: League, leagues: League[]): boolean {
    const existingLeague = leagues.find((x) => x.id === league.id)
    return !existingLeague
}
