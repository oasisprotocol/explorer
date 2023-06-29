import { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { useTheme } from '@mui/material/styles'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { AppendMobileSearch } from '../../components/AppendMobileSearch'
import { useRequiredScopeParam } from '../../hooks/useScopeParam'
import { TokenSupplyCard } from './TokenSupplyCard'
import { TokenHoldersCard } from './TokenHoldersCard'
import { TokenTypeCard } from './TokenTypeCard'
import { TokenTotalTransactionsCard } from './TokenTotalTransactionsCard'

const StyledGrid = styled(Grid)(() => ({
  display: 'flex',
}))

export const TokenSnapshot: FC = () => {
  const { t } = useTranslation()

  const scope = useRequiredScopeParam()
  const theme = useTheme()
  const { isMobile } = useScreenSize()

  return (
    <>
      <Grid container sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
        <Grid item xs={12} sx={{ px: isMobile ? 4 : 0 }}>
          <AppendMobileSearch scope={scope}>
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', mb: 2 }}>
              <Typography
                variant="h3"
                sx={{ color: theme.palette.layout.main, fontWeight: 700, mr: 3, mb: isMobile ? 4 : 0 }}
              >
                {t('tokenSnapshot.header')}
              </Typography>
            </Box>
          </AppendMobileSearch>
        </Grid>
      </Grid>

      <Grid container rowSpacing={1} columnSpacing={4} columns={22}>
        <StyledGrid item xs={22} md={5}>
          <TokenTotalTransactionsCard />
        </StyledGrid>
        <StyledGrid item xs={22} md={6}>
          <TokenSupplyCard />
        </StyledGrid>
        <StyledGrid item xs={22} md={5}>
          <TokenHoldersCard />
        </StyledGrid>
        <StyledGrid item xs={22} md={6}>
          <TokenTypeCard />
        </StyledGrid>
      </Grid>
    </>
  )
}
