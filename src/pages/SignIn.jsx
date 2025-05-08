import { useEffect } from "react";
import LogoContainer from "../components/LogoContainerComponent";
import { useNavigate } from 'react-router';
import { cookieSessionChecker } from "../assets/js/SessionChecker.js";

document.getElementsByTagName("html")[0].classList = "html100";

const EMAIL_REGEXP = "^[a-zA-Z0-9._]+@[a-zA-Z]+(([.][a-z]+)*)[.][a-z]{2,}$";

function SignIn() {
    let errors;
    let wrongValues = {};
    let fieldHasErrors = {};

    const navigate = useNavigate();

    const redirect = (path) => {
        navigate(path);
    };


    useEffect(() => {
        const checkSession = async () => {
            const data = await cookieSessionChecker();
            if(data !== null){
                redirect("/workspace");
            }
        };
        checkSession();
        document.title = "Sign in Panelit"
        document.getElementById("nextBtn").addEventListener("click", checkFields);
        document.addEventListener("keydown", function(event){
            if(event.key === "Enter"){
                event.preventDefault();
                checkFields();
            }
        });
    },[])
    return (
        <>
            <LogoContainer isLink="true" hasPadding="true" paddingClass="padding-08-2-08-2" isRotatable="true" classes="positionRelative z-index-1" />
            <div className="flex positionAbsolute position-l0-t0 w100 h100 z-index-0">
                <div className="window login padding-1 positionRelative">
                    <h1 className="textMini text-gray text-normal margin-0 margin-bottom-1 text-end text-italic">Sign in to Panelit</h1>
                    <form action="" method="post" id="signUpForm" className="w100 h-fitContent">
                        <div>
                            <h2 id="checkSize" className="loginTitle text-white margin-top-0 line-height100 text-centered">Welcome back!</h2>
                            <label className="labelTitle display-block text-white margin-0-auto margin-bottom-05 w75" htmlFor="email">Email</label>
                            <input className="display-block window text-white w75 margin-0-auto margin-bottom-1" id="email" placeholder="superCognizance@example.com" type="email" name="email" autoComplete="on"/>
                            <span id="emailErr" className="hidden errorMessageLabel display-block margin-0-auto w75 btm-1">Use a valid email format.</span>
                            <label className="labelTitle display-block text-white margin-0-auto margin-bottom-05 w75" htmlFor="password">Password</label>
                            <input className="display-block window text-white w75 margin-0-auto margin-bottom-1" id="password" placeholder="Don't let anyone see it" type="password" name="password" autoComplete="off"/>
                            <span id="passwordErr" className="hidden errorMessageLabel display-block margin-0-auto w75 btm-1"></span>
                            <div className="containerCheckbox padding-01 w75 display-block margin-0-auto">
                                <input id="rememberMe" type="checkbox" className="hidden"/>
                                <label htmlFor="rememberMe" className="checkmark cursor-pointer w-fitContent"></label>
                                <label htmlFor="rememberMe" className="textNano text-white w-fitContent fontWeightNormal">Remember me</label>
                            </div>
                        </div>
                        <div className="positionAbsolute btm-05 registerBtnWrapper flex justify-space-bwt">
                            <a href="/signUp" id="variable" className="navlink text-decoration-underline padding-1 textNano">Don't have an account yet?, sign up</a>
                            <div className="btn btn-large btnGradientBluePurple h-fitContent margin-auto-0 userSelectNone" id="nextBtn"><p className="margin-0">Sign in</p></div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )

    async function send(emailInput, passInput, rememberMe = false){
        rememberMe = document.getElementById("rememberMe").checked;
        const formData = new URLSearchParams();
        formData.append(emailInput.name, emailInput.value);
        formData.append(passInput.name, passInput.value);
        formData.append("rememberMe", rememberMe);
        const response = await fetch("http://localhost:8080/User/signIn",{
            method: "POST",
            credentials: "include",
            body: formData
        });
        errors = await response.json();
        if(!JSON.stringify(errors).includes('"errors":null')) createWrongFieldsValuesObjects();
        else redirect("/workspace");
    }

    function createWrongFieldsValuesObjects() {
        for (const fieldName in errors) {
            wrongValues[fieldName] = document.getElementById(fieldName).value;
            fieldHasErrors[fieldName] = true;
        }
        checkFields();
    }

    function checkFields(){
        let hasErrors = false;
        let emailInput = document.getElementById("email");
        let emailErrorSpan = document.getElementById("emailErr");
        let passInput = document.getElementById("password");
        let passErrorSpan = document.getElementById("passwordErr");
        let inputs = [emailInput, passInput];
        for (const input of inputs) {
            let span = document.getElementById(input.name+`Err`);
            if(input.value === "" || input.value === " "){
                span.textContent = "Field can not be empty."
                span.classList.remove("hidden");
                hasErrors = true;
            }
            else{
                if(!span.classList.contains("hidden")){
                    span.classList.add("hidden");
                }
            }
        }
        if(!hasErrors){
            if(emailInput.value !== wrongValues[emailInput.name]) fieldHasErrors[emailInput.name] = false;
            else fieldHasErrors[emailInput.name] = true;
            if(passInput.value !== wrongValues[passInput.name]) fieldHasErrors[passInput.name] = false;
            else fieldHasErrors[passInput.name] = true;
            if(!validateField(emailInput, EMAIL_REGEXP) || fieldHasErrors[emailInput.name]){
                if(fieldHasErrors[emailInput.name]) emailErrorSpan.textContent = errors[emailInput.name];
                if(!validateField(emailInput, EMAIL_REGEXP)) emailErrorSpan.textContent = "Use a valid email format.";
                emailErrorSpan.classList.remove("hidden");
                hasErrors = true;
            }else{
                if(!emailErrorSpan.classList.contains("hidden")) emailErrorSpan.classList.add("hidden");
            }
            if(fieldHasErrors[passInput.name]){
                passErrorSpan.textContent = errors[passInput.name];
                passErrorSpan.classList.remove("hidden");
                hasErrors = true;
            }else{
                if(!passErrorSpan.classList.contains("hidden")) passErrorSpan.classList.add("hidden");
            }
        }
        if(!hasErrors){
            send(emailInput, passInput);
        }
    }
    
    function validateField(input, regExpString){
        let regExp = new RegExp(regExpString);
        return regExp.test(input.value);
    }
}



export default SignIn