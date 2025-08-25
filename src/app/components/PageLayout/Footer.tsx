import { FC, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
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

  return (
    <footer>
      <div
        className={`flex justify-between items-center sm:px-6 py-6 ${enableMobileSearch ? 'px-2' : 'px-4'}`}
      >
        {isTablet ? (
          <AppendMobileSearch
            scope={scope}
            action={isMobile && mobileSearchAction}
            enableMobileSearch={enableMobileSearch}
          >
            <StyledTypography variant="footer">
              <div className="whitespace-nowrap">{t('footer.mobileTitle')} |</div>
              <div className={hasMobileAction ? 'order-1 basis-full sm:order-none sm:basis-auto' : ''}>
                <ReopenAnalyticsConsentButton />
                {!hasMobileAction && ' | '}
              </div>
              <div>{currentYear}</div>
            </StyledTypography>
          </AppendMobileSearch>
        ) : (
          <>
            <div className="flex items-center">
              {import.meta.env.REACT_APP_BUILD_SHA && (
                <Typography variant="footer">
                  <Trans
                    t={t}
                    i18nKey="footer.version"
                    components={{
                      ReleaseLink: import.meta.env.REACT_APP_BUILD_VERSION ? (
                        <Link
                          href={`${github.releaseTag}${import.meta.env.REACT_APP_BUILD_VERSION}`}
                          rel="noopener noreferrer"
                          target="_blank"
                          sx={{ color: theme.palette.layout.main }}
                        />
                      ) : (
                        <>-</>
                      ),
                      CommitLink: (
                        <Link
                          href={`${github.commit}${import.meta.env.REACT_APP_BUILD_SHA}`}
                          rel="noopener noreferrer"
                          target="_blank"
                          sx={{ color: theme.palette.layout.main }}
                        />
                      ),
                    }}
                    values={{
                      buildTime: t('common.formattedDateTime', {
                        timestamp: new Date(Number(import.meta.env.REACT_APP_BUILD_DATETIME)),
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
                      sha: import.meta.env.REACT_APP_BUILD_SHA.substring(0, 7),
                      version: import.meta.env.REACT_APP_BUILD_VERSION
                        ? import.meta.env.REACT_APP_BUILD_VERSION.replace('v', '')
                        : '-',
                    }}
                  />
                </Typography>
              )}
              <div className="flex gap-2 pl-1">
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
              </div>
            </div>
            <Typography variant="footer">
              {t('footer.title')} | <ReopenAnalyticsConsentButton /> | {currentYear}
            </Typography>
          </>
        )}
      </div>
    </footer>
  )
}
