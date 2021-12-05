import * as React from 'react'
import type { League as LeagueEntity } from '@webowl/apiclient'
import {
    Box,
    Button,
    Column,
    Columns,
    Heading,
    Inline,
    Loading,
    Text,
    TextLink,
} from '@doist/reactist'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import { t } from 'i18next'

import { ReactComponent as InviteIcon } from '../../assets/icons/invite.svg'
import { ReactComponent as ManageIcon } from '../../assets/icons/manage.svg'
import { ReactComponent as NotFoundImage } from '../../assets/images/NotFound.svg'
import { actions } from '../../reducers/actions'
import { useLeagueManagement } from '../../hooks'

import styles from './league.module.css'
import { Trans } from 'react-i18next'

function League(): JSX.Element {
    const { id } = useParams()
    const { leagues, leagueUsers, authenticatedUser, seasons } = useAppSelector((state) => state)
    const { getSeasons, getLeagueUsers } = useLeagueManagement()
    const dispatch = useAppDispatch()
    const [isLoaded, setIsLoaded] = React.useState(false)

    if (!id) {
        throw new Error(t('league.idError'))
    }

    const idNum = parseInt(id)

    React.useEffect(function pageLoad() {
        Promise.all([getSeasons(idNum), getLeagueUsers(idNum)])
            .then(() => {
                setIsLoaded(true)
            })
            .catch(() => {
                // Display an error
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const league = leagues.find((x) => x.id === parseInt(id))
    if (!league) {
        throw new Error(t('league.leagueIdError'))
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const role = leagueUsers[league.id]?.find((x) => x.id === authenticatedUser?.id)?.role
    const leagueSeasons = seasons[league.id]

    function inviteClicked(league: LeagueEntity) {
        dispatch(actions.openLeagueInvitation(league))
    }

    function manageClicked(league: LeagueEntity) {
        dispatch(actions.openManageLeague(league))
    }

    function addSeason(league: LeagueEntity) {
        dispatch(actions.openAddSeason(league))
    }

    return !isLoaded ? (
        <Box
            height="full"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
        >
            <Loading aria-label="League loading..." size="large" />
        </Box>
    ) : (
        <Box id="league" display="flex" flexDirection="column" height="full">
            <Box id="header">
                <Columns alignY="center">
                    <Column width="content">
                        <Heading level="1">{league.name}</Heading>
                    </Column>
                    {role === 'admin' ? (
                        <Column width="auto">
                            <Box display="flex" alignItems="flexEnd" justifyContent="flexEnd">
                                <Inline space="medium">
                                    <Button
                                        variant="secondary"
                                        startIcon={<ManageIcon />}
                                        onClick={() => manageClicked(league)}
                                    >
                                        <>{t('league.manage')}</>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        startIcon={<InviteIcon />}
                                        onClick={() => inviteClicked(league)}
                                    >
                                        <>{t('league.invite')}</>
                                    </Button>
                                </Inline>
                            </Box>
                        </Column>
                    ) : null}
                </Columns>
            </Box>

            {leagueSeasons.length === 0 ? (
                <Box
                    height="full"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <NotFoundImage className={styles.image} />
                    <Text tone="secondary" align="center">
                        <Trans
                            i18nKey="league.noSeasons"
                            components={{ tl: <TextLink onClick={() => addSeason(league)} /> }}
                        />
                    </Text>
                </Box>
            ) : (
                <Box>Has seasons</Box>
            )}
        </Box>
    )
}

export { League }
