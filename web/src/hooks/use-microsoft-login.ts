import * as React from 'react'
import { AuthResponse, AuthError, UserAgentApplication } from 'msal'
import type { User } from '@microsoft/microsoft-graph-types'

type MicrosoftLoginPrompt = 'login' | 'select_account' | 'consent' | 'none'
type MicrosoftLoginProps = {
    /**
     * Application (client) ID
     */
    clientId: string

    /**
     * Callback function which takes two arguments (error, authData)
     */
    authCallback: (
        error: AuthError | null,
        result?: AuthResponse | (AuthResponse & User),
        instance?: UserAgentApplication,
    ) => void

    /**
     * Array of Graph API permission names.
     */
    graphScopes?: string[]

    /**
     * A URL indicating a directory that MSAL can request tokens from.
     * In Azure AD, it is of the form https://<instance>/<tenant>>, where <instance> is the directory host
     * (e.g. https://login.microsoftonline.com) and <tenant> is an identifier within the directory itself
     * (e.g. a domain associated to the tenant, such as contoso.onmicrosoft.com,
     * or the GUID representing the TenantID property of the directory)
     * In Azure AD B2C, it is of the form https://<instance>/tfp/<tenantId>/<policyName>/
     */
    tenantUrl?: string

    /**
     * You can configure the URI to which it should redirect after sign-out by setting postLogoutRedirectUri.
     * This URI should also be registered as the logout URI in your application registration.
     */
    postLogoutRedirectUri?: string

    /**
     * Make an additional request to GraphAPI to get user data.
     */
    withUserData?: boolean

    /**
     * Enable detailed logs of authorization process.
     */
    debug?: boolean

    /**
     * Additional class name string.
     */
    className?: string

    /**
     * Prompt behavior for interactive requests
     * https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-prompt-behavior
     */
    prompt?: MicrosoftLoginPrompt

    /**
     * Force redirect login strategy. This strategy used by default on IE browsers to avoid issues.
     * If set true login will be executed only with redirect strategy in all browsers.
     */
    forceRedirectStrategy?: boolean

    /**
     * The redirect URI of the application, this should be same as the value in the application registration portal.
     */
    redirectUri?: string
}

const CLIENT_ID_REGEX = /[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}/

function getScopes(graphScopes?: string[]) {
    const scopes = graphScopes || []
    if (!scopes.find((el: string) => el.toLowerCase() === 'user.read')) {
        scopes.push('user.read')
    }
    return scopes
}

function getUserAgentApp({
    clientId,
    tenantUrl,
    redirectUri,
    postLogoutRedirectUri,
}: {
    clientId: string
    tenantUrl?: string
    redirectUri?: string
    postLogoutRedirectUri?: string
}) {
    if (clientId && CLIENT_ID_REGEX.test(clientId)) {
        return new UserAgentApplication({
            auth: {
                ...(redirectUri && { redirectUri }),
                ...(tenantUrl && { authority: tenantUrl }),
                ...(postLogoutRedirectUri && { postLogoutRedirectUri }),

                clientId,
                validateAuthority: true,
                navigateToLoginRequestUrl: false,
            },
        })
    }

    return undefined
}

export function useMicrosoftLogin({
    graphScopes,
    clientId,
    tenantUrl,
    redirectUri,
    postLogoutRedirectUri,
    withUserData = false,
    authCallback,
    forceRedirectStrategy = false,
    prompt,
}: MicrosoftLoginProps): {
    login: () => void
} {
    const msalInstance = getUserAgentApp({
        clientId,
        tenantUrl,
        redirectUri,
        postLogoutRedirectUri,
    })
    const scopes = getScopes(graphScopes)
    if (!msalInstance) {
        throw new Error('msalinstance')
    }

    const getUserData = React.useCallback(
        async function getUserData(authResponseWithAccessToken: AuthResponse) {
            const { accessToken } = authResponseWithAccessToken
            const options = {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
            const response = await fetch('https://graph.microsoft.com/v1.0/me', options)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const userData = (await response.json()) as { accessToken: string; id: string }
            authCallback(
                null,
                {
                    ...userData,
                    ...authResponseWithAccessToken,
                },
                msalInstance,
            )
        },
        [authCallback, msalInstance],
    )

    const finalStep = React.useCallback(
        function finalStep(authResponseWithAccessToken: AuthResponse) {
            if (withUserData) {
                getUserData(authResponseWithAccessToken).finally(() => {
                    //noop
                })
            } else {
                authCallback(null, authResponseWithAccessToken, msalInstance)
            }
        },
        [authCallback, getUserData, msalInstance, withUserData],
    )

    const getGraphAPITokenAndUser = React.useCallback(
        async function getGraphAPITokenAndUser(isRedirect?: boolean) {
            try {
                try {
                    const silentRes = await msalInstance.acquireTokenSilent({ scopes })
                    finalStep(silentRes)
                } catch (err: unknown) {
                    if (isRedirect) {
                        msalInstance.acquireTokenRedirect({ scopes })
                    } else {
                        const popupRes = await msalInstance.acquireTokenPopup({ scopes })
                        finalStep(popupRes)
                    }
                }
            } catch (error: unknown) {
                authCallback(error as AuthError | null)
            }
        },
        [authCallback, finalStep, msalInstance, scopes],
    )

    React.useEffect(() => {
        msalInstance.handleRedirectCallback((_error: AuthError, _authResponse?: AuthResponse) => {
            getGraphAPITokenAndUser(true).finally(() => {
                // noop
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function login() {
        if (forceRedirectStrategy) {
            redirectLogin()
        } else {
            popupLogin().finally(() => {
                //noop
            })
        }
    }

    async function popupLogin() {
        try {
            if (!msalInstance) return
            await msalInstance.loginPopup({ scopes, prompt })
            getGraphAPITokenAndUser().finally(() => {
                //noop
            })
        } catch (err: unknown) {
            authCallback(err as AuthError | null)
        }
    }

    function redirectLogin() {
        if (!msalInstance) return
        msalInstance.loginRedirect({ scopes, prompt })
    }

    return { login }
}
