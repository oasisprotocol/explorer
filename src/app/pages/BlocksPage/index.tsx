import { useGetEmeraldBlocks } from '../../../oasis-indexer/generated/api';
import { ResultPageLayout } from '../../components/PageLayout/ResultPageLayout';

export function BlocksPage() {
  const { data } = useGetEmeraldBlocks({}, { query: { refetchInterval: 5000 } })
  return (
    <ResultPageLayout>
      <>
        <h1>Latest Blocks</h1>
        {data?.data.blocks?.map(block => (
          <div key={block.hash + ' ' + block.timestamp}>{block.round}</div>
        ))}
      </>
    </ResultPageLayout>
  )
}
