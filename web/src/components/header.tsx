import { Box, Column, Columns, Heading, TextLink } from '@doist/reactist'
import * as React from 'react'
import { useAuth } from '../hooks'

function Header(): JSX.Element {
    const { logOut } = useAuth()
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
                        <TextLink onClick={logOut}>Logout</TextLink>
                    </Box>
                </Column>
            </Columns>
        </Box>
    )
}

export { Header }
