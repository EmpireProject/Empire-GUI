/******************************** 
 * EMPIRE WEBSOCKETS FUCTIONS **/
/*******************************/

// Sends a message to the server via sockets
function sendMessageToServer(socket, message) {
    socket.send(message);
    console.log('send message to server: '+message)
};

// Get EMPIRE Stagers
function getStagers(socket) {
    var data = {Action: 'VIEW', Arguments: ''}
    socket.emit('stagers', data);
    console.log('> Requesting stagers from Empire');
}

// Get EMPIRE Users
function getUsers(socket) {
    var data = {Action: 'VIEW', Arguments: ''}
    socket.emit('users', data);
    console.log('> Requesting users from Empire');
}

// Kill EMPIRE Listener
function killListener(socket, listener) {
    answer = confirm("Are you sure you want to kill this listener?");
    if(answer) {
        var data = {Action: 'KILL', Arguments: {'Name': listener}}
        socket.emit('listeners', data);
        console.log('> Killing listener ('+listener+')');
        getListeners(socket);
        $('.ui-dialog-content').dialog('close');
    }
}

// Kill EMPIRE Agent
function killAgent(socket, agent) {
    answer = confirm("Are you sure you want to kill this agent?");
    if(answer) {
        var data = {Action: 'KILL', Arguments: {'Name': agent}}
        socket.emit('agents', data);
        console.log('> Killing agent ('+agent+')');
        var data = {Action: 'REMOVE', Arguments: {'Name': agent}}
        socket.emit('agents', data);
        console.log('> Removing agent ('+agent+')');
        getAgents(socket);
    }
}

// Get EMPIRE Listeners
function getListeners(socket) {
    var data = {Action: 'VIEW', Arguments: ''}
    socket.emit('listeners', data);
    console.log('> Requesting listeners from Empire');
}

// Get EMPIRE Agents
function getAgents(socket) {
    var data = {Action: 'VIEW', Arguments: ''}
    socket.emit('agents', data);
    console.log('> Requesting agents from Empire');
}

function interactAgent(agentid) {
    var data = {Action: 'INTERACT', Arguments: {'Name': agentid}}
    socket.emit('agents', data);
    console.log('> Requesting Agent Log'); 
}

// Send Command to EMPIRE Agent
function agentCommand(agent,cmd) {
    var data = {Action: 'EXECUTE', Arguments: {'Name': agent,'Command': cmd}}
    socket.emit('agents', data);
}

// Get EMPIRE Listener Options
function getListenerOptions(socket) {
    var data = {Action: 'OPTIONS'}
    socket.emit('listeners', data);
    console.log('> Getting Listener Options');
}

var aliasname = ""; //make global
function loginConnect(server,port,alias,password) {
    // connect to server
    aliasname = alias;
    console.log('> Attempting to connect to Empire ('+server+':'+port+')')
    var socket = io.connect('https://'+server+':'+port, verify=false, {rejectUnauthorized: false}); 

    // attempt to login
    var data = {username : alias, password: password}
    console.log('> Attempting to loging to Empire ('+alias+')')
    socket.emit('login', data);
    
    // associate socket handlers
    setupSockets(socket);
    return socket;
}

function parseData(data) {
    if (data['type'] == 'stagers') {
        useStagers(data);
    } else if(data['type'] == 'listeners') {
        useListeners(data);
    } else if(data['type'] == 'login') {
        processLogin(data);
    } else {
        console.log(data);
    }
}

function parseMessage(data) {
    if (typeof data === 'object' && typeof data['Result']!=='undefined' && data['Result']!=='') {
        console.log("parseMessage: "+data['Result']);
        consoleLog("empire", data['Result']);
    }
}

function processLogin(data) {
    if(data['Result'].indexOf('Logon success') != -1) {
        console.log('> Authentication Successfull')
        loadMainApp();
    } else {
        console.log('> Authentication Failure')
        $("#message-box").html(data['Result']);
        $("#message-box").dialog();
    }
}

function loadMainApp() {
    document.getElementById('main-login').style.opacity = '0';
    setTimeout(function(){
        document.getElementById('main-login').style.display = 'none';
    }, 500);
    getStagers(socket);
    getUsers(socket);
    getListeners(socket);
    getListenerOptions(socket);
    getAgents(socket);
    consoleLog("empire","Loaded Empire listeners & agents");
}

