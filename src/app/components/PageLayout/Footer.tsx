import { FC, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled } from '@mui/material/styles'
import Link from '@mui/material/Link'
import { useTheme } from '@mui/material/styles'
import { useConstant } from '../../hooks/useConstant'
import { AppendMobileSearch } from '../AppendMobileSearch'
import { SearchScope } from '../../../types/searchScope'
import { api, github } from '../../utils/externalLinks'
import { ReopenAnalyticsConsentButton } from 'app/components/AnalyticsConsent'

const FooterBox = styled(Box, {
  shouldForwardProp: prop => prop !== 'enableMobileSearch',
})<{ enableMobileSearch: boolean }>(({ theme, enableMobileSearch }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  padding: theme.spacing(5, enableMobileSearch ? 4 : 0),
  [theme.breakpoints.up('sm')]: {
    flex: '0 1 100%',
    padding: theme.spacing(5, 0),
  },
}))

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}))

const StyledLinksGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  paddingLeft: theme.spacing(2),
}))

const StyledTypography = styled(Typography)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  flexWrap: 'wrap',
}))

interface FooterProps {
  scope?: SearchScope
  mobileSearchAction?: ReactNode
  enableMobileSearch?: boolean
}

export const Footer: FC<FooterProps> = ({ scope, mobileSearchAction, enableMobileSearch = true }) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { isMobile, isTablet } = useScreenSize()
  const currentYear = useConstant(() => new Date().getFullYear())
  const hasMobileAction = isMobile && mobileSearchAction
  const privacyPolicyLinkStyles = hasMobileAction ? { order: 1, flexBasis: '100%' } : {}

  return (
    <footer>
      <FooterBox enableMobileSearch={enableMobileSearch}>
        {isTablet ? (
          <AppendMobileSearch
            scope={scope}
            action={isMobile && mobileSearchAction}
            enableMobileSearch={enableMobileSearch}
          >
            <StyledTypography variant="footer">
              <Box sx={{ whiteSpace: 'nowrap' }}>{t('footer.mobileTitle')} |</Box>
              <Box sx={privacyPolicyLinkStyles}>
                <ReopenAnalyticsConsentButton />
                {!hasMobileAction && ' | '}
              </Box>
              <Box>{currentYear}</Box>
            </StyledTypography>
          </AppendMobileSearch>
        ) : (
          <>
            <StyledBox>
              {process.env.REACT_APP_BUILD_SHA && (
                <Typography variant="footer">
                  <Trans
                    t={t}
                    i18nKey="footer.version"
                    components={{
                      ReleaseLink: process.env.REACT_APP_BUILD_VERSION ? (
                        <Link
                          href={`${github.releaseTag}${process.env.REACT_APP_BUILD_VERSION}`}
                          rel="noopener noreferrer"
                          target="_blank"
                          sx={{ color: theme.palette.layout.main }}
                        />
                      ) : (
                        <>-</>
                      ),
                      CommitLink: (
                        <Link
                          href={`${github.commit}${process.env.REACT_APP_BUILD_SHA}`}
                          rel="noopener noreferrer"
                          target="_blank"
                          sx={{ color: theme.palette.layout.main }}
                        />
                      ),
                    }}
                    values={{
                      buildTime: t('common.formattedDateTime', {
                        timestamp: new Date(Number(process.env.REACT_APP_BUILD_DATETIME)),
                        formatParams: {
                          timestamp: {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                          } satisfies Intl.DateTimeFormatOptions,
                        },
                      }),
                      sha: process.env.REACT_APP_BUILD_SHA.substring(0, 7),
                      version: process.env.REACT_APP_BUILD_VERSION
                        ? process.env.REACT_APP_BUILD_VERSION.replace('v', '')
                        : '-',
                    }}
                  />
                </Typography>
              )}
              <StyledLinksGroup>
                <Typography variant="footer">
                  {' | '}
                  <Link
                    href={api.spec}
                    rel="noopener noreferrer"
                    target="_blank"
                    sx={{ color: theme.palette.layout.main }}
                  >
                    {t('footer.apiDocs')}
                  </Link>
                </Typography>
                <Typography variant="footer">
                  <Link
                    href={github.home}
                    rel="noopener noreferrer"
                    target="_blank"
                    sx={{ color: theme.palette.layout.main }}
                  >
                    {t('footer.github')}
                  </Link>
                </Typography>
              </StyledLinksGroup>
            </StyledBox>
            <Typography variant="footer">
              {t('footer.title')} | <ReopenAnalyticsConsentButton /> | {currentYear}
            </Typography>
          </>
        )}
      </FooterBox>
    </footer>
  )
}
