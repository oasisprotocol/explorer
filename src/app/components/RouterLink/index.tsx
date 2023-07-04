import React, { FC, ComponentPropsWithRef } from 'react'
import { Link, useLocation, useResolvedPath } from 'react-router-dom'

export const RouterLink: FC<ComponentPropsWithRef<typeof Link>> = React.forwardRef((props, ref) => {
  const to = useResolvedPath(props.to)
  const location = useLocation()
  const replace = to.pathname === location.pathname && to.search === location.search

  return <Link {...props} replace={props.replace || replace} ref={ref} />
})
