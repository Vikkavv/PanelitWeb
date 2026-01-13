import { useEffect, useState } from "react";
import { useNavigate} from "react-router";
import { cookieSessionChecker } from "../assets/js/SessionChecker.js";
import LogoContainer from "../components/LogoContainerComponent.jsx";
import { dynamicClasses } from "../assets/js/dynamicCssClasses.js";
import UserProfileBtnComponent from "../components/UserProfileBtnComponent.jsx";
import { capitalize } from "../assets/js/normalizeCamelCase";
import { getUserById } from "../components/PanelCardComponent.jsx";
import { UNLIMITED_PANELS } from "./WorkSpace.jsx";
import { BACKEND_PATH } from "../App.jsx";
import { isMobileDevice, isMobileDeviceAndIsInPortrait } from "../components/NavbarComponent.jsx";

let planDescriptions = {
    "basic": "Perfect for personal projects, passion ideas, or anything you’re building just for you.",
    "enthusiast": "Built for creators, doers, and dreamers who want more. This plan gives you the tools to go further",
    "informer": "Made for sharers, storytellers, and thought leaders. You're all about keeping people in the know.",
    "press": "Perfect for bold voices and big stories. This plan gives you the performance to make headlines."
}

let planColors = {
    "basic": "planBlue",
    "enthusiast": "planGreen",
    "informer": "planPurple",
    "press": "planYellow"
}

let counter = 0;

let userData = {};

