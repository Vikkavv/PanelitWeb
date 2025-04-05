import { useParams } from "react-router"

function Panel() {

    let { id } = useParams();

    return (
        <>
            <p>{id}</p>
        </>
    )
}

export default Panel
