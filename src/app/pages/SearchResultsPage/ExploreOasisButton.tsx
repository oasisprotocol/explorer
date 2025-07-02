import { useNavigate } from 'react-router-dom'
import { FC, useCallback } from 'react'
import { Button } from '@mui/base/Button'
import Box from '@mui/material/Box'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { useTranslation } from 'react-i18next'

export const ExploreOasisButton: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const explore = useCallback(() => navigate('/'), [navigate])
  return (
    <Button
      style={{
        marginTop: '2em',
        paddingLeft: '1em',
        paddingRight: '1em',
        height: '3em',
      }}
      onClick={explore}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {t('home.exploreBtnText')}
        <ArrowForward fontSize={'small'} />
      </Box>
    </Button>
  )
}
