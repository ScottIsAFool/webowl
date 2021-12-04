import * as React from 'react'
import {
    Button,
    Column,
    Columns,
    Heading,
    Inline,
    Modal,
    ModalBody,
    ModalHeader,
    SelectField,
    Stack,
    Text,
} from '@doist/reactist'
import { useTranslation } from 'react-i18next'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'

import styles from './manage-league-users.module.css'
import type { League, LeagueRole, LeagueUser } from '@webowl/apiclient'
import { useLeagueManagement } from '../../hooks'
import { willHaveAnAdminLeft } from '../../utils/league-utils'
import { actions } from '../../reducers/actions'
import { ReactComponent as DeleteIcon } from '../../assets/icons/delete.svg'

function LeagueUserItem({
    user,
    league,
    users,
}: {
    user: LeagueUser
    league: League
    users: LeagueUser[]
}): JSX.Element {
    const { t } = useTranslation()
    const { busy, updateUserRole } = useLeagueManagement()
    const { authenticatedUser } = useAppSelector((state) => state)
    const [userRole, setUserRole] = React.useState<LeagueRole>(user.role)
    const [errorMessage, setErrorMessage] = React.useState<string>()

    if (!authenticatedUser) throw new Error('missing auth user')

    async function updateRole(league: League, user: LeagueUser, role: string) {
        setErrorMessage(undefined)
        if (willHaveAnAdminLeft(user, role as LeagueRole, users)) {
            setUserRole(role as LeagueRole)
            const response = await updateUserRole(user.id, role as LeagueRole, league.id)
            if (response.type === 'error') {
                setErrorMessage(response.message)
            }
        } else {
            setErrorMessage(t('popups.manageUsers.noAdminsError'))
        }
    }

    return (
        <Stack space="small">
            <Columns width="full">
                <Column width="auto">
                    <Stack>
                        <Inline space="xsmall">
                            <Heading level="2">
                                {user.firstName} {user.lastName}
                            </Heading>
                            {user.id === authenticatedUser.id ? (
                                <Text tone="secondary" size="caption">
                                    {t('popups.manageUsers.you')}
                                </Text>
                            ) : null}
                        </Inline>
                        <Text tone="secondary">{user.emailAddress}</Text>
                    </Stack>
                </Column>
                <Column width="content">
                    <Inline space="medium" alignY="bottom">
                        {user.id !== authenticatedUser.id ? (
                            <Button
                                variant="secondary"
                                tone="destructive"
                                style={{ marginBottom: '1px' }}
                                disabled={busy}
                                startIcon={<DeleteIcon />}
                            >
                                <>{t('popups.manageUsers.delete')}</>
                            </Button>
                        ) : null}

                        <SelectField
                            label=""
                            aria-label={t('popups.manageUsers.roleLabel')}
                            disabled={busy}
                            value={userRole}
                            onChange={(e) => updateRole(league, user, e.target.value)}
                        >
                            <option value="admin">{t('popups.manageUsers.admin')}</option>
                            <option value="user">{t('popups.manageUsers.user')}</option>
                        </SelectField>
                    </Inline>
                </Column>
            </Columns>

            <Text tone="danger">{errorMessage}</Text>
        </Stack>
    )
}

function ManageLeagueUsers(): JSX.Element | null {
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { popups, authenticatedUser, leagueUsers } = useAppSelector((state) => state)
    const { league } = popups

    if (!league || !authenticatedUser) throw new Error('missing league and user')

    const title = t('popups.manageUsers.header', { name: league.name })
    const usersForLeague = leagueUsers[league.id]

    function close() {
        dispatch(actions.closeManageLeague())
    }
    return (
        <Modal isOpen={true} width="medium" aria-label={title} onDismiss={close}>
            <ModalHeader>
                <Heading level="1">{title}</Heading>
            </ModalHeader>

            <ModalBody exceptionallySetClassName={styles.manage_users}>
                <Stack space="large">
                    <Text tone="secondary">{t('popups.manageUsers.mainText')}</Text>
                    {usersForLeague.map((user) => (
                        <LeagueUserItem
                            key={user.id}
                            user={user}
                            league={league}
                            users={usersForLeague}
                        />
                    ))}
                </Stack>
            </ModalBody>
        </Modal>
    )
}

export { ManageLeagueUsers }
