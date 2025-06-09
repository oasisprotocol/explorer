import { FC, ReactNode } from 'react'
import Box from '@mui/material/Box'
import { SxProps } from '@mui/material/styles'
import { TooltipWrapper as Tooltip } from '@oasisprotocol/ui-library/src/components/ui/tooltipWrapper'
import { useScreenSize } from '../../hooks/useScreensize'

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
  spanSx?: SxProps

  /**
   * The content to show
   */
  children: ReactNode
}

/**
 * A component to display some content with or without a tooltip
 */
export const MaybeWithTooltip: FC<MaybeWithTooltipProps> = ({ title, children, spanSx }) => {
  const { isMobile } = useScreenSize()
  return (
    <Tooltip
      title={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            overflowWrap: 'anywhere',
            marginLeft: isMobile ? -3 : undefined,
            marginRight: isMobile ? -3 : undefined,
          }}
        >
          {title}
        </Box>
      }
    >
      <Box
        component="span"
        sx={{
          ...spanSx,
          display: 'inline-flex',
          verticalAlign: 'middle',
        }}
      >
        {children}
      </Box>
    </Tooltip>
  )
}
