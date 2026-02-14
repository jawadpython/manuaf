'use client'

import Link from 'next/link'
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'

type BaseProps = {
  variant?: 'primary' | 'grey' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  className?: string
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: never
  }

type ButtonAsLink = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsLink

const variants = {
  primary:
    'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] border-transparent',
  grey:
    'bg-[var(--grey)] text-white hover:bg-[var(--grey)]/90 border-transparent',
  outline:
    'border-2 border-white text-white hover:bg-white hover:text-[var(--grey)]',
  ghost: 'text-[var(--grey)] hover:text-[var(--accent)] hover:bg-gray-50',
}

const sizes = {
  sm: 'px-5 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-3 text-base',
  xl: 'px-10 py-4 text-lg sm:px-12 sm:py-5 sm:text-xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-medium transition-all duration-300 ease-out'

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`

  if ('href' in props && props.href) {
    const { href, ...rest } = props
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  )
}
