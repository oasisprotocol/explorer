import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { COLORS } from 'styles/theme/colors'
import { BlockStats } from '../../components/BlockStats'

export const SignedBlocks: FC = () => {
  const { t } = useTranslation()
  // TODO: provide data from the API and sync dataKey value
  const data: any[] = []
  const dataKey = ''

  return (
    <Card>
      <CardHeader
        disableTypography
        component="h3"
        title={t('validator.signedBlocks')}
        sx={{ paddingBottom: 0 }}
      />
      <CardContent>
        {data && data.length > 0 && (
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
              data={data}
              dataKey={dataKey}
              legendLabels={{ success: t('validator.signed'), fail: t('validator.missed') }}
              tooltipFormatter={value => t('validator.blockWithHeight', { height: value })}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
