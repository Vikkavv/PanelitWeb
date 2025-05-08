import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function PanelCardComponent(props) {
    let creatorId = props.creatorId === undefined ? console.error("creatorId has to be given") : props.creatorId;
    let panelId = props.panelId === undefined ? console.error("panelId has to be given") : props.panelId;
    let panelTitle = props.panelTitle === undefined ? console.error("panelTitle has to be given") : props.panelTitle;
    let panelLastEditedDate = props.panelLastEditedDate === undefined ? console.error("panelLastEdited date has to be given") : props.panelLastEditedDate;
    let panelCoverPhoto = props.panelCoverPhoto === undefined ? console.error("paneLCoverPhoto has to be given") : props.panelCoverPhoto;

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
            <a href={`/Panel/`+panelId}>
                {panelCoverPhoto !== null ? <img className="coverPhoto" src={panelCoverPhoto} alt=""/> : <div className={"coverPhoto " + (JSON.stringify(panel) !== "{}" ? JSON.parse(panel.additionalInfo).background.cssBackground : "")}></div>}
                
            </a>
            <div onClick={() => {goToOwnerProfile(userData.nickname)}} className="authorInfo flex gap05 positionAbsolute position-l0-t0 boxSize_Border cursor-pointer text-hover padding-05 boxSize-Border">
                <img src={userData.profilePicture !== null && userData.profilePicture !== undefined && userData.profilePicture !== "" ? userData.profilePicture : `svgs/defaultProfileImage.svg`} alt="Default profile image" className={( userData.profilePicture !== null ? `profilePicture` : ``) + ` cardProfilePicture  object-fit-cover boxSize-Border hoverWhiteBorder`} />
                <p className="margin-auto-0 display-block textNano padding-0 padding-left-05">{userData.nickname}</p>
            </div>
            <a href={`/Panel/`+panelId} className="panelInfo flex justify-space-bwt positionAbsolute btm-0 padding-05 boxSize-Border text-decoration-none">
                <p className="margin-0 text-white textMini">{panelTitle}</p>
                <p className="textNano text-gray margin-auto-0">{panelLastEditedDate}</p>
            </a>
        </div>
    )

    function goToOwnerProfile(userId){
        redirect("/UserProfile/"+userId);
    }

    async function getPanel(){
        const response = await fetch("http://localhost:8080/Panel/findById/"+panelId);
        const data = await response.json();
        setPanel(data);
    }
}

export async function getUserById(creatorId) {
    const response = await fetch("http://localhost:8080/User/findById/"+creatorId);
    const data = await response.json();
    return data;
}

export default PanelCardComponent