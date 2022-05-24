import React, { ReactNode, useCallback, useMemo } from "react";
import { Trans } from "@lingui/macro";
import { Currency, Price, Token } from "@uniswap/sdk-core";
import { AutoColumn, ColumnCenter } from "components/Column";
import Loader from "components/Loader";
import { useColor } from "hooks/useColor";
import useTheme from "hooks/useTheme";
import { saturate } from "polished";
import { BarChart2, CloudOff, Inbox } from "react-feather";
import { batch } from "react-redux";
import { TYPE } from "../../theme";
import { Chart } from "./Chart";
import { useDensityChartData } from "./hooks";
import { format } from "d3";
import { Bound } from "state/mint/v3/actions";
import { FeeAmount } from "lib/src";
import { ZoomLevels } from "./types";
import { ChartWrapper } from "./styled";

import ReactGA from "react-ga";

const ZOOM_LEVELS: Record<FeeAmount, ZoomLevels> = {
    [FeeAmount.LOW]: {
        initialMin: 0.2,
        initialMax: 0.5,
        min: 0.01,
        max: 20,
    },
    [FeeAmount.MEDIUM]: {
        initialMin: 0.2,
        initialMax: 0.5,
        min: 0.01,
        max: 20,
    },
    [FeeAmount.HIGH]: {
        initialMin: 0.75,
        initialMax: 1.5,
        min: 0.01,
        max: 20,
    },
};

function InfoBox({ message, icon }: { message?: ReactNode; icon: ReactNode }) {
    return (
        <ColumnCenter style={{ height: "100%", justifyContent: "center" }}>
            {icon}
            {message && (
                <TYPE.mediumHeader padding={10} marginTop="20px" textAlign="center">
                    {message}
                </TYPE.mediumHeader>
            )}
        </ColumnCenter>
    );
}

export default function LiquidityChartRangeInput({
    currencyA,
    currencyB,
    feeAmount,
    ticksAtLimit,
    price,
    priceLower,
    priceUpper,
    onLeftRangeInput,
    onRightRangeInput,
    interactive,
}: {
    currencyA: Currency | undefined;
    currencyB: Currency | undefined;
    feeAmount?: FeeAmount;
    ticksAtLimit: { [bound in Bound]?: boolean | undefined };
    price: number | undefined;
    priceLower?: Price<Token, Token>;
    priceUpper?: Price<Token, Token>;
    onLeftRangeInput: (typedValue: string) => void;
    onRightRangeInput: (typedValue: string) => void;
    interactive: boolean;
}) {
    const theme = useTheme();

    const tokenAColor = useColor(currencyA?.wrapped);
    const tokenBColor = useColor(currencyB?.wrapped);

    const { isLoading, isUninitialized, isError, error, formattedData } = useDensityChartData({
        currencyA,
        currencyB,
        feeAmount,
    });

    const onBrushDomainChangeEnded = useCallback(
        (domain) => {
            let leftRangeValue = Number(domain[0]);
            const rightRangeValue = Number(domain[1]);

            //L-2

            if (leftRangeValue <= 0) {
                leftRangeValue = 1 / 10 ** 6;
            }

            batch(() => {
                // simulate user input for auto-formatting and other validations
                leftRangeValue > 0 && onLeftRangeInput(leftRangeValue.toFixed(6));
                rightRangeValue > 0 && onRightRangeInput(rightRangeValue.toFixed(6));
            });
        },
        [onLeftRangeInput, onRightRangeInput]
    );

    interactive = interactive && Boolean(formattedData?.length);

    const brushDomain: [number, number] | undefined = useMemo(() => {
        console.log("asdasd", currencyA, currencyB, priceLower, priceUpper);
        //TODO
        const isSorted = currencyA && currencyB && currencyA?.wrapped.sortsBefore(currencyB?.wrapped);
        // const isSorted = true

        const leftPrice = isSorted ? priceLower : priceUpper?.invert();
        const rightPrice = isSorted ? priceUpper : priceLower?.invert();

        return leftPrice && rightPrice ? [parseFloat(leftPrice?.toSignificant(5)), parseFloat(rightPrice?.toSignificant(5))] : undefined;
    }, [currencyA, currencyB, priceLower, priceUpper]);

    const brushLabelValue = useCallback(
        (d: "w" | "e", x: number) => {
            if (!price) return "";

            if (d === "w" && ticksAtLimit[Bound.LOWER]) return "0";
            if (d === "e" && ticksAtLimit[Bound.UPPER]) return "∞";

            //const percent = (((x < price ? -1 : 1) * (Math.max(x, price) - Math.min(x, price))) / Math.min(x, price)) * 100

            const percent = (x < price ? -1 : 1) * ((Math.max(x, price) - Math.min(x, price)) / price) * 100;

            return price ? `${format(Math.abs(percent) > 1 ? ".2~s" : ".2~f")(percent)}%` : "";
        },
        [price, ticksAtLimit]
    );

    if (isError) {
        ReactGA.exception({
            ...error,
            category: "Liquidity",
            fatal: false,
        });
    }

    return (
        <AutoColumn gap="md" style={{ minHeight: "200px" }}>
            {isUninitialized ? (
                <InfoBox message={<Trans>Your position will appear here.</Trans>} icon={<Inbox size={56} stroke={theme.text1} />} />
            ) : isLoading ? (
                <InfoBox icon={<Loader size="40px" stroke={theme.text4} />} />
            ) : isError ? (
                <InfoBox message={<Trans>Liquidity data not available.</Trans>} icon={<CloudOff size={56} stroke={theme.text4} />} />
            ) : !formattedData || formattedData === [] || !price ? (
                <InfoBox message={<Trans>There is no liquidity data.</Trans>} icon={<BarChart2 size={56} stroke={theme.text4} />} />
            ) : (
                <ChartWrapper>
                    <Chart
                        data={{ series: formattedData, current: price }}
                        dimensions={{ width: 400, height: 175 }}
                        margins={{ top: 10, right: 0, bottom: 20, left: 0 }}
                        styles={{
                            area: {
                                selection: "#008FFF",
                            },
                            brush: {
                                handle: {
                                    west: saturate(0.1, tokenAColor) ?? theme.red1,
                                    east: saturate(0.1, tokenBColor) ?? theme.blue1,
                                },
                            },
                        }}
                        interactive={interactive}
                        brushLabels={brushLabelValue}
                        brushDomain={brushDomain}
                        onBrushDomainChange={onBrushDomainChangeEnded}
                        zoomLevels={ZOOM_LEVELS[FeeAmount.MEDIUM]}
                    />
                </ChartWrapper>
            )}
        </AutoColumn>
    );
}
