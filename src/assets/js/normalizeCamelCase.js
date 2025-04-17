export function normalizeCamelCase(string){
    let normalized = "";
    let upperCaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < string.length; i++) {
        if(upperCaseLetters.includes(string.charAt(i))){
            normalized += " "+string.charAt(i).toLowerCase();
        }
        else normalized += string.charAt(i);
    }
    return normalized;
}

export function capitalize(string){
    return string.substring(0,1).toUpperCase() + string.substring(1);
}