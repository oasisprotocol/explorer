import { Link } from 'react-router-dom'
import { FC } from 'react'
import { PageLayout } from '../../components/PageLayout'
import { useGetEmeraldBlocks } from '../../../oasis-indexer/api'
import { emeraldRoute } from '../../../routes'

export const BlocksPage: FC = () => {
  const { data } = useGetEmeraldBlocks({}, { query: { refetchInterval: 5000 } })
  return (
    <PageLayout>
      <h1>Latest Blocks</h1>
      {data?.data.blocks?.map(block => (
        <div key={block.hash + ' ' + block.timestamp}>
          <Link to={`${emeraldRoute}/blocks/${encodeURIComponent(block.round!)}`}>{block.round}</Link>
        </div>
      ))}
    </PageLayout>
  )
}
