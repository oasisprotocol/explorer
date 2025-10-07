import { useState } from 'react'
import { COLORS } from '../../../styles/theme/colors'
import { FloatingCopyToClipboard } from '../CopyToClipboard'

export function SimpleJsonCode(props: { data: Record<string, any> }) {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div
      className="flex-1 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <FloatingCopyToClipboard isVisible={isHovering} value={JSON.stringify(props.data, null, 2)} />
      <textarea
        className="w-full h-[350px] rounded-sm p-3 bg-border"
        readOnly
        value={JSON.stringify(props.data, null, 2)}
        style={{
          color: COLORS.brandExtraDark,
        }}
      />
    </div>
  )
}
