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
import { ConsensusTxMethod, GetConsensusTransactionsParams } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { SelectOptionBase } from '../Select'
import { exhaustedTypeWarning } from '../../../types/errors'

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
    case ConsensusTxMethod.consensusMeta:
      return t('transactions.method.consensus.meta')
    case ConsensusTxMethod.keymanagerPublishEphemeralSecret:
      return t('transactions.method.keyManager.publishEphemeralSecret')
    case ConsensusTxMethod.keymanagerPublishMasterSecret:
      return t('transactions.method.keyManager.publishMasterSecret')
    case ConsensusTxMethod.keymanagerUpdatePolicy:
      return t('transactions.method.keyManager.updatePolicy')
    case ConsensusTxMethod['keymanager/churpApply']:
      return t('transactions.method.keyManager.churp.apply')
    case ConsensusTxMethod['keymanager/churpConfirm']:
      return t('transactions.method.keyManager.churp.confirm')
    case ConsensusTxMethod['keymanager/churpCreate']:
      return t('transactions.method.keyManager.churp.create')
    case ConsensusTxMethod['keymanager/churpUpdate']:
      return t('transactions.method.keyManager.churp.update')
    case ConsensusTxMethod.registryDeregisterEntity:
      return t('transactions.method.registryDeregisterEntity')
    case ConsensusTxMethod.registryProveFreshness:
      return t('transactions.method.registryProveFreshness')
    case ConsensusTxMethod.registryUnfreezeNode:
      return t('transactions.method.registryUnfreezeNode')
    case ConsensusTxMethod.roothashEvidence:
      return t('transactions.method.roothashEvidence')
    case ConsensusTxMethod.roothashSubmitMsg:
      return t('transactions.method.roothashSubmitMessage')
    case ConsensusTxMethod.stakingBurn:
      return t('transactions.method.stakingBurn')
    case ConsensusTxMethod.vaultAuthorizeAction:
      return t('transactions.method.vault.authorizeAction')
    case ConsensusTxMethod.vaultCancelAction:
      return t('transactions.method.vault.cancelAction')
    case ConsensusTxMethod.vaultCreate:
      return t('transactions.method.vault.create')
    case undefined:
      return t('common.missing')
    default:
      exhaustedTypeWarning('Unexpected consensus transaction method', method)
      return method || t('common.unknown')
  }
}

// List of known consensus ts types, to offer in filter
// Please keep them in alphabetical order
const knownConsensusTxMethods = [
  ConsensusTxMethod.stakingAllow,
  ConsensusTxMethod.stakingAmendCommissionSchedule,
  ConsensusTxMethod.governanceCastVote,
  ConsensusTxMethod.stakingBurn,
  ConsensusTxMethod.consensusMeta,
  ConsensusTxMethod.stakingWithdraw,
  ConsensusTxMethod.registryDeregisterEntity,
  ConsensusTxMethod.roothashExecutorCommit,
  ConsensusTxMethod.roothashExecutorProposerTimeout,
  ConsensusTxMethod['keymanager/churpApply'],
  ConsensusTxMethod['keymanager/churpConfirm'],
  ConsensusTxMethod['keymanager/churpCreate'],
  ConsensusTxMethod['keymanager/churpUpdate'],
  ConsensusTxMethod.keymanagerPublishEphemeralSecret,
  ConsensusTxMethod.keymanagerPublishMasterSecret,
  ConsensusTxMethod.keymanagerUpdatePolicy,
  ConsensusTxMethod.beaconPVSSCommit,
  ConsensusTxMethod.beaconPVSSReveal,
  ConsensusTxMethod.registryRegisterEntity,
  ConsensusTxMethod.registryRegisterNode,
  ConsensusTxMethod.registryRegisterRuntime,
  ConsensusTxMethod.registryProveFreshness,
  ConsensusTxMethod.registryUnfreezeNode,
  ConsensusTxMethod.roothashEvidence,
  ConsensusTxMethod.roothashSubmitMsg,
  ConsensusTxMethod.stakingAddEscrow,
  ConsensusTxMethod.stakingReclaimEscrow,
  ConsensusTxMethod.governanceSubmitProposal,
  ConsensusTxMethod.stakingTransfer,
  ConsensusTxMethod.beaconVRFProve,
  ConsensusTxMethod.vaultAuthorizeAction,
  ConsensusTxMethod.vaultCancelAction,
  ConsensusTxMethod.vaultCreate,
] satisfies ConsensusTxMethod[]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const typeTestExhaustiveArray =
  undefined as unknown as ConsensusTxMethod satisfies (typeof knownConsensusTxMethods)[number]

export const getConsensusTxMethodOptions = (t: TFunction): SelectOptionBase[] =>
  knownConsensusTxMethods.map(
    (method): SelectOptionBase => ({
      value: method,
      label: getConsensusTransactionLabel(t, method),
    }),
  )

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
    case ConsensusTxMethod['keymanager/churpApply']: // TODO: provide dedicated icon
    case ConsensusTxMethod['keymanager/churpConfirm']: // TODO: provide dedicated icon
    case ConsensusTxMethod['keymanager/churpCreate']: // TODO: provide dedicated icon
    case ConsensusTxMethod['keymanager/churpUpdate']: // TODO: provide dedicated icon
    case ConsensusTxMethod.vaultCreate: // TODO: provide dedicated icon
    case ConsensusTxMethod.keymanagerPublishEphemeralSecret: // TODO: provide dedicated icon
    case ConsensusTxMethod.keymanagerPublishMasterSecret: // TODO: provide dedicated icon
    case ConsensusTxMethod.keymanagerUpdatePolicy: // TODO: provide dedicated icon
    case ConsensusTxMethod.registryDeregisterEntity: // TODO: provide dedicated icon
    case ConsensusTxMethod.registryProveFreshness: // TODO: provide dedicated icon
    case ConsensusTxMethod.registryUnfreezeNode: // TODO: provide dedicated icon
    case ConsensusTxMethod.roothashEvidence: // TODO: provide dedicated icon
    case ConsensusTxMethod.roothashSubmitMsg: // TODO: provide dedicated icon
    case ConsensusTxMethod.vaultAuthorizeAction: // TODO: provide dedicated icon
    case ConsensusTxMethod.vaultCancelAction: // TODO: provide dedicated icon
    case ConsensusTxMethod.consensusMeta: // TODO: provide dedicated icon
    case ConsensusTxMethod.stakingBurn: // TODO: provide dedicated icon
    case undefined:
      return <MethodIcon color="gray" icon={<QuestionMarkIcon />} label={label} {...props} />
    default:
      exhaustedTypeWarning('Unexpected consensus transaction method', method)
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

export type ConsensusTxMethodFilterOption = ConsensusTxMethod | 'any'

export const getConsensusTransactionMethodFilteringParam = (
  method: ConsensusTxMethodFilterOption,
): Partial<GetConsensusTransactionsParams> => (method === 'any' ? {} : { method })
