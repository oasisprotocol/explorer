import { FC } from 'react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { SearchScope } from '../../../types/searchScope'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'
import { EthOrOasisAddress } from '../../../oasis-nexus/api'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'
import { Link } from '@oasisprotocol/ui-library/src/components/link'

export const DappBanner: FC<{ scope: SearchScope; ethOrOasisAddress: EthOrOasisAddress }> = ({
  scope,
  ethOrOasisAddress,
}) => {
  const { metadata } = useAccountMetadata(scope, ethOrOasisAddress)
  const dApp = metadata?.dapp

  return (
    !!dApp?.url && (
      <div className="bg-chart-3 border-2 border-dashed border-white p-6 mb-6">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <Typography variant="h3" className="text-white">
            {dApp.description}
          </Typography>
          &nbsp;
          <Button variant="outline" size="lg">
            <Link
              className="text-foreground hover:text-foreground"
              href={dApp.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {dApp.button}
            </Link>
          </Button>
        </div>
      </div>
    )
  )
}
