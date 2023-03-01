import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Link from '@mui/material/Link'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ShowMoreTokensLink } from './ShowMoreTokensLink'
import { RoundedBalance } from '../RoundedBalance'
import { type RuntimeEvmBalance } from '../../../oasis-indexer/api'
import { useLayerHref } from '../../hooks/useLayerHref'

type TokenPillsProps = {
  tokens: RuntimeEvmBalance[] | undefined
}

export const TokenPills: FC<TokenPillsProps> = ({ tokens }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  if (!tokens?.length) {
    return <Typography sx={{ opacity: '0.5' }}>{t('account.noTokens')}</Typography>
  }
  const pills = tokens.slice(0, isMobile ? 1 : 3)

  return (
    <>
      {pills.map(item => (
        <Pill key={item.token_contract_addr} pill={item} />
      ))}

      <ShowMoreTokensLink tokens={tokens} pills={pills} />
    </>
  )
}

type PillProps = {
  pill: RuntimeEvmBalance
}

export const Pill: FC<PillProps> = ({ pill }) => {
  const href = `${useLayerHref(pill.token_type === 'ERC20' ? 'tokens/erc-20' : 'tokens/erc-721')}#${
    pill.token_contract_addr
  }`

  return (
    <Chip
      clickable
      color="tertiary"
      component={Link}
      href={href}
      key={pill.token_contract_addr}
      label={
        <>
          <RoundedBalance value={pill.balance} ticker={pill.token_symbol} />
        </>
      }
      sx={{ mr: 2 }}
      variant="outlined"
    />
  )
}
