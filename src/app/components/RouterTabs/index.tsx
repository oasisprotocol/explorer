import { useLocation, Outlet, useMatches } from 'react-router-dom'
import { NonScrollingRouterLink } from '../NonScrollingRouterLink'
import { Tabs, TabsList, TabsTrigger } from '@oasisprotocol/ui-library/src/components/tabs'

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
      <Tabs value={targetTab?.to}>
        <TabsList variant="layout">
          {tabs
            .filter(tab => tab === targetTab || tab.visible !== false)
            .map(tab => (
              <TabsTrigger key={tab.to} value={tab.to} asChild>
                <NonScrollingRouterLink to={tab.to} className="flex items-center">
                  {tab.label}
                </NonScrollingRouterLink>
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>
      <Outlet context={context} />
    </>
  )
}
