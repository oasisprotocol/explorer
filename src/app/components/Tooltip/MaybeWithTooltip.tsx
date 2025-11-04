import { FC, ReactNode } from 'react'
import { Tooltip } from '@oasisprotocol/ui-library/src/components/tooltip'

type MaybeWithTooltipProps = {
  /**
   * What should be the content of the tooltip?
   *
   * Undefined means no tooltip
   */
  title?: ReactNode

  /**
   * Any extra styles to apply to the span
   */
  spanClassName?: string

  /**
   * The content to show
   */
  children: ReactNode
}

/**
 * A component to display some content with or without a tooltip
 */
export const MaybeWithTooltip: FC<MaybeWithTooltipProps> = ({ title, children, spanClassName }) => {
  return (
    <Tooltip
      className="max-w-[410px]"
      title={<div className="flex items-center gap-2 md:mx-0 -mx-3 min-w-0 wrap-anywhere">{title}</div>}
      disabled={!title}
    >
      <span className={spanClassName}>{children}</span>
    </Tooltip>
  )
}
