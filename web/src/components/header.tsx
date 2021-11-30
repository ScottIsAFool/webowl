import * as React from 'react'
import { Box, Column, Columns, Heading, Text, TextLink } from '@doist/reactist'
import type { SpaceWithNegatives } from '@doist/reactist/lib/new-components/common-types'
import type { ResponsiveProp } from '@doist/reactist/lib/new-components/responsive-props'
import { useUserManagement } from '../hooks'
import { authNavigate } from '../routing/routes/auth-routes'

import styles from './header.module.css'
import { ProfileButton } from './profile-button'

function Header(): JSX.Element {
    const { authenticatedUser } = useUserManagement()

    return (
        <Box
            id="header"
            width="full"
            paddingBottom="large"
            display="flex"
            flexDirection="column"
            className={styles.header}
        >
            {authenticatedUser && !authenticatedUser.verified ? <VerificationBox /> : null}
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
                        <ProfileButton />
                    </Box>
                </Column>
            </Columns>
        </Box>
    )
}

function VerificationBox(): JSX.Element {
    const verifySpacing: ResponsiveProp<SpaceWithNegatives> = {
        desktop: '-xlarge',
        tablet: '-xlarge',
        mobile: '-medium',
    }
    return (
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
    )
}

export { Header }
