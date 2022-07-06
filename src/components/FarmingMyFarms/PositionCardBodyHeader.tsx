import React, { useEffect, useMemo } from "react";
import { FarmingType } from "../../models/enums";
import "./index.scss";
import CurrencyLogo from "../CurrencyLogo";
import { Token } from "@uniswap/sdk-core";
import { WrappedCurrency } from "../../models/types";
import { formatAmountTokens } from "../../utils/numbers";
import { formatUnits } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import BachelorTierIcon from "../../assets/images/bachelor-tier-icon.png";
import MasterTierIcon from "../../assets/images/master-tier-icon.png";
import ProfessorTierIcon from "../../assets/images/professor-tier-icon.png";
import { t } from "@lingui/macro";

interface PositionCardBodyHeaderProps {
    farmingType: number;
    date: string;
    eternalFarming?: any;
    enteredInEternalFarming?: any;
    el?: any;
}

export default function PositionCardBodyHeader({ el, farmingType, date, enteredInEternalFarming, eternalFarming }: PositionCardBodyHeaderProps) {
    const tierLevel = useMemo(() => {
        if (!el?.tokensLockedEternal || !el?.tierIncentive || !el?.tierEternal || !el?.tokensLockedIncentive) return;

        // console.log(farmingType === FarmingType.FINITE ? +el?.tierIncentive : +el?.tierEternal)

        switch (farmingType === FarmingType.FINITE ? +el?.tierIncentive : +el?.tierEternal) {
            case 0:
                return;
            case 1:
                return BachelorTierIcon;
            case 2:
                return MasterTierIcon;
            case 3:
                return ProfessorTierIcon;
            default:
                return;
        }
    }, [el]);

    const tierName = useMemo(() => {
        if (!el?.tokensLockedEternal || !el?.tierIncentive || !el?.tierEternal || !el?.tokensLockedIncentive) return;

        switch (farmingType === FarmingType.FINITE ? +el?.tierIncentive : +el?.tierEternal) {
            case 0:
                return;
            case 1:
                return t`Bachelor`;
            case 2:
                return t`Master`;
            case 3:
                return t`Professor`;
            default:
                return;
        }
    }, [el]);

    const tierMultiplier = useMemo(() => {
        if (!el || farmingType !== FarmingType.FINITE || !el.tierIncentive || !el.multiplierToken) return;

        if (!el || !el.tierIncentive || !el.tierEternal || !el.multiplierToken) return;

        switch (farmingType === FarmingType.FINITE ? +el.tierIncentive : +el.tierEternal) {
            case 0:
                return;
            case 1:
                return el.tier1multiplier;
            case 2:
                return el.tier2multiplier;
            case 3:
                return el.tier3multiplier;
            default:
                return;
        }
    }, [el, farmingType]);

    const isTier = useMemo(() => Boolean(tierLevel && tierName && tierMultiplier), [tierLevel, tierName, tierMultiplier]);

    return (
        <>
            <div className={`flex-s-between b ${isTier ? "mb-1" : "mb-3"} fs-125 ${farmingType === FarmingType.ETERNAL ? "farming-card-header ms_fd-c" : ""}`}>
                <span className={"w-100"}>{farmingType === FarmingType.FINITE ? "Limit " : "Infinite "} Farming</span>
                {farmingType === FarmingType.ETERNAL && enteredInEternalFarming && eternalFarming && (
                    <span className={"fs-085 l w-100 mm_fs-075 ms_ta-l mxs_ta-l ta-r"}>
                        <span>Entered at: </span>
                        <span>{date.slice(0, -3)}</span>
                    </span>
                )}
            </div>
            <div className={`flex-s-between b mb-1 fs-125 farming-card-header ms_fd-c`}>
                {tierLevel && tierName && (
                    <div className={"f f-ac mxs_ml-0 mxs_mv-1 ms_f-js w-100"}>
                        {/* <CurrencyLogo currency={new Token(97, el.multiplierToken.id, 18, el.multiplierToken.symbol) as WrappedCurrency} size={"35px"} /> */}
                        <div style={{ width: "30px", height: "30px", background: "#324e64", borderRadius: "50%" }} className={"f f-ac f-jc"}>
                            <img src={tierLevel} width={25} height={25} />
                        </div>
                        <div className={"ml-05"}>
                            <div className={"b fs-075"} style={{ marginBottom: "2px" }}>
                                TIER
                            </div>
                            <div className={"fs-1"}>{tierName}</div>
                        </div>
                    </div>
                )}
                {el?.multiplierToken && +(farmingType === FarmingType.FINITE ? el?.tokensLockedIncentive : el?.tokensLockedEternal) > 0 && (
                    <div className={"f f-ac f-jc ml-2 ms_ml-0 ms_f-js ms_mv-1 mxs_mv-1 w-100"}>
                        <CurrencyLogo currency={new Token(97, el?.multiplierToken.id, 18, el?.multiplierToken.symbol) as WrappedCurrency} size={"30px"} />
                        <div className={"ml-05"}>
                            <div className={"b fs-075"} style={{ marginBottom: "2px" }}>
                                LOCKED
                            </div>
                            <div className={"fs-1"}>{`${formatAmountTokens(
                                +formatUnits(BigNumber.from(farmingType === FarmingType.FINITE ? el?.tokensLockedIncentive : el?.tokensLockedEternal), el?.multiplierToken.decimals)
                            )} ${el?.multiplierToken.symbol}`}</div>
                        </div>
                    </div>
                )}
                {Boolean(+tierMultiplier) && (
                    <div className={"fs-095 w-100 pl-2 ms_ta-l ms_ta-l ta-l hide-m"}>
                        <div className={"b fs-075"} style={{ marginBottom: "2px" }}>
                            TIER BONUS
                        </div>
                        <div style={{ color: "#33FF89" }}>{`+${tierMultiplier / 100}%`}</div>
                    </div>
                )}
            </div>
            {Boolean(+tierMultiplier) && (
                <span className={"fs-1 l w-100 ms_ta-l n mb-1 show-m"}>
                    <div>Tier bonus: </div>
                    <div style={{ color: "#33FF89" }}>{`+${tierMultiplier / 100}%`}</div>
                </span>
            )}
        </>
    );
}
