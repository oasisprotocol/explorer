import React, { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useScreenSize } from '../../hooks/useScreensize'
import backgroundSocial from './images/background-social.png'
import telegram from './images/telegram.svg'
import twitter from './images/twitter.svg'
import discord from './images/discord.svg'
import youtube from './images/youtube.svg'
import reddit from './images/reddit.svg'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import DocsIcon from '@mui/icons-material/MenuBook'
import HomeIcon from '@mui/icons-material/Cottage'
import { COLORS } from '../../../styles/theme/colors'
import { socialMedia } from '../../utils/externalLinks'

type SocialLinkProps = {
  label: string
  href: string
  isMobile: boolean
  imgSrc?: string
  img?: ReactNode
}

const SocialLink: FC<SocialLinkProps> = ({ label, href, isMobile, imgSrc, img }) => {
  return (
    <Link
      href={href}
      color={COLORS.white}
      underline="none"
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        mx: isMobile ? 4 : 0,
        mt: isMobile ? 4 : 0,
      }}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <>
          {imgSrc && <img src={imgSrc} alt={label} height={40} />}
          {img}
        </>
      </Box>
      <Typography sx={{ fontSize: 18, fontWeight: 700, mb: isMobile ? 4 : 0 }}>{label}</Typography>
    </Link>
  )
}

const iconProps = { sx: { fontSize: 50, margin: '-4px' } }

export const Social: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  return (
    <Grid
      container
      sx={{
        px: isMobile ? 5 : 6,
        pt: 5,
        pb: isMobile ? 4 : 5,
        backgroundColor: COLORS.brandDark,
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: COLORS.white,
        borderRadius: '12px',
        backgroundImage: `url(${backgroundSocial})`,
        backgroundSize: 'cover',
      }}
    >
      <Grid xs={12} md={4}>
        <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 3 }} color={COLORS.white}>
          {t('social.header')}
        </Typography>
        <Typography color={COLORS.white} sx={{ maxWidth: 230 }}>
          {t('social.description')}
        </Typography>
      </Grid>
      <Grid xs={12} md={8}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'space-between',
            width: '100%',
            height: '100%',
          }}
        >
          {socialMedia.telegram && (
            <SocialLink
              isMobile={isMobile}
              label={t('social.telegram')}
              href={socialMedia.telegram}
              imgSrc={telegram}
            />
          )}
          {socialMedia.twitter && (
            <SocialLink
              isMobile={isMobile}
              label={t('social.twitter')}
              href={socialMedia.twitter}
              imgSrc={twitter}
            />
          )}
          {socialMedia.discord && (
            <SocialLink
              isMobile={isMobile}
              label={t('social.discord')}
              href={socialMedia.discord}
              imgSrc={discord}
            />
          )}
          {socialMedia.youtube && (
            <SocialLink
              isMobile={isMobile}
              label={t('social.youtube')}
              href={socialMedia.youtube}
              imgSrc={youtube}
            />
          )}
          {socialMedia.reddit && (
            <SocialLink
              isMobile={isMobile}
              label={t('social.reddit')}
              href={socialMedia.reddit}
              imgSrc={reddit}
            />
          )}
          {socialMedia.linkedin && (
            <SocialLink
              isMobile={isMobile}
              label={t('social.linkedin')}
              href={socialMedia.linkedin}
              img={<LinkedInIcon {...iconProps} />}
            />
          )}
          {socialMedia.docs && (
            <SocialLink
              isMobile={isMobile}
              label={t('social.docs')}
              href={socialMedia.docs}
              img={<DocsIcon {...iconProps} />}
            />
          )}
          {socialMedia.home && (
            <SocialLink
              isMobile={isMobile}
              label={t('social.home')}
              href={socialMedia.home}
              img={<HomeIcon {...iconProps} />}
            />
          )}
        </Box>
      </Grid>
    </Grid>
  )
}
