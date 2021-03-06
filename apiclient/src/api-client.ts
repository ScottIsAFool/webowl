import axios from 'axios'
import dayjs from 'dayjs'

import { hasAuthTokenExpired } from './utils/date-utils'

import type {
    AcceptLeagueInviteRequest,
    AddLeagueRequest,
    AddSeasonRequest,
    AuthEndpoints,
    AuthToken,
    ChangePasswordRequest,
    CheckEmailRequest,
    CheckEmailResponse,
    DeleteLeagueUserRequest,
    GetSeasonsRequest,
    InviteToLeagueRequest,
    LeagueEndpoints,
    LeagueResponse,
    LeaguesResponse,
    LeagueUsersResponse,
    LoginRequest,
    LoginResponse,
    PasswordResetRequest,
    RefreshTokenRequest,
    RegisterRequest,
    ResendVerificationRequest,
    SeasonEndpoints,
    SeasonResponse,
    SeasonsResponse,
    SendPasswordResetRequest,
    SocialAuthRequest,
    UpdateLeagueRequest,
    UpdateRoleRequest,
    UpdateRoleResponse,
    VerifyRequest,
} from '.'
import type { UserEndpoints, UserResponse } from './types/user-types'

export class ApiException extends Error {
    constructor(readonly status: number, readonly messageText: string) {
        super(messageText)

        // Set the prototype explicitly
        Object.setPrototypeOf(this, ApiException.prototype)
    }
}

type ServerError = {
    error: string
    message: string
    statusCode: number
}

type BasePoints = 'auth' | 'user' | 'leagues' | 'seasons'
type RequestType =
    | AuthEndpoints
    | UserEndpoints
    | LeagueEndpoints
    | SeasonEndpoints
    | string
    | number

export class ApiClient {
    constructor(private readonly baseUrl: string, private authToken?: AuthToken) {}

    private get accessToken(): string | undefined {
        return this.authToken?.accessToken
    }

    setAuthToken(token?: AuthToken): void {
        this.authToken = token
    }

    onTokenRefresh?: (authToken: AuthToken) => void

    getAuthenticatedUser(): Promise<UserResponse> {
        return this.get<UserResponse>({ endPoint: this.endpoint('user', ''), requiresAuth: true })
    }

    login(request: LoginRequest): Promise<LoginResponse> {
        return this.post<LoginResponse>({ endPoint: this.endpoint('auth', 'login'), request })
    }

    register(request: RegisterRequest): Promise<LoginResponse> {
        return this.post<LoginResponse>({ endPoint: this.endpoint('auth', 'register'), request })
    }

    verifyEmail(request: VerifyRequest): Promise<void> {
        return this.post<void>({ endPoint: this.endpoint('auth', 'verify-email'), request })
    }

    resendVerification(request: ResendVerificationRequest): Promise<void> {
        return this.post<void>({ endPoint: this.endpoint('auth', 'resend-verification'), request })
    }

    changePassword(request: ChangePasswordRequest): Promise<void> {
        return this.post<void>({ endPoint: this.endpoint('auth', 'change-password'), request })
    }

    requestPasswordReset(request: SendPasswordResetRequest): Promise<void> {
        return this.post<void>({ endPoint: this.endpoint('auth', 'send-password-reset'), request })
    }

    passwordReset(request: PasswordResetRequest): Promise<void> {
        return this.post<void>({ endPoint: this.endpoint('auth', 'password-reset'), request })
    }

    async refreshToken(request: RefreshTokenRequest): Promise<AuthToken> {
        const response = await this.post<AuthToken>({
            endPoint: this.endpoint('auth', 'refresh'),
            request,
        })

        if (this.onTokenRefresh) {
            this.onTokenRefresh(response)
        }

        this.authToken = response

        return response
    }

    logout(): Promise<void> {
        return this.post<void>({ endPoint: this.endpoint('auth', 'logout'), requiresAuth: true })
    }

    socialLogin(request: SocialAuthRequest): Promise<LoginResponse> {
        return this.post<LoginResponse>({ endPoint: this.endpoint('auth', 'social'), request })
    }

    checkEmail(request: CheckEmailRequest): Promise<CheckEmailResponse> {
        return this.post<CheckEmailResponse>({
            endPoint: this.endpoint('auth', 'check-email'),
            request,
        })
    }

    addLeague(request: AddLeagueRequest): Promise<LeagueResponse> {
        return this.post<LeagueResponse>({
            endPoint: this.endpoint('leagues', ''),
            request,
            requiresAuth: true,
        })
    }

    updateLeague(id: number, request: UpdateLeagueRequest): Promise<LeagueResponse> {
        return this.post<LeagueResponse>({
            endPoint: this.endpoint('leagues', id),
            request,
            requiresAuth: true,
        })
    }

    deleteLeague(id: number): Promise<void> {
        return this.delete({ endPoint: this.endpoint('leagues', id), requiresAuth: true })
    }

