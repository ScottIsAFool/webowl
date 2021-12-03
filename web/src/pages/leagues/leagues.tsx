import { Box, Button, Column, Columns, Heading, Stack, Text, TextLink } from '@doist/reactist'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '../../reducers/actions'
import { useAppSelector } from '../../reducers/hooks'
import { ReactComponent as NotFoundImage } from '../../assets/images/NotFound.svg'
import { ReactComponent as TickImage } from '../../assets/icons/tick.svg'

import styles from './leagues.module.css'
import { Navigate, useNavigate } from 'react-router-dom'
import { Trans } from 'react-i18next'
import { t } from 'i18next'
import { getPlayerFormatKey } from '../../utils/league-utils'
import type { League } from '@webowl/apiclient'
import type { Space, SpaceWithNegatives } from '@doist/reactist/lib/new-components/common-types'
import type { ResponsiveProp } from '@doist/reactist/lib/new-components/responsive-props'

const leagueListMargin: ResponsiveProp<SpaceWithNegatives> = {
    desktop: '-xlarge',
    tablet: '-xlarge',
    mobile: '-medium',
}

const padding: ResponsiveProp<Space> = {
    desktop: 'xlarge',
    tablet: 'xlarge',
    mobile: 'medium',
}

function Leagues(): JSX.Element {
    const leagues = useAppSelector((state) => state.leagues)
    const authenticatedUser = useAppSelector((state) => state.authenticatedUser)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    function addLeague() {
        dispatch(actions.addLeaguePopup(true))
    }

    function getPlayerText(league: League) {
        const key = getPlayerFormatKey(league.playersPerTeam)
        return t(`league.team.${key}`)
    }

    function leagueClicked(id: number) {
        navigate(`/leagues/${id}`)
    }

    if (leagues.length > 0 && authenticatedUser?.defaultLeagueId) {
        return <Navigate to={`/leagues/${authenticatedUser.defaultLeagueId}`} replace={true} />
    }

    return (
        <Box width="full" height="full">
            <Stack space="medium" style={{ height: '100%' }}>
                <Heading level="1">{t('league.yourLeagues')}</Heading>
                {leagues.length === 0 ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        height="full"
                    >
                        <Stack space="large" align="center">
                            <NotFoundImage className={styles.image} />
                            <Text tone="secondary" align="center">
                                <Trans
                                    i18nKey="league.noLeagues"
                                    components={{ tl: <TextLink onClick={addLeague} /> }}
                                />
                            </Text>
                        </Stack>
                    </Box>
                ) : (
                    <Box margin={leagueListMargin} className={styles.league_container}>
                        <Stack space="medium" paddingX={padding}>
                            {leagues.map((league) => (
                                <Columns
                                    key={league.id}
                                    width="full"
                                    alignY="center"
                                    onClick={() => leagueClicked(league.id)}
                                >
                                    <Column width="auto">
                                        <Stack space="xsmall" paddingY="small">
                                            <Heading level="2">{league.name}</Heading>
                                            <Text tone="secondary">
                                                {`${getPlayerText(league)}`},{' '}
                                                {t('addLeague.options.multiTeams', {
                                                    team: league.teamNumbers,
                                                })}
                                            </Text>
                                        </Stack>
                                    </Column>
                                    {authenticatedUser?.defaultLeagueId !== league.id ? (
                                        <Column width="content">
                                            <Button variant="primary">
                                                <>{t('league.makeDefault')}</>
                                            </Button>
                                        </Column>
                                    ) : (
                                        <Box display="flex">
                                            <TickImage className={styles.default_tick} />
                                            <Text exceptionallySetClassName={styles.default_text}>
                                                {t('league.default')}
                                            </Text>
                                        </Box>
                                    )}
                                </Columns>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Stack>
        </Box>
    )
}

export { Leagues }
