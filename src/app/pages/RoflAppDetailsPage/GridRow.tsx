import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { Info } from 'lucide-react'

type GridRowProps = {
  children?: ReactNode
  label: string
  tooltip?: ReactNode
}

export const GridRow: FC<GridRowProps> = ({ label, children, tooltip }) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="col-span-1 border-b border-gray-100 p-2 md:p-4 flex items-center gap-1">
        {label}:
        {tooltip && (
          <Tooltip title={tooltip}>
            <Info size="20" className="stroke-zinc-500" />
          </Tooltip>
        )}
      </div>

      <div className="col-span-2 border-b border-gray-100 p-2 md:p-4">
        {children ? <span className="font-medium">{children}</span> : t('common.missing')}
      </div>
    </>
  )
}
