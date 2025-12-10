import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Braces } from 'lucide-react'

export const EmptyStateCard: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col justify-center items-center gap-2 min-h-[150px] sm:min-h-[200px]">
      <Braces className="text-sidebar-ring" />
      <span className="text-sidebar-ring font-semibold text-center">{t('rofl.noData')}</span>
    </div>
  )
}
