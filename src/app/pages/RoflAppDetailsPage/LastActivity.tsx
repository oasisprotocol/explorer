import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { formatDistanceStrict } from 'date-fns'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import { RuntimeTransaction } from '../../../oasis-nexus/api'
import { SearchScope } from '../../../types/searchScope'
import { TransactionLink } from '../../components/Transactions/TransactionLink'
import { useScreenSize } from '../../hooks/useScreensize'

const StyledBox = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 5,
}))

type LastActivityProps = {
  transaction: RuntimeTransaction | undefined
  scope: SearchScope
}

export const LastActivity: FC<LastActivityProps> = ({ scope, transaction }) => {
  const { t } = useTranslation()
  const { isTablet } = useScreenSize()

  return (
    <>
      {transaction ? (
        <StyledBox>
          <TransactionLink
            scope={scope}
            hash={transaction.eth_hash ?? transaction.hash}
            alwaysTrim={isTablet}
          />
          <span>
            (
            {formatDistanceStrict(transaction.timestamp, new Date(), {
              addSuffix: true,
            })}
            )
          </span>
        </StyledBox>
      ) : (
        t('common.missing')
      )}
    </>
  )
}
