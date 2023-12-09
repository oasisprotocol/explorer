import { FC } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { COLORS } from '../../../styles/theme/colors'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import { SearchScope } from '../../../types/searchScope'
import { getDappForEthAddress } from '../../config/dapps'
import Button from '@mui/material/Button'
import { useScreenSize } from '../../hooks/useScreensize'

export const DappBanner: FC<{ scope: SearchScope; ethAddress: string | undefined }> = ({
  scope,
  ethAddress,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (!ethAddress) {
    return null
  }

  const dApp = getDappForEthAddress(t, scope.network, scope.layer, ethAddress)

  return (
    !!dApp && (
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
              {dApp.label}
            </Button>
          </Box>
        </CardContent>
      </Card>
    )
  )
}
