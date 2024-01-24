import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'
import { FC } from 'react'
import { COLORS } from 'styles/theme/colors'

const badgeSize = '27px'

export const StyledBox = styled(Box)(() => ({
  background: 'linear-gradient(88deg, #9747FF 1.71%, #3332CB 79.56%)',
  border: `2px solid ${COLORS.brandExtraDark}`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: badgeSize,
  minWidth: badgeSize,
  height: badgeSize,
  borderRadius: badgeSize,
  color: COLORS.white,
  fontSize: '10px',
  fontWeight: 700,
}))

type AccountSizeBadgeProps = {
  size: string
}

export const AccountSizeBadge: FC<AccountSizeBadgeProps> = ({ size }) => {
  const { t } = useTranslation()

  return (
    <Tooltip arrow placement="top" title={t('account.sizeTooltip', { size })}>
      <StyledBox>{size}</StyledBox>
    </Tooltip>
  )
}
