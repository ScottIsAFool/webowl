import {
    Box,
    Button,
    CheckboxField,
    Heading,
    Inline,
    Input,
    Modal,
    ModalActions,
    ModalBody,
    ModalHeader,
    SelectField,
    Stack,
    SwitchField,
    Text,
    TextField,
} from '@doist/reactist'
import { DEFAULT_STANDING_RULES, Frequency, League, StandingRules } from '@webowl/apiclient'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useLeagueManagement } from '../../hooks'
import { actions } from '../../reducers/actions'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import range from 'lodash/range'

import styles from './add-season.module.css'
import dayjs from 'dayjs'

const roundNumbers = range(1, 11, 1)
const numberOfTeams = range(4, 51, 2)

type Buttons = {
    next?: AddSeasonSteps
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
    | 'dates'
    | 'handicap'
    | 'scratch'
    | 'finished'

const allButtonData: ButtonsData = {
    initial: { next: 'options' },
    'edit-initial': { next: 'options' },
    options: { next: 'dates' },
    dates: { next: 'handicap' },
    handicap: { next: 'scratch' },
    scratch: { next: 'finished' },
    finished: {},
}

function StandingsPicker({
    standings,
    onChange,
}: {
    standings: StandingRules
    onChange: (standings: StandingRules) => void
}): JSX.Element {
    return <Stack space="medium">Picker</Stack>
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
    const [stepHistory, setStepHistory] = React.useState<AddSeasonSteps[]>([])
    const [setupChanged, setSetupChanged] = React.useState(false)
    const [name, setName] = React.useState('')
    const [rounds, setRounds] = React.useState(2)
    const [teamNumbers, setTeamNumbers] = React.useState(league.teamNumbers)
    const [frequency, setFrequency] = React.useState<Frequency>(7)
    const [time, setTime] = React.useState(dayjs().format('HH:mm'))
    const [startDate, setStartDate] = React.useState(dayjs().format('YYYY-MM-DD'))
    const [roundsPerDate, setRoundsPerDate] = React.useState(1)
    const [handicapPercent, setHandicapPercent] = React.useState(75)
    const [handicapOf, setHandicapOf] = React.useState(200)
    const [hasMaxHandicap, setHasMaxHandicap] = React.useState(true)
    const [maxHandicap, setMaxHandicap] = React.useState(100)
    const [scratch, setScratch] = React.useState(league.scratch)
    const [handicap, setHandicap] = React.useState(league.handicap)
    const [startLane, setStartLane] = React.useState(1)
    const [handicapPointsPerGame, setHandicapPointsPerGame] = React.useState(1)
    const [scratchPointsPerGame, setScratchPointsPerGame] = React.useState(1)
    const [handicapStandingRules, setHandicapStandingRules] = React.useState(DEFAULT_STANDING_RULES)
    const [scratchStandingRules, setScratchStandingRules] = React.useState(DEFAULT_STANDING_RULES)

    const buttonData = allButtonData[step]
    const matches = rounds * (teamNumbers - 1)
    const finishDate = React.useMemo(
        () => dayjs(startDate).add((matches * frequency) / roundsPerDate, 'days'),
        [frequency, matches, roundsPerDate, startDate],
    )

    const isAddSeasonButton = (step === 'handicap' && !scratch) || step === 'scratch'

    function close() {
        dispatch(actions.closeAddSeason())
    }

    function backClicked() {
        if (stepHistory.length === 0) return

        const history = stepHistory.slice()
        const previousStep = history.pop() as AddSeasonSteps

        setStep(previousStep)
        setStepHistory(history)
    }

    async function nextClicked(event: React.FormEvent<HTMLFormElement>, league: League) {
        event.preventDefault()
        if (!buttonData.next) return

        setStepHistory([...stepHistory, step])

        if (step === 'initial' && setupChanged) {
            setStep('edit-initial')
            return
        }

        if (step === 'dates') {
            setStep(handicap ? 'handicap' : 'scratch')
            return
        }

        if (step === 'handicap' && scratch) {
            setStep('scratch')
            return
        }

        if (isAddSeasonButton) {
            const response = await addSeason({
                teamNumbers,
                leagueId: league.id,
                name,
                rounds,
                roundsPerDate,
                frequency,
                time,
                startDate: dayjs(startDate).toDate(),
                startLane,
                scratch,
                handicap,
                handicapPercent,
                handicapOf,
                hasMaxHandicap,
                maxHandicap,
                handicapPointsPerGame,
                scratchPointsPerGame,
                handicapStandingRules,
                scratchStandingRules,
            })
            if (response.type === 'error') {
                // Display error message
                return
            }

            setStep('finished')
            setStepHistory([])
        } else {
            setStep(buttonData.next)
        }
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
                                checked={setupChanged}
                                onChange={(e) => setSetupChanged(e.target.checked)}
                            />
                        </Stack>
                    ) : step === 'edit-initial' ? (
                        <Stack space="medium">
                            <SelectField
                                label={t('addLeague.options.teamsLabel')}
                                value={teamNumbers}
                                onChange={(e) => setTeamNumbers(parseInt(e.target.value))}
                            >
                                {numberOfTeams.map((x) => (
                                    <option value={x} key={x}>
                                        {t('addLeague.options.multiTeams', { team: x })}
                                    </option>
                                ))}
                            </SelectField>
                            <Inline space="large">
                                <CheckboxField
                                    checked={handicap}
                                    label={t('addLeague.options.handicapped')}
                                    onChange={(e) => setHandicap(e.target.checked)}
                                />

                                <CheckboxField
                                    checked={scratch}
                                    label={t('addLeague.options.scratch')}
                                    onChange={(e) => setScratch(e.target.checked)}
                                />
                            </Inline>
                        </Stack>
                    ) : step === 'options' ? (
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
                            <Text id="laneNumberLabel" weight="bold">
                                {t('popups.addSeason.options.laneNumberLabel')}
                            </Text>
                            <Stack width="xsmall">
                                <Input
                                    type="number"
                                    aria-labelledby="laneNumberLabel"
                                    value={startLane}
                                    onChange={(e) => setStartLane(parseInt(e.target.value))}
                                />
                            </Stack>
                        </Stack>
                    ) : step === 'dates' ? (
                        <Stack space="medium">
                            <Stack width="xsmall">
                                <Text id="timeLabel" weight="bold">
                                    {t('popups.addSeason.dates.timeLabel')}
                                </Text>
                                <Input
                                    type="time"
                                    aria-labelledby="timeLabel"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </Stack>
                            <Stack>
                                <Stack width="xsmall">
                                    <Text id="dateLabel" weight="bold">
                                        {t('popups.addSeason.dates.dateLabel')}
                                    </Text>
                                    <Input
                                        type="date"
                                        aria-labelledby="dateLabel"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </Stack>
                                <Text tone="secondary">
                                    {t('popups.addSeason.dates.estimatedFinishDate', {
                                        date: finishDate.format('MMMM D, YYYY'),
                                    })}
                                </Text>
                            </Stack>
                            <Stack width="xsmall">
                                <Text id="roundsLabel" weight="bold">
                                    {t('popups.addSeason.dates.roundsPerDayLabel')}
                                </Text>
                                <Input
                                    type="number"
                                    aria-labelledby="roundsLabel"
                                    value={roundsPerDate}
                                    min={1}
                                    max={3}
                                    onChange={(e) => setRoundsPerDate(parseInt(e.target.value))}
                                />
                            </Stack>
                        </Stack>
                    ) : step === 'handicap' ? (
                        <Stack space="medium">
                            <Text>{t('popups.addSeason.handicap.handicapLabel')}</Text>
                            <Inline space="small">
                                <Box>
                                    <Input
                                        type="number"
                                        style={{ maxWidth: '75px' }}
                                        min={1}
                                        max={100}
                                        value={handicapPercent}
                                        onChange={(e) =>
                                            setHandicapPercent(parseInt(e.target.value))
                                        }
                                    />
                                </Box>
                                <Text>{t('popups.addSeason.handicap.percentOf')}</Text>
                                <Box>
                                    <Input
                                        type="number"
                                        style={{ maxWidth: '75px' }}
                                        value={handicapOf}
                                        onChange={(e) => setHandicapOf(parseInt(e.target.value))}
                                    />
                                </Box>
                            </Inline>
                            <SwitchField
                                label="Is there a maximum handicap?"
                                checked={hasMaxHandicap}
                                onChange={(e) => setHasMaxHandicap(e.target.checked)}
                            />
                            {hasMaxHandicap ? (
                                <Input
                                    type="number"
                                    style={{ maxWidth: '75px' }}
                                    min={1}
                                    value={maxHandicap}
                                    onChange={(e) => setMaxHandicap(parseInt(e.target.value))}
                                />
                            ) : null}
                            <StandingsPicker
                                standings={handicapStandingRules}
                                onChange={setHandicapStandingRules}
                            />
                        </Stack>
                    ) : step === 'scratch' ? (
                        <Stack space="medium">
                            <Text>Scratch</Text>
                            <StandingsPicker
                                standings={scratchStandingRules}
                                onChange={setScratchStandingRules}
                            />
                        </Stack>
                    ) : (
                        step
                    )}
                </ModalBody>

                <ModalActions>
                    {stepHistory.length > 0 ? (
                        <Button variant="secondary" onClick={backClicked}>
                            <>{t('addLeague.back')}</>
                        </Button>
                    ) : null}
                    {buttonData.next || isAddSeasonButton ? (
                        <Button variant="primary" disabled={busy} type="submit" loading={busy}>
                            <>
                                {isAddSeasonButton
                                    ? t('popups.addSeason.add')
                                    : t('addLeague.next')}
                            </>
                        </Button>
                    ) : null}
                    {step === 'finished' ? (
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
