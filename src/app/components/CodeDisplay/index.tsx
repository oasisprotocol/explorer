import React, { FC, Suspense } from 'react'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'
import { CopyToClipboard } from '../../components/CopyToClipboard'
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
}

export const CodeDisplay: FC<CodeDisplayProps> = ({ code, language, label = undefined }) => {
  if (!code) {
    return null
  }

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-4 pt-4 h-13">
        {label && <Typography className="font-bold">{label}</Typography>}

        <CopyToClipboard value={code} />
      </div>
      <div className="h-[350px] overflow-auto resize-y">
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
      </div>
    </div>
  )
}
