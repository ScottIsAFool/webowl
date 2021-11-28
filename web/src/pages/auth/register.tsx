/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'
import { useUserManagement } from '../../hooks'

function Register(): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { register } = useUserManagement()
    const [emailAddress, setEmailAddress] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [firstName, setFirstName] = React.useState('')
    const [lastName, setLastName] = React.useState('')
    const [errorMessage, setErrorMessage] = React.useState<string | undefined>()

    const doRegister = React.useCallback(
        async function doRegister() {
            setErrorMessage('')

            const response = await register(emailAddress, password, firstName, lastName)
            if (response.type === 'success') {
                // Do something, navigate to a success page?
            } else if (response.type === 'error') {
                setErrorMessage(response.message)
            }
        },
        [emailAddress, firstName, lastName, password, register],
    )
    return <>Register</>
}

export { Register }
