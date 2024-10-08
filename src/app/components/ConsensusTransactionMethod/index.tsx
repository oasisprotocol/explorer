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

const getConsensusTransactionMethod = (
  t: TFunction,
  method: ConsensusTxMethod | undefined,
  truncate?: boolean,
) => {
  const props = {
    truncate,
  }
  switch (method) {
    case ConsensusTxMethod.stakingTransfer:
      return (
        <MethodIcon
          color="green"
          icon={<ArrowForwardIcon />}
          label={t('transactions.method.stakingTransfer')}
          {...props}
        />
      )
    case ConsensusTxMethod.stakingAddEscrow:
      return (
        <MethodIcon
          color="green"
          icon={<ExitToAppIcon />}
          label={t('transactions.method.stakingAddEscrow')}
          {...props}
        />
      )
    case ConsensusTxMethod.stakingReclaimEscrow:
      return (
        <MethodIcon
          icon={<ExitToAppIcon />}
          label={t('transactions.method.stakingReclaimEscrow')}
          {...props}
        />
      )
    case ConsensusTxMethod.stakingAmendCommissionSchedule:
      return (
        <MethodIcon
          icon={<PriceChangeIcon />}
          label={t('transactions.method.stakingAmendCommissionSchedule')}
          {...props}
        />
      )
    case ConsensusTxMethod.stakingAllow:
      return (
        <MethodIcon icon={<LibraryAddCheckIcon />} label={t('transactions.method.stakingAllow')} {...props} />
      )
    case ConsensusTxMethod.stakingWithdraw:
      return (
        <MethodIcon
          color="green"
          icon={<ArrowDownwardIcon />}
          label={t('transactions.method.stakingWithdraw')}
          {...props}
        />
      )
    case ConsensusTxMethod.roothashExecutorCommit:
      return (
        <MethodIcon
          icon={<MiscellaneousServicesIcon />}
          label={t('transactions.method.roothashExecutorCommit')}
          {...props}
        />
      )
    case ConsensusTxMethod.roothashExecutorProposerTimeout:
      return (
        <MethodIcon
          icon={<MiscellaneousServicesIcon />}
          label={t('transactions.method.roothashExecutorProposerTimeout')}
          {...props}
        />
      )
    case ConsensusTxMethod.registryRegisterEntity:
      return (
        <MethodIcon
          icon={<PersonIcon />}
          label={t('transactions.method.registryRegisterEntity')}
          {...props}
        />
      )
    case ConsensusTxMethod.registryRegisterNode:
      return (
        <MethodIcon icon={<DnsIcon />} label={t('transactions.method.registryRegisterNode')} {...props} />
      )
    case ConsensusTxMethod.registryRegisterRuntime:
      return (
        <MethodIcon
          icon={<MiscellaneousServicesIcon />}
          label={t('transactions.method.registryRegisterRuntime')}
          {...props}
        />
      )
    case ConsensusTxMethod.governanceCastVote:
      return (
        <MethodIcon icon={<HowToVoteIcon />} label={t('transactions.method.governanceCastVote')} {...props} />
      )
    case ConsensusTxMethod.governanceSubmitProposal:
      return (
        <MethodIcon
          icon={<AccountBalanceIcon />}
          label={t('transactions.method.governanceSubmitProposal')}
          {...props}
        />
      )
    case ConsensusTxMethod.beaconPVSSCommit:
      return (
        <MethodIcon
          icon={<MiscellaneousServicesIcon />}
          label={t('transactions.method.beaconPVSSCommit')}
          {...props}
        />
      )
    case ConsensusTxMethod.beaconPVSSReveal:
      return (
        <MethodIcon
          icon={<MiscellaneousServicesIcon />}
          label={t('transactions.method.beaconPVSSReveal')}
          {...props}
        />
      )
    case ConsensusTxMethod.beaconVRFProve:
      return (
        <MethodIcon
          icon={<MiscellaneousServicesIcon />}
          label={t('transactions.method.beaconVRFProve')}
          {...props}
        />
      )
    default:
      return (
        <MethodIcon
          color="gray"
          icon={<QuestionMarkIcon />}
          label={method || t('common.unknown')}
          {...props}
        />
      )
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
