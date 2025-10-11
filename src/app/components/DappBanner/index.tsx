import { FC } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { COLORS } from '../../../styles/theme/colors'
import { SearchScope } from '../../../types/searchScope'
import Button from '@mui/material/Button'
import { EthOrOasisAddress } from '../../../oasis-nexus/api'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'

export const DappBanner: FC<{ scope: SearchScope; ethOrOasisAddress: EthOrOasisAddress }> = ({
  scope,
  ethOrOasisAddress,
}) => {
  const { metadata } = useAccountMetadata(scope, ethOrOasisAddress)
  const dApp = metadata?.dapp

  return (
    !!dApp?.url && (
      <Card
        sx={{
          backgroundColor: COLORS.brandMedium,
          border: `2px dashed ${COLORS.white}`,
        }}
      >
        <CardContent sx={{ paddingBottom: '0!important' }}>
          <div className="flex flex-wrap justify-center items-center gap-2">
            <Typography variant="h3" className="text-white">
              {dApp.description}
            </Typography>
            &nbsp;
            <Button
              href={dApp.url}
              sx={{
                backgroundColor: COLORS.white,
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '125%',
                textTransform: 'none',
              }}
              variant="outlined"
              target="_blank"
              rel="noopener noreferrer"
            >
              {dApp.button}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  )
}
