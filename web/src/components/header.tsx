import { Box, Column, Columns, Heading, TextLink } from '@doist/reactist'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks'

function Header(): JSX.Element {
    const { logOut } = useAuth()
    const navigate = useNavigate()
    function doLogOut() {
        logOut()
        navigate('/', { replace: true })
    }
    return (
        <Box id="header" width="full" paddingBottom="large">
            <Columns alignY="center">
                <Column width="content">
                    <TextLink href="/">
                        <Heading level="1" size="largest">
                            Webowl
                        </Heading>
                    </TextLink>
                </Column>
                <Column width="auto">
                    <Box display="flex" alignItems="flexEnd" justifyContent="flexEnd">
                        <TextLink onClick={doLogOut}>Logout</TextLink>
                    </Box>
                </Column>
            </Columns>
        </Box>
    )
}

export { Header }
