var g_timeoutId;
var g_delayCmd;
var g_socket;
var g_token;
var g_gwList= [];

var g_cbGateway;
var g_cbRxdev,g_cbRxch;
var g_cbTxdev,g_cbTxch;
var g_ckMute, g_sbVoulme;
var g_nameGateway = null;
var g_nameRxdev = null;
var g_nameTxdev = null;





window.onload = function () {

    g_cbGateway = document.getElementById("id_cb_gatewayinfo");
    g_cbRxdev = document.getElementById("id_cb_rxdev");
    g_cbTxdev = document.getElementById("id_cb_txdev");
    g_cbRxch = document.getElementById("id_cb_rxch");
    g_cbTxch = document.getElementById("id_cb_txch");
    g_ckMute = document.getElementById("id_ck_mute");
    g_sbVoulme = document.getElementById("id_sb_volume");

    //let myp5 = new p5(sketch,  window.document.getElementById("id_cv_subscribe"));
    


    //g_socket = new WebSocket("ws://192.168.2.24:8888/echo");
    //g_socket = new WebSocket("ws://myserver.andyjhang.xyz:8888/echo");
    g_socket = new WebSocket("wss://demo-rsm.herokuapp.com/echo");
    //SerApi.init(g_socket);
    g_socket.onopen = function (evt) {
        console.log("Connected");
        send_getGatewayInfo();
			//Periodic to get GatewayInfo
			setInterval(function() {
		    send_getGatewayInfo();
        }, 5000);
    }
    g_socket.onmessage = function (evt) {
        //show data
        //document.getElementById("id_show_json").innerHTML = JSON.stringify(JSON.parse(evt.data), undefined, 2);
        
        var d = JSON.parse(evt.data)
        console.log(d)
        var method = d.method;
        var errorcode = d.errorcode
        switch(method){
            case "GatewayInfo":{
                var role = d.role
                g_gwList = d.parameter

                //ui_clear_combobox()
                ui_updata_combobox();
                ui_update_volumeAndMute();
                console.log(g_gwList)
                    
                break
            }
            default:{
                break;
            }
        }

    }
    g_socket.onclose = function (evt) {
        console.log("disconnected")
    }
    g_socket.onerror = function (evt) {
        console.log("error")
    }
    g_socket.onload = function (ent) {
        console.log("load")
    }
 
}

 //ui clear
function ui_clear_combobox(){
    util_comboBox_clear(g_cbGateway)
    util_comboBox_clear(g_cbRxdev)
    util_comboBox_clear(g_cbRxch)
    util_comboBox_clear(g_cbTxdev)
    util_comboBox_clear(g_cbTxch)
}

