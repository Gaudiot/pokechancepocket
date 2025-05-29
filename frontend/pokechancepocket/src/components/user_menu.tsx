'use client'

import { useEffect, useState, useRef } from 'react'
import { useIsUserLoggedIn } from '@/core/auth/hooks/logged_in_hook'
import FirebaseAuth from '@/core/auth/implementations/firebase_auth'
import { UserCircleIcon } from '@heroicons/react/24/solid'

interface UserMenuDropdownProps {
  onLogout: () => void
  isOpen: boolean
}

function UserMenuDropdown({ onLogout, isOpen }: UserMenuDropdownProps) {
  if (!isOpen) return null

  return (
    <div className="absolute right-8 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1">
        <button
          onClick={onLogout}
          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sair
        </button>
      </div>
    </div>
  )
}

export default function UserMenu() {
  const authProvider = new FirebaseAuth()
  const isLoggedIn = useIsUserLoggedIn()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const onOpenProfile = () => {
    window.location.href = '/auth'
  }

  const handleLogout = async () => {
    await authProvider.signOut()
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(!isDropdownOpen)
    } else {
      onOpenProfile()
    }
  }

  return (
    <div ref={menuRef} className="relative">
      <button onClick={toggleDropdown}>
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
      <UserMenuDropdown onLogout={handleLogout} isOpen={isDropdownOpen} />
    </div>
  )
}