import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { StatCard } from "./StatCard";
import "./index.scss";
import { t, Trans } from "@lingui/macro";
import { AlertCircle } from "react-feather";

interface InfoTotalStatsProps {
    data: any;
    isLoading: boolean;
    refreshHandler: any;
    blocksFetched: boolean;
    poolsStat: any;
}

export function InfoTotalStats({ data, isLoading, refreshHandler, blocksFetched, poolsStat }: InfoTotalStatsProps) {
    const { pathname } = useLocation();

    useEffect(() => {
        // if (blocksFetched) {
        refreshHandler();
        // }
    }, [blocksFetched]);

    const pool = useMemo(() => pathname.split("pools/")[1], [pathname]);

    const _data = useMemo(() => {
        if (pool) {
            let res = {
                tvlUSD: undefined,
                volumeUSD: undefined,
            };
            poolsStat?.forEach((item: any) => {
                if (item.address.toLowerCase() === pool.toLowerCase()) {
                    res = {
                        tvlUSD: item.tvlUSD,
                        volumeUSD: item.volumeUSD,
                    };
                }
            });
            return res;
        }
        return {
            tvlUSD: data?.tvlUSD,
            volumeUSD: data?.volumeUSD,
        };
    }, [data, poolsStat, pool]);

    return (
        <div>
            <div className={"total-stats-wrapper"}>
                <StatCard isLoading={isLoading} data={_data?.tvlUSD} title={t`Total Value Locked`} style={"mr-f-05 mxs_m-0"} />
                <StatCard isLoading={isLoading} data={_data?.volumeUSD} title={t`Volume`} style={"ml-l-05 mxs_m-0"} />
            </div>
        </div>
    );
}
