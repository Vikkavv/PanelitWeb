import { useEffect, useRef, useState } from "react";
import parsePhoneNumber from "libphonenumber-js";
import LogoContainer from "../components/LogoContainerComponent";
import { useNavigate } from 'react-router';
import { cookieSessionChecker } from "../assets/js/SessionChecker.js";

document.getElementsByTagName("html")[0].classList = "html100";
document.getElementById("root").classList = "html100";

let fieldsWithFeedBackError = {}; //Key of the fields that had feedback errors and a boolean that change to false when fixed.
let userWrongFields = {}; //Key of the fields that have feedback errors and theirs corresponding erroneus values.
let errorData = {}; //object with all the errors occured in back server.
let pagesWithErrors = []; //Numbers of sign up pages that have feed back errors.
let registerStep = 0; //The current step/page of the sign up process.
let backBtn; //Global var to save back button.
let counter = 0; //Icremental counter to assign unique key attribute value in form tags array.
let regExpMap; //Map of: String: name of an user object key, String: regExp applied to that field.
let errorMap = new Map; //Map of: String: name of an user object key, String: error text of that field.
let pageInputs = []; //Array of user object key values grouped in each array pos by how appear in each step of sign up form (Example, if in a step appears two fields, in the array is going to be two names separated by a space).
let newUser = {
    "name":"",
    "lastName":"",
    "nickname":"",
    "email":"",
    "password":"",
    "phoneNumber":null,
    "profilePicture":null,
    "plan":{"id":1},
    "planExpirationDate":null
};

function SignUp() {

    const [formContent, setFormContent] = useState([<h2 key="0"></h2>]);
    const refs = useRef({});

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };

    useEffect(() =>{
        const checkSession = async () => {
            const data = await cookieSessionChecker();
            if(data !== null){
                redirect("/workspace");
            }
        };
        checkSession();

        document.title = "Sign up in Panelit"

        regExpMap = createRegExpMap(signUpDialog(setFormContent, refs));
        document.getElementById("nextBtn").addEventListener("click", nextStep.bind(null, setFormContent, refs, redirect));
        backBtn = document.getElementById("backBtn");
        backBtn.addEventListener("click", previusStep.bind(null, setFormContent, refs));
    }, [])

    useEffect(() =>{
        checkTitleSize();
    }, [formContent[0].props.children]);

    return (
        <>
            <LogoContainer isLink="true" hasPadding="true" paddingClass="padding-08-2-08-2" isRotatable="true" classes="positionRelative z-index-1"/>
            <div className="flex positionAbsolute position-l0-t0 w100 h100 z-index-0">
                <div className="window login padding-1 positionRelative">
                    <h1 className="textMini text-gray text-normal margin-0 margin-bottom-1 text-end text-italic">Sign up in Panelit</h1>
                    <form action="" method="post" id="signUpForm" className="w100 h-fitContent">
                        <div>
                            {formContent}
                        </div>
                        <div className="positionAbsolute btm-05 registerBtnWrapper flex justify-space-bwt">
                            <a href="/signIn" id="variable" className="navlink text-decoration-underline padding-1 textNano">Already have an account?, sign in</a>
                            <div className="btn btn-large h-fitContent margin-auto-0 userSelectNone hidden" id="backBtn"><p className="margin-0 text-white text-semiLight">Back</p></div>
                            <div className="btn btn-large btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone" id="nextBtn"><p className="margin-0">Next</p></div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

async function sendUserInfo(setFormContent, refs, redirect){
    const response = await fetch("http://localhost:8080/User/signUp",{
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser)
    });
    errorData = await response.json();
    if(!JSON.stringify(errorData).includes('"errors":null')) showFeedBackErrors(setFormContent, refs);
    else redirect("/workspace");
}

function showFeedBackErrors(setFormContent, refs){
    document.getElementById("nextBtn").textContent = "Next";
    for (const property in errorData) {
        let completeString = pageInputs.filter((inputName) => inputName.includes(property))[0];
        if(completeString !== undefined){
            pagesWithErrors.push(pageInputs.findIndex((inputNames) => inputNames === completeString));
        }
        userWrongFields[property] = newUser[property];
        fieldsWithFeedBackError[property] = true;
    }
    pagesWithErrors.sort();
    registerStep = pagesWithErrors[0];
    signUpDialog(setFormContent, refs);
}

