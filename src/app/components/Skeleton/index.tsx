import { FC } from 'react'
import { Skeleton } from '@oasisprotocol/ui-library/src/components/ui/skeleton'

type TextSkeletonProps = {
  numberOfRows: number
}

export const TextSkeleton: FC<TextSkeletonProps> = ({ numberOfRows }) => {
  return (
    <>
      {[...Array(numberOfRows).keys()].map(i => (
        <Skeleton key={i} className="h-[30px] my-4" />
      ))}
    </>
  )
}
