import type { League } from '@webowl/apiclient'
import { getFromStorage, saveToStorage } from '../utils/storage-utils'

const LEAGUES_FILE = 'l.json'

type State = {
    leagues: League[]
}

type Action =
    | { type: 'update-or-add-league'; league: League }
    | { type: 'delete-league'; league: League }
    | { type: 'merge-leagues'; leagues: League[] }

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'update-or-add-league': {
            const { league } = action
            const existingLeague = state.leagues.find((x) => x.id === league.id)
            if (existingLeague) {
                const index = state.leagues.indexOf(existingLeague)
                state.leagues[index] = league
            } else {
                state.leagues.push(league)
            }
            break
        }
        case 'delete-league':
            {
                const { league } = action
                const leagues = state.leagues.slice()
                const index = leagues.indexOf(league)
                leagues.splice(index, 1)
                state.leagues = leagues
            }
            break
        case 'merge-leagues': {
            const { leagues: externalLeagues } = action
            const allLeagues: League[] = externalLeagues.slice()
            const stateWithRemovedLeagues = state.leagues.filter((x) => !isRemoved(x, allLeagues))

            stateWithRemovedLeagues.forEach((league) => {
                const existingLeague = allLeagues.find((x) => x.id === league.id)
                if (!existingLeague) {
                    externalLeagues.push(league)
                }
            })
            state.leagues = externalLeagues
        }
    }

    saveToStorage(LEAGUES_FILE, state.leagues)

    return state
}

function isRemoved(league: League, leagues: League[]): boolean {
    const existingLeague = leagues.find((x) => x.id === league.id)
    return !existingLeague
}

const initialState = { leagues: getFromStorage<League[]>(LEAGUES_FILE) ?? [] }

export type { Action as LeagueActions, State as LeagueState }
export { reducer as leagueReducer, initialState as leagueInitialState }
