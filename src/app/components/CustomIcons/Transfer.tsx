import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const TransferIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <rect x="0.5" y="0.5" width="24" height="24" rx="12" fill="#E8FAF3" />
      <g clipPath="url(#clip0_5784_204605)">
        <path
          d="M12.1152 6.36523L11.1018 7.37867L15.1124 11.3965H6.36523V12.834H15.1124L11.1018 16.8518L12.1152 17.8652L17.8652 12.1152L12.1152 6.36523Z"
          fill="#4CD4A9"
        />
      </g>
      <defs>
        <clipPath id="clip0_5784_204605">
          <rect width="17.25" height="17.25" fill="white" transform="translate(3.49023 3.49023)" />
        </clipPath>
      </defs>
    </SvgIcon>
  )
}
