(() => {
if ('serviceWorker' in navigator && window.isSecureContext) {
window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').then(r => r.update()).catch(console.warn));
}
let pending;
const button = document.createElement('button');
button.className = 'btn'; button.textContent = 'Instalar app'; button.hidden = true;
(document.querySelector('.actions') || document.body).appendChild(button);
window.addEventListener('beforeinstallprompt', e => {e.preventDefault(); pending=e; button.hidden=false;});
button.addEventListener('click', async () => {if(!pending)return; await pending.prompt(); await pending.userChoice; pending=null; button.hidden=true;});
window.addEventListener('appinstalled',()=>{button.hidden=true;pending=null;});
})();