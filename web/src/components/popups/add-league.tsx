import * as React from 'react'
import { useTranslation } from 'react-i18next'

import {
    Box,
    Button,
    CheckboxField,
    Heading,
    Inline,
    Modal,
    ModalActions,
    ModalBody,
    ModalHeader,
    SelectField,
    Stack,
    Text,
    TextField,
} from '@doist/reactist'

import range from 'lodash/range'

import { ReactComponent as DoneImage } from '../../assets/images/Done.svg'
import { useLeagueManagement } from '../../hooks'
import { actions } from '../../reducers/actions'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import { getPlayerFormatKey } from '../../utils/league-utils'

import styles from './add-league.module.css'

const teamNumbers = range(4, 51, 2)
const gameNumbers = range(1, 5, 1)
const playerNumbers = range(1, 6, 1)
const playersPerTeamNumbers = range(2, 9, 1)

type Buttons = {
    next?: AddLeagueSteps
    back?: AddLeagueSteps
}

type ButtonsData = {
    [k in AddLeagueSteps]: Buttons
}

const allButtonData: ButtonsData = {
    name: { next: 'options' },
    options: { back: 'name', next: 'extras' },
    extras: { back: 'options', next: 'finished' },
    finished: {},
}

type AddLeagueSteps = 'name' | 'options' | 'extras' | 'finished'

function AddLeague(): JSX.Element | null {
    const { t } = useTranslation()
    const [step, setStep] = React.useState<AddLeagueSteps>('name')
    const [name, setName] = React.useState('')
    const [association, setAssociation] = React.useState('')
    const [sanction, setSanction] = React.useState('')
    const [teams, setTeams] = React.useState(10)
    const [series, setSeries] = React.useState(3)
    const [players, setPlayers] = React.useState(2)
    const [handicap, setHandicap] = React.useState(false)
    const [scratch, setScratch] = React.useState(false)
    const [maxPlayersPerTeam, setMaxPlayersPerTeam] = React.useState(8)
    const addLeaguesOpen = useAppSelector((state) => state.popups.addLeague)
    const dispatch = useAppDispatch()
    const { addLeague, busy } = useLeagueManagement()

    function close() {
        dispatch(actions.addLeaguePopup(false))
        setStep('name')
        setName('')
        setAssociation('')
        setSanction('')
        setTeams(10)
        setSeries(3)
        setPlayers(2)
        setHandicap(false)
        setScratch(false)
        setMaxPlayersPerTeam(8)
    }

    const buttonData = allButtonData[step]
    const nextDisabled = !name || maxPlayersPerTeam < players

    async function nextClicked(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!buttonData.next) return

        if (step === 'extras') {
            const response = await addLeague({
                name,
                playersPerTeam: players,
                seriesGames: series,
                teamNumbers: teams,
                localAssociation: association,
                sanctionNumber: sanction,
                handicap,
                scratch,
                maxPlayersPerTeam: maxPlayersPerTeam,
            })
            if (response.type === 'error') {
                // Display error message
                return
            }
        }
        setStep(buttonData.next)
    }

    function backClicked() {
        if (!buttonData.back) return

        setStep(buttonData.back)
    }

    if (!addLeaguesOpen) return null
    return (
        <Modal
            isOpen={true}
            width="medium"
            onDismiss={close}
            aria-label={t('addLeague.title')}
            exceptionallySetClassName={styles.add_league}
        >
            <ModalHeader>
                <Heading level="1">{t('addLeague.title')}</Heading>
            </ModalHeader>
            <form onSubmit={nextClicked}>
                <ModalBody>
                    {step === 'name' ? (
                        <Stack space="medium">
                            <Text>{t('addLeague.name.heading')}</Text>
                            <TextField
                                label={t('addLeague.name.nameLabel')}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder={t('addLeague.name.namePlaceholder')}
                            />
                        </Stack>
                    ) : step === 'options' ? (
                        <Stack space="medium">
                            <Text>{t('addLeague.options.heading')}</Text>
                            <SelectField
                                label={t('addLeague.options.teamsLabel')}
                                value={teams}
                                onChange={(e) => setTeams(parseInt(e.target.value))}
                            >
                                {teamNumbers.map((x) => (
                                    <option value={x} key={x}>
                                        {t('addLeague.options.multiTeams', { team: x })}
                                    </option>
                                ))}
                            </SelectField>
                            <SelectField
                                label={t('addLeague.options.seriesLabel')}
                                value={series}
                                onChange={(e) => setSeries(parseInt(e.target.value))}
                            >
                                {gameNumbers.map((x) => (
                                    <option value={x} key={x}>
                                        {x === 1
                                            ? t('addLeague.options.oneGame')
                                            : t('addLeague.options.multiGame', { game: x })}
                                    </option>
                                ))}
                            </SelectField>
                            <SelectField
                                label={t('addLeague.options.playersLabel')}
                                value={players}
                                onChange={(e) => setPlayers(parseInt(e.target.value))}
                            >
                                {playerNumbers.map((x) => (
                                    <option key={x} value={x}>
                                        {t(`team.${getPlayerFormatKey(x)}`)}
                                    </option>
                                ))}
                            </SelectField>
                            <SelectField
                                label={t('addLeague.options.maxPlayersLabel')}
                                value={maxPlayersPerTeam}
                                onChange={(e) => setMaxPlayersPerTeam(parseInt(e.target.value))}
                            >
                                {playersPerTeamNumbers.map((x) => (
                                    <option key={x} value={x}>
                                        {x}
                                    </option>
                                ))}
                            </SelectField>
                            <Text tone="secondary">{t('addLeague.options.finally')}</Text>
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
                    ) : step === 'extras' ? (
                        <Stack space="medium">
                            <Text>{t('addLeague.extras.heading')}</Text>
                            <TextField
                                label={t('addLeague.extras.associationLabel')}
                                secondaryLabel={t('addLeague.extras.optional')}
                                value={association}
                                onChange={(e) => setAssociation(e.target.value)}
                            />
                            <TextField
                                label={t('addLeague.extras.sanctionLabel')}
                                secondaryLabel={t('addLeague.extras.optional')}
                                value={sanction}
                                onChange={(e) => setSanction(e.target.value)}
                            />
                        </Stack>
                    ) : (
                        <Box
                            width="full"
                            flexDirection="column"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <DoneImage className={styles.image} />
                            <Text>{t('addLeague.finished.teamAdded')}</Text>
                        </Box>
                    )}
                </ModalBody>

                <ModalActions>
                    {buttonData.back ? (
                        <Button variant="secondary" onClick={backClicked}>
                            <>{t('addLeague.back')}</>
                        </Button>
                    ) : null}
                    {buttonData.next ? (
                        <Button
                            variant="primary"
                            disabled={nextDisabled || busy}
                            type="submit"
                            loading={busy}
                        >
                            <>{step === 'extras' ? t('addLeague.add') : t('addLeague.next')}</>
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

export { AddLeague }
