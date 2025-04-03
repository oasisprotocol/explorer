import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import { COLORS } from '../../../styles/theme/colors'

export const StyledGrid = styled(Grid)(({ theme }) => ({
  display: 'flex',
  gap: 3,
  alignContent: 'center',
  borderBottom: 'solid 1px #F4F5F7',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}))

type GridRowProps = {
  children?: ReactNode
  label: string
  tooltip?: ReactNode
}

export const GridRow: FC<GridRowProps> = ({ label, children, tooltip }) => {
  const { t } = useTranslation()

  return (
    <>
      <StyledGrid item xs={4} md={5}>
        {label}:
        {tooltip && (
          <Tooltip title={tooltip} placement="top">
            <InfoIcon htmlColor={COLORS.brandDark} fontSize="small" />
          </Tooltip>
        )}
      </StyledGrid>
      <StyledGrid item xs={8} md={7}>
        {children ? <strong>{children}</strong> : t('common.missing')}
      </StyledGrid>
    </>
  )
}
