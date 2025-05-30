import { Auth, getAuth, updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser, AuthError, sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";
import IAuth, { AuthForgotPasswordResult, AuthSignInResult, AuthSignUpResult, EmailAndPasswordSignInParams, EmailAndPasswordSignUpParams,  } from "../iauth";
import { firebaseApp } from "@/base/firebase/firebase";

enum FirebaseAuthError {
    EMAIL_ALREADY_IN_USE = "auth/email-already-in-use",
    INVALID_EMAIL = "auth/invalid-email",
    OPERATION_NOT_ALLOWED = "auth/operation-not-allowed",
    WEAK_PASSWORD = "auth/weak-password",
    USER_NOT_FOUND = "auth/user-not-found",
    WRONG_PASSWORD = "auth/wrong-password",
    INVALID_ACTION_CODE = "auth/invalid-action-code",
    EXPIRED_ACTION_CODE = "auth/expired-action-code",
    USER_DISABLED = "auth/user-disabled",
    NETWORK_REQUEST_FAILED = "auth/network-request-failed",
    INTERNAL_ERROR = "auth/internal-error",
    INVALID_CREDENTIALS = "auth/invalid-credential"
}

export default class FirebaseAuth implements IAuth {
    private auth: Auth;

    constructor() {
        this.auth = getAuth(firebaseApp);
    }

    private getFirebaseAuthErrorMessage(firebaseError: AuthError): string {
        let errorMessage = "An unknown error occurred"
        switch (firebaseError.code) {
            case FirebaseAuthError.EMAIL_ALREADY_IN_USE:
                errorMessage = "Email already in use"
                break;
            case FirebaseAuthError.INVALID_EMAIL:
                errorMessage = "Invalid email"
                break;
            case FirebaseAuthError.OPERATION_NOT_ALLOWED:
                errorMessage = "Operation not allowed"
                break;
            case FirebaseAuthError.WEAK_PASSWORD:
                errorMessage = "Weak password"
                break;
            case FirebaseAuthError.USER_NOT_FOUND:
                errorMessage = "User not found"
                break;
            case FirebaseAuthError.WRONG_PASSWORD:
                errorMessage = "Wrong password"
                break;
            case FirebaseAuthError.INVALID_ACTION_CODE:
                errorMessage = "Invalid action code"
                break;
            case FirebaseAuthError.EXPIRED_ACTION_CODE:
                errorMessage = "Expired action code"
                break;
            case FirebaseAuthError.USER_DISABLED:
                errorMessage = "User disabled"
                break;
            case FirebaseAuthError.NETWORK_REQUEST_FAILED:
                errorMessage = "Network request failed"
                break;
            case FirebaseAuthError.INTERNAL_ERROR:
                errorMessage = "Internal error"
                break;
            case FirebaseAuthError.INVALID_CREDENTIALS:
                errorMessage = "Invalid credentials"
                break;
            default:
                errorMessage = firebaseError.message
                break;
        }
        return errorMessage
    }

    async emailAndPasswordSignIn({email, password}: EmailAndPasswordSignInParams): Promise<AuthSignInResult> {
        try{
            await signInWithEmailAndPassword(this.auth, email, password)

            const token = await this.auth.currentUser!.getIdToken()
            localStorage.setItem('token', token)

            return {
                success: true,
            }
        }catch (error){
            const firebaseError = error as AuthError
            const errorMessage = this.getFirebaseAuthErrorMessage(firebaseError)
            return {
                success: false,
                errorMessage: errorMessage
            }
        }
    }

    async emailAndPasswordSignUp({username, email, password}: EmailAndPasswordSignUpParams): Promise<AuthSignUpResult> {
        try{
            const {user} = await createUserWithEmailAndPassword(this.auth, email, password)
            await updateProfile(user, {
                displayName: username
            });

            return {
                success: true,
            }
        }catch (error: any) {
            const firebaseError = error as AuthError

            let errorMessage = this.getFirebaseAuthErrorMessage(firebaseError)
            return {
                success: false,
                errorMessage: errorMessage
            }
        }
    }

    async forgotPassword(email: string): Promise<AuthForgotPasswordResult> {
        try {
            await sendPasswordResetEmail(this.auth, email)
            return {
                success: true,
            }
        } catch (error) {
            const firebaseError = error as AuthError
            const errorMessage = this.getFirebaseAuthErrorMessage(firebaseError)
            return {
                success: false,
                errorMessage: errorMessage
            }
        }
    }

    async confirmPasswordReset(code: string, newPassword: string): Promise<void> {
        // TODO: At the moment, this is not necessary since firebase
        // has its own way to handle confirmation of password reset
        // but it's good to have it here for future reference
    }

    async deleteAccount(): Promise<void> {
        const user = this.auth.currentUser
        if (!user) {
            return
        }
        await deleteUser(user)
    }

    isUserLoggedIn(): boolean {
        return this.auth.currentUser !== null
    }

    signOut(): Promise<void> {
        localStorage.removeItem('token')
        return this.auth.signOut()
    }
}