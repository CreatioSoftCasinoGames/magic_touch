angular.module('MetronicApp').controller('LoginController', function($location, $cookies, $rootScope, $scope, $http, $timeout, $window) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();
    });
    console.log("yessss",$rootScope.isAdminLogin)
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    var loginCheck = false;
    var checkAlreadyLoggedIn = function(){
      // if($cookies.get('poker_role') || $cookies.get('poker_token') || $cookies.get('poker_userName') || $cookies.get('poker_email')){
      if($rootScope.poker_role || $rootScope.poker_token || $rootScope.poker_userName || $rootScope.poker_email){
        loginCheck = true;
        // swal("Error", "Someone is already signed in from this browser, please close this tab and use a different browser or device!");
      }
      else{
        loginCheck = false;
      }
      return loginCheck;

    }

    var directLogin = function(){
           console.log("djfhkldnf== ");

      // if($rootScope.poker_userName){
      if(base64_decode($cookies.get('poker_userName'))){
        // alert('here')
        console.log(typeof $cookies.get('poker_role'));
        console.log(JSON.parse($cookies.get('poker_role')));
        $rootScope.isAdminLogin=true;
        $rootScope.poker_token = $cookies.get('poker_token');
        $rootScope.poker_name = base64_decode($cookies.get('poker_name'));
        $rootScope.poker_role = (($cookies.get('poker_role')));

        $rootScope.poker_userName = base64_decode($cookies.get('poker_userName'));
        $rootScope.poker_email = base64_decode($cookies.get('poker_email'));
        $rootScope.poker_parent = base64_decode($cookies.get('poker_parent'));
        $rootScope.poker_uniqueSessionId = base64_decode($cookies.get('poker_uniqueSessionId'));
        $rootScope.poker_loggedinUserMobileNum = base64_decode($cookies.get('poker_loggedinUserMobileNum'));
        // $rootScope.poker_modeAccess = base64_decode($cookies.get('poker_modeAccess'));
        $rootScope.role = $rootScope.poker_userName;
        $rootScope.userName = $rootScope.poker_userName;
        // $rootScope.moduleAccess = {};
        $rootScope.poker_modeAccess = (base64_decode($cookies.get('poker_modeAccess'))).split(',');
        $rootScope.moduleAccess = (base64_decode($cookies.get('poker_modeAccess'))).split(',');
        console.log("line 50 ", $rootScope.moduleAccess);
        $location.path('/dashboard');
      }

    }

     // directLogin();
    // checkAlreadyLoggedIn();
    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');
      $cookies.remove('poker_uniqueSessionId');
      $cookies.remove('poker_loggedinUserMobileNum');
      $cookies.remove('poker_modeAccess');

    }
    if(!$rootScope.isAdminLogin){
      console.log('yes', $cookies.get('poker_role'), $cookies.get('poker_token'), $cookies.get('poker_userName'), $cookies.get('poker_email') )
      // if($rootScope.poker_role || $rootScope.poker_token || $rootScope.poker_userName || $rootScope.poker_email){
      if($cookies.get('poker_role') || $cookies.get('poker_token') || $cookies.get('poker_userName') || $cookies.get('poker_email')){
         // alert('i m here')
         directLogin();
       }
       else{
        // alert('hi')
        // alert('i m not there')
        $scope.init();

      }
      // $location.path('/login.html')
    }
    else{
      console.log('no')
      $location.path('/dashboard')

    }

    $scope.data = {};

    $scope.login = function(){

      // if($cookies.get('poker_role')){
      if($rootScope.poker_role){
        // swal("Error", "Someone is already signed in from this browser, please close this tab and use a different browser or device!");
        directLogin();
        return false;
      }

      $scope.init();



      var data = angular.copy($scope.data);
      console.log('in login controler', data);
      if((data.userName) && (data.password)){
        $http({
        method : "post",
        url : "/login",
        data:  data,
        headers: {'Content-Type': 'application/json'},
        unique: true,
        requestId: 'helpppp'

      }).then(function mySucces(res) {
        console.log('res.result++++++++++++++ ',res );
        if(res.data.success){
	        console.log(res.data.result.token);
	        $cookies.put('poker_token', res.data.result.token);
          $cookies.put('poker_name', base64_encode(res.data.result.name));
          $cookies.put('poker_role', JSON.stringify(res.data.result.role));
          $cookies.put('poker_userName', base64_encode(res.data.result.userName));
          $cookies.put('poker_email', base64_encode(res.data.result.email));
          $cookies.put('poker_parent', base64_encode(res.data.result.isParent));
          $cookies.put('poker_loggedinUserMobileNum', base64_encode(res.data.result.loggedinUserMobileNum));
          $cookies.put('poker_uniqueSessionId', base64_encode(res.data.result.uniqueSessionId));
          $cookies.put('poker_modeAccess', base64_encode(res.data.result.moduleAccess));

          // $rootScope.poker_token = $cookies.get('poker_token');
          // $rootScope.poker_name = base64_decode($cookies.get('poker_name'));
          // $rootScope.poker_role = JSON.stringify(res.data.result.role);
          // console.error($rootScope.poker_role);
          // console.error(typeof $rootScope.poker_role);
          // $rootScope.poker_userName = base64_decode($cookies.get('poker_userName'));
          // $rootScope.poker_email = base64_decode($cookies.get('poker_email'));
          // $rootScope.poker_parent = base64_decode($cookies.get('poker_parent'));
          // $rootScope.poker_uniqueSessionId = base64_decode($cookies.get('poker_uniqueSessionId'));
          // $rootScope.poker_loggedinUserMobileNum = base64_decode($cookies.get('poker_loggedinUserMobileNum'));
          // $rootScope.poker_modeAccess = res.data.result.moduleAccess;

         
           $location.path('/dashboard');
          }

          else{
            $scope.data.password = "";
           $scope.errorMsg = res.info;
           console.log("....", res);
           swal("Error!", res.data.info);
         }
       }, function myError(err) {
         console.log("err", err);
         swal("Error!", "Getting error from server in login!");
       });
      }
      else{
       swal("Error!", "Insufficient info!");
      }
    }


    function base64_encode( str )
    {
      if (window.btoa) // Internet Explorer 10 and above
        return window.btoa(unescape(encodeURIComponent( str )));
      else
      {
        // Cross-Browser Method (compressed)
        // Create Base64 Object
        var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
        // Encode the String
        return Base64.encode(unescape(encodeURIComponent( str )));
      }
    }

    function base64_decode( str )
    {
      if (window.atob) // Internet Explorer 10 and above
          return decodeURIComponent(escape(window.atob( str )));
      else
      {
        // Cross-Browser Method (compressed)
        // Create Base64 Object
        var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
        // Encode the String
        return decodeURIComponent(escape(Base64.decode( str )));
      }
    }



    // $scope.init();

});
