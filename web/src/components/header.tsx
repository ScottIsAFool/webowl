import { Box, Column, Columns, Heading, Text, TextLink } from '@doist/reactist'
import type { SpaceWithNegatives } from '@doist/reactist/lib/new-components/common-types'
import type { ResponsiveProp } from '@doist/reactist/lib/new-components/responsive-props'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks'
import { authNavigate } from '../routing/routes/auth-routes'

function Header(): JSX.Element {
    const { logOut, authenticatedUser } = useAuth()
    const navigate = useNavigate()
    function doLogOut() {
        logOut()
        navigate('/', { replace: true })
    }
    const verifySpacing: ResponsiveProp<SpaceWithNegatives> = {
        desktop: '-xlarge',
        tablet: '-xlarge',
        mobile: '-medium',
    }
    return (
        <Box id="header" width="full" paddingBottom="large" display="flex" flexDirection="column">
            {!authenticatedUser?.verified ? (
                <Box
                    marginBottom="medium"
                    padding="xsmall"
                    style={{ background: 'var(--webowl-background-information)' }}
                    display="flex"
                    justifyContent="center"
                    marginTop={verifySpacing}
                    marginLeft={verifySpacing}
                    marginRight={verifySpacing}
                >
                    <Text>
                        You need to verify your email address.{' '}
                        <TextLink
                            href={authNavigate('resend-verification')}
                            style={{
                                color: 'var(--webowl-background)',
                            }}
                        >
                            Click here to resend verification email.
                        </TextLink>
                    </Text>
                </Box>
            ) : null}
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
