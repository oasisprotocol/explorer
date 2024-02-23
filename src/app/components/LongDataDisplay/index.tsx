import { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

const StyledButton = styled(Button)(({ theme }) => ({
  color: COLORS.brandDark,
  fontWeight: 700,
  minWidth: 'auto',
  height: 'auto',
  padding: 0,
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(3, 0, 0, 0),
  },
  [theme.breakpoints.up('sm')]: {
    margin: theme.spacing(4, 0, 0, 0),
  },
  '&&:hover, &&:active, &&:focus-visible': {
    color: COLORS.brandDark,
    textDecoration: 'none',
    borderRadius: 0,
  },
}))

const lineHeight = 22

export const LongDataDisplay: FC<{ data: string; fontWeight?: number; collapsedLinesNumber?: number }> = ({
  data,
  fontWeight = 700,
  collapsedLinesNumber = 2,
}) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef<HTMLDivElement | null>(null)
  const collapsedContainerMaxHeight = collapsedLinesNumber * lineHeight

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isOverflow = textRef.current.scrollHeight > textRef.current.clientHeight
        setIsOverflowing(isOverflow)
      }
    }

    checkOverflow()
    const handleResize = () => {
      checkOverflow()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [data])

  return (
    <div>
      <Typography
        variant="mono"
        ref={textRef}
        sx={{
          fontWeight,
          maxHeight: isExpanded ? 'none' : collapsedContainerMaxHeight,
          overflow: 'hidden',
          lineHeight: `${lineHeight}px`,
          overflowWrap: 'anywhere',
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? 'none' : collapsedLinesNumber,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {data}
      </Typography>
      {(isOverflowing || isExpanded) && (
        <StyledButton onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? t('common.hide') : t('common.show')}
        </StyledButton>
      )}
    </div>
  )
}
