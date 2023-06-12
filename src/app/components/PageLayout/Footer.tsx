import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled } from '@mui/material/styles'
import { useConstant } from '../../hooks/useConstant'
import { AppendMobileSearch } from '../AppendMobileSearch'
import { SearchScope } from '../../../types/searchScope'

const FooterBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  padding: `${theme.spacing(5)} ${theme.spacing(4)}`,
  [theme.breakpoints.up('sm')]: {
    flex: '0 1 100%',
    padding: `${theme.spacing(5)} ${theme.spacing(6)}`,
  },
}))

interface FooterProps {
  scope?: SearchScope
  mobileSearchAction?: ReactNode
}

export const Footer: FC<FooterProps> = ({ scope, mobileSearchAction }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useScreenSize()
  const currentYear = useConstant(() => new Date().getFullYear())

  return (
    <footer>
      <FooterBox>
        {isTablet ? (
          <AppendMobileSearch scope={scope} action={isMobile && mobileSearchAction}>
            <Typography variant="footer">
              {isTablet ? t('footer.mobileTitle') : t('footer.title')} | {currentYear}
            </Typography>
          </AppendMobileSearch>
        ) : (
          <>
            {process.env.REACT_APP_BUILD_SHA && (
              <Typography variant="footer">
                {t('footer.version', { buildSha: process.env.REACT_APP_BUILD_SHA.substring(0, 7) })}
              </Typography>
            )}

            <Typography variant="footer">
              {isTablet ? t('footer.mobileTitle') : t('footer.title')} | {currentYear}
            </Typography>
          </>
        )}
      </FooterBox>
    </footer>
  )
}
