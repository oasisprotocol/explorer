import { FC } from 'react'
import { PageLayout } from '../../components/PageLayout'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'

export const BlocksPage: FC = () => {
  const { data } = useGetEmeraldBlocks({}, { query: { refetchInterval: 5000 } })
  return (
    <PageLayout>
      <h1>Latest Blocks</h1>
      {data?.data.blocks?.map(block => (
        <div key={block.hash + ' ' + block.timestamp}>{block.round}</div>
      ))}
    </PageLayout>
  )
}
