import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Grid'

export const StyledGrid = styled(Grid)(({ theme }) => ({
  borderBottom: 'solid 1px #F4F5F7',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
}))

type GridRowProps = {
  children?: ReactNode
  label: string
}

export const GridRow: FC<GridRowProps> = ({ label, children }) => {
  const { t } = useTranslation()

  return (
    <>
      <StyledGrid item xs={12} md={5}>
        {label}:
      </StyledGrid>
      <StyledGrid item xs={12} md={7}>
        {children ? <strong>{children}</strong> : t('common.missing')}
      </StyledGrid>
    </>
  )
}
