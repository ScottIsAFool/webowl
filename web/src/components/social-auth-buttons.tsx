import * as React from 'react'
import { Box, Button } from '@doist/reactist'
import { getConfiguration } from '../config/configuration'
import { ReactComponent as GoogleIcon } from '../assets/icons/google.svg'
import { GoogleLoginResponse, GoogleLoginResponseOffline, useGoogleLogin } from 'react-google-login'
import { useApiClient, useAuth } from '../hooks'

const { googleClientId } = getConfiguration()

function SocialAuthButtons(): JSX.Element {
    const { updateAuthDetails } = useAuth()
    const { apiClient } = useApiClient()
    const onGoogleSuccess = React.useCallback(
        async function onSuccess(response: GoogleLoginResponse | GoogleLoginResponseOffline) {
            if ('googleId' in response) {
                const { accessToken, googleId } = response

                const serverResponse = await apiClient.socialLogin({
                    accessToken,
                    provider: 'Google',
                    socialId: googleId,
                })

                updateAuthDetails(serverResponse)
            }
        },
        [apiClient, updateAuthDetails],
    )
    const { signIn: googleSignIn, loaded } = useGoogleLogin({
        clientId: googleClientId,
        onSuccess: onGoogleSuccess,
    })

    return (
        <Box display="flex" flexDirection="column" width="full" paddingBottom="small">
            <Button
                variant="secondary"
                startIcon={<GoogleIcon />}
                size="large"
                disabled={!loaded}
                onClick={googleSignIn}
            >
                Log in with Google
            </Button>
        </Box>
    )
}

export { SocialAuthButtons }
