import * as React from 'react'
import { Button, Stack } from '@doist/reactist'
import { getConfiguration } from '../config/configuration'
import { ReactComponent as GoogleIcon } from '../assets/icons/google.svg'
import { ReactComponent as FacebookIcon } from '../assets/icons/facebook.svg'
import { ReactComponent as AppleIcon } from '../assets/icons/apple.svg'
import { ReactComponent as MicrosoftIcon } from '../assets/icons/microsoft.svg'
import { GoogleLoginResponse, GoogleLoginResponseOffline, useGoogleLogin } from 'react-google-login'
import { useApiClient, useAuth } from '../hooks'

import style from './social-auth-buttons.module.css'

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
        <Stack
            width="full"
            paddingBottom="small"
            space="small"
            exceptionallySetClassName={style.buttons}
        >
            <Button
                variant="secondary"
                startIcon={<GoogleIcon />}
                size="large"
                disabled={!loaded}
                onClick={googleSignIn}
            >
                Log in with Google
            </Button>
            <Button variant="secondary" startIcon={<FacebookIcon />} size="large">
                Log in with Facebook
            </Button>
            <Button
                variant="secondary"
                startIcon={<MicrosoftIcon className={style.microsoft} />}
                size="large"
            >
                Log in with Microsoft
            </Button>
            {/* <Button
                variant="secondary"
                startIcon={<AppleIcon className={style.apple} />}
                size="large"
            >
                Log in with Apple
            </Button> */}
        </Stack>
    )
}

export { SocialAuthButtons }
