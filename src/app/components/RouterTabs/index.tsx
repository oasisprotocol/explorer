import { useLocation, Outlet } from 'react-router-dom'
import { NonScrollingRouterLink } from '../NonScrollingRouterLink'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

type TabConfig = {
  label: string
  to: string
  visible?: boolean
}

type RouterTabsProps<Context> = {
  tabs: TabConfig[]
  context?: Context
  matchPartialPath?: boolean
}

function getPathname(tab: { to: string }) {
  return new URL(tab.to, 'https://a.b').pathname
}

export function RouterTabs<Context>({ tabs, context, matchPartialPath }: RouterTabsProps<Context>) {
  const { pathname } = useLocation()

  let currentTab = tabs.find(tab => getPathname(tab) === pathname)

  if (matchPartialPath) {
    const tabPaths = tabs.map(getPathname)
    const shortestPath = tabPaths.sort((p1, p2) => p1.length - p2.length)[0]
    const shortestPathIsRoot = tabPaths.every(path => path.startsWith(shortestPath))
    const rootPath = shortestPathIsRoot ? shortestPath : undefined
    currentTab = tabs.find(tab => {
      const tabPath = getPathname(tab)
      return tabPath === pathname || (tabPath !== rootPath && pathname.startsWith(tabPath))
    })
  }

  return (
    <>
      <Tabs value={currentTab?.to}>
        {tabs
          .filter(tab => tab === currentTab || tab.visible !== false)
          .map(tab => (
            <Tab
              key={tab.to}
              component={NonScrollingRouterLink}
              value={tab.to}
              label={tab.label}
              to={tab.to}
            />
          ))}
      </Tabs>
      <Outlet context={context} />
    </>
  )
}
