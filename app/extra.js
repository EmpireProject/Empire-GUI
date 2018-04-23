/**
 * index.js
 * 
 */

// Sleep Function
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Open the left navigation slider
async function openNav(menu) {
    document.getElementById("side-nav-content-"+menu).style.width = "175px";
    var x = document.getElementsByClassName("agent");
    for (i = 0; i < x.length; i++) {
      offset = x[i].getBoundingClientRect();
      x[i].style.transition = "0.5s";
      x[i].style.left = offset.left + 175 + "px";
    }
    var y = document.getElementsByClassName("navbutton");
    for (i = 0; i < y.length; i++) {
      //y[i].onclick = closeNav;
      y[i].style.display = "none";
    }
    document.getElementById("navbuttonclose").style.display = "block";
    await sleep(500);
    for (i = 0; i < x.length; i++) {
      x[i].style.transition = null;
    }
}

async function closeNav() {
    var y = document.getElementsByClassName("side-nav-content");
      for (i = 0; i < y.length; i++) {
        y[i].style.width = "0";
      }
    var x = document.getElementsByClassName("agent");
    for (i = 0; i < x.length; i++) {
      offset = x[i].getBoundingClientRect();
      x[i].style.transition = "0.5s";
      x[i].style.left = offset.left - 175 + "px";
    }
    var y = document.getElementsByClassName("navbutton");
    for (i = 0; i < y.length; i++) {
      //y[i].onclick = openNav;
      y[i].style.display = "block";
    }
    document.getElementById("navbuttonclose").style.display = "none";
    await sleep(500);
    for (i = 0; i < x.length; i++) {
      x[i].style.transition = null;
    }
}

function addTerminal(termid) {
    var termemp = $('<div id="'+termid+'" class="console1"><div id="console-log"></div>');
     $('#terminals').append(termemp);
     var termemp  = termemp.console({
         promptLabel: aliasname+':~$ ',
      commandHandle:function(line){
        if (line) {
          console.log("sending command to agent");
          agentCommand(termid.split('-')[1], line);
          return [{msg:"",className:"jquery-console-message-value"}];
        } else {
          var m = "type a color among (" + this.colors.join(", ") + ")";
          return [{msg:m,className:"jquery-console-message-value"}];
        }
      },
      colors: ["red","blue","green","black","yellow","white","grey"],
      cols: 40,
      completeHandle:function(prefix){
        var colors = this.colors;
        var ret = [];
        for (var i=0;i<colors.length;i++) {
          var color=colors[i];
          if (color.lastIndexOf(prefix,0) === 0) {
            ret.push(color.substring(prefix.length));
          }
        }
        return ret;
      }
     })
}

//addTerminal("term-empire");