//ui update
function ui_updata_combobox(){
    if(g_gwList.length == 0){
        ui_clear_combobox()
        g_nameGateway = null;
        g_nameRxdev = null;
        g_nameTxdev = null;
        return;
    }

    nameGateway = util_comboBox_getStrWithSelected(g_cbGateway) 
    nameRxdev = util_comboBox_getStrWithSelected(g_cbRxdev)
    nameRxch = util_comboBox_getStrWithSelected(g_cbRxch)
    nameTxdev = util_comboBox_getStrWithSelected(g_cbTxdev)
    nameTxch = util_comboBox_getStrWithSelected(g_cbTxch)
    ui_clear_combobox()
    //-----------update gateway list----------
    objArayGateway = g_gwList
    for(i in objArayGateway){
        objGateway = objArayGateway[i]
        //console.log(objGateway.gname)   //name of gateway
        util_comboBox_addStr(g_cbGateway, objGateway.gname)
    }
    //set preset name of Gateway
    if(!util_comboBox_choseStr(g_cbGateway, nameGateway)){
        //can't find string
        //update name of gateway
        nameGateway = util_comboBox_getStrWithSelected(g_cbGateway) 
        //clear nameRxdev
        nameRxdev = null
        nameTxdev = null
    }
    
   
    
    
    //---------update rxdev  list-----------
    if(1){
        //find gwlist node
        objArayGateway = g_gwList
        objGateway = util_json_findObjFromArray(objArayGateway,"gname", nameGateway)
        if(objGateway === null)
            return;

        //update rxdev
        objArayDeviceList =objGateway.deviceList;
        for(i in objArayDeviceList){
            objDevice = objArayDeviceList[i]
            //console.log(objDevice.dname)   //name of device
            if(objDevice.nrxch >= 0)
                util_comboBox_addStr(g_cbRxdev, objDevice.dname)
        }
    }
    //set preset name of Rxdev
    if(!util_comboBox_choseStr(g_cbRxdev, nameRxdev)){
        //can't find string
        //update name of Rxdev
        nameRxdev = util_comboBox_getStrWithSelected(g_cbRxdev) 
        //clear nameRxdev
        nameRxch = null
    }



    //---------update txdev  list-----------
    if(1){
        //find gwlist node
        objArayGateway = g_gwList
        objGateway = util_json_findObjFromArray(objArayGateway,"gname", nameGateway)
        if(objGateway === null)
            return;
        
        //update txdev
        objArayDeviceList =objGateway.deviceList;
        for(i in objArayDeviceList){
            objDevice = objArayDeviceList[i]
            //console.log(objDevice.dname)   //name of device
            if(objDevice.dname == nameRxdev)
                continue;

            if(objDevice.ntxch > 0 )
                util_comboBox_addStr(g_cbTxdev, objDevice.dname)
        }
    }  
    //set preset name of Txdev
    if(!util_comboBox_choseStr(g_cbTxdev, nameTxdev)){
        //can't find string
        //update name of Txdev
        nameTxdev = util_comboBox_getStrWithSelected(g_cbTxdev) 
        //clear nameTxdev
        nameTxch = null
    }



    //---------update rxch  list-----------
    if(1){
        //find gwlist node
        objArayGateway = g_gwList
        objGateway = util_json_findObjFromArray(objArayGateway,"gname", nameGateway)
        if(objGateway === null)
            return;
        
        //find rxdev
        objArayDeviceList = objGateway.deviceList;
        objDevice = util_json_findObjFromArray(objArayDeviceList,"dname", nameRxdev)
        if(objDevice === null)
            return;

        //update rxch
        for( i=0 ; i< objDevice.nrxch; i++){
            ch = util_leftPad(i+1,2)
            util_comboBox_addStr(g_cbRxch, ch)
        }
    }
    //set preset name of Rxch
    if(!util_comboBox_choseStr(g_cbRxch, nameRxch)){
        //can't find string
        //update name of Rxch
        nameRxch = util_comboBox_getStrWithSelected(g_cbRxch) 
    }



     //---------update txch  list-----------
     if(1){
        //find gwlist node
        objArayGateway = g_gwList
        objGateway = util_json_findObjFromArray(objArayGateway,"gname", nameGateway)
        if(objGateway === null)
            return;
        
        //find txdev
        objArayDeviceList = objGateway.deviceList;
        objDevice = util_json_findObjFromArray(objArayDeviceList,"dname", nameTxdev)
        if(objDevice === null)
            return;

        //update rxch
        for( i=0 ; i< objDevice.ntxch; i++){
            ch = util_leftPad(i+1,2)
            util_comboBox_addStr(g_cbTxch, ch)
        }
    }
     //set preset name of Txch
     if(!util_comboBox_choseStr(g_cbTxch, nameTxch)){
        //can't find string
        //update name of Txch
        nameTxch = util_comboBox_getStrWithSelected(g_cbTxch) 
    }


}

function  ui_update_volumeAndMute(){
    if(g_gwList.length == 0){
        return;
    }
    nameGateway = util_comboBox_getStrWithSelected(g_cbGateway) 
    nameRxdev = util_comboBox_getStrWithSelected(g_cbRxdev)

    valVolume = 0;
    valMute = 0;


    //------------get Volume and Mute--------------
    objArayGateway = g_gwList
    //find object of gateway
    for(i in objArayGateway){
        objGateway = objArayGateway[i]
        if(objGateway.gname == nameGateway){
            //find object of device
            objArayDeviceList =objGateway.deviceList;
            for(i in objArayDeviceList){
                objDevice = objArayDeviceList[i]
                if(objDevice.dname == nameRxdev){
                    valVolume = objDevice.volume;
                    valMute = objDevice.mute;
                    break;
                }
            }
            break
        }           
    }

    console.log(valVolume)

    //update volume
    g_sbVoulme.value = valVolume ;
    //update mute
    g_ckMute.checked = valMute;

}

//utility
function util_leftPad(number, targetLength) {
    var output = number + '';
    while (output.length < targetLength) {
        output = '0' + output;
    }
    return output;
}

function util_json_findObjFromArray(objAray, key, value){
    var ret = null
    for(i in objAray){
        obj = objAray[i]
        for(k in obj){
            if(k == key){
                if(obj[k] == value){
                    ret = obj
                    break;
                }
            }
        }
        if(!(ret === null))
            break;
    }
    return ret

}

