import Navbar from "../components/NavbarComponent"

document.title = "Welcome! | Panelit"

function Main() {
    return (
        <>
            <Navbar texts="Subscription Plans, Explore, who we are?" paths="/plans, /home, /whoWeAre" hiddnLog="false"/>
            <h1>Hola</h1>
            <p>Como estás</p>
        </>
    )
}

export default Main
