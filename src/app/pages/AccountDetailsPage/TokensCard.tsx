import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import { TokensEmptyState } from './TokensEmptyState'

type TokensCardProps = {
  type: 'erc-20' | 'erc-721'
}

export const TokensCard: FC<TokensCardProps> = ({ type }) => {
  const { t } = useTranslation()
  const tokenLabel = t(`account.${type}`)

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('account.tokensListTitle', { token: tokenLabel })}
      />
      <CardContent>
        <TokensEmptyState label={tokenLabel} />
      </CardContent>
    </Card>
  )
}
