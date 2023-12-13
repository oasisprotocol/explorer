import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import NotInterestedIcon from '@mui/icons-material/NotInterested'
import { COLORS } from '../../../styles/theme/colors'

type NoPreviewProps = {
  placeholderSize: string
}

export const NoPreview: FC<NoPreviewProps> = ({ placeholderSize }) => {
  const { t } = useTranslation()

  return (
    <Box
      gap={4}
      sx={{
        height: placeholderSize,
        width: placeholderSize,
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        color: COLORS.grayMedium2,
      }}
    >
      <NotInterestedIcon sx={{ fontSize: '72px' }} />
      {t('nft.noPreview')}
    </Box>
  )
}
