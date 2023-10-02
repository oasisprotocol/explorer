import React, { FC, useState } from 'react'
import { SearchScope } from '../../../types/searchScope'
import { useInstanceInfo } from './hook'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import { processNftImageUrl } from '../../utils/nft-images'
import Box from '@mui/material/Box'
import { COLORS } from '../../../styles/theme/colors'
import ContrastIcon from '@mui/icons-material/Contrast'
import OpenInFullIcon from '@mui/icons-material/OpenInFull'
import type { SxProps } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'

const switchStyle: (darkMode: boolean) => SxProps = darkMode => ({
  width: 36,
  height: 36,
  borderRadius: 10,
  background: darkMode ? COLORS.grayExtraLight : COLORS.grayMedium,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const switchColor = (darkMode: boolean) => (darkMode ? COLORS.grayMedium : COLORS.grayExtraLight)

const DarkModeSwitch: FC<{ darkMode: boolean; onSetDarkMode: (darkMode: boolean) => void }> = ({
  darkMode,
  onSetDarkMode,
}) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('darkMode.hint')}>
      <Box
        title={'Light mode / dark mode'}
        onClick={() => onSetDarkMode(!darkMode)}
        sx={switchStyle(darkMode)}
      >
        <ContrastIcon htmlColor={switchColor(darkMode)} />
      </Box>
    </Tooltip>
  )
}

const FullScreenButton: FC<{ darkMode: boolean; imageUrl: string }> = ({ darkMode, imageUrl }) => {
  const { t } = useTranslation()
  return (
    <Tooltip title={t('common.openInFull')}>
      <a href={imageUrl} target={'_blank'} rel="noopener noreferrer">
        <Box sx={switchStyle(darkMode)}>
          <OpenInFullIcon htmlColor={switchColor(darkMode)} />
        </Box>
      </a>
    </Tooltip>
  )
}

export const InstanceImageCard: FC<{
  scope: SearchScope
  contractAddress: string
  instanceId: string
}> = ({ scope, contractAddress, instanceId }) => {
  const [darkMode, setDarkMode] = useState(false)
  const { isLoading, instance } = useInstanceInfo(scope, contractAddress, instanceId)
  if (isLoading) {
    return <span>Loading...</span>
    // TODO
  }
  if (!instance) {
    return <span>404 Token instance not found</span>
  }
  const imageUrl = processNftImageUrl(instance.image)
  return (
    <Card sx={{ background: darkMode ? COLORS.grayExtraDark : COLORS.grayExtraLight }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src={imageUrl} alt={instance.image} width={300} height={300} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'right',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <FullScreenButton darkMode={darkMode} imageUrl={imageUrl} />
          <DarkModeSwitch darkMode={darkMode} onSetDarkMode={setDarkMode} />
        </Box>
      </CardContent>
    </Card>
  )
}
