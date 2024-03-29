import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const ContractCallIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <rect width="24" height="24" rx="12" fill="#E8F5FF" />
      <g clipPath="url(#clip0_5784_204611)">
        <path
          d="M18.4276 9.42664L14.8051 5.80414C14.5276 5.52664 14.1451 5.36914 13.7476 5.36914L6.87012 5.36914C6.04512 5.36914 5.37012 6.04414 5.37012 6.86914L5.37012 17.3691C5.37012 18.1941 6.04512 18.8691 6.87012 18.8691H17.3701C18.1951 18.8691 18.8701 18.1941 18.8701 17.3691V10.4916C18.8701 10.0941 18.7126 9.71164 18.4276 9.42664ZM8.37012 8.36914L13.6201 8.36914V9.86914H8.37012V8.36914ZM15.8701 15.8691L8.37012 15.8691V14.3691L15.8701 14.3691V15.8691ZM15.8701 12.8691L8.37012 12.8691L8.37012 11.3691L15.8701 11.3691V12.8691Z"
          fill="#0092F6"
        />
      </g>
      <defs>
        <clipPath id="clip0_5784_204611">
          <rect width="18" height="18" fill="white" transform="translate(3.12012 3.11914)" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
