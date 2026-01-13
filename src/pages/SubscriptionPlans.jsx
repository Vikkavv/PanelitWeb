import { useEffect, useState } from "react"
import LogoContainer from "../components/LogoContainerComponent"
import { dynamicClasses } from "../assets/js/dynamicCssClasses"
import { isMobileDevice, isMobileDeviceAndIsInPortrait } from "../components/NavbarComponent"

function SubscriptionPlans() {

    screen.orientation.addEventListener("change", () => {
        if(isMobileDevice()){
            setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
        }
    });

    const [isMobileInPortrait, setIsMobileInPortrait] = useState(null);
    const [isMobile, setIsMobile] = useState(null);
        window.addEventListener("resize", () => {
        if(!isMobileDevice()) setIsMobile(isMobileDevice());
        if(!isMobileDeviceAndIsInPortrait()) setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
    });

    useEffect(() => {
        document.title = "Subscription plans | Panelit";
        dynamicClasses();
        if(isMobileDevice()){
            document.getElementById("root").classList.add("overFlowXHidden");
        }
        setIsMobile(isMobileDevice());
        setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
    }, [])

    return (
        <>
            <div>
                {!isMobile ? 
                    <div className="flex justify-space-bwt">
                        <LogoContainer isLink="true" url="/" hasPadding="true" paddingClass="padding-08-2-08-2" isRotatable="true"/>
                    </div>
                    : 
                    <div className="positionSticky w-fitContent padding-right-1 top-0 bgWindowOriginal border-radius-0-0-h-0  border-raduis-1em z-index-1">
                        <LogoContainer isLink="true" url="/" hasPadding="true" paddingClass="padding-left-05 padding-top-02" classes="cursor-none margin-bottom-2" isRotatable="true"/>
                    </div>
                }
                <div className={(isMobile ? "container10 positionRelative z-index-0" : "container") + " "}>
                    <a href="/" className={(isMobile ? "cursor-none" : "") + " btn flex justify-content-center align-items-center border-radius-50 padding-1 aspect-ratio-1"}>
                        <div className="w-fitContent aspect-ratio-1">
                            <img className="iconSize display-block margin-0-auto Jw[20px] Jpr[r:2px] aspect-ratio-1" alt="" src="svgs/leftPointingArrowIcon.svg"/>
                        </div>
                    </a>
                    <h1 className="margin-0 margin-top-1 text-white">Let’s find the plan that fits you best!</h1>
                    <p className="margin-0 margin-top-1 text-white text-semiLight">Not every plan fits everyone—and that’s the point! Take a peek and choose the one that feels right for you.</p>
                    <div className={(isMobile ? (isMobileInPortrait ? "col-2 margin-bottom-4" : "col-1 margin-bottom-4") : "col-4 h70vh") + " grid gap2 margin-top-1 padding-bottom-1"}>                
                        
                        <div className="window overFlowHidden padding-0 flex">
                            <div className="flex flex-direction-column gap0 justify-space-bwt w100">
                                <div className="padding-1ch">
                                    <h2 className="text-white text-centered">Basic</h2>
                                    <p className="text-white text-centered textMini text-semiLight padding-bottom-1 Jh[i3.74rem]">Perfect for personal projects, passion ideas, or anything you’re building just for you.</p>
                                    <span className="popUpseparator display-block w75 margin-0-auto"/>
                                </div>
                                <div className="flex flex-direction-column gap1 padding-top-1 padding-bottom-1">
                                    <p className="text-gray textMini text-centered">3<br/><span>Panels</span></p>
                                    <p className="text-gray textMini text-centered">5<br/><span>Collaborators</span><span className="display-block margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per panel</span></p>
                                </div>
                                <div className="planBlue planColoredPart w100 padding-2 flex justify-content-center align-items-center gap3 boxSize-Border">
                                    <div className="flex flex-direction-column gap0 align-items-center">
                                        <div  className="h-fitContent"><span className="text-white text-bold textLittle">Free</span></div>
                                        <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Forever</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="window overFlowHidden padding-0 flex">
                            <div className="flex flex-direction-column gap0 justify-space-bwt w100">
                                <div className="padding-1ch">
                                    <h2 className="text-white text-centered">Enthusiast</h2>
                                    <p className="text-white text-centered textMini text-semiLight padding-bottom-1 Jh[i3.74rem]">Built for creators, doers, and dreamers who want more. This plan gives you the tools to go further</p>
                                    <span className="popUpseparator display-block w75 margin-0-auto"/>
                                </div>
                                <div className="flex flex-direction-column gap1 padding-top-1 padding-bottom-1">
                                    <p className="text-gray textMini text-centered">10<br/><span>Panels</span></p>
                                    <p className="text-gray textMini text-centered">15<br/><span>Collaborators</span><span className="display-block margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per panel</span></p>
                                </div>
                                <div className="planGreen planColoredPart w100 padding-2 flex justify-content-center align-items-center gap3 boxSize-Border">
                                    <div className="flex flex-direction-column gap0 align-items-center">
                                        <div className="h-fitContent"><span className="text-white textLittle text-bold">$ 9.99</span></div>
                                        <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per month</p>
                                    </div>
                                    <div className="flex flex-direction-column gap0 align-items-center">
                                        <div className="h-fitContent"><span className="text-white textLittle text-bold">$ 59.99</span></div>
                                        <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per year</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="window overFlowHidden padding-0 flex">
                            <div className="flex flex-direction-column gap0 justify-space-bwt w100">
                                <div className="padding-1ch">
                                    <h2 className="text-white text-centered">Informer</h2>
                                    <p className="text-white text-centered textMini text-semiLight padding-bottom-1 Jh[i3.74rem]">Made for sharers, storytellers, and thought leaders. You're all about keeping people in the know.</p>
                                    <span className="popUpseparator display-block w75 margin-0-auto"/>
                                </div>
                                <div className="flex flex-direction-column gap1 padding-top-1 padding-bottom-1">
                                    <p className="text-gray textMini text-centered">40<br/><span>Panels</span></p>
                                    <p className="text-gray textMini text-centered">20<br/><span>Collaborators</span><span className="display-block margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per panel</span></p>
                                </div>
                                <div className="planPurple planColoredPart w100 padding-2 flex justify-content-center align-items-center gap3 boxSize-Border">
                                    <div className="flex flex-direction-column gap0 align-items-center">
                                        <div className="h-fitContent"><span className="text-white textLittle text-bold">$ 29.99</span></div>
                                        <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per month</p>
                                    </div>
                                    <div className="flex flex-direction-column gap0 align-items-center">
                                        <div className="h-fitContent"><span className="text-white textLittle text-bold">$ 139.99</span></div>
                                        <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per year</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="window overFlowHidden padding-0 flex">
                            <div className="flex flex-direction-column gap0 justify-space-bwt w100">
                                <div className="padding-1ch">
                                    <h2 className="text-white text-centered">Press</h2>
                                    <p className="text-white text-centered textMini text-semiLight padding-bottom-1 Jh[i3.74rem]">Perfect for bold voices and big stories. This plan gives you the performance to make headlines.</p>
                                    <span className="popUpseparator display-block w75 margin-0-auto"/>
                                </div>
                                <div className="flex flex-direction-column gap1 padding-top-1 padding-bottom-1">
                                    <p className="text-gray textMini text-centered">Unlimited<br/><span>Panels</span></p>
                                    <p className="text-gray textMini text-centered">50<br/><span>Collaborators</span><span className="display-block margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per panel</span></p>
                                </div>
                                <div className="planYellow planColoredPart w100 padding-2 flex justify-content-center align-items-center gap3 boxSize-Border">
                                    <div className="flex flex-direction-column gap0 align-items-center">
                                        <div className="h-fitContent"><span className="text-white textLittle text-bold">$ 69.99</span></div>
                                        <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per month</p>
                                    </div>
                                    <div className="flex flex-direction-column gap0 align-items-center">
                                        <div className="h-fitContent"><span className="text-white textLittle text-bold">$ 359.99</span></div>
                                        <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per year</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

    /*
        <div className="window overFlowHidden padding-0 flex">
                        <div className="flex flex-direction-column gap0 justify-space-bwt w100">
                            <div className="padding-1ch">
                                <h2 className="text-white text-centered">Basic</h2>
                                <p className="text-white text-centered textMini text-semiLight padding-bottom-1 Jh[i3.74rem]">Perfect for personal projects, passion ideas, or anything you’re building just for you.</p>
                                <span className="popUpseparator display-block w75 margin-0-auto"/>
                            </div>
                            <div className="flex flex-direction-column gap1 padding-top-1 padding-bottom-1">
                                <p className="text-gray textMini text-centered">3<br/><span>Panels</span></p>
                                <p className="text-gray textMini text-centered">5<br/><span>Collaborators</span><span className="display-block margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per panel</span></p>
                            </div>
    
                            {plan.monthPrice === 0 && plan.yearPrice === 0 ? 
    
                            <div className={ planColors[plan.name] + "planBlue planColoredPart w100 padding-2 flex justify-content-center align-items-center gap3 boxSize-Border"}>
                                <div className="flex flex-direction-column gap0 align-items-center">
                                    <div onClick={() => {sendNewPlan(plan.id, false)}} className="btn h-fitContent"><span className="text-white textMicro">Free</span></div>
                                    <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Forever</p>
                                    {reactiveUser.plan.id === plan.id &&
                                        <div className="padding-top-05 positionAbsolute btm-1">
                                            <p className="margin-0 text-white text-centered textNano">Your current plan</p>
                                            <p className="margin-0 text-gray text-centered textNano">Never expires</p>
                                        </div>
                                    }
                                </div>
                            </div>
    
                            :
    
                            <div className={ planColors[plan.name] + " planColoredPart w100 padding-2 flex justify-content-center align-items-center gap3 boxSize-Border"}>
                                <div className="flex flex-direction-column gap0 align-items-center">
                                    <div onClick={() => {sendNewPlan(plan.id, true)}} className="btn h-fitContent"><span className="text-white textMicro">$ {plan.monthPrice}</span></div>
                                    <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per month</p>
                                </div>
                                <div className="flex flex-direction-column gap0 align-items-center">
                                    <div onClick={() => {sendNewPlan(plan.id, false)}} className="btn h-fitContent"><span className="text-white textMicro">$ {plan.yearPrice}</span></div>
                                    <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per year</p>
                                </div>
                                {reactiveUser.plan.id === plan.id &&
                                    <div className="padding-top-05 positionAbsolute btm-05">
                                        <p className="margin-0 text-white text-centered textNano">Your current plan</p>
                                        <p className="margin-0 text-gray text-centered textNano">Expires: {reactiveUser.planExpirationDate.replaceAll("T", " ").replaceAll("-", "/")}</p>
                                    </div>
                                }
                            </div>
                            }
                        </div>
                    </div>
    */
}

export default SubscriptionPlans
