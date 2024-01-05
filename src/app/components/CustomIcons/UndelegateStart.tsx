import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const UndelegateStartIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#E8F5FF" />
        <g clipPath="url(#clip0_7489_49493)">
          <path
            d="M12.5 18.75L12.5 21.2L27.5 21.2L27.5 18.75L21.25 18.75L21.25 16.25L25 16.25L25 7.5L15 7.5L15 16.25L18.75 16.25L18.75 18.75L12.5 18.75Z"
            fill="#6665D8"
          />
          <path
            d="M13 23.75L13 24.25L12.5 24.25L9.25 24.25L9.25 32L18.25 32L18.25 24.25L15 24.25L14.5 24.25L14.5 23.75L14.5 21.25L14.5 20.75L15 20.75L25 20.75L25.5 20.75L25.5 21.25L25.5 23.75L25.5 24.25L25 24.25L21.75 24.25L21.75 32L30.75 32L30.75 24.25L27.5 24.25L27 24.25L27 23.75L27 19.25L21.25 19.25L18.75 19.25L13 19.25L13 23.75Z"
            stroke="#6665D8"
          />
        </g>
        <defs>
          <clipPath id="clip0_7489_49493">
            <rect width="30" height="30" fill="white" transform="translate(5 5)" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  )
}
