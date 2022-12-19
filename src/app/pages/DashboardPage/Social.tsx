import { FC } from 'react'
import social from './images/social.png'
import telegram from './images/telegram.svg'
import twitter from './images/twitter.svg'
import discord from './images/discord.svg'
import youtube from './images/youtube.svg'
import reddit from './images/reddit.svg'
import { AppLink } from '../../components/AppLink/AppLink'
import { AppBox } from '../../components/AppBox/AppBox'
import { AppTypography } from '../../components/AppTypography/AppTypography'
import { AppGrid2 } from '../../components/AppGrid2/AppGrid2'

type SocialLinkProps = {
  label: string
  href: string
  img: string
}

const SocialLink: FC<SocialLinkProps> = ({ label, href, img }) => {
  return (
    <AppLink
      href={href}
      color="#fff"
      underline="none"
      sx={{ display: 'flex', flexDirection: 'column', mr: 6 }}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img src={img} alt={label} height={40} />
      {label}
    </AppLink>
  )
}

export function Social() {
  return (
    <AppGrid2
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
      <AppGrid2 xs={12} md={4}>
        <AppTypography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }} color="#fff">
          Join us
        </AppTypography>
        <AppTypography color="#fff" sx={{ maxWidth: 230 }}>
          Be part of the community and stay in the loop on everything Oasis
        </AppTypography>
      </AppGrid2>
      <AppGrid2 xs={12} md={8}>
        <AppBox
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            width: '100%',
            height: '100%',
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
        </AppBox>
      </AppGrid2>
    </AppGrid2>
  )
}
