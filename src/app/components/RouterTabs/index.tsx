import { FC } from 'react'
import { useLocation, matchPath, Link as RouterLink, Outlet } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

type RouterTabsProps = {
  tabs: {
    label: string
    to: string
  }[]
}

function useRouteMatch(patterns: string[]) {
  const { pathname } = useLocation()

  for (let i = 0; i < patterns.length; i += 1) {
    const pattern = patterns[i]
    const possibleMatch = matchPath(pattern, pathname)
    if (possibleMatch !== null) {
      return possibleMatch
    }
  }

  return null
}

export const RouterTabs: FC<RouterTabsProps> = ({ tabs }) => {
  const tabsPaths = tabs.flatMap(num => num.to)
  const routeMatch = useRouteMatch(tabsPaths)
  const currentTab = routeMatch?.pattern?.path

  return (
    <>
      <Tabs value={currentTab}>
        {tabs.map(tab => (
          <Tab key={tab.to} component={RouterLink} value={tab.to} label={tab.label} to={tab.to} />
        ))}
      </Tabs>
      <Outlet />
    </>
  )
}
