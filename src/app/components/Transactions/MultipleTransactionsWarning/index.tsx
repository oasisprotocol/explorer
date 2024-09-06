import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Alert from '@mui/material/Alert'
import { styled } from '@mui/material/styles'

type MultipleTransactionsWarningProps = {
  enable: boolean | undefined
}

const StyledAlert = styled(Alert)(() => ({
  marginBottom: '1em',
}))

export const MultipleTransactionsWarning: FC<MultipleTransactionsWarningProps> = ({ enable }) => {
  const { t } = useTranslation()

  if (!enable) {
    return null
  }

  return <StyledAlert severity="error">{t('transaction.warningMultipleTransactionsSameHash')}</StyledAlert>
}
