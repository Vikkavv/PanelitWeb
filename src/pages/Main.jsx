import { useEffect, useRef, useState } from "react"
import Navbar, { isMobileDevice, isSamsungExplorer } from "../components/NavbarComponent"
import {dynamicClasses} from '../assets/js/dynamicCssClasses.js'
import { useNavigate } from 'react-router';
import { cookieSessionChecker } from "../assets/js/SessionChecker.js";
import LoadingComponent from "../components/LoadingComponent.jsx";
import { textResizeDetector } from "../assets/js/textResizeDetector.js";

function Main() {

    screen.orientation.addEventListener("change", () => {
        if(isMobileDevice()){
            divHeightCalculatorForBackgrounds("panelItText");
        }
    });

    window.addEventListener("resize", () => {
        if(!isMobileDevice()) setIsMobile(isMobileDevice());
    });

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

    const [loadingBools, setLoadingBools] = useState([]);
    const [isMobile, setIsMobile] = useState(null);
    const [mobileLoadingIconSide, setMobileLoadingIconSide] = useState("false");

    useEffect(() => {
        let timeoutID = setTimeout(() => {
                showOrHideLoadingComponent("startLoading", "s");
        }, 500);
        const checkSession = async () => {
            const data = await cookieSessionChecker().finally(() => {showOrHideLoadingComponent("startLoading", "h"); clearTimeout(timeoutID)});
            if(data !== null){
                redirect("/workspace");
            }
        };
        checkSession();
        document.title = "Welcome! | Panelit"
        let html = document.getElementsByTagName("html")[0];
        document.body.removeAttribute("style");
        html.classList.remove("html100");
        setIsMobile(isMobileDevice());
        if(isMobileDevice()){
            document.getElementById("root").classList.add("overFlowXHidden");
            divHeightCalculatorForBackgrounds("panelItText");
        }
    }, []);

    useEffect(() => {
        if(isMobile !== null){
            dynamicClasses();
            textResizeDetector(() => {
                divHeightCalculatorForBackgrounds("panelItText");
            });
            if(isSamsungExplorer()) divHeightCalculatorForBackgrounds("panelItText");
        } 
    }, [isMobile])

    useEffect(() => {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (
                    mutation.type === "attributes" &&
                    mutation.attributeName === "lang"
                ) {
                    if(isMobileDevice()){
                        setTimeout(() => {
                            divHeightCalculatorForBackgrounds("panelItText");
                        }, 400)
                    }
                }
            }
        });
        
        observer.observe(document.documentElement, { attributes: true });

        return () => observer.disconnect();
    }, [])

    function showOrHideLoadingComponent(id, showOrHide){
        let stringBool = showOrHide === "h" ? "true" : "false";
        setLoadingBools(prev => ({
            ...prev,
            [id]: stringBool
        }));
    }

    function divHeightCalculatorForBackgrounds(id){
        let element = document.getElementById(id);
        let styles = window.getComputedStyle(element, null);

        let height = Number.parseInt(styles.height);
        let rem = 16;
        height = height + (6*rem) + "px";
        element.style.setProperty("--height", height);
    }

    return (
        <>
            <Navbar key={isMobile} texts="Subscription Plans, Explore" paths="/SubscriptionPlans, /Explore" blockButtonsForLoading={loadingBools['startLoading'] === undefined ? "false" : loadingBools['startLoading']} isSticky={""+isMobile} setSideLoadingIcon={setMobileLoadingIconSide} isLoadinIconActive={loadingBools['startLoading']}/>
            <LoadingComponent hidden={loadingBools['startLoading']} loadingMessage="Please wait, This only happens once and can take 1~2 minutes" isSticky={""+isMobile} floatLeft={mobileLoadingIconSide}/>
            <div className={(!isMobile ? "container body-OverFlowYHidden" : "container10") + " text-white"}>
                <h1 className={(!isMobile ? "header" : "mobileHeader text-wrap") + " margin-0-auto margin-top-2"}>Let’s bring order and share knowledge!</h1>
                <div className="margin-top-2">
                    <div className={(isMobile ? "margin-bottom-5" : "grid col2-1 gap1 margin-bottom-1") + " "}>
                        <div id="panelItText" className={(isMobile ? "containerSkew z-index-1Neg bgBlueS" : "order-2 window") + " padding-top-1-25"}>
                            <p className="cardText margin-0 text-light w-fitContent"><span className="cardTitle margin-0 text-light w-fitContent margin-right05 line-height-fitContent">Panelit</span> offers various panels with tools to share your <span className="text-bold">knowledge</span> and <span className="text-bold">creativity</span> with platform users.</p>
                            <p className="cardText margin-0 text-light w-fitContent">We're glad you're here!</p>
                        </div>
                        <div className={(isMobile ? "border-none bgTransparent positionRelative left-6vWNeg z-index-1Neg margin-top-1" : "order-1 overFlowHidden cardHeight") + " window padding-1-0-1-2"}>
                            <div className="flex justify-space-bwt positionRelative">
                                <div className="w100">
                                    <h3 className="cardTitle margin-0 text-light text-wrap w100">Columns</h3>
                                    <p className="cardText margin-0 text-light text wrap w100">Distribute your information or photos in <span className="text-bold"> easy-to-create</span> columns or upload documents as a new column.</p>
                                </div>
                                <img className={ (isMobile ? "Jpr[l:-5rem] z-index-1Neg brightness55 Jw[a285px]" : "Jpr[b:4rem,l:7px] w50") + " "} src="img/ColumnsLayout.png" alt="Columns Layout Example" />
                                <div className="Jw[3450px] cardGradient"></div>
                            </div>
                        </div>
                    </div>
                    <div className={(isMobile ? "margin-top-1" : "grid col1-2 gap1") + ""}>
                        <div className={(isMobile ? "border-none bgTransparent Jpr[l:0px] z-index-1Neg margin-bottom-2" : "overFlowHidden cardHeight") + " window padding-1-0-1-2"}>
                            <div className={(isMobile ? "flex-direction-reverse-rows" : "") + " flex justify-space-bwt"}>
                                <div className="w100">
                                    <h3 className="cardTitle margin-0 text-light text-wrap w100">Cards</h3>
                                    <p className={(isMobile ? "text-end text-wrap w100" : "") + " cardText margin-0 text-light"}>Create cards that you can put <span className="text-bold">anywhere.</span></p>
                                </div>
                                <img className= {(isMobile ? "Jpr[b:10px,l:3rem] z-index-1Neg brightness45 Jw[a285px]" : "Jpr[b:-30px] Jw[190px]") + " "} src="img/CardsLayout.png" alt="Cards Layout Example" />
                                <div className="cardText Jw[3250px] cardGradient greenGradient reverseCardGradient"></div>
                            </div>
                        </div>
                        <div className={(isMobile ? "border-none bgTransparent positionRelative left-6vWNeg z-index-1Neg" : "overFlowHidden") + " window cardHeight padding-1-0-1-2"}>
                            <div className={(isMobile ? "" : "") + " flex justify-space-bwt"}>
                                <div className={(isMobile ? "wia100Minus10vW" : "") + ""}>
                                    <h3 className={(isMobile ? "lenguajeSizeMobile text-wrap" : "lenguajeSize") + " cardTitle margin-0 text-light text-noWrap"}>Steps Cards</h3>
                                    <p className="cardText margin-0 text-light text-wrap">Add connected numbered cards that allow you to easily display some sequential <span className="text-bold">step-by-step</span> content.</p>
                                </div>
                                <img className={ (isMobile ? "Jpr[l:-7rem] z-index-1Neg brightness35 Jw[a285px]" : "Jpr[b:4rem,l:7px] w50") + " "} src="img/StepsLayout.png" alt="Steps Layout Example" />
                                <div className="Jw[4889px] cardGradient purpleGradient"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Main
