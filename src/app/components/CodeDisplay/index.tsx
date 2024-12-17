import { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { ScrollableDataDisplay } from '../../components/ScrollableDataDisplay'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { useScreenSize } from '../../hooks/useScreensize'
import { base64ToHex } from '../../utils/helpers'

type CodeDisplayProps = {
  code: ReactNode
  copyToClipboardValue: string
  label?: string
  extraTopPadding?: boolean
  withCopyButton?: boolean
}

const CodeDisplay: FC<CodeDisplayProps> = ({
  code,
  copyToClipboardValue,
  label,
  extraTopPadding,
  withCopyButton = true,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (!code) {
    return null
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: 3,
          pt: extraTopPadding ? 4 : 0,
        }}
      >
        {label && (
          <Typography variant="h4" component="h4">
            {label}
          </Typography>
        )}
        {withCopyButton && (
          <CopyToClipboard
            value={copyToClipboardValue}
            label={isMobile ? t('common.copy') : t('contract.copyButton', { subject: label })}
          />
        )}
      </Box>

      <ScrollableDataDisplay data={code} />
    </>
  )
}

type RawDataDisplayProps = {
  data: string | undefined
  label: string
  extraTopPadding?: boolean
}

export const RawDataDisplay: FC<RawDataDisplayProps> = ({ data, label, extraTopPadding }) => {
  const code = data === undefined ? undefined : base64ToHex(data)
  if (!code) {
    return null
  }
  return (
    <CodeDisplay code={code} copyToClipboardValue={code} label={label} extraTopPadding={extraTopPadding} />
  )
}

const StyledPre = styled('pre')({
  margin: 0,
  whiteSpace: 'break-spaces',
})

type JsonCodeDisplayProps = {
  data: Record<string, any>
  label?: string
  withCopyButton?: boolean
}

export const JsonCodeDisplay: FC<JsonCodeDisplayProps> = ({ data, label, withCopyButton = true }) => {
  const formattedJson = JSON.stringify(data, null, 2)

  return (
    <CodeDisplay
      code={<StyledPre>{formattedJson}</StyledPre>}
      copyToClipboardValue={formattedJson}
      label={label}
      withCopyButton={withCopyButton}
    />
  )
}
