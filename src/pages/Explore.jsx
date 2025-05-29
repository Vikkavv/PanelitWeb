import { useEffect, useRef, useState } from "react"
import LogoContainer from "../components/LogoContainerComponent"
import UserProfileBtnComponent from "../components/UserProfileBtnComponent"
import { cookieSessionChecker } from "../assets/js/SessionChecker";
import PanelCardComponent, { getUserById } from "../components/PanelCardComponent";

let userData = {}; 
let counter = 0;

function Explore() {

    const [HTMLPanelCardsOrUsers, setHTMLPanelCardsOrUsers] = useState([]);
    const [currentOption, setCurrentOption] = useState(0);

    const refs = useRef([]);

    useEffect(() => {
        const checkSession = async () => {
            const data = await cookieSessionChecker();
            if(data !== null){
                userData = data
            }
        };
        checkSession();
        document.title = "Explore! | Panelit"
        createPanelCards();
    }, []);

    useEffect(() => {
        setHTMLPanelCardsOrUsers([]);
        search();
    }, [currentOption])

    return (
        <>
            <div id="noBg" className="explore body-OverFlowXHidden">
                { JSON.stringify(userData) !== "{}" ?
                    <div className="flex justify-space-bwt">
                        <LogoContainer isLink="true" url="/" hasPadding="true" paddingClass="padding-08-2-08-2" isRotatable="true"/>
                        <div className="flex w-fitContnent aspect-ratio-1 padding-08-2-08-2">
                            <UserProfileBtnComponent userInfo={userData}/>
                        </div>
                    </div>
                    :
                    <LogoContainer isLink="true" url="/" hasPadding="true" paddingClass="padding-08-2-08-2" isRotatable="true"/>
                }
                <div className="overFlowYHidden container10">
                    <div className="flex gap1">
                        <form onSubmit={(e) => search(e)} className="flex">
                            <input ref={(el) => {refs.current['searchInput'] = el}} type="text" className="display-block window text-white margin-bottom-1 margin-top-1 margin-0-1 margin-left-0 margin-left-1px" placeholder={"Search a "+ (currentOption === 0 ? 'panel' : 'user')} autoComplete="on"/> 
                            <button type="submit" className="SearchBtn whiteIcon margin-auto-0 btnGradientBluePurple flex">
                                <img className="iconSize margin-auto" src="svgs/SearchIcon.svg" alt="" />
                            </button>
                        </form>
                        <div className="flex justify-space-bwt align-items-center window toggleBtn margin-auto-0 boxSize-Border">
                            <div onClick={(e) => toggle(e)} className="flex align-items-center justify-content-center toggleOption positionRelative z-index-1 cursor-pointer">
                                <p className="margin-0 text-semiLight text-white">Panels</p>
                            </div>
                            <div onClick={(e) => toggle(e)} className="flex align-items-center justify-content-center toggleOption positionRelative z-index-1 cursor-pointer">
                                <p className="margin-0 text-semiLight text-white">Users</p>
                            </div>
                        </div>
                    </div>
                    {currentOption === 0 &&
                        <div className="grid col-5 overFlowYAuto darkscrollBar gap1 padding-top-1 ha70vhcalc">
                            {HTMLPanelCardsOrUsers}
                        </div>
                    }
                    {currentOption === 1 &&
                        <div className="container10 overFlowYAuto darkscrollBar padding-top-1 ha70vhcalc">
                            {HTMLPanelCardsOrUsers}
                        </div>
                    }
                </div>
            </div>
        </>
    )

    function toggle(e){
        let divToToggle = e.target instanceof HTMLDivElement ? e.target : e.target.parentElement;
        let divPosition = [...divToToggle.parentElement.children].findIndex((div) => div === divToToggle);
        let actualTogglePosition = parseFloat(getComputedStyle(divToToggle.parentElement).getPropertyValue('--markerPos').trim());
        let newTogglePosition = 100 * divPosition;
        setCurrentOption(divPosition);
        if(newTogglePosition !== actualTogglePosition){
            divToToggle.parentElement.style.setProperty("--markerPos", newTogglePosition+"%");
        }
    }

    function search(event){
        event?.preventDefault();
        if(currentOption === 0) createPanelCards(refs.current["searchInput"].value);
        if(currentOption === 1) createUserList(refs.current["searchInput"].value);
    }

    async function createPanelCards(searchText = null){
        setHTMLPanelCardsOrUsers([]);
        let localHTMLPanelCards = [];
        let panelList = searchText === null ? await get100Panels() : await getAllPanels();
        for (const panel of panelList) {
            let userPanel = await getUserById(panel.creatorId);
            if(searchText === null || searchText.trim() === "" || (userPanel.nickname.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchText.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) || panel.name.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchText.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")))){
                localHTMLPanelCards.push(<PanelCardComponent key={counter++} creatorId={panel.creatorId} panelId={panel.id} panelTitle={panel.name} panelLastEditedDate={panel.lastEditedDate} panelCoverPhoto={panel.coverPhoto} />);
            }
        }
        setHTMLPanelCardsOrUsers(localHTMLPanelCards);
    }

    async function createUserList(searchText = null) {
        setHTMLPanelCardsOrUsers([]);
        let localUserList = [];
        let userList = searchText === null ? await get100Users() : await searchUsers(searchText);
        for (const user of userList) {
            localUserList.push(
                <div key={counter++} className="userList flex align-items-center justify-space-bwt padding-05 boxSize-Border">
                    <a href={"/UserProfile/" + user.nickname} className="flex gap1 text-decoration-none">
                        <img className="miniUserPicture display-block cursor-pointer object-fit-cover margin-auto-0" src={user.profilePicture !== null && user.profilePicture !== undefined && user.profilePicture !== "" ? user.profilePicture : `http://localhost:5173/svgs/defaultProfileImage.svg`} alt="" />
                        <p className="text-white textMini text-hover">{user.nickname}</p>
                    </a>
                </div>
            );
        }
        setHTMLPanelCardsOrUsers(localUserList);
    }

    async function searchUsers(nickname){
        let formData = new FormData();
        formData.append("nickname", nickname);
        const response = await fetch("http://localhost:8080/User/findByContainingNickname",{
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if(Array.isArray(data)){
            return data;
        } 
    }
}

export async function getAllPanels() {
    const response = await fetch("http://localhost:8080/Panel/findAll");
    const data = await response.json();
    if(Array.isArray(data)) return data;
}

export async function get100Users() {
    const response = await fetch("http://localhost:8080/User/find100");
    const data = await response.json();
    if(Array.isArray(data)) return data;
}

export async function get100Panels() {
    const response = await fetch("http://localhost:8080/Panel/find100");
    const data = await response.json();
    if(Array.isArray(data)) return data;
}

export default Explore
