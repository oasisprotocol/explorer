import { FC, ReactElement, Ref, cloneElement, useCallback, useLayoutEffect, useRef, useState } from 'react'
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
  truncate?: boolean
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
  const { label, reverseLabel, truncate } = props
  const enableTruncate = truncate && label && !reverseLabel

  return (
    <>
      {enableTruncate && <MethodIconWithTruncatedLabel {...props} />}
      {!enableTruncate && <MethodIconContent {...props} />}
    </>
  )
}

type MethodIconContentProps = MethodIconProps & {
  elementRef?: Ref<HTMLDivElement>
}

const MethodIconContent: FC<MethodIconContentProps> = ({
  border = true,
  color = 'blue',
  icon,
  label,
  reverseLabel,
  size = 40,
  truncate,
  elementRef,
}) => {
  const theme = colorMap[color]
  if (!theme) {
    throw new Error(`Invalid color: ${color}`)
  }

  return (
    <Box ref={elementRef} gap={3} sx={{ display: 'inline-flex', alignItems: 'center' }}>
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
        <Typography
          sx={{
            fontWeight: 'inherit',
            order: reverseLabel ? -1 : 0,
            ...(truncate
              ? {
                  minWidth: '100px',
                  // all properties are needed to enable overflow, maxWidth allows to squeeze content
                  maxWidth: '1px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }
              : {}),
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  )
}

const MethodIconWithTruncatedLabel: FC<MethodIconProps> = props => {
  const elementRef = useRef<HTMLDivElement>(null)
  const [truncate, setTruncate] = useState(false)
  const [baseLabelWidth, setBaseLabelWidth] = useState(0)
  const applyTruncate = useCallback(() => {
    if (elementRef.current) {
      const elementWidth = elementRef.current.offsetWidth
      const parentWidth = (elementRef.current.parentNode as HTMLElement)?.offsetWidth
      setTruncate(elementWidth === parentWidth || baseLabelWidth > parentWidth)
    }
  }, [elementRef, baseLabelWidth])

  useLayoutEffect(() => {
    if (elementRef.current) {
      setBaseLabelWidth(elementRef.current.offsetWidth)
      applyTruncate()
    }

    const handleResize = () => {
      applyTruncate()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [applyTruncate, elementRef, props.label, props.size])

  return (
    <Tooltip
      arrow
      placement="top"
      title={props.label}
      enterDelay={tooltipDelay}
      enterNextDelay={tooltipDelay}
      disableFocusListener={!truncate}
      disableHoverListener={!truncate}
      disableTouchListener={!truncate}
    >
      <Box>
        <MethodIconContent {...props} elementRef={elementRef} truncate={truncate} />
      </Box>
    </Tooltip>
  )
}

const getConsensusTransactionLabel = (t: TFunction, method: ConsensusTxMethod | undefined): string => {
  /**
   * TODO: Missing values:
   *
   *  consensusMeta
   *  keymanagerPublishEphemeralSecret
   *  keymanagerPublishMasterSecret
   *  keymanagerUpdatePolicy
   *  registryDeregisterEntity
   *  registryProveFreshness
   *  registryUnfreezeNode
   *  roothashEvidence
   *  roothashSubmitMsg
   *  stakingBurn
   *  keymanager/churpApply
   *  keymanager/churpConfirm
   *  keymanager/churpCreate
   *  keymanager/churpUpdate
   *  vaultAuthorizeAction
   *  vaultCancelAction
   *  vaultCreate
   */

  // Please note: when updating this, keep it in sync
  // with the knownConsensusTxMethods array below!
  switch (method) {
    case ConsensusTxMethod.stakingTransfer:
      return t('transactions.method.stakingTransfer')
    case ConsensusTxMethod.stakingAddEscrow:
      return t('transactions.method.stakingAddEscrow')
    case ConsensusTxMethod.stakingReclaimEscrow:
      return t('transactions.method.stakingReclaimEscrow')
    case ConsensusTxMethod.stakingAmendCommissionSchedule:
      return t('transactions.method.stakingAmendCommissionSchedule')
    case ConsensusTxMethod.stakingAllow:
      return t('transactions.method.stakingAllow')
    case ConsensusTxMethod.stakingWithdraw:
      return t('transactions.method.stakingWithdraw')
    case ConsensusTxMethod.roothashExecutorCommit:
      return t('transactions.method.roothashExecutorCommit')
    case ConsensusTxMethod.roothashExecutorProposerTimeout:
      return t('transactions.method.roothashExecutorProposerTimeout')
    case ConsensusTxMethod.registryRegisterEntity:
      return t('transactions.method.registryRegisterEntity')
    case ConsensusTxMethod.registryRegisterNode:
      return t('transactions.method.registryRegisterNode')
    case ConsensusTxMethod.registryRegisterRuntime:
      return t('transactions.method.registryRegisterRuntime')
    case ConsensusTxMethod.governanceCastVote:
      return t('transactions.method.governanceCastVote')
    case ConsensusTxMethod.governanceSubmitProposal:
      return t('transactions.method.governanceSubmitProposal')
    case ConsensusTxMethod.beaconPVSSCommit:
      return t('transactions.method.beaconPVSSCommit')
    case ConsensusTxMethod.beaconPVSSReveal:
      return t('transactions.method.beaconPVSSReveal')
    case ConsensusTxMethod.beaconVRFProve:
      return t('transactions.method.beaconVRFProve')
    default:
      return method || t('common.unknown')
  }
}

const getConsensusTransactionMethod = (
  t: TFunction,
  method: ConsensusTxMethod | undefined,
  truncate?: boolean,
) => {
  const props = {
    truncate,
  }
  const label = getConsensusTransactionLabel(t, method)
  switch (method) {
    case ConsensusTxMethod.stakingTransfer:
      return <MethodIcon color="green" icon={<ArrowForwardIcon />} label={label} {...props} />
    case ConsensusTxMethod.stakingAddEscrow:
      return <MethodIcon color="green" icon={<ExitToAppIcon />} label={label} {...props} />
    case ConsensusTxMethod.stakingReclaimEscrow:
      return <MethodIcon icon={<ExitToAppIcon />} label={label} {...props} />
    case ConsensusTxMethod.stakingAmendCommissionSchedule:
      return <MethodIcon icon={<PriceChangeIcon />} label={label} {...props} />
    case ConsensusTxMethod.stakingAllow:
      return <MethodIcon icon={<LibraryAddCheckIcon />} label={label} {...props} />
    case ConsensusTxMethod.stakingWithdraw:
      return <MethodIcon color="green" icon={<ArrowDownwardIcon />} label={label} {...props} />
    case ConsensusTxMethod.roothashExecutorCommit:
      return <MethodIcon icon={<MiscellaneousServicesIcon />} label={label} {...props} />
    case ConsensusTxMethod.roothashExecutorProposerTimeout:
      return <MethodIcon icon={<MiscellaneousServicesIcon />} label={label} {...props} />
    case ConsensusTxMethod.registryRegisterEntity:
      return <MethodIcon icon={<PersonIcon />} label={label} {...props} />
    case ConsensusTxMethod.registryRegisterNode:
      return <MethodIcon icon={<DnsIcon />} label={label} {...props} />
    case ConsensusTxMethod.registryRegisterRuntime:
      return <MethodIcon icon={<MiscellaneousServicesIcon />} label={label} {...props} />
    case ConsensusTxMethod.governanceCastVote:
      return <MethodIcon icon={<HowToVoteIcon />} label={label} {...props} />
    case ConsensusTxMethod.governanceSubmitProposal:
      return <MethodIcon icon={<AccountBalanceIcon />} label={label} {...props} />
    case ConsensusTxMethod.beaconPVSSCommit:
      return <MethodIcon icon={<MiscellaneousServicesIcon />} label={label} {...props} />
    case ConsensusTxMethod.beaconPVSSReveal:
      return <MethodIcon icon={<MiscellaneousServicesIcon />} label={label} {...props} />
    case ConsensusTxMethod.beaconVRFProve:
      return <MethodIcon icon={<MiscellaneousServicesIcon />} label={label} {...props} />
    default:
      return <MethodIcon color="gray" icon={<QuestionMarkIcon />} label={label} {...props} />
  }
}

type ConsensusTransactionMethodProps = {
  method: ConsensusTxMethod
  truncate?: boolean
}

export const ConsensusTransactionMethod: FC<ConsensusTransactionMethodProps> = ({ method, truncate }) => {
  const { t } = useTranslation()

  return <>{getConsensusTransactionMethod(t, method, truncate)}</>
}
