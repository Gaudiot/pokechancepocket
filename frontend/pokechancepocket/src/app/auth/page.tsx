'use client'

import { useState } from "react"
import LoginComponent from "./components/login_component"
import SignupComponent from "./components/signup_component"
import ForgotPasswordComponent from "./components/forgot_password_component"
import IAuth from "@/core/auth/iauth"
import FirebaseAuth from "@/core/auth/implementations/firebase_auth"

enum AuthPageType {
  Login,
  SignUp,
  ForgotPassword
}

export default function AuthPage() {
  const [authType, setAuthType] = useState(AuthPageType.Login)
  const authProvider: IAuth = new FirebaseAuth()

  const onChangeToSignUp = () => {
    setAuthType(AuthPageType.SignUp)
  }

  const onChangeToLogin = () => {
    setAuthType(AuthPageType.Login)
  }

  const onChangeToForgotPassword = () => {
    setAuthType(AuthPageType.ForgotPassword)
  }

  const displayAlert = (message: string) => {
    alert(message)
  }

  const onLoginClick = async ({email, password}: {email: string, password: string}) => {
    const authResult = await authProvider.emailAndPasswordSignIn({
      email: email,
      password: password
    })

    if (!authResult.success) {
      const errorMessage = authResult.errorMessage ?? "An unknown error occurred"
      displayAlert(`Error logging in: ${errorMessage}`)
      return;
    }

    window.location.href = "/"
  }

  const onSignUpClick = async ({username, email, password, confirmPassword}: {username: string, email: string, password: string, confirmPassword: string}) => {
    if (password !== confirmPassword) {
      console.error("Passwords do not match")
      return
    }

    const authResult = await authProvider.emailAndPasswordSignUp({
      username: username,
      email: email,
      password: password
    })

    if (!authResult.success) {
      const errorMessage = authResult.errorMessage ?? "An unknown error occurred"
      displayAlert(`Error signing up: ${errorMessage}`)
      return;
    }

    window.location.href = "/"
  }

  const onForgotPasswordClick = async ({email}: {email: string}) => {
    const authResult = await authProvider.forgotPassword(email)

    if (!authResult.success) {
      const errorMessage = authResult.errorMessage ?? "An unknown error occurred"
      displayAlert(`Error resetting password: ${errorMessage}`)
      return;
    }

    displayAlert("Password reset email sent! Check your email for a link to reset your password.")
  }

  return (
    <div style={{
        backgroundImage: `url(https://i.imgur.com/eVcYPSa.png)`,
    } } className="min-h-screen flex items-center justify-center">
        {authType === AuthPageType.Login && <LoginComponent onChangeToSignUp={onChangeToSignUp} onLoginClick={onLoginClick} onChangeToForgotPassword={onChangeToForgotPassword} />}
        {authType === AuthPageType.SignUp && <SignupComponent onChangeToLogin={onChangeToLogin} onSignUpClick={onSignUpClick} />}
        {authType === AuthPageType.ForgotPassword && <ForgotPasswordComponent onForgotPasswordClick={onForgotPasswordClick} onChangeToLogin={onChangeToLogin} />}
    </div>
  )
}