    getLeagues(): Promise<LeaguesResponse> {
        return this.get<LeaguesResponse>({
            endPoint: this.endpoint('leagues', ''),
            requiresAuth: true,
        })
    }

    getLeagueUsers(id: number): Promise<LeagueUsersResponse> {
        return this.get<LeagueUsersResponse>({
            endPoint: this.endpoint('leagues', `${id}/users`),
            requiresAuth: true,
        })
    }

    sendLeagueInvite(id: number, request: InviteToLeagueRequest): Promise<void> {
        return this.post<void>({
            endPoint: this.endpoint('leagues', `${id}/invite`),
            request,
            requiresAuth: true,
        })
    }

    acceptLeagueInvite(request: AcceptLeagueInviteRequest): Promise<LeagueResponse> {
        return this.post<LeagueResponse>({
            endPoint: this.endpoint('leagues', 'accept-invite'),
            request,
            requiresAuth: true,
        })
    }

    updateLeagueRole(leagueId: number, request: UpdateRoleRequest): Promise<UpdateRoleResponse> {
        return this.post<UpdateRoleResponse>({
            endPoint: this.endpoint('leagues', `${leagueId}/update-role`),
            request,
            requiresAuth: true,
        })
    }

    deleteLeagueUser(leagueId: number, request: DeleteLeagueUserRequest): Promise<void> {
        return this.delete({
            endPoint: this.endpoint('leagues', `${leagueId}/user/${request.userId}`),
            requiresAuth: true,
        })
    }

    getSeasons(request: GetSeasonsRequest): Promise<SeasonsResponse> {
        return this.get<SeasonsResponse>({
            endPoint: this.endpoint('seasons', ''),
            request,
            requiresAuth: true,
        })
    }

    addSeason(request: AddSeasonRequest): Promise<SeasonResponse> {
        return this.post<SeasonResponse>({
            endPoint: this.endpoint('seasons', ''),
            request,
            requiresAuth: true,
        })
    }

    private endpoint(base: BasePoints, request: RequestType): string {
        return `${base}/${request}`
    }

    private async get<T>({
        endPoint,
        request: params,
        requiresAuth,
    }: {
        endPoint: string
        request?: Record<string, unknown>
        requiresAuth?: boolean
    }): Promise<T> {
        if (requiresAuth && !this.authToken?.accessToken) {
            throw new Error('Not signed in')
        } else if (requiresAuth) {
            await this.checkAndUpdateToken(this.authToken)
        }
        const url = new URL(endPoint, this.baseUrl)

        const response = await axios.get<T | ServerError>(url.toString(), {
            headers: {
                'x-requested-with': 'Accept',
                Authorization: requiresAuth && this.accessToken ? `Bearer ${this.accessToken}` : '',
            },
            params,
            validateStatus: () => true,
        })

        const error = response.data as ServerError
        if (response.status >= 400 || (Boolean(error) && 'statusCode' in error)) {
            throw new ApiException(error.statusCode, error.message)
        }

        return response.data as T
    }

    private async post<T>({
        endPoint,
        request,
        requiresAuth,
    }: {
        endPoint: string
        request?: Record<string, unknown>
        requiresAuth?: boolean
    }): Promise<T> {
        if (requiresAuth && !this.authToken?.accessToken) {
            throw new Error('Not signed in')
        } else if (requiresAuth) {
            await this.checkAndUpdateToken(this.authToken)
        }
        const url = new URL(endPoint, this.baseUrl)

        const response = await axios.post<T | ServerError>(url.toString(), request, {
            headers: {
                'x-requested-with': 'Accept',
                Authorization: requiresAuth && this.accessToken ? `Bearer ${this.accessToken}` : '',
            },
            validateStatus: () => true,
        })

        const error = response.data as ServerError
        if (response.status >= 400 || (Boolean(error) && 'statusCode' in error)) {
            throw new ApiException(error.statusCode, error.message)
        }

        return response.data as T
    }

    private async delete<T>({
        endPoint,
        requiresAuth,
    }: {
        endPoint: string
        requiresAuth?: boolean
    }): Promise<T> {
        if (requiresAuth && !this.authToken?.accessToken) {
            throw new Error('Not signed in')
        } else if (requiresAuth) {
            await this.checkAndUpdateToken(this.authToken)
        }
        const url = new URL(endPoint, this.baseUrl)

        const response = await axios.delete<T | ServerError>(url.toString(), {
            headers: {
                'x-requested-with': 'Accept',
                Authorization: requiresAuth && this.accessToken ? `Bearer ${this.accessToken}` : '',
            },
            validateStatus: () => true,
        })

        const error = response.data as ServerError
        if (response.status >= 400 || (Boolean(error) && 'statusCode' in error)) {
            throw new ApiException(error.statusCode, error.message)
        }

        return response.data as T
    }

    private async checkAndUpdateToken(authToken?: AuthToken): Promise<void> {
        if (!authToken) return
        const expiryate = dayjs.unix(authToken.expiresAt)
        if (hasAuthTokenExpired(expiryate.toDate())) {
            await this.refreshToken(authToken)
        }
    }
}
