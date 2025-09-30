import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useState } from 'react';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
).toString();


function PdfThumbnail(props) {

    let url = props.url === undefined ? null : props.url;
    let onClick = props.onClick === undefined ? null : props.onClick;

    const [thumbnailUrl, setThumbnailUrl] = useState(null);

    useEffect(() => {
        const getThumbnail = async () => {
            if(url !== null){
                const pdf = await pdfjsLib.getDocument({url, range: true}).promise;
                const firtsPage = await pdf.getPage(1);
                const viewport = firtsPage.getViewport({scale: 0.3});

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await firtsPage.render({canvasContext: context, viewport}).promise;

                const imageUrl = canvas.toDataURL('image/webp', 0.8);
                setThumbnailUrl(imageUrl);
            }
        }
        getThumbnail();
    }, [url])

    return (
        <>
            {thumbnailUrl ? 
                <img onClick={onClick} src={thumbnailUrl} alt="" className='display-block w100 cursor-pointer' />
                :
                <div className='aspect-ratio-A4 w100 bgWhite' ></div>
            }
            
        </>
    )
}

export default PdfThumbnail
