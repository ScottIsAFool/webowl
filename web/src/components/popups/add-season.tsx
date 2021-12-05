import {
    Button,
    Heading,
    Modal,
    ModalActions,
    ModalBody,
    ModalHeader,
    Stack,
    SwitchField,
    TextField,
} from '@doist/reactist'
import type { AddSeasonRequest, League } from '@webowl/apiclient'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useLeagueManagement } from '../../hooks'
import { actions } from '../../reducers/actions'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'

type Buttons = {
    next?: AddSeasonSteps
    back?: AddSeasonSteps
}

type ButtonsData = {
    [k in AddSeasonSteps]: Buttons
}

type AddSeasonSteps = 'initial' | 'edit-initial' | 'options'

const allButtonData: ButtonsData = {
    initial: { next: 'options' },
    'edit-initial': { next: 'options', back: 'initial' },
    options: { back: 'initial' },
}

function AddSeason(): JSX.Element {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const { addSeason, busy } = useLeagueManagement()
    const league = useAppSelector((state) => state.popups.league)
    const [step, setStep] = React.useState<AddSeasonSteps>('initial')
    const [setupChanged, setSetupChanged] = React.useState(false)
    const [name, setName] = React.useState('')

    if (!league) {
        throw new Error('Something has gone wrong, how is league empty?')
    }

    const buttonData = allButtonData[step]
    function close() {
        dispatch(actions.closeAddSeason())
    }

    function backClicked() {
        if (!buttonData.back) return

        setStep(buttonData.back)
    }

    async function nextClicked(event: React.FormEvent<HTMLFormElement>, league: League) {
        event.preventDefault()
        if (!buttonData.next) return

        if (step === 'initial' && setupChanged) {
            setStep('edit-initial')
            return
        }

        if (false) {
            const response = await addSeason({
                teamNumbers: league.teamNumbers,
                leagueId: league.id,
                name,
            } as AddSeasonRequest)
            if (response.type === 'error') {
                // Display error message
                return
            }
        }

        setStep(buttonData.next)
    }
    return (
        <Modal
            isOpen={true}
            width="small"
            onDismiss={close}
            aria-label={t('popups.addSeason.header')}
        >
            <ModalHeader>
                <Heading level="1">{t('popups.addSeason.header')}</Heading>
            </ModalHeader>

            <form onSubmit={(e) => nextClicked(e, league)}>
                <ModalBody>
                    {step === 'initial' ? (
                        <Stack space="large">
                            <Heading level="2">{t('popups.addSeason.initial.mainText')}</Heading>
                            <TextField
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                label={t('popups.addSeason.initial.nameLabel')}
                                placeholder={t('popups.addSeason.initial.namePlaceholder')}
                                secondaryLabel={t('popups.addSeason.initial.optional')}
                            />
                            <SwitchField
                                label={t('popups.addSeason.initial.changedLabel')}
                                onChange={(e) => setSetupChanged(e.target.checked)}
                            />
                        </Stack>
                    ) : (
                        step
                    )}
                </ModalBody>

                <ModalActions>
                    {buttonData.back ? (
                        <Button variant="secondary" onClick={backClicked}>
                            <>{t('addLeague.back')}</>
                        </Button>
                    ) : null}
                    {buttonData.next ? (
                        <Button variant="primary" disabled={busy} type="submit" loading={busy}>
                            <>{t('addLeague.next')}</>
                        </Button>
                    ) : null}
                    {!buttonData.next && !buttonData.back ? (
                        <Button variant="primary" onClick={close}>
                            <>{t('addLeague.close')}</>
                        </Button>
                    ) : null}
                </ModalActions>
            </form>
        </Modal>
    )
}

export { AddSeason }
