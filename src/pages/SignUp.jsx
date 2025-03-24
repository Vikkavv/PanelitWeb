import { useEffect, useRef, useState } from "react";
import parsePhoneNumber from "libphonenumber-js";
import LogoContainer from "../components/LogoContainerComponent";

document.title = "Sign up in Panelit"

document.getElementsByTagName("html")[0].classList = "html100";
document.getElementById("root").classList = "html100";


let registerStep = 0;
let backBtn;
let counter = 0;
let regExpMap;
let errorMap = new Map;

function SignUp() {
    const [newUser, setNewUser] = useState({
        "name":"",
        "lastName":"",
        "nickname":"",
        "email":"",
        "password":"",
        "phoneNumber":null,
        "profilePicture":null,
        "plan_id":1,
        "planExpirationDate":null
    });

    const [formContent, setFormContent] = useState([<h2 key="0"></h2>]);
    const refs = useRef({});

    useEffect(() =>{
        //console.log(parsePhoneNumber("+34 640 79 42 64").isValid());
        regExpMap = createRegExpMap(signUpDialog(newUser, setFormContent, refs));
        document.getElementById("nextBtn").addEventListener("click", nextStep.bind(null, newUser, setNewUser, setFormContent, refs));
        backBtn = document.getElementById("backBtn");
        backBtn.addEventListener("click", previusStep.bind(null, newUser, setNewUser, setFormContent, refs));
    }, [])

    useEffect(() =>{
        checkTitleSize();
    }, [formContent[0].props.children]);

    useEffect(() =>{
        console.log({newUser});
    }, [JSON.stringify(newUser)])

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
                            <a href="/signIn" className="navlink text-decoration-underline padding-1 textNano">Already have an account?, sign in</a>
                            <div className="btn btn-large h-fitContent margin-auto-0 userSelectNone hidden" id="backBtn"><p className="margin-0 text-white text-semiLight">Back</p></div>
                            <div className="btn btn-large btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone" id="nextBtn"><p className="margin-0">Next</p></div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
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
    let regExp = new RegExp(regExpString);
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

function previusStep(newUser, setNewUser, setFormContent, refs){
    for (const input of document.getElementById("signUpForm").querySelectorAll("input")) {
        setNewUser((prev) => {
            prev[input.name] = input.value;
            return prev;
        });
    }
    if(registerStep > 0) registerStep--;
    if(registerStep == 0) backBtn.classList.add("hidden");
    if(registerStep < 3){
        document.getElementById("nextBtn").textContent = "Next";
    }
    signUpDialog(newUser, setFormContent, refs);
}

function nextStep(newUser, setNewUser, setFormContent, refs){
    let hasErrors = false;
    for (const input of document.getElementById("signUpForm").querySelectorAll("input")) {
        if(input.value !== "" && input.value !== " "){
            if(validateField(input)){
                setNewUser((prev) => {
                    prev[input.name] = input.value;
                    return prev;
                });
            }else {
                hasErrors = true;
                refs.current[input.name].textContent = errorMap.get(input.name);
            }
        }else{
            if(input.name.toLowerCase().indexOf("phone") === -1 ){
                let errorLabel = document.getElementById(input.name + `Err`);
                errorLabel.textContent = "Field can not be empty.";
                errorLabel.classList.remove("hidden");
                hasErrors = true;
            }
        }
    }
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
        document.getElementById("signUpForm").submit();
    }
    signUpDialog(newUser, setFormContent, refs);
}


