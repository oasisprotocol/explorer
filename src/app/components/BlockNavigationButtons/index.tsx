import { FC } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PaginationNext, PaginationPrevious } from '@oasisprotocol/ui-library/src/components/pagination'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { ConsensusScope, RuntimeScope, SearchScope } from '../../../types/searchScope'
import { useConsensusFreshness, useRuntimeFreshness } from '../OfflineBanner/hook'
import { RouteUtils } from '../../utils/route-utils'
import { TX_METHOD_QUERY_ARG_NAME } from '../../hooks/useCommonParams'

const PrevBlockButton: FC<{ scope: SearchScope; currentRound: number }> = ({ scope, currentRound }) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const disabled = currentRound === 0
  return (
    <Tooltip title={disabled ? t('blocks.viewingFirst') : t('blocks.viewPrevious')} placement="top">
      <div className="ml-4">
        <PaginationPrevious
          linkComponent={RouterLink}
          to={RouteUtils.getBlockRoute(scope, currentRound - 1, searchParams, [TX_METHOD_QUERY_ARG_NAME])}
          disabled={disabled}
        />
      </div>
    </Tooltip>
  )
}

export { PrevBlockButton as RuntimePrevBlockButton }
export { PrevBlockButton as ConsensusPrevBlockButton }

const NextBlockButton: FC<{ disabled: boolean; scope: SearchScope; currentRound: number }> = ({
  currentRound,
  disabled,
  scope,
}) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  return (
    <Tooltip title={disabled ? t('blocks.viewingLatest') : t('blocks.viewNext')} placement="top">
      <Box>
        <PaginationNext
          linkComponent={RouterLink}
          to={RouteUtils.getBlockRoute(scope, currentRound + 1, searchParams, [TX_METHOD_QUERY_ARG_NAME])}
          disabled={disabled}
        />
      </Box>
    </Tooltip>
  )
}

type NextBlockButtonProps<Scope = SearchScope> = {
  scope: Scope
  currentRound: number
}

export const ConsensusNextBlockButton: FC<NextBlockButtonProps<ConsensusScope>> = ({
  currentRound,
  scope,
}) => {
  const { latestBlock } = useConsensusFreshness(scope.network)
  const disabled = !!latestBlock && currentRound >= latestBlock
  useConsensusFreshness(scope.network, { polling: disabled })

  return <NextBlockButton currentRound={currentRound} disabled={disabled} scope={scope} />
}

export const RuntimeNextBlockButton: FC<NextBlockButtonProps<RuntimeScope>> = ({ currentRound, scope }) => {
  const { latestBlock } = useRuntimeFreshness(scope)
  const disabled = !!latestBlock && currentRound >= latestBlock
  useRuntimeFreshness(scope, { polling: disabled })

  return <NextBlockButton currentRound={currentRound} disabled={disabled} scope={scope} />
}
