import { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router';
import { cookieSessionChecker } from "../assets/js/SessionChecker.js";
import {dynamicClasses} from '../assets/js/dynamicCssClasses.js';
import PanelCardComponent, { getUserById } from "../components/PanelCardComponent.jsx";
import Navbar from "../components/NavbarComponent.jsx";
import ModalComponent, { hiddePopUp } from "../components/ModalComponent.jsx";
import { BACKEND_PATH } from "../App.jsx";
import LoadingComponent from "../components/LoadingComponent.jsx";

document.getElementsByTagName("html")[0].classList = "html100";

export const UNLIMITED_PANELS = 999;

let userData = null;
let staticIsLoading = true;

function Worksapce() {

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

    const refs = useRef([]);
    const [htmlPanels, setHtmlPanels] = useState([]);
    const [panels, setPanels] = useState([]);
    const [reactiveUser, setReactiveUser] = useState({});
    const [panelVisitModals, setPanelVisitModals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
 
    useEffect(() => {
        if(JSON.stringify(reactiveUser).includes("nickname")) {            
            const getPanels = async () => {
                const data = await getUserPanels().finally(() => {setIsLoading(false); staticIsLoading = false});
                if(data !== null){
                    setPanels(data);
                } 
            };
            getPanels();
        }
    }, [JSON.stringify(reactiveUser)]);

    useEffect(() => {
        createPanelCards(null);
    }, [JSON.stringify(panels), isLoading]);

    useEffect(() => {
        const checkSession = async () => {
            const data = await cookieSessionChecker();
            if(data !== null){
                userData = data;
                setReactiveUser(data);
            } 
            else redirect("/signIn");
        };
        checkSession();
        document.title = "My Workspace | Panelit";
        dynamicClasses();
    },[])
    return (
        <>  
            <Navbar texts="Change Plan, Explore" paths="/UpdatePlan, /Explore" hasSignBtns="false" hasLogoSeparator="false" hasUserBtns="false" hasUserInfo="true" userInfo={reactiveUser}/>
            <div id="noBg" className="workspace container padding-top-1 body-OverflowHidden">
                {false && staticIsLoading && 
                    <div key={0} className="flex justify-content-center align-items-center w100 h70vh margin-top-2 padding-top-1">
                        <LoadingComponent hidden="false" loadingIconSize="2.8rem" loadingSpinningIconSize=".5rem" onlyLoadingIcon="true"/>
                    </div>
                }
                {panels.length > 0 ? 
                <>
                    <div className="flex justify-space-bwt">
                        <div className="flex">
                            <select onChange={() => createPanelCards(null)} ref={(el) => {refs.current["panelsFilter"] = el}} className="window padding-0 margin-1-0 margin-left-1 text-gray" defaultValue="0">   
                                <option value="0" className="bgWindow">All</option>
                                <option value="1" className="bgWindow">Owned</option>
                                <option value="2" className="bgWindow">Joined</option>
                            </select>
                            <form onSubmit={(e) => searchPanels(e)} className="flex">
                                <input ref={(el) => {refs.current["searchInput"] = el}} type="text" className="display-block window text-white margin-bottom-1 margin-top-1 margin-0-1" placeholder="Search a Panel" autoComplete="on"/> 
                                <button type="submit" className="SearchBtn whiteIcon margin-auto-0 btnGradientBluePurple flex">
                                    <img className="iconSize margin-auto" src="svgs/SearchIcon.svg" alt="" />
                                </button>
                            </form>
                        </div>
                        <div className="flex gap1 align-items-center positionRelative">
                            <p className="margin-0 text-white">Create panel</p>
                            <a onClick={(e) => exceededNumMaxOfPanels(e)} href="/CreatePanel" className="PlusBtn smallPlusBtn searchSizeBtn shadowBtnBorder margin-auto-0 btnGradientBluePurple whitePlus inverted"></a>
                            <span id="panelExceededError" className="hidden textNano btm-Neg-1-3 text-red positionAbsolute w120 z-index-0">You can not create more panels due to your current plan.</span>
                        </div>
                    </div>
                    <div className="grid col-4 gap2 row-gap1 margin-top-2 overFlowYAuto darkscrollBar ha70vh padding-0-1">
                        {htmlPanels}
                    </div>
                </>
                :
                    htmlPanels
                }
            </div>
            {panelVisitModals}
        </>
    )

    function exceededNumMaxOfPanels(e){
        e.preventDefault();
        if(panels.filter((panel) => panel.creatorId === userData.id).length < userData.plan.nMaxPanels || userData.plan.nMaxPanels === UNLIMITED_PANELS)
            redirect(e.target.href.substring(e.target.href.lastIndexOf("/"), e.target.href.length));
        else{
            let errSpan = document.getElementById("panelExceededError");
            errSpan.classList.remove("hidden");
            setTimeout(() => {
                errSpan.classList.add("hidden");
            }, 4000)
        }
    }

    function searchPanels(event){
        event.preventDefault();
        createPanelCards(refs.current["searchInput"].value);
    }

    async function createPanelCards(searchText = null){
        setHtmlPanels([]);
        setPanelVisitModals([]);
        let counter = 0;
        let optionValue = refs.current["panelsFilter"]?.selectedOptions[0].value;
        if(panels.length > 0){
            for (const panel of panels) {
                let userPanel = await getUserById(panel.creatorId);
                if((optionValue == 0) || (optionValue == 1 && panel.creatorId === userData.id) || (optionValue == 2 && panel.creatorId !== userData.id)){
                    if(searchText === null || searchText.trim() === "" || (userPanel.nickname.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchText.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || panel.name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchText.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")))){
                        setHtmlPanels(prev => [...prev,
                            <PanelCardComponent blocked={panel.isBlocked} key={counter++} creatorId={panel.creatorId} panelId={panel.id} panelTitle={panel.name} panelLastEditedDate={panel.lastEditedDate} panelCoverPhoto={panel.coverPhoto} />
                        ]);
                        if(panel.isBlocked){
                            setPanelVisitModals(prev => [...prev,
                                <ModalComponent key={counter++} id={"viewModePanel"+panel.id} isMini="true" content={
                                    <div>
                                        <h2 className="margin-0 text-white padding-bottom-05">This panel is blocked!!</h2>
                                        <p className="margin-0 textMini text-white">You have more panels than your plan permits, but you and all users can still visit it</p>
                                        <div className="flex justify-space-bwt margin-top-1">
                                            <div onClick={() => {hiddePopUp("viewModePanel"+panel.id)}} className="btn btn-large text-decoration-none h-fitContent margin-auto-0 userSelectNone"><p className="margin-0 text-white text-semiLight">Cancel</p></div>
                                            <a href={`/Panel/`+panel.id} className="btn btn-large btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone text-decoration-none"><p className="margin-0">Visit</p></a>
                                        </div>
                                    </div>
                                }/>
                            ]);
                        }
                    }
                }
            }
            if(optionValue == 1 && !panels.some(panel => panel.creatorId === userData.id)){
                setHtmlPanels([
                    <div key={counter++} className="flex justify-content-center w100 h70vh span-4">
                        <div className="flex flex-direction-column">
                            <h1 className="panelMessageTitle text-white margin-top-2 padding-top-1 line-height-fitContent">You have not created a panel yet</h1>
                            <div id="createPanelBtn" className="PlusBtn margin-0-auto margin-top-2 btnGradientBluePurple whitePlus inverted"></div>
                            <p className="text-gray margin-0-auto margin-top-2">Let's do something wonderful</p>
                        </div>
                    </div>
                ]);
            }
            if(optionValue == 2 && !panels.some(panel => panel.creatorId !== userData.id)){
                setHtmlPanels([
                    <div key={counter++} className="flex justify-content-center w100 h70vh span-4">
                        <div className="flex flex-direction-column">
                            <h1 className="panelMessageTitle text-white margin-top-2 padding-top-1 line-height-fitContent">You have not joined a panel yet</h1>
                        </div>
                    </div>
                ]);
            }
        }
        else{
            if(!staticIsLoading){
                setHtmlPanels([
                    <div key={counter++} className="flex justify-content-center w100 h70vh margin-top-2 padding-top-1">
                        <div className="flex flex-direction-column">
                            <h1 className="panelMessageTitle text-white margin-top-2 padding-top-1 line-height-fitContent">You do not have any panels yet</h1>
                            <a href="/CreatePanel" id="createPanelBtn" className="PlusBtn shadowBtnBorder margin-0-auto margin-top-2 btnGradientBluePurple whitePlus inverted"></a>
                            <p className="text-gray margin-0-auto margin-top-2">Let's do something wonderful</p>
                        </div>
                    </div>
                ]);
            }
            else{
                setHtmlPanels([
                    <div key={counter++} className="flex justify-content-center align-items-center w100 h70vh margin-top-2 padding-top-1">
                        <LoadingComponent hidden="false" loadingIconSize="2.8rem" loadingSpinningIconSize=".5rem" onlyLoadingIcon="true"/>
                    </div>
                ]);
            }
        }
    }
}

export async function getUserPanels(opUserData = null) {
    let userInfo = opUserData !== null ? opUserData : userData ;
    const response = await fetch(BACKEND_PATH + "/Panel/ofUser/"+userInfo.nickname);
    const data = await response.json();
    return data;
}

export default Worksapce