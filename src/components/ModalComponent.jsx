import React, { useEffect, useRef, useState } from "react";
import { isMobileDevice, isMobileDeviceAndIsInPortrait } from "./NavbarComponent";

let counter = 0; 

function ModalComponent(props) {
    let id = props.id !== undefined ? props.id : "modalPopUp";
    let isMini = props.isMini === "true" ? true : false; 
    let isFullScreen = props.isFullScreen === "true" ? true : false;
    let hasScroll = props.hasScroll === undefined ? true : (props.hasScroll === "true" ? true : false);
    if(isFullScreen) isMini = false;
    const [HTMLContent, setHTMLContent] = useState([]);

    const modalRef = useRef(null);

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

    useEffect(() => {
        setIsMobile(isMobileDevice());
        setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
    }, []);

    useEffect(() => {
        const showContent = async () => {
            let content = await props.content;
            setHTMLContent(props.content !== undefined ? 
                content 
                : 
                <div key={counter++} className="positionAbsolute top-0 w100 h100 flex justify-content-center align-items-center z-index-0">
                    <h2 className="text-white">Add HTML content here</h2>
                </div>
            )
        }

        showContent();
    }, [props.content])

    useEffect(() => {
        let modalDiv = modalRef.current;
        modalDiv.addEventListener("wheel", (e) => preventZoom(e), {passive: false});
    },[])

    function preventZoom(e){
        if(e.ctrlKey) {
            e.preventDefault();
        }
    }

    return ( 
        <div ref={modalRef} id={id} className="flex w100 h100dvh positionFixed top-0 justify-content-center align-items-center display-none z-index-2">
            <div className={(isMini ? (isMobile ? (isMobileInPortrait ? "miniPopUpwindowMobilePortrait" : "miniPopUpwindowMobile") : "miniPopUpwindow") : "") + ` window popUpWindow ${hasScroll ? "overFlowYScroll" : "overFlowYHidden"} darkscrollBar overFlowXHidden` + (isFullScreen ? " fullScreenPopUpwindow" : "")}>
                <div className="flex justify-content-end z-index-1 positionRelative">
                    <button onClick={hiddePopUp} onWheel={(e) => {preventZoom(e)}} className="PlusBtn whitePlus transparentBtn diagonal medium-size margin-auto-0"/>
                </div>
                {HTMLContent}
            </div>
        </div>
    )

    function hiddePopUp(){
        document.getElementById(id).classList.add("display-none");
    }

    function showPopUp(){
        document.getElementById(id).classList.remove("display-none");
    }
}

export function hiddePopUp(id){
    document.getElementById(id).classList.add("display-none");
}

export function showPopUp(id){
    document.getElementById(id).classList.remove("display-none");
}

export default ModalComponent
