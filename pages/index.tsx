import company from "./company.json";
import { ChangeEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import { InView } from "react-intersection-observer";
import { FaSpeakerDeck, FaSlideshare } from "react-icons/fa";
import { BsFillFileEarmarkSpreadsheetFill } from "react-icons/bs";
import { AiFillCaretLeft, AiFillCaretRight, AiFillGithub } from "react-icons/ai";

import { useMediaQuery } from "react-responsive";
import Head from "next/head";

declare module "react" {
    interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
        jsx?: boolean;
        global?: boolean;
    }
}
type Company = (typeof company)[0];
const Company = (props: Company) => {
    return (
        <>
            <style jsx>{`
                .Company {
                    background-color: white;
                    display: grid;
                    flex-direction: column;
                    place-items: center;
                }

                .CompanyName {
                    font-family: system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", "Segoe UI", "Meiryo",
                        sans-serif;
                }

                .Company a {
                    color: #0078b4;
                }

                .CompanySlides {
                    display: flex;
                    align-content: center;
                    align-items: center;
                }
            `}</style>
            <div
                style={{
                    width: props.image_width,
                    height: props.image_height
                }}
                className={"Company"}
            >
                <h1 className={"CompanyName"}>
                    <a
                        href={props.company_url}
                        target={"_blank"}
                        rel="noreferrer"
                        aria-label={`${props.company_name}の会社ページ`}
                    >
                        {props.company_name}
                    </a>
                </h1>
                <h2>
                    {props.type === "speakerdeck" && (
                        <a
                            className={"CompanySlides"}
                            href={props.slide_urls[0]}
                            target={"_blank"}
                            rel="noreferrer"
                            aria-label={`${props.company_name}のスライド`}
                        >
                            <FaSpeakerDeck color={"#006159"} /> Speakerdeck
                        </a>
                    )}
                    {props.type === "slideshare" && (
                        <a
                            className={"CompanySlides"}
                            href={props.slide_urls[0]}
                            target={"_blank"}
                            rel="noreferrer"
                            aria-label={`${props.company_name}のスライド`}
                        >
                            <FaSlideshare color={"#006159"} /> SlideShare
                        </a>
                    )}
                    {props.type === "other" && (
                        <a
                            className={"CompanySlides"}
                            href={props.slide_urls[0]}
                            target={"_blank"}
                            rel="noreferrer"
                            aria-label={`${props.company_name}のスライド`}
                        >
                            Slide
                        </a>
                    )}
                </h2>
            </div>
        </>
    );
};
type SlideProps = (typeof company)[0] & { currentPage: number };
const SpeakerDeckSlide = (props: SlideProps & { slideUrl: string; onLoad: () => void; onError: () => void }) => {
    return (
        <a
            title={props.company_name}
            href={props.slideUrl}
            target={"_blank"}
            rel="noreferrer"
            aria-label={`${props.company_name}のスライドの${props.currentPage}ページ目`}
        >
            <img
                width={props.image_width}
                height={props.image_height}
                alt={""}
                src={`https://files.speakerdeck.com/presentations/${props.id}/slide_${props.currentPage}.jpg`}
                onLoad={props.onLoad}
                onError={props.onError}
                loading={"lazy"}
            />
        </a>
    );
};
// TODO: not implement
const SlideShareSlide = (props: SlideProps & { slideUrl: string; onLoad: () => void; onError: () => void }) => {
    return (
        <a
            title={props.company_name}
            href={props.slideUrl}
            target={"_blank"}
            rel="noreferrer"
            aria-label={`${props.company_name}のスライドの${props.currentPage}ページ目`}
        >
            <img
                width={"560"}
                height={"315"}
                alt={""}
                src={`/not-found-image.jpeg`}
                loading={"lazy"}
                onLoad={props.onLoad}
                onError={props.onError}
            />
        </a>
    );
};

