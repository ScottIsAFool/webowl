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
import * as React from 'react'
import { actions } from '../../reducers/actions'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'
import range from 'lodash/range'

import styles from './add-league.module.css'
import { useLeagueManagement } from '../../hooks'
import { playerFormat } from '../../utils/league-utils'
import { ReactComponent as DoneImage } from '../../assets/images/Done.svg'

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

    function gameFormat(value: number) {
        return value === 1 ? '1 game' : `${value} games`
    }

    if (!addLeaguesOpen) return null
    return (
        <Modal
            isOpen={true}
            width="large"
            onDismiss={close}
            aria-label="Add league"
            exceptionallySetClassName={styles.add_league}
        >
            <ModalHeader>
                <Heading level="1">Add league</Heading>
            </ModalHeader>
            <form onSubmit={nextClicked}>
                <ModalBody>
                    {step === 'name' ? (
                        <Stack space="medium">
                            <Text>First off, let&apos;s give this league a name</Text>
                            <TextField
                                label="League name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter a name for the league..."
                            />
                        </Stack>
                    ) : step === 'options' ? (
                        <Stack space="medium">
                            <Text>Cool, now to setup how the league is configured.</Text>
                            <SelectField
                                label="How many teams?"
                                value={teams}
                                onChange={(e) => setTeams(parseInt(e.target.value))}
                            >
                                {teamNumbers.map((x) => (
                                    <option value={x} key={x}>
                                        {x} teams
                                    </option>
                                ))}
                            </SelectField>
                            <SelectField
                                label="Series consists of..."
                                value={series}
                                onChange={(e) => setSeries(parseInt(e.target.value))}
                            >
                                {gameNumbers.map((x) => (
                                    <option value={x} key={x}>
                                        {gameFormat(x)}
                                    </option>
                                ))}
                            </SelectField>
                            <SelectField
                                label="The teams are..."
                                value={players}
                                onChange={(e) => setPlayers(parseInt(e.target.value))}
                            >
                                {playerNumbers.map((x) => (
                                    <option key={x} value={x}>
                                        {playerFormat(x)}
                                    </option>
                                ))}
                            </SelectField>
                            <SelectField
                                label="Maximum number of players per team"
                                value={maxPlayersPerTeam}
                                onChange={(e) => setMaxPlayersPerTeam(parseInt(e.target.value))}
                            >
                                {playersPerTeamNumbers.map((x) => (
                                    <option key={x} value={x}>
                                        {x}
                                    </option>
                                ))}
                            </SelectField>
                            <Text tone="secondary">And finally</Text>
                            <Inline space="large">
                                <CheckboxField
                                    value={String(handicap)}
                                    label="Handicapped?"
                                    onChange={(e) => setHandicap(e.target.value === 'true')}
                                />

                                <CheckboxField
                                    value={String(scratch)}
                                    label="Scratch?"
                                    onChange={(e) => setScratch(e.target.value === 'true')}
                                />
                            </Inline>
                        </Stack>
                    ) : step === 'extras' ? (
                        <Stack space="medium">
                            <Text>Almost there...</Text>
                            <TextField
                                label="Bowling association"
                                secondaryLabel="optional"
                                value={association}
                                onChange={(e) => setAssociation(e.target.value)}
                            />
                            <TextField
                                label="Sanction number"
                                secondaryLabel="optional"
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
                            <Text>Team added</Text>
                        </Box>
                    )}
                </ModalBody>

                <ModalActions>
                    {buttonData.back ? (
                        <Button variant="secondary" onClick={backClicked}>
                            Back
                        </Button>
                    ) : null}
                    {buttonData.next ? (
                        <Button
                            variant="primary"
                            disabled={nextDisabled || busy}
                            type="submit"
                            loading={busy}
                        >
                            {step === 'extras' ? 'Add League' : 'Next'}
                        </Button>
                    ) : null}
                    {!buttonData.next && !buttonData.back ? (
                        <Button variant="primary" onClick={close}>
                            Close
                        </Button>
                    ) : null}
                </ModalActions>
            </form>
        </Modal>
    )
}

export { AddLeague }
