import { useCallback, useContext, useState } from "react";
import Modal from "../Modal";
import { ThemeContext } from "styled-components/macro";
import { Trans } from "@lingui/macro";
import { ModalContentWrapper, StyledCloseIcon } from "./styled";

export default function StakingModal({ modal, closeModalCallback }: { modal: boolean; closeModalCallback: () => void }) {
    const [approved, setApproved] = useState(false);

    const [sent, setSent] = useState(false);

    const [staked, setStaked] = useState(false);

    const approve = useCallback(() => {
        setApproved(true);
    }, [approved]);

    const send = useCallback(() => {
        setSent(true);
    }, [sent]);

    const stake = useCallback(() => {
        setStaked(true);
    }, [staked]);

    const theme = useContext(ThemeContext);

    return (
        <Modal isOpen={modal} onDismiss={() => console.log("")} maxHeight={80}>
            <ModalContentWrapper>
                {!approved ? (
                    <>
                        <div
                            style={{
                                marginBottom: "1rem",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Trans>Approve NFT</Trans>
                            <StyledCloseIcon onClick={closeModalCallback} />
                        </div>
                        <div
                            style={{
                                padding: "8px",
                                borderRadius: "6px",
                                backgroundColor: "#0f1940",
                                color: "#5376ff",
                                marginBottom: "1rem",
                            }}
                        >
                            <Trans>To stake your NFT you should approve Algebra to use it</Trans>
                        </div>
                        <button
                            style={{
                                padding: "1rem",
                                width: "100%",
                                border: "none",
                                borderRadius: "8px",
                                color: "white",
                                backgroundColor: theme.winterMainButton,
                                fontSize: "18px",
                            }}
                            onClick={approve}
                        >
                            <Trans>Approve</Trans>
                        </button>
                    </>
                ) : !sent ? (
                    <>
                        <div
                            style={{
                                marginBottom: "1rem",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Trans>Send NFT</Trans>
                            <StyledCloseIcon onClick={closeModalCallback} />
                        </div>
                        <button
                            style={{
                                padding: "1rem",
                                width: "100%",
                                border: "none",
                                borderRadius: "8px",
                                color: "white",
                                backgroundColor: theme.winterMainButton,
                                fontSize: "18px",
                            }}
                            onClick={send}
                        >
                            <Trans>Send</Trans>
                        </button>
                    </>
                ) : !staked ? (
                    <>
                        <div
                            style={{
                                marginBottom: "1rem",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Trans>Deposit NFT</Trans>
                            <StyledCloseIcon onClick={closeModalCallback} />
                        </div>
                        <button
                            style={{
                                padding: "1rem",
                                width: "100%",
                                border: "none",
                                borderRadius: "8px",
                                color: "white",
                                backgroundColor: theme.winterMainButton,
                                fontSize: "18px",
                            }}
                            onClick={stake}
                        >
                            <Trans>Deposit</Trans>
                        </button>
                    </>
                ) : (
                    <>
                        <div
                            style={{
                                marginBottom: "1rem",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <Trans>Done!</Trans>
                            <StyledCloseIcon onClick={closeModalCallback} />
                        </div>
                    </>
                )}
            </ModalContentWrapper>
        </Modal>
    );
}
