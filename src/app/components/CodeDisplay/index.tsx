import React, { FC, ReactNode, useState, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { ScrollableDataDisplay } from '../../components/ScrollableDataDisplay'
import { CopyToClipboard, FloatingCopyToClipboard } from '../../components/CopyToClipboard'
import { useScreenSize } from '../../hooks/useScreensize'
import { base64ToHex } from '../../utils/helpers'
import { TextSkeleton } from '../Skeleton'

const MonacoEditor = React.lazy(() => import('@monaco-editor/react'))

type CodeDisplayProps = {
  code: ReactNode
  copyToClipboardValue: string
  label?: string
  extraTopPadding?: boolean
  floatingCopyButton?: boolean
  useMonaco?: boolean
  monacoLanguage?: string
}

const CodeDisplay: FC<CodeDisplayProps> = ({
  code,
  copyToClipboardValue,
  label,
  extraTopPadding,
  floatingCopyButton = false,
  useMonaco = false,
  monacoLanguage = 'solidity',
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
      {useMonaco ? (
        <Suspense fallback={<TextSkeleton numberOfRows={5} />}>
          <MonacoEditor
            height="300px"
            defaultLanguage={monacoLanguage}
            defaultValue={String(copyToClipboardValue)}
            theme="vs-dark"
            onMount={(_, monaco) => {
              if (!monaco.languages.getLanguages().some(lang => lang.id === 'solidity')) {
                monaco.languages.register({ id: 'solidity' })
                monaco.languages.setMonarchTokensProvider('solidity', {
                  tokenizer: {
                    root: [
                      [
                        /\b(contract|function|event|modifier|mapping|struct|enum|address|bool|uint256|int256|string|bytes|public|private|view|pure|memory|storage|calldata)\b/,
                        'keyword',
                      ],
                      [/[a-zA-Z_]\w*/, 'identifier'],
                      [/\d+/, 'number'],
                      [/".*?"/, 'string'],
                      [/\/\/.*/, 'comment'],
                      [/\/\*/, 'comment', '@comment'],
                    ],
                    comment: [
                      [/[^/*]+/, 'comment'],
                      [/\*\//, 'comment', '@pop'],
                      [/./, 'comment'],
                    ],
                  },
                })
              }
            }}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
              lineNumbers: monacoLanguage === 'text' ? 'off' : 'on',
            }}
          />
        </Suspense>
      ) : (
        <ScrollableDataDisplay data={code} />
      )}
    </Box>
  )
}

const StyledPre = styled('pre')({
  margin: 0,
  whiteSpace: 'break-spaces',
})

type RawDataDisplayProps = {
  data: string | undefined
  label: string
  useMonaco?: boolean
}

export const RawDataDisplay: FC<RawDataDisplayProps> = ({ data, label, useMonaco }) => {
  const code = data === undefined ? undefined : base64ToHex(data)
  if (!code) return null

  return (
    <CodeDisplay
      code={code}
      copyToClipboardValue={code}
      label={label}
      extraTopPadding
      useMonaco={useMonaco}
      monacoLanguage="text"
    />
  )
}

type FileDisplayProps = {
  code: string | undefined
  filename: string
  useMonaco?: boolean
}

export const FileDisplay: FC<FileDisplayProps> = ({ code, filename, useMonaco }) => {
  if (!code) return null

  return (
    <CodeDisplay
      code={<StyledPre>{code}</StyledPre>}
      copyToClipboardValue={code}
      label={filename}
      extraTopPadding
      useMonaco={useMonaco}
      monacoLanguage="solidity"
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
      useMonaco
      monacoLanguage="json"
    />
  )
}
