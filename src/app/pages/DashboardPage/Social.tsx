import { FC } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import social from './images/social.png'
import telegram from './images/telegram.svg'
import twitter from './images/twitter.svg'
import discord from './images/discord.svg'
import youtube from './images/youtube.svg'
import reddit from './images/reddit.svg'

type SocialLinkProps = {
  label: string
  href: string
  img: string
}

const SocialLink: FC<SocialLinkProps> = ({ label, href, img }) => {
  return (
    <Link
      href={href}
      color="#fff"
      underline="none"
      sx={{ display: 'flex', flexDirection: 'column', mr: 6 }}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img src={img} alt={label} height={40} />
      {label}
    </Link>
  )
}

export function Social() {
  return (
    <Grid
      container
      sx={{
        px: 6,
        py: 4,
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
            justifyContent: 'flex-end',
            width: 1,
            height: 1,
          }}
        >
          <SocialLink label="Telegram" href="https://t.me/oasisprotocolcommunity" img={telegram} />
          <SocialLink label="Twitter" href="https://twitter.com/oasisprotocol" img={twitter} />
          <SocialLink label="Discord" href="https://discord.gg/BQCxwhT5wS" img={discord} />
          <SocialLink
            label="Youtube"
            href="https://www.youtube.com/channel/UC35UFPcZ2F1wjPxhPrSsESQ"
            img={youtube}
          />
          <SocialLink label="Reddit" href="https://www.reddit.com/r/oasisnetwork/" img={reddit} />
        </Box>
      </Grid>
    </Grid>
  )
}
