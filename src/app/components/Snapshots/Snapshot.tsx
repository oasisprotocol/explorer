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
      <div className="grid grid-cols-12 gap-x-4 gap-y-2 px-4 pb-4 sm:px-0 sm:pb-0">
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <AppendMobileSearch scope={scope}>
            <div className="flex mb-4 flex-col sm:flex-row sm:items-center gap-1">
              <Typography variant="h2">{title}</Typography>
              {header}
            </div>
          </AppendMobileSearch>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 w-full pb-8">{children}</div>
    </>
  )
}
