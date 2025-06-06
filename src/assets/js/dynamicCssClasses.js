export function dynamicClasses(){
    for (const docChild of document.querySelectorAll("[class]")) {
        if(docChild.classList.value.indexOf("Jh[") !== -1){
            let isMinHeight = false;
            let isMaxHeight = false;
            let className = docChild.classList.value.substring(docChild.classList.value.indexOf("Jh["));
            let value = className.substring(className.indexOf("[") + 1, className.indexOf("]"));
            docChild.classList.remove("Jh["+value+"]");
            if(value.charAt(0) === "i" && value.charAt(1) === "a"){
                isMinHeight = true;
                isMaxHeight = true;
                value = value.replaceAll("ia", "");
            }
            if(value.charAt(0) === "i"){
                isMinHeight = true;
                value = value.replaceAll("i", "");
            }
            if(value.charAt(0) === "a"){
                isMaxHeight = true;
                value = value.replaceAll("a", "");
            }
            if(isMinHeight === true) docChild.style.minHeight = value;
            if(isMaxHeight === true) docChild.style.maxHeight = value;
            if(isMaxHeight === false && isMinHeight === false) docChild.style.height = value;
        }
        if(docChild.classList.value.indexOf("Jw[") !== -1){
            let isMinWidth = false;
            let isMaxWidth = false;
            let className = docChild.classList.value.substring(docChild.classList.value.indexOf("Jw["));
            let value = className.substring(className.indexOf("[") + 1, className.indexOf("]"));
            docChild.classList.remove("Jw["+value+"]");
            if(value.charAt(0) === "i"){
                isMinWidth = true;
                value = value.replaceAll("i", "");
            }
            if(value.charAt(0) === "a"){
                isMaxWidth = true;
                value = value.replaceAll("a", "");
            }
            if(isMinWidth === true) docChild.style.minWidth = value;
            if(isMaxWidth === true) docChild.style.maxWidth = value;
            if(isMaxWidth === false && isMinWidth === false) docChild.style.width = value;
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
        if(docChild.classList.value.indexOf("Jcol[") !== -1){
            let className = docChild.classList.value.substring(docChild.classList.value.indexOf("Jcol["));
            let value = className.substring(className.indexOf("[") + 1, className.indexOf("]"));
            docChild.classList.remove("Jcol["+value+"]");
            if(value.indexOf(",") !== -1){
                value = value.split(",");
            }
            if(Array.isArray(value)){
                docChild.style.gridTemplateColumns = "repeat("+value[0]+","+value[1]+")";
            }
            else docChild.style.gridTemplateColumns = "repeat("+value+", 1fr)";
        }
    }
}