function util_comboBox_clear(obj){
    obj.innerHTML =""
}
function util_comboBox_addStr(obj, str){  
    length = obj.options.length
    obj.innerHTML += "<option value="+length+">"+str+"</option>"
}
function util_comboBox_choseIndex(obj, idx){
    if(obj.innerHTML == "")
        return null
    if(idx >=obj.options.length){
        return null
    }
    obj.selectedIndex  = idx;
}
function util_comboBox_choseStr(obj, str){
    for(i=0; i< obj.options.length ; i++){
        if(str == obj.options[i].innerHTML){
            util_comboBox_choseIndex(obj, i)
            return true;
        }
    }
    return false;
}
function util_comboBox_getStrWithSelected(obj){
    if(obj.innerHTML == "")
        return null
    
    return obj.options[obj.selectedIndex].innerHTML;
}
function util_comboBox_list(obj){  
    list = []
    for(i=0; i< obj.options.length ; i++){
        list.push(obj.options[i].innerHTML)
    }
    return list
}



//command
function send_getGatewayInfo(){
    var sendData = { 
        "role": "user",
        "method": "getGatewayInfo", 
        "parameter": {}
    };

    g_socket.send(JSON.stringify(sendData))
}

function send_subscribe(gname, txdev, txch, rxdev, rxch){
    //return
    var sendData = { 
        "role": "user",
        "method": "subscribe", 
        "parameter": { 
            "gname": gname,
            "txdev": txdev,
            "txch": txch,
            "rxdev": rxdev,
            "rxch": rxch
        }
    };
    
    g_socket.send(JSON.stringify(sendData))

}

function send_setMaster(gname, rxdev, volume, mute){
    //return
    var sendData = { 
        "role": "user",
        "method": "setMaster", 
        "parameter": { 
            "gname": gname,
            "dname": rxdev,
            "volume": volume,
            "mute": mute
        }
    };


    clearTimeout(g_timeoutId)
    g_timeoutId = setTimeout(delaySendMsg, 300);
    g_delayCmd = JSON.stringify(sendData);
    //g_socket.send(JSON.stringify(sendData))

}

function delaySendMsg(){
    g_socket.send(g_delayCmd)
}



//listen componet
function onChosen_Gateway(){
    //util_comboBox_clear(g_cbGateway)

    //util_comboBox_clear(g_cbRxdev)
    //util_comboBox_clear(g_cbTxdev)
    //util_comboBox_clear(g_cbRxch)
    //util_comboBox_clear(g_cbTxch)
    ui_updata_combobox()
    ui_update_volumeAndMute()
    
    //console.log(g_cbGateway.innerHTML)
}
function onChosen_Rxdev(){
    //util_comboBox_clear(g_cbTxdev)
    //util_comboBox_clear(g_cbRxch)
    //util_comboBox_clear(g_cbTxch)
    ui_updata_combobox()
    ui_update_volumeAndMute()
}
function onChosen_Txdev(){
    //util_comboBox_clear(g_cbRxdev)
    //util_comboBox_clear(g_cbRxch)
    //util_comboBox_clear(g_cbTxch)
    ui_updata_combobox()
}

function onClicked_MasterMute(){

    var nameGateway = util_comboBox_getStrWithSelected(g_cbGateway)
    var nameDevice = util_comboBox_getStrWithSelected(g_cbRxdev)
    pos = g_sbVoulme.value
    var isMute = g_ckMute.checked;

    send_setMaster(nameGateway,nameDevice, pos, isMute==true?1:0)
    
    ui_updata_combobox()
}
function onMoved_MasterVolume(){
    g_ckMute.checked = 0;
    var nameGateway = util_comboBox_getStrWithSelected(g_cbGateway)
    var nameDevice = util_comboBox_getStrWithSelected(g_cbRxdev)
    pos = g_sbVoulme.value
    g_ckMute.checked = 0;
    send_setMaster(nameGateway,nameDevice, pos, 0)
    
    ui_updata_combobox()
}


function onClicked_Subscribe(){
    var nameGateway = util_comboBox_getStrWithSelected(g_cbGateway)
    var nameRxdev = util_comboBox_getStrWithSelected(g_cbRxdev)
    var nameRxch = util_comboBox_getStrWithSelected(g_cbRxch)
    var nameTxdev = util_comboBox_getStrWithSelected(g_cbTxdev)
    var nameTxch = util_comboBox_getStrWithSelected(g_cbTxch)


    send_subscribe(nameGateway, nameTxdev, nameTxch, nameRxdev, nameRxch)
}   
function onClicked_Unsubscribe(){
    var nameGateway = util_comboBox_getStrWithSelected(g_cbGateway)
    var nameRxdev = util_comboBox_getStrWithSelected(g_cbRxdev)
    var nameRxch = util_comboBox_getStrWithSelected(g_cbRxch)
    var nameTxdev = util_comboBox_getStrWithSelected(g_cbTxdev)
    var nameTxch = util_comboBox_getStrWithSelected(g_cbTxch)

    send_subscribe(nameGateway, "null", "null", nameRxdev, nameRxch)
}   
