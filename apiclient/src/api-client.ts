import axios from 'axios'
import type {
    AuthEndpoints,
    ChangePasswordRequest,
    LoginRequest,
    LoginResponse,
    SendPasswordResetRequest,
    RegisterRequest,
    ResendVerificationRequest,
    VerifyRequest,
    PasswordResetRequest,
    RefreshTokenRequest,
    AuthToken,
} from '.'

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

type BasePoints = 'auth'
type RequestType = AuthEndpoints

export class ApiClient {
    constructor(private readonly baseUrl: string, private readonly authToken?: AuthToken) {}

    private get accessToken(): string | undefined {
        return this.authToken?.accessToken
    }

    login(request: LoginRequest): Promise<LoginResponse> {
        return this.post<LoginResponse>({ endPoint: this.endpoint('auth', 'login'), request })
    }

    register(request: RegisterRequest): Promise<void> {
        return this.post<void>({ endPoint: this.endpoint('auth', 'register'), request })
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

    sendPasswordReset(request: SendPasswordResetRequest): Promise<void> {
        return this.post<void>({ endPoint: this.endpoint('auth', 'send-password-reset'), request })
    }

    passwordReset(request: PasswordResetRequest): Promise<void> {
        return this.post<void>({ endPoint: this.endpoint('auth', 'password-reset'), request })
    }

    refreshToken(request: RefreshTokenRequest): Promise<AuthToken> {
        return this.post<AuthToken>({
            endPoint: this.endpoint('auth', 'refresh'),
            request,
            requiresAuth: true,
        })
    }

    logout(): Promise<void> {
        return this.post<void>({ endPoint: this.endpoint('auth', 'logout'), requiresAuth: true })
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
        if (requiresAuth && !this.accessToken) {
            throw new Error('Not signed in')
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
        if (requiresAuth && !this.accessToken) {
            throw new Error('Not signed in')
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
        if (requiresAuth && !this.accessToken) {
            throw new Error('Not signed in')
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
}
