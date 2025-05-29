import { useEffect, useRef, useState } from "react";
import LogoContainer from "../components/LogoContainerComponent";
import { dynamicClasses } from "../assets/js/dynamicCssClasses";
import { cookieSessionChecker } from "../assets/js/SessionChecker";
import { useNavigate } from "react-router";

export const COLUMN_TYPE_PANEL = "columns"; 
export const CARDS_TYPE_PANEL = "cards";
export const CONNECTED_CARDS_TYPE_PANEL = "connectedCards";

export const COLUMNS_PANEL_SAMPLE = {
    "type": COLUMN_TYPE_PANEL,
    "columns": [
        /*
        {
            "columnTitle": "",
            "articles": [
                {
                    "noteId": 0
                }
            ]
        }
        */
    ],
    "background": {
        "hasCssBackground": false,
        "cssBackground": ""
    }
};

export const COLUMN_STRUCTURE_SAMPLE = {
    "columnTitle": "",
    "articles": []
}

export const ARTICLE_STRUCTURE_SAMPLE = {
    "noteId": 0
}

export const CARDS_PANEL_SAMPLE = {
    "type": "", //It depends on the type of card the user select in the panel creation dialog. "cards" for not connected cards and "connectedCards" for the connected ones.
    "notes": [
        /*
        {
            "noteId": 0,
            "posX": 0,
            "posY": 0
        }
        */
        //... Here can be more card objects. The order of this array will be used to know which card is the next to create the connections between a note to another.
    ],
    "background": {
        "hasCssBackground": false,
        "cssBackground": ""
    }
}

export const CARD_STRUCTURE_SAMPLE = {
    "noteId": 0,
    "posX": 0,
    "posY": 0
}

let step = 0;

let panelType = "";

