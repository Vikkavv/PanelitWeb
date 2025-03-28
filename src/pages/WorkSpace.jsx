import { useEffect } from "react";

document.getElementsByTagName("html")[0].classList = "html100";


function Worksapce() {
    useEffect(() => {
        document.title = "My Workspace | Panelit"
    },[])
    return (
        <>
            <h1>Hola</h1>
        </>
    )
}

export default Worksapce