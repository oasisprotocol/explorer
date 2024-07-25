import { FC, PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { getNameForScopeByRuntimeId, SearchScope } from '../../../types/searchScope'
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

type LinkToAddressProps = {
  address: string | undefined
  label?: string
  ownAddress?: string
  scope: SearchScope
  type?: 'account' | 'validator'
}

const LinkToAddress: FC<LinkToAddressProps> = ({ address, label, ownAddress, scope, type = 'account' }) => {
  if (!address) {
    return null
  }

  return (
    <Box sx={{ display: 'inline-flex' }}>
      <Label>{label}</Label>
      {type === 'account' && (
        <AccountLink labelOnly={address === ownAddress} scope={scope} address={address} alwaysTrim />
      )}
      {type === 'validator' && <ValidatorLink network={scope.network} address={address} alwaysTrim />}
    </Box>
  )
}

export const From: FC<LinkToAddressProps> = props => {
  const { t } = useTranslation()
  const label = props.label || props.type === 'validator' ? t('common.fromValidator') : t('common.from')

  return <LinkToAddress label={label} {...props} />
}

export const To: FC<LinkToAddressProps> = props => {
  const { t } = useTranslation()
  const label = props.label || props.type === 'validator' ? t('common.toValidator') : t('common.to')

  return <LinkToAddress label={label} {...props} />
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
      <Label>{label || t('common.value')}</Label>
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

type RuntimeNameByIdProps = {
  scope: SearchScope
  runtimeId: string
}

export const RuntimeNameById: FC<RuntimeNameByIdProps> = ({ scope, runtimeId }) => {
  const { t } = useTranslation()
  return (
    <LabelValue
      label={t('common.to')}
      value={getNameForScopeByRuntimeId(t, runtimeId, scope.network) ?? runtimeId}
    />
  )
}