function UpdatePlan() {
    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

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

    const [reactiveUser, setReactiveUser] = useState(null);
    const [plans, setPlans] = useState(null);
    const [HTMLPlans, setHTMLplans] = useState([]);


    useEffect(() => {
        if(plans !== null){
            createPlanCards();
        }
    }, [plans]);

    useEffect(() => {
        if(reactiveUser !== null){
            getSubscriptionPlans();
        }
    }, [JSON.stringify(reactiveUser)]);

    useEffect(() => {
        const checkSession = async () => {
            const data = await cookieSessionChecker();
            if(data !== null){
                userData = setOnlyRelevantUserValues(userData, data);
                setReactiveUser(data);
            } 
            else redirect("/signIn");
        };
        checkSession();
        document.title = "Update my plan | Panelit";
        dynamicClasses();
        setIsMobile(isMobileDevice());
        setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
        if(isMobileDevice()){
            document.getElementById("root").classList.add("overFlowXHidden");
        }
    },[]);

    return (
    <>
        <div className="body-OverFlowXHidden">
            {!isMobile ? 
                <div className="flex justify-space-bwt">
                    <LogoContainer isLink="true" url="/" hasPadding="true" paddingClass="padding-08-2-08-2" isRotatable="true"/>
                    <div className="flex w-fitContnent aspect-ratio-1 padding-08-2-08-2">
                        <UserProfileBtnComponent userInfo={userData}/>
                    </div>
                </div>
                : 
                <div className="flex justify-space-bwt align-items-start positionSticky top-0 z-index-1 margin-bottom-2">
                    <div className="positionSticky w-fitContent padding-right-1 top-0 bgWindowOriginal border-radius-0-0-h-0  border-raduis-1em z-index-1">
                        <LogoContainer isLink="true" url="/" hasPadding="true" paddingClass="padding-left-05 padding-top-02" classes="cursor-none" isRotatable="true"/>
                    </div>
                    <div className="flex w-fitContnent aspect-ratio-1 padding-right-1 padding-top-05">
                        <UserProfileBtnComponent userInfo={userData} onlyImage={"true"}/>
                    </div>
                </div>
            }
            <div className={(isMobile ? "container10 positionRelative z-index-0" : "container") + " "}>
                <a href="/workspace" className={(isMobile ? "cursor-none" : "") + " btn flex justify-content-center align-items-center border-radius-50 padding-1 aspect-ratio-1 "}>
                    <div className="w-fitContent aspect-ratio-1">
                        <img className="iconSize display-block margin-0-auto Jw[20px] Jpr[r:2px] aspect-ratio-1" alt="" src="svgs/leftPointingArrowIcon.svg"/>
                    </div>
                </a>
                <h1 className="margin-0 margin-top-1 text-white">Let’s find the plan that fits you best!</h1>
                <p className={(isMobile ? "margin-bottom-2" : "") + " margin-0 margin-top-1 text-white text-semiLight"}>Not every plan fits everyone—and that’s the point! Take a peek and choose the one that feels right for you.</p>
                <div className={(isMobile ? (isMobileInPortrait ? "col-2 margin-bottom-4" : "col-1 margin-bottom-4") : "col-4 h70vh") + " grid gap2 margin-top-1 padding-bottom-1"}>                
                    {HTMLPlans}
                </div>
            </div>
        </div>
    </>
    )

    function setOnlyRelevantUserValues(user, data){
        user.id = data.id;
        user.name = data.name;
        user.lastName = data.lastName;
        user.nickname = data.nickname;
        user.phoneNumber = data.phoneNumber;
        user.email = data.email;
        user.password = ""+data.password;
        user.profilePicture = data.profilePicture;
        user.plan = data.plan;
        return user;
    }

    function createPlanCards(){
        setHTMLplans([]);
        for (const plan of plans) {
            setHTMLplans(prev => [...prev,
                <div key={counter++} className="window overFlowHidden padding-0 flex">
                    <div className="flex flex-direction-column gap0 justify-space-bwt w100">
                        <div className="padding-1ch">
                            <h2 className="text-white text-centered">{capitalize(plan.name)}</h2>
                            <p className="text-white text-centered textMini text-semiLight padding-bottom-1 Jh[i3.74rem]">{planDescriptions[plan.name]}</p>
                            <span className="popUpseparator display-block w75 margin-0-auto"/>
                        </div>
                        <div className="flex flex-direction-column gap1 padding-top-1 padding-bottom-1">
                            <p className="text-gray textMini text-centered">{plan.nMaxPanels === UNLIMITED_PANELS ? "Unlimited" : plan.nMaxPanels}<br/><span>Panels</span></p>
                            <p className="text-gray textMini text-centered">{plan.nMaxCollaborators}<br/><span>Collaborators</span><span className="display-block margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per panel</span></p>
                        </div>

                        {plan.monthPrice === 0 && plan.yearPrice === 0 ? 

                        <div className={ planColors[plan.name] + " planColoredPart w100 padding-2 flex justify-content-center align-items-center gap3 boxSize-Border"}>
                            <div className="flex flex-direction-column gap0 align-items-center">
                                <div onClick={() => {sendNewPlan(plan.id, false)}} className={(isMobile ? "cursor-none" : "") + " btn h-fitContent"}><span className="text-white textMicro">Free</span></div>
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
                                <div onClick={() => {sendNewPlan(plan.id, true)}} className={(isMobile ? "cursor-none" : "") + " btn h-fitContent"}><span className="text-white textMicro">$ {plan.monthPrice}</span></div>
                                <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per month</p>
                            </div>
                            <div className="flex flex-direction-column gap0 align-items-center">
                                <div onClick={() => {sendNewPlan(plan.id, false)}} className={(isMobile ? "cursor-none" : "") + " btn h-fitContent"}><span className="text-white textMicro">$ {plan.yearPrice}</span></div>
                                <p className="margin-0 text-gray textMicro text-semiLight text-centered margin-top-05">Per year</p>
                            </div>
                            {reactiveUser.plan.id === plan.id &&
                                <div className="padding-top-05 positionAbsolute btm-05">
                                    <p className="margin-0 text-white text-centered textNano">Your current plan</p>
                                    <p className="margin-0 text-gray text-centered textNano">Expires: {reactiveUser.planExpirationDate.substring(0, reactiveUser.planExpirationDate.length-10).replaceAll("T", " ").replaceAll("-", "/")}</p>
                                </div>
                            }
                        </div>
                        }
                    </div>
                </div>
            ])
        }
    }

    async function sendNewPlan(planId, isMonthly){
        let formData = new FormData();
        userData.plan.id = planId;
        formData.append("user", JSON.stringify(userData));
        formData.append("isMonthly", isMonthly);
        const response = await fetch(BACKEND_PATH+"/User/UpdatePlan",{
            method: "POST",
            credentials: "include",
            body: formData
        })
        const data = await response.json();
        if(data === true){
            setReactiveUser(await getUserById(reactiveUser.id));
        } 
    }

    async function getSubscriptionPlans(){
        const response = await fetch(BACKEND_PATH+"/Plan/findAllNoUsers")
        const data = await response.json();
        setPlans(data);
    }

}

export default UpdatePlan
