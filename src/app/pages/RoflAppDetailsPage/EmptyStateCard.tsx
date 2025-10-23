import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import DataObjectIcon from '@mui/icons-material/DataObject'
import { COLORS } from '../../../styles/theme/colors'

export const EmptyStateCard: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col justify-center items-center gap-2 min-h-[150px] sm:min-h-[200px]">
      <DataObjectIcon sx={{ color: COLORS.grayMedium, fontSize: 40, opacity: 0.5 }} />
      <span className="text-gray-500 font-semibold text-center opacity-50">{t('rofl.noData')}</span>
    </div>
  )
}
