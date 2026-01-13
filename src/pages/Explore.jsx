import { useEffect, useRef, useState } from "react"
import LogoContainer from "../components/LogoContainerComponent"
import UserProfileBtnComponent from "../components/UserProfileBtnComponent"
import { cookieSessionChecker } from "../assets/js/SessionChecker";
import PanelCardComponent, { getUserById } from "../components/PanelCardComponent";
import { ABSOLUTE_IMAGES_URL, BACKEND_PATH } from "../App";
import LoadingComponent from "../components/LoadingComponent";
import Navbar, { isMobileDevice, isMobileDeviceAndIsInPortrait } from "../components/NavbarComponent";

let userData = {}; 
let counter = 0;

function Explore() {

    const [HTMLPanels, setHTMLPanels] = useState([]);
    const [HTMLUsers, setHTMLUsers] = useState([]);
    const [currentOption, setCurrentOption] = useState(0);
    const [loadingIconIsHidden, setLoadingIconIsHidden] = useState("false");

    screen.orientation.addEventListener("change", () => {
        if(isMobileDevice()){
            setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
        }
    });

    const [isMobileInPortrait, setIsMobileInPortrait] = useState(null);
    const [isMobile, setIsMobile] = useState(null);
    window.addEventListener("resize", () => {
        if(!isMobileDevice()) setIsMobile(isMobileDevice());
        if(!isMobileDeviceAndIsInPortrait()) setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
    });

    const refs = useRef([]);

    useEffect(() => {
        const checkSession = async () => {
            const data = await cookieSessionChecker();
            if(data !== null){
                userData = data
            }
        };
        checkSession();
        document.title = "Explore! | Panelit"
        createPanelCards();
        setIsMobile(isMobileDevice());
        setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
        if(isMobileDevice()){
            document.getElementById("root").classList.add("overFlowXHidden");
        }
    }, []);

    useEffect(() => {
        setHTMLPanels([]);
        search();
    }, [currentOption])

    return (
        <>
            <div id="noBg" className="explore body-OverFlowXHidden">
                { JSON.stringify(userData) !== "{}" ?
                    <>
                        {isMobile && <Navbar hasUserInfo="true" userInfo={userData} onlyMobileMenu="true"/>}
                        <div className="flex justify-space-bwt">
                            {!isMobile ? 
                                <LogoContainer isLink="true" hasPadding="true" paddingClass="padding-08-2-08-2" isRotatable="true" classes="positionRelative z-index-1"/>
                            : 
                                <LogoContainer isLink="true" hasPadding="true" paddingClass="padding-left-05 padding-top-02" classes="cursor-none margin-bottom-1 positionRelative z-index-1" isRotatable="true"/>
                            }
                            <div className={(isMobile ? "padding-right-1 padding-top-05" : "padding-08-2-08-2") + " flex w-fitContnent aspect-ratio-1"}>
                                <UserProfileBtnComponent userInfo={userData} onlyImage={""+isMobile}/>
                            </div>
                        </div>
                    </>
                    :
                        (!isMobile ? 
                            <LogoContainer isLink="true" hasPadding="true" paddingClass="padding-08-2-08-2" isRotatable="true" classes="positionRelative z-index-1"/>
                          : 
                            <LogoContainer isLink="true" hasPadding="true" paddingClass="padding-left-05 padding-top-02" classes="cursor-none margin-bottom-1s positionRelative z-index-1" isRotatable="true"/>
                        )
                }
                <div className="overFlowYHidden container10">
                    <div className={(isMobile ? (isMobileInPortrait ? "gap1 margin-bottom-1" : "flex-direction-column gap05") : "gap1") + " flex"}>
                        <form onSubmit={(e) => search(e)} className={(isMobile ? (isMobileInPortrait ? "align-items-center" : "align-items-end") : "") + " flex"}>
                            <input ref={(el) => {refs.current['searchInput'] = el}} type="text" className={(isMobile ? (isMobileInPortrait ? "" : "margin-top-1") : "margin-bottom-1 margin-top-1") + " display-block window text-white margin-0-1 margin-left-0 margin-left-1px"} placeholder={"Search a "+ (currentOption === 0 ? 'panel' : 'user')} autoComplete="on"/> 
                            <button onClick={() => setLoadingIconIsHidden("false")} type="submit" className={(isMobile ? "cursor-none" : "margin-auto-0") + " SearchBtn whiteIcon btnGradientBluePurple flex justify-content-center aling-items-center border-raduis-50 aspect-ratio-1"}>
                                <img className="iconSize" src="svgs/SearchIcon.svg" alt="" />
                            </button>
                        </form>
                        <div className={(isMobile ? (isMobileInPortrait ? "" : "margin-bottom-1") : "") + " flex w-fitContent align-items-center window toggleBtn margin-auto-0 boxSize-Border"}>
                            <div onClick={(e) => toggle(e)} className={(isMobile ? "cursor-none userSelectNone" : "cursor-pointer") + " flex align-items-center justify-content-center toggleOption positionRelative z-index-1"}>
                                <p className="margin-0 text-semiLight text-white">Panels</p>
                            </div>
                            <div onClick={(e) => toggle(e)} className={(isMobile ? "cursor-none userSelectNone" : "cursor-pointer") + " flex align-items-center justify-content-center toggleOption positionRelative z-index-1"}>
                                <p className="margin-0 text-semiLight text-white">Users</p>
                            </div>
                        </div>
                    </div>
                    <div className={ (loadingIconIsHidden === "false" ? "" : "display-none " ) + "flex justify-content-center align-items-center ha70vh h70vh w100"}>
                        <LoadingComponent hidden={loadingIconIsHidden} loadingIconSize="2.8rem" loadingSpinningIconSize=".5rem" onlyLoadingIcon="true"/>
                    </div>
                    {currentOption === 0 && loadingIconIsHidden !== "false" &&
                        <div className={(isMobile ? (isMobileInPortrait ? "col-2 margin-bottom-5" : "col-1 gap3 ha65vhcalc margin-bottom-5") : "col-5 padding-top-1 ha70vhcalc") + " grid overFlowYAuto darkscrollBar gap1"}>
                            {HTMLPanels}
                        </div>
                    }
                    {currentOption === 1 && loadingIconIsHidden !== "false" &&
                        <div className={(isMobile ? "margin-top-1 ha65vhcalc" : "container10 padding-top-1 ha70vhcalc") + " overFlowYAuto darkscrollBar "}>
                            {HTMLUsers}
                        </div>
                    }
                </div>
            </div>
        </>
    )

    function toggle(e){
        setLoadingIconIsHidden("false");
        let divToToggle = goBackUntilElementIsADiv(e.target);
        let divPosition = [...divToToggle.parentElement.children].findIndex((div) => div === divToToggle);
        let actualTogglePosition = parseFloat(getComputedStyle(divToToggle.parentElement).getPropertyValue('--markerPos').trim());
        let newTogglePosition = 100 * divPosition;
        setCurrentOption(divPosition);
        if(newTogglePosition !== actualTogglePosition){
            divToToggle.parentElement.style.setProperty("--markerPos", newTogglePosition+"%");
        }
    }

    function search(event){
        event?.preventDefault();
        if(currentOption === 0) createPanelCards(refs.current["searchInput"].value);
        if(currentOption === 1) createUserList(refs.current["searchInput"].value);
    }

    async function createPanelCards(searchText = null){
        setHTMLPanels([]);
        let localHTMLPanelCards = [];
        let panelList = searchText === null ? await get100Panels().finally(setTimeout(() => {setLoadingIconIsHidden("true")}, 1000)) : await getAllPanels().finally(setTimeout(() => {setLoadingIconIsHidden("true")}, 1000));
        for (const panel of panelList) {
            let userPanel = await getUserById(panel.creatorId);
            if(searchText === null || searchText.trim() === "" || (userPanel.nickname.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchText.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || panel.name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchText.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")))){
                localHTMLPanelCards.push(<PanelCardComponent key={counter++} creatorId={panel.creatorId} panelId={panel.id} panelTitle={panel.name} panelLastEditedDate={panel.lastEditedDate} panelCoverPhoto={panel.coverPhoto} />);
            }
        }
        if(localHTMLPanelCards.length < 1) 
            localHTMLPanelCards.push(<div key={counter++} className={(isMobile ? (isMobileInPortrait ? "h65vhcalc span-2" : "h65vhcalc") : "h70vh span-5") + " flex justify-content-center align-items-center w100"}><h1 className={(isMobile ? "textLittle" : "") + " text-white"}>No panels found</h1></div>);
        setHTMLPanels(localHTMLPanelCards);
    }

    async function createUserList(searchText = null) {
        setHTMLUsers([]);
        let localUserList = [];
        let userList = searchText === null ? await get100Users().finally(setTimeout(() => {setLoadingIconIsHidden("true")}, 1000)) : await searchUsers(searchText).finally(setTimeout(() => {setLoadingIconIsHidden("true")}, 1000));
        for (const user of userList) {
            localUserList.push(
                <div key={counter++} className="userList flex align-items-center justify-space-bwt padding-05 boxSize-Border">
                    <a href={"/UserProfile/" + user.nickname} className="flex gap1 text-decoration-none">
                        <img className="miniUserPicture display-block cursor-pointer object-fit-cover margin-auto-0" src={user.profilePicture !== null && user.profilePicture !== undefined && user.profilePicture !== "" ? user.profilePicture : ABSOLUTE_IMAGES_URL + `/svgs/defaultProfileImage.svg`} alt="" />
                        <p className="text-white textMini text-hover">{user.nickname}</p>
                    </a>
                </div>
            );
        }
        if(localUserList.length < 1) 
            localUserList.push(<div className={(isMobile ? "h65vhcalc" : "h70vh") + " flex justify-content-center align-items-center w100"}><h1 className={(isMobile ? "textLittle" : "") + " text-white"}>No users found</h1></div>);
        setHTMLUsers(localUserList);
    }

    async function searchUsers(nickname){
        let formData = new FormData();
        formData.append("nickname", nickname);
        const response = await fetch(BACKEND_PATH+"/User/findByContainingNickname",{
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if(Array.isArray(data)){
            return data;
        } 
    }
}

export async function getAllPanels() {
    const response = await fetch(BACKEND_PATH+"/Panel/findAll");
    const data = await response.json();
    if(Array.isArray(data)) return data;
}

export async function get100Users() {
    const response = await fetch(BACKEND_PATH+"/User/find100");
    const data = await response.json();
    if(Array.isArray(data)) return data;
}

export async function get100Panels() {
    const response = await fetch(BACKEND_PATH+"/Panel/find100");
    const data = await response.json();
    if(Array.isArray(data)) return data;
}

export function goBackUntilElementIsADiv(element){
    if(element instanceof HTMLDivElement) return element;
    let finalElement = element.parentElement;
    if(finalElement instanceof HTMLDivElement) return finalElement;
    else return goBackUntilElementIsADiv(finalElement);
}

export default Explore
