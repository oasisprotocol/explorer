import { FC } from 'react'
import { AccountMetadataSource } from '../../data/named-accounts'
import { exhaustedTypeWarning } from '../../../types/errors'
import { useTranslation } from 'react-i18next'
import { BookmarkIcon, BookmarkCheckIcon } from 'lucide-react'

interface AccountMetadataSourceIndicatorProps {
  source: AccountMetadataSource
  withText?: boolean
}

export const AccountMetadataSourceIndicator: FC<AccountMetadataSourceIndicatorProps> = ({
  source,
  withText,
}) => {
  const { t } = useTranslation()

  const renderWithOrWithoutLabel = (label: string, labelNeeded: boolean, icon: JSX.Element) =>
    labelNeeded ? (
      <div className="inline-flex items-center gap-1 font-normal">
        {icon}
        {label}
      </div>
    ) : (
      icon
    )

  switch (source) {
    case 'OasisRegistry':
      return renderWithOrWithoutLabel(
        t('account.namedByOasis'),
        !!withText,
        <BookmarkCheckIcon className="text-success w-4 h-4 mr-1" />,
      )
    case 'DeltaDaoRegistry':
      return renderWithOrWithoutLabel(
        t('account.namedByDeltaDao'),
        !!withText,
        <BookmarkCheckIcon className="text-success w-4 h-4 mr-1" />,
      )
    case 'SelfProfessed':
      return renderWithOrWithoutLabel(
        t('account.namedBySelf'),
        !!withText,
        <BookmarkIcon className="text-muted-foreground w-4 h-4 mr-1" />,
      )
    default:
      exhaustedTypeWarning('Unexpected account metadata source', source)
      return '?'
  }
}
