import WdogeLogo from '../../assets/images/doge-logo.png'
import EthLogo from '../../assets/images/ether-logo.png'
import USDTLogo from '../../assets/images/USDT-logo.png'
import USDCLogo from '../../assets/svg/usd-coin-usdc-logo.svg'
import WBTCLogo from '../../assets/images/wbtc-logo.png'
import DDLogo from '../../assets/images/doge-dragon-logo.jpg'

interface SpecialTokensInterface {
    [key: string]: {
        name: string
        logo: string
    }
}

export const specialTokens: SpecialTokensInterface = {
    ['0xb7ddc6414bf4f5515b52d8bdd69973ae205ff101']: {
        name: 'WDOGE',
        logo: WdogeLogo
    },
    ['0xb44a9b6905af7c801311e8f4e76932ee959c663c']: {
        name: 'Ether',
        logo: EthLogo
    },
    ['0x765277eebeca2e31912c9946eae1021199b39c61']: {
        name: 'USDC',
        logo: USDCLogo
    },
    ['0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d']: {
        name: 'USDT',
        logo: USDTLogo
    },
    ['0xfa9343c3897324496a05fc75abed6bac29f8a40f']: {
        name: 'WBTC',
        logo: WBTCLogo
    },
    ['0x582daef1f36d6009f64b74519cfd612a8467be18']: {
        name: 'DD',
        logo: DDLogo
    }
}
