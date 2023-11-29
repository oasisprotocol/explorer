import { useLocation, Outlet, useMatches } from 'react-router-dom'
import { NonScrollingRouterLink } from '../NonScrollingRouterLink'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

type RouterTabsProps<Context> = {
  tabs: {
    label: string
    to: string
    visible?: boolean
  }[]
  context?: Context
}

function getPathname(tab: { to: string }) {
  return new URL(tab.to, 'https://a.b').pathname
}

export function RouterTabs<Context>({ tabs, context }: RouterTabsProps<Context>) {
  const { pathname } = useLocation()
  let targetTab = tabs.find(tab => getPathname(tab) === pathname)
  const matches = useMatches()

  if (!targetTab) {
    /// the last index is the current route, -2 is the first parent in route hierarchy
    const parentPathname = matches?.at(-2)?.pathname
    targetTab = tabs.find(tab => getPathname(tab) === parentPathname)
  }

  return (
    <>
      <Tabs value={targetTab?.to} variant="scrollable" scrollButtons={false}>
        {tabs
          .filter(tab => tab === targetTab || tab.visible !== false)
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
