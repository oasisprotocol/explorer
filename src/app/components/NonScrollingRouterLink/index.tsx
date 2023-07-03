import React, { ComponentPropsWithRef, FC } from 'react'
import { Link } from 'react-router-dom'

export const NonScrollingRouterLink: FC<ComponentPropsWithRef<typeof Link>> = React.forwardRef(
  (props, ref) => <Link {...props} preventScrollReset ref={ref} />,
)
