import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const DelegateIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#E8F5FF" />
        <g clipPath="url(#clip0_7391_89888)">
          <path
            d="M18.75 32.5L8.75 32.5L8.75 23.75L12.5 23.75L12.5 18.75L18.75 18.75L18.75 16.25L15 16.25L15 7.5L25 7.5L25 16.25L21.25 16.25L21.25 18.75L27.5 18.75L27.5 23.75L31.25 23.75L31.25 32.5L21.25 32.5L21.25 23.75L25 23.75L25 21.25L15 21.25L15 23.75L18.75 23.75L18.75 32.5Z"
            fill="#6665D8"
          />
        </g>
        <defs>
          <clipPath id="clip0_7391_89888">
            <rect width="30" height="30" fill="white" transform="translate(5 5)" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  )
}
