import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { RuntimeAccount, type Token } from '../../../oasis-indexer/api'
import { RouteUtils } from '../../utils/route-utils'

export const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: COLORS.brandDark,
  fontWeight: 600,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  marginLeft: theme.spacing(4),
}))

type ShowMoreTokensLinkProps = {
  account: RuntimeAccount
  tokens: Token[]
  pills: Token[]
}

export const ShowMoreTokensLink: FC<ShowMoreTokensLinkProps> = ({ account, tokens, pills }) => {
  const { t } = useTranslation()
  const erc20link = RouteUtils.getAccountTokensRoute(
    account.address_eth ?? account.address,
    account.layer,
    'ERC20',
    undefined,
  )
  const erc721Link = RouteUtils.getAccountTokensRoute(
    account.address_eth ?? account.address,
    account.layer,
    'ERC721',
    undefined,
  )
  const additionalTokensCounter = tokens.length - pills.length

  if (!additionalTokensCounter) {
    return null
  }

  // link to ERC20 tab otherwise if there are only ERC721 tokens not included in pills link to the ERC721
  const pillsSymbols = new Set(pills.map(({ token_contract_addr }) => token_contract_addr))
  const showMoreItems = tokens.filter(({ token_contract_addr }) => !pillsSymbols.has(token_contract_addr))
  const hasERC20 = showMoreItems.some(item => item.token_type === 'ERC20')
  const targetShowMoreLink = hasERC20 ? erc20link : erc721Link

  return (
    <StyledLink to={targetShowMoreLink} color="inherit">
      {t('account.showMore', { counter: additionalTokensCounter })}
    </StyledLink>
  )
}