function consoleLog(id,msg) {
    $("#term-"+id+" #console-log").append(msg+"<br/>");
    $("a[href$='"+id+"']").css("color", "yellow");
    setTimeout(function(){ 
        $("a[href$='"+id+"']").css("color", "#454545");
    }, 500);
}

function consoleData(id,msg) {
    if($("#term-"+id+" .jquery-console-inner").length) {
        $("#term-"+id+" .jquery-console-inner").append('<div class="jquery-console-message jquery-console-message-value" style="">'+msg+'</div>');
        $("#term-"+id+" .jquery-console-inner").append($("#term-"+id+" .jquery-console-prompt-box:last")); 
        $("#term-"+id+" .jquery-console-inner").scrollTop($("#term-"+id+" .jquery-console-inner")[0].scrollHeight);
        retcolor = $("a[href$='"+id+"']").css("color");
        $("a[href$='"+id+"']").css("color", "yellow");
        setTimeout(function(){ 
            $("a[href$='"+id+"']").css("color", retcolor);
        }, 500);
    }
}

function useStagers(data) {
    stagers = data['Result']
    if (typeof stagers === 'object') {
        $("#side-nav-content-stagerlist").html("");
        for (var key in stagers) {
            var div = $("#side-nav-content-stagerlist").html();
            $("#side-nav-content-stagerlist").html(div + '<div id="stager-'+key+'" class="menu-list-stager">'+stagers[key]['Name']+'</div>');
        }
        console.log('> Updated GUI with Empire Stagers');
    }
}

function useListeners(data) {
    listeners = data['Result']
    if (typeof listeners === 'object') {
        $("#side-nav-content-listenerlist").html("");
        for (var key in listeners) {
            var div = $("#side-nav-content-listenerlist").html();
            var optdata = '<form name="listener-'+key+'">';
            for (var optkey in listeners[key]['options']) {
               optdata = optdata + '<div class="option-names"><label for="'+optkey+'">'+optkey+'</label><input type="text" name="'+optkey+'" value="'+listeners[key]['options'][optkey]['Value']+'"></input><div class="option-desc">'+listeners[key]['options'][optkey]['Description']+'</div></div>';
            }
            optdata = optdata + '<button type="button" id="listener-kill-'+key+'" onclick="killListener(socket, \''+listeners[key]['name']+'\')" style="border:none;width:495px; background:red; color:white; text-transform:uppercase;" class="ui-button ui-widget ui-corner-all" form="listener-'+key+'" value="Kill">Kill</button"></form>';
            $("#side-nav-content-listenerlist").html(div + '<div id="listener-'+key+'" title="'+listeners[key]['name']+'" class="menu-list-listener">'+listeners[key]['name']+'</div><div id="listener-'+key+'-options" class="listener-options" title="Listener: '+listeners[key]['name']+'">'+optdata+'</div>');
        }
        console.log('> Updated GUI with Empire Listeners');
    }

}

function useUsers(data) {
    users = data['Result']
    if (typeof users === 'object') {
        $('.menu-list-user').each(function(){
            $(this).remove();
        });
        $("#side-nav-content-userlist").html("");
        for (var key in users) {
            var div = $("#side-nav-content-userlist").html();
            $("#side-nav-content-userlist").html(div + '<div id="user-'+key+'" title="'+users[key]['username']+'" class="menu-list-user">'+users[key]['username']+'</div>');
        }
        console.log('> Updated GUI with Empire Users');
        console.log(users);
    } else {
        consoleLog('empire',users);
        getUsers(socket);
    }
}

