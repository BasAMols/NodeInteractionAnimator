import { Main } from "./main";
document.addEventListener("DOMContentLoaded", async () => {
    const g = new Main();
    document.body.appendChild(g.glob.interface.domElement);
});