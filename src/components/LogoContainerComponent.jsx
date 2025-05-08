import PanelitLogoSvg from "./panelItLogoSvgComponent";


function LogoContainer(props) {
    let classes = props.classes === undefined ? "" : props.classes;
    let linkEnabled = props.isLink === "true" ? true : false;
    let url = props.url === undefined ? "/" : props.url;
    let hasPadding = props.hasPadding === "true" ? true : false;
    let paddingClass = props.paddingClass === undefined ? "padding-1" : props.paddingClass ;
    return (
        <>
            {linkEnabled === undefined || linkEnabled !== true ? 
                <div className={hasPadding === true ? "logoContainer text-decoration-none w-fitContent "+classes+" "+paddingClass : "logoContainer text-decoration-none w-fitContent "+classes}>
                    {internalContent(props)}
                </div> 
            :
                <a className={hasPadding === true ? "logoContainer text-decoration-none w-fitContent "+classes+" "+paddingClass : "logoContainer text-decoration-none w-fitContent "+classes} href={url}>
                    {internalContent(props)}
                </a>
            }
        </>
    )
}

function internalContent(params) {
    let hasTitle = params.hasTitle !== "false" ? true : false;
    let isRotatable = params.isRotatable === "true" ? true : false;
    let hasLogoSeparator = params.hasLogoSeparator === "true" ? true : false;
    let logoColor = params.logoColor; 
    if(logoColor === undefined) logoColor = "#f0f0f0";
    return(
        <>
            <div className={isRotatable == true ? "spinningLogo" : ""}>
                <PanelitLogoSvg color={logoColor} />
            </div>
            {hasTitle && <h2 className="logoHeader margin-0 text-white line-height200">Panelit</h2>}
            {hasLogoSeparator && <span className="logoSeparator"/>}
        </>
    );
}

export default LogoContainer