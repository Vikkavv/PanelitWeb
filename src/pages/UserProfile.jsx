import { useEffect, useState } from "react"
import { cookieSessionChecker } from "../assets/js/SessionChecker";
import LogoContainer from "../components/LogoContainerComponent";
import { getFollowed, getFollowers } from "../assets/js/getFollowersAndFollowedOfAnUser";
import { useNavigate, useParams } from "react-router";
import PanelCardComponent, { getUserById } from "../components/PanelCardComponent";
import { getUserPanels } from "./WorkSpace";
import { dynamicClasses } from "../assets/js/dynamicCssClasses";
import ModalComponent, { showPopUp } from "../components/ModalComponent";
import { ABSOLUTE_IMAGES_URL, BACKEND_PATH } from "../App";
import { isMobileDevice, isMobileDeviceAndIsInPortrait } from "../components/NavbarComponent";

let userData = {
    "id": 0,
    "name":"",
    "lastName":"",
    "nickname":"",
    "email":"",
    "password":"",
    "phoneNumber":null,
    "profilePicture":null
};

let counter = 0;

function UserProfile() {

    let { id } = useParams();

    const [reactiveUser, setReactiveUser] = useState(null);
    const [userFollowers, setUserFollowers] = useState([]);
    const [userFollowed, setUserFollowed] = useState([]);
    const [sessionUserFollowers, setSessionUserFollowers] = useState([]);
    const [sessionUserFollowed, setSessionUserFollowed] = useState([]);
    const [panels, setPanels] = useState(null);
    const [HTMLOwnedPanels, setHTMLOwnedPanels] = useState([]);
    const [HTMLJoinedPanels, setHTMLJoinedPanels] = useState([]);
    
    const [isMobileInPortrait, setIsMobileInPortrait] = useState(null);
    const [isMobile, setIsMobile] = useState(null);
    window.addEventListener("resize", () => {
        if(!isMobileDevice()) setIsMobile(isMobileDevice());
        if(!isMobileDeviceAndIsInPortrait()) setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
    });

    screen.orientation.addEventListener("change", () => {
        if(isMobileDevice()){
            setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
        }
    });

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

    useEffect(() => {
        if(reactiveUser !== null){
            const getFollowingInfo = async () => {
                setUserFollowed(await getFollowed(reactiveUser));
                setUserFollowers(await getFollowers(reactiveUser));
                setPanels(await getUserPanels(reactiveUser));
            };
            getFollowingInfo();
        }   
    }, [reactiveUser])

    useEffect(() => {
        if(panels !== null)
            createPanelCards();
    }, [panels])

    useEffect(() => {
        const checkSession = async () => {
            const data = await cookieSessionChecker();
            if(data !== null){
                userData = setOnlyRelevantUserValues(userData, data);
                setSessionUserFollowed(await getFollowed(userData));
                setSessionUserFollowers(await getFollowers(userData));
            } 
        };
        checkSession();
        const getUser = async () => {
            let parsedId = Number.parseInt(id);
            let user = !Number.isNaN(parsedId) ? await getUserById(id) : await getUserByNickname(id);
            setReactiveUser(setOnlyRelevantUserValues(userData, user));
            if(user?.nickname)
                document.title = user.nickname + "'s profile | Panelit";
        }
        getUser();
        document.getElementsByTagName("html")[0].classList.add("darkscrollBar");
        dynamicClasses();
        setIsMobile(isMobileDevice());
        setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
    }, [])

    useEffect(() => {
        dynamicClasses();
    }, [isMobile, isMobileInPortrait])

    return (
        <>
            <div id="noBg"> 
                <LogoContainer isLink="true" url="/workspace" hasPadding="true" paddingClass={isMobile ? "padding-top-02 padding-left-05" : "padding-08-2-08-2"} isRotatable="true"/>
                <div className={(isMobile ? "container10" : "container") + ""}>
                    <div className="flex gap5 margin-top-05">
                        <div className="padding-1 padding-top-05 padding-bottom-05 flex ">
                            <a title="Go back" href="#" onClick={(e) => goBack(e)} className={(isMobile ? "padding-05 margin-left-3Neg cursor-none btnOnlyHover" : "padding-1") + " btn flex justify-content-center align-items-center border-radius-50 margin-auto-0 aspect-ratio-1 "}>
                                <div className="w-fitContent aspect-ratio-1">
                                    <img className={(isMobile ? "Jpr[l:-1px]" : "") + " iconSize-2 display-block margin-0-auto aspect-ratio-1 userSelectNone"} alt="" src={ ABSOLUTE_IMAGES_URL + "/svgs/leftPointingArrowIcon.svg" }/>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className={(isMobile ? "gap1 margin-top-1" : "gap5 margin-top-05") + " flex"}>
                        <img onClick={() => showPopUp("userImage")} className={(isMobile ? "mobileProfilePicture padding-01 btnNotHoverNotGradient shadowBtnBorder" : "padding-05") + " btn userProfilePicture object-fit-cover overFlowHidden cursor-pointer circular"} src={reactiveUser !== null && reactiveUser.profilePicture !== undefined && reactiveUser.profilePicture !== null && reactiveUser.profilePicture !== "" ? reactiveUser.profilePicture : ABSOLUTE_IMAGES_URL + `/svgs/defaultProfileImage.svg`} alt="" />
                        <div className="flex flex-direction-column justify-content-center gap0">
                            <h1 className={(isMobile ? "" : "margin-top-1") + " text-white margin-0"}>{reactiveUser?.nickname}</h1>
                            <p className="text-gray text-semiLight margin-0">{`${reactiveUser?.name ?? ""} ${reactiveUser?.lastName ?? ""}`}</p>
                            <div className={(isMobile ? "gap1 margin-top-1" : "gap4 margin-top-3") + " flex"}>
                                <p onClick={() => showPopUp("followers")} className="margin-0 text-white text-hover cursor-pointer text-noWrap text-ellipsis overFlowHidden">{userFollowers.length} Followers</p>
                                <p onClick={() => showPopUp("followed")} className="margin-0 text-white text-hover cursor-pointer text-noWrap text-ellipsis overFlowHidden">{userFollowed.length} Followed</p>
                            </div>
                            {reactiveUser !== null && userData.id !== 0 && reactiveUser.id !== userData.id && !userFollowers.some(obj => obj.id === userData.id) ?
                                <div onClick={() => follow(null)} className="btn btn-large padding-05 btnGradientBluePurple h-fitContent margin-top-3 userSelectNone"><p className="margin-0">Follow</p></div>
                                :
                                (reactiveUser?.id !== userData.id && userData.id !== 0 &&
                                    <div onClick={() => unfollow(null)} className="btn btn-large padding-05 btnGradientBluePurple h-fitContent margin-top-3 userSelectNone"><p className="margin-0">Unfollow</p></div>
                                )
                            }
                        </div>
                    </div>
                    <div className="margin-top-3 padding-top-2">
                        <div className="flex align-items-center">
                            <h2 className="text-white margin-0 text-semiLight padding-left-1 padding-0-05">Owned</h2>
                            <div className="flex-1">
                                <span className="popUpseparator display-block"></span>
                            </div>
                        </div>
                        <div className={(isMobile ? (isMobileInPortrait ? "col-2 gap1" : "col-1 gap1") : "col-4 gap2") + " grid row-gap1 margin-top-2 margin-bottom-2 overFlowYAuto darkscrollBar padding-0-1"}>
                            {HTMLOwnedPanels.length < 1 ?
                                (
                                    <div className="span-4 margin-bottom-2">
                                        <h2 className="text-centered text-semiLight text-gray">{reactiveUser ? (reactiveUser.nickname === userData.nickname ? "You" : reactiveUser.nickname ?? "Unknown") : "This user" } hasn't created any panel yet.</h2>
                                    </div>
                                )
                                :
                                HTMLOwnedPanels
                            }
                        </div>
                        <div className="flex align-items-center">
                            <h2 className="text-white margin-0 text-semiLight padding-left-1 padding-0-05">Joined</h2>
                            <div className="flex-1">
                                <span className="popUpseparator display-block"></span>
                            </div>
                        </div>
                        <div className={(isMobile ? (isMobileInPortrait ? "col-2" : "col-1 gap1") : "col-4 gap2") + " grid row-gap1 margin-top-2 padding-bottom-2 overFlowYAuto darkscrollBar padding-0-1"}>
                        {HTMLJoinedPanels.length < 1 ?
                            (
                                <div className="span-4 margin-bottom-2">
                                    <h2 className="text-centered text-semiLight text-gray">{reactiveUser ? (reactiveUser.nickname === userData.nickname ? "You" : reactiveUser.nickname ?? "Unknown") : "This user" } hasn't joined any panel yet.</h2>
                                </div>
                            )
                            :
                            HTMLJoinedPanels
                        }
                        </div>
                    </div>
                </div>
                <ModalComponent id="followers" content={createHTMLUserList(userFollowers)}/>
                <ModalComponent id="followed" content={createHTMLUserList(userFollowed)}/>
                <ModalComponent id="userImage" content={
                    reactiveUser?.profilePicture !== null ? 
                    <img key={counter++} className="w100" src={reactiveUser?.profilePicture}/> 
                    :                 
                    <div key={counter++} className="positionAbsolute top-0 w100 h100 flex justify-content-center align-items-center z-index-0">
                        <h2 className="text-white">{reactiveUser?.nickname} has not profile picture.</h2>
                    </div>
                }/>
            </div>
        </>
    )

    function goBack(e){
        e.preventDefault();
        if(document.referrer === ""){
            if(userData.id === 0 || userData.id === undefined) redirect("/Explore");
            else redirect("/workspace");
        }
        else history.go(-1);
    }

    async function createHTMLUserList(userList){
        let HTMLUserList  = [];
        if(!Array.isArray(userList)){
            userList = await userList;
        }
        else{
            if(userList.length < 1){
                HTMLUserList = 
                <div key={counter++} className="positionAbsolute top-0 w100 h100 flex justify-content-center align-items-center z-index-0">
                    <h2 className="text-white">{reactiveUser?.nickname} has nobody here yet.</h2>
                </div>;
            }
            else{
                HTMLUserList = userList.map((user) => {
                    return(
                        <div key={counter++} className="userList flex align-items-center justify-space-bwt padding-05 boxSize-Border">
                            <a href={"/UserProfile/" + user.nickname} className="flex gap1 text-decoration-none">
                                <img className="miniUserPicture display-block cursor-pointer object-fit-cover margin-auto-0" src={user.profilePicture !== null && user.profilePicture !== undefined && user.profilePicture !== "" ? user.profilePicture : ABSOLUTE_IMAGES_URL + `/svgs/defaultProfileImage.svg`} alt="" />
                                <p className="text-white textMini text-hover">{user.nickname}</p>
                            </a>
                            {(reactiveUser?.id === userData.id && !userFollowed.some(obj => obj.id === user.id)) || (reactiveUser?.id !== userData.id && !sessionUserFollowed.some(obj => obj.id === user.id)) ?  
                                (user.id !== userData.id && userData.id !== 0 && 
                                    <div onClick={() => follow(user)} className="btn btn-large padding-05 btnGradientBluePurple h-fitContent userSelectNone"><p className="margin-0">Also follow</p></div>
                                )
                            :
                                (user.id !== userData.id && userData.id !== 0 &&
                                    <div onClick={() => unfollow(user)} className="btn btn-large padding-05 btnGradientBluePurple h-fitContent userSelectNone"><p className="margin-0">Unfollow</p></div>
                                )
                            }
                        </div>
                    )
                })
            }
            return HTMLUserList;
        }
    }

    async function unfollow(followedUser = null) {
        let followed = followedUser !== null ? followedUser : reactiveUser;
        userData.panelParticipants = followed.panelParticipants = userData.notes = followed.notes = [];
        let formData = new FormData();
        formData.append("follower", JSON.stringify(userData));
        formData.append("followed", JSON.stringify(followed));
        const response = await fetch(BACKEND_PATH+"/Follower/unfollow",{
            method: "POST",
            credentials: "include",
            body: formData
        });
        const data = await response.json();
        if(data === true) {
            setUserFollowed(await getFollowed(reactiveUser));
            setUserFollowers(await getFollowers(reactiveUser));
            setSessionUserFollowed(await getFollowed(userData));
            setSessionUserFollowers(await getFollowers(userData));
        }
    }

    async function follow(followedUser = null){
        let followed = followedUser != null ? followedUser : reactiveUser;
        let formData = new FormData();
        userData.panelParticipants = followed.panelParticipants = userData.notes = followed.notes = [];
        formData.append("follower", JSON.stringify(userData));
        formData.append("followed", JSON.stringify(followed));
        const response = await fetch(BACKEND_PATH+"/Follower/follow",{
            method: "POST",
            credentials: "include",
            body: formData
        });
        const data = await response.json();
        if(data === true) {
            setUserFollowed(await getFollowed(reactiveUser));
            setUserFollowers(await getFollowers(reactiveUser));
            setSessionUserFollowed(await getFollowed(userData));
            setSessionUserFollowers(await getFollowers(userData));
        }
    }

    function createPanelCards(){
        setHTMLOwnedPanels([]);
        setHTMLJoinedPanels([]);
        let counter = 0;
        if(panels.length > 0){
            for (const panel of panels) {
                if(panel.creatorId === reactiveUser.id){
                    setHTMLOwnedPanels(prev => [...prev,
                        <PanelCardComponent key={counter++} creatorId={panel.creatorId} panelId={panel.id} panelTitle={panel.name} panelLastEditedDate={panel.lastEditedDate} panelCoverPhoto={panel.coverPhoto} />
                    ]);
                }else{
                    setHTMLJoinedPanels(prev => [...prev,
                        <PanelCardComponent key={counter++} creatorId={panel.creatorId} panelId={panel.id} panelTitle={panel.name} panelLastEditedDate={panel.lastEditedDate} panelCoverPhoto={panel.coverPhoto} />
                    ]);
                }
            }
        }
    }
}

export function setOnlyRelevantUserValues(user, data){
    user = structuredClone(user);
    user.id = data.id;
    user.name = data.name;
    user.lastName = data.lastName;
    user.nickname = data.nickname;
    user.phoneNumber = data.phoneNumber;
    user.email = data.email;
    user.password = ""+data.password;
    user.profilePicture = data.profilePicture;
    return user;
}

export async function getUserByNickname(nickname) {
    const response = await fetch(BACKEND_PATH+"/User/findByNickname/"+nickname);
    const user = await response.json();
    return user;
}

export default UserProfile
