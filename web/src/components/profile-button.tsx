import {
    Avatar,
    Box,
    Column,
    Columns,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    Text,
} from '@doist/reactist'
import * as React from 'react'
import { useAuth, useUserManagement } from '../hooks'
import { ReactComponent as PlusIcon } from '../assets/icons/plus.svg'
import { ReactComponent as LogoutIcon } from '../assets/icons/logout.svg'

import styles from './profile-button.module.css'
import { useAppDispatch, useAppSelector } from '../reducers/hooks'
import { actions } from '../reducers/actions'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'

const AsButton = React.forwardRef<HTMLButtonElement, unknown>(function AsButton({ ...props }, ref) {
    const { authenticatedUser } = useUserManagement()
    if (!authenticatedUser) throw new Error()
    return (
        <button ref={ref} {...props} className={styles.avatar_button}>
            <Avatar
                size="m"
                user={{
                    name: `${authenticatedUser.firstName} ${authenticatedUser.lastName}`,
                    email: authenticatedUser.emailAddress,
                }}
            />
        </button>
    )
})

function ProfileButton(): JSX.Element {
    const { t } = useTranslation()
    const { logOut } = useAuth()
    const { authenticatedUser } = useUserManagement()
    const leagues = useAppSelector((state) => state.leagues)

    const dispatch = useAppDispatch()
    if (!authenticatedUser) throw new Error()
    const fullName = `${authenticatedUser.firstName} ${authenticatedUser.lastName}`
    return (
        <Box>
            <Menu aria-label={t('profileButton.title')}>
                <MenuButton as={AsButton} />
                <MenuList aria-label={t('profileButton.title')}>
                    <MenuItem>
                        <Columns alignY="top" space="small">
                            <Column width="content">
                                <Avatar
                                    size="xl"
                                    user={{
                                        name: fullName,
                                        email: authenticatedUser.emailAddress,
                                    }}
                                />
                            </Column>
                            <Column width="auto">
                                <Stack>
                                    <Text>{fullName}</Text>
                                    <Text tone="secondary">{authenticatedUser.emailAddress}</Text>
                                </Stack>
                            </Column>
                        </Columns>
                    </MenuItem>
                    <hr />
                    {leagues.map((league) => (
                        <MenuItem key={league.id}>
                            <Avatar
                                size="xs"
                                user={{
                                    name: league.name,
                                    email: league.name,
                                }}
                                className={classNames(styles.icon, styles.league_avatar)}
                            />
                            {league.name}
                        </MenuItem>
                    ))}
                    <MenuItem onSelect={() => dispatch(actions.addLeaguePopup(true))}>
                        <PlusIcon className={styles.icon} />
                        {t('profileButton.addLeague')}
                    </MenuItem>
                    <hr />
                    <MenuItem onSelect={logOut}>
                        <LogoutIcon className={styles.icon} />
                        {t('profileButton.logOut')}
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    )
}

export { ProfileButton }
