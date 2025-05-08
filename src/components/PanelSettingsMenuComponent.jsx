import { useRef, useState } from "react";
import { showPopUp } from "./ModalComponent";
import { getUserById } from "./PanelCardComponent";

let hasEvent = [false, false];
let usersSelectedGlobal = [];

function PanelSettingsMenuComponent(props) {

    let panel = props.panel !== undefined ? props.panel : null;
    let currentUserSearchList = [];

    const usersearchListCheckboxesRef = useRef([]);
    const accordionsRef = useRef([]);
    const popUpRef = useRef(null);

    const [HTMLUserSearchList, setHTMLUserSearchList] = useState([]);
    const [errorMessage, setErrorMessage] = useState();

    return (
        <>
            <img onClick={showSlide} title="Settings" src="/svgs/SettingsIcon.svg" className="iconSize cursor-pointer shadowBtnBorder1px padding-03 border-radius-50" alt="" />
            <div ref={popUpRef} className="panelSettingsPopUp bgWindow positionAbsolute top-0 h100vh">
                <div className="flex justify-content-end padding-1 positionRelative z-index-1">
                    <div onClick={hiddeSlide} title="close" className="PlusBtn whitePlus transparentBtn diagonal medium-size margin-auto-0"></div>
                </div>
                <div className="flex flex-direction-column h100 w100 positionAbsolute boxSize-Border padding-2 top-0 justify-space-bwt">
                    <div className="padding-left-2 padding-right-2 padding-top-2-25">
                        <div className="flex flex-direction-column gap1">
                            <div className="flex flex-direction-column">
                                <div onClick={() => {showHiddeAccordion("inviteFriends")}} className="flex justify-space-bwt align-items-center window cursor-pointer">
                                    <p className="textLittle margin-0 text-white">Invite friends</p>
                                    <div ref={(el) => {accordionsRef.current["inviteFriendsArrow"] = el}} onClick={showSlide} className="btn ArrowBtn rotateNeg90Deg transition500 flex justify-content-center align-items-center margin-auto-0 border-radius-50 padding-03 aspect-ratio-1 ">
                                        <div className="w-fitContent aspect-ratio-1">
                                            <img className="iconSize-2 display-block margin-0-auto aspect-ratio-1" alt="" src="http://localhost:5173/svgs/leftPointingArrowIcon.svg"/>
                                        </div>
                                    </div>
                                </div>
                                <div ref={(el) => {accordionsRef.current["inviteFriends"] = el}} id="inviteFriends" className="fadeSlide fadeSlideUnToggled positionRelative">
                                    <div className="flex justify-space-bwt">
                                        <form onSubmit={(e) => {searchUsers(e, null)}} className="flex gap1 padding-1px">
                                            <input id="inviteFriendsInput" type="text" className="display-block window text-white" placeholder="Search users" autoComplete="on"/> 
                                            <button type="submit" className="SearchBtn whiteIcon btnGradientBluePurple flex">
                                                <img className="iconSize margin-auto" src="http://localhost:5173/svgs/SearchIcon.svg" alt="" />
                                            </button>
                                        </form>
                                        <button disabled id="inviteBtn" className="btn miniBtn btnGradientBluePurple btnNotHover cursor-notAllowed h-fitContent margin-auto-0 userSelectNone"><p className="margin-0">Invite</p></button>
                                    </div>
                                    <div className="positionAbsolute btm-0 accordionUserList w100 borderLR bgWindow overFlowHidden boxSize-Border">
                                        <div className="overFlowYAuto darkscrollBar accordionUserList">
                                            {!accordionsRef.current?.["inviteFriends"]?.classList.contains("fadeSlideUnToggled") && HTMLUserSearchList}
                                        </div>
                                    </div>
                                    <div className="flex justify-content-center w100">
                                        <span id="maxErr" className="hidden errorMessageLabel w100 text-centered textNano margin-0">{errorMessage}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-direction-column">
                                <div onClick={() => {showHiddeAccordion("kickFriends")}} className="flex justify-space-bwt align-items-center window cursor-pointer">
                                    <p className="textLittle margin-0 text-white">Delete friends</p>
                                    <div ref={(el) => {accordionsRef.current["kickFriendsArrow"] = el}} onClick={showSlide} className="btn ArrowBtn rotateNeg90Deg transition500 flex justify-content-center align-items-center margin-auto-0 border-radius-50 padding-03 aspect-ratio-1 ">
                                        <div className="w-fitContent aspect-ratio-1">
                                            <img className="iconSize-2 display-block margin-0-auto aspect-ratio-1" alt="" src="http://localhost:5173/svgs/leftPointingArrowIcon.svg"/>
                                        </div>
                                    </div>
                                </div>
                                <div ref={(el) => {accordionsRef.current["kickFriends"] = el}} id="kickFriends" className="fadeSlide fadeSlideUnToggled positionRelative">
                                    <div className="flex justify-space-bwt">
                                        <form onSubmit={(e) => {searchUsers(e, null)}} className="flex gap1 padding-1px">
                                            <input id="kickFriendsInput" type="text" className="display-block window text-white" placeholder="Search users" autoComplete="on"/> 
                                            <button type="submit" className="SearchBtn whiteIcon btnGradientBluePurple flex">
                                                <img className="iconSize margin-auto" src="http://localhost:5173/svgs/SearchIcon.svg" alt="" />
                                            </button>
                                        </form>
                                        <button disabled id="kickBtn" className="btn miniBtn btnGradientBluePurple btnNotHover cursor-notAllowed h-fitContent margin-auto-0 userSelectNone"><p className="margin-0">Delete</p></button>
                                    </div>
                                    <div className="positionAbsolute btm-0 accordionUserList w100 borderLR bgWindow overFlowHidden boxSize-Border">
                                        <div className="overFlowYAuto darkscrollBar accordionUserList">
                                            {!accordionsRef.current?.["kickFriends"]?.classList.contains("fadeSlideUnToggled") && HTMLUserSearchList}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-content-center gap05 popUpseparator padding-top-2">
                        <img onClick={() => {showPopUp("deletePanel")}} title="Delete note" className="iconSize display-block cursor-pointer padding-01" src="http://localhost:5173/svgs/DeleteIcon.svg" alt="" />
                        <p onClick={() => {showPopUp("deletePanel")}} className="margin-0 textLittle text-white text-redHover cursor-pointer">Delete panel</p>
                    </div>
                </div>
            </div>
        </>
    )

    async function searchUsers(e, nickname = null, accordionId = null){
        e?.preventDefault();
        let input = e?.target.getElementsByTagName("input")[0];
        let formData = new FormData();
        formData.append("nickname", nickname === null ? input?.value : nickname);
        const response = await fetch("http://localhost:8080/User/findByContainingNickname",{
            method: "POST",
            body: formData
        });
        const data = await response.json();
        if(Array.isArray(data)){
            currentUserSearchList = data;
            createHTMLUserList(data, (accordionId === null ? input.id.replaceAll("Input","") : accordionId) === "kickFriends" ? true : false);
        } 
    }

    async function createHTMLUserList(userList, notPushUsersAlreadyInPanel = false){
        setHTMLUserSearchList([]);
        let HTMLUserList  = [];
        let panelParticipants = await getPanelParticipantsByPanel(panel);
        if(notPushUsersAlreadyInPanel === false){
            let userPanelOwner = await getUserById(panel.creatorId);
            let nMaxParticipants = userPanelOwner.plan.nMaxCollaborators;
            if(panelParticipants.length > nMaxParticipants){
                setErrorMessage("You can not add more friends due to your current plan.");
                setTimeout(() => {
                    document.getElementById("maxErr").classList.remove("hidden");
                }, 400);
            }
            else{
                if(!document.getElementById("maxErr").classList.contains("hidden")) document.getElementById("maxErr").classList.add("hidden");
                setErrorMessage(`Your current plan only allows you to select 0 friends`);
            }
        }
        HTMLUserList = userList.map((user) => {
            if((!notPushUsersAlreadyInPanel && !(panelParticipants.some(panelParticipant => panelParticipant.participant.id === user.id))) || (notPushUsersAlreadyInPanel && panelParticipants.some(panelParticipant => panelParticipant.participant.id === user.id) && user.id !== panel.creatorId)){
                return(
                    <div key={user.id} className="userList flex align-items-center justify-space-bwt padding-05 boxSize-Border">
                        <a href={"/UserProfile/" + user.nickname} className="flex gap1 text-decoration-none">
                            <img className="miniUserPicture display-block cursor-pointer object-fit-cover margin-auto-0" src={user.profilePicture !== null && user.profilePicture !== undefined && user.profilePicture !== "" ? user.profilePicture : `http://localhost:5173/svgs/defaultProfileImage.svg`} alt="" />
                            <p className="text-white textMini text-hover">{user.nickname}</p>
                        </a>
                        <div className="flex align-items-center containerCheckbox margin-0 padding-01 display-block">
                            <input onChange={readChecked} ref={(el) => {usersearchListCheckboxesRef.current["ck"+user.id] = el}} id={"ck"+user.id} type="checkbox" className="hidden"/>
                            <label htmlFor={"ck"+user.id} className="checkmark cursor-pointer w-fitContent"></label>
                        </div>
                    </div>
                )
            }
        })
        setHTMLUserSearchList(HTMLUserList);
    }

    async function readChecked(){
        let usersSelected = [];
        let nChecked = 0;
        let panelParticipants = await getPanelParticipantsByPanel(panel);
        let userPanelOwner = await getUserById(panel.creatorId);
        let nMaxParticipants = userPanelOwner.plan.nMaxCollaborators;
        let inviteBtn = document.getElementById([...document.getElementsByClassName("fadeSlide")].filter((element) => !element.classList.contains("fadeSlideUnToggled"))[0].id.replaceAll("Friends","")+"Btn");
        setErrorMessage(`Your current plan only allows you to select ${nMaxParticipants} friends`);
        for (const id in usersearchListCheckboxesRef.current) {
            let checkbox = usersearchListCheckboxesRef.current[id];
            if(checkbox?.checked){
                usersSelected.push(parseInt(id.replaceAll("ck","")));
                nChecked++;
            }
        }
        usersSelectedGlobal = usersSelected;
        if(nChecked > nMaxParticipants || nChecked + panelParticipants.length > nMaxParticipants+1 && !([...document.getElementsByClassName("fadeSlide")].filter((element) => !element.classList.contains("fadeSlideUnToggled"))[0].id === "kickFriends")){
            document.getElementById("maxErr").classList.remove("hidden");
            if(!inviteBtn.classList.contains("cursor-notAllowed")){
                inviteBtn.classList.add("cursor-notAllowed");
                inviteBtn.classList.add("btnNotHover");
                inviteBtn.disabled = true;
                return;
            }
        }
        else{
            if(nChecked > 0){
                document.getElementById("maxErr").classList.add("hidden");
                inviteBtn.classList.remove("cursor-notAllowed");
                inviteBtn.classList.add("cursor-pointer");
                inviteBtn.classList.remove("btnNotHover");
                inviteBtn.disabled = false;
            }
        }
        if(nChecked < 1){
            if(!inviteBtn.classList.contains("cursor-notAllowed")){
                inviteBtn.classList.add("cursor-notAllowed");
                inviteBtn.classList.add("btnNotHover");
                inviteBtn.disabled = true;
                return;
            }
        }
        if([...document.getElementsByClassName("fadeSlide")].filter((element) => !element.classList.contains("fadeSlideUnToggled"))[0].id === "inviteFriends"){
            const funct = () => addFriends();
            if(hasEvent[0]){
                hasEvent[0] = false
                inviteBtn.removeEventListener("click", funct)
            }
            if(!hasEvent[0]) {
                hasEvent[0] = true;
                inviteBtn.addEventListener("click", funct);
            }
        }
        else{
            const funct = () => deleteFriends();
            if(hasEvent[1]){
                hasEvent[1] = false
                inviteBtn.removeEventListener("click", funct)
            }
            if(!hasEvent[1]) {
                hasEvent[1] = true;
                inviteBtn.addEventListener("click", funct);
            }
        }
    }

    async function addFriends() {
        const response = await fetch("http://localhost:8080/PanelParticipant/addFromArrayToPanel/"+panel.id,{
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(usersSelectedGlobal),
        });
        const data = await response.json();
        if(data === true)  createHTMLUserList(currentUserSearchList, false);
    }

    async function deleteFriends(usersSelected){
        console.log(usersSelected);
        const response = await fetch("http://localhost:8080/PanelParticipant/deleteFromArrayInPanel/"+panel.id,{
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(usersSelectedGlobal),
        });
        const data = await response.json();
        if(data === true) createHTMLUserList(currentUserSearchList, true);
    }

    function showHiddeAccordion(accordionId){
        usersearchListCheckboxesRef.current = [];
        for (const id in accordionsRef.current) {
            if(!id.includes("Arrow") && id !== accordionId && !accordionsRef.current[id].classList.contains("fadeSlideUnToggled")) showHiddeAccordion(id);
        }
        let accordion = accordionsRef.current[accordionId];
        let arrrow = accordionsRef.current[accordionId+"Arrow"];
        if(accordion.classList.contains("fadeSlideUnToggled")){
            accordion.classList.remove("display-none");
            setTimeout(() => {
                accordion.classList.remove("fadeSlideUnToggled");
                arrrow.classList.remove("rotateNeg90Deg");
                arrrow.classList.add("rotate90Deg");
                searchUsers(null, "", accordionId);
            }, 1)
        }
        else {
            accordion.classList.add("fadeSlideUnToggled");
            arrrow.classList.add("rotateNeg90Deg");
            arrrow.classList.remove("rotate90Deg");
            setTimeout(() => {
                accordion.classList.add("display-none");
            }, 400)
        }
    }

    function showSlide(){
        let popUp = popUpRef.current;
        if(!popUp.classList.contains("panelSettingsPopUpToggled")){
            popUp.classList.add("panelSettingsPopUpToggled");
        }
    }

    function hiddeSlide(){
        let popUp = popUpRef.current;
        if(popUp.classList.contains("panelSettingsPopUpToggled")){
            popUp.classList.remove("panelSettingsPopUpToggled");
        }
    }
}

export async function getPanelParticipantsByPanel(panel) {
    panel.panelParticipants = [];
    const response = await fetch("http://localhost:8080/PanelParticipant/findByPanel",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(panel)
    });
    const data = await response.json();
    if(Array.isArray(data)) return data;
    else return null;
}

export default PanelSettingsMenuComponent
