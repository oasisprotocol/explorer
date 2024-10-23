import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { COLORS } from 'styles/theme/colors'
import { BlockStats } from '../../components/BlockStats'
import { ValidatorSignedBlock } from '../../../oasis-nexus/api'

type SignedBlocksProps = {
  isLoading: boolean
  isFetched: boolean
  signedBlocks: ValidatorSignedBlock[] | undefined
}

export const SignedBlocks: FC<SignedBlocksProps> = ({ isLoading, isFetched, signedBlocks }) => {
  const { t } = useTranslation()

  return (
    <Card sx={{ flex: 1 }}>
      <CardHeader
        disableTypography
        component="h3"
        title={t('validator.signedBlocks')}
        sx={{ paddingBottom: 0 }}
      />
      <CardContent>
        {isLoading && <Skeleton variant="rectangular" sx={{ height: 240 }} />}
        {isFetched && signedBlocks && signedBlocks.length > 0 && (
          <SignedBlocksContent signedBlocks={signedBlocks} />
        )}
      </CardContent>
    </Card>
  )
}

type SignedBlocksContentProps = {
  signedBlocks: ValidatorSignedBlock[]
}

export const SignedBlocksContent: FC<SignedBlocksContentProps> = ({ signedBlocks }) => {
  const { t } = useTranslation()

  return (
    <>
      <Typography
        sx={{
          fontSize: '18px',
          color: COLORS.grayMedium,
          paddingBottom: 4,
        }}
      >
        {t('validator.signedBlocksDescription')}
      </Typography>
      <BlockStats
        data={signedBlocks}
        dataKey="height"
        legendLabels={{ success: t('validator.signed'), fail: t('validator.missed') }}
        tooltipFormatter={value => t('validator.blockWithHeight', { height: value })}
      />
    </>
  )
}
