import { useNavigate } from 'react-router-dom'
import { FC, useCallback } from 'react'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import ArrowForward from '@mui/icons-material/ArrowForward'
import { useTranslation } from 'react-i18next'

export const ExploreOasisButton: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const explore = useCallback(() => navigate('/'), [navigate])
  return (
    <Button variant="ghost" className="mt-8" size="lg" onClick={explore}>
      <div className="flex items-center gap-1">
        {t('home.exploreBtnText')}
        <ArrowForward fontSize={'small'} />
      </div>
    </Button>
  )
}
