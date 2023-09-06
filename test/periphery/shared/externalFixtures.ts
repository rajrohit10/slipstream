import { Fixture } from 'ethereum-waffle'
import { ethers, waffle } from 'hardhat'
import { IUniswapV3Pool, IUniswapV3Factory, IWETH9, MockTimeSwapRouter, TestERC20 } from '../../../typechain'
import { MockVoter } from '../../../typechain/MockVoter'
import { CLGaugeFactory } from '../../../typechain/CLGaugeFactory'
import { CLGauge } from '../../../typechain/CLGauge'
import { constants } from 'ethers'

import WETH9 from '../contracts/WETH9.json'

const wethFixture: Fixture<{ weth9: IWETH9 }> = async ([wallet]) => {
  const weth9 = (await waffle.deployContract(wallet, {
    bytecode: WETH9.bytecode,
    abi: WETH9.abi,
  })) as IWETH9

  return { weth9 }
}

const v3CoreFactoryFixture: Fixture<IUniswapV3Factory> = async ([wallet]) => {
  const tokenFactory = await ethers.getContractFactory('TestERC20')
  const rewardToken: TestERC20 = (await tokenFactory.deploy(constants.MaxUint256.div(2))) as TestERC20 // do not use maxu256 to avoid overflowing

  const Pool = await ethers.getContractFactory('UniswapV3Pool')
  const Factory = await ethers.getContractFactory('UniswapV3Factory')
  const pool = (await Pool.deploy()) as IUniswapV3Pool

  const MockVoterFactory = await ethers.getContractFactory('MockVoter')
  const GaugeImplementationFactory = await ethers.getContractFactory('CLGauge')
  const GaugeFactoryFactory = await ethers.getContractFactory('CLGaugeFactory')

  // voter & gauge factory set up
  const mockVoter = (await MockVoterFactory.deploy(rewardToken.address)) as MockVoter
  const gaugeImplementation = (await GaugeImplementationFactory.deploy()) as CLGauge
  const gaugeFactory = (await GaugeFactoryFactory.deploy(
    mockVoter.address,
    gaugeImplementation.address,
    '0x0000000000000000000000000000000000000000' // nft position manager stub, unused in hardhat tests
  )) as CLGaugeFactory
  await mockVoter.setGaugeFactory(gaugeFactory.address)

  const factory = (await Factory.deploy(mockVoter.address, pool.address)) as IUniswapV3Factory
  // backwards compatible with v3-periphery tests
  await factory['enableTickSpacing(int24,uint24)'](10, 500)
  await factory['enableTickSpacing(int24,uint24)'](60, 3000)
  await factory['enableTickSpacing(int24,uint24)'](200, 10_000)
  return factory
}

export const v3RouterFixture: Fixture<{
  weth9: IWETH9
  factory: IUniswapV3Factory
  router: MockTimeSwapRouter
}> = async ([wallet], provider) => {
  const { weth9 } = await wethFixture([wallet], provider)
  const factory = await v3CoreFactoryFixture([wallet], provider)

  const router = (await (await ethers.getContractFactory('MockTimeSwapRouter')).deploy(
    factory.address,
    weth9.address
  )) as MockTimeSwapRouter

  return { factory, weth9, router }
}