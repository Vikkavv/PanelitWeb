export function textResizeDetector(actionFunction){
    const probe = document.createElement("span");
    probe.textContent = "MMMMMMMMMM";
    probe.style.cssText = `
        position: absolute;
        visibility: hidden;
        white-space: nowrap;
        font: inherit;
    `;
    document.body.appendChild(probe);

    const ro = new ResizeObserver(entries => {
        actionFunction();
    });

    ro.observe(probe);
}