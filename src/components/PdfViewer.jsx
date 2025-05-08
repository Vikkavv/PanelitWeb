import * as pdfjsLib from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';
import { PDFViewer, EventBus, PDFLinkService } from 'pdfjs-dist/web/pdf_viewer.mjs';
import 'pdfjs-dist/web/pdf_viewer.css';
import { dynamicClasses } from '../assets/js/dynamicCssClasses';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.mjs',
    import.meta.url
).toString();


function PdfViewer(props) {

    let url = props.url !== undefined ? props.url : null;

    const [pdf, setPdf] = useState(null);
    const [scale, setScale] = useState(1);
    const [inputZoomValue, setInputZoomValue] = useState("");

    const divRef = useRef(null);
    const viewerRef = useRef(null);

    useEffect(() => {
        setInputZoomValue((scale*100).toFixed(0)+`%`);
        if(viewerRef.current !== null && viewerRef.current !== undefined){
            viewerRef.current.currentScale = scale;
        }
    }, [scale])    

    useEffect(() => {
        const getDocument = async () => {
            if(url !== null){
                const doc = await pdfjsLib.getDocument(url).promise;
                setPdf(doc);
            }
        }
        getDocument();
    }, [url]);

    useEffect(() => {
        const div = divRef.current;

        const handlewheelZoom = (e) => {
            if(e.ctrlKey) {
                e.preventDefault();

                setScale((prevScale) => {
                    const delta = e.deltaY < 0 ? 0.1 : -0.1;
                    const newScale = Math.min(Math.max(prevScale + delta, 0.5), 3.0);
                    return newScale;
                })
            }
        }

        div.addEventListener("wheel", handlewheelZoom, {passive: false});

        dynamicClasses();

        return () => {
            div.removeEventListener("wheel", handlewheelZoom);
        }
    },[])

    useEffect(() => {
        if(!pdf) return;

        const renderPages = async () => {
            const container = divRef.current;
            container.innerHTML = '';

            const viewer = document.createElement("div");
            viewer.classList.add("pdfViewer");
            viewer.style.paddingBottom = "7rem";
            container.appendChild(viewer);

            const eventBus = new EventBus();
            const linkService = new PDFLinkService({eventBus});
            const pdfViewer = new PDFViewer({
                container,
                viewer,
                eventBus,
                linkService
            });

            viewerRef.current = pdfViewer;

            linkService.setViewer(pdfViewer);
            const pdf = await pdfjsLib.getDocument(url).promise;
            pdfViewer.setDocument(pdf);
            linkService.setDocument(pdf, null);
        }
        renderPages();
    }, [pdf])

    return (
        <>
            <div ref={divRef} className='pdf-container positionAbsolute Jw[99.5vW] Jh[a97vh] overFlowAuto darkscrollBar'></div>
            <div className='flex gap05 align-items-center z-index-3 Jpa[t:1rem,l:2rem]'>
                <div onClick={substractScale} className="minusBtn border1px btnHover nanoPlusBtn whitePlus bgWindow"></div>
                <input onInput={(e) => (handleChange(e))} onBlur={(e) => changeScale(e)} className='Jw[a3.8rem] bgWindow darkFocusBorder text-white text-centered cardText text-semiLight' value={inputZoomValue} />
                <div onClick={sumScale} className="PlusBtn border1px btnHover nanoPlusBtn whitePlus bgWindow"></div>
            </div>
        </>
    )

    function substractScale(){
        console.log(scale);
        if(scale > 0.500000000000000000001){
            let size = scale - 0.1 < 0.5 ? 0.5 : scale - 0.1;
            setScale(size);
        }
    }

    function sumScale(){
        if(scale < 3){
            let size = scale + 0.1 > 3 ? 3 : scale + 0.1;
            setScale(size);
        }
    }

    function handleChange(e){
        let value = e.target.value.replaceAll("%","");
        setInputZoomValue(value);
    }

    function changeScale(e){
        let input = e.target;
        if(input.value === "300") input.value = "300%";
        let newScale = input.value.replaceAll("%","");
        if(newScale === "") {
            if(scale === (50/100))
                setInputZoomValue(scale*100+"%");
            newScale = "50";
        }
        if(newScale > Number.parseInt("300"))
            setInputZoomValue("300%");
        let percentage = Number.parseInt(newScale) < 50 ? 50 : (Number.parseInt(newScale) > 300 ? 300 : Number.parseInt(newScale))
        setScale(percentage/100);
    }
}

export default PdfViewer
