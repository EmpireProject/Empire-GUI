(()=>{"use strict";var e={n:t=>{var r=t&&t.__esModule?()=>t.default:()=>t;return e.d(r,{a:r}),r},d:(t,r)=>{for(var a in r)e.o(r,a)&&!e.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:r[a]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const t=require("path");var r=e.n(t);const a=require("url");var o=e.n(a);const l=require("electron"),n={label:"Development",submenu:[{label:"Reload",accelerator:"CmdOrCtrl+R",click:()=>{l.BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache()}},{label:"Toggle DevTools",accelerator:"Alt+CmdOrCtrl+I",click:()=>{l.BrowserWindow.getFocusedWindow().toggleDevTools()}},{label:"Quit",accelerator:"CmdOrCtrl+Q",click:()=>{l.app.quit()}}]},i={label:"Edit",submenu:[{label:"Undo",accelerator:"CmdOrCtrl+Z",selector:"undo:"},{label:"Redo",accelerator:"Shift+CmdOrCtrl+Z",selector:"redo:"},{type:"separator"},{label:"Cut",accelerator:"CmdOrCtrl+X",selector:"cut:"},{label:"Copy",accelerator:"CmdOrCtrl+C",selector:"copy:"},{label:"Paste",accelerator:"CmdOrCtrl+V",selector:"paste:"},{label:"Select All",accelerator:"CmdOrCtrl+A",selector:"selectAll:"}]},c=require("fs-jetpack");var s=e.n(c);const d=require("env");var p=e.n(d);if("production"!==p().name){const e=l.app.getPath("userData");l.app.setPath("userData",`${e} (${p().name})`)}l.app.on("certificate-error",((e,t,r,a,o,l)=>{e.preventDefault(),l(!0)})),l.app.on("ready",(()=>{(()=>{const e=[i];"production"!==p().name&&e.push(n),l.Menu.setApplicationMenu(l.Menu.buildFromTemplate(e))})();const e=((e,t)=>{const r=s().cwd(l.app.getPath("userData")),a=`window-state-${e}.json`,{width:o,height:n}=l.screen.getPrimaryDisplay().workAreaSize,i={width:o,height:n};let c,d={};return d=(e=>{const t=l.screen.getAllDisplays().some((t=>((e,t)=>e.x>=t.x&&e.y>=t.y&&e.x+e.width<=t.x+t.width&&e.y+e.height<=t.y+t.height)(e,t.bounds)));return t?e:(()=>{const e=l.screen.getPrimaryDisplay().bounds;return Object.assign({},i,{x:(e.width-i.width)/2,y:(e.height-i.height)/2})})()})((()=>{let e={};try{e=r.read(a,"json")}catch(e){}return Object.assign({},i,e)})()),c=new l.BrowserWindow(Object.assign({},t,d)),c.on("close",(()=>{c.isMinimized()||c.isMaximized()||Object.assign(d,(()=>{const e=c.getPosition(),t=c.getSize();return{x:e[0],y:e[1],width:t[0],height:t[1]}})()),r.write(a,d,{atomic:!0})})),c})("main",{width:1e3,height:600});e.loadURL(o().format({pathname:r().join(__dirname,"app.html"),protocol:"file:",slashes:!0})),"development"===p().name&&e.openDevTools()})),l.app.on("window-all-closed",(()=>{l.app.quit()}))})();
//# sourceMappingURL=background.js.map