import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const UndelegateIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <defs>
        <clipPath id="clippath">
          <rect fill="none" x="4.2" y="4.2" width="15.6" height="15.6" />
        </clipPath>
      </defs>
      <circle fill="#E8F6FF" cx="12" cy="12" r="12" />
      <g clipPath="url(#clippath)">
        <g>
          <path
            fill="#6665D8"
            d="M7.05,6.83l-.22-.22-.76,.76,4.09,4.09h-1.39v2.16h-1.62v3.77h4.31v-3.77h-1.62v-1.08h1.39l1.3,1.3v3.55h3.55l.65,.65,.76-.76-.57-.57h0S7.05,6.83,7.05,6.83h0Z"
          />
          <path fill="#6665D8" d="M16.85,15.11v-1.49h-1.49l1.49,1.49Z" />
          <path fill="#6665D8" d="M15.23,13.49v-2.03h-2.03l2.03,2.03Z" />
          <path fill="#6665D8" d="M12.54,10.8v-.42h1.62v-3.77h-4.31v1.49l2.7,2.7Z" />
        </g>
      </g>
    </SvgIcon>
  )
}
