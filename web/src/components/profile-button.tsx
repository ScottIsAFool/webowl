import { Avatar, Box, Button, Menu, MenuButton, MenuItem, MenuList, Text } from '@doist/reactist'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks'

const AsButton = React.forwardRef<HTMLButtonElement, unknown>(function AsButton({ ...props }, ref) {
    const { authenticatedUser } = useAuth()
    if (!authenticatedUser) throw new Error()
    return (
        <Button
            variant="quaternary"
            size="large"
            ref={ref}
            {...props}
            startIcon={
                <Avatar
                    size="s"
                    user={{
                        name: `${authenticatedUser.firstName} ${authenticatedUser.lastName}`,
                        email: authenticatedUser.emailAddress,
                    }}
                />
            }
        >
            <Text weight="semibold" lineClamp={1}>
                {authenticatedUser.firstName}
            </Text>
        </Button>
    )
})

function ProfileButton(): JSX.Element {
    const { logOut } = useAuth()
    const navigate = useNavigate()
    function doLogOut() {
        logOut()
        navigate('/', { replace: true })
    }
    return (
        <Box>
            <Menu aria-label="profile-menu">
                <MenuButton as={AsButton} />
                <MenuList>
                    <MenuItem onSelect={doLogOut}>Log out</MenuItem>
                </MenuList>
            </Menu>
        </Box>
    )
}

export { ProfileButton }
