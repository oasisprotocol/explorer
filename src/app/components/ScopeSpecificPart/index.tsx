import { useRequiredScopeParam } from 'app/hooks/useScopeParam'
import { Outlet } from 'react-router'
import { ThemeByScope } from '../ThemeByScope'

export const ScopeSpecificPart = () => {
  const { network } = useRequiredScopeParam()
  return (
    <ThemeByScope network={network}>
      <Outlet />
    </ThemeByScope>
  )
}
