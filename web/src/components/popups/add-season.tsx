import {
    Button,
    Heading,
    Input,
    Modal,
    ModalActions,
    ModalBody,
    ModalHeader,
    SelectField,
    Stack,
    SwitchField,
    TextField,
} from '@doist/reactist'
import type { AddSeasonRequest, Frequency, League } from '@webowl/apiclient'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useLeagueManagement } from '../../hooks'
import { actions } from '../../reducers/actions'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import range from 'lodash/range'

import styles from './add-season.module.css'

const roundNumbers = range(1, 11, 1)

type Buttons = {
    next?: AddSeasonSteps
    back?: AddSeasonSteps
}

type ButtonsData = {
    [k in AddSeasonSteps]: Buttons
}

type FrequencyKeys = {
    [k in Frequency]: string
}

const frequencyKeys: FrequencyKeys = {
    '7': 'popups.addSeason.options.weekly',
    '14': 'popups.addSeason.options.fortnightly',
    '28': 'popups.addSeason.options.fourWeeks',
}

const frequencies: Frequency[] = [7, 14, 28]

type AddSeasonSteps =
    | 'initial'
    | 'edit-initial'
    | 'options'
    | 'edit-options'
    | 'dates'
    | 'edit-dates'

const allButtonData: ButtonsData = {
    initial: { next: 'options' },
    'edit-initial': { next: 'edit-options', back: 'initial' },
    options: { back: 'initial', next: 'dates' },
    'edit-options': { back: 'edit-initial', next: 'edit-dates' },
    dates: { back: 'options' },
    'edit-dates': { back: 'edit-options' },
}

function AddSeason(): JSX.Element {
    const dispatch = useAppDispatch()
    const { t } = useTranslation()
    const { addSeason, busy } = useLeagueManagement()
    const league = useAppSelector((state) => state.popups.league)
    if (!league) {
        throw new Error('Something has gone wrong, how is league empty?')
    }
    const [step, setStep] = React.useState<AddSeasonSteps>('initial')
    const [setupChanged, setSetupChanged] = React.useState(false)
    const [name, setName] = React.useState('')
    const [rounds, setRounds] = React.useState(2)
    const [teamNumbers, setTeamNumbers] = React.useState(league.teamNumbers)
    const [frequency, setFrequency] = React.useState<Frequency>(7)

    const buttonData = allButtonData[step]
    const matches = rounds * teamNumbers
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
                teamNumbers,
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
                <ModalBody exceptionallySetClassName={styles.add_season}>
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
                    ) : step === 'options' || step === 'edit-options' ? (
                        <Stack space="medium">
                            <SelectField
                                label={t('popups.addSeason.options.roundsLabel')}
                                value={rounds}
                                onChange={(e) => setRounds(parseInt(e.target.value))}
                                hint={t('popups.addSeason.options.matchesCount', {
                                    matches: matches,
                                    teams: teamNumbers,
                                })}
                            >
                                {roundNumbers.map((x) => (
                                    <option key={x} value={x}>
                                        {t('popups.addSeason.options.rounds', {
                                            count: x,
                                        })}
                                    </option>
                                ))}
                            </SelectField>
                            <SelectField
                                label={t('popups.addSeason.options.frequencyLabel')}
                                value={frequency}
                                onChange={(e) =>
                                    setFrequency(parseInt(e.target.value) as Frequency)
                                }
                            >
                                {frequencies.map((x) => (
                                    <option key={x} value={x}>
                                        {t(frequencyKeys[x])}
                                    </option>
                                ))}
                            </SelectField>
                        </Stack>
                    ) : step === 'dates' || step === 'edit-dates' ? (
                        <Stack space="medium">
                            <Input type="time" />
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
