import { FACTORY_ADDRESS as V2_FACTORY_ADDRESS } from '@uniswap/v2-sdk'
import { constructSameAddressMap } from '../utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const V3_CORE_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0xe5994746A4DcB206855a4DbdD15BB3B693df3380'
}

export const POOL_DEPLOYER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0xDB801F6Cf6e7Fc2538a4730301e5DB5C8ba22c20'
}

export const QUOTER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x2f8687246bba1831aC5bA7f4FBC6C868D2DA3f1e'
}

export const SWAP_ROUTER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0xbC3588C12184454C91618aE767047766b1Df1EDC'
}

export const NONFUNGIBLE_POSITION_MANAGER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0xF830896664A77347Bd1B26e030FEEab3739F3aEF'
}

export const MULTICALL_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x68AB69048597b610AAB5F474BC6F2Ffa907D9554'
}

export const V3_MIGRATOR_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x0A1E6F08bAFcd4c76DF8C0627E40481D99D5B33D',
}

export const REAL_STAKER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x32CFF674763b06B983C0D55Ef2e41B84D16855bb'
}

export const FINITE_FARMING: AddressMap = {
  [SupportedChainId.POLYGON]: '0xafce08d12F1F753877094EE664bF02D2f3782E38'
}

export const INFINITE_FARMING_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x1ea12CF71b1689b5d090e6E9c2198cb4fA98c373'
}

export const FARMING_CENTER: AddressMap = {
  [SupportedChainId.POLYGON]: '0xcd39E5763Cdb1Ff22bd2155fb3c3e8853249D7C8'
}

export const V2_FACTORY_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32'
}
export const V2_ROUTER_ADDRESS: AddressMap = {
  [SupportedChainId.POLYGON]: '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506'
}

export const ENS_REGISTRAR_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
}
export const SOCKS_CONTROLLER_ADDRESSES: AddressMap = {
  [SupportedChainId.POLYGON]: '0x65770b5283117639760beA3F867b69b3697a91dd',
}