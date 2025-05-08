export function isLightImg(urlImagen, callback) {
    const img = new Image();
        img.crossOrigin = "Anonymous";
    
        img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
    
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        let totalBrightness = 0;
        const data = imageData.data;
        const numPixels = data.length / 4;
    
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
            totalBrightness += brightness;
        }
    
        const brilloPromedio = totalBrightness / numPixels;
        callback(brilloPromedio > 128 ? true : false);
        };
    
        img.onerror = () => {
        console.error("Image could not be loaded.");
        };
    
        img.src = urlImagen;
    }
    
    /*isDarkOrLight("https://example.com/imagen.jpg", (resultado) => {
        console.log("La imagen es:", resultado);
    });*/