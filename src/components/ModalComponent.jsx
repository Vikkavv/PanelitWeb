import { useEffect, useRef, useState } from "react";

function ModalComponent(props) {
    let id = props.id !== undefined ? props.id : "modalPopUp";
    let isMini = props.isMini === "true" ? true : false; 
    let isFullScreen = props.isFullScreen === "true" ? true : false;
    let hasScroll = props.hasScroll === undefined ? true : (props.hasScroll === "true" ? true : false);
    if(isFullScreen) isMini = false;
    const [HTMLContent, setHTMLContent] = useState([]);

    const modalRef = useRef(null);

    useEffect(() => {
        setHTMLContent(props.content !== undefined ? 
            props.content 
            : 
            (
                <div className="positionAbsolute top-0 w100 h100 flex justify-content-center align-items-center z-index-0">
                    <h2 className="text-white">Add HTML content here</h2>
                </div>
            )
        )

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
        <div ref={modalRef} id={id} className="flex w100 h100vh positionFixed top-0 justify-content-center align-items-center display-none z-index-2">
            <div className={(isMini ? "miniPopUpwindow " : "") + `window popUpWindow ${hasScroll ? "overFlowYScroll" : "overFlowYHidden"} darkscrollBar overFlowXHidden` + (isFullScreen ? " fullScreenPopUpwindow" : "")}>
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
        document.getElementById(id).classList.add("display-none");
    }
}

export function hiddePopUp(id){
    document.getElementById(id).classList.add("display-none");
}

export function showPopUp(id){
    document.getElementById(id).classList.remove("display-none");
}

export default ModalComponent
