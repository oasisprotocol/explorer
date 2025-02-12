import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { EvmTokenType, RuntimeAccount, type Token } from '../../../oasis-nexus/api'
import { RouteUtils } from '../../utils/route-utils'
import { tokenContainerId } from '../../utils/tabAnchors'

export const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: COLORS.brandDark,
  fontWeight: 700,
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
    account,
    account.address_eth ?? account.address,
    EvmTokenType.ERC20,
    tokenContainerId,
  )
  const erc721Link = RouteUtils.getAccountTokensRoute(
    account,
    account.address_eth ?? account.address,
    EvmTokenType.ERC721,
    tokenContainerId,
  )

  const additionalTokensCounter = tokens.length - pills.length

  if (!additionalTokensCounter) {
    return null
  }

  // link to ERC20 tab otherwise if there are only ERC721 tokens not included in pills link to the ERC721
  const pillsSymbols = new Set(pills.map(({ token_contract_addr }) => token_contract_addr))
  const showMoreItems = tokens.filter(({ token_contract_addr }) => !pillsSymbols.has(token_contract_addr))
  const hasERC20 = showMoreItems.some(item => item.token_type === EvmTokenType.ERC20)
  const targetShowMoreLink = hasERC20 ? erc20link : erc721Link

  return (
    <StyledLink to={targetShowMoreLink} color="inherit">
      {t('account.showMore', { counter: additionalTokensCounter })}
    </StyledLink>
  )
}
