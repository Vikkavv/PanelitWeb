import { useEffect } from "react"
import { dynamicClasses } from "../assets/js/dynamicCssClasses";

function LoadingComponent(props) {

    let loadingMessage = props.loadingMessage === undefined ? "Loading..." : props.loadingMessage;
    let hidden = props.hidden === undefined ? true : (props.hidden === "true" ? true : false);

    let letterSize = loadingMessage.length > 20 ? " textMicro " : " textLittle ";

    useEffect(() => {
        dynamicClasses();
    });

  return (
    <div className={ hidden === true ? "display-none" : ""  + " LoadingComponent flex gap05 padding-left-1-important padding-right-1-important margin-top-05 margin-right-05 boxSize-border justify-space-bwt align-items-center text-white window float-right Jw[i9rem] Jw[a15rem] Jh[2.5rem]"}>
        <p className={"margin-0" + letterSize + "text-white Jw[a15ch]"}>{loadingMessage}</p>
        <span className="loadingSpinner"></span>
    </div>
  )
}

export default LoadingComponent
