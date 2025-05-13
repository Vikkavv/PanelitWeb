import { useEffect, useState } from "react";
import LogoContainer from "./LogoContainerComponent";
import UserProfileBtnComponent from "./UserProfileBtnComponent";

function createLinksObjects(names, paths){
    let linkarray = [];
    for (const i in names) {
        linkarray.push({"id": i, "name": names[i],"path": paths[i] });
    }
    return linkarray.map((link) => {
        return(
            <a key={link.id} href={link.path} className="navlink">{link.name}</a>
        )
    })
}

function Navbar(props) {
    const names = props.texts.split(", ");
    const paths = props.paths.split(", ");
    const hiddnBool = props.hiddnLog === "true" ? true : false;
    const hasSignBtns = props.hasSignBtns === "false" ? false : true;
    const hasUserInfo = props.hasUserInfo === "true" ? true : false;
    const userInfo = props.userInfo !== undefined ? props.userInfo : {};
    const hasUserBtns = props.hasUserBtns !== "true" ? true : false ;
    let hasLogoSeparator = props.hasLogoSeparator === "false" ? "false" : "true";
    const [links, setLinks] = useState([]);
    useEffect(() => {
        setLinks(createLinksObjects(names, paths));
        if(hiddnBool) document.getElementById("logContainer").classList += " hidden";
    }, []);

    return (
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
    )

    function createSignBtns(){
        if(hasSignBtns) return (
            <div className="logoContainer" id="logContainer">
                <a href="/signIn" className="navlink">Log in</a>
                <span className="logoSeparator"/>
                <a href="/signUp" className="navlink">Sign up</a>
            </div>
        )
    }

    function putUserInfo(){
        if(!hasUserBtns){
            return (
                <div className="logoContainer z-index-1 positionRelative" id="logContainer">
                    <span className="logoSeparator margin-auto-0 margin-right05"/>
                    <UserProfileBtnComponent userInfo={userInfo}/>
                </div>
            )
        }else{
            return (
                <div className="logoContainer gap1" id="logContainer">
                    <span className="logoSeparator margin-auto-0 margin-right05"/>
                    <img className="iconSize" src="svgs/NotificationIcon.svg" alt="" />
                    <img className="iconSize" src="svgs/MessagesIcon.svg" alt="" />
                    <UserProfileBtnComponent userInfo={userInfo}/>
                </div>
            )
        }
    }
}

export default Navbar
