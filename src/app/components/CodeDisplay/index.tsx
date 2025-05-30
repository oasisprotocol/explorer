import React, { FC, useState, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { CopyToClipboard, FloatingCopyToClipboard } from '../../components/CopyToClipboard'
import { useScreenSize } from '../../hooks/useScreensize'
import { base64ToHex } from '../../utils/helpers'
import { TextSkeleton } from '../Skeleton'
import { MonacoLanguages } from './MonacoLanguages'

const MonacoEditor = React.lazy(() => import('@monaco-editor/react'))

type CodeDisplayProps = {
  code: string
  language: MonacoLanguages
  label?: string
  extraTopPadding?: boolean
  floatingCopyButton?: boolean
}

const CodeDisplay: FC<CodeDisplayProps> = ({
  code,
  label,
  extraTopPadding,
  language,
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
          <FloatingCopyToClipboard isVisible={isHovering} value={code} />
        ) : (
          <CopyToClipboard
            value={code}
            label={isMobile ? t('common.copy') : t('contract.copyButton', { subject: label })}
          />
        )}
      </Box>
      <Suspense fallback={<TextSkeleton numberOfRows={5} />}>
        <MonacoEditor
          height="300px"
          language={language}
          value={code}
          theme="vs-dark"
          options={{
            readOnly: true,
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </Suspense>
    </Box>
  )
}

type RawDataDisplayProps = {
  data: string | undefined
  label: string
}

export const RawDataDisplay: FC<RawDataDisplayProps> = ({ data, label }) => {
  const code = data === undefined ? undefined : base64ToHex(data)
  if (!code) return null

  return <CodeDisplay code={code} label={label} extraTopPadding language="plaintext" />
}

type FileDisplayProps = {
  code: string | undefined
  filename: string
}

export const FileDisplay: FC<FileDisplayProps> = ({ code, filename }) => {
  if (!code) return null

  return <CodeDisplay code={code} label={filename} extraTopPadding language="sol" />
}

type JsonCodeDisplayProps = {
  data: Record<string, any>
  label?: string
  floatingCopyButton?: boolean
}

export const JsonCodeDisplay: FC<JsonCodeDisplayProps> = ({ data, label, floatingCopyButton }) => {
  const formattedJson = JSON.stringify(data, null, 2)

  return (
    <CodeDisplay code={formattedJson} label={label} floatingCopyButton={floatingCopyButton} language="json" />
  )
}
