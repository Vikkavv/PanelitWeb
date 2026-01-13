import React, { useEffect, useRef, useState } from "react";
import LogoContainer from "./LogoContainerComponent";
import UserProfileBtnComponent, { signOut } from "./UserProfileBtnComponent";
import { ABSOLUTE_IMAGES_URL } from "../App";
import { useNavigate } from "react-router";

function createLinksObjects(names, paths, blockButtonsForLoading, hasSignBtns){
    let linkarray = [];
    for (const i in names) {
        linkarray.push({"id": i, "name": names[i],"path": paths[i] });
    }
    return linkarray.map((link, i) => {
        return(
            (!isMobileDevice() ? 
                <a key={link.id} onClick={(e) => {if(blockButtonsForLoading) e.preventDefault()}} href={link.path} className={(isMobileDevice() ? ((blockButtonsForLoading ? "w95" : "w100") + " text-noWrap text-ellipsis overFlowHidden cursor-none ") : "") + "navlink" + (blockButtonsForLoading ? " cursor-wait loadingNavBarLink text-gray text-hover-gray" : " ")}>{link.name}</a> 
                : 
                <React.Fragment key={link.id}>
                    <a onClick={(e) => {if(blockButtonsForLoading) e.preventDefault()}} href={link.path} className={(isMobileDevice() ? ((blockButtonsForLoading ? "w95" : "w100") + " text-noWrap text-ellipsis overFlowHidden cursor-none ") : "") + "navlink" + (blockButtonsForLoading ? " cursor-wait loadingNavBarLink text-gray text-hover-gray" : " ")}>{link.name}</a>
                    { // If is the last link in the list, the separator is omitted.
                    (!(linkarray[i] === linkarray.at(-1) && hasSignBtns == false)) && <span className="logoSeparator w90 h1px margin-0-auto"/>}
                </React.Fragment>
            )
        )
    })
}

