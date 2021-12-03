import * as React from 'react'
import { Box, Column, Columns, Heading, Text, TextLink } from '@doist/reactist'
import type { Space } from '@doist/reactist/lib/new-components/common-types'
import type { ResponsiveProp } from '@doist/reactist/lib/new-components/responsive-props'
import { useUserManagement } from '../hooks'
import { authNavigate } from '../routing/routes/auth-routes'

import styles from './header.module.css'
import { ProfileButton } from './profile-button'
import { useTranslation } from 'react-i18next'

function Header(): JSX.Element {
    const { authenticatedUser } = useUserManagement()

    const padding: ResponsiveProp<Space> = {
        desktop: 'xlarge',
        tablet: 'xlarge',
        mobile: 'medium',
    }

    return (
        <Box
            id="header"
            width="full"
            paddingBottom={padding}
            display="flex"
            flexDirection="column"
            className={styles.header}
        >
            {authenticatedUser && !authenticatedUser.verified ? <VerificationBox /> : null}
            <Columns
                alignY="center"
                paddingTop={padding}
                paddingLeft={padding}
                paddingRight={padding}
            >
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
    const { t } = useTranslation()
    return (
        <Box
            marginBottom="medium"
            padding="xsmall"
            style={{ background: 'var(--webowl-background-information)' }}
            display="flex"
            justifyContent="center"
        >
            <Text>
                {t('auth.header.text')}{' '}
                <TextLink
                    href={authNavigate('resend-verification')}
                    style={{
                        color: 'var(--webowl-background)',
                    }}
                >
                    <>{t('auth.header.action')}</>
                </TextLink>
            </Text>
        </Box>
    )
}

export { Header }
