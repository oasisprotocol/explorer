import { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import social from './images/social.png'
import telegram from './images/telegram.svg'
import twitter from './images/twitter.svg'
import discord from './images/discord.svg'
import youtube from './images/youtube.svg'
import reddit from './images/reddit.svg'

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
      color="#fff"
      underline="none"
      sx={{ display: 'flex', flexDirection: 'column', mx: isMobile ? 5 : 0, mt: isMobile ? 4 : 0 }}
      rel="noopener noreferrer"
      target="_blank"
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <img src={img} alt={label} height={40} />
      </Box>
      <Typography sx={{ mb: isMobile ? 4 : 0 }}>{label}</Typography>
    </Link>
  )
}

export function Social() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Grid
      container
      sx={{
        px: isMobile ? 5 : 6,
        pt: 5,
        pb: isMobile ? 4 : 5,
        border: 'solid 1px #fff',
        borderRadius: 12,
        backgroundImage: `url(${social})`,
        backgroundSize: 'cover',
      }}
    >
      <Grid xs={12} md={4}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }} color="#fff">
          Join us
        </Typography>
        <Typography color="#fff" sx={{ maxWidth: 230 }}>
          Be part of the community and stay in the loop on everything Oasis
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
            label="Telegram"
            href="https://t.me/oasisprotocolcommunity"
            img={telegram}
          />
          <SocialLink
            isMobile={isMobile}
            label="Twitter"
            href="https://twitter.com/oasisprotocol"
            img={twitter}
          />
          <SocialLink
            isMobile={isMobile}
            label="Discord"
            href="https://discord.gg/BQCxwhT5wS"
            img={discord}
          />
          <SocialLink
            isMobile={isMobile}
            label="Youtube"
            href="https://www.youtube.com/channel/UC35UFPcZ2F1wjPxhPrSsESQ"
            img={youtube}
          />
          <SocialLink
            isMobile={isMobile}
            label="Reddit"
            href="https://www.reddit.com/r/oasisnetwork/"
            img={reddit}
          />
        </Box>
      </Grid>
    </Grid>
  )
}
