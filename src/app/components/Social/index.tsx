import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { roflApp } from '../../utils/externalLinks'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'

export const DiscoverMore: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="w-full relative rounded-md flex flex-col lg:flex-row gap-4 md:gap-6 justify-between items-center">
      <div className="w-full flex flex-row self-stretch p-8 border bg-card rounded-md">
        <div className="flex flex-col items-start gap-2 lg:max-w-[340px]">
          <div className="text-foreground text-xl md:text-2xl font-semibold leading-6 md:leading-8">
            {t('social.offchainPerformance')} <br />
            {t('social.onchainTrust')}
          </div>
          <div className="justify-start text-foreground text-sm font-normal leading-5 mb-2">
            {t('social.description')}
          </div>
          <Button color="secondary" variant="outline" asChild>
            <Link textColor="primary" href={roflApp.homepage} target="_blank" rel="noopener noreferrer">
              {t('social.getStarted')}
            </Link>
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-row self-stretch p-8 border bg-card rounded-md">
        <div className="flex flex-col items-start gap-2 lg:max-w-[340px]">
          <div className="text-foreground text-xl md:text-2xl font-semibold leading-6 md:leading-8">
            {t('social.roseApp')} <br />
            {t('social.secureScalablePrivate')}
          </div>
          <div className="justify-start text-foreground text-sm font-normal leading-5 mb-2">
            {t('social.roseAppDescription')}
          </div>
          <Button color="secondary" variant="outline" asChild>
            <Link textColor="primary" href="https://rose.oasis.io/" target="_blank" rel="noopener noreferrer">
              {t('common.visitRoseApp')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
