import { useEffect } from "react"
import Navbar from "../components/NavbarComponent"
import {dynamicClasses} from '../assets/js/dynamicCssClasses.js'

document.title = "Welcome! | Panelit"

function Main() {
    useEffect(() => {
        dynamicClasses();
    }, [])

    return (
        <>
            <Navbar texts="Subscription Plans, Explore, who we are?" paths="/plans, /home, /whoWeAre"/>
            <div className="container text-white">
                <h1 className="header margin-0-auto margin-top-2">Let’s bring order and share knowledge!</h1>
                <div className="margin-top-2">
                    <div className="grid col2-1 gap1 margin-bottom-1">
                        <div className="window padding-1-0-1-2 cardHeight overFlowHidden">
                            <div className="flex justify-space-bwt">
                                <div>
                                    <h3 className="cardTitle margin-0 text-light">Columns</h3>
                                    <p className="cardText margin-0 text-light">Distribute your information or photos in <span className="text-bold"> easy-to-create</span> columns or upload documents as a new column.</p>
                                </div>
                                <img className="Jw[50%] Jpr[b:4rem,l:7px]" src="img/ColumnsLayout.png" alt="Columns Layout Example" />
                                <div className="Jw[3450px] cardGradient"></div>
                            </div>
                        </div>
                        <div className="padding-top-1-25 window">
                            <p className="cardText margin-0 text-light w-fitContent"><span className="cardTitle margin-0 text-light w-fitContent margin-right05 line-height-fitContent">Panelit</span> offers various panels with tools to share your <span className="text-bold">knowledge</span> and <span className="text-bold">creativity</span> with platform users.</p>
                            <p className="cardText margin-0 text-light w-fitContent">We're glad you're here!</p>
                        </div>
                    </div>
                    <div className="grid col1-2 gap1">
                        <div className="window padding-1 cardHeight overFlowHidden">
                            <div className="flex justify-space-bwt">
                                <div>
                                    <h3 className="cardTitle margin-0 text-light">Cards</h3>
                                    <p className="cardText margin-0 text-light">Create cards that you can put <span className="text-bold">anywhere</span>.</p>
                                </div>
                                <img className="Jw[190px] Jpr[b:-30px]" src="img/CardsLayout.png" alt="Cards Layout Example" />
                                <div className="cardText Jw[3250px] cardGradient greenGradient"></div>
                            </div>
                        </div>
                        <div className="window cardHeight padding-1-0-1-2 overFlowHidden">
                            <div className="flex justify-space-bwt">
                                <div>
                                <h3 className="cardTitle margin-0 text-light lenguajeSize">Steps Cards</h3>
                                <p className="cardText margin-0 text-light">Add connected numbered cards that allow you to easily display some sequential <span className="text-bold">step-by-step</span> content.</p>
                                </div>
                                <img className="Jw[50%] Jpr[b:1rem,l:7px]" src="img/StepsLayout.png" alt="Steps Layout Example" />
                                <div className="Jw[4889px] cardGradient purpleGradient"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Main
