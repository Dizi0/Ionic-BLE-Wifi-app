cordova.define("cordova-plugin-wifi-information.wifiinformation", function(require, exports, module) {
var wifiinformation = function() {
};

wifiinformation.getWifiInfo = function(success, fail ) {
    cordova.exec( success, fail, "wifiinformation", "getWifiInfo", [] );
};

wifiinformation.getActiveDevices = function(success, fail ) {
    cordova.exec( success, fail, "wifiinformation", "getActiveDevices", [] );
};

wifiinformation.getDHCPInfo = function(success, fail ) {
    cordova.exec( success, fail, "wifiinformation", "getDHCPInfo", [] );
};

wifiinformation.getSampleInfo = function(success, fail ) {
    cordova.exec( success, fail, "wifiinformation", "getSampleInfo", [] );
};

wifiinformation.getPermission = function(success, fail ) {
  cordova.exec( success, fail, "wifiinformation", "getPermission", [] );
};

wifiinformation.checkPermission = function(success, fail ) {
  cordova.exec( success, fail, "wifiinformation", "checkPermission", [] );
};

wifiinformation.getHostIp = function(success, fail ) {
  cordova.exec( success, fail, "wifiinformation", "getHostIp", [] );
};

module.exports = wifiinformation;

});
