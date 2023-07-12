import { useLocation, Outlet } from 'react-router-dom'
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
  const currentTab = tabs.find(tab => getPathname(tab) === pathname)

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
