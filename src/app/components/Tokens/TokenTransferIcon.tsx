import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'
import { UnknownIcon } from './../CustomIcons/Unknown'
import { TransferIcon } from './../CustomIcons/Transfer'
import { COLORS } from '../../../styles/theme/colors'
import StreamIcon from '@mui/icons-material/Stream'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import ApprovalIcon from '@mui/icons-material/Approval'
import Box from '@mui/material/Box'

const getTokenTransferLabel = (t: TFunction, name: string | undefined): string => {
  switch (name) {
    case undefined:
      return t('tokens.transferEventType.unavailable')
    case 'Transfer':
      return t('tokens.transferEventType.transfer')
    case 'Approval':
      return t('tokens.transferEventType.approval')
    case 'Minting':
      return t('tokens.transferEventType.minting')
    case 'Burning':
      return t('tokens.transferEventType.burning')
    default:
      return t('tokens.transferEventType.unknown', { name })
  }
}

const getTokenTransferIcon = (name: string | undefined) => {
  switch (name) {
    case undefined:
      // Method may be undefined if the transaction was malformed.
      return <UnknownIcon fontSize="inherit" />
    case 'Transfer':
      return <TransferIcon fontSize="inherit" />
    case 'Approval':
      return <ApprovalIcon fontSize="inherit" htmlColor={COLORS.eucalyptus} />
    case 'Minting':
      return <StreamIcon fontSize="inherit" htmlColor={COLORS.eucalyptus} />
    case 'Burning':
      return <LocalFireDepartmentIcon fontSize="inherit" htmlColor={COLORS.eucalyptus} />
    default:
      return <UnknownIcon fontSize="inherit" />
  }
}

interface TokenTransferLabelProps {
  /**
   * The event name
   */
  name: string | undefined
}

export const TokenTransferLabel: FC<TokenTransferLabelProps> = ({ name }) => {
  const { t } = useTranslation()

  return <>{getTokenTransferLabel(t, name)}</>
}

interface TokenTransferIconProps extends TokenTransferLabelProps {
  size: number
}

export const TokenTransferIcon: FC<TokenTransferIconProps> = ({ name, size }) => {
  const { t } = useTranslation()

  return (
    <Tooltip
      arrow
      placement="top"
      title={getTokenTransferLabel(t, name)}
      enterDelay={tooltipDelay}
      enterNextDelay={tooltipDelay}
    >
      <Box component="span" sx={{ fontSize: size, lineHeight: 0 }}>
        {getTokenTransferIcon(name)}
      </Box>
    </Tooltip>
  )
}
