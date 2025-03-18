import { useEffect, useState } from "react";
import PanelitLogoSvg from "./panelItLogoSvgComponent"

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
            <div className="logoContainer">
                <div className="spinningLogo">
                    <PanelitLogoSvg color="#f0f0f0" />
                </div>
                <h2 className="logoHeader margin-0 text-white line-height200">Panelit</h2>
                <span className="logoSeparator"/>
            </div>
            <div className="navlinks">
                <div className="navlinks margin-rigth">
                    {links}
                </div>
                <div></div>
                <div className="logoContainer" id="logContainer">
                    <a href="" className="navlink">Log in</a>
                    <span className="logoSeparator"/>
                    <a href="" className="navlink">Sing up</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
