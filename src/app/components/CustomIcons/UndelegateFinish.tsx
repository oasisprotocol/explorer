import { FC } from 'react'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

export const UndelegateFinishIcon: FC<SvgIconProps> = props => {
  return (
    <SvgIcon {...props}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="20" fill="#E8F5FF" />
        <g clipPath="url(#clip0_7597_54392)">
          <path
            d="M29.4822 31.5H22.2499V24.2677V23.8534L21.957 23.5605L18.9393 20.5429L18.6464 20.25H18.2322H14.9999H13.9999V21.25V23.75V24.75H14.9999H17.7499V31.5H9.74988L9.74988 24.75H12.4999H13.4999V23.75V19.75H15.7322H18.1464L16.4393 18.0429L7.66421 9.26777L8.00985 8.92213L30.7285 31.6408L31.3444 32.2566L30.9987 32.6023L30.1893 31.7929L29.8964 31.5H29.4822ZM21.2499 15.25L20.7017 15.25L15.9999 10.5482V8.5H23.9999V15.25L21.2499 15.25ZM26.4999 19.75V21.0482L25.2017 19.75H26.4999ZM30.2499 24.7982L30.2017 24.75H30.2499V24.7982Z"
            stroke="#6665D8"
            strokeWidth="2"
          />
        </g>
        <defs>
          <clipPath id="clip0_7597_54392">
            <rect width="30" height="30" fill="white" transform="translate(5 5)" />
          </clipPath>
        </defs>
      </svg>
    </SvgIcon>
  )
}
