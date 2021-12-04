import * as React from 'react'
import {
    Button,
    Heading,
    Modal,
    ModalActions,
    ModalBody,
    ModalHeader,
    Stack,
    Text,
    TextField,
} from '@doist/reactist'
import { Trans, useTranslation } from 'react-i18next'
import { actions } from '../../reducers/actions'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import { useLeagueManagement } from '../../hooks'

function LeagueInvite(): JSX.Element | null {
    const [emailAddress, setEmailAddress] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState<string>()
    const [inviteSent, setInviteSent] = React.useState(false)
    const { league } = useAppSelector((state) => state.popups)
    const { t } = useTranslation()
    const dispatch = useAppDispatch()
    const { busy, sendUserInvite } = useLeagueManagement()
    if (!league) return null
    const title = t('popups.leagueInvite.header', { name: league.name })

    function close() {
        dispatch(actions.closeLeagueInvitiation())
        setEmailAddress('')
        setErrorMessage(undefined)
        setInviteSent(false)
    }

    async function sendInvite(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (inviteSent) {
            close()
        } else {
            if (!emailAddress || !league) return

            setErrorMessage(undefined)

            const response = await sendUserInvite(league.id, emailAddress)
            if (response.type === 'error') {
                setErrorMessage(response.message)
            }

            setInviteSent(response.type === 'success')
        }
    }

    return (
        <Modal isOpen={true} width="small" aria-label={title} onDismiss={close}>
            <ModalHeader>
                <Heading level="1">{title}</Heading>
            </ModalHeader>

            <form onSubmit={sendInvite}>
                <ModalBody>
                    {inviteSent ? (
                        <Stack space="medium">
                            <Text>
                                <Trans
                                    i18nKey="popups.leagueInvite.inviteSent"
                                    values={{ email: emailAddress }}
                                />
                            </Text>
                        </Stack>
                    ) : (
                        <Stack space="medium">
                            <Text>{t('popups.leagueInvite.mainText')}</Text>
                            <TextField
                                label={t('popups.leagueInvite.emailLabel')}
                                value={emailAddress}
                                onChange={(e) => setEmailAddress(e.target.value)}
                                placeholder={t('popups.leagueInvite.emailPlaceholder')}
                            />
                            {errorMessage ? <Text tone="danger">{errorMessage}</Text> : null}
                        </Stack>
                    )}
                </ModalBody>

                <ModalActions>
                    <Button
                        variant="primary"
                        disabled={!emailAddress || busy}
                        type="submit"
                        loading={busy}
                    >
                        <>
                            {inviteSent
                                ? t('popups.leagueInvite.close')
                                : t('popups.leagueInvite.sendInvite')}
                        </>
                    </Button>
                </ModalActions>
            </form>
        </Modal>
    )
}

export { LeagueInvite }
