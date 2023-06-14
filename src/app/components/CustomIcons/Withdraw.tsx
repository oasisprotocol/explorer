import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const WithdrawIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <rect width="24" height="24" rx="12" fill="#FFF0E4" />
      <g clipPath="url(#clip0_5784_204617)">
        <path
          d="M6.12012 12.1191L7.17762 13.1766L11.3701 8.99164L11.3701 18.1191L12.8701 18.1191L12.8701 8.99164L17.0626 13.1766L18.1201 12.1191L12.1201 6.11914L6.12012 12.1191Z"
          fill="#ED6C02"
        />
      </g>
      <defs>
        <clipPath id="clip0_5784_204617">
          <rect width="18" height="18" fill="white" transform="translate(3.12012 21.1191) rotate(-90)" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
