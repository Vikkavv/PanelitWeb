import { useNavigate, useParams } from "react-router"
import LogoContainer from "../components/LogoContainerComponent";
import { useEffect, useRef, useState } from "react";
import { getUserById } from "../components/PanelCardComponent";
import { ARTICLE_STRUCTURE_SAMPLE, CARD_STRUCTURE_SAMPLE, CARDS_TYPE_PANEL, COLUMN_STRUCTURE_SAMPLE, COLUMN_TYPE_PANEL, CONNECTED_CARDS_TYPE_PANEL } from "./CreatePanel";
import { dynamicClasses } from "../assets/js/dynamicCssClasses";
import { cookieSessionChecker } from "../assets/js/SessionChecker";
import { setOnlyRelevantUserValues } from "./UserProfile";
import ModalComponent, { hiddePopUp, showPopUp } from "../components/ModalComponent";
import PdfThumbnail from "../components/PdfThumbnail";
import PdfViewer from "../components/PdfViewer";
import { isLightImg } from "../assets/js/ImgDarkOrLight";
import PanelSettingsMenuComponent, { deleteFriends, getPanelParticipantsByPanel } from "../components/PanelSettingsMenuComponent";
import { BACKEND_PATH } from "../App";

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
let columnCounter = 0;
let noteCounter = 0;
let noReactivePanel = {};
let strPanelContent = "";
let currentColumn = -1;
let canvasContext = null;
let isDragging = false;
let draggedCard = null;
let offsetX = 0;
let offsetY = 0;
let currentX = 0;
let currentY = 0;
let modifiedNotes = new Map();
let saveTimeout = null;
let globalCards = null;
let editingACard = false

let NOTE_STRUCTURE = {
    "panel": {
        "id": 0
    },
    "owner": {
        "id": 0
    },
    "title": "",
    "contentType": "",
    "bodyText": "",
    "resourceUrl": null,
    "lastEditedDate": null,
    "additionalInfo": null
}


