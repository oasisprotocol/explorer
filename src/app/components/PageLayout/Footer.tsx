import { FC, ReactNode } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import { styled } from '@mui/material/styles'
import Link from '@mui/material/Link'
import { useConstant } from '../../hooks/useConstant'
import { AppendMobileSearch } from '../AppendMobileSearch'
import { SearchScope } from '../../../types/searchScope'
import { COLORS } from '../../../styles/theme/colors'
import { github } from '../../utils/externalLinks'

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
                <Trans
                  t={t}
                  i18nKey="footer.version"
                  components={{
                    ReleaseLink: process.env.REACT_APP_BUILD_VERSION ? (
                      <Link
                        href={`${github.releaseTag}${process.env.REACT_APP_BUILD_VERSION}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        sx={{ color: COLORS.white }}
                      />
                    ) : (
                      <>-</>
                    ),
                    CommitLink: (
                      <Link
                        href={`${github.commit}${process.env.REACT_APP_BUILD_SHA}`}
                        rel="noopener noreferrer"
                        target="_blank"
                        sx={{ color: COLORS.white }}
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

            <Typography variant="footer">
              {isTablet ? t('footer.mobileTitle') : t('footer.title')} | {currentYear}
            </Typography>
          </>
        )}
      </FooterBox>
    </footer>
  )
}