function validateField(input){
    let regExpString = regExpMap.get(input.name);
    let isValid = true;
    if(regExpString.indexOf("/¡/") !== -1){
        let splited = regExpString.split("/¡/");
        regExpString = splited[0];
        if(splited[1] === "[tel]*"){
            let regExp = new RegExp(splited[0]);
            if(!regExp.test(input.value)){
                let phoneNumber = parsePhoneNumber(input.value);
                if(phoneNumber === undefined || !phoneNumber.isValid()){
                    isValid = false;
                    document.getElementById(input.name + `Err`).classList.remove("hidden");
                }else if(!document.getElementById(input.name + `Err`).classList.contains("hidden")) document.getElementById(input.name + `Err`).classList.add("hidden");
                return isValid;
            }else true;
        }
    }
    let regExp = new RegExp(regExpString)
    if(!regExp.test(input.value)){
        isValid = false;
        document.getElementById(input.name + `Err`).classList.remove("hidden");
    }else if(!document.getElementById(input.name + `Err`).classList.contains("hidden")) document.getElementById(input.name + `Err`).classList.add("hidden");
    return isValid;
}

function createRegExpMap(regExpList){
    let regExpMap = new Map;
    for (const nameAndRegExp of regExpList) {
        let splited = nameAndRegExp.split("/!/");
        regExpMap.set(splited[0], splited[1]);
    }
    return regExpMap;
}

function previusStep(setFormContent, refs){
    for (const input of document.getElementById("signUpForm").querySelectorAll("input")) {
        newUser[input.name] = input.value;
    }
    if(registerStep > 0) registerStep--;
    if(registerStep == 0) backBtn.classList.add("hidden");
    if(registerStep < 3){
        document.getElementById("nextBtn").textContent = "Next";
    }
    signUpDialog(setFormContent, refs);
}

function nextStep(setFormContent, refs, redirect){
    let hasErrors = false;
    let inputNames = "";
    for (const input of document.getElementById("signUpForm").querySelectorAll("input")) {
        if(userWrongFields[input.name] === input.value){
            fieldsWithFeedBackError[input.name] = true;
            refs.current[input.name].textContent = errorData[input.name];
            refs.current[input.name].classList.remove("hidden");
            hasErrors = true;
        }else fieldsWithFeedBackError[input.name] = false;
        inputNames += " "+input.name;
        inputNames = inputNames.trim();
        if(!hasErrors){
            if(input.value !== "" && input.value !== " "){
                if(validateField(input)){
                    newUser[input.name] = input.value;
                }else {
                    hasErrors = true;
                    if(document.getElementById(input.name + `Err`).style.getPropertyValue("line-height") === "255%") document.getElementById(input.name + `Err`).removeAttribute("style");
                    refs.current[input.name].textContent = errorMap.get(input.name);
                    if(refs.current[input.name].classList.contains("hidden")) refs.current[input.name].classList.remove("hidden");
                }
            }else{
                if(input.name.toLowerCase().indexOf("phone") === -1 ){
                    let errorLabel = document.getElementById(input.name + `Err`);
                    errorLabel.textContent = "Field can not be empty.";
                    errorLabel.style.lineHeight = "255%";
                    errorLabel.classList.remove("hidden");
                    hasErrors = true;
                }
            }
        }
    }
    if(!pageInputs.includes(inputNames)) pageInputs.push(inputNames);
    if(hasErrors) return;
    registerStep++;
    if(registerStep > 0) backBtn.classList.remove("hidden");
    if(registerStep < 3){
        document.getElementById("nextBtn").textContent = "Next";
    }
    if(registerStep == 3){
        document.getElementById("nextBtn").textContent = "Send";
    }
    if(registerStep > 3){
        registerStep--;
        sendUserInfo(setFormContent, refs, redirect);
        return;
    }
    signUpDialog(setFormContent, refs);
}


function signUpDialog(setFormContent, refs){
    setFormContent(() => []);
    /**
     * This array has his own sintax to apply into titles, labels and inputs, every label-input pack should be separated with a comma (and one space next),
     * then in each side can be diffent symbols:
     *  text itselfs, its not a symbol but by typing text at the beggining, it will be applied to the name input attribute and in label text (It needs to be typed correctly following english lenguage capital sintax norms), then it will be formatted into camelCase. 
     *  [] All the text between the brackets (that needs to be next to the first text), is going to be applied into placeholder attribute (it's optional, it's no need to type it if you dont want a placeholder text)
     *  * If an Asterisk symbol is typed next to the placeholder bracket, it would mean that input is optional (And if not present, it is mandatory)
     *  % This symbol if present next to the placeholder close bracket means that the type of this input is equal to the given text (Example, Email (to be converted into email) will be taken and covert the input into email one type (Logically, it only works if the text corresponds with one of the existent input types))
     *  ; The text following semicolon (it has to be next to the first text, the placeholder and/or % symbol if present and only on the first label-input pack) is going to be applied to the form text (it is optional, it can be omitted)
     * */
    let steps = [
        "Name[Shamash]<Name can not take special symbols and either numbers.>; What is your name?, Last name[Thot]<Last name can not take special symbols and either numbers.>", 
        "Nickname[Thotsha]<Nickname must be at least 6 characters long: include numbers: and common symbols and letters.>; What is your acronym?", 
        "Email[superCognizance@example.com]<Use a valid email format>(F)%; What is your email and secret password?, Password[Choose carefully]<Password has to be between 8 and 12 characters long and must include common letters and symbols>%", 
        "Phone number[Prefix and number]<If you provide a phone number: use a valid format>*; Do you want to add your phone number?"
    ];
    let regExps = [
        "name/!/^[A-Za-zÑñÁÉÍÓÚÇáéíóúçÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖÜäëïöü]{1,25}$", 
        "lastName/!/^[A-Za-zÑñÁÉÍÓÚÇáéíóúçÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖÜäëïöü]{1,25}$", 
        "nickname/!/^[-A-Za-z0-9ÑñÁÉÍÓÚÇáéíóúçÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖÜäëïöü_/\\.\|]{6,25}$",
        "email/!/^[a-zA-Z0-9._]+@[a-zA-Z]+(([.][a-z]+)*)[.][a-z]{2,}$",
        "password/!/^[-A-Za-z0-9ÑñÇç@_.,]{8,12}$", 
        "phoneNumber/!/^\s*$/¡/[tel]*"
    ];
    if(steps[registerStep].indexOf(", ") !== -1){
        for (let nameLabel of steps[registerStep].split(", ")) {
            createFormInputs(nameLabel, setFormContent, refs);
        }
    }else{
        let nameLabel = steps[registerStep];
        createFormInputs(nameLabel, setFormContent, refs);
    }
    return regExps;
}

