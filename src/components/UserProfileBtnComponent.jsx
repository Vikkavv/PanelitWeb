import { useEffect, useRef } from "react";
import { dynamicClasses } from "../assets/js/dynamicCssClasses";
import { useNavigate } from "react-router";

function UserProfileBtnComponent(props) {
    let userInfo = props.userInfo;
    let profilePicture = props.userInfo.profilePicture !== undefined && props.userInfo.profilePicture !== null && props.userInfo.profilePicture !== "" ? props.userInfo.profilePicture : "svgs/defaultProfileImage.svg";

    const imgBtn = useRef();
    const divPopUp = useRef();
    const signOutBtn = useRef();

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

    useEffect(() => {
        imgBtn.current.addEventListener("click", showOrHideUserPopUp);

        const closeSession = async () => {
            const data = await signOut();
            if(data === ""){
                redirect("/");
            }
        };

        signOutBtn.current.addEventListener("click", closeSession);
        dynamicClasses();
    },[]);

    return (
        <>
            <img ref={imgBtn} className="miniUserPicture cursor-pointer margin-auto-0" src={profilePicture} alt="" />
            <div ref={divPopUp} className="userPopUp positionAbsolute top-0 border-radius-0 window h100vh boxSize-Border">
                <div className="flex flex-direction-column">
                    <div className="flex justify-space-bwt">
                        <div className="flex gap1">
                            <img className="miniUserPicture margin-auto-0" src={profilePicture} alt="" />
                            <p className="text-white">{userInfo.nickname}</p>
                        </div>
                        <div onClick={showOrHideUserPopUp} className="PlusBtn whitePlus transparentBtn diagonal medium-size margin-auto-0"></div>
                    </div>
                    <div className="flex gap1 padding-left-05 margin-top-05">
                        <p className="textMicro text-white margin-0">0 Followers</p>
                        <span className="text-white labelTitle margin-auto-0 line-height-fitContent">·</span>
                        <p className="textMicro text-white margin-0">0 Following</p>
                    </div>
                </div>
                <div className="userOptions flex flex-direction-column justify-space-bwt padding-top-1 padding-bottom-1">
                    <div className="flex flex-direction-column gap1 margin-0-auto">
                    <span className="popUpseparator" />
                        <a href="#" className="flex gap2 navlink margin-0 padding-0 w100">
                            <img className="iconSize" src="svgs/ViewProfileIcon.svg" alt="" />
                            <p className="margin-0 padding-0">View profile</p>
                        </a>
                        <a href={`/Profile/`+userInfo.id} className="flex gap2 navlink margin-0 padding-0 w100">
                            <img className="iconSize" src="svgs/editPencilIcon.svg" alt="" />
                            <p className="margin-0 padding-0">Edit profile</p>
                        </a>
                        <a href="#" className="flex gap2 navlink margin-0 padding-0 w100">
                            <img className="iconSize" src="svgs/ChangePlanIcon.svg" alt="" />
                            <p className="margin-0 padding-0">Change plan</p>
                        </a>
                        <span className="popUpseparator" />
                        <a href="#" className="flex gap2 navlink margin-0 padding-0 w100">
                            <img className="iconSize" src="svgs/NotificationIcon.svg" alt="" />
                            <p className="margin-0 padding-0">Notifications</p>
                        </a>
                        <a href="" className="flex gap2 navlink margin-0 padding-0 w100">
                            <img className="iconSize" src="svgs/MessagesIcon.svg" alt="" />
                            <p className="margin-0 padding-0">Messages</p>
                        </a>
                        <span className="popUpseparator"/>
                        <a href="" className="flex gap2 navlink margin-0 padding-0 w100">
                            <img className="iconSize" src="svgs/SubscribedPanelsIcon.svg" alt="" />
                            <p className="margin-0 padding-0">Subscribed panels</p>
                        </a>
                        <a href="" className="flex gap2 navlink margin-0 padding-0 w100">
                            <img className="iconSize" src="svgs/InvitedPanelsIcon.svg" alt="" />
                            <p className="margin-0 padding-0">Invited panels</p>
                        </a>
                    </div>
                    <div ref={signOutBtn} className="flex gap2 navlink justify-content-center popUpseparator">
                        <img className="iconSize" src="svgs/SignOutIcon.svg" alt="" />
                        <p className="cursor-pointer">Sign out</p>
                    </div>
                </div>
            </div>
        </>
    )

    async function signOut(){
        const response = await fetch("http://localhost:8080/User/signOut",{
            method: "POST",
            credentials: "include"
        })
        const data = response.text();
        return data;
    }

    function showOrHideUserPopUp() {
        if(!divPopUp.current.classList.contains("userPopUpToggled"))
            divPopUp.current.classList.add("userPopUpToggled");
        else divPopUp.current.classList.remove("userPopUpToggled");
    }
}



export default UserProfileBtnComponent
