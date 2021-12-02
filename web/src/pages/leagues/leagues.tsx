import { Box, Heading, Stack, Text, TextLink } from '@doist/reactist'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '../../reducers/actions'
import { useAppSelector } from '../../reducers/hooks'
import { ReactComponent as NotFoundImage } from '../../assets/images/NotFound.svg'

import styles from './leagues.module.css'

function Leagues(): JSX.Element {
    const leagues = useAppSelector((state) => state.leagues)
    const dispatch = useDispatch()

    function addLeague() {
        dispatch(actions.addLeaguePopup(true))
    }
    return (
        <Box width="full" height="full">
            <Stack space="medium" style={{ height: '100%' }}>
                <Heading level="1">Your leagues</Heading>
                {leagues.length === 0 ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        height="full"
                    >
                        <Stack space="large" align="center">
                            <NotFoundImage className={styles.image} />
                            <Text tone="secondary" align="center">
                                You don&apos;t appear to have any leagues, why not{' '}
                                <TextLink onClick={addLeague}>add one?</TextLink>
                            </Text>
                        </Stack>
                    </Box>
                ) : (
                    <Stack space="medium">
                        {leagues.map((league) => (
                            <Box key={league.id}>{league.name}</Box>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Box>
    )
}

export { Leagues }
