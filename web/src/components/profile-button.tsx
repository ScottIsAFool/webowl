import {
    Avatar,
    Box,
    Button,
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

const AsButton = React.forwardRef<HTMLButtonElement, unknown>(function AsButton({ ...props }, ref) {
    const { authenticatedUser } = useUserManagement()
    if (!authenticatedUser) throw new Error()
    return (
        <Button variant="quaternary" size="large" ref={ref} {...props}>
            <Avatar
                size="s"
                user={{
                    name: `${authenticatedUser.firstName} ${authenticatedUser.lastName}`,
                    email: authenticatedUser.emailAddress,
                }}
            />
        </Button>
    )
})

function ProfileButton(): JSX.Element {
    const { logOut } = useAuth()
    const { authenticatedUser } = useUserManagement()
    if (!authenticatedUser) throw new Error()
    const fullName = `${authenticatedUser.firstName} ${authenticatedUser.lastName}`
    return (
        <Box>
            <Menu aria-label="profile-menu">
                <MenuButton as={AsButton} />
                <MenuList>
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
                    <MenuItem>
                        <PlusIcon className={styles.icon} />
                        Add league
                    </MenuItem>
                    <MenuItem onSelect={logOut}>
                        <LogoutIcon className={styles.icon} />
                        Log out
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    )
}

export { ProfileButton }
