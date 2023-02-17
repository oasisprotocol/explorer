import { FC } from 'react'
import Skeleton from '@mui/material/Skeleton'

type TextSkeletonProps = {
  numberOfRows: number
}

export const TextSkeleton: FC<TextSkeletonProps> = ({ numberOfRows }) => {
  return (
    <>
      {[...Array(numberOfRows).keys()].map(i => (
        <Skeleton key={i} variant="text" height={30} sx={{ my: 4 }} />
      ))}
    </>
  )
}
