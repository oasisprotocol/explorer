import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@oasisprotocol/ui-library/src/components/cards'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'
import { BlockStats } from '../../components/BlockStats'
import { ValidatorSignedBlock } from '../../../oasis-nexus/api'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

type SignedBlocksProps = {
  isLoading: boolean
  isFetched: boolean
  signedBlocks: ValidatorSignedBlock[] | undefined
}

export const SignedBlocks: FC<SignedBlocksProps> = ({ isLoading, isFetched, signedBlocks }) => {
  const { t } = useTranslation()

  return (
    <Card variant="layout">
      <CardHeader>
        <CardTitle>
          <Typography variant="h3">{t('validator.signedBlocks')}</Typography>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <Skeleton className="h-[240px]" />}
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
      <Typography variant="xsmall" textColor="muted" className="pb-4">
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
