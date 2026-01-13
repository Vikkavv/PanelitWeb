import { useEffect, useRef, useState } from "react"
import { cookieSessionChecker } from "../assets/js/SessionChecker";
import { useNavigate } from "react-router";
import { dynamicClasses } from "../assets/js/dynamicCssClasses";
import LogoContainer from "../components/LogoContainerComponent";
import parsePhoneNumber from "libphonenumber-js";
import { capitalize, normalizeCamelCase } from "../assets/js/normalizeCamelCase";
import { BACKEND_PATH } from "../App";
import LoadingComponent from "../components/LoadingComponent";
import { isMobileDevice, isMobileDeviceAndIsInPortrait } from "../components/NavbarComponent";

let regExps = {
    "name":     "^[A-Za-zÑñÁÉÍÓÚÇáéíóúçÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖÜäëïöü]{1,25}$", 
    "lastName": "^[A-Za-zÑñÁÉÍÓÚÇáéíóúçÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖÜäëïöü]{1,25}$", 
    "nickname": "^[-A-Za-z0-9ÑñÁÉÍÓÚÇáéíóúçÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖÜäëïöü_/\\.\|]{6,25}$",
    "email":    "^[a-zA-Z0-9._]+@[a-zA-Z]+(([.][a-z]+)*)[.][a-z]{2,}$",
    "password": "^[-A-Za-z0-9ÑñÇç@_.,]{8,12}$"
};

let errMessages = {
    "name":     "Name can not take special symbols and either numbers.", 
    "lastName": "Last name can not take special symbols and either numbers.", 
    "nickname": "Nickname must be at least 6 characters long, include numbers, and common symbols and letters.",
    "email":    "Use a valid email format.",
    "password": "Password has to be between 8 and 12 characters long and must include common letters and symbols.",
    "phoneNumber": "Use a valid phone number format."
};

let editUser = {
    "id": 0,
    "name":"",
    "lastName":"",
    "nickname":"",
    "email":"",
    "password":"",
    "phoneNumber":null,
    "profilePicture":null,
    "plan":null,
    "planExpirationDate":null
};

let sendUser = structuredClone(editUser);
let formHasErrors = false;