function Navbar(props) {
    const onlyMobileMenu = props.onlyMobileMenu === undefined ? false : (props.onlyMobileMenu === "true" ? true : false);
    let names;
    let paths;
    if(!onlyMobileMenu){
        names = props.texts.split(", ");
        paths = props.paths.split(", ");
    }
    const hiddnBool = props.hiddnLog === "true" ? true : false;
    const hasSignBtns = props.hasSignBtns === "false" ? false : true;
    const hasUserInfo = props.hasUserInfo === "true" ? true : false;
    const userInfo = props.userInfo !== undefined ? props.userInfo : {};
    const hasUserBtns = props.hasUserBtns !== "true" ? true : false ;
    const isSticky = props.isSticky !== "true" ? false : true;
    const blockButtonsForLoading = props.blockButtonsForLoading === undefined ? false : props.blockButtonsForLoading === "true" ? false : true;
    const setSideLoadingIcon = props.setSideLoadingIcon;
    const isLoadinIconActive = props.isLoadinIconActive === undefined ? false : (props.isLoadinIconActive === "true" ? false : true); //If the component is hidden, then its not active and "isLoadinIconActive", would be false otherwise, is true.
    const hasMobileBottomMenu = props.hasMobileBottomMenu === undefined ? false : (props.hasMobileBottomMenu === "true" ? true : false);
    const hasLogoSeparator = props.hasLogoSeparator === "false" ? "false" : "true";
    const settingsInsteadOfLinks = props.settingsInsteadOfLinks === undefined ? false : (props.settingsInsteadOfLinks === "true" ? true : false);
    const exceededNumMaxOfPanelsFunction = props.exceededNumMaxOfPanelsFunction;
    let profilePicture = props.userInfo?.profilePicture !== undefined && props.userInfo.profilePicture !== null && props.userInfo.profilePicture !== "" ? props.userInfo.profilePicture : ABSOLUTE_IMAGES_URL + "/svgs/defaultProfileImage.svg";

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };
    
    const closeSession = async () => {
        const data = await signOut();
        if(data === ""){
            redirect("/");
        }
    };
    
    const [links, setLinks] = useState([]);
    const [settings, setSettings] = useState([]);
    const [isMobile, setIsMobile] = useState(true);

    const mobileMenuRef = useRef();

    useEffect(() => {
        setIsMobile(isMobileDevice());
    }, [])

    useEffect(() => {
        setLinks(createLinksObjects(names, paths, blockButtonsForLoading, hasSignBtns));
        setSettings(createSettingsObjects);
        if(hiddnBool) document.getElementById("logContainer").classList += " hidden";
    }, [blockButtonsForLoading]); // This is used to reload all the sentences at the begining and every time that "blockButtonsForLoading" changes

    function showHiddeMobileMenu(){
        let element = mobileMenuRef.current;
        if(element.classList.contains("display-none")){
            element.classList.remove("display-none");
            setSideLoadingIcon?.("true");
        }
        else {
            element.classList.add("display-none");
            setSideLoadingIcon?.("false");
        }
    }

    return (
        (isMobile === false ? 
            <nav className="navbar">
                <LogoContainer hasLogoSeparator={hasLogoSeparator} isRotatable="true"/>
                <div className="navlinks">
                    <div className="navlinks margin-rigth-3ch">
                        {links}
                    </div>
                    <div></div>
                    {createSignBtns()}
                    {hasUserInfo && putUserInfo()}
                </div>
            </nav>
            : 
            <>
                { !onlyMobileMenu &&
                <nav className={(isSticky ? "positionSticky w100 top-0 z-index-1" : "positionRelative z-index-1") + " navbar padding-0 flex justify-space-bwt align-items-center"}>
                    <LogoContainer hasTitle="true" hasPadding="true" paddingClass="padding-left-05 padding-top-02"/>
                    <img onClick={showHiddeMobileMenu} className="iconSize padding-right-1" src={settingsInsteadOfLinks ? "svgs/SettingsIcon.svg" : "svgs/MenuMobileBtn.svg"} alt="" />
                    <div ref={mobileMenuRef} className={(isLoadinIconActive ? "w35" : "w-fitContent") + " h-fitContent windowNoPadding bgWindowDarkened border-radius-0-0-0-h border-none flex flex-direction-column positionAbsolute top-0 right-0 padding-right-05 padding-left-05 display-none"}>
                        <div className="flex justify-content-end align-items-center gap1 Jh[3.5rem]">
                            <div onClick={showHiddeMobileMenu} className="PlusBtn btnBorder cursor-none whitePlus diagonal medium-size margin-auto-0 aFocus-border-radius-50"></div>
                        </div>
                        {!settingsInsteadOfLinks ? links : settings}
                        {createSignBtns()}
                    </div>
                </nav>}
                { (hasMobileBottomMenu || onlyMobileMenu) &&
                    <nav className=" flex justify-space-bwt align-items-center bgWindow w100 boxSize-Border padding-left-1 padding-right-1 padding-top-05 padding-bottom-05 btm-0 z-index-1 positionFixed">
                        <a className="text-decoration-none mobileIconSize h-fitContent cursor-none btnOnlyHover border-radius-50 padding-top-02 padding-bottom-04 padding-03" href="/workspace">
                            <img className="mobileIconSize display-block" src="svgs/WorkspaceIcon.svg" alt="" />
                        </a>
                        <a className="text-decoration-none mobileIconSize h-fitContent cursor-none btnOnlyHover border-radius-50 padding-03" href="/Explore">
                            <img className="mobileIconSize display-block" src="svgs/ExploreIcon.svg" alt="Explore icon" />
                        </a>
                        <a onClick={(e) => exceededNumMaxOfPanelsFunction(e)} className="text-decoration-none PlusBtn smallPlusBtn btnGradientBluePurple whitePlus inverted cursor-none shadowBtnBorder" href="/CreatePanel"></a>
                        <a className="text-decoration-none mobileIconSize h-fitContent cursor-none btnOnlyHover border-radius-50 padding-03" href="/UpdatePlan">
                            <img className="mobileIconSize aspect-ratio-1 display-block" src="svgs/ChangePlanIcon.svg" alt="Change plan icon" />
                        </a>
                        <a className="text-decoration-none mobileIconSize h-fitContent cursor-none btnOnlyHover border-radius-50 padding-03" href={"/UserProfile/" + userInfo.nickname}>
                            <img className="mobileIconSize border-radius-50 aspect-ratio-1 object-fit-cover display-block" src={profilePicture} alt="User profile image" />
                        </a>
                        <div id="panelExceededError" className="w100 flex justify-content-center positionAbsolute left-0 btm-110Per hidden">
                            <div className="window bgPopUp flex align-items-center">
                                <span className="text-red textNano">You can not create more panels due to your current plan.</span>
                            </div>
                        </div>
                    </nav>
                }
            </>
        )
        
    )

    function createSettingsObjects() {
        return (
            <>
                <a href={`/EditUserProfile`} className="flex gap05 navlink justify-content-center cursor-none padding-top-0 padding-bottom-0-important">
                    <img className="iconSize" src="svgs/editPencilIcon.svg" alt="" />
                    <p className="navlink userSelectNone margin-0">Edit profile</p>
                </a>
                <span className="logoSeparator w90 h1px margin-0-auto"/>
                <div onClick={closeSession} className="flex gap05 navlink justify-content-center cursor-none padding-top-0 padding-bottom-0-important">
                    <img className="iconSize" src="svgs/SignOutIcon.svg" alt="" />
                    <p className="navlink userSelectNone margin-0">Sign out</p>
                </div>
            </>
        )
    }

    function createSignBtns(){
        if(hasSignBtns) return (
            (!isMobile ? 
                <div className="logoContainer" id="logContainer">
                    <a href="/signIn" onClick={(e) => {if(blockButtonsForLoading) e.preventDefault()}} className={"navlink" + (blockButtonsForLoading ? " cursor-wait loadingNavBarLink text-gray text-hover-gray " : "")}>Log in</a>
                    <span className="logoSeparator"/>
                    <a href="/signUp" onClick={(e) => {if(blockButtonsForLoading) e.preventDefault()}} className={"navlink" + (blockButtonsForLoading ? " cursor-wait loadingNavBarLink text-gray text-hover-gray " : "")}>Sign up</a>
                </div>
                :
                <>
                    <a href="/signIn" onClick={(e) => {if(blockButtonsForLoading) e.preventDefault()}} className={"navlink text-noWrap text-ellipsis overFlowHidden cursor-none" + (blockButtonsForLoading ? " loadingNavBarLink text-gray text-hover-gray w95" : " w100")}>Log in</a>
                    <span className="logoSeparator w90 h1px margin-0-auto"/>
                    <a href="/signUp" onClick={(e) => {if(blockButtonsForLoading) e.preventDefault()}} className={"navlink text-noWrap text-ellipsis overFlowHidden cursor-none" + (blockButtonsForLoading ? " loadingNavBarLink text-gray text-hover-gray w95" : " w100")}>Sign up</a>
                </>
            )
        )
    }

    function putUserInfo(){
        if(!hasUserBtns){
            return (
                <div className="logoContainer gap1 z-index-1 positionRelative" id="logContainer">
                    <span className="logoSeparator margin-auto-0 margin-right05"/>
                    <UserProfileBtnComponent userInfo={userInfo}/>
                </div>
            )
        }else{
            return (
                <div className="logoContainer" id="logContainer">
                    <span className="logoSeparator margin-auto-0 margin-right05"/>
                    {false && // Se impide forzosamente la aparición de los botones de manera temporal
                        <>
                            <img className="isconSize" src="svgs/NotificationIcon.svg" alt="" />
                            <img className="iconSize" src="svgs/MessagesIcon.svg" alt="" />
                        </>
                    }
                    <UserProfileBtnComponent userInfo={userInfo}/>
                </div>
            )
        }
    }
}

export function isMobileDevice() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android|bb\d+|meego.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent)) {
        return true;
    }
    if (/iPad|iPod/.test(userAgent) && !window.MSStream) {
        return true;
    }
    if (/Mobi/i.test(userAgent)) {
        return true;
    }
    return false;
}

export function isMobileDeviceAndIsInPortrait(){
    return isMobileDevice() && (window.innerWidth > window.innerHeight);
}

export default Navbar
