import { FC } from 'react'
import { useLocation, Link as RouterLink, Outlet } from 'react-router-dom'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

type RouterTabsProps = {
  tabs: {
    label: string
    to: string
  }[]
}

function getPathname(tab: { to: string }) {
  return new URL(tab.to, 'https://a.b').pathname
}

export const RouterTabs: FC<RouterTabsProps> = ({ tabs }) => {
  const { pathname } = useLocation()
  const currentTab = tabs.find(tab => getPathname(tab) === pathname)

  return (
    <>
      <Tabs value={currentTab?.to}>
        {tabs.map(tab => (
          <Tab key={tab.to} component={RouterLink} value={tab.to} label={tab.label} to={tab.to} />
        ))}
      </Tabs>
      <Outlet />
    </>
  )
}
