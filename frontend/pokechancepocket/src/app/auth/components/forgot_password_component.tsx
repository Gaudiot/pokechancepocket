import { useState } from 'react';

function ForgotPasswordSider() {
  const slowpokeImageUrl = 'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/079.png'
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
      <img src={slowpokeImageUrl} alt="Slowpoke" className="w-50" />
    </div>
  )
}

interface ForgotPasswordFormProps {
  onForgotPasswordClick: ({email}: {email: string}) => void
  onChangeToLogin: () => void
}

function ForgotPasswordForm({onForgotPasswordClick, onChangeToLogin}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  return (
      <div className="flex flex-col gap-4">
          <p>Enter your email to reset your password.</p>
          <input 
              type="email"
              placeholder="Email"
              className="p-2 rounded border bg-white min-w-[300px]"
              value={email}
              onChange={e => setEmail(e.target.value)}
          />
          <button
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
              onClick={() => onForgotPasswordClick({ email })}
          >
              Reset Password
          </button>
          <button className="text-blue-500 hover:underline cursor-pointer" onClick={onChangeToLogin}>
              Have an account? Click here!
          </button>
      </div>
  )
}

interface ForgotPasswordComponentProps {
  onForgotPasswordClick: ({email}: {email: string}) => void
  onChangeToLogin: () => void
}

export default function ForgotPasswordComponent({onForgotPasswordClick, onChangeToLogin}: ForgotPasswordComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-12 rounded-md">
      <ForgotPasswordSider />
      <ForgotPasswordForm onForgotPasswordClick={onForgotPasswordClick} onChangeToLogin={onChangeToLogin} />
    </div>
  )
}