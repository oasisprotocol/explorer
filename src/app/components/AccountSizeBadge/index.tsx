import { useTranslation } from 'react-i18next'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'
import { FC } from 'react'

type AccountSizeBadgeProps = {
  size: string
}

export const AccountSizeBadge: FC<AccountSizeBadgeProps> = ({ size }) => {
  const { t } = useTranslation()

  return (
    <Tooltip title={t('account.sizeTooltip', { size })}>
      <div className="flex justify-center items-center w-9 h-9 rounded-full text-xs text-white font-semibold bg-primary">
        {size}
      </div>
    </Tooltip>
  )
}
