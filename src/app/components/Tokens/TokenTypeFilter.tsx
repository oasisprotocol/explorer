import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { EvmTokenType } from '../../../oasis-nexus/api'
import { FilterButtons } from '../FilterButtons'

type TokenTypeFilterProps = {
  onSelect: (type: EvmTokenType) => void
  value: EvmTokenType
}

export const TokenTypeFilter: FC<TokenTypeFilterProps> = props => {
  const { t } = useTranslation()
  const options = [
    {
      label: t('account.ERC20'),
      value: EvmTokenType.ERC20,
    },
    {
      label: t('account.ERC721'),
      value: EvmTokenType.ERC721,
    },
  ]

  return <FilterButtons options={options} {...props} />
}
