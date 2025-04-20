import { useEffect, useState } from "react";

function ModalComponent(props) {
    let id = props.id !== undefined ? props.id : "modalPopUp";
    const [HTMLContent, setHTMLContent] = useState([]);

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

    return ( 
        <div id={id} className="flex w100 h100vh positionFixed top-0 justify-content-center align-items-center display-none">
            <div className="window popUpWindow overFlowYScroll darkscrollBar overFlowXHidden">
                <div className="flex justify-content-end z-index-1 positionRelative">
                    <button onClick={hiddePopUp} className="PlusBtn whitePlus transparentBtn diagonal medium-size margin-auto-0"/>
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
