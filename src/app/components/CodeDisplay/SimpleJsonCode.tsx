import { useState } from 'react'
import { COLORS } from '../../../styles/theme/colors'
import { CopyToClipboard } from '../CopyToClipboard'
import { cn } from '@oasisprotocol/ui-library/src/lib/utils'

export function SimpleJsonCode(props: { data: Record<string, any> }) {
  const [isHovering, setIsHovering] = useState(false)
  const value = JSON.stringify(props.data, null, 2)

  return (
    <div
      className="flex-1 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <CopyToClipboard
        className={cn(
          'absolute right-8 top-4 transition-opacity duration-200 ease-in-out z-10 shadow-md bg-white rounded-full w-10 h-10 flex justify-center ml-0',
          isHovering ? 'opacity-100' : 'opacity-0',
        )}
        value={value}
      />
      <textarea
        className="w-full h-[350px] rounded-sm p-3 bg-border"
        readOnly
        value={value}
        style={{
          color: COLORS.brandExtraDark,
        }}
      />
    </div>
  )
}
