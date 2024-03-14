import { FC, ReactNode } from 'react'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'
import { SxProps } from '@mui/material/styles'

type MaybeWithTooltipProps = {
  /**
   * Do we want to show the tooltip?
   *
   * Default is true
   */
  tooltipWanted?: boolean

  /**
   * What should be the content of the tooltip?
   *
   * Undefined means no tooltip
   */
  title?: ReactNode

  /**
   * Any extra styles to apply to the span
   */
  spanSx?: SxProps

  /**
   * The content to show
   */
  children: ReactNode
}

/**
 * A component to display some content with or without a tooltip
 */
export const MaybeWithTooltip: FC<MaybeWithTooltipProps> = ({
  tooltipWanted = true,
  title,
  children,
  spanSx,
}) =>
  tooltipWanted && !!title ? (
    <Tooltip
      placement="top"
      title={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            overflowWrap: 'anywhere',
          }}
        >
          {title}
        </Box>
      }
    >
      <Box component="span" sx={spanSx}>
        {children}
      </Box>
    </Tooltip>
  ) : (
    <Box component="span" sx={spanSx}>
      {children}
    </Box>
  )
