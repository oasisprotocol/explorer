import { FC, ReactNode } from 'react'
import { AppendMobileSearch } from '../../components/AppendMobileSearch'
import { SearchScope } from '../../../types/searchScope'
import { Typography } from '@oasisprotocol/ui-library/src/components/typography'

type SnapshotProps = {
  children: ReactNode
  header?: ReactNode
  scope: SearchScope
  title: string
}

export const Snapshot: FC<SnapshotProps> = ({ children, header, scope, title }) => {
  return (
    <>
      <div className="grid grid-cols-12 gap-x-4 gap-y-2 px-4 pb-4 md:px-0 md:pb-0">
        <div className="col-span-12">
          <AppendMobileSearch scope={scope}>
            <div className="flex md:mb-6 flex-col sm:flex-row sm:items-center gap-1">
              <Typography variant="h2">{title}</Typography>
              {header}
            </div>
          </AppendMobileSearch>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 w-full pb-6">{children}</div>
    </>
  )
}
