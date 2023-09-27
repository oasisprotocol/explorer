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

  /**
   * Do we want to highlight tabs as selected when using hierarchical routes?
   *
   * For example, we have tabs with these paths
   *
   * /item/a
   * /item/b
   * /item/c
   *
   * and the current path is /item/b/2,
   *
   * should the second tab be active?
   *
   * Using the default value of this setting (false) it won't be marked as active.
   * If it should be active, then enable this option
   */
  matchPartialPath?: boolean
}

function getPathname(tab: { to: string }) {
  return new URL(tab.to, 'https://a.b').pathname
}

export function RouterTabs<Context>({ tabs, context, matchPartialPath }: RouterTabsProps<Context>) {
  const { pathname } = useLocation()

  let currentTab = tabs.find(tab => getPathname(tab) === pathname)

  if (matchPartialPath) {
    /**
     * So, here, we want to properly recognize hierarchical routes.
     *
     * Like, if we have tabs,
     *
     * /item/a
     * /item/b
     * /item/c
     *
     * and the current path is /item/b/2, then we want the second tab to be active, since the selected path
     * is inside it.
     *
     * So far, so good, but there are cases when we have tabs setup up like this:
     *
     * /item
     * /item/b
     * /item/c
     *
     * In this case, if the URL ends with "/item", the first tab is active,
     * if it is "item/b" then the second tab is active, etc.
     *
     * However, when looking for the active tab for path /item/b/2,
     * if we do partial matching the native way, we might be mistaken.
     *
     * Checking the first tab, `/item`:      `/item/b/2` start with `/item`, so this must be a match!
     * Checking the second tab, `/item/b`:   `/item/b/2` starts with `/item/b`, so this is a match, too.
     * Checking the third tab, `/item/c`:    `/item/b/c` does NOT start with `/item/c`, so this is something else,
     * not active.
     *
     * So we end up detecting two tabs as active, while in fact only the second one should be active.
     *
     * The solution to this problem is to recognize if one of the tabs is defined as root tab, and never
     * return it as part of a partial match, only using an exact match.
     */

    // First, let's get the paths of all tabs
    const tabPaths = tabs.map(getPathname)

    // Identify the shortest path (which might be a root)
    const shortestPath = tabPaths.sort((p1, p2) => p1.length - p2.length)[0]

    // Test is the shortest path is actually a root path, that is, all other tabs are continuations of that path
    const shortestPathIsRoot = tabPaths.every(path => path.startsWith(shortestPath))

    // So, do we have a root path?
    const rootPath = shortestPathIsRoot ? shortestPath : undefined

    // Now let's find the active path using this information
    currentTab = tabs.find(tab => {
      const tabPath = getPathname(tab)
      return (
        tabPath === pathname || // A clear match always means an active tab
        (pathname.startsWith(tabPath) && // We have a partial match (the current path starts with the path for this tab)
          tabPath !== rootPath) // And the current tab is not a root tab, so it's OK to detect this as active
      )
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
