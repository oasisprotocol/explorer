import React, { FC, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { useScreenSize } from '../../hooks/useScreensize'
import { base64ToHex } from '../../utils/helpers'
import { MonacoLanguages } from './MonacoLanguages'

const TextAreaFallback = ({ value }: { value?: string }) => (
  <textarea readOnly value={value} style={{ width: '100%', height: '100%', colorScheme: 'dark' }} />
)

const MonacoEditor = React.lazy(async () => {
  try {
    const monaco = await import('monaco-editor')
    const monacoReact = await import('@monaco-editor/react')
    // Load from npm, not cdn.jsdelivr.net
    // https://www.npmjs.com/package/@monaco-editor/react#use-monaco-editor-as-an-npm-package
    window.MonacoEnvironment = {
      getWorker(id, label) {
        return new Worker(
          new URL('../../../../node_modules/monaco-editor/esm/vs/editor/editor.worker.js', import.meta.url),
          { type: 'module' },
        )
      },
    }
    monacoReact.loader.config({ monaco })

    return monacoReact
  } catch (e) {
    console.error('monaco-editor wrapper failed to load. Using <textarea> instead')
    return {
      default: (props => (
        <TextAreaFallback value={props.value || props.defaultValue} />
      )) as typeof import('@monaco-editor/react').default,
    }
  }
})

type CodeDisplayProps = {
  code: string
  language: MonacoLanguages
  label?: string
  extraTopPadding?: boolean
}

const CodeDisplay: FC<CodeDisplayProps> = ({ code, language, label = undefined }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()

  if (!code) {
    return null
  }

  return (
    <Box sx={{ flex: 1, position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          my: 3,
          pt: 0,
        }}
      >
        {label && <Typography variant="h4">{label}</Typography>}

        <CopyToClipboard
          value={code}
          label={isMobile ? t('common.copy') : t('contract.copyButton', { subject: label })}
        />
      </Box>
      <Box sx={{ height: '350px', overflow: 'auto', resize: 'vertical' }}>
        {/* While loading wrapper show <textarea> instead */}
        <Suspense fallback={<TextAreaFallback value={code} />}>
          <MonacoEditor
            // While loading and if monaco-editor internals fail to load: show <textarea> instead
            loading={<TextAreaFallback value={code} />}
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
}

export const JsonCodeDisplay: FC<JsonCodeDisplayProps> = ({ data, label }) => {
  const formattedJson = JSON.stringify(data, null, 2)

  return <CodeDisplay code={formattedJson} label={label} language="json" />
}
