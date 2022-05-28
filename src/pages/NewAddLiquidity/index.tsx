import { useCurrency } from "hooks/Tokens";
import { useIsNetworkFailedImmediate } from "hooks/useIsNetworkFailed";
import usePrevious from "hooks/usePrevious";
import { useActiveWeb3React } from "hooks/web3";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Redirect, Route, RouteComponentProps, Switch, useRouteMatch } from "react-router-dom";
import { useV3DerivedMintInfo, useV3MintState, useV3MintActionHandlers, useRangeHopCallbacks } from "state/mint/v3/hooks";
import { currencyId } from "utils/currencyId";
import { Stepper } from "./components/Stepper";
import { EnterAmounts } from "./containers/EnterAmounts";
import { SelectPair } from "./containers/SelectPair";
import { SelectRange } from "./containers/SelectRange";

import { Currency, CurrencyAmount } from "@uniswap/sdk-core";

import "./index.scss";
import { WMATIC_EXTENDED } from "constants/tokens";
import { Bound } from "state/mint/v3/actions";
import LiquidityChartRangeInput from "components/LiquidityChartRangeInput";
import { Field } from "state/mint/actions";
import { maxAmountSpend } from "utils/maxAmountSpend";
import { useUSDCValue } from "hooks/useUSDCPrice";
import { ApprovalState, useApproveCallback } from "hooks/useApproveCallback";
import { NONFUNGIBLE_POSITION_MANAGER_ADDRESSES } from "constants/addresses";
import { PriceFormatToggler } from "./components/PriceFomatToggler";
import { AddLiquidityButton } from "./containers/AddLiquidityButton";
import { Check, ChevronLeft, ChevronRight } from "react-feather";
import { PoolState } from "hooks/usePools";
import { RouterGuard } from "./routing/router-guards";
import { InitialPrice } from "./containers/InitialPrice";


