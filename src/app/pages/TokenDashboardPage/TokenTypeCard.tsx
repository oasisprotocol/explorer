import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { SnapshotCard } from '../../components/Snapshots/SnapshotCard'
import { useTokenInfo } from './hooks'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/skeleton'
import { getTokenTypeDescription, getTokenTypeStrictName } from '../../../types/tokens'
import { RuntimeScope } from '../../../types/searchScope'

export const TokenTypeCard: FC<{ scope: RuntimeScope; address: string }> = ({ scope, address }) => {
  const { t } = useTranslation()

  const { isLoading, token, isFetched } = useTokenInfo(scope, address)

  return (
    <SnapshotCard title={t('common.type')} alignWithCardsWithActions>
      <div className="flex items-center justify-center h-fullr">
        {isLoading ? (
          <Skeleton className="h-4 w-1/2" />
        ) : (
          isFetched && (
            <Typography className="text-primary text-center text-2xl font-semibold">
              {token?.type ? (
                <>
                  {getTokenTypeDescription(t, token.type)}
                  <Typography variant="large" textColor="muted" className="flex font-normal">
                    ({getTokenTypeStrictName(t, token.type)})
                  </Typography>
                </>
              ) : (
                '-'
              )}
            </Typography>
          )
        )}
      </div>
    </SnapshotCard>
  )
}
