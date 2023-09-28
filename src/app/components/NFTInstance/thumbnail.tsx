import { FC } from 'react'
import { EvmNft } from '../../../oasis-nexus/api'
import { processNftImageUrl } from '../../utils/nft-images'
import Box from '@mui/material/Box'
import { AccountLink } from '../Account/AccountLink'
import { SearchScope } from '../../../types/searchScope'
import { StyledDescriptionList } from '../StyledDescriptionList'
import { NFTInstanceLinkFor } from './NFTInstanceLink'

const fakeOwner = '0xCB2412a993f406eFf10a74011410a4F35e3549E3'

/***
 * This is a thumbnail for an NFT instance, to be used when displaying list of instances.
 */
export const NFTInstanceThumbnail: FC<{ scope: SearchScope; instance: EvmNft }> = ({ scope, instance }) => {
  const { image } = instance

  const imageUrl = processNftImageUrl(image)
  // console.log(instance, imageUrl)

  return (
    <Box
      width={210}
      style={{
        width: 212,
        height: 275,
        borderRadius: 8,
        border: '1px solid var(--brand-extra-dark, #000062)',
      }}
    >
      <img
        src={imageUrl}
        alt={'Preview'}
        style={{
          width: 210,
          height: 210,
          flexShrink: 0,
        }}
      />
      <NFTInstanceLinkFor scope={scope} instance={instance} />
      <StyledDescriptionList
        titleWidth="55px"
        standalone={false}
        style={
          {
            // display: 'flex',
            // width: '195px',
            // flexDirection: 'column',
            // alignItems: 'flex-start',
          }
        }
      >
        <dt>Owner:</dt>
        <dd> {<AccountLink scope={scope} address={fakeOwner} alwaysTrim={true} />}</dd>
      </StyledDescriptionList>
    </Box>
  )
}
