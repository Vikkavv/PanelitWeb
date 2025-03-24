import { useEffect, useState } from "react";
import PanelitLogoSvg from "./panelItLogoSvgComponent"
import LogoContainer from "./LogoContainerComponent";

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
    const [links, setLinks] = useState([]);
    useEffect(() => {
        setLinks(createLinksObjects(names, paths));
        if(hiddnBool) document.getElementById("logContainer").classList += " hidden";
    }, []);

    return (
        <nav className="navbar">
            <LogoContainer hasLogoSeparator="true" isRotatable="true"/>
            <div className="navlinks">
                <div className="navlinks margin-rigth-3ch">
                    {links}
                </div>
                <div></div>
                <div className="logoContainer" id="logContainer">
                    <a href="/signIn" className="navlink">Log in</a>
                    <span className="logoSeparator"/>
                    <a href="/signUp" className="navlink">Sign up</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
