import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Chip from '@mui/material/Chip'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../styles/theme/colors'

export const StyledLink = styled(Link)(({ theme }) => ({
  color: COLORS.brandDark,
  fontWeight: 600,
  textDecoration: 'none',
  marginLeft: theme.spacing(4),
}))

type Token = {
  balance: number
  label: string
}
type TokenPillsProps = {
  erc20: Token[]
  erc721: Token[]
}

export const TokenPills: FC<TokenPillsProps> = ({ erc20, erc721 }) => {
  const { t } = useTranslation()
  // TODO: add logic for showing more tokens
  const hasTokens = !!(erc20.length || erc721.length)
  const pills: Token[] = []
  const showMoreCounter = 0

  return (
    <>
      {!hasTokens && <Typography sx={{ opacity: '0.5' }}>{t('account.noTokens')}</Typography>}
      {hasTokens && (
        <>
          {pills.map((token, index) => (
            <Chip
              key={token.label + index}
              sx={{ mr: 2 }}
              label={`${token.label} ${token.balance}`}
              variant="outlined"
              color="tertiary"
            />
          ))}
          {showMoreCounter && (
            <StyledLink href="#" color="inherit">
              {t('account.showMore', { counter: showMoreCounter })}
            </StyledLink>
          )}
        </>
      )}
    </>
  )
}
