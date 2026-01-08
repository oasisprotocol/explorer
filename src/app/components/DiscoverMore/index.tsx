import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@oasisprotocol/ui-library/src/components/link'
import { roflApp, roseApp } from '../../utils/externalLinks'
import { Button } from '@oasisprotocol/ui-library/src/components/button'
import { ArrowUpRight } from 'lucide-react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

export const DiscoverMore: FC = () => {
  const { t } = useTranslation()

  return (
    <div className="w-full relative rounded-md flex flex-col lg:flex-row gap-4 md:gap-6 justify-between items-center">
      <div className="w-full flex flex-row self-stretch p-8 border bg-card rounded-md">
        <div className="flex flex-col items-start gap-2 lg:max-w-[480px]">
          <Typography className="font-semibold">{t('social.roflApp')}</Typography>
          <div className="text-foreground text-xl md:text-2xl font-medium leading-6 md:leading-8">
            {t('social.offchainPerformanceonchainTrust')}
          </div>
          <div className="justify-start text-muted-foreground text-sm font-normal leading-5 mb-3">
            {t('social.description')}
          </div>
          <Button color="secondary" variant="outline" asChild>
            <Link textColor="primary" href={roflApp.homepage} target="_blank" rel="noopener noreferrer">
              {t('social.discoverRoflApp')}
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-row self-stretch p-8 border bg-card rounded-md">
        <div className="flex flex-col items-start gap-2 lg:max-w-[480px]">
          <Typography className="font-semibold">{t('social.roseApp')}</Typography>
          <div className="text-foreground text-xl md:text-2xl font-medium leading-6 md:leading-8">
            {t('social.roseAppTitle')}
          </div>
          <div className="justify-start text-muted-foreground text-sm font-normal leading-5 mb-3">
            {t('social.roseAppDescription')}
          </div>
          <Button color="secondary" variant="outline" asChild>
            <Link textColor="primary" href={roseApp.homepage} target="_blank" rel="noopener noreferrer">
              {t('social.visitRoseApp')}
              <ArrowUpRight />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
