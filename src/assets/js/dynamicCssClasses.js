export function dynamicClasses(){
    for (const docChild of document.querySelectorAll("[class]")) {
        if(docChild.classList.value.indexOf("Jh[") !== -1){
            let className = docChild.classList.value.substring(docChild.classList.value.indexOf("Jh["));
            let value = className.substring(className.indexOf("[") + 1, className.indexOf("]"));
            docChild.classList.remove("Jh["+value+"]");
            docChild.style.height = value;
        }
        if(docChild.classList.value.indexOf("Jw[") !== -1){
            let className = docChild.classList.value.substring(docChild.classList.value.indexOf("Jw["));
            let value = className.substring(className.indexOf("[") + 1, className.indexOf("]"));
            docChild.classList.remove("Jw["+value+"]");
            docChild.style.width = value;
        }
        if(docChild.classList.value.indexOf("Jfs[") !== -1){
            let className = docChild.classList.value.substring(docChild.classList.value.indexOf("Jfs["));
            let value = className.substring(className.indexOf("[") + 1, className.indexOf("]"));
            docChild.classList.remove("Jfs["+value+"]");
            docChild.style.fontSize = value;
        }
        if(docChild.classList.value.indexOf("Jpr[") !== -1 || docChild.classList.value.indexOf("Jpa[") !== -1){
            let className = docChild.classList.value.substring(docChild.classList.value.indexOf("Jpr["));
            let strValues = className.substring(className.indexOf("[") + 1, className.indexOf("]"));
            let values = strValues.split(",");
            if(docChild.classList.value.indexOf("Jpr[") !== -1) docChild.style.position = "relative";
            else docChild.style.position = "absolute";
            docChild.classList.remove("Jpr["+strValues+"]");
            for (const value of values) {
                if(value.charAt(0) == "b") docChild.style.bottom = value.split(":")[1];
                if(value.charAt(0) == "l") docChild.style.left = value.split(":")[1];
                if(value.charAt(0) == "r") docChild.style.right = value.split(":")[1];
                if(value.charAt(0) == "t") docChild.style.top = value.split(":")[1];
            }
        }
    }
}
