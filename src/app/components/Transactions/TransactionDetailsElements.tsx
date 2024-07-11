import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'
import { RoundedBalance } from '../../components/RoundedBalance'
import { AccountLink } from '../Account/AccountLink'

const Label: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Typography color={COLORS.grayDark} sx={{ paddingRight: 4 }}>
      {children}
    </Typography>
  )
}

type FromProps = {
  address: string
  ownAddress?: string
  scope: SearchScope
}

export const From: FC<FromProps> = ({ address, ownAddress, scope }) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'inline-flex' }}>
      <Label>{t('common.from')}</Label>
      <AccountLink labelOnly={address === ownAddress} scope={scope} address={address} alwaysTrim />
    </Box>
  )
}

type ToProps = {
  address: string
  label?: string
  scope: SearchScope
}

export const To: FC<ToProps> = ({ address, label, scope }) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'inline-flex' }}>
      <Label>{label || t('common.to')}</Label>
      <AccountLink scope={scope} address={address} alwaysTrim />
    </Box>
  )
}

type SharesProps = {
  value: string
}

export const Shares: FC<SharesProps> = ({ value }) => {
  const { t } = useTranslation()

  return (
    <Box sx={{ display: 'inline-flex' }}>
      <Label>{t('common.shares')}</Label>
      <Typography fontWeight={700}>
        <RoundedBalance compactLargeNumbers value={value} />
      </Typography>
    </Box>
  )
}
