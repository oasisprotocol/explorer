import { FC, ReactElement, Ref, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import {
  ArrowRight,
  ArrowDown,
  CircleHelp,
  UserRound,
  Banknote,
  CopyCheck,
  LogOut,
  Landmark,
} from 'lucide-react'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { ConsensusTxMethod } from '../../../oasis-nexus/api'
import { COLORS } from '../../../styles/theme/colors'
import { exhaustedTypeWarning } from '../../../types/errors'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { Dns } from '../MuiIcons/Dns'
import { MiscellaneousServices } from '../MuiIcons/MiscellaneousServices'
import { CastVote } from '../MuiIcons/CastVote'
import { getConsensusTransactionLabel } from './helpers'

type MethodIconProps = {
  border?: boolean
  color?: 'blue' | 'green' | 'gray' | 'orange'
  icon: ReactElement
  label?: string
  reverseLabel?: boolean
  size?: number
  truncate?: boolean
}

const colorMap = {
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
    <div ref={elementRef} className="inline-flex items-center gap-3">
      <div
        className="flex items-center justify-center"
        style={{
          color: theme.primary,
        }}
      >
        {icon}
      </div>
      {label && (
        <Typography
          className={cn(
            'font-inherit',
            reverseLabel ? '-order-1' : 'order-0',
            truncate && 'min-w-[100px] max-w-[1px] whitespace-nowrap overflow-hidden text-ellipsis',
          )}
        >
          {label}
        </Typography>
      )}
    </div>
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
    <Tooltip title={props.label} disabled={!truncate}>
      <div>
        <MethodIconContent {...props} elementRef={elementRef} truncate={truncate} />
      </div>
    </Tooltip>
  )
}

export type ConsensusTransactionTypeFilterOption = {
  value: ConsensusTxMethodFilterOption
  label: string
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
      return <MethodIcon color="green" icon={<ArrowRight />} label={label} {...props} />
    case ConsensusTxMethod.stakingAddEscrow:
      return <MethodIcon color="green" icon={<LogOut />} label={label} {...props} />
    case ConsensusTxMethod.stakingReclaimEscrow:
      return <MethodIcon icon={<LogOut />} label={label} {...props} />
    case ConsensusTxMethod.stakingAmendCommissionSchedule:
      return <MethodIcon icon={<Banknote />} label={label} {...props} />
    case ConsensusTxMethod.stakingAllow:
      return <MethodIcon icon={<CopyCheck />} label={label} {...props} />
    case ConsensusTxMethod.stakingWithdraw:
      return <MethodIcon color="green" icon={<ArrowDown />} label={label} {...props} />
    case ConsensusTxMethod.roothashExecutorCommit:
      return <MethodIcon icon={<MiscellaneousServices />} label={label} {...props} />
    case ConsensusTxMethod.roothashExecutorProposerTimeout:
      return <MethodIcon icon={<MiscellaneousServices />} label={label} {...props} />
    case ConsensusTxMethod.registryRegisterEntity:
      return <MethodIcon icon={<UserRound />} label={label} {...props} />
    case ConsensusTxMethod.registryRegisterNode:
      return <MethodIcon icon={<Dns />} label={label} {...props} />
    case ConsensusTxMethod.registryRegisterRuntime:
      return <MethodIcon icon={<MiscellaneousServices />} label={label} {...props} />
    case ConsensusTxMethod.governanceCastVote:
      return <MethodIcon icon={<CastVote />} label={label} {...props} />
    case ConsensusTxMethod.governanceSubmitProposal:
      return <MethodIcon icon={<Landmark />} label={label} {...props} />
    case ConsensusTxMethod.beaconPVSSCommit:
      return <MethodIcon icon={<MiscellaneousServices />} label={label} {...props} />
    case ConsensusTxMethod.beaconPVSSReveal:
      return <MethodIcon icon={<MiscellaneousServices />} label={label} {...props} />
    case ConsensusTxMethod.beaconVRFProve:
      return <MethodIcon icon={<MiscellaneousServices />} label={label} {...props} />
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
      return <MethodIcon color="gray" icon={<CircleHelp />} label={label} {...props} />
    default:
      exhaustedTypeWarning('Unexpected consensus transaction method', method)
      return <MethodIcon color="gray" icon={<CircleHelp />} label={label} {...props} />
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
