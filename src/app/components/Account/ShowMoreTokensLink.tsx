import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { EvmTokenType, RuntimeAccount, type Token } from '../../../oasis-nexus/api'
import { RouteUtils } from '../../utils/route-utils'
import { accountTokenContainerId } from '../../pages/AccountDetailsPage/AccountTokensCard'
import { RouterLink } from '../../components/RouterLink'

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
    account,
    account.address_eth ?? account.address,
    EvmTokenType.ERC20,
    accountTokenContainerId,
  )

  const additionalTokensCounter = tokens.length - pills.length

  if (!additionalTokensCounter) {
    return null
  }

  return (
    <StyledLink to={erc20link} color="inherit" replace>
      {t('account.showMore', { counter: additionalTokensCounter })}
    </StyledLink>
  )
}
