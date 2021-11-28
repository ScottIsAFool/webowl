import * as React from 'react'
import { Box, Column, Columns, Heading, Stack, TextLink } from '@doist/reactist'
import { ReactComponent as Spreadsheet } from '../assets/images/Spreadsheet.svg'

function Home(): JSX.Element {
    return (
        <Stack width="full" space="xxlarge">
            <Box id="header">
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
                            <TextLink href="/leagues">
                                <Heading level="1">Open leagues</Heading>
                            </TextLink>
                        </Box>
                    </Column>
                </Columns>
            </Box>
            <Box id="content" display="flex" alignItems="center" justifyContent="center">
                <Spreadsheet height="300px" />
            </Box>
        </Stack>
    )
}

export { Home }
