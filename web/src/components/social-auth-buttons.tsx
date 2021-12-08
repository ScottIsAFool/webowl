import * as React from 'react'
import { GoogleLoginResponse, GoogleLoginResponseOffline, useGoogleLogin } from 'react-google-login'
import { useTranslation } from 'react-i18next'

import { Button, Stack } from '@doist/reactist'

import { ReactComponent as GoogleIcon } from '../assets/icons/google.svg'
// import { ReactComponent as FacebookIcon } from '../assets/icons/facebook.svg'
// import { ReactComponent as AppleIcon } from '../assets/icons/apple.svg'
import { ReactComponent as MicrosoftIcon } from '../assets/icons/microsoft.svg'
import { getConfiguration } from '../config/configuration'
import { useAccountCreation, useMicrosoftLogin } from '../hooks'

import style from './social-auth-buttons.module.css'

import type { User } from '@microsoft/microsoft-graph-types'
import type { AuthError, AuthResponse } from 'msal'

const { googleClientId } = getConfiguration()

function SocialAuthButtons(): JSX.Element {
    const { t } = useTranslation()
    const { socialLogin } = useAccountCreation()
    const [googleLoading, setGoogleLoading] = React.useState(false)

    const microsoftCallback = React.useCallback(
        async function microsoftCallback(
            error: AuthError | null,
            result?: AuthResponse | (AuthResponse & User),
        ) {
            if (result && 'id' in result) {
                const { accessToken, id } = result
                await socialLogin(accessToken, id ?? '', 'Microsoft')
            } else if (error) {
                // noop
            }
        },
        [socialLogin],
    )
    const { login: microsoftLogin } = useMicrosoftLogin({
        clientId: '47acea2d-684f-4ac5-b473-9ffec5c4f23d',
        redirectUri: 'http://localhost:3001/',
        authCallback: microsoftCallback,
        withUserData: true,
    })
    const onGoogleSuccess = React.useCallback(
        async function onSuccess(response: GoogleLoginResponse | GoogleLoginResponseOffline) {
            if ('googleId' in response) {
                setGoogleLoading(true)
                const { accessToken, googleId } = response

                await socialLogin(accessToken, googleId, 'Google')
                setGoogleLoading(false)
            }
        },
        [socialLogin],
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
                disabled={!loaded || googleLoading}
                loading={googleLoading}
                onClick={googleSignIn}
            >
                <>{t('login.socialButtons.loginWithGoogle')}</>
            </Button>
            {/* <Button variant="secondary" startIcon={<FacebookIcon />} size="large">
                Log in with Facebook
            </Button> */}
            <Button
                variant="secondary"
                startIcon={<MicrosoftIcon className={style.microsoft} />}
                size="large"
                onClick={microsoftLogin}
            >
                <>{t('login.socialButtons.loginWithMicrosoft')}</>
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
