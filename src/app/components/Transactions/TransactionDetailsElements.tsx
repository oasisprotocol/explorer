import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'
import { tooltipDelay } from '../../../styles/theme'
import { RoundedBalance } from '../../components/RoundedBalance'
import { trimLongString } from '../../utils/trimLongString'
import { useScreenSize } from '../../hooks/useScreensize'
import { AccountLink } from '../Account/AccountLink'
import { ValidatorLink } from '../Validators/ValidatorLink'

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

  if (!address) {
    return null
  }

  return (
    <Box sx={{ display: 'inline-flex' }}>
      <Label>{t('common.from')}</Label>
      <AccountLink labelOnly={address === ownAddress} scope={scope} address={address} alwaysTrim />
    </Box>
  )
}

type ToProps = {
  address: string | undefined
  label?: string
  ownAddress?: string
  scope: SearchScope
  type?: 'account' | 'validator'
}

export const To: FC<ToProps> = ({ address, label, ownAddress, scope, type = 'account' }) => {
  const { t } = useTranslation()

  if (!address) {
    return null
  }

  return (
    <Box sx={{ display: 'inline-flex' }}>
      <Label>{label || t('common.to')}</Label>
      {type === 'account' && (
        <AccountLink labelOnly={address === ownAddress} scope={scope} address={address} alwaysTrim />
      )}
      {type === 'validator' && <ValidatorLink network={scope.network} address={address} alwaysTrim />}
    </Box>
  )
}

type SharesProps = {
  value: string
}

export const Shares: FC<SharesProps> = ({ value }) => {
  const { t } = useTranslation()

  if (!value) {
    return null
  }

  return (
    <Box sx={{ display: 'inline-flex' }}>
      <Label>{t('common.shares')}</Label>
      <Typography fontWeight={700}>
        <RoundedBalance compactLargeNumbers value={value} />
      </Typography>
    </Box>
  )
}

type LabelValueProps = {
  label?: string
  trimMobile?: boolean
  value: string
}

export const LabelValue: FC<LabelValueProps> = ({ label, trimMobile, value }) => {
  const { t } = useTranslation()
  const { isTablet } = useScreenSize()
  const trimEnabled = trimMobile && isTablet

  return (
    <Box sx={{ display: 'inline-flex' }}>
      <Label>{label || t('common.amount')}</Label>
      {trimEnabled ? (
        <Tooltip arrow placement="top" title={value} enterDelay={tooltipDelay} enterNextDelay={tooltipDelay}>
          <Typography variant="mono">{trimLongString(value, 2, 18)}</Typography>
        </Tooltip>
      ) : (
        <Typography variant="mono">{value}</Typography>
      )}
    </Box>
  )
}
