'use client'

import pokechancetitle from '@/assets/pokechance_title.png'
import UserMenu from '@/components/user_menu'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  hideUserMenu?: boolean
}

export default function Header({ hideUserMenu = false }: HeaderProps) {
  const pathname = usePathname()

  const handleLogoClick = () => {
    if (pathname !== '/') {
      window.location.href = '/'
    }
  }

  return (
    <div className="flex justify-between items-center w-full">
      <img 
        src={pokechancetitle.src} 
        alt="PokeChance Pocket" 
        className="w-auto h-auto cursor-pointer" 
        style={{ width: '500px' }}
        onClick={handleLogoClick}
      />
      {!hideUserMenu && <UserMenu />}
    </div>
  )
}
