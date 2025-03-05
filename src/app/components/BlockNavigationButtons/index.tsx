import { FC } from 'react'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PaginationItem from '@mui/material/PaginationItem'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'
import { useConsensusFreshness, useRuntimeFreshness } from '../OfflineBanner/hook'
import { RouteUtils } from '../../utils/route-utils'
import { METHOD_QUERY_ARG_NAME } from '../../hooks/useCommonParams'

const PrevBlockButton: FC<{ scope: SearchScope; currentRound: number }> = ({ scope, currentRound }) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const disabled = currentRound === 0
  return (
    <Tooltip title={disabled ? t('blocks.viewingFirst') : t('blocks.viewPrevious')} placement="top">
      <Box>
        <PaginationItem
          component={RouterLink}
          to={RouteUtils.getBlockRoute(scope, currentRound - 1, searchParams, [METHOD_QUERY_ARG_NAME])}
          type="previous"
          disabled={disabled}
          sx={{
            marginLeft: 4,
            marginRight: 1,
            background: COLORS.grayMediumLight,
          }}
        />
      </Box>
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
        <PaginationItem
          component={RouterLink}
          to={RouteUtils.getBlockRoute(scope, currentRound + 1, searchParams, [METHOD_QUERY_ARG_NAME])}
          type="next"
          disabled={disabled}
          sx={{ background: COLORS.grayMediumLight }}
        />
      </Box>
    </Tooltip>
  )
}

type NextBlockButtonProps = {
  scope: SearchScope
  currentRound: number
}

export const ConsensusNextBlockButton: FC<NextBlockButtonProps> = ({ currentRound, scope }) => {
  const { latestBlock } = useConsensusFreshness(scope.network)
  const disabled = !!latestBlock && currentRound >= latestBlock
  useConsensusFreshness(scope.network, { polling: disabled })

  return <NextBlockButton currentRound={currentRound} disabled={disabled} scope={scope} />
}

export const RuntimeNextBlockButton: FC<NextBlockButtonProps> = ({ currentRound, scope }) => {
  const { latestBlock } = useRuntimeFreshness(scope)
  const disabled = !!latestBlock && currentRound >= latestBlock
  useRuntimeFreshness(scope, { polling: disabled })

  return <NextBlockButton currentRound={currentRound} disabled={disabled} scope={scope} />
}
