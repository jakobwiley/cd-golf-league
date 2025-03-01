'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navigation = [
  { name: 'Matches', href: '/matches' },
  { name: 'Teams', href: '/teams' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'Standings', href: '/standings' },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <div className="bg-masters-green">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-augusta-gold text-xl font-semibold">
                Country Drive Golf League
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      pathname === item.href
                        ? 'bg-masters-green-dark text-white'
                        : 'text-augusta-gold hover:bg-masters-green-dark hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 