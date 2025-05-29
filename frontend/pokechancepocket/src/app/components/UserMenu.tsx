'use client'

import { UserCircleIcon } from '@heroicons/react/24/solid'

export default function UserMenu() {

  const onOpenProfile = () => {
    window.location.href = '/auth'
  }

  return (
    <button onClick={onOpenProfile}>
      <UserCircleIcon className="w-12 h-12 mr-8 cursor-pointer" />
    </button>
  )
} 