import { Separator } from '@oasisprotocol/ui-library/src/components/ui/separator'
import { useScreenSize } from '../../hooks/useScreensize'

export const LayoutDivider = () => <Separator className="my-8" />
export const DashboardDivider = () => {
  const { isMobile } = useScreenSize()
  return <Separator className={isMobile ? 'mt-4 mb-8' : 'mb-8'} />
}
export const CardDivider = () => <Separator className="my-10" />
