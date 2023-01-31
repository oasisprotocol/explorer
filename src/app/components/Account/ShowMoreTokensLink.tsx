import { FC } from 'react'
import { useHref, Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'
import { type Token } from '../../../oasis-indexer/generated/api'

export const StyledLink = styled(RouterLink)(({ theme }) => ({
  color: COLORS.brandDark,
  fontWeight: 600,
  textDecoration: 'none',
  marginLeft: theme.spacing(4),
}))

type ShowMoreTokensLinkProps = {
  tokens: Token[]
  pills: Token[]
}

export const ShowMoreTokensLink: FC<ShowMoreTokensLinkProps> = ({ tokens, pills }) => {
  const { t } = useTranslation()
  const additionalTokensCounter = tokens.length - pills.length

  if (!additionalTokensCounter) {
    return null
  }

  // link to ERC20 tab otherwise if there are only ERC721 tokens not included in pills link to the ERC721
  const pillsSymbols = new Set(pills.map(({ token_symbol }) => token_symbol))
  const showMoreItems = tokens.filter(({ token_symbol }) => !pillsSymbols.has(token_symbol))
  const hasERC20 = showMoreItems.some(item => item.token_type === 'ERC20')
  const targetShowMoreLink = hasERC20 ? useHref('tokens/erc-20') : useHref('tokens/erc-721')

  return (
    <StyledLink to={targetShowMoreLink} color="inherit">
      {t('account.showMore', { counter: additionalTokensCounter })}
    </StyledLink>
  )
}
