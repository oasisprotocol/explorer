import { FC, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@oasisprotocol/ui-library/src/components/ui/button'

const lineHeight = 22

export const LongDataDisplay: FC<{ data: string; fontWeight?: number; collapsedLinesNumber?: number }> = ({
  data,
  fontWeight = 600,
  collapsedLinesNumber = 2,
}) => {
  const { t } = useTranslation()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOverflowing, setIsOverflowing] = useState(false)
  const textRef = useRef<HTMLDivElement | null>(null)
  const collapsedContainerMaxHeight = collapsedLinesNumber * lineHeight

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        const isOverflow = textRef.current.scrollHeight > textRef.current.clientHeight
        setIsOverflowing(isOverflow)
      }
    }

    checkOverflow()
    const handleResize = () => {
      checkOverflow()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [data])

  return (
    <div>
      <span
        ref={textRef}
        className="font-mono font-medium overflow-hidden whitespace-pre-wrap"
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: isExpanded ? 'none' : collapsedLinesNumber,
          overflowWrap: 'anywhere',
          lineHeight: `${lineHeight}px`,
          maxHeight: isExpanded ? 'none' : collapsedContainerMaxHeight,
        }}
      >
        {data}
      </span>
      {(isOverflowing || isExpanded) && (
        <Button
          variant="link"
          onClick={() => setIsExpanded(!isExpanded)}
          className="font-semibold h-auto p-0 mt-2 sm:mt-4 hover:no-underline"
          style={{ fontWeight }}
        >
          {isExpanded ? t('common.hide') : t('common.show')}
        </Button>
      )}
    </div>
  )
}