function Panel() {

    let { id } = useParams();

    const [panel, setPanel] = useState({});
    const [panelCreator, setPanelCreator] = useState({});
    const [reactiveUser, setReactiveUser] = useState(null);
    const [panelContent, setPanelContent] = useState(null);
    const [HTMLcolumns, setHTMLColumns] = useState([]);
    const [HTMLColumnDelete, setHTMLColumnDelete] = useState();
    const [HTMLPdfRender, setHTMLPdfRender] = useState(null);
    const [HTMLNoteForm, setHTMLNoteForm] = useState(null);
    const [invertTextColors, setInvertTextColors] = useState(false);
    const [HTMLCardNotes, setHTMLCardNotes] = useState([]);

    const [isCreator, setIsCreator] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);

    const refs = useRef([]);
    const inputRefs = useRef([]);
    const divRefs = useRef([]);
    const noteRefs = useRef([]);
    const columnRefs = useRef([]);
    const pdfFileRef = useRef(null);
    const canvasRef = useRef(null);
    const cardsRef = useRef([]);
    const dbCardNotesRef = useRef([]);
    const cardsContainerRef = useRef(null);

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

    useEffect(() => {
        const checkSession = async () => {
            const data = await cookieSessionChecker();
            if(data !== null){
                setReactiveUser(setOnlyRelevantUserValues(userData, data));
                userData = setOnlyRelevantUserValues(userData, data);
            } 
            else{
                setReactiveUser({});
                userData = {};
            } 
        };
        checkSession();
        noteTypeForm(null, "text");
        document.body.addEventListener("wheel", (e) => handleResize(e), {passive: false});
    }, [])

    useEffect(() => {
        if(invertTextColors === true){
            let head = document.getElementsByTagName("head")[0]
            let style = document.createElement("style");
            style.textContent = ".container15 .text-white,.container15 .text-gray{color: black;}";
            head.appendChild(style);
        }
    },[invertTextColors])

    useEffect(() => {
        if(panel && panel.additionalInfo){
            document.title = `Panel - ${panel.name} | Panelit`;
            const getUser = async () => {
                let user = await getUserById(panel.creatorId);
                setPanelCreator(user);
            }
            getUser();
            getPanelParticipant();
            getPanelBackground();
            const checkParticipants = async () => {
                let panelParticipants = await getPanelParticipantsByPanel(panel);
                let panelOwner = await getUserById(panel.creatorId);
                if(panelParticipants.filter((panelParticipant) => panelParticipant.participant.id !== panel.creatorId).length > panelOwner.plan.nMaxCollaborators){
                    let panelParticipantsWithOutOwner = panelParticipants.filter((panelParticipant) => panelParticipant.participant.id !== panel.creatorId);
                    let panelParticipantToDelete = [];
                    for (let i = 0; i < panelParticipantsWithOutOwner.length - panelOwner.plan.nMaxCollaborators; i++) {
                        let rand = Math.floor(Math.random() * panelParticipantsWithOutOwner.length);
                        panelParticipantToDelete.push(panelParticipantsWithOutOwner[rand].participant.id);
                    }
                    await deleteFriends(panelParticipantToDelete, panel);
                }
            }
            checkParticipants();
            if(panelContent !== null && divRefs.current["columnContainer"]){
                printcolumns();
            }
        }
    }, [JSON.stringify(panel)])

    useEffect(() => {
        if(isCreator !== null){
            if(panel.isBlocked){
                setIsCreator(false);
                setIsAdmin(false);
            }
            getPanelContent();
        }
    },[isCreator+""])

    useEffect(() => {
        if(reactiveUser !== null){
            getPanel();
        }
    },[JSON.stringify(reactiveUser)])

    useEffect(() => {
        dynamicClasses();
        if(panelContent !== null && divRefs.current["columnContainer"]){
            printcolumns();
        }
        if(panelContent !== null && (JSON.parse(panel.additionalInfo).type === CARDS_TYPE_PANEL || JSON.parse(panel.additionalInfo).type === CONNECTED_CARDS_TYPE_PANEL )) printCardNotes();
    },[strPanelContent]);

    useEffect(() => {
        dynamicClasses();
    },[HTMLcolumns])

    useEffect(() => {
        dynamicClasses();
    }, [JSON.stringify(HTMLNoteForm)])

    useEffect(() => {
        if(JSON.stringify(HTMLCardNotes) !== "[]" && JSON.parse(panel.additionalInfo).type === CONNECTED_CARDS_TYPE_PANEL) draw();
    }, [HTMLCardNotes])

    return (
        <>
            <div className="opacity100 body-OverFlowXHidden">
                <div ref={(el) => {refs.current["navbar"] = el}} className="navbar navbarTranslucent padding-0 flex justify-space-bwt">
                    <div className="flex justify-content-start gap1">
                        <div className="flex">
                            <LogoContainer isLink="true" hasTitle="false" url="/workspace" hasPadding="true" paddingClass="padding-08-2-08-2 padding-top-05 padding-bottom-05" isRotatable="true" classes="positionRelative z-index-1"/>
                            <div className="padding-1 padding-top-05 padding-bottom-05 flex ">
                                <a title="Go back" href="#" onClick={(e) => goBack(e)} className="btn ArrowBtn flex justify-content-center align-items-center margin-auto-0 border-radius-50 padding-05 aspect-ratio-1 ">
                                    <div className="w-fitContent aspect-ratio-1">
                                        <img className="iconSize-2 display-block margin-0-auto aspect-ratio-1" alt="" src="http://localhost:5173/svgs/leftPointingArrowIcon.svg"/>
                                    </div>
                                </a>
                            </div>
                        </div>
                        <div className="flex align-items-center gap1">
                            <h1 className="textLittle fontWeightNormal text-white">{panel.name}</h1>
                            <span className="text-gray">·</span>
                            <a href={"/UserProfile/" + panelCreator.nickname} className="margin-0 textMini text-gray">{panelCreator.nickname}</a>
                            <span className="text-gray">·</span>
                            <p className="margin-0 textNano text-gray">Last edited date: {panel?.lastEditedDate?.replaceAll("-","/")}</p>
                        </div>
                    </div>
                    {isCreator === true &&
                        <div className="flex align-items-center padding-08-2-08-2 padding-top-05 padding-bottom-05">
                            <PanelSettingsMenuComponent panel={panel} />
                        </div>
                    }
                </div>
                {panelContent !== null && panelContent}
                {panel?.additionalInfo !== undefined && (isAdmin || isCreator) && JSON.parse(panel.additionalInfo).type === COLUMN_TYPE_PANEL && 
                    <div id="columnSlider" className="editSliderPanel flex-direction-column justify-space-bwt window bgWindow border-radius-inherit-0-0-0 padding-1 display-none">
                        <div className="flex justify-space-bwt">
                            <h2 className="margin-0 text-white fontWeightNormal">New Column</h2>
                            <button onClick={() => showHideSlider("columnSlider")} className="PlusBtn whitePlus transparentBtn diagonal medium-size margin-auto-0"/>
                        </div>
                        <form onSubmit={(e) => {createNewColumn(e)}} className="margin-top-1">
                            <label className="display-block text-white textMini  margin-bottom-05 w-fitContent" htmlFor="name">Column title</label>
                            <input ref={(el) => {inputRefs.current["columnName"] = el}} type="text" id="name" name="name" className="display-block window text-white margin-bottom-1 margin-top-0 Jw[11rem]" placeholder="Column title" autoComplete="off"/>
                            <div className="flex justify-content-end">
                                <button className="btn miniBtn btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone"><p className="margin-0">Create</p></button>
                            </div>
                        </form>
                    </div>
                }
                {(isAdmin || isCreator) &&
                    <div id="noteSlider" className="editSliderPanel z-index-1 noteEditSliderPanel flex-direction-column justify-space-bwt window bgWindow border-radius-inherit-0-0-0 padding-1 display-none">
                        <div className="flex justify-space-bwt align-items-center">
                            <h2 className="margin-0 text-white fontWeightNormal">New note</h2>
                            <div className="flex">
                                <div onClick={(e) => {noteTypeForm(e)}} id="text" className="underlinedBtn underlinedBtnToggled">Text</div>
                                <div onClick={(e) => {noteTypeForm(e)}} id="document" className="underlinedBtn">Pdf</div>
                            </div>
                            <button onClick={() => {showHideSlider("noteSlider"); currentColumn = -1}} className="PlusBtn whitePlus transparentBtn diagonal medium-size margin-auto-0"/>
                        </div>
                        <form onSubmit={(e) => {createNewNote(e)}} className="flex flex-direction-column gap1 margin-top-1">
                            {HTMLNoteForm}
                        </form>
                    </div>
                }
                {panel?.additionalInfo !== undefined && JSON.parse(panel.additionalInfo).type === COLUMN_TYPE_PANEL &&
                    <ModalComponent id="deleteColumn" isMini="true" content={HTMLColumnDelete}/>
                }
                <ModalComponent id="pdfRender" hasScroll="false" isFullScreen="true" content={HTMLPdfRender} />
                <ModalComponent id="deletePanel" isMini="true" content={
                    <div>
                        <h2 className="margin-0 text-white padding-bottom-05">Are you sure you want to delete this panel?</h2>
                        <p className="margin-0 textMini text-white">This action will also delete all the notes in the panel.</p>
                        <div className="flex justify-space-bwt margin-top-1">
                            <div onClick={() => {hiddePopUp("deletePanel")}} className="btn btn-large text-decoration-none h-fitContent margin-auto-0 userSelectNone"><p className="margin-0 text-white text-semiLight">Cancel</p></div>
                            <div onClick={deletePanel} className="btn btn-large btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone"><p className="margin-0">Delete</p></div>
                        </div>
                    </div>
                } />
            </div>
        </>
    )

    function goBack(e){
        e.preventDefault();
        let previousPath = sessionStorage.getItem('previousPath');
        if(previousPath?.includes('/CreatePanel')){
            sessionStorage.setItem("previousPath", "");
            redirect("/workspace");
            return;
        } 
        if(document.referrer === ""){
            if(userData.id === 0 || userData.id === undefined) redirect("/Explore");
            else redirect("/workspace");
        }
        else history.go(-1);
    }

    function getPanelContent(paramHTMLNotes = null){
        if(JSON.parse(panel.additionalInfo).type === COLUMN_TYPE_PANEL){
            let nColumns = JSON.parse(panel.additionalInfo).columns.length;
            let content = nColumns === 0 ?

            <div ref={(el) => {divRefs.current["columnContainer"] = el}} className="container15 overFlowAuto darkscrollBar padding-top-2 margin-bottom-2 h80vh gap2">
                {(isAdmin || isCreator) && 
                    <div onClick={() => {showHideSlider("columnSlider")}} className="flex gap1 flex-direction-column h75vh justify-content-center align-items-center btnHover cursor-pointer">
                        <h2 className="text-gray textLittle fontWeightNormal textShadowBlack margin-0">Add column</h2>
                        <div className="PlusBtn smallPlusBtn btnHover whitePlus bgWindow"></div>
                    </div>
                }
            </div>

            : 
            
            <div ref={(el) => {divRefs.current["columnContainer"] = el}} className="container15 overFlowAuto darkscrollBar padding-top-2 margin-bottom-2 h80vh grid gap2">
                {paramHTMLNotes === null ? HTMLcolumns : paramHTMLNotes}
                {(isAdmin || isCreator) && 
                    <div onClick={() => {showHideSlider("columnSlider")}} className="flex gap1 flex-direction-column justify-content-center align-items-center btnHover cursor-pointer">
                        <h2 className="text-gray textLittle fontWeightNormal margin-0">Add column</h2>
                        <div className="PlusBtn smallPlusBtn btnHover whitePlus bgWindow"></div>
                    </div>
                }
            </div>;

            strPanelContent = " ";

            setPanelContent(
                content
            );
        }
        if(JSON.parse(panel.additionalInfo).type === CARDS_TYPE_PANEL || JSON.parse(panel.additionalInfo).type === CONNECTED_CARDS_TYPE_PANEL){
            let content = 
            <div className="cardCanvas positionRelative">
                { (isCreator || isAdmin) &&
                    <div className="positionAbsolute right-0 padding-05 z-index-1">
                        <div onClick={() => showHideSlider("noteSlider")} className="flex padding-05 gap1 align-items-center window bgWindow btnHover border1px cursor-pointer">
                            <p className="margin-0 textNano text-white">Add note</p>
                            <button className="PlusBtn nanoPlusBtn shadowBtnBorder margin-auto-0 btnGradientBluePurple whitePlus inverted"></button>
                        </div>
                    </div>
                }
                <canvas ref={canvasRef} className="cardCanvas display-block"></canvas>
                <div id="cardsContainer" onMouseDown={(e) => handleMouseDown(e)} onMouseMove={(e) => handleMouseMove(e)} onMouseUp={handleMouseUp} ref={cardsContainerRef.current} className="w100 h100 positionAbsolute top-0">
                    {paramHTMLNotes === null ? HTMLCardNotes : paramHTMLNotes}
                </div>
            </div>;

            strPanelContent = " ";

            setPanelContent(
                content
            );
        }
    }

    async function printCardNotes(){
        setHTMLCardNotes([]);
        cardsRef.current = [];
        dbCardNotesRef.current = [];
        globalCards = [];
        let cards = [];
        if(canvasRef.current !== null){
            let canvas = canvasRef.current;
            canvas.width = parseFloat(getComputedStyle(canvas).width);
            canvas.height = parseFloat(getComputedStyle(canvas).height);
        }
        if(canvasContext === null){
            canvasContext = canvasRef.current?.getContext('2d');
        }
        let panelNotes = JSON.parse(noReactivePanel.additionalInfo).notes;
        for (const panelNote of panelNotes) {
            let dbNote = await findNoteById(panelNote.noteId);
            cards.push(printCard(dbNote.id, panelNote.posX, panelNote.posY, dbNote.title, dbNote.bodyText, dbNote.resourceUrl, dbNote.contentType));
            dbCardNotesRef.current[dbNote.id] = dbNote;
        }
        globalCards = cards;
        setHTMLCardNotes(
            cards
        );
        getPanelContent(cards);
    }

    function printCard(cardId, x, y, title, text = null, pdfUrl = null, contentType = null){
        let card = contentType === "text" ?
            <div key={noteCounter++} id={`card${cardId}`} ref={(el) => {cardsRef.current[cardId] = el}} className="panelNoteCard bgWhite padding-05" style={{left: `${x}px`, top: `${y}px`}}>
                {(isAdmin || isCreator) &&
                    <div className="noteOptions positionAbsolute gap02 top-0 right-0 bgWindow boxSize-Border padding-02 z-index-1">
                        <img onClick={() => {editNote(cardId)}} title="Edit note" className="iconSize display-block cursor-pointer btnHover padding-01" src="http://localhost:5173/svgs/editPencilIcon.svg" alt="" />
                        <img onClick={() => {deleteNote(cardId)}} title="Delete note" className="iconSize display-block cursor-pointer btnHover padding-01" src="http://localhost:5173/svgs/DeleteIcon.svg" alt="" />
                    </div>
                }
                {contentType === "text" &&
                    <>
                        <h2 className="margin-0">{title}</h2>
                        <p className="margin-0">{text}</p>
                    </>
                }
                {contentType === "document" &&
                    <>
                        <div className="positionAbsolute top-0 bgWhite w100">
                            <h2 className="margin-0 border-none textSNormal padding-05 text-ellipsis overFlowHidden text-black text-noWrap" title={title}>{title}</h2>
                        </div>
                        <PdfThumbnail key={noteCounter++} onClick={() => {setHTMLPdfRender(<PdfViewer url={pdfUrl}/>); showPopUp("pdfRender")}} url={pdfUrl}/>
                    </>
                }

                
            </div>
            
            :

            <div key={noteCounter++} id={`card${cardId}`} ref={(el) => {cardsRef.current[cardId] = el}} className="panelNoteCard panelpdfNoteCard bgWhite padding-05" style={{left: `${x}px`, top: `${y}px`}}>
                {(isAdmin || isCreator) &&
                    <div className="noteOptions positionAbsolute gap02 top-0 right-0 bgWindow boxSize-Border padding-02 z-index-1">
                        <img onClick={() => {editNote(cardId)}} title="Edit note" className="iconSize display-block cursor-pointer btnHover padding-01" src="http://localhost:5173/svgs/editPencilIcon.svg" alt="" />
                        <img onClick={() => {deleteNote(cardId)}} title="Delete note" className="iconSize display-block cursor-pointer btnHover padding-01" src="http://localhost:5173/svgs/DeleteIcon.svg" alt="" />
                    </div>
                }
                <h2 className="margin-0 border-none textSNormal text-ellipsis overFlowHidden text-black text-noWrap" title={title}>{title}</h2>
                <div className="flex justify-content-center padding-05">
                    <PdfThumbnail key={noteCounter++} onClick={() => {setHTMLPdfRender(<PdfViewer url={pdfUrl}/>); showPopUp("pdfRender")}} url={pdfUrl}/>
                </div>
            </div>
            ;
        return card;
    }

    function handleResize(e){
        if(e.ctrlKey) e.preventDefault();
    }

    function draw() {
        clearCanvas();
        connectAllCards();
        requestAnimationFrame(draw);
    }

    function connectAllCards(){
        for (let i = 0; i < globalCards.length - 1; i++) {
            connectCards(document.getElementById(globalCards[i].props.id), document.getElementById(globalCards[i + 1].props.id));
        }
    }

    function connectCards(card1, card2){
        canvasContext.strokeStyle = invertTextColors === false ? "#FFFFFF" : "#000000";
        canvasContext.lineWidth = 2;
        const startX = card1.offsetLeft + card1.offsetWidth / 2;
        const startY = card1.offsetTop + card1.offsetHeight / 2;
        const endX = card2.offsetLeft + card2.offsetWidth / 2;
        const endY = card2.offsetTop + card2.offsetHeight / 2;
        const dx = endX - startX;
        const cx1 = startX + dx / 2;
        const cy1 = startY;

        canvasContext.beginPath();
        canvasContext.moveTo(startX, startY);
        canvasContext.bezierCurveTo(cx1, cy1, cx1, endY, endX, endY);
        canvasContext.stroke();
    }

    function clearCanvas() {
        canvasContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    function handleMouseDown(event){
        if(!isCreator && !isAdmin || editingACard) return;
        const div = event.target;
        if(div.classList.contains("panelNoteCard") || div.parentElement.classList.contains("panelNoteCard")){
            isDragging = true;
            document.getElementsByTagName("body")[0].classList.add("userSelectNone");
            draggedCard = div.classList.contains("panelNoteCard") ? div : div.parentElement;
            offsetX = event.clientX - draggedCard.offsetLeft;
            offsetY = event.clientY - draggedCard.offsetTop;
        }
    }

    function handleMouseMove(event){
        if(!isCreator && !isAdmin || editingACard) return;
        if(isDragging && draggedCard){
            const rect = canvasRef.current.getBoundingClientRect();
            const clampedX = Math.min(Math.max(event.clientX - offsetX, 0), rect.width - draggedCard.offsetWidth);
            const clampedY = Math.min(Math.max(event.clientY - offsetY, 0), rect.height - draggedCard.offsetHeight);

            draggedCard.classList.add("z-index-1");
            draggedCard.style.left = `${clampedX}px`;
            draggedCard.style.top = `${clampedY}px`;
            currentX = clampedX;
            currentY = clampedY;
        }
    }

    async function handleMouseUp(){
        if(!isCreator && !isAdmin || editingACard) return;
        if(draggedCard !== null){
            document.getElementsByTagName("body")[0].classList.remove("userSelectNone");
            let noteId = parseInt(draggedCard.id.replaceAll("card",""));

            modifiedNotes.set(noteId, {
                posX: currentX,
                posY: currentY
            });

            if(saveTimeout) clearTimeout(saveTimeout);

            saveTimeout = setTimeout(() => {
                saveAllModifiedNotes();
            }, 1);

            draggedCard.classList.remove("z-index-1");
            isDragging = false;
            draggedCard = null;
        }
    }

    async function saveAllModifiedNotes(saveOnlyLocal = false){
        if(modifiedNotes.size === 0) return;
        let additionalInfo = JSON.parse(noReactivePanel.additionalInfo);
        
        additionalInfo.notes = additionalInfo.notes.map(note => {
            const update = modifiedNotes.get(note.noteId);
            return update 
                ? {...note, posX: update.posX, posY: update.posY}
                : note;
        })

        noReactivePanel.additionalInfo = JSON.stringify(additionalInfo);
        noReactivePanel.panelParticipants = [];
        noReactivePanel.notes = [];

        if(!saveOnlyLocal){
            modifiedNotes.clear();
            saveTimeout = null;

            await updatePanel(noReactivePanel, false);
        }
    }

    function showColumnDeleteModal(columnId){
        setHTMLColumnDelete(
            <div>
                <h2 className="margin-0 text-white padding-bottom-05">Are you sure you want to delete this column?</h2>
                <p className="margin-0 textMini text-white">This action will also delete all the notes in the column.</p>
                <div className="flex justify-space-bwt margin-top-1">
                    <div onClick={() => {hiddePopUp("deleteColumn")}} className="btn btn-large text-decoration-none h-fitContent margin-auto-0 userSelectNone" id="backBtn"><p className="margin-0 text-white text-semiLight">Cancel</p></div>
                    <div onClick={() => {deleteColumnAndContents(columnId)}} className="btn btn-large btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone"><p className="margin-0">Delete</p></div>
                </div>
            </div>
        );
        showPopUp("deleteColumn");
    }

    async function deleteColumnAndContents(columnId){
        let additionalInfo = JSON.parse(panel.additionalInfo);
        let columnsJson = additionalInfo.columns;
        let columnJson = columnsJson[columnId];
        for (const note of columnJson.articles) {
            await deleteNoteDB(note.noteId);
        }
        columnsJson = columnsJson.filter((_, columnIndex) => columnIndex !== columnId);
        additionalInfo.columns = columnsJson;
        noReactivePanel.additionalInfo = JSON.stringify(additionalInfo);
        hiddePopUp("deleteColumn");
        await updatePanel(noReactivePanel);
    }

    async function createNewColumn(event){
        event.preventDefault();
        if(inputRefs.current["columnName"].value.trim() !== ""){
            let additionalInfoNew = JSON.parse(noReactivePanel.additionalInfo);
            let newColumn = structuredClone(COLUMN_STRUCTURE_SAMPLE);
            newColumn.columnTitle = inputRefs.current["columnName"].value;
            additionalInfoNew.columns.push(newColumn);
            noReactivePanel.additionalInfo = JSON.stringify(additionalInfoNew);
            setPanel(noReactivePanel);
            noReactivePanel.notes = [];
            noReactivePanel.panelParticipants = [];
            await updatePanel(noReactivePanel);
        }
    }

    function noteTypeForm(e, type = null){
        setHTMLNoteForm(<></>);
        let btn = null;
        if(type === null) btn = e.target;
        if(type !== null || !btn.classList.contains("underlinedBtnToggled")){
            if(btn !== null){
                btn.classList.add("underlinedBtnToggled");
                document.getElementById(btn.id === "text" ? "document" : "text").classList.remove("underlinedBtnToggled");
            }
            if(type === "text" || btn.id === "text"){
                setHTMLNoteForm( 
                <>
                    <div className="flex flex-direction-column align-items-center">
                        <div>
                            <label className="display-block text-white textMini  margin-bottom-05 w-fitContent" htmlFor="noteTitle">Note title</label>
                            <input ref={(el) => {inputRefs.current["noteTitle"] = el}} type="text" id="noteTitle" className="display-block window text-white margin-bottom-1 margin-top-0 Jw[13rem]" placeholder="Note title" autoComplete="off"/>
                            <label className="display-block text-white textMini  margin-bottom-05 w-fitContent" htmlFor="noteText">Note text</label>
                            <textarea ref={(el) => {inputRefs.current["noteText"] = el}} type="text" id="noteText" className="max-resize-vertical-40vh display-block window text-white margin-bottom-1 margin-top-0 Jw[13rem] darkscrollBar" placeholder="Note text" autoComplete="off"/>
                        </div>
                    </div>
                    <div className="flex justify-content-end">
                        <button className="btn miniBtn btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone"><p className="margin-0">Create</p></button>
                    </div>
                </>
                );
            }
            if(btn?.id === "document"){
                setHTMLNoteForm(
                    <>
                        <div>
                            <label className="display-block text-white textMini  margin-bottom-05 w-fitContent" htmlFor="noteTitle">Note title <span className="optionalFieldText text-gray"> / Optional</span></label>
                            <input ref={(el) => {inputRefs.current["noteTitle"] = el}} type="text" id="noteTitle" className="display-block window text-white margin-top-0 Jw[13rem]" placeholder="Note title" autoComplete="off"/>
                        </div>
                        <div>
                            <label htmlFor="pdfInput" className="flex gap1 flex-direction-column justify-content-center align-items-center padding-top-2 padding-bottom-2 btnHover cursor-pointer">
                                <h2 className="text-gray textLittle fontWeightNormal margin-0">Upload Pdf</h2>
                                <div className="PlusBtn smallPlusBtn btnHover whitePlus bgWindow"></div>
                            </label>
                            <p ref={(el) => {refs.current["pdfName"] = el}} className="text-white textNano margin-0 margin-top-05 Jh[ia16px] text-ellipsis text-noWrap overFlowHidden text-centered"></p>
                        </div>
                        <input ref={(el) => {inputRefs.current["pdfInput"] = el}} accept="application/pdf" type="file" onChange={(e) => {handlePdfFile(e)}} className="display-none" name="pdfInput" id="pdfInput" />
                        <div className="flex justify-content-end">
                            <button className="btn miniBtn btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone"><p className="margin-0">Create</p></button>
                        </div>
                    </>
                )
            }
        }
    }

    function handlePdfFile(e){
        let input = inputRefs.current["pdfInput"];
        let pdfMessage = refs.current["pdfName"];
        let file = input?.files?.[0];

        if(file && file.type.startsWith("application/pdf")){
            pdfMessage.textContent = e.target.value.replace('C:\\fakepath\\',"");
            pdfMessage.classList.remove("text-red");
            pdfMessage.classList.add("text-white");
            pdfFileRef.current = file;
        }
        else{
            pdfMessage.textContent = "file must be a pdf";
            pdfMessage.classList.add("text-red");
            pdfMessage.classList.remove("text-white");
        }
    }

    async function createNewNote(event){
        event.preventDefault();
        let panelAdditionalInfo = JSON.parse(panel.additionalInfo);
        let contentType = document.getElementsByClassName("underlinedBtnToggled")[0].id;
        if(panelAdditionalInfo.type === COLUMN_TYPE_PANEL){
            if(contentType === "document" || (inputRefs.current["noteTitle"].value.trim() !== "" && inputRefs.current["noteText"].value.trim() !== "")){
                let note = structuredClone(NOTE_STRUCTURE);
                note.owner.id = userData.id;
                note.panel.id = panel.id;
                note.title = inputRefs.current["noteTitle"].value.trim() === "" ? null : inputRefs.current["noteTitle"].value;
                note.title = note.title.length > 40 ? note.title.substring(0, 39) : note.title;
                note.bodyText = contentType !== "document" ? inputRefs.current["noteText"].value : null;
                note.contentType = contentType;                
                let columnNote = structuredClone(ARTICLE_STRUCTURE_SAMPLE);
                if(!divRefs.current["columnContainer"]?.classList.contains("grid")) divRefs.current["columnContainer"]?.classList.add("grid");
                columnNote.noteId = await addNote(note, contentType);
                panelAdditionalInfo.columns[currentColumn].articles.push(columnNote);
                noReactivePanel.additionalInfo = JSON.stringify(panelAdditionalInfo);
                setPanel(noReactivePanel);
                noReactivePanel.notes = [];
                noReactivePanel.panelParticipants = [];
                await updatePanel(noReactivePanel);
            }
        }
        if(panelAdditionalInfo.type === CARDS_TYPE_PANEL || panelAdditionalInfo.type === CONNECTED_CARDS_TYPE_PANEL){
            let note = structuredClone(NOTE_STRUCTURE);
            note.owner.id = userData.id;
            note.panel.id = panel.id;
            note.title = inputRefs.current["noteTitle"].value.trim() === "" ? null : inputRefs.current["noteTitle"].value;
            note.bodyText = contentType !== "document" ? inputRefs.current["noteText"].value : null;
            note.contentType = contentType;
            let cardNote = structuredClone(CARD_STRUCTURE_SAMPLE);
            cardNote.noteId = await addNote(note, contentType);
            cardNote.posX = (canvasRef.current?.width / 2) - (320 / 2);
            cardNote.posY = canvasRef.current?.height / 2;
            panelAdditionalInfo.notes.push(cardNote);
            noReactivePanel.additionalInfo = JSON.stringify(panelAdditionalInfo);
            noReactivePanel.panelParticipants = [];
            noReactivePanel.notes = [];
            await updatePanel(noReactivePanel);
        }
    }

    async function deleteNote(noteId, columnId = 0) {
        let panelAdditionalInfo = JSON.parse(noReactivePanel.additionalInfo);
        if(panelAdditionalInfo.type === COLUMN_TYPE_PANEL){
            let columns = panelAdditionalInfo.columns;
            panelAdditionalInfo.columns[columnId].articles = columns[columnId].articles.filter(note => note.noteId !== noteId);
        }
        if(panelAdditionalInfo.type === CARDS_TYPE_PANEL || panelAdditionalInfo.type === CONNECTED_CARDS_TYPE_PANEL){
            panelAdditionalInfo.notes = panelAdditionalInfo.notes.filter((note) => note.noteId !== noteId);
            globalCards = globalCards.filter((card) => parseInt(card.props.id.replaceAll("card","")) !== noteId)
            let cardsContainer = document.getElementById("cardsContainer");
            cardsContainer.removeChild(cardsRef.current[noteId]);
        }
        noReactivePanel.additionalInfo = JSON.stringify(panelAdditionalInfo);
        await deleteNoteDB(noteId);
        noReactivePanel.notes = [];
        noReactivePanel.panelParticipants = [];
        await updatePanel(noReactivePanel, panelAdditionalInfo.type === COLUMN_TYPE_PANEL ? true : false);
    }

    function editNote(noteId){
        editingACard = true;
        let panelType = JSON.parse(panel.additionalInfo).type;
        let HTMLNote = panelType === COLUMN_TYPE_PANEL ? noteRefs.current[noteId] : cardsRef.current[noteId];
        let noteTitle = HTMLNote.getElementsByTagName("h2")[0].textContent;
        let noteText = HTMLNote.getElementsByTagName("p")[0] !== undefined ? HTMLNote.getElementsByTagName("p")[0].textContent : null;
        if(noteText !== null){
            HTMLNote.innerHTML = "";
            HTMLNote.innerHTML =
                "<h2 id='noteTitleEdit' contenteditable class='border-none margin-0 text-black'>"+noteTitle+"</h2>"+
                "<p id='noteTextEdit' contenteditable class='border-none margin-0 textMini text-black'>"+noteText+"</p>";
        }else{
            HTMLNote.getElementsByTagName("h2")[0].contentEditable = true;
            HTMLNote.getElementsByTagName("div")[0].classList.add("display-none");
        } 
        HTMLNote.getElementsByTagName("h2")[0].focus();
        setTimeout(() => {
            document.addEventListener("click", edit);
        },1)
        const edit = (e) => {editInDb(e)}
        async function editInDb(event){
            if(!HTMLNote.contains(event.target)){
                document.removeEventListener("click", edit);
                if((noteTitle.trim() !== HTMLNote.getElementsByTagName("h2")[0].textContent.trim() && noteText === null) || (noteText !== null && (noteTitle.trim() !== document.getElementById("noteTitleEdit").textContent.trim() || noteText.trim() !== document.getElementById("noteTextEdit").textContent.trim()))){
                    let dbNote = await findNoteById(noteId);
                    console.log(document.getElementById("noteTextEdit"), document.getElementById("noteTitleEdit"));
                    dbNote.title = document.getElementById("noteTitleEdit") !== null ? document.getElementById("noteTitleEdit").textContent : HTMLNote.getElementsByTagName("h2")[0].textContent;
                    dbNote.bodyText = document.getElementById("noteTextEdit") !== null ? document.getElementById("noteTextEdit").textContent : null;
                    dbNote.owner = {"id": userData.id};
                    dbNote.panel = {"id": dbNote.panel.id};
                    await editNoteDB(dbNote);
                    console.log(JSON.parse(noReactivePanel.additionalInfo).notes);
                    await updatePanel(noReactivePanel, true);
                    editingACard = false
                }
                else{
                    editingACard = false;
                    if(panelType === COLUMN_TYPE_PANEL) printcolumns();
                    else printCardNotes();
                }
            }
        }
    }

    function editColumn(columnId){
        let hrTitle = columnRefs.current[columnId];
        let contentPreEdit = hrTitle.textContent;
        hrTitle.contentEditable = true;
        hrTitle.classList.add("border-none");
        hrTitle.focus();
        setTimeout(() => {
            document.addEventListener("click", edit);
        }, 1);
        const edit = (e) => {editInDb(e)}
        async function editInDb(event){
            if(event.target !== hrTitle){
                document.removeEventListener("click", edit);
                if(contentPreEdit.trim() !== hrTitle.textContent.trim()){
                    let additionalInfo = JSON.parse(panel.additionalInfo);
                    additionalInfo.columns[columnId].columnTitle = hrTitle.textContent;
                    noReactivePanel.additionalInfo = JSON.stringify(additionalInfo);
                    await updatePanel(noReactivePanel);
                }
            }
        }
    }

    async function printcolumns(){
        setHTMLColumns([]);
        let columns = JSON.parse(panel.additionalInfo).columns;
        let noReactiveHTMLcolumns = [];
        if(columns.length > 0 && !divRefs.current["columnContainer"]?.classList.contains("grid")) divRefs.current["columnContainer"]?.classList.add("grid");
        divRefs.current["columnContainer"]?.classList.add("Jcol["+(columns.length + 1)+",13rem]");
        dynamicClasses();
        let columnIndex = 0;
        for (const column of columns) {
            let HTMLcolumnNotes = [];
            let columnIndexClone = structuredClone(columnIndex);
            if(column.articles.length > 0){
                for (const note of column.articles) {
                    let bdNote = await findNoteById(note.noteId);
                    let userOwner = await getUserById(bdNote.owner.id);
                    HTMLcolumnNotes.push(
                        <div ref={(el) => {noteRefs.current[note.noteId] = el}} key={noteCounter++} className={(bdNote.contentType === "document" ? "aspect-ratio-A4 " : "padding-05 ") +"note bgWhite w100 boxSize-Border positionRelative"} title={"Last edited date: "+bdNote.lastEditedDate.replaceAll("-","/")+" - "+userOwner.nickname}>
                            {(isAdmin || isCreator) &&
                                <div className="noteOptions positionAbsolute gap02 top-0 right-0 bgWindow boxSize-Border padding-02 z-index-1">
                                    <img onClick={() => {editNote(note.noteId)}} title="Edit note" className="iconSize display-block cursor-pointer btnHover padding-01" src="http://localhost:5173/svgs/editPencilIcon.svg" alt="" />
                                    <img onClick={() => {deleteNote(note.noteId, columnIndexClone)}} title="Delete note" className="iconSize display-block cursor-pointer btnHover padding-01" src="http://localhost:5173/svgs/DeleteIcon.svg" alt="" />
                                </div>
                            }
                            {bdNote.contentType === "text" && 
                                <>
                                    <h2 className="margin-0 text-black">{bdNote.title}</h2>
                                    <p className="margin-0 text-black">{bdNote.bodyText}</p>
                                </>
                            }
                            {bdNote.contentType === "document" &&
                                <>
                                    <div className="positionAbsolute top-0 bgWhite w100">
                                        <h2 className="margin-0 border-none textSNormal padding-05 text-ellipsis overFlowHidden text-black text-noWrap" title={bdNote.title}>{bdNote.title}</h2>
                                    </div>
                                    <PdfThumbnail key={noteCounter++} onClick={() => {setHTMLPdfRender(<PdfViewer url={bdNote.resourceUrl}/>); showPopUp("pdfRender")}} url={bdNote.resourceUrl}/>
                                </>
                            }
                        </div>
                    );
                }
            }
            noReactiveHTMLcolumns.push(
                <div key={columnCounter++} className="panelColumn flex flex-direction-column gap1 overFlowHidden bgTransparent willChange">
                    {(isAdmin || isCreator) &&
                        <div className="columnOptions positionAbsolute gap02 top-0 right-0 bgWindow boxSize-Border padding-02">
                            <img onClick={() => {editColumn(columnIndexClone)}} title="Edit column title" className="iconSize display-block cursor-pointer btnHover padding-01" src="http://localhost:5173/svgs/editPencilIcon.svg" alt="" />
                            <img onClick={() => {showColumnDeleteModal(columnIndexClone)}} title="Delete column" className="iconSize display-block cursor-pointer btnHover padding-01" src="http://localhost:5173/svgs/DeleteIcon.svg" alt="" />
                        </div>
                    }
                    <h2 ref={(el) => {columnRefs.current[columnIndexClone] = el}} className="text-white fontWeightNormal margin-0 text-centered w100">{column.columnTitle}</h2>
                    <div className="flex flex-direction-column gap1 overFlowAuto darkscrollBar">
                        {HTMLcolumnNotes}
                        {(isAdmin || isCreator) &&
                            <div onClick={() => {showHideSlider("noteSlider", columnIndexClone)}} className="flex gap1 flex-direction-column justify-content-center align-items-center padding-top-2 padding-bottom-2 btnHover cursor-pointer">
                                <h2 className="text-gray textLittle fontWeightNormal margin-0">Add note</h2>
                                <div className="PlusBtn smallPlusBtn btnHover whitePlus bgWindow"></div>
                            </div>
                        }
                    </div>
                </div>
            );
            columnIndex++;
        }
        setHTMLColumns(
            noReactiveHTMLcolumns
        );
        getPanelContent(noReactiveHTMLcolumns);
    }

    function showHideSlider(sliderId, columnIndex = null){
        if(columnIndex !== null) currentColumn = columnIndex;
        let slider = document.getElementById(sliderId);
        if(!slider.classList.contains("editSliderPanelToggled")){
            slider.classList.remove("display-none");
            setTimeout(() => {
                slider.classList.add("editSliderPanelToggled");
            }, 1);
        }
        else{
            slider.classList.remove("editSliderPanelToggled");
            slider.classList.add("flex");
            setTimeout(() => {
                slider.classList.remove("flex");
                slider.classList.add("display-none");
            }, 400);
        }
    }

    function getPanelBackground(){
        if(panel.backgroundPhoto !== null){
            document.body.style.backgroundImage = `url(`+panel.backgroundPhoto+`)`;
            document.body.style.backgroundSize = "cover";
            isLightImg(panel.backgroundPhoto, (result) => {setInvertTextColors(result)})
        }
        else{
            document.body.classList.add(JSON.parse(panel.additionalInfo).background.cssBackground);
        }
    }

    async function editNoteDB(note) {
        const response = await fetch(BACKEND_PATH+"/Note/Update",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(note)
        })
        const data = await response.json();
        return data;
    }

    async function addNote(note, contentType) {
        if(contentType === "text"){
            const response = await fetch(BACKEND_PATH+"/Note/Create",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(note)
            });
            const data = await response.json();
            if(data > 0) return data;
        }
        if(contentType === "document"){
            let formData = new FormData();
            formData.append("note", JSON.stringify(note));
            formData.append("pdf", pdfFileRef.current)
            const response = await fetch(BACKEND_PATH+"/Note/CreateWithPdf",{
                method: "POST",
                body: formData
            });
            const data = await response.json();
            if(data > 0) return data;
        }
    }

    async function deleteNoteDB(noteId){
        const response = await fetch(BACKEND_PATH+"/Note/Delete/"+noteId,{
            method: "DELETE"
        })
        const data = response.json();
        if(data === true){
            getPanel();
            printcolumns();
        }
    }

    async function findNoteById(noteId) {
        const response = await fetch(BACKEND_PATH+"/Note/findById/"+noteId);
        const note = await response.json();
        return note;
    }

    async function updatePanel(panel, print = true) {
        const response = await fetch(BACKEND_PATH+"/Panel/Update",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(panel)
        })
        const data = await response.json();
        if(data === true){
            await getPanel();
            if(print === true){
                let panelType = JSON.parse(panel.additionalInfo).type;
                if(panelType === COLUMN_TYPE_PANEL){
                    printcolumns();
                }
                else{
                    printCardNotes();
                }
            } 
        } 
    }

    async function getPanelParticipant() {
        noReactivePanel.notes = [];
        noReactivePanel.panelParticipants = [];
        let formData = new FormData();
        formData.append("user", JSON.stringify(userData));
        formData.append("panel", JSON.stringify(noReactivePanel));
        const response = await fetch(BACKEND_PATH+"/PanelParticipant/findByUserAndPanel",{
            method: "POST",
            credentials: "include",
            body: formData
        })
        let preData = await response.text();
        if(preData !== ""){
            const data = JSON.parse(preData);
            if(data){
                setIsCreator(data.isCreator);
                setIsAdmin(data.isAdmin);
            }
        }
        else{
            setIsCreator(false);
            setIsAdmin(false);
        }
    }

    async function getPanel(){
        const response = await fetch(BACKEND_PATH+"/Panel/findById/"+id);
        const data = await response.json();
        noReactivePanel = data;
        setPanel(data);
    }

    async function deletePanel() {
        noReactivePanel.notes = [];
        noReactivePanel.panelParticipants = [];
        const response = await fetch(BACKEND_PATH+"/Panel/Delete",{
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(noReactivePanel)
        });
        const data = await response.json();
        if(data === true) redirect("/Workspace");
    }

}


export default Panel
