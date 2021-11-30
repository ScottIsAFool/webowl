import { Box, Button, Heading, Hidden, Stack, Text, TextField, TextLink } from '@doist/reactist'
import * as React from 'react'
import { useQuery, useAccountCreation } from '../../hooks'
import { ReactComponent as ForgotPasswordImage } from '../../assets/images/ForgotPassword.svg'

import styles from './auth.module.css'

function RequestPasswordReset(): JSX.Element {
    const { requestPasswordReset, busy } = useAccountCreation()
    const query = useQuery()
    const [email, setEmail] = React.useState(query.get('email') ?? '')

    const [requestSent, setRequestSent] = React.useState(false)

    async function resetPassword(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!email) return

        const response = await requestPasswordReset(email)
        if (response.type === 'error') {
            // Display error message
        } else {
            setRequestSent(true)
        }
    }

    return (
        <Box display="flex" flexDirection="column" width="full" height="full">
            <Box id="header" width="fitContent">
                <TextLink href="/">
                    <Heading level="1" size="largest">
                        Webowl
                    </Heading>
                </TextLink>
            </Box>
            <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="center"
                height="full"
                id="content"
            >
                <Box
                    padding="xlarge"
                    id="password-container"
                    style={{ minWidth: '324px', maxWidth: '324px' }}
                    display="flex"
                    alignItems="flexStart"
                    flexDirection="column"
                    justifyContent="flexStart"
                >
                    <Stack paddingBottom="large" space="small">
                        <Heading level="1" size="larger">
                            Forgot your password?
                        </Heading>
                        <Text tone="secondary">Happens to the best of us</Text>
                    </Stack>
                    {!requestSent ? (
                        <form onSubmit={resetPassword}>
                            <Stack space="medium">
                                <Text>
                                    Enter your email address for the account whose password you wish
                                    to reset.
                                </Text>
                                <TextField
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    label="Email address"
                                />
                                <Box
                                    width="full"
                                    display="flex"
                                    flexDirection="column"
                                    paddingTop="small"
                                >
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        size="large"
                                        disabled={!email || busy}
                                        loading={busy}
                                    >
                                        Reset password
                                    </Button>
                                </Box>
                            </Stack>
                        </form>
                    ) : (
                        <Box>
                            <Text>
                                Thanks, if we found an account matching that email, a reset link is
                                on its way.
                            </Text>
                        </Box>
                    )}
                </Box>
                <Hidden below="desktop">
                    <Box className={styles.image}>
                        <ForgotPasswordImage />
                    </Box>
                </Hidden>
            </Box>
        </Box>
    )
}

export { RequestPasswordReset }