const Slide = (props: SlideProps) => {
    const [loadErrorPages, setLoadErrorPages] = useState<number[]>([]);
    const onLoad = useCallback(() => {}, []);
    const onErrorPage = useCallback(() => {
        setLoadErrorPages((prevState) => prevState.concat(props.currentPage));
    }, [props.currentPage]);
    const shouldShowLastPage = useMemo(() => {
        return loadErrorPages.includes(props.currentPage);
    }, [loadErrorPages, props.currentPage]);
    const slideUrl = useMemo(() => {
        if (props.currentPage === 0) {
            return props.slide_urls[0];
        }
        if (props.type === "speakerdeck") {
            return `${props.slide_urls[0]}?slide=${props.currentPage + 1}`; // 1-index
        } else {
            return props.slide_urls[0];
        }
    }, [props.currentPage, props.type, props.slide_urls]);
    const Slide = useMemo(() => {
        if (props.type === "speakerdeck") {
            return <SpeakerDeckSlide {...props} slideUrl={slideUrl} onLoad={onLoad} onError={onErrorPage} />;
        } else {
            return <SlideShareSlide {...props} slideUrl={slideUrl} onLoad={onLoad} onError={onErrorPage} />;
        }
    }, [props, slideUrl, onLoad, onErrorPage]);
    return (
        <InView rootMargin={"600px"}>
            {({ inView, ref }) => {
                return (
                    <div
                        ref={ref}
                        style={{
                            display: "inline-block",
                            border: "0px none",
                            background: "rgba(0, 0, 0, 0.1) none repeat scroll 0% 0% padding-box; margin: 0px",
                            padding: 0,
                            borderRadius: "6px",
                            boxShadow: "rgba(0, 0, 0, 0.2) 0px 5px 40px",
                            margin: "4px",
                            visibility: inView ? "visible" : "hidden"
                        }}
                    >
                        {shouldShowLastPage ? <Company {...props} /> : Slide}
                    </div>
                );
            }}
        </InView>
    );
};
type ToggleProps = {
    left: { label: string; value: string };
    right: { label: string; value: string };
    value: string;
    onChange: (value: string) => void;
};
const Toggle = (props: ToggleProps) => {
    const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        props.onChange(event.target.value);
    };
    return (
        <>
            <style jsx>{`
                .switch-field {
                    font-family: sans-serif;
                    overflow: hidden;
                }

                .switch-title {
                    font-weight: bold;
                    margin-bottom: 6px;
                }

                .switch-field input {
                    position: absolute !important;
                    clip: rect(0, 0, 0, 0);
                    height: 1px;
                    width: 1px;
                    border: 0;
                    overflow: hidden;
                }

                .switch-field label {
                    display: inline-block;
                    width: 100px;
                    background-color: #e4e4e4;
                    color: rgba(0, 0, 0, 0.6);
                    font-size: 14px;
                    font-weight: normal;
                    text-align: center;
                    text-shadow: none;
                    padding: 6px 14px;
                    border: 1px solid rgba(0, 0, 0, 0.2);
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px rgba(255, 255, 255, 0.1);
                    transition: all 0.1s ease-in-out;
                }

                .switch-field label:hover {
                    cursor: pointer;
                }

                .switch-field input:checked + label {
                    background-color: #1955a5;
                    color: #fff;
                    box-shadow: none;
                }

                .switch-field label:first-of-type {
                    border-radius: 4px 0 0 4px;
                }

                .switch-field label:last-of-type {
                    border-radius: 0 4px 4px 0;
                }
            `}</style>
            <form className="switch-field">
                <input
                    type="radio"
                    id="switch_left"
                    name="switchToggle"
                    value={props.left.value}
                    onChange={onChange}
                    checked={props.left.value === props.value}
                />
                <label htmlFor="switch_left">{props.left.label}</label>
                <input
                    type="radio"
                    id="switch_right"
                    name="switchToggle"
                    value={props.right.value}
                    onChange={onChange}
                    checked={props.right.value === props.value}
                />
                <label htmlFor="switch_right">{props.right.label}</label>
            </form>
        </>
    );
};

