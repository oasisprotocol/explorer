import { styled, css } from '@mui/material/styles'
import { FC, memo } from 'react'
import { ArrowDirection } from './types'

interface ChevronProps {
  arrowDirection?: ArrowDirection
}

const ChevronSvgIcon = styled('svg')<ChevronProps>(
  ({ arrowDirection }) => css`
    ${arrowDirection === ArrowDirection.UP && `transform: rotate(90deg)`}
    ${arrowDirection === ArrowDirection.DOWN && `transform: rotate(-90deg)`}
    ${arrowDirection === ArrowDirection.RIGHT && `transform: rotate(180deg)`}
  `,
)

const ChevronIcon: FC<ChevronProps> = ({ arrowDirection = ArrowDirection.UP }) => {
  return (
    <ChevronSvgIcon
      arrowDirection={arrowDirection}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.30309 11.2929L13.896 6.7C14.2826 6.3134 14.9094 6.3134 15.296 6.7C15.6826 7.0866 15.6826 7.7134 15.296 8.1L11.396 12L15.296 15.9C15.6826 16.2866 15.6826 16.9134 15.296 17.3C14.9094 17.6866 14.2826 17.6866 13.896 17.3L9.30309 12.7071C8.91257 12.3166 8.91257 11.6834 9.30309 11.2929Z"
        fill="currentColor"
      />
      <mask
        id="mask0_1369_48663"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="9"
        y="6"
        width="7"
        height="12"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.30309 11.2929L13.896 6.7C14.2826 6.3134 14.9094 6.3134 15.296 6.7C15.6826 7.0866 15.6826 7.7134 15.296 8.1L11.396 12L15.296 15.9C15.6826 16.2866 15.6826 16.9134 15.296 17.3C14.9094 17.6866 14.2826 17.6866 13.896 17.3L9.30309 12.7071C8.91257 12.3166 8.91257 11.6834 9.30309 11.2929Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_1369_48663)">
        <path fillRule="evenodd" clipRule="evenodd" d="M0 0L0 24L24 24L24 0L0 0Z" fill="currentColor" />
      </g>
    </ChevronSvgIcon>
  )
}

export default memo(ChevronIcon)
