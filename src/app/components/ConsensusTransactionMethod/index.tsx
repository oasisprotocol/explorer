import { FC, ReactElement, cloneElement } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DnsIcon from '@mui/icons-material/Dns'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import HowToVoteIcon from '@mui/icons-material/HowToVote'
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck'
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices'
import PersonIcon from '@mui/icons-material/Person'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import Tooltip from '@mui/material/Tooltip'
import { tooltipDelay } from '../../../styles/theme'
import { ConsensusTxMethod } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'

type MethodIconProps = {
  border?: boolean
  color?: 'blue' | 'green' | 'gray' | 'orange'
  icon: ReactElement
  label?: string
  reverseLabel?: boolean
  size?: number
}

export const colorMap = {
  blue: {
    primary: COLORS.brandMedium,
    secondary: COLORS.brandLightBlue,
  },
  green: {
    primary: COLORS.eucalyptus,
    secondary: COLORS.honeydew,
  },
  gray: {
    primary: COLORS.grayMedium,
    secondary: COLORS.grayMediumLight,
  },
  orange: {
    primary: COLORS.warningColor,
    secondary: COLORS.warningLight,
  },
}

const iconRatio = 0.75

export const MethodIcon: FC<MethodIconProps> = props => {
  const { label, reverseLabel } = props
  const showTooltip = label && !reverseLabel
  // TODO: get requirement when we want to trim label
  return (
    <>
      {showTooltip && (
        <Tooltip arrow placement="top" title={label} enterDelay={tooltipDelay} enterNextDelay={tooltipDelay}>
          <span>
            <MethodIconContent {...props} />
          </span>
        </Tooltip>
      )}
      {!showTooltip && <MethodIconContent {...props} />}
    </>
  )
}

const MethodIconContent: FC<MethodIconProps> = ({
  border = true,
  color = 'blue',
  icon,
  label,
  reverseLabel,
  size = 40,
}) => {
  const theme = colorMap[color]
  if (!theme) {
    throw new Error(`Invalid color: ${color}`)
  }
  return (
    <Box gap={3} sx={{ display: 'inline-flex', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: size,
          minWidth: size,
          height: size,
          borderRadius: size,
          color: theme.primary,
          border: border ? `solid 2px ${theme.primary}` : 'none',
          backgroundColor: theme.secondary,
        }}
      >
        {cloneElement(icon, { sx: { fontSize: Math.ceil(size * iconRatio) } })}
      </Box>
      {label && (
        <Typography sx={{ fontWeight: 'inherit', textTransform: 'capitalize', order: reverseLabel ? -1 : 0 }}>
          {label}
        </Typography>
      )}
    </Box>
  )
}

const getConsensusTransactionMethod = (t: TFunction, method: ConsensusTxMethod | undefined) => {
  switch (method) {
    case ConsensusTxMethod.stakingTransfer:
      return (
        <MethodIcon
          color="green"
          icon={<ArrowForwardIcon />}
          label={t('transactions.method.stakingTransfer')}
        />
      )
    case ConsensusTxMethod.stakingAddEscrow:
      return (
        <MethodIcon
          color="green"
          icon={<ExitToAppIcon />}
          label={t('transactions.method.stakingAddEscrow')}
        />
      )
    case ConsensusTxMethod.stakingReclaimEscrow:
      return <MethodIcon icon={<ExitToAppIcon />} label={t('transactions.method.stakingReclaimEscrow')} />
    case ConsensusTxMethod.stakingAmendCommissionSchedule:
      return (
        <MethodIcon
          icon={<PriceChangeIcon />}
          label={t('transactions.method.stakingAmendCommissionSchedule')}
        />
      )
    case ConsensusTxMethod.stakingAllow:
      return <MethodIcon icon={<LibraryAddCheckIcon />} label={t('transactions.method.stakingAllow')} />
    case ConsensusTxMethod.stakingWithdraw:
      return (
        <MethodIcon
          color="green"
          icon={<ArrowDownwardIcon />}
          label={t('transactions.method.stakingWithdraw')}
        />
      )
    case ConsensusTxMethod.roothashExecutorCommit:
      return (
        <MethodIcon
          icon={<MiscellaneousServicesIcon />}
          label={t('transactions.method.roothashExecutorCommit')}
        />
      )
    case ConsensusTxMethod.roothashExecutorProposerTimeout:
      return (
        <MethodIcon
          icon={<MiscellaneousServicesIcon />}
          label={t('transactions.method.roothashExecutorProposerTimeout')}
        />
      )
    case ConsensusTxMethod.registryRegisterEntity:
      return <MethodIcon icon={<PersonIcon />} label={t('transactions.method.registryRegisterEntity')} />
    case ConsensusTxMethod.registryRegisterNode:
      return <MethodIcon icon={<DnsIcon />} label={t('transactions.method.registryRegisterNode')} />
    case ConsensusTxMethod.registryRegisterRuntime:
      return (
        <MethodIcon
          icon={<MiscellaneousServicesIcon />}
          label={t('transactions.method.registryRegisterRuntime')}
        />
      )
    case ConsensusTxMethod.governanceCastVote:
      return <MethodIcon icon={<HowToVoteIcon />} label={t('transactions.method.governanceCastVote')} />
    case ConsensusTxMethod.governanceSubmitProposal:
      return (
        <MethodIcon icon={<AccountBalanceIcon />} label={t('transactions.method.governanceSubmitProposal')} />
      )
    case ConsensusTxMethod.beaconPVSSCommit:
      return (
        <MethodIcon icon={<MiscellaneousServicesIcon />} label={t('transactions.method.beaconPVSSCommit')} />
      )
    case ConsensusTxMethod.beaconPVSSReveal:
      return (
        <MethodIcon icon={<MiscellaneousServicesIcon />} label={t('transactions.method.beaconPVSSReveal')} />
      )
    case ConsensusTxMethod.beaconVRFProve:
      return (
        <MethodIcon icon={<MiscellaneousServicesIcon />} label={t('transactions.method.beaconVRFProve')} />
      )
    default:
      return <MethodIcon color="gray" icon={<QuestionMarkIcon />} label={method || t('common.unknown')} />
  }
}

type ConsensusTransactionMethodProps = {
  method: ConsensusTxMethod
}

export const ConsensusTransactionMethod: FC<ConsensusTransactionMethodProps> = ({ method }) => {
  const { t } = useTranslation()

  return <>{getConsensusTransactionMethod(t, method)}</>
}