function signUpDialog(newUser, setFormContent, refs){
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
        "Email[superCognizance@example.com]<Use a valid email format>(F)%; What is your email and secret password?, Password[Choose carefully]<Password has to be between 8 to 12 characters long and common letters and symbols>%", 
        "Phone number[Prefix and number]<If you provides a phone number: use a valid format>*; Do you want to add your phone number?"
    ];
    let regExps = [
        "name/!/^[A-Za-zÑñÁÉÍÓÚÇáéíóúçÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖÜäëïöü]{1,}$", 
        "lastName/!/^[A-Za-zÑñÁÉÍÓÚÇáéíóúçÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖÜäëïöü]{1,}$", 
        "nickname/!/^[-A-Za-z0-9ÑñÁÉÍÓÚÇáéíóúçÀÈÌÒÙàèìòùÂÊÎÔÛâêîôûÄËÏÖÜäëïöü_/\\.\|]{6,}$",
        "email/!/^[a-zA-Z0-9._]+@[a-zA-Z]+(([.][a-z]+)*)[.][a-z]{2,}$",
        "password/!/^[-A-Za-z0-9ÑñÇç@_.,]{8,12}$", 
        "phoneNumber/!/^\s*$/¡/[tel]*"
    ];
    if(steps[registerStep].indexOf(", ") !== -1){
        for (let nameLabel of steps[registerStep].split(", ")) {
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
                    <h2 key={counter++} id="checkSize" className="loginTitle text-white margin-top-0 line-height100 text-centered">{splited[1]}</h2>
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
            setFormContent(prev => [...prev, 
            <label key={counter++} className={(smallFont && `smallFontLenguages`) +` labelTitle display-block text-white margin-0-auto margin-bottom-05 w75`} htmlFor={camelCaserizer}>{nameLabel}{isOptional && <span className="optionalFieldText text-gray"> / Optional</span>}</label>, 
            <input key={counter++} type={inputType} className="display-block window text-white w75 margin-0-auto margin-bottom-1" defaultValue={newUser[camelCaserizer]} name={camelCaserizer} id={camelCaserizer} placeholder={placeholder}/>,
            <span key={counter++} ref={(el) => (refs.current[camelCaserizer] = el)} id={camelCaserizer + `Err`} className="errorMessageLabel display-block margin-0-auto w75 btm-1 hidden">{errorMesagge}</span>
            ]);
        }
    }else{
        let nameLabel = steps[registerStep];
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
                <h2 key={counter++} id="checkSize" className="loginTitle text-white margin-top-0 line-height100 text-centered">{splited[1]}</h2>
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
        if(placeholder.indexOf("%") !== -1){
            inputType = nameLabel;
            placeholder = placeholder.replace("%", "");
        }
        let camelCaserizer = nameLabel.toLowerCase();
        if(camelCaserizer.indexOf(" ") !== -1){
            //Changes first letter of the second word into a capital and removes the space between them.
            let splited = camelCaserizer.split(" ");
            camelCaserizer = splited[0] + splited[1].replace(splited[1].charAt(0), splited[1].charAt(0).toUpperCase());
        }
        if(diffetentType) inputType = camelCaserizer;
        errorMap.set(camelCaserizer, errorMesagge);
        setFormContent(prev => [...prev,
            <label key={counter++} className="labelTitle display-block text-white margin-0-auto margin-bottom-05 w75" htmlFor={camelCaserizer}>{nameLabel}{isOptional && <span className="optionalFieldText text-gray"> / Optional</span>}</label>, 
            <input key={counter++} type={inputType} className="display-block window text-white w75 margin-0-auto margin-bottom-1" defaultValue={newUser[camelCaserizer]} name={camelCaserizer} id={camelCaserizer} placeholder={placeholder}/>,
            <span key={counter++} ref={(el) => (refs.current[camelCaserizer] = el)} id={camelCaserizer + `Err`} className="errorMessageLabel display-block margin-0-auto w75 btm-1 hidden">{errorMesagge}</span>
        ]);
    }
    return regExps;
}

function checkTitleSize(){
    let title = document.getElementById("checkSize");
    if (title === null) return;
    const elementHight = title.clientHeight;
    const lineHeight = parseFloat(getComputedStyle(title).lineHeight);

    if(elementHight > lineHeight) title.style.fontSize = "34px";
}

export default SignUp