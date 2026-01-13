import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { showPopUp } from "./ModalComponent";
import { ABSOLUTE_IMAGES_URL, BACKEND_PATH } from "../App";
import { isMobileDevice } from "./NavbarComponent";

function PanelCardComponent(props) {
    let creatorId = props.creatorId === undefined ? console.error("creatorId has to be given") : props.creatorId;
    let panelId = props.panelId === undefined ? console.error("panelId has to be given") : props.panelId;
    let panelTitle = props.panelTitle === undefined ? console.error("panelTitle has to be given") : props.panelTitle;
    let panelLastEditedDate = props.panelLastEditedDate === undefined ? console.error("panelLastEdited date has to be given") : props.panelLastEditedDate;
    let panelCoverPhoto = props.panelCoverPhoto === undefined ? console.error("paneLCoverPhoto has to be given") : props.panelCoverPhoto;
    let blocked = props.blocked === undefined ? false : props.blocked; 

    if(panelLastEditedDate !== undefined){
        panelLastEditedDate = panelLastEditedDate.replaceAll("-","/");
    }

    const [userData, setUserData] = useState({
        "nickname": "",
        "profilePicture": null
    });

    const [panel, setPanel] = useState({});

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const getUserInfo = async () => {
            const data = await getUserById(creatorId);
            if(data !== null) setUserData(data);
        }
        if(creatorId !== undefined) getUserInfo();
        getPanel();
    }, []);

    useEffect(() => {
    },[JSON.stringify(userData)]);

    return (
        <div className="panelCard overFlowHidden positionRelative text-decoration-none text-white">
            <a href={panelId && `/Panel/`+panelId}>
                {panelCoverPhoto !== null ? <img className="coverPhoto" src={panelCoverPhoto} alt=""/> : <div className={(isMobileDevice() ? "cursor-none" : "") + " coverPhoto " + (JSON.stringify(panel) !== "{}" ? JSON.parse(panel.additionalInfo).background.cssBackground : "")}></div>}
            </a>
            <div onClick={() => {goToOwnerProfile(userData.nickname)}} className={(isMobileDevice() ? "cursor-none" : "") + " authorInfo flex gap05 positionAbsolute position-l0-t0 cursor-pointer text-hover padding-05 boxSize-Border"}>
                <img src={userData.profilePicture !== null && userData.profilePicture !== undefined && userData.profilePicture !== "" ? userData.profilePicture : ABSOLUTE_IMAGES_URL + `/svgs/defaultProfileImage.svg`} alt="Default profile image" className={( userData.profilePicture !== null ? `profilePicture` : ``) + ` cardProfilePicture  object-fit-cover boxSize-Border hoverWhiteBorder`} />
                <p className="margin-auto-0 display-block textNano padding-0 padding-left-05 text-noWrap text-ellipsis overFlowHidden" title={userData.nickname}>{userData.nickname}</p>
            </div>
            <a href={panelId && `/Panel/`+panelId} className={(isMobileDevice() ? "cursor-none" : "") + " panelInfo flex justify-space-bwt positionAbsolute btm-0 padding-05 boxSize-Border text-decoration-none"}>
                <p title={panelTitle} className="margin-0 text-white textMini text-noWrap text-ellipsis overFlowHidden padding-right-1">{panelTitle}</p>
                <p className="textNano text-gray margin-auto-0">{panelLastEditedDate}</p>
            </a>
            {blocked &&
                <div onClick={() => {showPopUp("viewModePanel"+panelId)}} title="This panel is blocked due to your current plan." className="flex justify-content-center align-items-center bgPopUp w100 h100 positionAbsolute top-0 cursor-pointer btnHover border1px border-radius-9 boxSize-Border">
                    <img src="/svgs/LockIcon.svg" className="iconSize"/>
                </div>
            }
        </div>
    )

    function goToOwnerProfile(userId){
        if(userId)
            redirect("/UserProfile/"+userId);
    }

    async function getPanel(){
        const response = await fetch(BACKEND_PATH+"/Panel/findById/"+panelId);
        const data = await response.json();
        setPanel(data);
    }
}

export async function getUserById(creatorId) {
    const response = await fetch(BACKEND_PATH+"/User/findById/"+creatorId);
    const data = await response.json();
    return data;
}

export default PanelCardComponent