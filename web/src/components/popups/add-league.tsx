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
import * as React from 'react'
import { actions } from '../../reducers/actions'
import { useAppDispatch, useAppSelector } from '../../reducers/hooks'

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
    const [teams, setTeams] = React.useState(2)
    const [series, setSeries] = React.useState(3)
    const [players, setPlayers] = React.useState(2)
    const addLeaguesOpen = useAppSelector((state) => state.popups.addLeague)
    const dispatch = useAppDispatch()

    function close() {
        dispatch(actions.addLeaguePopup(false))
        setStep('name')
        setName('')
        setAssociation('')
        setSanction('')
        setTeams(2)
        setSeries(3)
        setPlayers(2)
    }

    const buttonData = allButtonData[step]
    const nextDisabled = !name

    function nextClicked(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!buttonData.next) return

        setStep(buttonData.next)
    }

    function backClicked() {
        if (!buttonData.back) return

        setStep(buttonData.back)
    }

    if (!addLeaguesOpen) return null
    return (
        <Modal isOpen={true} width="large" onDismiss={close} aria-lable="Add league">
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
                    ) : (
                        step
                    )}
                </ModalBody>

                <ModalActions>
                    {buttonData.back ? (
                        <Button variant="secondary" onClick={backClicked}>
                            Back
                        </Button>
                    ) : null}
                    {buttonData.next ? (
                        <Button variant="primary" disabled={nextDisabled} type="submit">
                            Next
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
