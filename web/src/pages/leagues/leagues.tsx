import { Box, Heading, Stack, Text } from '@doist/reactist'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '../../reducers/actions'
import { useAppSelector } from '../../reducers/hooks'

function Leagues(): JSX.Element {
    const leagues = useAppSelector((state) => state.leagues)
    const dispatch = useDispatch()

    function addLeague() {
        dispatch(actions.addLeaguePopup(true))
    }
    return (
        <Box width="full" height="full">
            <Stack space="medium">
                <Heading level="1">Your leagues</Heading>
                {leagues.length === 0 ? (
                    <Text>No leagues</Text>
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
