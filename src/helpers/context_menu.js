// This gives you default context menu (cut, copy, paste)
// in all input fields and textareas across your app.

import { remote } from "electron";

const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

const isAnyTextSelected = () => {
  return window.getSelection().toString() !== "";
};

global.sharedObj = {itemId: null};

const cut = new MenuItem({
  label: "Cut",
  click: () => {
    document.execCommand("cut");
  }
});

const copy = new MenuItem({
  label: "Copy",
  click: () => {
    document.execCommand("copy");
  }
});

const paste = new MenuItem({
  label: "Paste",
  click: () => {
    document.execCommand("paste");
  }
});

const view = new MenuItem({
  label: "View",
  click: () => {
    $("#"+global.sharedObj['itemId']+"-options").dialog({width:535});
  }
});

const remove = new MenuItem({
  label: "Remove",
  click: () => {
    var listener = global.sharedObj['itemTitle'];
    killListener(socket,listener);
  }
});

const shell = new MenuItem({
  label: "Shell",
  click: () => {
    var agentid = global.sharedObj['itemId'].replace("nav-","");
    $("#termtabs").append('<li><a href="#term-'+agentid+'">Agent #'+agentid+'</a></li>');
    addTerminal("term-"+agentid);
    $("#terminals").tabs("refresh");
    $("#terminals").tabs("option", "active", $("#terminals").tabs("option", "active")+1);
    interactAgent(agentid);
  }
});

const modules = new MenuItem({
  label: "Modules",
  click: () => {
    console.log("modules clicked");
  }
});

const kill = new MenuItem({
  label: "Kill",
  click: () => {
    var agentid = global.sharedObj['itemId'].replace("nav-","");
    killAgent(socket,agentid);
  }
});

const normalMenu = new Menu();
normalMenu.append(copy);

const textEditingMenu = new Menu();
textEditingMenu.append(cut);
textEditingMenu.append(copy);
textEditingMenu.append(paste);

const listenerMenu = new Menu();
listenerMenu.append(view);
listenerMenu.append(remove);

const agentMenu = new Menu();
agentMenu.append(shell);
//agentMenu.append(modules);
//agentMenu.append(kill);
//agentMenu.append(remove);

function addMenus() {
    document.addEventListener(
      "contextmenu",
      event => {
        switch (event.target.nodeName) {
          case "TEXTAREA":
          case "INPUT":
            event.preventDefault();
            textEditingMenu.popup(remote.getCurrentWindow());
            break;
        }
        switch (event.target.className) {
          case "menu-list-listener":
          case "menu-list-stager":
            event.preventDefault();
            global.sharedObj = {itemId: event.target.id,itemTitle: event.target.title}
            listenerMenu.popup(remote.getCurrentWindow);
            break;
          case "menu-list-agent":
          case "agent agent-lin ui-draggable ui-draggable-handle":
            event.preventDefault();
            global.sharedObj = {itemId: event.target.id}
            agentMenu.popup(remote.getCurrentWindow);
            break;
        }
      },
      false
    );
}
addMenus();
