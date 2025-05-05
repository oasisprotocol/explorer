import { FC, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { ScrollableDataDisplay } from '../../components/ScrollableDataDisplay'
import { CopyToClipboard, FloatingCopyToClipboard } from '../../components/CopyToClipboard'
import { useScreenSize } from '../../hooks/useScreensize'
import { base64ToHex } from '../../utils/helpers'

type CodeDisplayProps = {
  code: ReactNode
  copyToClipboardValue: string
  label?: string
  extraTopPadding?: boolean
  floatingCopyButton?: boolean
}

const CodeDisplay: FC<CodeDisplayProps> = ({
  code,
  copyToClipboardValue,
  label,
  extraTopPadding,
  floatingCopyButton = false,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const [isHovering, setIsHovering] = useState(false)

  if (!code) {
    return null
  }

  return (
    <Box
      sx={{ flex: 1, position: 'relative' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: floatingCopyButton ? 0 : 3,
          pt: extraTopPadding ? 4 : 0,
        }}
      >
        {label && (
          <Typography variant="h4" component="h4">
            {label}
          </Typography>
        )}
        {floatingCopyButton ? (
          <FloatingCopyToClipboard isVisible={isHovering} value={copyToClipboardValue} />
        ) : (
          <CopyToClipboard
            value={copyToClipboardValue}
            label={isMobile ? t('common.copy') : t('contract.copyButton', { subject: label })}
          />
        )}
      </Box>
      <ScrollableDataDisplay data={code} />
    </Box>
  )
}

type RawDataDisplayProps = {
  data: string | undefined
  label: string
}

export const RawDataDisplay: FC<RawDataDisplayProps> = ({ data, label }) => {
  const code = data === undefined ? undefined : base64ToHex(data)
  if (!code) {
    return null
  }
  return <CodeDisplay code={code} copyToClipboardValue={code} label={label} extraTopPadding />
}

const StyledPre = styled('pre')({
  margin: 0,
  whiteSpace: 'break-spaces',
})

type FileDisplayProps = {
  code: string | undefined
  filename: string
}

export const FileDisplay: FC<FileDisplayProps> = ({ code, filename }) => {
  if (!code) return null

  return (
    <CodeDisplay
      code={<StyledPre>{code}</StyledPre>}
      copyToClipboardValue={code}
      label={filename}
      extraTopPadding
    />
  )
}

type JsonCodeDisplayProps = {
  data: Record<string, any>
  label?: string
  floatingCopyButton?: boolean
}

export const JsonCodeDisplay: FC<JsonCodeDisplayProps> = ({ data, label, floatingCopyButton }) => {
  const formattedJson = JSON.stringify(data, null, 2)

  return (
    <CodeDisplay
      code={<StyledPre>{formattedJson}</StyledPre>}
      copyToClipboardValue={formattedJson}
      label={label}
      floatingCopyButton={floatingCopyButton}
    />
  )
}
