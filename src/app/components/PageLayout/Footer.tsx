import { FC, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import { useConstant } from '../../hooks/useConstant'
import { AppendMobileSearch } from '../AppendMobileSearch'
import { SearchScope } from '../../../types/searchScope'
import { api, github } from '../../utils/externalLinks'
import { ReopenAnalyticsConsentButton } from 'app/components/AnalyticsConsent'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

interface FooterProps {
  scope?: SearchScope
  mobileSearchAction?: ReactNode
  enableMobileSearch?: boolean
}

export const Footer: FC<FooterProps> = ({ scope, mobileSearchAction, enableMobileSearch = true }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useScreenSize()
  const currentYear = useConstant(() => new Date().getFullYear())
  const hasMobileAction = isMobile && mobileSearchAction

  return (
    <footer>
      <div
        className={cn('flex justify-between items-center py-6 sm:px-6', enableMobileSearch ? 'px-2' : 'px-4')}
      >
        {isTablet ? (
          <AppendMobileSearch
            scope={scope}
            action={isMobile && mobileSearchAction}
            enableMobileSearch={enableMobileSearch}
          >
            <Typography variant="xsmall" textColor="muted" className="flex items-center gap-0.5 flex-wrap">
              <span className="whitespace-nowrap">{t('footer.mobileTitle')} |</span>
              <span className={cn(hasMobileAction && 'order-1 basis-full sm:order-none sm:basis-auto')}>
                <ReopenAnalyticsConsentButton />
                {!hasMobileAction && ' | '}
              </span>
              <span>{currentYear}</span>
            </Typography>
          </AppendMobileSearch>
        ) : (
          <>
            <div className="flex items-center">
              {import.meta.env.REACT_APP_BUILD_SHA && (
                <Typography variant="xsmall" textColor="muted">
                  <Trans
                    t={t}
                    i18nKey="footer.version"
                    components={{
                      ReleaseLink: import.meta.env.REACT_APP_BUILD_VERSION ? (
                        <Link
                          href={`${github.releaseTag}${import.meta.env.REACT_APP_BUILD_VERSION}`}
                          rel="noopener noreferrer"
                          target="_blank"
                          textColor="inherit"
                        />
                      ) : (
                        <>-</>
                      ),
                      CommitLink: (
                        <Link
                          href={`${github.commit}${import.meta.env.REACT_APP_BUILD_SHA}`}
                          rel="noopener noreferrer"
                          target="_blank"
                          textColor="inherit"
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
                <Typography variant="xsmall" textColor="muted">
                  {' | '}
                  <Link href={api.spec} rel="noopener noreferrer" target="_blank" textColor="inherit">
                    {t('footer.apiDocs')}
                  </Link>
                </Typography>
                <Typography variant="xsmall" textColor="muted">
                  {' | '}
                  <Link href={github.home} rel="noopener noreferrer" target="_blank" textColor="inherit">
                    {t('footer.github')}
                  </Link>
                </Typography>
              </div>
            </div>
            <Typography variant="xsmall" textColor="muted">
              {t('footer.title')} | <ReopenAnalyticsConsentButton /> | {currentYear}
            </Typography>
          </>
        )}
      </div>
    </footer>
  )
}
