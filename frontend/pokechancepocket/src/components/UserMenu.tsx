'use client'

import IAuth from '@/core/auth/iauth'
import FirebaseAuth from '@/core/auth/implementations/firebase_auth'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import { useEffect, useState } from 'react'

export default function UserMenu() {
  const authProvider: IAuth = new FirebaseAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(authProvider.isUserLoggedIn())
    console.log("isLoggedIn", authProvider.isUserLoggedIn())
  }, [authProvider.isUserLoggedIn()])

  const onOpenProfile = () => {
    window.location.href = '/auth'
  }

  return (
    <button onClick={onOpenProfile}>
      {isLoggedIn ? (
        <img 
          src="https://i.ibb.co/QjckJ4mx/red-pkm.jpg"
          className="w-12 h-12 mr-8 cursor-pointer rounded-full border border-black"
          alt="User profile"
        />
      ) : (
        <UserCircleIcon className="w-12 h-12 mr-8 cursor-pointer" />
      )}
    </button>
  )
}