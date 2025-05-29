import { useState } from 'react';

function LoginSider({onSignUpClick}: {onSignUpClick: () => void}){
    const pikachuImageUrl = "https://pngimg.com/uploads/pokemon/pokemon_PNG78.png"
    return (
        <div className="bg-gray-100 flex flex-col items-center justify-center p-12">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <img src={pikachuImageUrl} alt="Pikachu" className="w-80" />
            <button className="text-blue-500 mt-4 hover:underline self-start cursor-pointer" onClick={onSignUpClick}>Not a member yet? Click here!</button>
        </div>
    )
}

interface LoginFormProps {
    onForgotPasswordClick: () => void
    onLoginClick: ({email, password}: {email: string, password: string}) => void
}

function LoginForm({onForgotPasswordClick, onLoginClick}: LoginFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div className="bg-white flex items-center justify-center p-12">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Login</h1>
                <input 
                    type="email"
                    placeholder="Email"
                    className="p-2 rounded border bg-white min-w-[300px]"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type="password" 
                    placeholder="Password"
                    className="p-2 rounded border bg-white min-w-[300px]"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
                    onClick={() => onLoginClick({ email, password })}
                >
                    Log In
                </button>
                <button className="text-blue-500 hover:underline cursor-pointer" onClick={onForgotPasswordClick}>
                    Forgot Password?
                </button>
            </div>
        </div>
    )
}

interface LoginComponentProps {
    onLoginClick: ({email, password}: {email: string, password: string}) => void
    onChangeToSignUp: () => void
    onChangeToForgotPassword: () => void
}

export default function LoginComponent({onLoginClick, onChangeToSignUp, onChangeToForgotPassword}: LoginComponentProps) {
    return (
        <div className="flex flex-row rounded-md overflow-hidden">
            <LoginSider onSignUpClick={onChangeToSignUp} />
            <LoginForm onForgotPasswordClick={onChangeToForgotPassword} onLoginClick={onLoginClick} />
        </div>
    )
}