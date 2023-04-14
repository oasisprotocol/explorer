import { FC } from 'react'
import { COLORS } from '../../../styles/theme/colors'

interface BlockchainIconProps {
  selected?: boolean
}

export const BlockchainIcon: FC<BlockchainIconProps> = ({ selected = false }) => {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle
        cx="32"
        cy="32"
        r="31"
        fill={selected ? COLORS.brandExtraDark : COLORS.white}
        stroke={COLORS.brandExtraDark}
        strokeWidth="2"
      />
      <g clipPath="url(#clip0_2255_140498)">
        <path
          d="M46.6663 23.75V40.25L39.333 44.375L31.9997 48.5L24.6663 44.375L17.333 40.25V23.75L24.6663 19.625L31.9997 15.5L39.333 19.625L46.6663 23.75Z"
          stroke={selected ? COLORS.white : COLORS.brandExtraDark}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 32L39.3333 27.875L46.6667 23.75"
          stroke={selected ? COLORS.white : COLORS.brandExtraDark}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M32 32V48.5"
          stroke={selected ? COLORS.white : COLORS.brandExtraDark}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31.9997 32L24.6663 27.875L17.333 23.75"
          stroke={selected ? COLORS.white : COLORS.brandExtraDark}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M46.6663 32L39.333 35.6667V44.375"
          stroke={selected ? COLORS.white : COLORS.brandExtraDark}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.333 32L24.6663 35.6667V44.375"
          stroke={selected ? COLORS.white : COLORS.brandExtraDark}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24.667 19.625L32.0003 23.75L39.3337 19.625"
          stroke={selected ? COLORS.white : COLORS.brandExtraDark}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_2255_140498">
          <rect width="44" height="44" fill="white" transform="translate(10 10)" />
        </clipPath>
      </defs>
    </svg>
  )
}
