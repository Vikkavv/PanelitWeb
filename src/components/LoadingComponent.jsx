import { use, useEffect, useLayoutEffect, useRef } from "react"
import { dynamicClasses } from "../assets/js/dynamicCssClasses";

function LoadingComponent(props) {

    let loadingMessage = props.loadingMessage === undefined ? "Loading..." : props.loadingMessage;
    let hidden = props.hidden === undefined ? true : (props.hidden === "true" ? true : false);
    let onlyLoadingIcon = props.onlyLoadingIcon === undefined || props.onlyLoadingIcon === "false" ? false : props.onlyLoadingIcon === "true" ? true : false;
    let loadingIconSize = props.loadingIconSize === undefined ? "1.5rem" : props.loadingIconSize;
    let loadingSpinningIconSize = props.loadingSpinningIconSize === undefined ? ".3rem" : props.loadingSpinningIconSize;
    let hasLoadingText = props.hasLoadingText === undefined ? true : (props.hasLoadingText === "false") ? false : true;
    let floatLeft = props.floatLeft === undefined ? false : (props.floatLeft === "true" ? true : false);

    let letterSize = loadingMessage.length > 20 ? (loadingMessage.length > 25 ? " textNano " : " textMicro ") : " textLittle ";

    const loadingIconRef = useRef(null);

    useEffect(() => {
      dynamicClasses();
    }, []);

    useEffect(() => {
      if(loadingIconRef.current) changeLoadingIconSize();
    }, [""+loadingIconRef.current])

  return (!onlyLoadingIcon 
     ?
      <div className={ (hidden === true ? " display-none " : "")  + (floatLeft ? " float-left margin-left-05 " : " float-right margin-right-05 ") + (hasLoadingText ? " Jw[i9rem] padding-left-1-important padding-right-1-important justify-space-bwt " : " aspect-ratio-1 padding-05 justify-content-center ") + " LoadingComponent window flex  align-items-center gap2 margin-top-05 boxSize-border Jw[a15rem] Jh[2.5rem] text-white"}>
        {hasLoadingText && <p className={"margin-0" + letterSize + "text-white Jw[a15ch]"}>{loadingMessage}</p>}
        <span ref={loadingIconRef} className="loadingSpinner"></span>
      </div>
     : 
      <span ref={loadingIconRef} className={ hidden === true ? "display-none" : "" + " loadingSpinner"}></span>
  )

  function changeLoadingIconSize(){
    let loadingIconElement = loadingIconRef.current;
    loadingIconElement.style.setProperty("--width", loadingIconSize);
    loadingIconElement.style.setProperty("--box-shadow-size", loadingSpinningIconSize);
  }
}

export default LoadingComponent
