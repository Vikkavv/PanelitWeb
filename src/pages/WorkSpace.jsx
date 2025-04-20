import { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import { cookieSessionChecker } from "../assets/js/SessionChecker.js";
import {dynamicClasses} from '../assets/js/dynamicCssClasses.js';
import PanelCardComponent from "../components/PanelCardComponent.jsx";
import Navbar from "../components/NavbarComponent.jsx";

document.getElementsByTagName("html")[0].classList = "html100";

let userData = null;

function Worksapce() {

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

    const [htmlPanels, setHtmlPanels] = useState([]);
    const [panels, setPanels] = useState([]);
    const [reactiveUser, setReactiveUser] = useState({});

    useEffect(() => {
        if(JSON.stringify(reactiveUser).includes("nickname")) {
            const getPanels = async () => {
                const data = await getUserPanels();
                if(data !== null) setPanels(data);
            };
            getPanels();
        }
    }, [JSON.stringify(reactiveUser)]);

    useEffect(() => {
        createPanelCards();
    }, [JSON.stringify(panels)]);

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
            <Navbar texts="Change Plan, Explore, My panel subscriptions" paths="/UpdatePlan, /home" hasSignBtns="false" hasLogoSeparator="false" hasUserInfo="true" userInfo={reactiveUser}/>
            <div id="noBg" className="workspace container padding-top-1 body-OverflowHidden">
                {panels.length > 0 ? 
                <>
                    <div className="flex">
                        <input type="search" className="display-block window text-white margin-bottom-1 margin-top-1 margin-0-1" placeholder="&#xFE0F; Search a Panel" autoComplete="on"/> 
                        <div className="SearchBtn whiteIcon margin-auto-0 btnGradientBluePurple flex">
                            <img className="iconSize margin-auto" src="svgs/SearchIcon.svg" alt="" />
                        </div>
                    </div>
                    <div className="grid col-4 gap2 row-gap1 margin-top-2 overFlowYAuto darkscrollBar h70vh padding-0-1">
                        {htmlPanels}
                    </div>
                </>
                :
                    htmlPanels
                }
            </div>
        </>
    )

    function createPanelCards(){
        setHtmlPanels([]);
        let counter = 0;
        if(panels.length > 0){
            for (const panel of panels) {
                setHtmlPanels(prev => [...prev,
                    <PanelCardComponent key={counter++} creatorId={panel.creatorId} panelId={panel.id} panelTitle={panel.name} panelLastEditedDate={panel.lastEditedDate} panelCoverPhoto={panel.coverPhoto} />
                ]);
            }
        }
        else{
            setHtmlPanels([
                <div key={counter++} className="flex justify-content-center w100 h70vh margin-top-2 padding-top-1">
                    <div className="flex flex-direction-column">
                        <h1 className="panelMessageTitle text-white margin-top-2 padding-top-1 line-height-fitContent">You do not have any panels yet</h1>
                        <div id="createPanelBtn" className="PlusBtn margin-0-auto margin-top-2 btnGradientBluePurple whitePlus inverted"></div>
                        <p className="text-gray margin-0-auto margin-top-2">Let's do something wonderful</p>
                    </div>
                </div>
            ]);
        }
    }
}

export async function getUserPanels(opUserData = null) {
    let userInfo = opUserData !== null ? opUserData : userData ;
    const response = await fetch("http://localhost:8080/Panel/ofUser/"+userInfo.nickname);
    const data = await response.json();
    return data;
}

export default Worksapce