export function NewAddLiquidityPage({
    match: {
        params: { currencyIdA, currencyIdB, step },
    },
    history,
}: RouteComponentProps<{
    currencyIdA?: string;
    currencyIdB?: string;
    step?: string;
}>) {
    const { chainId } = useActiveWeb3React();

    // const toggleWalletModal = useWalletModalToggle() // toggle wallet when disconnected
    // const expertMode = useIsExpertMode()
    // const addTransaction = useTransactionAdder()
    // const positionManager = useV3NFTPositionManagerContract()

    // check for existing position if tokenId in url
    // const { position: existingPositionDetails, loading: positionLoading } = useV3PositionFromTokenId(tokenId ? BigNumber.from(tokenId) : undefined)

    // const networkFailed = useIsNetworkFailed()

    // const hasExistingPosition = !!existingPositionDetails && !positionLoading
    // const { position: existingPosition } = useDerivedPositionInfo(existingPositionDetails)

    const { path } = useRouteMatch();

    const feeAmount = 100;

    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        onFieldAInput("");
        onFieldBInput("");
        onLeftRangeInput("");
        onRightRangeInput("");
    }, [currencyIdA, currencyIdB]);

    const baseCurrency = useCurrency(currencyIdA);
    const currencyB = useCurrency(currencyIdB);
    // prevent an error if they input ETH/WETH
    //TODO
    const quoteCurrency = baseCurrency && currencyB && baseCurrency.wrapped.equals(currencyB.wrapped) ? undefined : currencyB;

    const derivedMintInfo = useV3DerivedMintInfo(baseCurrency ?? undefined, quoteCurrency ?? undefined, feeAmount, baseCurrency ?? undefined, undefined);
    const prevDerivedMintInfo = usePrevious({ ...derivedMintInfo });

    const mintInfo = useMemo(() => {
        if ((!derivedMintInfo.pool || !derivedMintInfo.price || derivedMintInfo.noLiquidity) && prevDerivedMintInfo) {
            return {
                ...prevDerivedMintInfo,
            };
        }
        return {
            ...derivedMintInfo,
        };
    }, [derivedMintInfo, baseCurrency, quoteCurrency]);

    const { onFieldAInput, onFieldBInput, onLeftRangeInput, onRightRangeInput, onStartPriceInput } = useV3MintActionHandlers(mintInfo.noLiquidity);

    const handleCurrencySelect = useCallback(
        (currencyNew: Currency, currencyIdOther?: string): (string | undefined)[] => {
            const currencyIdNew = currencyId(currencyNew, chainId || 137);

            let chainSymbol;

            if (chainId === 137) {
                chainSymbol = "MATIC";
            }

            if (currencyIdNew.toLowerCase() === currencyIdOther?.toLowerCase()) {
                // not ideal, but for now clobber the other if the currency ids are equal
                return [currencyIdNew, undefined];
            } else {
                // prevent weth + eth
                const isETHOrWETHNew = currencyIdNew === chainSymbol || (chainId !== undefined && currencyIdNew === WMATIC_EXTENDED[chainId]?.address);
                const isETHOrWETHOther = currencyIdOther !== undefined && (currencyIdOther === chainSymbol || (chainId !== undefined && currencyIdOther === WMATIC_EXTENDED[chainId]?.address));

                if (isETHOrWETHNew && isETHOrWETHOther) {
                    return [currencyIdNew, undefined];
                } else {
                    return [currencyIdNew, currencyIdOther];
                }
            }
        },
        [chainId]
    );

    const handleCurrencyASelect = useCallback(
        (currencyANew: Currency) => {
            const [idA, idB] = handleCurrencySelect(currencyANew, currencyIdB);
            if (idB === undefined) {
                history.push(`/new-add/${idA}`);
            } else {
                history.push(`/new-add/${idA}/${idB}`);
            }
        },
        [handleCurrencySelect, currencyIdB, history]
    );

    const handleCurrencyBSelect = useCallback(
        (currencyBNew: Currency) => {
            const [idB, idA] = handleCurrencySelect(currencyBNew, currencyIdA);
            if (idA === undefined) {
                history.push(`/new-add/${idB}`);
            } else {
                history.push(`/new-add/${idA}/${idB}`);
            }
        },
        [handleCurrencySelect, currencyIdA, history]
    );

    const handleCurrencySwap = useCallback(() => {
        history.push(`/new-add/${currencyIdB}/${currencyIdA}`);
    }, [history, handleCurrencySelect, currencyIdA, currencyIdB]);

    const handlePopularPairSelection = useCallback((pair: [string, string]) => {
        history.push(`/new-add/${pair[0]}/${pair[1]}`);
    }, []);

    const handleStepChange = useCallback((_step) => {
        history.push(`/new-add/${currencyIdA}/${currencyIdB}/${_step}`);
    }, [currencyIdA, currencyIdB, history]);

    const handlePriceFormat = useCallback(() => {}, []);

    const stepLinks = useMemo(() => { 

        const _stepLinks = [{
            link: 'select-pair',
            title: 'Select a pair'
        }]
        
        if (mintInfo.noLiquidity && baseCurrency && quoteCurrency) {
            _stepLinks.push({
                link: 'initial-price',
                title: 'Set initial price'
            })
        }

        _stepLinks.push(
            {
                link: 'select-range',
                title: 'Select a range'
            },
            { 
            link: "enter-an-amounts", 
            title: 'Enter an amounts'
        })

        return _stepLinks

}, [baseCurrency, quoteCurrency, mintInfo])

    const step1 = useMemo(() => {
        return Boolean(baseCurrency && quoteCurrency);
    }, [baseCurrency, quoteCurrency]);

    const step2 = useMemo(() => {
        return Boolean(mintInfo.lowerPrice && mintInfo.upperPrice && !mintInfo.invalidRange)
    }, [mintInfo]);

    const step3 = useMemo(() => {
        if (mintInfo.outOfRange) {
            return Boolean(mintInfo.parsedAmounts[Field.CURRENCY_A] || mintInfo.parsedAmounts[Field.CURRENCY_B])
        }
        return Boolean(mintInfo.parsedAmounts[Field.CURRENCY_A] && mintInfo.parsedAmounts[Field.CURRENCY_B])
    }, [mintInfo]);

    const additionalStep = useMemo(() => {
        return false
    }, [mintInfo])

    const steps = useMemo(() => {
        return [
            step1,
            step2,
            step3
        ]
    }, [step1, step2, step3])

    const completedSteps = useMemo(() => {
        return Array(currentStep).map((_, i) => i + 1);
    }, [currentStep]);

    
    return (
        <div className="add-liquidity-page" style={{ width: "1080px" }}>
            <div className="add-liquidity-page__header f">
                <span className="add-liquidity-page__header-title">Add liquidity</span>
                <span className="ml-a">
                    <span className="mr-1">
                        <PriceFormatToggler handlePriceFormat={handlePriceFormat} />
                    </span>
                    {/* <span>Settings</span> */}
                </span>
            </div>
            <div className="add-liquidity-page__stepper mb-2">
                <Stepper currencyA={baseCurrency ?? undefined} currencyB={quoteCurrency ?? undefined} mintInfo={mintInfo} stepLinks={stepLinks} completedSteps={completedSteps} />
            </div>
            <Switch>
                <RouterGuard
                    path={`/new-add/${currencyIdA}/${currencyIdB}/enter-an-amounts`}
                    redirect={`/new-add/${currencyIdA}/${currencyIdB}/select-pair`}
                    allowance={step1 && step2 && currentStep === 2}
                    Component={EnterAmounts}
                    currencyA={baseCurrency ?? undefined}
                    currencyB={currencyB ?? undefined}
                    mintInfo={mintInfo}
                    isCompleted={step3}
                />

                <RouterGuard
                    path={`/new-add/${currencyIdA}/${currencyIdB}/select-range`}
                    redirect={`/new-add/${currencyIdA}/${currencyIdB}/select-pair`}
                    allowance={step1 && currentStep === 1}
                    Component={SelectRange}
                    currencyA={baseCurrency}
                    currencyB={quoteCurrency}
                    mintInfo={mintInfo}
                    disabled={!step1}
                    isCompleted={step2}
                />

                <RouterGuard
                    path={`/new-add/${currencyIdA}/${currencyIdB}/initial-price`}
                    redirect={`/new-add/${currencyIdA}/${currencyIdB}/select-pair`}
                    allowance={mintInfo.noLiquidity}
                    Component={InitialPrice}
                    currencyA={baseCurrency ?? undefined}
                    currencyB={currencyB ?? undefined}
                    mintInfo={mintInfo}
                    isCompleted={additionalStep}
                />

                <RouterGuard
                    path={``}
                    redirect={`/new-add/${currencyIdA}/${currencyIdB}/select-pair`}
                    allowance={currentStep === 0}
                    Component={SelectPair}
                    baseCurrency={baseCurrency}
                    quoteCurrency={quoteCurrency}
                    mintInfo={mintInfo}
                    isCompleted={step1}
                    handleCurrencySwap={handleCurrencySwap}
                    handleCurrencyASelect={handleCurrencyASelect}
                    handleCurrencyBSelect={handleCurrencyBSelect}
                    handlePopularPairSelection={handlePopularPairSelection}
                />
            </Switch>
            <div className="add-buttons f f-jb mt-2">
                {
                    currentStep !== 0 && 
                    <div>
                        <button className="add-buttons__next f" onClick={() => {
                            setCurrentStep(currentStep - 1);
                            handleStepChange(stepLinks[currentStep - 1].link)
                        }} >
                            <ChevronLeft size={18} style={{marginRight: '5px'}}/>
                            <span>{stepLinks[currentStep - 1].title}</span>
                        </button>
                        </div>}
                {currentStep === 2 ? (
                    <AddLiquidityButton baseCurrency={baseCurrency ?? undefined} quoteCurrency={quoteCurrency ?? undefined} mintInfo={mintInfo} />
                ) : (
                    <button
                        className="add-buttons__next f ml-a"
                        disabled={!steps[currentStep]}
                        onClick={() => {
                            setCurrentStep(currentStep + 1);
                            handleStepChange(stepLinks[currentStep + 1].link);
                        }}
                    >
                        <span>{stepLinks[currentStep + 1].title}</span>
                        <ChevronRight size={18} style={{marginLeft: '5px'}}/>
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="add-liquidity-page">
            <div className="add-liquidity-page__header f">
                <span className="add-liquidity-page__header-title">Add liquidity</span>
                <span className="ml-a">
                    <span className="mr-1">
                        <PriceFormatToggler handlePriceFormat={handlePriceFormat} />
                    </span>
                    {/* <span>Settings</span> */}
                </span>
            </div>
            <div className="add-liquidity-page__steps">
                <div className="f f-ac mt-2 mb-1">
                    <div className={`add-liquidity-page__step-circle ${step1 ? "done" : ""} f f-ac f-jc`}>{step1 ? <Check stroke={"white"} strokeWidth={3} size={15} /> : "1"}</div>
                    <div className="add-liquidity-page__step-title ml-1">Select pair</div>
                </div>
                <div className="select-pair">
                    <SelectPair
                        baseCurrency={baseCurrency}
                        quoteCurrency={quoteCurrency}
                        mintInfo={mintInfo}
                        isCompleted={step1}
                        handleCurrencySwap={handleCurrencySwap}
                        handleCurrencyASelect={handleCurrencyASelect}
                        handleCurrencyBSelect={handleCurrencyBSelect}
                        handlePopularPairSelection={handlePopularPairSelection}
                    />
                </div>
                {mintInfo.poolState === PoolState.NOT_EXISTS && mintInfo.noLiquidity && (
                    <>
                        <div className="f f-ac mt-2 mb-1">
                            <div className={`add-liquidity-page__step-circle ${step2 ? "done" : ""} f f-ac f-jc`}>{step2 ? <Check stroke={"white"} strokeWidth={3} size={15} /> : "2"}</div>
                            <div className="add-liquidity-page__step-title ml-1">Set initial price</div>
                        </div>
                        <div className="select-range">
                            {/* <InitialPrice /> */}
                        </div>
                    </>
                )}
                <div className="f f-ac mt-2 mb-1">
                    <div className={`add-liquidity-page__step-circle ${step2 ? "done" : ""} f f-ac f-jc`}>{step2 ? <Check stroke={"white"} strokeWidth={3} size={15} /> : "2"}</div>
                    <div className="add-liquidity-page__step-title ml-1">Select range</div>
                </div>
                <div className="select-range">
                    <SelectRange isCompleted={true} currencyA={baseCurrency} currencyB={quoteCurrency} mintInfo={mintInfo} disabled={!step1} />
                </div>
                <div className="f f-ac mt-2 mb-1">
                    <div className={`add-liquidity-page__step-circle ${step3 ? "done" : ""} f f-ac f-jc`}>{step3 ? <Check stroke={"white"} strokeWidth={3} size={15} /> : "3"}</div>
                    <div className="add-liquidity-page__step-title ml-1">Enter an amount</div>
                </div>
                <div className="enter-ammounts">
                    <EnterAmounts isCompleted={true} currencyA={baseCurrency ?? undefined} currencyB={currencyB ?? undefined} mintInfo={mintInfo} />
                </div>
                <div className="add-buttons mt-2">
                    {/* <Stepper completedSteps={completedSteps} /> */}
                    <AddLiquidityButton baseCurrency={baseCurrency ?? undefined} quoteCurrency={quoteCurrency ?? undefined} mintInfo={mintInfo} />
                </div>
            </div>
            {/* <div className="add-liquidity-page__stepper">
                <Stepper step={1} />
            </div> */}
        </div>
    );
}