function createFormInputs(nameLabel, setFormContent, refs){
    let intputHasFeedBackErrors = false;
    let inputType = "text";
    let diffetentType = false;
    if(nameLabel.indexOf("%") !== -1){
        diffetentType = true;
        nameLabel = nameLabel.replaceAll("%", "");
    }
    let isOptional = false;
    if(nameLabel.indexOf("*") !== -1){
        isOptional = true;
        nameLabel = nameLabel.replaceAll("*", "");
    }
    let placeholder = "";
    if(nameLabel.indexOf("; ") !== -1){
        let splited = nameLabel.split("; ");
        nameLabel = splited[0];
        setFormContent(prev => [...prev,
            <h2 key={counter++} data-page_number={registerStep} id="checkSize" className="loginTitle text-white margin-top-0 line-height100 text-centered">{splited[1]}</h2>
        ]);
    }
    let errorMesagge = "";
    if(nameLabel.indexOf("<") !== -1){
        let splited = nameLabel.split("<");
        nameLabel = splited[0];
        errorMesagge = splited[1].replace(">", "").replaceAll(":", ",");
    }
    let smallFont = false;
    if(errorMesagge.indexOf("(F)") !== -1){
        smallFont = true;
        errorMesagge = errorMesagge.replace("(F)", "");
    }
    if(nameLabel.indexOf("[") !== -1){
        let splited = nameLabel.split("[");
        nameLabel = splited[0];
        placeholder = splited[1].replace("]","");
    }
    let camelCaserizer = nameLabel.toLowerCase();
    if(camelCaserizer.indexOf(" ") !== -1){
        let splited = camelCaserizer.split(" ");
        //Changes first letter of the second word into a capital and removes the space between them.
        camelCaserizer = splited[0] + splited[1].replace(splited[1].charAt(0), splited[1].charAt(0).toUpperCase());
    }
    if(diffetentType) inputType = camelCaserizer;
    errorMap.set(camelCaserizer, errorMesagge);
    if(Object.keys(errorData).includes(camelCaserizer) && fieldsWithFeedBackError[camelCaserizer] === true){
        intputHasFeedBackErrors = true;
    }else intputHasFeedBackErrors = false;
    if(intputHasFeedBackErrors){
        errorMesagge = errorData[camelCaserizer];
    }
    setFormContent(prev => [...prev, 
    <label key={counter++} data-page_number={registerStep} className={(smallFont && `smallFontLenguages`) +` labelTitle display-block text-white margin-0-auto margin-bottom-05 w75`} htmlFor={camelCaserizer}>{nameLabel}{isOptional && <span className="optionalFieldText text-gray"> / Optional</span>}</label>, 
    <input key={counter++} data-page_number={registerStep} type={inputType} className="display-block window text-white w75 margin-0-auto margin-bottom-1" defaultValue={newUser[camelCaserizer]} name={camelCaserizer} id={camelCaserizer} placeholder={placeholder}/>,
    <span key={counter++} data-page_number={registerStep} ref={(el) => (refs.current[camelCaserizer] = el)} id={camelCaserizer + `Err`} className={`${!intputHasFeedBackErrors ? "hidden" : ""} errorMessageLabel display-block margin-0-auto w75 btm-1`}>{errorMesagge}</span>
    ]);
}

function checkTitleSize(){
    let title = document.getElementById("checkSize");
    if (title === null) return;
    const elementHight = title.clientHeight;
    const lineHeight = parseFloat(getComputedStyle(title).lineHeight);

    if(elementHight > lineHeight) title.style.fontSize = "34px";
}

export default SignUp