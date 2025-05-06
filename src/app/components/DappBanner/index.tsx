import { FC } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import Box from '@mui/material/Box'
import { SearchScope } from '../../../types/searchScope'
import Button from '@mui/material/Button'
import { useScreenSize } from '../../hooks/useScreensize'
import { EthOrOasisAddress } from '../../../oasis-nexus/api'
import { useAccountMetadata } from '../../hooks/useAccountMetadata'

export const DappBanner: FC<{ scope: SearchScope; ethOrOasisAddress: EthOrOasisAddress }> = ({
  scope,
  ethOrOasisAddress,
}) => {
  const { isMobile } = useScreenSize()

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
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: COLORS.white,
                fontSize: isMobile ? '18px' : '24px',
                fontWeight: 700,
                lineHeight: '140%' /* 33.6px */,
              }}
            >
              {dApp.description}
            </Typography>
            &nbsp;
            <Button
              href={dApp.url}
              sx={{
                backgroundColor: COLORS.white,
                fontSize: '18px',
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
          </Box>
        </CardContent>
      </Card>
    )
  )
}
