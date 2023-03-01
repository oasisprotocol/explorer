import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import backgroundSocial from './images/background-social.png'
import telegram from './images/telegram.svg'
import twitter from './images/twitter.svg'
import discord from './images/discord.svg'
import youtube from './images/youtube.svg'
import reddit from './images/reddit.svg'
import { COLORS } from '../../../styles/theme/colors'
import { socialMedia } from '../../utils/externalLinks'

type SocialLinkProps = {
  label: string
  href: string
  isMobile: boolean
  img: string
}

const SocialLink: FC<SocialLinkProps> = ({ label, href, isMobile, img }) => {
  return (
    <Link
      href={href}
      color={COLORS.white}
      underline="none"
      sx={{ display: 'flex', flexDirection: 'column', mx: isMobile ? 4 : 0, mt: isMobile ? 4 : 0 }}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <img src={img} alt={label} height={40} />
      </Box>
      <Typography sx={{ fontSize: 18, fontWeight: 700, mb: isMobile ? 4 : 0 }}>{label}</Typography>
    </Link>
  )
}

export const Social: FC = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Grid
      container
      sx={{
        px: isMobile ? 5 : 6,
        pt: 5,
        pb: isMobile ? 4 : 5,
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
          <SocialLink
            isMobile={isMobile}
            label={t('social.telegram')}
            href={socialMedia.telegram}
            img={telegram}
          />
          <SocialLink
            isMobile={isMobile}
            label={t('social.twitter')}
            href={socialMedia.twitter}
            img={twitter}
          />
          <SocialLink
            isMobile={isMobile}
            label={t('social.discord')}
            href={socialMedia.discord}
            img={discord}
          />
          <SocialLink
            isMobile={isMobile}
            label={t('social.youtube')}
            href={socialMedia.youtube}
            img={youtube}
          />
          <SocialLink isMobile={isMobile} label={t('social.reddit')} href={socialMedia.reddit} img={reddit} />
        </Box>
      </Grid>
    </Grid>
  )
}
