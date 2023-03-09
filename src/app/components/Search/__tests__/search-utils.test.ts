import { isSearchValid, validateAndNormalize } from '../search-utils'

const notHexAndBech32Char = 'o'
const blockHeight = '1581078'
const blockHash = '4e63036b7449655e0c823ab63190d86c17226fbe5534f06e6f76abd31f075156'
const consensusTxHash = '0dc87374ff00319fe561e12d9758db8be88c3984b417b66c808f0d7e00c30df2'
const evmTxHash = 'bfe0c5072a6f860ccb089b2dbb846861aecc4ab287a00a641d7703645e047bd4'
const consensusAccount = 'oasis1qp65laz8zsa9a305wxeslpnkh9x4dv2h2qhjz0ec'
const evmAccount = '0xCB2412a993f406eFf10a74011410a4F35e3549E3'

describe('search-utils validateAndNormalize', () => {
  it('block height', () => {
    expect(validateAndNormalize.blockHeight(blockHeight)).toBe(blockHeight)
    expect(validateAndNormalize.blockHeight(parseInt(blockHeight).toLocaleString())).toBe(blockHeight)
    expect(validateAndNormalize.blockHeight(parseInt(blockHeight).toLocaleString('hu'))).toBe(blockHeight)
  })
  it('invalid block height', () => {
    expect(validateAndNormalize.blockHeight(blockHeight.replace('1', 'a'))).toBeUndefined()
  })

  it('block hash', () => {
    expect(validateAndNormalize.blockHash(blockHash)).toBe(blockHash)
    expect(validateAndNormalize.blockHash(`0x${blockHash}`)).toBe(blockHash)
  })
  it('block hash with random capitalization or typo - there is no checksum validation', () => {
    expect(validateAndNormalize.blockHash(blockHash.replace('e', 'E'))).toBe(blockHash)
    expect(validateAndNormalize.blockHash(blockHash.replace('e', 'f'))).toBe(blockHash.replace('e', 'f'))
  })
  it('invalid block hash', () => {
    expect(validateAndNormalize.blockHash('0x123')).toBeUndefined()
    expect(validateAndNormalize.blockHash(evmAccount)).toBeUndefined()
    expect(validateAndNormalize.blockHash(blockHash.slice(0, -3))).toBeUndefined()
    expect(validateAndNormalize.blockHash(blockHash.replace('e', notHexAndBech32Char))).toBeUndefined()
  })

  it('consensus transaction hash', () => {
    expect(validateAndNormalize.txHash(consensusTxHash)).toBe(consensusTxHash)
    expect(validateAndNormalize.txHash(`0x${consensusTxHash}`)).toBe(consensusTxHash)
  })
  it('evm transaction hash', () => {
    expect(validateAndNormalize.txHash(evmTxHash)).toBe(evmTxHash)
    expect(validateAndNormalize.txHash(`0x${evmTxHash}`)).toBe(evmTxHash)
  })
  it('transaction hash with random capitalization or typo - there is no checksum validation', () => {
    expect(validateAndNormalize.txHash(consensusTxHash.replace('e', 'E'))).toBe(consensusTxHash)
    expect(validateAndNormalize.txHash(consensusTxHash.replace('e', 'f'))).toBe(
      consensusTxHash.replace('e', 'f'),
    )
  })
  it('invalid transaction hash', () => {
    expect(validateAndNormalize.txHash(consensusTxHash.slice(0, -3))).toBeUndefined()
    expect(validateAndNormalize.txHash(consensusTxHash.replace('e', notHexAndBech32Char))).toBeUndefined()
  })

  it('consensus account address', () => {
    expect(validateAndNormalize.consensusAccount(consensusAccount)).toBe(consensusAccount)
    expect(
      validateAndNormalize.consensusAccount('oasis1 qp65 laz8 zsa9 a305 wxes lpnk h9x4 dv2h 2qhj z0ec'),
    ).toBe(consensusAccount)
  })
  it('consensus account address with random capitalization', () => {
    expect(validateAndNormalize.consensusAccount(consensusAccount.replace('e', 'E'))).toBe(consensusAccount)
  })
  it('invalid consensus account address with typo', () => {
    expect(validateAndNormalize.consensusAccount(consensusAccount.replace('e', 'f'))).toBeUndefined()
  })
  it('invalid consensus account address', () => {
    expect(validateAndNormalize.consensusAccount(consensusAccount.slice(0, -3))).toBeUndefined()
    expect(
      validateAndNormalize.consensusAccount(consensusAccount.replace('e', notHexAndBech32Char)),
    ).toBeUndefined()
  })

  it('evm account address', () => {
    expect(validateAndNormalize.evmAccount(evmAccount)).toBe(evmAccount.toLowerCase())
    expect(validateAndNormalize.evmAccount(evmAccount.replace('0x', ''))).toBe(evmAccount.toLowerCase())
  })
  it('lowercase evm account address with typo', () => {
    expect(validateAndNormalize.evmAccount(evmAccount.toLowerCase())).toBe(evmAccount.toLowerCase())
    expect(validateAndNormalize.evmAccount(evmAccount.toLowerCase().replace('e', 'f'))).toBe(
      evmAccount.toLowerCase().replace('e', 'f'),
    )
  })
  // TODO: validate checksums with @ethereumjs/util isValidChecksumAddress
  it.skip('invalid evm account address with random capitalization or typo', () => {
    expect(validateAndNormalize.evmAccount(evmAccount.replace('e', 'E'))).toBeUndefined()
    expect(validateAndNormalize.evmAccount(evmAccount.replace('e', 'f'))).toBeUndefined()
  })
  it('invalid evm account address', () => {
    expect(validateAndNormalize.evmAccount(evmAccount.slice(0, -3))).toBeUndefined()
    expect(validateAndNormalize.evmAccount(evmAccount.replace('e', notHexAndBech32Char))).toBeUndefined()
  })

  it('isSearchValid', () => {
    expect(isSearchValid(consensusTxHash)).toBe(true)
    expect(isSearchValid(blockHeight)).toBe(true)
    expect(isSearchValid(blockHeight.replace('1', 'a'))).toBe(false)
  })
})