function CreatePanel() {

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

    const refs = useRef([]);
    const inputRefs = useRef([]);
    const imageRefs = useRef([]);
    const [HTMLContentSteps, setHTMLContentSteps] = useState([]);
    const [reactiveUser, setReactiveUser] = useState([]);

    useEffect(() => {
        const checkSession = async () => {
            const data = await cookieSessionChecker();
            if(data !== null){
                setReactiveUser(data);
            } 
            else redirect("/signIn");
        };
        document.body.removeAttribute("style");
        checkSession();
        createHTMLContentSteps();
        document.title = "Create new awsome panel! | Panelit"
        dynamicClasses();
    }, [])

    return (
        <>
            <div>
                <div className="flex justify-space-bwt">
                    <LogoContainer isLink="true" url="/workspace" hasPadding="true" paddingClass="padding-08-2-08-2" isRotatable="true" classes="positionRelative z-index-1"/>
                </div>
                <div className="container ">
                    <a href="/workspace" ref={(el) => {refs.current["workspaceBtn"] = el}} className="btn ArrowBtn flex justify-content-center align-items-center border-radius-50 padding-1 aspect-ratio-1 ">
                        <div className="w-fitContent aspect-ratio-1">
                            <img className="iconSize display-block margin-0-auto aspect-ratio-1" alt="" src="svgs/leftPointingArrowIcon.svg"/>
                        </div>
                    </a>
                    <div onClick={() => {step-- ;createHTMLContentSteps()}} ref={(el) => {refs.current["backStepBtn"] = el}} className="btn ArrowBtn flex justify-content-center align-items-center border-radius-50 padding-1 aspect-ratio-1 display-none">
                        <div className="w-fitContent aspect-ratio-1">
                            <img className="iconSize display-block margin-0-auto aspect-ratio-1" alt="" src="svgs/leftPointingArrowIcon.svg"/>
                        </div>
                    </div>
                    {HTMLContentSteps}
                </div>
            </div>
        </>
    )

    function createHTMLContentSteps(typeSelected = null){
        setHTMLContentSteps([]);
        if(step === 0){
            setHTMLContentSteps(
                <div className="flex align-items-center h70vh">
                    <div className="grid col-3 gap2 h40vh margin-top-1 padding-bottom-1 w100">                
                        <div onClick={() => {step = 1; createHTMLContentSteps(COLUMN_TYPE_PANEL)}} className="window overFlowHidden padding-0 flex creationCard">
                            <div className="flex flex-direction-column gap0 justify-space-bwt w100">
                                <div className="padding-1ch z-index-1 positionRelative">
                                    <h2 className="text-white loginTitle text-centered margin-top-1">Columns</h2>
                                    <p className="text-white text-centered textMini text-semiLight padding-bottom-1 Jh[i3.74rem]">
                                        Easily organize your content into clear, visual columns. Add text or photos, or upload a document as a new column to keep everything structured and easy to read.
                                    </p>
                                </div>
                                <img className="diagonalImgCard z-index-0" src="img/ColumnsLayout.png" alt="" />
                            </div>
                        </div>
                        <div onClick={() => {step = 1; createHTMLContentSteps(CARDS_TYPE_PANEL)}} className="window overFlowHidden padding-0 flex creationCard">
                            <div className="flex flex-direction-column gap0 justify-space-bwt w100">
                                <div className="padding-1ch z-index-1 positionRelative">
                                    <h2 className="text-white loginTitle text-centered margin-top-1">Cards</h2>
                                    <p className="text-white text-centered textMini text-semiLight padding-bottom-1 Jh[i3.74rem]">
                                        Create customizable cards that you can place anywhere on your layout. They're perfect for highlighting key info, adding visuals, or keeping things organized just the way you want.
                                    </p>
                                </div>
                                <img className="diagonalImgCard panelCardImg z-index-0" src="img/CardsLayout.png" alt="" />
                            </div>
                        </div>
                        <div onClick={() => {step = 1; createHTMLContentSteps(CONNECTED_CARDS_TYPE_PANEL)}} className="window overFlowHidden padding-0 flex creationCard">
                            <div className="flex flex-direction-column gap0 justify-space-bwt w100">
                                <div className="padding-1ch positionRelative z-index-1">
                                    <h2 className="text-white loginTitle text-centered margin-top-1">Steps cards</h2>
                                    <p className="text-white text-centered textMini text-semiLight padding-bottom-1 Jh[i3.74rem]">
                                        Add connected numbered cards to organize content in a clear, step-by-step format. Perfect for showing processes, instructions, or any sequence that needs to be followed in order.
                                    </p>
                                </div>
                                <img className="diagonalImgCard panelCardImg z-index-0" src="img/StepsLayout.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
        if(step > 0){
            refs.current["backStepBtn"].classList.remove("display-none");
            refs.current["workspaceBtn"].classList.add("display-none");
        }
        if(step === 0){
            refs.current["backStepBtn"].classList.add("display-none");
            refs.current["workspaceBtn"].classList.remove("display-none");
        }
        if(step === 1){
            panelType = typeSelected;
            setHTMLContentSteps(
                <div className="flex flex-direction-column align-items-center h75vh">
                    <div className="flex flex-direction-column gap2 h100">
                        <h2 className="panelMessageTitle text-white w-fitContent margin-bottom-0">Let’s set things up so everything works right!</h2>
                        <div className="flex flex-direction-column gap2">
                            <div>
                                <label className="labelTitle display-block text-white  margin-bottom-05 w-fitContent" htmlFor="name">Panel name</label>
                                <input ref={(el) => {inputRefs.current["name"] = el}} type="text" id="name" name="name" className="display-block window text-white margin-bottom-1 margin-top-1 Jw[a9vw]" placeholder="Panel name" autoComplete="on"/>
                                <span id="nameErr" className="hidden errorMessageLabel margin-0 display-block Jw[9vw] btm-1">Name can not be empty</span>
                            </div>
                            <div className="flex justify-space-bwt">
                                <div>
                                    <label className="labelTitle display-block text-white  margin-bottom-05 w-fitContent" htmlFor="coverPhoto">
                                        <p className="text-white margin-0 margin-bottom-1">Panel cover photo<span className="optionalFieldText text-gray"> / Optional</span></p>
                                        <img ref={(el) => {imageRefs.current["coverPhoto"] = el}} className="btn userProfilePicture object-fit-cover" src="/img/ImagePlaceHolder.jpg" alt="" />
                                    </label>
                                    <input onChange={() => managePanelPicture("coverPhoto", null)} ref={(el) => {inputRefs.current["coverPhoto"] = el}} type="file" className="hidden positionAbsolute" id="coverPhoto" name="coverPhoto"/>
                                </div>
                                <div>
                                    <label className="labelTitle display-block text-white  margin-bottom-05 w-fitContent" htmlFor="backgroundImage">
                                        <p className="text-white margin-0 margin-bottom-1">Panel background photo<span className="optionalFieldText text-gray"> / Optional</span></p>
                                        <img ref={(el) => {imageRefs.current["backgroundImage"] = el}} className="btn userProfilePicture object-fit-cover" src="/img/ImagePlaceHolder.jpg" alt="" />
                                    </label>
                                    <input onChange={() => managePanelPicture("backgroundImage", null)} ref={(el) => {inputRefs.current["backgroundImage"] = el}} type="file" className="hidden positionAbsolute" id="backgroundImage" name="backgroundImage"/>
                                </div>
                            </div>
                            <div className="flex justify-content-end">
                                <button onClick={checkFields} className="btn btn-large btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone"><p className="margin-0">Create</p></button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    function managePanelPicture(inputName, image = null){
        let input = inputRefs.current[inputName];
        let file = image === null ? input?.files?.[0] : image;

        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();
            reader.onload = () => {
                imageRefs.current[input.name].src = reader.result;
            }
            reader.readAsDataURL(file);
            imageRefs.current[input.name+"File"] = file;
            console.log(imageRefs.current[input.name+"File"]);
        }
        else{
            imageRefs.current[input.name].src = "/svgs/defaultProfileImage.svg";
        }
    }

    function checkFields(){
        if(inputRefs.current["name"].value.trim() !== ""){
            if(!document.getElementById("nameErr").classList.contains("hidden"))
                document.getElementById("nameErr").classList.add("hidden");
            sessionStorage.setItem("previousPath", location.pathname);
            sendData();
        } 
        else document.getElementById("nameErr").classList.remove("hidden");
    }

    async function sendData(){
        let jsonInfo = {};
        if(panelType === COLUMN_TYPE_PANEL) jsonInfo = structuredClone(COLUMNS_PANEL_SAMPLE);
        if(panelType === CARDS_TYPE_PANEL){
            jsonInfo = structuredClone(CARDS_PANEL_SAMPLE);
            jsonInfo.type = CARDS_TYPE_PANEL;
        }
        if(panelType === CONNECTED_CARDS_TYPE_PANEL){
            jsonInfo = structuredClone(CARDS_PANEL_SAMPLE);
            jsonInfo.type = CONNECTED_CARDS_TYPE_PANEL;
        }

        if(imageRefs.current["coverPhotoFile"] === undefined || imageRefs.current["backgroundImageFile"] === undefined){
            jsonInfo.background.hasCssBackground = true;
            let cssBackgrounds = ["bgDiagonalDots", "bgDots", "bgZigZag", "bgCross"];
            let rand = Math.floor(Math.random() * 4);
            jsonInfo.background.cssBackground = cssBackgrounds[rand];
        }

        let formData = new FormData();
        formData.append("name", inputRefs.current["name"].value);
        formData.append("coverPhoto", imageRefs.current["coverPhotoFile"] === undefined ? null : imageRefs.current["coverPhotoFile"]);
        formData.append("backgroundPhoto", imageRefs.current["backgroundImageFile"] === undefined ? null : imageRefs.current["backgroundImageFile"]);
        formData.append("additionalInfoJson", JSON.stringify(jsonInfo));
        const response = await fetch("http://localhost:8080/Panel/Create",{
            method: "POST",
            credentials: "include",
            body: formData
        });
        const data = await response.json();
        if(Number.isInteger(data)) redirect("/Panel/"+data);
    }
}

export default CreatePanel
