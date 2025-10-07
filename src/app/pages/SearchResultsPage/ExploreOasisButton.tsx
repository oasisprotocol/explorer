import { useNavigate } from 'react-router-dom'
import { FC, useCallback } from 'react'
import { Button } from '@mui/base/Button'
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
      <div className="flex items-center gap-1">
        {t('home.exploreBtnText')}
        <ArrowForward fontSize={'small'} />
      </div>
    </Button>
  )
}
