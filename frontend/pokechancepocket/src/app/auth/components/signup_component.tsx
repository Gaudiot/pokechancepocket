import { useState } from 'react';

function SignupSider({onLoginClick}: {onLoginClick: () => void}) {
    const eeveeImageUrl = "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/133.png"
    return (
        <div className="bg-gray-100 flex flex-col items-center justify-center p-12">
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
            <img src={eeveeImageUrl} alt="Eevee" className="w-80" />
            <button className="text-blue-500 mt-4 hover:underline self-start cursor-pointer" onClick={onLoginClick}>Already a member? Click here!</button>
        </div>
    )
}

interface SignupFormProps {
    onSignUpClick: ({username, email, password, confirmPassword}: {username: string, email: string, password: string, confirmPassword: string}) => void
}

function SignupForm({onSignUpClick}: SignupFormProps) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    return (
        <div className="bg-white flex items-center justify-center p-12">
            <div className="flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Join the community!</h1>
                <input 
                    type="text"
                    placeholder="Username"
                    className="p-2 rounded border bg-white min-w-[300px]"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
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
                <input
                    type="password" 
                    placeholder="Confirm Password"
                    className="p-2 rounded border bg-white min-w-[300px]"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <button
                    disabled={password !== confirmPassword}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 cursor-pointer"
                    onClick={() => onSignUpClick({ username, email, password, confirmPassword })}
                >
                    Sign Up
                </button>
            </div>
        </div>
    )
}

interface SignupComponentProps {
    onChangeToLogin: () => void
    onSignUpClick: ({username, email, password, confirmPassword}: {username: string, email: string, password: string, confirmPassword: string}) => void
}

export default function SignupComponent({onChangeToLogin, onSignUpClick}: SignupComponentProps) {
    return (
        <div className="flex flex-row rounded-md overflow-hidden">
            <SignupForm onSignUpClick={onSignUpClick} />
            <SignupSider onLoginClick={onChangeToLogin} />
        </div>
    )
}