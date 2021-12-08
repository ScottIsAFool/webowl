import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Box, Column, Columns, Heading, TextLink } from '@doist/reactist'

import { ReactComponent as Spreadsheet } from '../assets/images/Spreadsheet.svg'
import { leagueNavigate } from '../routing/routes/league-routes'

function Home(): JSX.Element {
    const { t } = useTranslation()
    return (
        <Box display="flex" flexDirection="column" width="full" height="full">
            <Box id="header" paddingBottom="xlarge">
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
                            <TextLink href={leagueNavigate('')}>
                                <Heading level="1">{t('home.openLeagues')}</Heading>
                            </TextLink>
                        </Box>
                    </Column>
                </Columns>
            </Box>
            <Box
                id="content"
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="full"
            >
                <Spreadsheet height="300px" />
            </Box>
        </Box>
    )
}

export { Home }