function EditUserProfile() {
    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

    const imageFileRef = useRef(null);
    const imageRef = useRef();
    const refs= useRef({});
    const timeouRefs = useRef({});

    const [reactiveUser, setReactiveUser] = useState({});
    const [loadingBools, setLoadingBools] = useState([]);

    const [isMobileInPortrait, setIsMobileInPortrait] = useState(null);
    const [isMobile, setIsMobile] = useState(null);
    window.addEventListener("resize", () => {
        if(!isMobileDevice()) setIsMobile(isMobileDevice());
        if(!isMobileDeviceAndIsInPortrait()) setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
    });

    screen.orientation.addEventListener("change", () => {
        if(isMobileDevice()){
            setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
        }
    });

    useEffect(() => {
        const checkSession = async () => {
            const data = await cookieSessionChecker();
            if(data !== null){
                setReactiveUser(data);
                editUser = setOnlyRelevantUserValues(sendUser, data);
                sendUser = setOnlyRelevantUserValues(sendUser, data);
                sendUser.profilePicture = null;
            } 
            else redirect("/signIn");
        };
        checkSession();
        document.title = "Edit my profile | Panelit"
        document.getElementById("noBg").addEventListener("dragenter", disableDragStyles);
        setIsMobile(isMobileDevice());
        setIsMobileInPortrait(isMobileDeviceAndIsInPortrait());
    },[]);

    useEffect(() => {
        if(isMobile !== null && isMobileInPortrait !== null) dynamicClasses();
    }, [isMobile, isMobileInPortrait])

    function showOrHideLoadingComponent(id, showOrHide){
        let stringBool = showOrHide === "h" ? "true" : "false";
        setLoadingBools(prev => ({
            ...prev,
            [id]: stringBool
        }));
    }

    return (
        <>
            <div id="noBg"> 
                <LogoContainer isLink="true" url="/workspace" hasPadding="true" paddingClass={(isMobile ? "padding-top-02 padding-left-05 cursor-none" : "padding-08-2-08-2") + ""} isRotatable="true"/>
                <div className={(isMobile ? "margin-top-1 container5" : "flex-direction-column") + " flex align-items-center"}>
                    <div className={(isMobile ? "w100" : "") + ""}>
                    <h1 className={(isMobile ? "textH2" : "") + " text-white margin-0 margin-bottom-1 text-semiLight"}>Edit profile</h1>
                    <div className={(isMobile ? "flex-direction-column gap0" : "margin-top-2 gap5") + " flex"}>
                        <label ref={(el) => {refs.current["imageLabel"] = el}} onClick={(e) => {if(isMobileDevice()){e.preventDefault(); refs.current['profilePicture'].dispatchEvent(new MouseEvent("click", {bubbles: true}))}}} onDrop={(e) => handleImageDrop(e)} onDragOver={(e) => e.preventDefault()} onDragEnter={activeDragStyles} onDragExit={disableDragStyles} htmlFor="profilePicture" className={(isMobile ? "flex gap1 align-items-center w-fitContent" : "") + " profilePicture h-fitContent positionRelative"}>
                            <p className="margin-0 w100 text-centered dragText Jpa[t:4.5rem] text-white">Drop image here</p>
                            <div className="w100 aspect-ratio-1 dragPlus justify-content-center align-items-center">
                                <div className="PlusBtn whitePlus bgTransparent"></div>
                            </div>
                            <img ref={imageRef} className={(isMobile ? "mobileEditProfilePicture padding-02 btnNotHoverNotGradient shadowBtnBorder1px cursor-none" : "padding-05") + " btn userProfilePicture object-fit-cover overFlowHidden cursor-pointer circular"} src={reactiveUser.profilePicture !== undefined && reactiveUser.profilePicture !== null && reactiveUser.profilePicture !== "" ? reactiveUser.profilePicture : `/svgs/defaultProfileImage.svg`} alt="" />
                            {!isMobile ?
                                <div className="btn w-fitContent margin-0-auto margin-top-1"><p className="margin-0 textMicro text-white text-semiLight">Change profile image</p></div>
                                :
                                <button role="button" onClick={(e) => {e.stopPropagation(); e.preventDefault();refs.current['profilePicture'].dispatchEvent(new MouseEvent("click", {bubbles: true}))}} className="padding-03 padding-left-05 padding-right-05-important btn w-fitContent margin-0-auto cursor-none"><p className="margin-0 textMicro text-white text-semiLight">Change profile image</p></button>
                            }
                        </label>
                        <input ref={(el) => (refs.current["profilePicture"] = el)} type="file" onChange={() => manageProfilePicture(null)} className="hidden positionAbsolute" name="profilePicture" id="profilePicture" />
                        <div>
                            <div className="flex flex-direction-column justify-content-center">
                                <form action="" className="flex flex-direction-column">
                                    <div className={(isMobile ? (isMobileInPortrait ? "gap1" : "flex-direction-column") : "gap3") + " flex margin-top-2"}>
                                        <div className={(isMobileInPortrait ? "w50" : "") + ""}>
                                            <label className="labelTitle display-block text-white margin-bottom-05 " htmlFor="name">Name</label>
                                            <input onInput={(e) => checkField(e)} className={(isMobile ? "w100 boxSize-Border" : "Jw[10vw]") + " display-block window text-white margin-bottom-1"} id="name" defaultValue={reactiveUser.name} placeholder="Your name" type="text" name="name" autoComplete="off"/>
                                            <span id="nameErr" className={(isMobile ? "btm-05" : "Jw[10vw] btm-1") + " hidden errorMessageLabel margin-0 display-block"}>Name can not take special symbols and either numbers.</span>
                                        </div>
                                        <div className={(isMobileInPortrait ? "w50" : "") + ""}>
                                            <label className="labelTitle display-block text-white margin-bottom-05 " htmlFor="nickname">Nickname</label>
                                            <input onInput={(e) => checkField(e)} className={(isMobile ? "w100 boxSize-Border" : "Jw[10vw]") + " display-block window text-white margin-bottom-1"} id="nickname" defaultValue={reactiveUser.nickname} placeholder="Your nickname" type="text" name="nickname" autoComplete="on"/>
                                            <span id="nicknameErr" className={(isMobile ? "btm-05" : "btm-1 Jw[10vw] Jh[i5rem]") + " hidden errorMessageLabel margin-0 display-block"}>Nickname must be at least 6 characters long, include numbers, and common symbols and letters.</span>
                                        </div>
                                    </div>
                                    <div className={(isMobile ? (isMobileInPortrait ? "gap1" : "flex-direction-column") : "gap3") + " flex"}>
                                        <div className={(isMobileInPortrait ? "w50" : "") + ""}>
                                            <label className="labelTitle display-block text-white margin-bottom-05 " htmlFor="lastName">Last name</label>
                                            <input onInput={(e) => checkField(e)} className={(isMobile ? "w100 boxSize-Border" : "Jw[10vw]") + " display-block window text-white margin-bottom-1"} id="lastName" defaultValue={reactiveUser.lastName} placeholder="Your last name" type="text" name="lastName" autoComplete="off"/>
                                            <span id="lastNameErr" className={(isMobile ? "btm-05" : "btm-1 Jw[10vw] Jh[i3.4rem]") + " hidden errorMessageLabel margin-0 display-block"}>Last name can not take special symbols and either numbers.</span>
                                        </div>
                                        <div className={(isMobileInPortrait ? "w50" : "") + ""}>
                                            <label className="labelTitle display-block text-white margin-bottom-05 " htmlFor="phoneNumber">Phone number<span className="optionalFieldText text-gray"> / Optional</span></label>
                                            <input ref={(el) => (refs.current["phoneNumber"] = el)} onInput={(e) => checkField(e)} className={(isMobile ? "w100 boxSize-Border" : "Jw[10vw]") + " display-block window text-white margin-bottom-1"} id="phoneNumber" defaultValue={reactiveUser.phoneNumber} placeholder="Your phone number" type="text" name="phoneNumber" autoComplete="on"/>
                                            <span id="phoneNumberErr" className={(isMobile ? "btm-05" : "Jw[10vw] btm-1") + " hidden errorMessageLabel margin-0 display-block"}>Use a valid phone number format.</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className={(isMobile ? (isMobileInPortrait ? "positionRelative w100 boxSize-Border margin-bottom-2" : "w100 boxSize-Border margin-bottom-2") : "w-fitContent") + " "}>
                                <label className="labelTitle display-block text-white margin-bottom-05 " htmlFor="email">Email</label>
                                <input onInput={(e) => checkField(e)} className={(isMobile ? (isMobileInPortrait ? "w50Minus05 boxSize-Border willChange" : "w100 boxSize-Border willChange") : "Jw[15vw]") + " display-block window text-white margin-bottom-1"} id="email" defaultValue={reactiveUser.email} placeholder="Your email" type="email" name="email" autoComplete="on"/>
                                <span id="emailErr" className={(isMobile ? "btm-05" : "Jw[15vw] btm-1") + " hidden errorMessageLabel margin-0 display-block"}>Use a valid email format.</span>
                                {!isMobileInPortrait ?
                                    <>
                                        <label className="labelTitle display-block text-white margin-bottom-05 " htmlFor="password">New Password<span className="optionalFieldText text-gray"> / Optional</span></label>
                                        <input ref={(el) => (refs.current["password"]) = el} onInput={(e) => checkField(e)} className={(isMobile ? "w100 boxSize-Border willChange" : "Jw[15vw]") + " display-block window text-white margin-bottom-1"} id="password" placeholder="Your new password" type="password" name="password" autoComplete="off"/>
                                        <span id="passwordErr" className={(isMobile ? "btm-05" : "Jw[16vw] Jh[i2rem] btm-1 margin-bottom-N1") + " hidden errorMessageLabel margin-0 textNano display-block"}>Password has to be between 8 and 12 characters long and must include common letters and symbols.</span>
                                        <label className={"labelTitle display-block text-white margin-bottom-05 "} htmlFor="newpassword">Repeat new password<span className="optionalFieldText text-gray"> / Optional</span></label>
                                        <input onInput={(e) => isPasswordSame(e)} className={(isMobile ? "w100 boxSize-Border willChange" : "Jw[15vw]") + " display-block window text-white margin-bottom-1"} id="newpassword" placeholder="Your new password" type="password" name="newpassword" autoComplete="off"/>
                                        <span id="newpasswordErr" className={(isMobile ? "btm-05" : "Jw[15vw] btm-1") + " hidden errorMessageLabel margin-0 display-block"}>Passwords do not match.</span>
                                    </>
                                    :
                                    <div className="flex gap1 padding-bottom-2">
                                        <div className="w50">
                                            <label className="labelTitle display-block text-white margin-bottom-05 " htmlFor="password">New Password<span className="optionalFieldText text-gray"> / Optional</span></label>
                                            <input ref={(el) => (refs.current["password"]) = el} onInput={(e) => checkField(e)} className={(isMobile ? "w100 boxSize-Border willChange" : "Jw[15vw]") + " display-block window text-white margin-bottom-1"} id="password" placeholder="Your new password" type="password" name="password" autoComplete="off"/>
                                            <span id="passwordErr" className={(isMobile ? "btm-05" : "Jw[16vw] Jh[i2rem] btm-1 margin-bottom-N1") + " hidden errorMessageLabel margin-0 textNano display-block"}>Password has to be between 8 and 12 characters long and must include common letters and symbols.</span>
                                        </div>
                                        <div className="w50">
                                            <label className={"labelTitle display-block text-white margin-bottom-05 "} htmlFor="newpassword">Repeat new password<span className="optionalFieldText text-gray"> / Optional</span></label>
                                            <input onInput={(e) => isPasswordSame(e)} className={(isMobile ? "w100 boxSize-Border willChange" : "Jw[15vw]") + " display-block window text-white margin-bottom-1"} id="newpassword" placeholder="Your new password" type="password" name="newpassword" autoComplete="off"/>
                                            <span id="newpasswordErr" className={(isMobile ? "btm-05" : "Jw[15vw] btm-1") + " hidden errorMessageLabel margin-0 display-block"}>Passwords do not match.</span>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div className={(isMobile ? "gap05 positionFixed btm-0 right-0 padding-right-1 padding-left-05 padding-bottom-05 padding-top-05 border-raduis-1em overFlowHidden border-radius-h-0-0-0 bgWindowOriginal" : "gap2 margin-bottom-1") + " flex justify-content-end"}>
                                <a href="/workspace" className={(isMobile ? "cursor-none" : "") + " btn btn-large text-decoration-none h-fitContent margin-auto-0 userSelectNone"} id="backBtn"><p className="margin-0 text-white text-semiLight">Cancel</p></a>
                                <button onClick={sendUserToUpdate} className={(isMobile ? "cursor-none" : "") + " btn btn-large positionRelative btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone"} id="nextBtn">
                                    <p className="margin-0">Save</p>
                                    <div className={ (loadingBools['signInLoading'] === undefined || loadingBools['signInLoading'] === "true" ? " display-none " : "") + "flex justify-content-center align-items-center Jh[2.684rem] w100 positionAbsolute left-0 top-0"}>
                                        <LoadingComponent hidden="false" loadingIconSize=".75rem" loadingSpinningIconSize=".17rem" onlyLoadingIcon="true"/>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
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
        return user;
    }

    async function sendUserToUpdate(){
        let btn = document.getElementById("nextBtn");
        btn.children[0].classList.add("hidden");
        showOrHideLoadingComponent("signInLoading", "s");
        if(!formHasErrors){
            const formData = new FormData();
            formData.append("user", JSON.stringify(sendUser));
            formData.append("image", imageFileRef.current);

            const response = await fetch(BACKEND_PATH+"/User/editProfile",{
                method: "POST",
                credentials: "include",
                body: formData
            });

            const data = await response.json();
            if(data === true) redirect("/workspace");
        }
    }

    function activeDragStyles(e){
        e.preventDefault();
        refs.current["imageLabel"].classList.add("drag");
    }

    function disableDragStyles(e){
        e.preventDefault();
        refs.current["imageLabel"].classList.remove("drag");
    }

    function handleImageDrop(event){
        event.preventDefault();
        let image = event.dataTransfer.files[0];
        refs.current["imageLabel"].classList.remove("drag");
        manageProfilePicture(image);
    }

    function manageProfilePicture(image = null){
        let input = refs.current["profilePicture"];
        let file = image === null ? input?.files?.[0] : image;

        if(file && file.type.startsWith("image/")){
            const reader = new FileReader();
            reader.onload = () => {
                imageRef.current.src = reader.result;
            }
            reader.readAsDataURL(file);
            imageFileRef.current = file;
        }
        else{
            imageRef.current.src = "/svgs/defaultProfileImage.svg";
        }
    }

    function isPasswordSame(event, opInput = null, wait = true){
        let input = opInput !== null ? opInput : event.target;
        if(wait) timeouRefs.current[input.name] = setTimeout(check, 600);
        else check();
        function check(){
            let isValid = true;
            let passInputName = input.name.replaceAll("new", "");
            if(input.value === document.getElementById(passInputName).value){
                sendUser.password = input.value;
                formHasErrors = false;
            }
            else{
                isValid = false;
                formHasErrors = true;
            }
            if(isValid)
                document.getElementById(input.name + `Err`).classList.add("hidden")
            else
                document.getElementById(input.name + `Err`).classList.remove("hidden");
        }
    }

    function checkField(event){
        let input = event.target;
        if(timeouRefs.current[input.name]){
            clearTimeout(timeouRefs.current[input.name]);
        }

        if(input.value === ""){
            if(input.name === "phoneNumber"){
                input.placeholder = "No phone number";
            }else if(input.name !== "password"){
                let fieldNameNormalized = normalizeCamelCase(input.name);
                let fieldNameCapitalized = capitalize(fieldNameNormalized);
                document.getElementById(input.name + `Err`).textContent = fieldNameCapitalized + " can not be empty.";
            }
        }
        else{ 
            document.getElementById(input.name + `Err`).textContent = errMessages[input.name];
        }

        timeouRefs.current[input.name] = setTimeout(async () => {
            let isValid = true;
            if(input.name === "phoneNumber"){
                if(input.value !== ""){
                    let phoneNumber = parsePhoneNumber(input.value);
                    if(phoneNumber === undefined || !phoneNumber.isValid()) isValid = false;
                    if(isValid === true && phoneNumber === parsePhoneNumber(reactiveUser.phoneNumber)){
                        isValid = await checkFieldFeedBackErrors(input);
                        if(isValid) document.getElementById(input.name + `Err`).textContent = errMessages[input.name];
                    }
                }
            }else{
                let regExpStr = regExps[input.name];
                let regExp = new RegExp(regExpStr);
                if(regExp.test(input.value) === false) isValid = false;
                if(input.name === "nickname" && isValid === true){
                    isValid = await checkFieldFeedBackErrors(input);
                    if(isValid) document.getElementById(input.name + `Err`).textContent = errMessages[input.name];
                }
                if(input.name === "email" && isValid == true){
                    isValid = await checkFieldFeedBackErrors(input);
                    if(isValid) document.getElementById(input.name + `Err`).textContent = errMessages[input.name];
                }
            }
            if(input.name === "password"){
                if(document.getElementById(`new`+input.name).value !== "")
                    isPasswordSame(null, document.getElementById(`new`+input.name), false);
                if(input.value === ""){
                    isValid = true;
                }
            }
            if(!isValid){
                document.getElementById(input.name + `Err`).classList.remove("hidden");
                formHasErrors = true;
            }
            else{
                formHasErrors = false;
                document.getElementById(input.name + `Err`).classList.add("hidden");
                sendUser[input.name] = input.value;
                if(input.name === "phoneNumber" && input.value === "") sendUser[input.name] = null;
            } 
        }, 600)
    }

    async function checkFieldFeedBackErrors(input) {
        if(input.value.replaceAll(" ","") !== editUser[input.name].replaceAll(" ","")){
            let errSpan = document.getElementById(input.name + `Err`);
            const data = await isUniqueFieldUsed(input);
            if(data === true){
                let fieldNameCapitalized = input.name.charAt(0).toUpperCase() + input.name.substring(1);
                errSpan.textContent = fieldNameCapitalized + " is already in use."
            }
            return !data;
        }
        return true;
    }

    async function isUniqueFieldUsed(input) {
        let fieldNameCapitalized = input.name.charAt(0).toUpperCase() + input.name.substring(1);
        const response = await fetch(BACKEND_PATH+"/User/existsUserWith"+ fieldNameCapitalized +"/" + input.value);
        const data = await response.json();
        return data;
    }
}

export default EditUserProfile
