import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import telegram from './images/telegram.svg'
import twitter from './images/twitter.svg'
import discord from './images/discord.svg'
import youtube from './images/youtube.svg'
import reddit from './images/reddit.svg'
import linkedin from './images/linkedin.svg'
import { NotebookText, Home } from 'lucide-react'
import { roflApp, socialMedia } from '../../utils/externalLinks'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import RoflAppsImg from './images/rofl-apps.webp'

type SocialLinkProps = {
  label: string
  href: string
  imgSrc?: string
  img?: ReactNode
}

const SocialLink: FC<SocialLinkProps> = ({ label, href, imgSrc, img }) => {
  return (
    <Link href={href} className="flex flex-col gap-2 items-center" rel="noopener noreferrer" target="_blank">
      <div className="flex justify-center mb-2">
        <>
          {imgSrc && <img src={imgSrc} alt={label} className="h-9 inline-block" />}
          {img && <span className="[&_svg]:h-9 [&_svg]:w-9 inline-block">{img}</span>}
        </>
      </div>
      <Typography className="mb-1 text-white font-semibold">{label}</Typography>
    </Link>
  )
}

export const Social: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="w-full p-8 relative bg-primary rounded-md flex flex-col lg:flex-row gap-4 md:gap-8 justify-between items-center">
      <div className="flex flex-row self-stretch">
        <div className="flex flex-col items-start gap-2 lg:max-w-[340px]">
          <div className="text-primary-foreground text-xl md:text-2xl font-bold leading-6 md:leading-8">
            {t('social.offchainPerformance')} <br />
            {t('social.onchainTrust')}
          </div>
          <div className="justify-start text-primary-foreground text-sm font-normal leading-5 mb-2">
            {t('social.description')}
          </div>
          <Button color="secondary" variant="outline" asChild>
            <Link textColor="inherit" href={roflApp.homepage} target="_blank" rel="noopener noreferrer">
              {t('social.getStarted')}
            </Link>
          </Button>
        </div>
        <img alt={t('rofl.listTitle')} className="hidden xl:block -mt-8 max-h-[196px]" src={RoflAppsImg} />
      </div>
      <div className="flex flex-col self-stretch gap-8 lg:min-w-[500px]">
        <div>
          <Typography className="text-white text-xl md:text-2xl font-bold leading-6 md:leading-8">
            {t('social.header')}
          </Typography>
          <Typography className="text-white leading-5" variant="small">
            {t('social.community')}
          </Typography>
        </div>
        <div className="flex flex-wrap items-center gap-1 sm:gap-4 justify-evenly lg:justify-around">
          {socialMedia.telegram && (
            <SocialLink label={t('social.telegram')} href={socialMedia.telegram} imgSrc={telegram} />
          )}
          {socialMedia.twitter && (
            <SocialLink label={t('social.twitter')} href={socialMedia.twitter} imgSrc={twitter} />
          )}
          {socialMedia.discord && (
            <SocialLink label={t('social.discord')} href={socialMedia.discord} imgSrc={discord} />
          )}
          {socialMedia.youtube && (
            <SocialLink label={t('social.youtube')} href={socialMedia.youtube} imgSrc={youtube} />
          )}
          {socialMedia.reddit && (
            <SocialLink label={t('social.reddit')} href={socialMedia.reddit} imgSrc={reddit} />
          )}
          {socialMedia.linkedin && (
            <SocialLink label={t('social.linkedin')} href={socialMedia.linkedin} imgSrc={linkedin} />
          )}
          {socialMedia.docs && (
            <SocialLink
              label={t('social.docs')}
              href={socialMedia.docs}
              img={<NotebookText className="size-9 text-white" />}
            />
          )}
          {socialMedia.home && (
            <SocialLink
              label={t('social.home')}
              href={socialMedia.home}
              img={<Home className="size-9 text-white" />}
            />
          )}
        </div>
      </div>
    </div>
  )
}
