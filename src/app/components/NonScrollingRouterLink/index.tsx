import { forwardRef, ComponentProps, FC } from 'react'
import { Link } from 'react-router'

export const NonScrollingRouterLink: FC<ComponentProps<typeof Link>> = forwardRef((props, ref) => (
  <Link {...props} preventScrollReset ref={ref} />
))
