import { Box, Heading } from '@doist/reactist'
import type { League, Season } from '@webowl/apiclient'
import dayjs from 'dayjs'
import type { TFunction } from 'i18next'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '../reducers/hooks'
import { getPlayerFormatKey } from '../utils/league-utils'

function nameToDisplay(season: Season, league: League, t: TFunction) {
    const { name, startDate } = season
    if (name) return name

    const day = dayjs(startDate)
    const dayOfWeek = day.format('dddd')

    const playersPerTeam = league.playersPerTeam

    const teamType = t(`team.${getPlayerFormatKey(playersPerTeam)}`)

    return `${dayOfWeek} ${teamType}`
}

function SeasonInList({ season }: { season: Season }): JSX.Element {
    const { t } = useTranslation()
    const leagues = useAppSelector((state) => state.leagues)
    const league = leagues.find((x) => x.id === season.leagueId) as League
    return (
        <Box display="flex" flexDirection="column" width="full">
            <Heading level="2">{nameToDisplay(season, league, t)}</Heading>
        </Box>
    )
}

export { SeasonInList }
