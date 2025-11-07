import { FC } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { useTranslation } from 'react-i18next'
import { EvmTokenType, RuntimeAccount, type Token } from '../../../oasis-nexus/api'
import { RouteUtils } from '../../utils/route-utils'
import { tokenContainerId } from '../../utils/tabAnchors'

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
    <Link asChild className="ml-4 font-medium">
      <RouterLink to={targetShowMoreLink}>
        {t('account.showMore', { counter: additionalTokensCounter })}
      </RouterLink>
    </Link>
  )
}
