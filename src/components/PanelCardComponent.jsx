import { useEffect, useState } from "react";

function PanelCardComponent(props) {
    let ownerNickname = props.ownerNickname === undefined ? console.error("ownerNickname has to be given") : props.ownerNickname;
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

    useEffect(() => {
        const getUserInfo = async () => {
            const data = await getUserByNickname(ownerNickname);
            if(data !== null) setUserData(data);
        }
        if(ownerNickname !== undefined) getUserInfo();
    }, []);

    useEffect(() => {
    },[JSON.stringify(userData)]);

    return (
        <a href={`/Panel/`+panelId} className="panelCard overFlowHidden positionRelative text-decoration-none text-white">
            <img className="coverPhoto" src={panelCoverPhoto} alt="" />
            <div className="authorInfo flex gap05 positionAbsolute position-l0-t0 boxSize_Border">
            <img src={userData.profilePicture !== null && userData.profilePicture !== undefined && userData.profilePicture !== "" ? userData.profilePicture : `svgs/defaultProfileImage.svg`} alt="Default profile image" className={( userData.profilePicture !== null ? `profilePicture` : ``) + ` cardProfilePicture padding-05`} />
                <p className="margin-auto-0 textNano">{userData.nickname}</p>
            </div>
            <div className="panelInfo flex justify-space-bwt positionAbsolute btm-0 padding-05 boxSize-Border">
                <p className="margin-0 textMini">{panelTitle}</p>
                <p className="textNano text-gray margin-auto-0">{panelLastEditedDate}</p>
            </div>
        </a>
    )
}

async function getUserByNickname(ownerNickname) {
    const response = await fetch("http://localhost:8080/User/"+ownerNickname);
    const data = await response.json();
    return data;
}

export default PanelCardComponent
