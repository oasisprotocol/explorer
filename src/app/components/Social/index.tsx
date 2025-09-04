import React, { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { useScreenSize } from '../../hooks/useScreensize'
import backgroundSocial from './images/background-social.png'
import telegram from './images/telegram.svg'
import twitter from './images/twitter.svg'
import discord from './images/discord.svg'
import youtube from './images/youtube.svg'
import reddit from './images/reddit.svg'
import linkedin from './images/linkedin.svg'
import { NotebookText, Home } from 'lucide-react'
import { socialMedia } from '../../utils/externalLinks'

type SocialLinkProps = {
  label: string
  href: string
  isMobile: boolean
  imgSrc?: string
  img?: ReactNode
}

const SocialLink: FC<SocialLinkProps> = ({ label, href, imgSrc, img }) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-white mx-4 mt-4 sm:mx-0 sm:mt-0"
      rel="noopener noreferrer"
      target="_blank"
    >
      <div className="flex justify-center mb-2">
        <>
          {imgSrc && <img src={imgSrc} alt={label} className="h-10 w-auto inline-block" />}
          {img && <span className="[&_svg]:h-10 [&_svg]:w-10 inline-block">{img}</span>}
        </>
      </div>
      <Typography variant="large" className="mb-1 text-white">
        {label}
      </Typography>
    </Link>
  )
}

export const Social: FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  return (
    <div
      className="grid grid-cols-12 bg-cover rounded-md border pt-8 px-8 border-white bg-primary lg:px-16 pb-4 lg:pb-8"
      style={{
        backgroundImage: `url(${backgroundSocial})`,
      }}
    >
      <div className="col-span-12 mb-4 lg:col-span-4 lg:mb-0">
        <Typography variant="large" className="mb-1 text-white">
          {t('social.header')}
        </Typography>
        <Typography className="text-white w-full md:w-64">{t('social.description')}</Typography>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <div className="flex flex-wrap items-center w-full h-full justify-center sm:gap-4 md:justify-between">
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
              imgSrc={linkedin}
            />
          )}
          {socialMedia.docs && (
            <SocialLink
              isMobile={isMobile}
              label={t('social.docs')}
              href={socialMedia.docs}
              img={<NotebookText className="size-12 text-white" />}
            />
          )}
          {socialMedia.home && (
            <SocialLink
              isMobile={isMobile}
              label={t('social.home')}
              href={socialMedia.home}
              img={<Home className="size-12 text-white" />}
            />
          )}
        </div>
      </div>
    </div>
  )
}
