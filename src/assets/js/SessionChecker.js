export async function cookieSessionChecker(redirect = false){
    let userData = null;
    const response = await fetch("http://localhost:8080/User/signInWithCookie",{
        method: "POST",
        credentials: "include"
    });
    if(response.status === 204){
        if(redirect !== false){
            window.location("/SignIn")
        }else{
            return null;
        }
    }
    else if(response.ok){
        userData = await response.json();
    }
    return userData;
}