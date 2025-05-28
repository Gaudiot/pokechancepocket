export interface EmailAndPasswordSignInParams {
    email: string,
    password: string,
}

export interface AuthSignInResult {
    success: boolean,
    errorMessage?: string,
}

export interface EmailAndPasswordSignUpParams {
    username: string
    email: string,
    password: string,
}

export interface AuthSignUpResult {
    success: boolean,
    errorMessage?: string,
}

export interface AuthForgotPasswordResult {
    success: boolean,
    errorMessage?: string,
}

export default interface IAuth {
    emailAndPasswordSignIn(params: EmailAndPasswordSignInParams): Promise<AuthSignInResult>;
    emailAndPasswordSignUp(params: EmailAndPasswordSignUpParams): Promise<AuthSignUpResult>;
    forgotPassword(email: string): Promise<AuthForgotPasswordResult>;
    deleteAccount(): Promise<void>;
    isUserLoggedIn(): boolean;
    signOut(): Promise<void>;
}