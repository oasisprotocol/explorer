import { FC } from 'react'
import { Search } from '../../components/Search'
import { useTranslation } from 'react-i18next'
import { useSearchQueryNetworkParam } from '../../hooks/useSearchQueryNetworkParam'
import { useIsApiReachable } from '../../components/OfflineBanner/hook'

import SearchBg from './images/search-bg.png'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

export const HomeSearch: FC = () => {
  const { t } = useTranslation()
  const { network } = useSearchQueryNetworkParam()
  const isApiReachable = useIsApiReachable(network).reachable

  return (
    <div
      id="search"
      style={{ backgroundImage: `url(${SearchBg})` }}
      className="py-12 px-4 md:px-8 md:p-24 bg-[#DFDEF5] bg-cover bg-center bg-no-repeat rounded-md mb-4 md:mb-6"
    >
      <Typography
        variant="h2"
        className="text-center justify-start text-foreground text-2xl md:text-3xl font-semibold leading-8 mb-4 md:mb-8"
      >
        {t('home.search')}
      </Typography>

      <Search disabled={!isApiReachable} />
    </div>
  )
}
