import * as React from 'react'
import type { League as LeagueEntity } from '@webowl/apiclient'
import { Box, Button, Column, Columns, Heading, Inline } from '@doist/reactist'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import { t } from 'i18next'

import { ReactComponent as InviteIcon } from '../../assets/icons/invite.svg'
import { ReactComponent as ManageIcon } from '../../assets/icons/manage.svg'
import { actions } from '../../reducers/actions'

function League(): JSX.Element {
    const { id } = useParams()
    const { leagues, leagueUsers, authenticatedUser } = useAppSelector((state) => state)
    const dispatch = useAppDispatch()

    if (!id) {
        return <>No id provided</>
    }
    const league = leagues.find((x) => x.id === parseInt(id))
    if (!league) {
        return <>No league found</>
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    const role = leagueUsers[league.id]?.find((x) => x.id === authenticatedUser?.id)?.role

    function inviteClicked(league: LeagueEntity) {
        dispatch(actions.openLeagueInvitation(league))
    }

    function manageClicked(league: LeagueEntity) {
        dispatch(actions.openManageLeague(league))
    }

    return (
        <Box id="league" display="flex" flexDirection="column">
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
        </Box>
    )
}

export { League }
