import Collapse from '@mui/material/Collapse'
import Link from '@mui/material/Link'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'

export const LongDataDisplay: FC<{ data: string; threshold: number; fontWeight?: number }> = ({
  data,
  threshold,
  fontWeight = 700,
}) => {
  const { t } = useTranslation()
  const [showData, setShowData] = useState(false)
  const needsHiding = data.length > threshold
  if (!needsHiding) {
    return (
      <Typography
        variant="mono"
        sx={{
          fontWeight,
          overflowWrap: 'anywhere',
        }}
      >
        {data}
      </Typography>
    )
  }
  return (
    <div>
      <Collapse orientation="vertical" in={showData} onClick={() => setShowData(true)} collapsedSize="3em">
        <Typography
          variant="mono"
          sx={{
            fontWeight,
            overflowWrap: 'anywhere',
          }}
        >
          {data}
        </Typography>
      </Collapse>
      {data.length > threshold && (
        <Link sx={{ cursor: 'pointer' }} onClick={() => setShowData(!showData)}>
          {showData ? t('common.hide') : t('common.show')}
        </Link>
      )}
    </div>
  )
}
