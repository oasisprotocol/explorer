import { styled } from '@mui/material/styles'
import { FC, memo } from 'react'

export enum ArrowDirection {
  UP,
  DOWN
}

interface ArrowProps {
  arrowDirection?: ArrowDirection
}


const ArrowSvgIcon = styled('svg')<ArrowProps>(({ arrowDirection }) => ({
  ...(arrowDirection === ArrowDirection.DOWN ? {
    transform: 'rotate(180deg)',
  } : {}),
}))

const ArrowIcon: FC<ArrowProps> = ({ arrowDirection = ArrowDirection.UP }) => {
  return (
    <ArrowSvgIcon arrowDirection={arrowDirection} width='8' height='13' viewBox='0 0 8 13' fill='none'
                  xmlns='http://www.w3.org/2000/svg'>
      <path d='M0.90918 3.95833L3.76827 1.125M3.76827 1.125L6.62736 3.95833M3.76827 1.125V11.875' stroke='currentColor'
            strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
    </ArrowSvgIcon>
  )
}

export default memo(ArrowIcon)
