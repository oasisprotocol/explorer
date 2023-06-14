import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const ContractCreationIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <rect width="24" height="24" rx="12" fill="#E8F5FF" />
      <g clipPath="url(#clip0_5784_204609)">
        <path
          d="M15.3604 3.86914L6.36035 3.86914C5.53535 3.86914 4.86035 4.54414 4.86035 5.36914L4.86035 15.8691H6.36035L6.36035 5.36914L15.3604 5.36914V3.86914ZM14.6104 6.86914L19.1104 11.3691V18.8691C19.1104 19.6941 18.4354 20.3691 17.6104 20.3691L9.35285 20.3691C8.52785 20.3691 7.86035 19.6941 7.86035 18.8691L7.86785 8.36914C7.86785 7.54414 8.53535 6.86914 9.36035 6.86914L14.6104 6.86914ZM13.8604 12.1191H17.9854L13.8604 7.99414L13.8604 12.1191Z"
          fill="#0092F6"
        />
      </g>
      <defs>
        <clipPath id="clip0_5784_204609">
          <rect width="18" height="18" fill="white" transform="translate(3.36035 3.11914)" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
