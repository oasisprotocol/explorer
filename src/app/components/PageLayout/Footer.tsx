import { FC, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useScreenSize } from '../../hooks/useScreensize'
import { useConstant } from '../../hooks/useConstant'
import { AppendMobileSearch } from '../AppendMobileSearch'
import { SearchScope } from '../../../types/searchScope'
import { api, github } from '../../utils/externalLinks'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'
import { socialMedia, legalDocuments } from '../../utils/externalLinks'
import telegram from '../DiscoverMore/images/telegram_black.svg'
import twitter from '../DiscoverMore/images/twitter_black.svg'
import discord from '../DiscoverMore/images/discord_black.svg'
import youtube from '../DiscoverMore/images/youtube_black.svg'
import reddit from '../DiscoverMore/images/reddit_black.svg'
import linkedin from '../DiscoverMore/images/linkedin_black.svg'
import { NotebookText, Home } from 'lucide-react'

interface FooterProps {
  scope?: SearchScope
  mobileSearchAction?: ReactNode
  enableMobileSearch?: boolean
}

type SocialLinkProps = {
  label: string
  href: string
  imgSrc?: string
  img?: ReactNode
}

const SocialLinkFooter: FC<SocialLinkProps> = ({ label, href, imgSrc }) => {
  return (
    <Link href={href} rel="noopener noreferrer" target="_blank">
      {imgSrc && <img src={imgSrc} alt={label} className="h-5 inline-block" />}
    </Link>
  )
}

export const Footer: FC<FooterProps> = ({ scope, mobileSearchAction, enableMobileSearch = true }) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useScreenSize()
  const currentYear = useConstant(() => new Date().getFullYear())
  const hasMobileAction = isMobile && mobileSearchAction

  return (
    <footer className="flex flex-col py-4 md:pb-4 md:pt-6">
      <div className={cn('flex justify-between items-center sm:px-0', enableMobileSearch ? 'px-2' : 'px-4')}>
        {isTablet ? (
          <AppendMobileSearch
            scope={scope}
            action={isMobile && mobileSearchAction}
            enableMobileSearch={enableMobileSearch}
          >
            <Typography variant="xsmall" textColor="muted" className="flex items-center gap-0.5 flex-wrap">
              <span className="whitespace-nowrap">{t('footer.mobileTitle')} |</span>
              <span className={cn(!!hasMobileAction && 'order-1 basis-full sm:order-none sm:basis-auto')}>
                {!hasMobileAction && ' | '}
              </span>
              <span>{currentYear}</span>
            </Typography>
          </AppendMobileSearch>
        ) : (
          <>
            <div className="flex flex-1 flex-wrap items-center">
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
            <div className="flex items-center gap-6 ">
              <Typography variant="xsmall" textColor="muted">
                {t('footer.title')} {' | '}
                <Link
                  textColor="inherit"
                  href={legalDocuments.privacyPolicy}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t('privacyPolicy')}
                </Link>
                {' | '}
                {currentYear}
              </Typography>
              <div>
                <div className="h-5 flex items-center gap-4 justify-between">
                  {socialMedia.telegram && (
                    <SocialLinkFooter
                      label={t('social.telegram')}
                      href={socialMedia.telegram}
                      imgSrc={telegram}
                    />
                  )}
                  {socialMedia.twitter && (
                    <SocialLinkFooter
                      label={t('social.twitter')}
                      href={socialMedia.twitter}
                      imgSrc={twitter}
                    />
                  )}
                  {socialMedia.discord && (
                    <SocialLinkFooter
                      label={t('social.discord')}
                      href={socialMedia.discord}
                      imgSrc={discord}
                    />
                  )}
                  {socialMedia.youtube && (
                    <SocialLinkFooter
                      label={t('social.youtube')}
                      href={socialMedia.youtube}
                      imgSrc={youtube}
                    />
                  )}
                  {socialMedia.reddit && (
                    <SocialLinkFooter label={t('social.reddit')} href={socialMedia.reddit} imgSrc={reddit} />
                  )}
                  {socialMedia.linkedin && (
                    <SocialLinkFooter
                      label={t('social.linkedin')}
                      href={socialMedia.linkedin}
                      imgSrc={linkedin}
                    />
                  )}
                  {socialMedia.docs && (
                    <SocialLinkFooter
                      label={t('social.docs')}
                      href={socialMedia.docs}
                      img={<NotebookText className="size-5 text-foreground" />}
                    />
                  )}
                  {socialMedia.home && (
                    <SocialLinkFooter
                      label={t('social.home')}
                      href={socialMedia.home}
                      img={<Home className="size-5 text-foreground" />}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </footer>
  )
}
