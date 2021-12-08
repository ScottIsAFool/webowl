import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router-dom'

import { Box, Heading, Stack, Text, TextLink } from '@doist/reactist'

import { useLeagueManagement, useQuery } from '../../hooks'

import type { League } from '@webowl/apiclient'

function AcceptInvite(): JSX.Element {
    const query = useQuery()
    const inviteCode = query.get('inviteCode')
    const { acceptUserInvite } = useLeagueManagement()
    const { t } = useTranslation()
    const [success, setSuccess] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState<string>()
    const [league, setLeague] = React.useState<League>()
    const navigate = useNavigate()

    const accept = React.useCallback(
        async function accept() {
            if (!inviteCode) return
            const response = await acceptUserInvite(inviteCode)
            if (response.type === 'error') {
                setErrorMessage(response.message)
            } else if (response.type === 'success') {
                setSuccess(true)
                setLeague(response.value.league)
            }
        },
        [acceptUserInvite, inviteCode],
    )

    React.useEffect(function pageLoad() {
        if (!inviteCode) return
        accept().finally(() => {
            // noop
        })
        // Only do this on the page load, just the once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!inviteCode) {
        return <Navigate to="/leagues" replace={true} />
    }

    function navigateToLeague() {
        if (!league) return

        navigate(`/leagues/${league.id}`)
    }

    return success ? (
        <Stack space="xlarge">
            <Heading level="1">{t('acceptInvite.header')}</Heading>
            <Text>
                <Trans
                    i18nKey="acceptInvite.successMessage"
                    components={{ tl: <TextLink onClick={navigateToLeague} /> }}
                />
            </Text>
        </Stack>
    ) : (
        <Box>{errorMessage}</Box>
    )
}

export { AcceptInvite }
