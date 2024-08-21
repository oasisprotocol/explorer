import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import InfoIcon from '@mui/icons-material/Info'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'
import { getLayerLabels } from '../../utils/content'

type MarketCapTitlePros = {
  scope: SearchScope
}

export const MarketCapTitle: FC<MarketCapTitlePros> = ({ scope }) => {
  const { t } = useTranslation()
  const labels = getLayerLabels(t)

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {t('tokens.marketCap')}
      <Tooltip title={t('tokens.marketCapTooltip', { layer: labels[scope.layer] })} placement="top">
        <InfoIcon htmlColor={COLORS.brandDark} />
      </Tooltip>
    </Box>
  )
}
