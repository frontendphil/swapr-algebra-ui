/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface IUniswapV3FactoryInterface extends ethers.utils.Interface {
  functions: {
    "createPool(address,address,uint24)": FunctionFragment;
    "enableFeeAmount(uint24,int24)": FunctionFragment;
    "feeAmountTickSpacing(uint24)": FunctionFragment;
    "getPool(address,address,uint24)": FunctionFragment;
    "owner()": FunctionFragment;
    "setOwner(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "createPool",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "enableFeeAmount",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "feeAmountTickSpacing",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getPool",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "setOwner", values: [string]): string;

  decodeFunctionResult(functionFragment: "createPool", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "enableFeeAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "feeAmountTickSpacing",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getPool", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setOwner", data: BytesLike): Result;

  events: {
    "FeeAmountEnabled(uint24,int24)": EventFragment;
    "OwnerChanged(address,address)": EventFragment;
    "PoolCreated(address,address,uint24,int24,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "FeeAmountEnabled"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnerChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PoolCreated"): EventFragment;
}

export type FeeAmountEnabledEvent = TypedEvent<
  [number, number] & { fee: number; tickSpacing: number }
>;

export type OwnerChangedEvent = TypedEvent<
  [string, string] & { oldOwner: string; newOwner: string }
>;

export type PoolCreatedEvent = TypedEvent<
  [string, string, number, number, string] & {
    token0: string;
    token1: string;
    fee: number;
    tickSpacing: number;
    pool: string;
  }
>;

export class IUniswapV3Factory extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: IUniswapV3FactoryInterface;

  functions: {
    createPool(
      tokenA: string,
      tokenB: string,
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    enableFeeAmount(
      fee: BigNumberish,
      tickSpacing: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    feeAmountTickSpacing(
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[number]>;

    getPool(
      tokenA: string,
      tokenB: string,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string] & { pool: string }>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    setOwner(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  createPool(
    tokenA: string,
    tokenB: string,
    fee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  enableFeeAmount(
    fee: BigNumberish,
    tickSpacing: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  feeAmountTickSpacing(
    fee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<number>;

  getPool(
    tokenA: string,
    tokenB: string,
    fee: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  setOwner(
    _owner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    createPool(
      tokenA: string,
      tokenB: string,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    enableFeeAmount(
      fee: BigNumberish,
      tickSpacing: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    feeAmountTickSpacing(
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<number>;

    getPool(
      tokenA: string,
      tokenB: string,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    setOwner(_owner: string, overrides?: CallOverrides): Promise<void>;
  };

  filters: {
    "FeeAmountEnabled(uint24,int24)"(
      fee?: BigNumberish | null,
      tickSpacing?: BigNumberish | null
    ): TypedEventFilter<[number, number], { fee: number; tickSpacing: number }>;

    FeeAmountEnabled(
      fee?: BigNumberish | null,
      tickSpacing?: BigNumberish | null
    ): TypedEventFilter<[number, number], { fee: number; tickSpacing: number }>;

    "OwnerChanged(address,address)"(
      oldOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { oldOwner: string; newOwner: string }
    >;

    OwnerChanged(
      oldOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { oldOwner: string; newOwner: string }
    >;

    "PoolCreated(address,address,uint24,int24,address)"(
      token0?: string | null,
      token1?: string | null,
      fee?: BigNumberish | null,
      tickSpacing?: null,
      pool?: null
    ): TypedEventFilter<
      [string, string, number, number, string],
      {
        token0: string;
        token1: string;
        fee: number;
        tickSpacing: number;
        pool: string;
      }
    >;

    PoolCreated(
      token0?: string | null,
      token1?: string | null,
      fee?: BigNumberish | null,
      tickSpacing?: null,
      pool?: null
    ): TypedEventFilter<
      [string, string, number, number, string],
      {
        token0: string;
        token1: string;
        fee: number;
        tickSpacing: number;
        pool: string;
      }
    >;
  };

  estimateGas: {
    createPool(
      tokenA: string,
      tokenB: string,
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    enableFeeAmount(
      fee: BigNumberish,
      tickSpacing: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    feeAmountTickSpacing(
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getPool(
      tokenA: string,
      tokenB: string,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    setOwner(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    createPool(
      tokenA: string,
      tokenB: string,
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    enableFeeAmount(
      fee: BigNumberish,
      tickSpacing: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    feeAmountTickSpacing(
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getPool(
      tokenA: string,
      tokenB: string,
      fee: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setOwner(
      _owner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
