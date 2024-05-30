# Non-Fungible Tokens (NFTs)

## Features

- **NFT Ownership**: Indicates which address currently owns a particular NFT.
- **NFT Metadata**: Displays metadata associated with the NFT, such as name,
  description, image defined in the token's contract.
- **Transaction History**: Shows the transaction history of the NFT, allowing
  you to see past owners and sales prices.
- **Minting Information**: The time and block of when NFT was minted.

## NFT Metadata support

As of the time this documentation was written, our Explorer is designed to
support only the
official [ERC-721](https://github.com/ethereum/ERCs/blob/master/ERCS/erc-721.md)
metadata standard, as per Ethereum's
specifications.

At present, our system primarily supports the display of image type assets with
a preview feature. These image types can
reside on a variety of hosting platforms, including `https`, `ipfs` or
they can even be Base64 encoded (data:
image/*).

However, it's important to note that this does not imply a lack of support for
other types of assets. We do accommodate
a wide range of asset types, but instead of a preview, a link to the asset will
be provided. If a user clicks on this
link, they will be redirected to a new tab where the asset will be displayed.
For instance, if the asset is a video, it
will be played in the new tab, and if the native browser supports it, an
accurate preview of an asset will be shown.

### Properties support

The table herein outlines the properties that are specifically parsed/rendered
in our Explorer. You have the ability to
view the complete metadata JSON in our dedicated metadata preview section.

| Property | Description                                       |
|----------|---------------------------------------------------|
| _image_  | URL to the image, it can be any type of an image. |
| _name_   | Name of the asset.                                |

## Upcoming

Here is the proposed upcoming metadata structure. We kindly request that you
adhere to these guidelines to ensure that
your metadata is correctly interpreted and displayed within our explorer.

| Property        | Description                                                                                                                                                                                                                                                    |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| _image_         | URL to the image, it can be any type of an image. In the context of video content, this refers to a thumbnail representation of the respective video.                                                                                                          |
| _name_          | Name of the asset.                                                                                                                                                                                                                                             |
| _description_   | Description of the asset.                                                                                                                                                                                                                                      |
| _attributes_    | Attributes of an asset.                                                                                                                                                                                                                                        |
| _animation_url_ | URL to multi media asset. Our initial development plan includes support for video content. The incorporation of other media types is also under consideration and may be introduced at a future date, depending on the level of demand and usage requirements. |

Inspiration from
[source](https://docs.opensea.io/docs/metadata-standards#metadata-structure)

### Planned action items

- Add support for video assets
- Add support
  for [ERC-1155](https://github.com/ethereum/ERCs/blob/master/ERCS/erc-1155.md)
- Add attribute support
- Add support for different kind of assets(audio, documents,...)
