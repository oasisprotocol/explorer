import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PaginationItem from '@mui/material/PaginationItem'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'
import { useRuntimeFreshness } from '../OfflineBanner/hook'
import { RouteUtils } from '../../utils/route-utils'

export const PrevBlockButton: FC<{ scope: SearchScope; currentRound: number }> = ({
  scope,
  currentRound,
}) => {
  const { t } = useTranslation()
  const disabled = currentRound === 0
  return (
    <Tooltip title={disabled ? t('blocks.viewingFirst') : t('blocks.viewPrevious')} placement="top">
      <Box>
        <PaginationItem
          component={RouterLink}
          to={RouteUtils.getBlockRoute(scope, currentRound - 1)}
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

export const NextBlockButton: FC<{ scope: SearchScope; currentRound: number }> = ({
  scope,
  currentRound,
}) => {
  const { latestBlock } = useRuntimeFreshness(scope)
  const { t } = useTranslation()
  const disabled = !!latestBlock && currentRound >= latestBlock
  // If the next button is disabled, we want to poll the freshness info, because it will probably be enabled in a few secs
  /** This changes the value of {@link latestBlock}. */
  useRuntimeFreshness(scope, { polling: disabled })
  return (
    <Tooltip title={disabled ? t('blocks.viewingLatest') : t('blocks.viewNext')} placement="top">
      <Box>
        <PaginationItem
          component={RouterLink}
          to={RouteUtils.getBlockRoute(scope, currentRound + 1)}
          type="next"
          disabled={disabled}
          sx={{ background: COLORS.grayMediumLight }}
        />
      </Box>
    </Tooltip>
  )
}