function HomePage() {
    const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
    const [currentPage, setCurrentPage] = useState(0);
    const [mode, setMode] = useState<"list" | "grid">("list");
    useEffect(() => {
        if (isMobile) {
            setMode("grid");
        }
    }, [isMobile]);
    const onClickNext = useCallback(() => {
        setCurrentPage((prevState) => prevState + 1);
    }, []);
    const onClickPrev = useCallback(() => {
        setCurrentPage((prevState) => (prevState > 0 ? prevState - 1 : 0));
    }, []);
    useEffect(() => {
        const listener = function (event: KeyboardEvent) {
            if (event.key === "ArrowRight") {
                event.preventDefault();
                setCurrentPage((prevState) => prevState + 1);
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                setCurrentPage((prevState) => (prevState > 0 ? prevState - 1 : 0));
            }
        };
        document.addEventListener("keydown", listener);
        return () => {
            document.removeEventListener("keydown", listener);
        };
    }, []);
    const onChangeMode = useCallback((value: string) => {
        setMode(value as "list" | "grid");
    }, []);
    return (
        <div>
            <Head>
                <meta charSet="utf-8" />
                <title>日本の会社紹介スライドのまとめ</title>
                <link
                    rel="icon"
                    href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏢</text></svg>"
                />
                <meta name="description" content="日本の会社による会社紹介スライドをまとめたサイトです" />
                <meta property="og:title" content="日本の会社紹介スライドのまとめ" key="title" />
                <meta property="og:description" content="日本の会社による会社紹介スライドをまとめたサイトです" />
                <meta property="og:image" content={"/ogp.jpeg"} />
            </Head>
            <style jsx>{`
                .Grid {
                    display: grid;
                    grid-gap: 10px;
                    padding: 10px;
                    margin: 1em 0 2em;
                    overflow: hidden;
                    justify-items: center;
                }

                /* Mobile */
                @media screen and (max-width: 599px) {
                    .Grid--Grid {
                        grid-template-columns: repeat(auto-fill, 1fr);
                    }

                    .FooterInformationSpreadSheet,
                    .FooterModeChanger {
                        display: none !important;
                    }
                }

                /* PC */
                @media screen and (min-width: 600px) {
                    .Grid--Grid {
                        grid-template-columns: repeat(auto-fill, minmax(560px, 1fr));
                    }
                }

                .Grid--List {
                    grid-template-columns: 1fr;
                }

                .Grid--List .GridItem {
                    display: grid;
                    grid-gap: 10px;
                    padding: 10px;
                    margin: 1em 0 2em;
                    overflow: hidden;
                    justify-items: center;
                    align-items: center;
                    grid-template-columns: 1fr 1fr;
                }

                .GridItem {
                    padding: 10px;
                }

                .Footer {
                    position: fixed;
                    bottom: 0;
                    width: 98%;
                    margin: auto;
                    font-size: 16px;
                    padding: 0 8px;
                    color: #fff;
                    background-color: rgba(0, 0, 0, 0.15);
                }

                .Footer {
                    display: flex;
                    justify-content: flex-end;
                    align-content: center;
                    align-items: center;
                }

                .FooterController,
                .FooterModeChanger,
                .FooterInformation {
                    display: inline-flex;
                    align-content: center;
                    align-items: center;
                }

                .FooterInformation {
                    margin-left: auto;
                }

                .FooterControllerButton {
                    appearance: none;
                    border: 0;
                    border-radius: 8px;
                    background: transparent;
                    padding: 8px 16px;
                    font-size: 16px;
                    cursor: pointer;
                }

                .LinkWithIcon {
                    display: inline-flex;
                    align-content: center;
                    align-items: center;
                    padding-right: 8px;
                    font-size: 24px;
                }
            `}</style>
            <div className={`Grid ${mode === "list" ? "Grid--List" : "Grid--Grid"}`}>
                {company.map((slide) => {
                    if (mode === "list") {
                        return (
                            <div className={"GridItem"} key={slide.rowIndex}>
                                <Slide {...slide} currentPage={currentPage} />
                                <Company {...slide} />
                            </div>
                        );
                    }
                    return (
                        <div key={slide.rowIndex} className={"GridItem"}>
                            <Slide {...slide} currentPage={currentPage} />
                        </div>
                    );
                })}
            </div>
            <footer className={"Footer"}>
                <div className={"FooterController"}>
                    <button
                        className={"FooterControllerButton"}
                        onClick={onClickPrev}
                        aria-label={`スライドを前のページに変更`}
                    >
                        <AiFillCaretLeft color={"#fff"} />
                    </button>
                    <span>{currentPage}</span>
                    <button
                        className={"FooterControllerButton"}
                        onClick={onClickNext}
                        aria-label={`スライドを次のページに変更`}
                    >
                        <AiFillCaretRight color={"#fff"} />
                    </button>
                </div>
                <div className={"FooterModeChanger"}>
                    <Toggle
                        left={{ label: "List", value: "list" }}
                        right={{ label: "Grid", value: "grid" }}
                        value={mode}
                        onChange={onChangeMode}
                    />
                </div>
                <div className={"FooterInformation"}>
                    <a
                        href={
                            "https://docs.google.com/spreadsheets/d/1y1pqQhBIV_uGCp-AzxSQwLDOV4v_tIPobnQJmFMJVDc/edit"
                        }
                        title={"データを管理しているSpreaSheet"}
                        target={"_blank"}
                        rel="noreferrer"
                        className="LinkWithIcon FooterInformationSpreadSheet"
                    >
                        <BsFillFileEarmarkSpreadsheetFill size={"24px"} color={"#188038"} />
                    </a>
                    <a
                        href={"https://github.com/azu/company-introduction-jp"}
                        target={"_blank"}
                        title={"このウェブサイトのソースコード"}
                        rel="noreferrer"
                        className={"LinkWithIcon FooterInformationGitHub"}
                    >
                        <AiFillGithub color={"black"} size={"24px"} />
                    </a>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;