function useAgents(data) {
    $('.agent').each(function(){
        $(this).remove();
    });
    console.log(data);
    agents = data['Result'];
    if (typeof agents === 'object') {
        $("#side-nav-content-agentlist").html("");
        tspace = 150
        lspace = 100
        for (var agent in agents) { 
            var acount = $(".agent").length + 1;
            if(acount>=8) {
                acount=acount-7
                tspace = 325
            }
            var lspace = 125 * acount; 
            ostype = agents[agent]['os_details'].split(',')[0];
            if (ostype=='Linux') {
                dclass = 'agent-lin';
            } else {
                dclass = 'agent-win';
            }
            var div = $("#content").html();
            var divlist = $("#side-nav-content-agentlist").html();
            agdata = '<div class="agent '+dclass+'" style="left:'+lspace+'px; top:'+tspace+'px;" id="'+agents[agent]['name']+'">#'+agents[agent]['name']+'<br/><span style="font-size:12px;">'+agents[agent]['hostname']+' ('+agents[agent]['external_ip']+')</span></div>';
            $("#content").html(div + agdata);
            $("#side-nav-content-agentlist").html(divlist + '<div id="nav-'+agents[agent]['name']+'" class="menu-list-agent">'+agents[agent]['name']+'</div><div id="agent-'+agent+'-options" class="agent-options" title="Agent: '+agents[agent]['name']+'"></div>');
        }
        for (var agent in agents) { 
            $("#"+agents[agent]['name']).draggable({ containment: "parent" });
        }    
        console.log('> Updated GUI with Agents');
    }
}

function useAgentData(data) {
    ad = data['Result'];
    if (typeof ad === 'object') {
        consoleData(ad['Agent'],ad['Result'].replace("\r\n ..Command execution completed.",""));
    }
}

function useAgentCommand(data) {
    ad = data['Result'];
    if (typeof ad === 'object') {
        consoleData(ad['Agent'],'<span class="jquery-console-prompt-label">'+ad['User']+':~$&nbsp;</span><span style="color:white;">'+ad['Result']+'</span>');
    }
}

function useAgentNew(data) {
    getAgents(socket);
    consoleLog("empire",data['Result']);
}

function useListenerOptions(data) {
    ltypes = data['Result'];
    for (var ltype in ltypes) {
        var div = $("#side-nav-content-listenerlist").html();
        optdata = '<div id="listener-'+ltype+'-options" class="listener-options" title="Listener ('+ltype+'"><form name="listener-'+ltype+'">';
        for (var optkey in data['Result'][ltype]) {
            optdata = optdata + '<div class="option-names"><label for="'+optkey+'">'+optkey+'</label><input type="text" name="'+optkey+'" value=""></input><div class="option-desc">'+data['Result'][ltype]+'</div></div>';
        }
        optdata = optdata + '<button type="button" id="listener-exec-'+ltype+'" onclick="execListener(socket, \''+ltype+'\')" style="width:495px; background:red; color:white; text-transform:uppercase; border:none;" class="ui-button ui-widget ui-corner-all" form="listener-'+ltype+'" value="Execute">Execute</button"></form></div>';
        $("#side-nav-content-listenerlist").html(div + optdata);
    }
}

/*************************** 
 * INITIALIZE WEBSOCKETS  **/
/***************************/

//var socket = loginConnect('192.168.197.128','1337','init','testing');

/**************************** 
 * CORE SOCKET.IO HANDLERS **/
/****************************/

function setupSockets(socket) {
    if(typeof(socket) === 'object') {
        socket.on('connect', function() {
            console.log('< Connection to Empire established');    
        });
        socket.on('message',function(data) {
            parseMessage(data);
        }); 
        socket.on('user_login',function(data) {
            processLogin(data);
        });
        socket.on('users',function(data) {
            useUsers(data);
        });
        socket.on('listeners',function(data) {
            useListeners(data);
        });
        socket.on('stagers',function(data) {
            useStagers(data);
        });
        socket.on('agents',function(data) {
            useAgents(data);
        });
        socket.on('agentData',function(data) {
            useAgentData(data);
        });
        socket.on('agentCommand',function(data) {
            useAgentCommand(data);
        });
        socket.on('agentNew',function(data) {
            useAgentNew(data);
        });
        socket.on('listenerOptions',function(data) {
            useListenerOptions(data);
        });
        socket.on('disconnect',function() {
            console.log('< The client has disconnected');
        });
    }
}


$('form[name="login"]').submit(function(event){
    event.preventDefault();
    socket = loginConnect($('#server-ip').val().toString(),$('#server-port').val().toString(),$('#alias').val(),$('#password').val());
});
