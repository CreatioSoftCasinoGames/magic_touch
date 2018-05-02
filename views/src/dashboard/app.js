/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var MetronicApp = angular.module("MetronicApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize",
    "ngCookies",
    'ngTagsInput'//required in DictionaryController

]); 
 
/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
MetronicApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });

}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
MetronicApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);


MetronicApp.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push(['$injector', function interceptors($injector) {
// Manually injecting dependencies to avoid circular dependency problem
        return {
        // preventing duplicate requests
          'request': function request(config) {
              var $http = $injector.get('$http'),
              copiedConfig = angular.copy(config);
                // console.log("helllllllllllllll", copiedConfig);

              if(copiedConfig.headers){
                delete copiedConfig.headers;      
              }
              if(config.data && config.data.keyForRakeModules){
                // swal({title: "Fetching data...", text: "", showConfirmButton: false});
              }
              // swal( "Fetching data...");
              // console.log("\x1b[41m",JSON.stringify(config.data),"\x1b[0m")
              function configsAreEqual(pendingRequestConfig) {
                var copiedPendingRequestConfig = angular.copy(pendingRequestConfig);
                delete copiedPendingRequestConfig.headers;
                return angular.equals(copiedConfig, copiedPendingRequestConfig);
              }

              if ($http.pendingRequests.some(configsAreEqual)) {
                swal("Info", "A Request Already Generated! Please Wait");
                 config.url = "";
                 config.data = "";
                return config;
              }
              return config;
            },
            'response': function response(config) {
                // console.log("config line 66 ", config.data);
              if(config.config.data && config.config.data.keyForRakeModules && !!config.success){
                // swal({title: "Fetching data...", text: "", showConfirmButton: false,timer:0.0001});
              }
              return config;
            }



          }

        
        }])
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
MetronicApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: true, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '../assets',
        globalPath: '../assets/global',
        layoutPath: '../assets/layouts/layout2',
    };

    $rootScope.settings = settings;
    $rootScope.isAdminLogin = false;
    $rootScope.moduleAccess=false;
    $rootScope.role = false;

    return settings;
}]);

/* Setup App Main Controller */
MetronicApp.controller('AppController', ['$scope', '$rootScope', '$http', '$cookies', '$window', '$state', function($scope, $rootScope, $http, $cookies, $window, $state) {
  setInterval(function() {
    if($cookies.get('poker_uniqueSessionId')){
      var data = {};
      data.userName = $rootScope.poker_userName;
      data.email = $rootScope.poker_email;
      data.uniqueSessionId = $rootScope.poker_uniqueSessionId;
        $http({
          method : "post",
          url : "/checkUserSessionInDb",
          data:  data,
          headers: {'Content-Type': 'application/json'}
      }).then(function mySucces(res) {
        // console.log(res);
        if(res.data.success){
          //
        }
        else{
         // swal({title: "Error!", text: "You have logged in from another device.", showConfirmButton: true});
          swal({title:"Warning",
            text:"You have logged in from another device.",
            showConfirmButton:true},function(result){    
            if (result) {
             // $state.go('login');
             // $window.close()
             $window.location.reload();
            }
          });
          // swal("Error", "You have been logged out!", showConfirmButton: false);
          $cookies.remove('poker_token');
          $cookies.remove('poker_name');
          $cookies.remove('poker_role');
          $cookies.remove('poker_userName');
          $cookies.remove('poker_email');
          $cookies.remove('poker_parent');
          $cookies.remove('poker_uniqueSessionId');
          $rootScope.isAdminLogin = false;
          $rootScope.userName = "";
          // setTimeout(function(){
          //    // $rootScope.isAdminLogin = false;
          //   // $state.go('login');
          //   $window.location.reload();
          //   // $location.path('/login.html')
          // }, 5000)
        }
      }, function myError(err) {
          console.log(err,"err")
      });
    }
    else{
      //
    }
  }, 30000)

// setTimeout(function () {
// if ($cookies.get('poker_userName')) {
//   console.log('listener added - 1')
//   $window.onfocus = function () {
//     console.log('--- listener called 1-', $cookies.get('poker_userName'), typeof $cookies.get('poker_userName'))
//     if(!$cookies.get('poker_userName')){
//       console.log('-------hiiiiiiii')
//       $location.path('/login.html');
//     }
//   }
// } else {
//   console.log('listener added - 2')
//   $window.onfocus = function () {
//     console.log('--- listener called 2-', $cookies.get('poker_userName'), typeof $cookies.get('poker_userName'))
//     if($cookies.get('poker_userName')){
//       // if ($cookies.get('poker_userName') != $rootScope.userName) {
//       //   $location.path('/login.html');
//       // }
//       $location.path('/login.html');
//       // $location.path('/dashboard');
//     } else {
//       $location.path('/login.html');
      
//     }
//   }
// }
  
// }, 200)

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


  $window.onfocus = function(){
   if ($cookies.get('poker_userName') ) {
    if($rootScope.userName && base64_decode($cookies.get('poker_userName')) != $rootScope.userName){
      swal({title:"Warning",
        text:"You have been logged with other user.",
        showConfirmButton:true},function(result){    
        if (result) {
         // $state.go('login');
         // $window.close()
         $window.location.reload();
        }
      });
    }else{
          $rootScope.isAdminLogin=true;

          $rootScope.poker_token = $cookies.get('poker_token');
          $rootScope.poker_name = base64_decode($cookies.get('poker_name'));
          $rootScope.poker_role = (($cookies.get('poker_role')));
          $rootScope.poker_userName = base64_decode($cookies.get('poker_userName'));
          $rootScope.poker_email = base64_decode($cookies.get('poker_email'));
          $rootScope.poker_parent = base64_decode($cookies.get('poker_parent'));
          $rootScope.poker_uniqueSessionId = base64_decode($cookies.get('poker_uniqueSessionId'));
          $rootScope.poker_loggedinUserMobileNum = base64_decode($cookies.get('poker_loggedinUserMobileNum'));



          $rootScope.role = (($cookies.get('poker_role')));
          // console.error($rootScope.poker_role);
          // console.error(typeof $rootScope.poker_role);
          $rootScope.userName = base64_decode($cookies.get('poker_userName'));
          // console.log("line 209 ", $rootScope.poker_userName, $rootScope.moduleAccess, $rootScope.poker_modeAccess)
          if(JSON.parse(($cookies.get('poker_role'))).level != 7){
           // $rootScope.moduleAccess=(base64_decode($cookies.get('poker_modeAccess'))).split(',');
          }
          var tempy = $state;
          // console.log("hellllll",tempy);
          // console.log("hellllllpppppp",tempy.current);
          // console.log($state.current);
           if($state.current.name == "login" ){
              $state.go('dashboard');
            }
           
    }
   }
   else{
      $rootScope.isAdminLogin = false;
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');
      $cookies.remove('poker_uniqueSessionId');
      $cookies.remove('poker_loggedinUserMobileNum');
      $cookies.remove('poker_modeAccess');
      $rootScope.userName = "";
      if($state.current.name != "" && $state.current.name != "login"){
        $window.location.reload();
      }
      // $location.path('/#');
   }
 }
// if ($cookies.get('poker_token') || $cookies.get('poker_userName')) {
//   var x = setInterval(function(){
//         if(!$cookies.get('poker_userName') && !$cookies.get('poker_token') && !$cookies.get('poker_uniqueSessionId')){
//           swal("You have been logged out. Please login again!");
//           clearInterval(x);
//           setTimeout(function(){
//           $window.location.reload();
//       }, 10)      
//     }
//   }, 2000)
// }

// if(!$cookies.get('poker_userName') && !$cookies.get('poker_token') && !$cookies.get('poker_uniqueSessionId')){
//       // swal("You have been logged out. Please login again!");
//         clearInterval(x);
//       setTimeout(function(){
//         $window.location.reload();
//       }, 5000)      
//     }
//     else{
//      var x = setInterval(function(){
        
//       }, 2000)
      
//     }


  $scope.$on('$viewContentLoaded', function() {
      
      //App.initComponents(); // init core components
      //Layout.init(); //  Init entire layout(
      //, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
  });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
MetronicApp.controller('HeaderController', ['$scope','$rootScope','$location', '$window','$cookies',  function($scope, $rootScope, $location, $window,$cookies) {
    

    $scope.logout = function () {
      // console.log("logout call")
      $rootScope.isAdminLogin = false;
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');
      $cookies.remove('poker_uniqueSessionId');
      $cookies.remove('poker_loggedinUserMobileNum');
      $cookies.remove('poker_modeAccess');
      $rootScope.userName = "";
      $window.location.reload();
        // $location.path('/login.html')
    }
    $scope.$on('$includeContentLoaded', function() {
        
        Layout.initHeader(); // init header
    });
}]);

/* Setup Layout Part - Sidebar */
MetronicApp.controller('SidebarController', ['$state', '$scope', '$http','$rootScope', '$cookies', function($state, $scope, $http, $rootScope,$cookies) {
    console.log("sidebar controller")
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar($state); // init sidebar
        //$scope.moduleObj;
        $scope.toggleChips = JSON.parse($cookies.get('poker_role'));
        var checkLoginType = $scope.toggleChips;
        console.log('=====', $rootScope.poker_role, checkLoginType);
        $scope.getAffiliateModules = function(){
          $http({
                method : "post",
                url : "/getModuleListAff",
                data:  {},
                headers: {'Content-Type': 'application/json'}
            }).then(function mySucces(res) {
                // console.log("moduleAccess== ", $rootScope.moduleAccess);
                if(res.data.success){
                    // $rootScope.subAffilateModuleAccess = res.data.result;
                    $rootScope.affilateModuleAccess = res.data.result;
                    // console.log($rootScope.affilateModuleAccess,"==$rootScope.affilateModuleAccess")
                   
                }else{
                    alert("Not found module for sidebar")
                }
              }, function myError(err) {
                  // console.log(err,"err")
                  alert("Getting error from server in login");
              });
            }

        $scope.getAffiliateModules();

        if(checkLoginType.level <= 0){
          $http({
              method : "post",
              url : "/getModuleListAff",
              data:  {},
              headers: {'Content-Type': 'application/json'}
          }).then(function mySucces(res) {
          // $scope.myWelcome = response.data;
              // console.log('res.result in module list'+JSON.stringify(res) );
              // console.log("moduleAccess== ", $rootScope.moduleAccess);

              if(res.data.success){
                  console.log("line 107== ", $rootScope.moduleAccess);
                  var moduleAccess = $rootScope.moduleAccess;
                  if(moduleAccess){
                      for(i=0;i<res.data.result.length;i++){
                          var isAccess = moduleAccess.indexOf((res.data.result[i].code).toString());
                          
                          if(isAccess == -1){
                             
                              res.data.result[i].status = false;
                          }
                          for(j=0;j<res.data.result[i].subModule.length;j++){
                             var isAccess1 = moduleAccess.indexOf((res.data.result[i].subModule[j].code).toString());
                            
                              if(isAccess1 == -1){
                                
                                  res.data.result[i].subModule[j].status = false;
                              }

                              if(res.data.result[i].subModule[j].subModule){
                                for(k=0;k<res.data.result[i].subModule[j].subModule.length;k++){
                                  var isAccess1 = moduleAccess.indexOf((res.data.result[i].subModule[j].subModule[k].code).toString());

                                  if(isAccess1 == -1){
                                    
                                      res.data.result[i].subModule[j].subModule[k].status = false;
                                  }

                                }
                                
                              }

                          }
                      }
                  }
                
                  $rootScope.moduleAccess = {};
                  $rootScope.moduleAccess = res.data.result;
                  $rootScope.affilateModuleAccess = res.data.result;
                  // $rootScope.subAffilateModuleAccess = res.data.result;
                  console.log($rootScope.moduleAccess,"==$rootScope.moduleAccess")
                  // console.log($rootScope.affilateModuleAccess,"==$rootScope.affilateModuleAccess")
                 
              }else{
                  alert("Not found module for sidebar")
              }

              //console.log(moduleObj,"moduleObj")
          }, function myError(err) {
              // $scope.myWelcome = response.statusText;
              // console.log(err,"err")
              alert("Getting error from server in login");
          });
          // alert('this is affiliate');

        }

        else{
          $http({
              method : "post",
              url : "/getModuleList",
              data:  {},
              headers: {'Content-Type': 'application/json'}
          }).then(function mySucces(res) {
          // $scope.myWelcome = response.data;
              // console.log('res.result in module list'+JSON.stringify(res) );
              // console.log("moduleAccess== ", $rootScope.moduleAccess);

              if(res.data.success){

                 // console.log("line 171== ", res.data.result);
                  var moduleAccess = $rootScope.moduleAccess;
                  console.log('line 421 ', moduleAccess);
                  // console.log('line 421 ', JSON.stringify(moduleAccess));
                  // console.log('line 421 ', JSON.parse(moduleAccess));

                  if(moduleAccess && eval(moduleAccess[0])){
                      for(i=0;i<res.data.result.length;i++){
                          var isAccess = moduleAccess.indexOf((res.data.result[i].code).toString());
                          
                          if(isAccess == -1){
                             
                              res.data.result[i].status = false;
                          }
                          for(j=0;j<res.data.result[i].subModule.length;j++){
                             var isAccess1 = moduleAccess.indexOf((res.data.result[i].subModule[j].code).toString());
                            
                              if(isAccess1 == -1){
                                
                                  res.data.result[i].subModule[j].status = false;
                              }

                              if(res.data.result[i].subModule[j].subModule){
                                for(k=0;k<res.data.result[i].subModule[j].subModule.length;k++){
                                  var isAccess1 = moduleAccess.indexOf((res.data.result[i].subModule[j].subModule[k].code).toString());

                                  if(isAccess1 == -1){
                                    
                                      res.data.result[i].subModule[j].subModule[k].status = false;
                                  }

                                }
                                
                              }

                          }
                      }
                  }
                
                  $rootScope.moduleAccess = {};
                  $rootScope.moduleAccess = res.data.result;
                  $rootScope.createUserModuleAccess = JSON.stringify(res.data.result);
                  $rootScope.createUserModuleAccess = JSON.parse($rootScope.createUserModuleAccess);

                  console.log($rootScope.moduleAccess,"________$rootScope.moduleAccess")
                  if(checkLoginType.level > 6){
                    var versionMaintenanceModule = 
                      {
                        name: 'Version & Maintenance',
                        code: 2301,
                        iconClass: 'icon-settings',
                        status: true,
                        subModule: [
                          {
                            name: 'Create New Version',
                            code: 2303,
                            route: 'createGameVersion',
                            iconClass: 'icon-puzzle',
                            status: true
                          },
                          {
                            name: 'List Versions',
                            code: 2304,
                            route: 'listGameVersions',
                            iconClass: 'icon-puzzle',
                            status: true
                          },
                          {
                            name: 'Schedule Maintenance',
                            code: 2305,
                            route: 'listScheduledMaintenances',
                            iconClass: 'icon-puzzle',
                            status: true
                          }
                        ]
                      }
                    $rootScope.moduleAccess.push(versionMaintenanceModule);   
                  }
                  console.log($rootScope.moduleAccess,"==$rootScope.moduleAccess")
                 
              }else{
                  alert("Not found module for sidebar")
              }

              //console.log(moduleObj,"moduleObj")
          }, function myError(err) {
              // $scope.myWelcome = response.statusText;
              // console.log(err,"err")
              alert("Getting error from server in login");
          });
          
        }

    });

    
}]);

/* Setup Layout Part - Quick Sidebar */
MetronicApp.controller('QuickSidebarController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
       setTimeout(function(){
            QuickSidebar.init(); // init quick sidebar        
        }, 2000)
    });
}]);

/* Setup Layout Part - Theme Panel */
MetronicApp.controller('ThemePanelController', ['$scope', function($scope) {    
    $scope.$on('$includeContentLoaded', function() {
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
MetronicApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);



var rootTools = rootTools || {};

rootTools.turnTimesList = [
  {
    "key": "standard", "value": 30, "label": "Standard (30s)"
  },
  {
    "key": "turbo", "value": 20, "label": "Turbo (20s)"
  },
  {
    "key": "hyTurbo", "value": 10, "label": "Hyper-Turbo (10s)"
  },
]

rootTools.websiteLink                = "http://192.168.2.178/";
rootTools.connectorHost              = "192.168.2.27";
rootTools.connectorPort              = "3050";
rootTools.event                      = {};
rootTools.broadcast                  = {};
rootTools.event.tournamentRoomChange = "TOURNAMENTROOMCHANGE";
rootTools.event.cashGameTableChange  = "CASHGAMETABLECHANGE";
rootTools.broadcast.tableUpdate      = "tableUpdate";
rootTools.broadcast.addTable         = "addTable";
rootTools.broadcast.removeTable      = "removeTable";
rootTools.employeeList = [
  {
    name: "Director", level: 6
  },
  {
    name: "General Manager", level: 5
  },
  {
    name: "Service Delivery Manager", level: 4
  },
  {
    name: "Team Leader", level: 3
  },
  {
    name: "Senior Executive", level: 2
  },
  {
    name: "Executive", level: 1
  }
];

rootTools.bonusCodeTypes = [
  {
    name: "Sign Up Bonus", type: 'signUp'
  },
  {
    name: "One Time Bonus", type: 'oneTime'
  },
  {
    name: "Recurring Bonus", type: 'recurring'
  },
];

rootTools.filterModuleSubAffiliate = [1208, 1209, 1007, 1301, 1302, 1303, 1305];
rootTools.filterModuleAffiliate = [2005];
rootTools.antiBankingTime = 5400;



// setInterval(function(){
//   console.log("check!")
//   $http({
//             method : "post",
//             url : "/checkServerConnection",
//             data:  {},
//             headers: {'Content-Type': 'application/json'}
//         }).then(function mySucces(res) {
            

//         }, function myError(err) {
//             console.log(err,"err")
//             swal("Error!", "Getting error from server in login!");
//         });
// }, 500)



/* Setup Routing For All Pages */
MetronicApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/login.html");  

    $stateProvider

        // // Dashboard
        .state('dashboard', {
            url: "/dashboard",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/dashboard.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/DashboardController.js',
                        ] 
                    });
                }]
            }
        })
        
        //accounts
        .state('accountDetails', {
            url: "/accountDetails",
            templateUrl: "views/accountDetails.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "accountDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/dashboard.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/accountDetailsController.js',
                        ] 
                    });
                }]
            }
        })

         // Dashboard
        .state('login', {
            url: "/login.html",
            templateUrl: "views/login.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "LoginController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/LoginController.js',
                        ] 
                    });
                }]
            }
        })

        .state('listTable', {
            url: "/listTable",
            templateUrl: "views/listTable.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "ListTableController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/ListTableController.js',
                        ] 
                    });
                }]
            }
        })

        .state('createTable', {
            url: "/createTable",
            templateUrl: "views/createTable.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "CreateTableController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/CreateTableController.js',
                        ] 
                    });
                }]
            }
        })

        .state('viewTable', {
            url: "/table/view/:tableId",
            templateUrl: "views/viewTable.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "ListTableController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/ListTableController.js',
                        ] 
                    });
                }]
            }
        })

        .state('listRakeRule', {
            url: "/listRakeRule",
            templateUrl: "views/listrakerules.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "listRakerulesController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/listRakerulesController.js',
                        ] 
                    });
                }]
            }
        })

        .state('editTable', {
            url: "/table/edit/:tableId",
            templateUrl: "views/editTable.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "ListTableController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/ListTableController.js',
                        ] 
                    });
                }]
            }
        })

        .state('duplicateTable', {
            url: "/table/duplicate/:tableId",
            templateUrl: "views/duplicateTable.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "ListTableController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/ListTableController.js',

                        ] 
                    });
                }]
            }
        })

        .state('viewTableUpdates', {
            url: "/table/viewUpdatesList/:tableId",
            templateUrl: "views/tableEditReportList.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "TableUpdateReportController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/TableUpdateReportController.js',

                        ] 
                    });
                }]
            }
        })

        .state('viewTableEditedFields', {
            url: "/table/viewEditedFields/:tableUpdateId",
            templateUrl: "views/viewTableUpdates.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "TableEditedFieldsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/TableEditedFieldsController.js',

                        ] 
                    });
                }]
            }
        })


        .state('editRakeRules', {
            url: "/rakeRule/edit/:rakeRuleId",
            templateUrl: "views/editRakeRule.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "listRakerulesController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/listRakerulesController.js',
                        ] 
                    });
                }]
            }
        })
        
        .state('createRakeRules', {
            url: "/createRakeRule",
            templateUrl: "views/createRakeRule.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "createRakeRuleController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/createRakeRuleController.js',
                        ] 
                    });
                }]
            }
        })
        
        .state('duplicateRakeRules', {
            url: "/rakeRule/duplicate/:rakeRuleId",
            templateUrl: "views/duplicateRakeRule.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "duplicateRakeRulesController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/duplicateRakeRulesController.js',
                        ] 
                    });
                }]
            }
        })

        .state('spamWords', {
            url: "/spamWordsManagement",
            templateUrl: "views/dictionary.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "dictionaryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/dictionaryController.js',
                        ] 
                    });
                }]
            }
        })
        
        .state('generateBonusCode', {
            url: "/generateBonusCode",
            templateUrl: "views/generateBonus.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "generateBonusCodeController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/generateBonusCodeController.js',
                                                  ] 
                    });
                }]
            }
        })

        .state('generateCardPromotions', {
            url: "/scratchCard/generate/promotions",
            templateUrl: "views/generateScratchCardPromotions.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "GenerateScratchCardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js','../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GenerateScratchCardController.js',

                        ] 
                    });
                }]
            }
        })


        .state('generateCardEmergency', {
            url: "/scratchCard/generate/emergency",
            templateUrl: "views/generateScratchCardEmergency.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "GenerateScratchCardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/global/plugins/morris/morris.css',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            // '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GenerateScratchCardController.js',

                        ] 
                    });
                }]
            }
        })


        .state('generateCardAffiliate', {
            url: "/scratchCard/generate/affilate",
            templateUrl: "views/generateScratchCardAffilate.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "GenerateScratchCardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js','../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            // '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GenerateScratchCardController.js',

                        ] 
                    });
                }]
            }
        })

        .state('generateCardHighRollers', {
            url: "/scratchCard/generate/highRollers",
            templateUrl: "views/generateScratchCardHighRollers.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "GenerateScratchCardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js','../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GenerateScratchCardController.js',

                        ] 
                    });
                }]
            }
        })


        .state('listBonusDeposit', {
            url: "/listBonusDeposit",
            templateUrl: "views/listBonusDeposit.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "listBonusDepositController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                             '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                             '../assets/pages/scripts/pagination.js',
                            'js/controllers/listBonusDepositController.js',
                        ] 
                    });
                }]
            }
        })

        .state('editBonusCodeDescription', {
            url: "/listBonusDeposit/editDescription/:bonusCodeId",
            templateUrl: "views/editBonusCode.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "listBonusDepositController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/listBonusDepositController.js',

                        ] 
                    });
                }]
            }
        })


        // for approving scratch card
        .state('approveScratchCard', {
            url: "/scratchCard/approve",
            templateUrl: "views/approveScratchCard.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "ApproveScratchCardCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            '../assets/pages/scripts/pagination.js',
                            'js/controllers/approveScratchCardCtrl.js'

                        ] 
                    });
                }]
            }
        })

        // for approving scratch card
        .state('scratchCardHistory', {
            url: "/scratchCard/history",
            templateUrl: "views/scratchCardHistory.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "ScratchCardHistoryCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/scratchCardHistoryCtrl.js'

                        ] 
                    });
                }]
            }
        })

        .state('scratchCardHistoryAffiliate', {
            url: "/scratchCard/historyAffiliate",
            templateUrl: "views/scratchCardHistoryAffiliate.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "ScratchCardHistoryCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/scratchCardHistoryCtrl.js'

                        ] 
                    });
                }]
            }
        })
        // Blank Page
        .state('blank', {
            url: "/blank",
            templateUrl: "views/blank.html",            
            data: {pageTitle: 'Blank Page Template'},
            controller: "BlankController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/BlankController.js'
                        ] 
                    });
                }]
            }
        })


        .state('bonusHistory', {
            url: "/bonusHistory",
            templateUrl: "views/bonusHistory.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "bonusHistoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                             '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                             '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/bonusHistoryController.js',
                                                    ] 
                    });
                }]
            }
        })

        .state('createLoyaltyPoints', {
            url: "/loyaltyPoints/create",
            templateUrl: "views/createLoyaltyPoints.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "LoyaltyPointsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'js/controllers/LoyaltyPointsController.js',

                        ] 
                    });
                }]
            }
        })


        .state('listLoyaltyPoints', {
            url: "/loyaltyPoints/list",
            templateUrl: "views/listLoyaltyPoints.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "LoyaltyPointsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/LoyaltyPointsController.js',

                        ] 
                    });
                }]
            }
        })

        .state('editLoyaltyPoints', {
            url: "/loyaltyPoints/edit/:loyaltyPointsId",
            templateUrl: "views/editLoyaltyPoints.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "LoyaltyPointsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/LoyaltyPointsController.js',
                        ] 
                    });
                }]
            }
        })
        
        .state('forgotPassword', {
            url: "/forgotPassword",
            templateUrl: "views/forgotPassword.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "forgotPasswordController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/forgotPasswordController.js',
                        ] 
                    });
                }]
            }
        })
        
        .state('resetPassword', {
            url: "/resetPassword/:forgotId/:status",
            templateUrl: "views/resetPassword.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "forgotPasswordController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/forgotPasswordController.js',
                        ] 
                    });
                }]
            }
        })

        .state('resetPasswordPlayer', {
            url: "/resetPasswordPlayer/:forgotPlayerId/:status",
            templateUrl: "views/resetPasswordPlayer.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "forgotPasswordController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/forgotPasswordController.js',
                        ] 
                    });
                }]
            }
        })



        // AngularJS plugins
        .state('fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '../assets/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '../assets/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ] 
                    }, {
                        name: 'MetronicApp',
                        files: [
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/UISelectController.js'
                        ] 
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        files: [
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/jstree/dist/themes/default/style.min.css',

                            '../assets/global/plugins/jstree/dist/jstree.min.js',
                            '../assets/pages/scripts/ui-tree.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })     

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '../assets/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '../assets/global/plugins/typeahead/typeahead.css',

                            '../assets/global/plugins/fuelux/js/spinner.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '../assets/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '../assets/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '../assets/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '../assets/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '../assets/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '../assets/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '../assets/global/plugins/typeahead/handlebars.min.js',
                            '../assets/global/plugins/typeahead/typeahead.bundle.min.js',
                            '../assets/pages/scripts/components-form-tools-2.min.js',

                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })        

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '../assets/pages/scripts/components-date-time-pickers.min.js',

                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-select/css/bootstrap-select.min.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/bootstrap-select/js/bootstrap-select.min.js',
                            '../assets/global/plugins/select2/js/select2.full.min.js',

                            '../assets/pages/scripts/components-bootstrap-select.min.js',
                            '../assets/pages/scripts/components-select2.min.js',

                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        }) 

        // Advanced Datatables
        .state('datatablesmanaged', {
            url: "/datatables/managed.html",
            templateUrl: "views/datatables/managed.html",
            data: {pageTitle: 'Advanced Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [                             
                            '../assets/global/plugins/datatables/datatables.min.css', 
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',

                            '../assets/pages/scripts/table-datatables-managed.min.js',

                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesajax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/datatables/datatables.min.css', 
                            '../assets/global/plugins/datatables/plugins/bootstrap/datatables.bootstrap.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',

                            '../assets/global/plugins/datatables/datatables.all.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/scripts/datatable.js',

                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/scripts/table-ajax.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '../assets/pages/css/profile.css',
                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '../assets/pages/scripts/profile.min.js',

                            'js/controllers/UserProfileController.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help'}      
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/TodoController.js'  
                        ]                    
                    });
                }]
            }
        })


        .state('listUsers', {
            url: "/listUsers",
            templateUrl: "views/listUsers.html",
            data: {pageTitle: 'Todo'},
            controller: "UserController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/UserController.js'  
                        ]                    
                    });
                }]
            }
        })

        .state('createUser', {
            url: "/createUser",
            templateUrl: "views/createUser.html",
            data: {pageTitle: 'Todo'},
            controller: "UserController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/UserController.js'  
                        ]                    
                    });
                }]
            }
        })

        .state('editUser', {
            url: "/editUser/:userId",
            templateUrl: "views/editUser.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "UserController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/UserController.js',
                        ] 
                    });
                }]
            }
        })

         .state('viewUser', {
            url: "/viewUser/:userId",
            templateUrl: "views/viewUser.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "UserController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/UserController.js',
                        ] 
                    });
                }]
            }
        })

        // .state('createAffiliate', {
        //     url: "/createAffiliate",
        //     templateUrl: "views/createAffiliate.html",
        //     data: {pageTitle: 'Todo'},
        //     controller: "AffiliatesController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({ 
        //                 name: 'MetronicApp',  
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [
        //                     '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
        //                     '../assets/apps/css/todo-2.css',
        //                     '../assets/global/plugins/select2/css/select2.min.css',
        //                     '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

        //                     '../assets/global/plugins/select2/js/select2.full.min.js',
                            
        //                     '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

        //                     '../assets/apps/scripts/todo-2.min.js',

        //                     'js/controllers/AffiliatesController.js'  
        //                 ]                    
        //             });
        //         }]
        //     }
        // })
        //______________ CREATE AFFILIATE ____________
        .state('createAffiliate', {
            url: "/createAffiliate",
            templateUrl: "views/createAffiliate.html",
            data: {pageTitle: 'Todo'},
            controller: "AffiliateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/apps/scripts/todo-2.min.js',
                            'js/affiliateModule.js',
                            'js/controllers/AffiliateCtrl.js'  
                        ]                    
                    });
                }]
            }
        })

        .state('createSubAffiliateByAdmin', {
            url: "/createSubAffiliateByAdmin",
            templateUrl: "views/createSubAffiliateByAdmin.html",
            data: {pageTitle: 'Todo'},
            controller: "SubAffiliateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/apps/scripts/todo-2.min.js',
                            'js/affiliateModule.js',
                            'js/controllers/SubAffiliateCtrl.js'  
                        ]                    
                    });
                }]
            }
        })

        .state('createSubAffiliateByAffiliate', {
            url: "/createSubAffiliateByAffiliate",
            templateUrl: "views/createSubAffiliateByAffiliate.html",
            data: {pageTitle: 'Todo'},
            controller: "SubAffiliateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/apps/scripts/todo-2.min.js',
                            'js/affiliateModule.js',
                            'js/controllers/SubAffiliateCtrl.js'  
                        ]                    
                    });
                }]
            }
        })

         //______________ List AFFILIATE ____________
        .state('listOfAffiliate', {
            url: "/listOfAffiliate",
            templateUrl: "views/listOfAffiliate.html",
            data: {pageTitle: 'Todo'},
            controller: "AffiliateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            // '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            // '../assets/apps/css/todo-2.css',
                            // '../assets/global/plugins/select2/css/select2.min.css',
                            // '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            // '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            // '../assets/apps/scripts/todo-2.min.js',
                            '../assets/pages/scripts/pagination.js',
                            'js/controllers/AffiliateCtrl.js'  
                        ]                    
                    });
                }]
            }
        })

        .state('listSubAffiliate', {
            url: "/listSubAffiliate",
            templateUrl: "views/listSubAffiliate.html",
            data: {pageTitle: 'Todo'},
            controller: "SubAffiliateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            // '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            // '../assets/apps/css/todo-2.css',
                            // '../assets/global/plugins/select2/css/select2.min.css',
                            // '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            // '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            // '../assets/apps/scripts/todo-2.min.js',
                            '../assets/pages/scripts/pagination.js',
                            'js/controllers/SubAffiliateCtrl.js'  
                        ]                    
                    });
                }]
            }
        })

        //__________ edit affiliate ____________
        
        .state('editAffiliate', {
            url: "/listOfAffiliate/edit/:affilateId",
            templateUrl: "views/createAffiliate.html",
            data: {pageTitle: 'Todo'},
            controller: "AffiliateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            // '../assets/apps/css/todo-2.css',
                            // '../assets/global/plugins/select2/css/select2.min.css',
                            // '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            // '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            // '../assets/apps/scripts/todo-2.min.js',
                            '../assets/pages/scripts/pagination.js',
                            'js/controllers/AffiliateCtrl.js'  
                        ]                    
                    });
                }]
            }
        })

        .state('editSubAffiliate', {
            url: "/listSubAffiliate/edit/:subAffilateId",
            templateUrl: "views/createSubAffiliateByAdmin.html",
            data: {pageTitle: 'Todo'},
            controller: "SubAffiliateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            // '../assets/apps/css/todo-2.css',
                            // '../assets/global/plugins/select2/css/select2.min.css',
                            // '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            // '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            // '../assets/apps/scripts/todo-2.min.js',
                            '../assets/pages/scripts/pagination.js',
                            'js/controllers/SubAffiliateCtrl.js'  
                        ]                    
                    });
                }]
            }
        })

        .state('viewSubAffiliate', {
        url: "/listSubAffiliate/view/:subAffilateId",
        templateUrl: "views/viewSubAffiliateByAdmin.html",
        data: {pageTitle: 'Todo'},
        controller: "SubAffiliateCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        // '../assets/apps/css/todo-2.css',
                        // '../assets/global/plugins/select2/css/select2.min.css',
                        // '../assets/global/plugins/select2/css/select2-bootstrap.min.css',
                        // '../assets/global/plugins/select2/js/select2.full.min.js',
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        // '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/SubAffiliateCtrl.js'  
                    ]                    
                });
            }]
        }
    })

        //__________ vei affiliate ____________
        .state('viewAffiliate', {
            url: "/listOfAffiliate/view/:affilateId",
            templateUrl: "views/viewAffiliate.html",
            data: {pageTitle: 'Todo'},
            controller: "AffiliateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            // '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            // '../assets/apps/css/todo-2.css',
                            // '../assets/global/plugins/select2/css/select2.min.css',
                            // '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            // '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            // '../assets/apps/scripts/todo-2.min.js',
                            '../assets/pages/scripts/pagination.js',
                            'js/controllers/AffiliateCtrl.js'  
                        ]                    
                    });
                }]
            }
        })

        //  .state('listAffiliate', {
        //     url: "/listAffiliate",
        //     templateUrl: "views/listAffiliates.html",
        //     data: {pageTitle: 'Todo'},
        //     controller: "ListAffiliatesController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({ 
        //                 name: 'MetronicApp',  
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
        //                 files: [
        //                     '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
        //                     '../assets/apps/css/todo-2.css',
        //                     '../assets/global/plugins/select2/css/select2.min.css',
        //                     '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

        //                     '../assets/global/plugins/select2/js/select2.full.min.js',
                            
        //                     '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

        //                     '../assets/apps/scripts/todo-2.min.js',

        //                     'js/controllers/ListAffiliatesController.js'  
        //                 ]                    
        //             });
        //         }]
        //     }
        // })
        
          
          .state('createPlayer', {
            url: "/createPlayer",
            templateUrl: "views/createPlayer.html",
            data: {pageTitle: 'Todo'},
            controller: "PlayerController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/PlayerController.js'  
                        ]                    
                    });
                }]
            }
        })

        .state('createPlayerByAffiliate', {
            url: "/createPlayerByAffiliate",
            templateUrl: "views/createPlayerByAffiliate.html",
            data: {pageTitle: 'Todo'},
            controller: "PlayerController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',

                            'js/controllers/PlayerController.js'  
                        ]                    
                    });
                }]
            }
        })
          
        .state('transferFund', {
            url: "/transferFund",
            templateUrl: "views/fundTransferView.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "fundTransferController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'js/controllers/fundTransferController.js',
                                                  
                          ] 
                    });
                }]
            }
        })

        .state('transferFundToAffiliate', {
            url: "/transferFundToAffiliate",
            templateUrl: "views/fundTransferToAffiliate.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "fundTransferController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'js/controllers/fundTransferController.js',
                                                  ] 
                    });
                }]
            }
        })

        .state('transferFundToSubAffiliate', {
            url: "/transferFundToSubAffiliate",
            templateUrl: "views/fundTransferToSubAffiliate.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "fundTransferController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            'js/controllers/fundTransferController.js',
                                                  ] 
                    });
                }]
            }
        })
        
        // .state('withdrawChips', {
        //     url: "/withdrawChips",
        //     templateUrl: "views/withdrawChips.html",            
        //     data: {pageTitle: 'Admin Dashboard Template'},
        //     controller: "withdrawChipsController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'MetronicApp',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
        //                 files: [
        //                     '../assets/global/plugins/morris/morris.css',                            
        //                     '../assets/global/plugins/morris/morris.min.js',
        //                     '../assets/global/plugins/morris/raphael-min.js',                            
        //                     '../assets/global/plugins/jquery.sparkline.min.js',
        //                     '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
        //                     '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
        //                     'js/controllers/withdrawChipsController.js',
        //                                           ] 
        //             });
        //         }]
        //     }
        // })

        // .state('withdrawChipsHistory', {
        //     url: "/withdrawChipsHistory",
        //     templateUrl: "views/withdrawChipsHistory.html",            
        //     data: {pageTitle: 'Admin Dashboard Template'},
        //     controller: "withdrawHistoryController",
        //     resolve: {
        //         deps: ['$ocLazyLoad', function($ocLazyLoad) {
        //             return $ocLazyLoad.load({
        //                 name: 'MetronicApp',
        //                 insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
        //                 files: [
        //                     '../assets/global/plugins/morris/morris.css',                            
        //                     '../assets/global/plugins/morris/morris.min.js',
        //                     '../assets/global/plugins/morris/raphael-min.js',                            
        //                     '../assets/global/plugins/jquery.sparkline.min.js',
        //                     '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
        //                     '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
        //                     '../assets/pages/scripts/pagination.js',
        //                     'js/controllers/withdrawHistoryController.js',
        //                                           ] 
        //             });
        //         }]
        //     }
        // })
        
        .state('transferHistoryAffiliate', {
            url: "/transferHistoryAffiliate",
            templateUrl: "views/fundTransferHistoryAdminToAffiliate.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "fundTransferToAffiliateHistory",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../assets/pages/scripts/pagination.js',
                            'js/controllers/fundTransferToAffiliateHistory.js',
                                                  ] 
                    });
                }]
            }
        })
        
        .state('transferHistoryPlayer', {
            url: "/transferHistoryPlayer",
            templateUrl: "views/fundTransferHistoryAdmintoPlayer.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "fundTransfertoPlayerHistoryController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../assets/pages/scripts/pagination.js',
                            'js/controllers/fundTransfertoPlayerHistoryController.js',
                                                  ] 
                    });
                }]
            }
        })

        //Pan card Mangement
        .state('approvePAN', {
            url: "/approvePANCard",
            templateUrl: "views/approvePANCard.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "ApprovePANCardCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            // '../assets/global/plugins/morris/morris.css',                            
                            // '../assets/global/plugins/morris/morris.min.js',
                            // '../assets/global/plugins/morris/raphael-min.js',                            
                            // '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/pages/scripts/pagination.js',
                            'js/controllers/approvePANCardCtrl.js',
                                                  ] 
                    });
                }]
            }
        })

        .state('transactionHistoryReport', {
            url: "/transactionHistoryReport",
            templateUrl: "views/transactionHistoryReport.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "transactionHistoryReportController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            // '../assets/global/plugins/morris/morris.css',                            
                            // '../assets/global/plugins/morris/morris.min.js',
                            // '../assets/global/plugins/morris/raphael-min.js',                            
                            // '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/pages/scripts/pagination.js',
                            'js/controllers/transactionHistoryReportController.js',
                                                  ] 
                    });
                }]
            }
        })

        .state('editPlayers', {
            url: "/player/edit/:playerId",
            templateUrl: "views/editPlayer.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "listPlayersController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/listPlayersController.js',
                        ] 
                    });
                }]
            }
        })

        .state('listPlayer', {
            url: "/listPlayer",
            templateUrl: "views/listPlayers.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "listPlayersController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/listPlayersController.js',
                        ] 
                    });
                }]
            }
        })

        .state('listPlayerAff', {
            url: "/listPlayerAfiiliate/:affiliateId",
            templateUrl: "views/listPlayers.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "listPlayersController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/listPlayersController.js',
                        ] 
                    });
                }]
            }
        })

        .state('listSubAffsAff', {
            url: "/listSubAffsAfiiliate/:affiliateId",
            templateUrl: "views/listSubAffiliate.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "SubAffiliateCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/SubAffiliateCtrl.js',
                        ] 
                    });
                }]
            }
        })

        .state('viewPlayers', {
            url: "/player/view/:playerId",
            templateUrl: "views/viewPlayers.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "listPlayersController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/listPlayersController.js',
                        ] 
                    });
                }]
            }
        })

        //________________ AFFILIATE CASH OUT MODULE ___________
        
        .state('cashoutRequest', {
            url: "/cashoutRequest",
            templateUrl: "views/cashoutRequest.html",
            data: {pageTitle: 'Todo'},
            controller: "AffiliateWithdrawalCtrl",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'MetronicApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/apps/scripts/todo-2.min.js',
                            'js/controllers/AffiliateWithdrawalCtrl.js'  
                        ]                    
                    });
                }]
            }
        })

        //________________ AFFILIATE CASH OUT MODULE ___________
        .state('pendingCashOut', {
          url: "/pendingCashOut",
          templateUrl: "views/pendingCashOut.html",
          data: {pageTitle: 'Todo'},
          controller: "AffiliateWithdrawalCtrl",
          resolve: {
              deps: ['$ocLazyLoad', function($ocLazyLoad) {
                  return $ocLazyLoad.load({ 
                      name: 'MetronicApp',  
                      insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                      files: [
                          '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                          '../assets/apps/css/todo-2.css',
                          '../assets/global/plugins/select2/css/select2.min.css',
                          '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                          '../assets/global/plugins/select2/js/select2.full.min.js',
                          
                          '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                          '../assets/apps/scripts/todo-2.min.js',
                          '../assets/pages/scripts/pagination.js',
                          'js/controllers/AffiliateWithdrawalCtrl.js'  
                      ]                    
                  });
              }]
          }
        })

      .state('pendingCashOutAffiliate', {
        url: "/pendingCashOutAffiliate",
        templateUrl: "views/pendingCashOutAffiliate.html",
        data: {pageTitle: 'Todo'},
        controller: "AffiliateWithdrawalCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/AffiliateWithdrawalCtrl.js'  
                    ]                    
                });
            }]
        }
      })

      .state('approveCashout', {
        url: "/approveCashout",
        templateUrl: "views/approveCashout.html",
        data: {pageTitle: 'Todo'},
        controller: "AffiliateWithdrawalApproveCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/AffiliateWithdrawalApproveCtrl.js'  
                    ]                    
                });
            }]
        }
      })

      .state('findPlayerReport', {
        url: "/findPlayerReport",
        templateUrl: "views/playerReport.html",
        data: {pageTitle: 'Todo'},
        controller: "playerReportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/playerReportController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('findPlayerChart', {
        url: "/findPlayerChart",
        templateUrl: "views/playerReportChart.html",
        data: {pageTitle: 'Todo'},
        controller: "playerReportChartController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/playerReportChartController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('findPlayerChartGamesPlayed', {
        url: "/findPlayerChartGamesPlayed",
        templateUrl: "views/playerReportChartGamesPlayed.html",
        data: {pageTitle: 'Todo'},
        controller: "playerReportChartGamesPlayedController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/playerReportChartGamesPlayedController.js'  
                    ]                    
                });
            }]
        }
      })
      
      .state('profileDetailsPlayer', {
        url: "/profileDetailsPlayer",
        templateUrl: "views/personalDetailsCustomerSupport.html",
        data: {pageTitle: 'Todo'},
        controller: "customerSupportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/customerSupportController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('transactionHistoryCustomerSupport', {
        url: "/transactionHistoryCustomerSupport",
        templateUrl: "views/customerSupportTransactionHistory.html",
        data: {pageTitle: 'Todo'},
        controller: "customerSupportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/customerSupportController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('gameProfileDataCustomerSupport', {
        url: "/gameProfileDataCustomerSupport",
        templateUrl: "views/gameProfileDetailsCustomerSupport.html",
        data: {pageTitle: 'Todo'},
        controller: "customerSupportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/customerSupportController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('gameHistoryCustomerSupport', {
        url: "/gameHistoryCustomerSupport",
        templateUrl: "views/gameHistoryCustomerSupport.html",
        data: {pageTitle: 'Todo'},
        controller: "customerSupportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/customerSupportController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('cashoutHistory', {
        url: "/cashoutHistory",
        templateUrl: "views/cashoutHistory.html",
        data: {pageTitle: 'Todo'},
        controller: "cashoutHistoryCtrl",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/cashoutHistoryCtrl.js'  
                    ]                    
                });
            }]
        }
      })

      /*  Analytics states start here   */

      .state('rakeByDate', {
        url: "/rake/summary/date",
        templateUrl: "views/rakeSummaryByDate.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeSummaryByDateController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeSummaryByDateController.js'  
                    ]                    
                });
            }]
        }
      })


      .state('rakeByAffiliateOrPlayer', {
        url: "/rake/summary/affiliateOrPlayer",
        templateUrl: "views/rakeSummaryByAffiliateOrPlayer.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeSummaryByAffiliateOrPlayerController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeSummaryByAffiliateOrPlayerController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('rakeDatewise', {
        url: "/rake/summary/datewise",
        templateUrl: "views/rakeSummaryDatewise.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeSummaryAffiliateDatewiseController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeSummaryAffiliateDatewiseController.js'  
                    ]                    
                });
            }]
        }
      })


      .state('rakeByDateAffMod', {
        url: "/rake/summary/affiliate/date",
        templateUrl: "views/rakeSummaryByDateAffMod.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeSummaryByDateController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeSummaryByDateController.js'  
                    ]                    
                });
            }]
        }
      })


      .state('rakeByAffiliateOrPlayerAffMod', {
        url: "/rake/summary/affiliate/affiliateOrPlayer",
        templateUrl: "views/rakeSummaryByAffiliateOrPlayerAffMod.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeSummaryByAffiliateOrPlayerController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeSummaryByAffiliateOrPlayerController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('rakeDatewiseAffMod', {
        url: "/rake/summary/affiliate/datewise",
        templateUrl: "views/rakeSummaryDatewiseAffMod.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeSummaryAffiliateDatewiseController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeSummaryAffiliateDatewiseController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('rakeReport', {
        url: "/rake/report",
        templateUrl: "views/rakeReport.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeReportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeReportController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('rakeReportAffiliate', {
        url: "/rake/report/affiliate",
        templateUrl: "views/rakeReportAffiliate.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeReportAffiliateController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeReportAffiliateController.js'  
                    ]                    
                });
            }]
        }
      })

       .state('rakeByCashTable', {
        url: "/rake/summary/cashTable",
        templateUrl: "views/rakeSummaryByCashTable.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeSummaryByCashTableController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeSummaryByCashTableController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('gameVariantsRakeReport', {
        url: "/rake/summary/gameVariants",
        templateUrl: "views/rakeSummaryByGameVariants.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeSummaryByGameVariantsController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeSummaryByGameVariantsController.js'  
                    ]                    
                });
            }]
        }
      })


      .state('tableRakeReport', {
        url: "/rake/tableRakeReport",
        templateUrl: "views/rakeTableRakeReport.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeTableRakeReportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeTableRakeReportController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('dailyRakeChart', {
        url: "/rake/dailyRakeChart",
        templateUrl: "views/rakedailyRakeChart.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeDailyRakeChartController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeDailyRakeChartController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('rakeByTimeOfDay', {
        url: "/rake/rakeByTimeOfDay",
        templateUrl: "views/rakeByTimeOfDay.html",
        data: {pageTitle: 'Todo'},
        controller: "RakeByTimeOfDayController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/RakeByTimeOfDayController.js'  
                    ]                    
                });
            }]
        }
      })


      .state('dailyChipsReport', {
        url: "/report/chips/daily",
        templateUrl: "views/dailyChipsReport.html",
        data: {pageTitle: 'Todo'},
        controller: "ChipsReportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',

                        'js/controllers/ChipsReportController.js'  
                      ]                    
                });
            }]
        }
      })

      .state('monthlyChipsReport', {
        url: "/report/chips/monthly",
        templateUrl: "views/monthlyChipsReport.html",
        data: {pageTitle: 'Todo'},
        controller: "MonthlyChipsReportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/MonthlyChipsReportController.js'  
                      ]                    
                });
            }]
        }
      })

      .state('dailyChipsChart', {
        url: "/chart/chips/daily",
        templateUrl: "views/dailyChipsChart.html",
        data: {pageTitle: 'Todo'},
        controller: "DailyChipsChartController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/DailyChipsChartController.js'  
                      ]                    
                });
            }]
        }
      })


      .state('cashoutDirect', {
        url: "/cashoutDirect",
        templateUrl: "views/cashoutDirectAffSubAff.html",
        data: {pageTitle: 'Todo'},
        controller: "cashoutDirectAffSubAffController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/cashoutDirectAffSubAffController.js'  
                    ]                    
                });
            }]
        }
      })

      
      .state('directCashoutHistory', {
        url: "/directCashoutHistory",
        templateUrl: "views/directCashoutHistory.html",
        data: {pageTitle: 'Todo'},
        controller: "directCashoutHistoryController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/directCashoutHistoryController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('dailyCashoutDataReport', {
        url: "/directCashoutDailyReport",
        templateUrl: "views/dailyCashoutReport.html",
        data: {pageTitle: 'Todo'},
        controller: "dailyCashoutController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/dailyCashoutController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('monthlyCashoutDataReport', {
        url: "/monthlyCashoutDataReport",
        templateUrl: "views/monthlyCashoutReport.html",
        data: {pageTitle: 'Todo'},
        controller: "monthlyCashoutReportController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/monthlyCashoutReportController.js'  
                    ]                    
                });
            }]
        }
      })
      
      .state('dailyCashoutChart', {
        url: "/dailyCashoutChart",
        templateUrl: "views/dailyCashoutChart.html",
        data: {pageTitle: 'Todo'},
        controller: "dailyCashoutChartController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/dailyCashoutChartController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('cashoutSubAffiliate', {
        url: "/cashoutSubAffiliate",
        templateUrl: "views/cashoutSubAffiliate.html",
        data: {pageTitle: 'Todo'},
        controller: "cashoutSubAffiliateController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/cashoutSubAffiliateController.js'  
                        ]                    
                });
            }]
        }
      })

      .state('playerGameHistoryCustomerSupport', {
        url: "/playerGameHistoryCustomerSupport",
        templateUrl: "views/playerGameHistoryCustomerSupport.html",
        data: {pageTitle: 'Todo'},
        controller: "PlayerGameHistoryController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/PlayerGameHistoryController.js'  
                    ]                    
                });
            }]
        }
      })

      .state('activityDetails', {
            url: "/activityDetails",
            templateUrl: "views/activityDetails.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "activityDetailsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/dashboard.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/activityDetailsController.js',
                        ] 
                    });
                }]
            }
        })

      .state('playerMagnetChipsHistoryCustomerSupport', {
        url: "/customerSupport/playerMagnetChipsHistory",
        templateUrl: "views/playerMagnetChipsHistory.html",
        data: {pageTitle: 'Todo'},
        controller: "PlayerMagnetChipsHistoryController",
        resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({ 
                    name: 'MetronicApp',  
                    insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/PlayerMagnetChipsHistoryController.js'  
                      ]                    
                });
            }]
        }
      })

      .state('createGameVersion', {
            url: "/createGameVersion",
            templateUrl: "views/createGameVersion.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "GameVersionsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GameVersionsController.js',
                        ] 
                    });
                }]
            }
        })

        .state('listGameVersions', {
            url: "/listGameVersions",
            templateUrl: "views/listGameVersions.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "GameVersionsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GameVersionsController.js',
                        ] 
                    });
                }]
            }
        })

        .state('editGameVersion', {
            url: "/gameVersion/edit/:gameVersionId",
            templateUrl: "views/editGameVersion.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "GameVersionsController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/GameVersionsController.js',
                        ] 
                    });
                }]
            }
        })

        .state('listScheduledMaintenances', {
            url: "/maintenance/list",
            templateUrl: "views/listMaintenance.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "MaintenanceController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',

                            
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/MaintenanceController.js',
                        ] 
                    });
                }]
            }
        })

        .state('scheduleMaintenance', {
            url: "/maintenance/schedule",
            templateUrl: "views/scheduleMaintenance.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "MaintenanceController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/MaintenanceController.js',

                        ] 
                    });
                }]
            }
        })

         .state('editMaintenance', {
            url: "/maintenance/schedule/edit/:maintenanceId",
            templateUrl: "views/editMaintenance.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "MaintenanceController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/pages/scripts/pagination.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/MaintenanceController.js',

                        ] 
                    });
                }]
            }
        })

      // Monthly Player Banned Report
        .state('findMonthlyPlayerBannedReport', {
          url: "/findMonthlyPlayerBannedReport",
          templateUrl: "views/monthlyPlayerBannedReport.html",            
          data: {pageTitle: 'Todo'},
          controller: "PlayerBannedReportController",
          resolve: {
            deps: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load({
                    name: 'MetronicApp',
                    insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                    files: [
                        '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                        '../assets/apps/css/todo-2.css',
                        '../assets/global/plugins/select2/css/select2.min.css',
                        '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                        '../assets/global/plugins/select2/js/select2.full.min.js',
                        
                        '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                        '../assets/apps/scripts/todo-2.min.js',
                        '../assets/pages/scripts/pagination.js',
                        'js/controllers/playerBannedReportController.js'
                    ]
                });
            }]
          }
        })

        .state('broadcastToGame', {
            url: "/broadcastToGame",
            templateUrl: "views/sendBroadcastToGame.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "BroadcastManagementController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'MetronicApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            '../assets/global/plugins/clockface/css/clockface.css',
                            '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '../assets/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '../assets/global/plugins/clockface/js/clockface.js',
                            '../assets/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
                            '../assets/global/plugins/morris/morris.css',
                            '../assets/global/plugins/morris/morris.css',                            
                            '../assets/global/plugins/morris/morris.min.js',
                            '../assets/global/plugins/morris/raphael-min.js',                            
                            '../assets/global/plugins/jquery.sparkline.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/BroadcastManagementController.js',
                                                  ] 
                    });
                }]
            }
        })

      /* Third level affiliate states start here */

      // .state('createThirdLevelAffiliateByAdmin', {
      //       url: "/createThirdLevelAffiliateByAdmin",
      //       templateUrl: "views/createSubAffiliateByAdmin.html",
      //       data: {pageTitle: 'Todo'},
      //       controller: "SubAffiliateCtrl",
      //       resolve: {
      //           deps: ['$ocLazyLoad', function($ocLazyLoad) {
      //               return $ocLazyLoad.load({ 
      //                   name: 'MetronicApp',  
      //                   insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
      //                   files: [
      //                       '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
      //                       '../assets/apps/css/todo-2.css',
      //                       '../assets/global/plugins/select2/css/select2.min.css',
      //                       '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

      //                       '../assets/global/plugins/select2/js/select2.full.min.js',
                            
      //                       '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
      //                       '../assets/apps/scripts/todo-2.min.js',
      //                       'js/affiliateModule.js',
      //                       'js/controllers/SubAffiliateCtrl.js'  
      //                   ]                    
      //               });
      //           }]
      //       }
      //   })

      //   .state('createThirdLevelAffiliateByAffiliate', {
      //       url: "/createThirdLevelAffiliateByAffiliate",
      //       templateUrl: "views/createSubAffiliateByAffiliate.html",
      //       data: {pageTitle: 'Todo'},
      //       controller: "SubAffiliateCtrl",
      //       resolve: {
      //           deps: ['$ocLazyLoad', function($ocLazyLoad) {
      //               return $ocLazyLoad.load({ 
      //                   name: 'MetronicApp',  
      //                   insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
      //                   files: [
      //                       '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
      //                       '../assets/apps/css/todo-2.css',
      //                       '../assets/global/plugins/select2/css/select2.min.css',
      //                       '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

      //                       '../assets/global/plugins/select2/js/select2.full.min.js',
                            
      //                       '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
      //                       '../assets/apps/scripts/todo-2.min.js',
      //                       'js/affiliateModule.js',
      //                       'js/controllers/SubAffiliateCtrl.js'  
      //                   ]                    
      //               });
      //           }]
      //       }
      //   })

      //   .state('createThirdLevelAffiliateBySubAffiliate', {
      //       url: "/createThirdLevelAffiliateBySubAffiliate",
      //       templateUrl: "views/createSubAffiliateByAffiliate.html",
      //       data: {pageTitle: 'Todo'},
      //       controller: "SubAffiliateCtrl",
      //       resolve: {
      //           deps: ['$ocLazyLoad', function($ocLazyLoad) {
      //               return $ocLazyLoad.load({ 
      //                   name: 'MetronicApp',  
      //                   insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
      //                   files: [
      //                       '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
      //                       '../assets/apps/css/todo-2.css',
      //                       '../assets/global/plugins/select2/css/select2.min.css',
      //                       '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

      //                       '../assets/global/plugins/select2/js/select2.full.min.js',
                            
      //                       '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
      //                       '../assets/apps/scripts/todo-2.min.js',
      //                       'js/affiliateModule.js',
      //                       'js/controllers/SubAffiliateCtrl.js'  
      //                   ]                    
      //               });
      //           }]
      //       }
      //   })

      /* Third level affiliate states end here */



  

}]);

/* Init global settings and run the app */
MetronicApp.run(["$rootScope", "settings", "$state", "$window", '$location', function($rootScope, settings, $state, $window,$location) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
    $window.addEventListener("offline", function() {
        // swal({title:"Info", text:"Please Check your Internet Connection",showConfirmButton:false});
        swal({title:"Warning",
        text:"Please Check your Internet Connection.",
        showConfirmButton:true},function(result){    
        if (result) {
         // $state.go('login');
         // $window.close()
         $window.location.reload();
        }
      });
    }, false);

    $window.addEventListener("online", function() {
      $location.path('/login.html');  
    }, false);

    $window.onload = function(e) {
      console.error( $location.$$path.search("resetPassword"));
      if($location.$$path.search("resetPassword") < 0){
        $location.path('/login.html');
      }
        //your magic here
    }
}]);;/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', ['$rootScope', '$state',
    function($rootScope, $state) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function(event) {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setAngularJsSidebarMenuActiveLink('match', null, event.currentScope.$state); // activate selected link in the sidebar menu
                   
                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);     
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });
            }
        };
    }
])

// Handle global LINK click
MetronicApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };  
});

// Handle file download to CSV
MetronicApp.directive('exportToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                var table = e.target.nextElementSibling;
                var csvString = '';
                for(var i=0; i<table.rows.length;i++){
                    var rowData = table.rows[i].cells;
                    for(var j=0; j<rowData.length;j++){
                        csvString = csvString + rowData[j].innerHTML + ",";
                    }
                    csvString = csvString.substring(0,csvString.length - 1);
                    csvString = csvString + "\n";
                }
                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'historyStatistics.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
    });

;var modules = [
	// {
	// 	"name": "Game Management",
	// 	"code": 101,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 		"name": "Table",
	// 		"code": 102,
	// 		"route": "listTable",
	// 		"iconClass": "icon-puzzle",
	// 		"status": true
	// 	}]
	// },
	// {
	// 	"name": "Spam Management",
	// 	"code": 501,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 		"name": "Spam Words",
	// 		"code": 501,
	// 		"route": "spamWords",
	// 		"iconClass": "icon-home",
	// 		"status": true
	// 	}]
	// },
	// {
	// 	"name": "Bonus Management",
	// 	"code": 401,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 			"name": "Generate Code",
	// 			"code": 402,
	// 			"route": "generateBonusCode",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		},
	// 		{
	// 			"name": "Deposit Code List",
	// 			"code": 403,
	// 			"route": "listBonusDeposit",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		},
	// 		{
	// 			"name": "Bonus History",
	// 			"code": 404,
	// 			"route": "bonusHistory",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		}
	// 	]
	// },
	{
		"name": "Scratch Card Management",
		"code": 701,
		"iconClass": "icon-settings",
		"status": true,
		"subModule": [{
				"name": "Generate Scratch Card",
				"code": 702,
				"route": "generateCardPromotions",
				"iconClass": "icon-puzzle",
				"status": true,
				"subModule": [
				// {
				// 		"name": "Promotions",
				// 		"code": 7023,
				// 		"route": "generateCardPromotions",
				// 		"iconClass": "icon-puzzle",
				// 		"status": true
				// 	},
					{
						"name": "Affiliate",
						"code": 7021,
						"route": "generateCardAffiliate",
						"iconClass": "icon-puzzle",
						"status": true
					}
					// {
					// 	"name": "Emergency",
					// 	"code": 7022,
					// 	"route": "generateCardEmergency",
					// 	"iconClass": "icon-puzzle",
					// 	"status": true
					// },
					// {
					// 	"name": "High-Rollers",
					// 	"code": 7024,
					// 	"route": "generateCardHighRollers",
					// 	"iconClass": "icon-puzzle",
					// 	"status": true
					// }
				]
			},
			// {
			// 	"name": "Approve Scratch Card",
			// 	"code": 703,
			// 	"route": "approveScratchCard",
			// 	"iconClass": "icon-puzzle",
			// 	"status": true
			// },
			{
				"name": "Scratch History",
				"code": 704,
				"route": "scratchCardHistory",
				"iconClass": "icon-puzzle",
				"status": true
			}
		]
	},
	// {
	// 	"name": "Loyalty Points Management",
	// 	"code": 801,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 			"name": "Create Loyalty Points",
	// 			"code": 802,
	// 			"route": "createLoyaltyPoints",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		},
	// 		{
	// 			"name": "List Loyalty Points",
	// 			"code": 803,
	// 			"route": "listLoyaltyPoints",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		}
	// 	]
	// },
	// {
	// 	"name": "PAN Card Management",
	// 	"code": 901,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 		"name": "PAN card Approval",
	// 		"code": 902,
	// 		"route": "approvePAN",
	// 		"iconClass": "icon-puzzle",
	// 		"status": true
	// 	}]
	// },
	{
		"name": "Chips Management",
		"code": 1000,
		"iconClass": "icon-settings",
		"status": true,
		"subModule": [{
				"name": "Transfer To Player",
				"code": 1001,
				"route": "transferFund",
				"iconClass": "icon-puzzle",
				"status": true
			},
			// {
			// 	"name": "Transfer To Affiliate",
			// 	"code": 1002,
			// 	"route": "transferFundToAffiliate",
			// 	"iconClass": "icon-puzzle",
			// 	"status": true
			// },
			{
				"name": "Withdraw Chips",
				"code": 1003,
				"route": "withdrawChips",
				"iconClass": "icon-puzzle",
				"status": true
			},
			{
				"name": "Withdraw History",
				"code": 1004,
				"route": "withdrawChipsHistory",
				"iconClass": "icon-puzzle",
				"status": true
			},
			{
				"name": "Transfer History Player",
				"code": 1005,
				"route": "transferHistoryPlayer",
				"iconClass": "icon-puzzle",
				"status": true
			},
			{
				"name": "Transfer History Affiliate",
				"code": 1006,
				"route": "transferHistoryAffiliate",
				"iconClass": "icon-puzzle",
				"status": true
			}
		]
	},
	// {
	// 	"name": "User Management",
	// 	"code": 601,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 			"name": "Create user",
	// 			"code": 602,
	// 			"route": "createAffiliate",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		},
	// 		{
	// 			"name": "List User",
	// 			"code": 603,
	// 			"route": "listAffiliate",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		}
	// 	]
	// },
	// {
	// 	"name": "New User Management",
	// 	"code": 1101,
	// 	"iconClass": "icon-settings",
	// 	"status": true,
	// 	"subModule": [{
	// 			"name": "Create user",
	// 			"code": 1102,
	// 			"route": "createUser",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		},
	// 		{
	// 			"name": "Create Affiliate",
	// 			"code": 603,
	// 			"route": "listAffiliate",
	// 			"iconClass": "icon-puzzle",
	// 			"status": true
	// 		}
	// 	]
	// }
];
 
// console.log(modules);

if (typeof(Storage) !== "undefined") {
    localStorage.setItem("modules", JSON.stringify(modules));
} else {
    console.log("no Storage found.");
};var TableAjax = function () {

    var initPickers = function () {
        //init date pickers
        $('.date-picker').datepicker({
            rtl: App.isRTL(),
            autoclose: true
        });
    }

    var handleRecords = function () {

        var grid = new Datatable();

        grid.init({
            src: $("#datatable_ajax"),
            onSuccess: function (grid) {
                // execute some code after table records loaded
            },
            onError: function (grid) {
                // execute some code on network or other general error  
            },
            loadingMessage: 'Loading...',
            dataTable: { // here you can define a typical datatable settings from http://datatables.net/usage/options 

                // Uncomment below line("dom" parameter) to fix the dropdown overflow issue in the datatable cells. The default datatable layout
                // setup uses scrollable div(table-scrollable) with overflow:auto to enable vertical scroll(see: assets/global/scripts/datatable.js). 
                // So when dropdowns used the scrollable div should be removed. 
                //"dom": "<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'<'table-group-actions pull-right'>>r>t<'row'<'col-md-8 col-sm-12'pli><'col-md-4 col-sm-12'>>",
                
                "bStateSave": true, // save datatable state(pagination, sort, etc) in cookie.

                "lengthMenu": [
                    [10, 20, 50, 100, 150, -1],
                    [10, 20, 50, 100, 150, "All"] // change per page values here
                ],
                "pageLength": 10, // default record count per page
                "ajax": {
                    "url": "demo/table_ajax.php", // ajax source
                },
                "order": [
                    [1, "asc"]
                ] // set first column as a default sort by asc
            }
        });

        // handle group actionsubmit button click
        grid.getTableWrapper().on('click', '.table-group-action-submit', function (e) {
            e.preventDefault();
            var action = $(".table-group-action-input", grid.getTableWrapper());
            if (action.val() != "" && grid.getSelectedRowsCount() > 0) {
                grid.setAjaxParam("customActionType", "group_action");
                grid.setAjaxParam("customActionName", action.val());
                grid.setAjaxParam("id", grid.getSelectedRows());
                grid.getDataTable().ajax.reload();
                grid.clearAjaxParams();
            } else if (action.val() == "") {
                App.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'Please select an action',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            } else if (grid.getSelectedRowsCount() === 0) {
                App.alert({
                    type: 'danger',
                    icon: 'warning',
                    message: 'No record selected',
                    container: grid.getTableWrapper(),
                    place: 'prepend'
                });
            }
        });
    }

    return {

        //main function to initiate the module
        init: function () {

            initPickers();
            handleRecords();
        }

    };

}();;angular.module('MetronicApp').controller('AffiliateCtrl', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$http", "$stateParams", "$filter", function($location, $window, $cookies, $rootScope, $scope, $http, $stateParams, $filter) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    if(!$rootScope.isAdminLogin){
      console.log('yes', $rootScope.role)
      $location.path('/login.html')
      return
    }
    // // console.log("yessss",$rootScope.isAdminLogin)
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.affiliateData = {};
    $scope.affiliateData.module = [];
    $scope.selectedList = {};

    $scope.xyz = true;
    $scope.checkEdit = false;
 
    $('.date-picker').datepicker({'autoclose' : true});


    // console.log("line 25 == ", $rootScope.moduleAccess)
    // console.log("line 26 == ", $scope.affilateModuleAccess);
    // $scope.affilateModuleAccess = $rootScope.affilateModuleAccess;
    var tempModuleAccess = JSON.stringify($rootScope.affilateModuleAccess);
    tempModuleAccess = JSON.parse(tempModuleAccess);
    for(var i in tempModuleAccess){
      for(var j in tempModuleAccess[i].subModule){
        if(rootTools.filterModuleAffiliate.indexOf(tempModuleAccess[i].subModule[j].code) > -1){
          tempModuleAccess[i].subModule[j].status = false;
        }
      }
    }
    $scope.affilateModuleAccess = tempModuleAccess;
    // console.log("line 38 ", $scope.affilateModuleAccess);
    

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    
    $scope.newPageList = function () {
      $scope.listUsers("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

     $scope.newPageListSubAffiliates = function () {
      $scope.listSubAffiliates("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    var createdBy = {
        // name     : $cookies.get('poker_name'),
        name     : $rootScope.poker_name,
        // userName : $cookies.get('poker_userName'),
        userName : $rootScope.poker_userName,
        // role     : JSON.parse($cookies.get('poker_role')),
        role     : JSON.parse($rootScope.poker_role),
        // id       : $cookies.get('poker_email')
        id       : $rootScope.poker_email
    };
    
    // // console.log(JSON.stringify(createdBy));


     $scope.affiliateData = {
        name            : "",
        userName        : "",
        mobile          : null,
        email           : "",
        password        : "",
        panCard         : "",
        role            : {name : "affiliate", level : 0},
        dob             : null,
        creditLimit     : null,
        // countryName     : "",
        cityName        : "",
        rakeCommision   : null,
        realChips       : 0,
        profit          : 0,
        withdrawal      : 0,
        status          : null,
        address         : "",
        createdBy       : createdBy,
        createdAt       : Number(new Date()),
        upDateAt        : Number(new Date()),
        withdrawalChips : 0,
        pulledRealChips : 0,
        deposit         : 0
    };

    $scope.subAffiliateData = {
        name            : "",
        userName        : "",
        mobile          : null,
        email           : "",
        password        : "",
        panCard         : "",
        role            : {name : "subAffiliate", level : -1},
        // parentUser      : $cookies.get('poker_userName'),
        parentUser      : $rootScope.poker_userName,
        dob             : null,
        creditLimit     : null,
        // countryName     : "",
        cityName        : "",
        rakeCommision   : null,
        realChips       : 0,
        profit          : 0,
        withdrawal      : 0,
        status          : null,
        address         : "",
        createdBy       : createdBy,
        createdAt       : Number(new Date()),
        upDateAt        : Number(new Date()),
        withdrawalChips : 0,
        pulledRealChips : 0,
        deposit         : 0
    };

    $scope.subAffiliateDataAdmin = {
        name            : "",
        userName        : "",
        mobile          : null,
        email           : "",
        password        : "",
        panCard         : "",
        role            : {name : "subAffiliate", level : -1},
        parentUser      : "",
        dob             : null,
        creditLimit     : null,
        // countryName     : "",
        cityName        : "",
        rakeCommision   : null,
        realChips       : 0,
        profit          : 0,
        withdrawal      : 0,
        status          : null,
        address         : "",
        createdBy       : createdBy,
        createdAt       : Number(new Date()),
        upDateAt        : Number(new Date()),
        withdrawalChips : 0,
        pulledRealChips : 0,
        deposit         : 0
    };


    var assignAffiliateData = function(){
      $scope.affiliateData = {
        name            : "",
        userName        : "",
        mobile          : null,
        email           : "",
        password        : "",
        panCard         : "",
        role            : {name : "affiliate", level : 0},
        dob             : null,
        creditLimit     : null,
        // countryName     : "",
        cityName        : "",
        rakeCommision   : null,
        realChips       : 0,
        profit          : 0,
        withdrawal      : 0,
        status          : null,
        address         : "",
        createdBy       : createdBy,
        createdAt       : Number(new Date()),
        upDateAt        : Number(new Date()),
        withdrawalChips : 0,
        pulledRealChips : 0,
        deposit         : 0
      };

      $scope.subAffiliateData = {
        name            : "",
        userName        : "",
        mobile          : null,
        email           : "",
        password        : "",
        panCard         : "",
        role            : {name : "subAffiliate", level : -1},
        // parentUser      : $cookies.get('poker_userName'),
        parentUser      : $rootScope.poker_userName,
        dob             : null,
        creditLimit     : null,
        // countryName     : "",
        cityName        : "",
        rakeCommision   : null,
        realChips       : 0,
        profit          : 0,
        withdrawal      : 0,
        status          : null,
        address         : "",
        createdBy       : createdBy,
        createdAt       : Number(new Date()),
        upDateAt        : Number(new Date()),
        withdrawalChips : 0,
        pulledRealChips : 0,
        deposit         : 0
      };

      $scope.subAffiliateDataAdmin = {
        name            : "",
        userName        : "",
        mobile          : null,
        email           : "",
        password        : "",
        panCard         : "",
        role            : {name : "subAffiliate", level : -1},
        parentUser      : "",
        dob             : null,
        creditLimit     : null,
        // countryName     : "",
        cityName        : "",
        rakeCommision   : null,
        realChips       : 0,
        profit          : 0,
        withdrawal      : 0,
        status          : null,
        address         : "",
        createdBy       : createdBy,
        createdAt       : Number(new Date()),
        upDateAt        : Number(new Date()),
        withdrawalChips : 0,
        pulledRealChips : 0,
        deposit         : 0
      };

    }


    // $scope.checkParent = function(module,subModule,subSubModule) {
        
    //    if(module > 0){ 
    //      if($scope.selectedList.hasOwnProperty(module.toString())){           
    //        $scope.selectedList[module.toString()] = !$scope.selectedList[module.toString()];
    //      }else{
    //        $scope.selectedList[module.toString()] = true;
    //      }
    //    }

    //    if(subModule > 0){  
    //      if($scope.selectedList.hasOwnProperty(subModule.toString())){
    //        $scope.selectedList[subModule.toString()] = !$scope.selectedList[subModule.toString()];
    //      }else{     
    //        $scope.selectedList[subModule.toString()] = true;
    //      }
    //    }

    //    if(subSubModule > 0){    
    //       if($scope.selectedList.hasOwnProperty(subSubModule.toString())){
    //           $scope.selectedList[subSubModule.toString()] = !$scope.selectedList[subSubModule.toString()];
    //        }else{     
    //           $scope.selectedList[subSubModule.toString()] = true;
    //       }
    //    }

    // }

    $scope.changeModule = function(check, module, module1, module2) {
     // if(check) {
        if(module2) {
          var checked = false;
          // console.log(check, module2)
          module1.subModule.forEach(function(o) {
            if($scope.selectedList[o.code]) {
              checked = true;
            }
          })
          // console.log(checked)
          $scope.selectedList[module1.code] = checked;
          // selectedList[module.code] = checked;
        }

        if(module1) {
          var checked = false;
          module.subModule.forEach(function(o) {
            if($scope.selectedList[o.code]) {
              checked = true;
            }
          })
          $scope.selectedList[module.code] = checked;
        }
        if(!module1 && !module2 && module.subModule) {
          module.subModule.forEach(function(o) {
            $scope.selectedList[o.code] = check;
            if(o.subModule) {
               o.subModule.forEach(function(SubO) {
                  $scope.selectedList[SubO.code] = check;
               });
            }
          })
        } else if(!module2 && module1 && module1.subModule) {
          module1.subModule.forEach(function(o) {
            $scope.selectedList[o.code] = check;
          })
        }
        
    // }
    }
   
    // _______________ create affiliate ____________
    $scope.submit = function(){
        
        var selected = [];
        $('input:checked').each(function() {
          // console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.affiliateData.module = selected.filter(function(n){ return n != undefined });
        // $scope.affiliateData.role   = {name : "affilate", level : 0};

        if(Number(new Date($scope.affiliateData.dob)) > 0){
          $scope.affiliateData.dob  = Number(new Date($scope.affiliateData.dob));
        }

        // delete $scope.affiliateData.cnfpassword;

        // console.log(JSON.stringify($scope.affiliateData));

        $http({
            method : "post",
            url : "/createNewAffiliate",
            data:  $scope.affiliateData,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            
            if(res.data.success){
                swal("Success!", "Affiliate Created Successfully");
                // $scope.affiliateData={};
                $scope.affiliateData.module = "";
                $scope.affiliateData.dob = "";
                $scope.affiliateForm.$setPristine();
                for(var i in $scope.selectedList){
                  $scope.selectedList[i] = false;
                }
                $scope.affiliateData.role = {};
                $scope.affiliateData.role.name = "affiliate";
                $scope.affiliateData.cnfpassword = "";
                assignAffiliateData();
                //$location.path('/listOfAffiliate');
            }else{
                swal(res.data.info)
                $scope.affiliateData.dob  = new Date($scope.affiliateData.dob);
                $scope.affiliateData.dob = $scope.affiliateData.dob.toISOString().split('T')[0];
            }

        }, function myError(err) {
            // console.log(err,"err")
                // swal(err);
                swal("Error!", "Getting error from server in login!");
        });
    }


    //get count of affiliate
    $scope.getAffiliateCount = function(){
      $http.get("/getAffiliateCount")
        .success(function(res){
        if(res.success){
             console.log("line 235== ", res.result);
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
            $scope.totalPage = 0;
            swal("Missing Keys");
          }
        }).error(function(err){
        swal("Error!", "Getting error from server in showing history",err.stack);
      });
    }

    $scope.getSubAffiliateCount = function(){
      $http.get("/getSubAffiliateCount")
        .success(function(res){
        if(res.success){
             // console.log("res.result line226== ", res.result);
             $scope.totalPage = res.result;
             $scope.newPageListSubAffiliates();
          } else{
            $scope.totalPage = 0;
            swal("Missing Keys");
          }
        }).error(function(err){
        swal("Error!", "Getting error from server in showing history",err.stack);
      });
    }

    //______________ get list of affliate _____________
    $scope.listUsers = function(id,dataSkip, dataLimit,cb){
      var data = {};
      data.roleName = "affiliate";
      data.skip = dataSkip;
      data.limit = dataLimit;
      if(id){
        data._id = id;
      }
      if($scope.status){
        data.status = $scope.status;
      }
      if($scope.name){
        data.name = $scope.name;
      }
      if($scope.email){
        data.email = $scope.email;
      }
      if($scope.loginId){
        data.loginId = $scope.loginId;
      }


      $http({
         method : "post",
         url : "/listAffiliate",
         data:  data,
         headers: {'Content-Type': 'application/json'}
     }).then(function mySucces(res) {
         
      if(res.data.success){
        // console.log(res.data);
        $scope.dataList = res.data.result;
        if(res.data.result.length == 1){
          $scope.totalPage = 0;
        }
        if(res.data.result.length == 0){
          $scope.totalPage = 0;
          swal("No data found.");
        }
        if(id){
          $scope.affiliateData = $scope.dataList[0];
          $scope.affiliateData.dob = $filter('date')($scope.affiliateData.dob, "yyyy-MM-dd");;
          for(var i in res.data.result[0].module){
            $scope.selectedList[res.data.result[0].module[i]] = true;
          }
        }
      }else{
        swal("Error!", res.data.info);
       }
       if(cb instanceof Function){
            cb();
          }

          }, function myError(err) {
            // console.log(err,"err")
                swal("Error!", "Getting error from server in login");
        });

    }

    $scope.listSubAffiliates = function(id,dataSkip, dataLimit){
      var data = {};
      data.roleName = "affiliate";
      data.skip = dataSkip;
      data.limit = dataLimit;
      // console.log("line 280 == ", $cookies.get('poker_role'), $cookies.get('poker_role').level);
      // if(JSON.parse($cookies.get('poker_role')).level == 0){
      if(JSON.parse($rootScope.poker_role).level == 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        $scope.setDisabled = true;
      }

      if(id){
        data._id = id;
      }

      if($scope.status){
        data.status = $scope.status;
      }
      if($scope.name){
        data.name = $scope.name;
      }
      if($scope.email){
        data.email = $scope.email;
      }
      if($scope.loginId){
        data.loginId = $scope.loginId;
      }

      $http({
         method : "post",
         url : "/listSubAffiliate",
         data:  data,
         headers: {'Content-Type': 'application/json'}
     }).then(function mySucces(res) {
         
      if(res.data.success){
        // console.log(res.data);
        $scope.dataList = res.data.result;
        $scope.totalPage = 0;
        // $scope.totalPage = res.data.result.length;
        if(id){
          $scope.subAffiliateDataAdmin = $scope.dataList[0];
          $scope.subAffiliateDataAdmin.dob = $filter('date')($scope.subAffiliateDataAdmin.dob, "yyyy-MM-dd");;
          for(var i in res.data.result[0].module){
                $scope.selectedList[res.data.result[0].module[i]] = true;
            }
        }
      }else{
        swal("Error!", res.data.info);
       }

          }, function myError(err) {
            // console.log(err,"err")
                swal("Error!", "Getting error from server in login");
        });

    }


    //_____________ check age limit _________
    
    $scope.checkAge = function(birthDate) { 
      var today = new Date();
      var birthDate = new Date(birthDate);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
      {
          age--;
      }
      if(age < 18){
        swal("Info!", "You are less than 18 years so your account cannot be created.");
        $scope.affiliateData.dob = null;
        $scope.subAffiliateData.dob = null;
        $scope.subAffiliateDataAdmin.dob = null;
      }
    }

    $scope.cancelSubmit = function(){
      $scope.affiliateData={};
      $location.path('/listOfAffiliate');
    }


    // _______________ create affiliate ____________
    $scope.submitUpdate = function(){
        var selected = [];
        $('input:checked').each(function() {
          // console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.affiliateData.module = selected.filter(function(n){ return n != undefined });

        if(Number(new Date($scope.affiliateData.dob)) > 0 && $scope.affiliateData.dob !== null){
          $scope.affiliateData.dob    = Number(new Date($scope.affiliateData.dob));
        }
      
        // console.log(JSON.stringify($scope.affiliateData));

        $http({
            method : "post",
            url : "/updateAffiliate",
            data:  $scope.affiliateData,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            
            if(res.data.success){
                swal("Success!", "Affiliate successfully updated");
                $scope.affiliateData={};
                $location.path('/listOfAffiliate');
            }else{
                swal(res.data.info)
            }

        }, function myError(err) {
            // console.log(err,"err")
                swal("Error!", "Getting error from server in login!");
        });
    }

    $scope.updateSubAffiliateByAdmin = function(){
        var selected = [];
        $('input:checked').each(function() {
          // console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.subAffiliateDataAdmin.module = selected.filter(function(n){ return n != undefined });

        var data = angular.copy($scope.subAffiliateDataAdmin);
        
        if(Number(new Date($scope.subAffiliateDataAdmin.dob)) > 0 && $scope.subAffiliateDataAdmin.dob !== null){
          data.dob    = Number(new Date($scope.subAffiliateDataAdmin.dob));
        }
        
        // console.log(JSON.stringify(data));

      
        // // console.log(JSON.stringify($scope.subAffiliateDataAdmin));

        $http({
            method : "post",
            url : "/updateSubAffiliate",
            data:  data,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
        // $scope.myWelcome = response.data;
            
            if(res.data.success){
                swal("Success!", "Sub-affiliate Successfully updated");
                $scope.affiliateData={};
                $location.path('/listSubAffiliate');
            }else{
                swal(res.data.info)
            }

            //// console.log(moduleObj,"moduleObj")
        }, function myError(err) {
            // $scope.myWelcome = response.statusText;
            // console.log(err,"err")
                // swal(err);
                swal("Error!", "Getting error from server in login!");
            // swal("Getting error from server in login");
        });
    }

  // ________________ load data if edit page ________________
    if($stateParams.affilateId){
      $scope.checkEdit = true;
      $scope.listUsers($stateParams.affilateId,0,0);
    }

    if($stateParams.subAffilateId){
      $scope.checkEdit = true;
      $scope.listSubAffiliates($stateParams.subAffilateId,0,0);
    }


/*this function create sub-affiliate by admin*/

  $scope.submitByAdmin = function(){
    var selected = [];
        $('input:checked').each(function() {
          // console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.subAffiliateDataAdmin.module = selected.filter(function(n){ return n != undefined });

        if(Number(new Date($scope.subAffiliateDataAdmin.dob)) > 0){
          $scope.subAffiliateDataAdmin.dob  = Number(new Date($scope.subAffiliateDataAdmin.dob));
        }

        // console.log(JSON.stringify($scope.subAffiliateDataAdmin));

        $http({
            method : "post",
            url : "/createSubAffiliate",
            data:  $scope.subAffiliateDataAdmin,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            
            if(res.data.success){
                swal("Success!", "Successfully created sub-affilate!");
                $scope.subAffiliateDataAdmin={};
                $scope.affiliateForm.$setPristine();
                for(var i in $scope.selectedList){
                  $scope.selectedList[i] = false;
                }
                $scope.subAffiliateDataAdmin.role = {};
                $scope.subAffiliateDataAdmin.role.name = "subAffiliate";
                assignAffiliateData();
                //$location.path('/listSubAffiliate');
            }else{
                swal(res.data.info)
            }

        }, function myError(err) {
            // console.log(err,"err")
                // swal(err);
                swal("Error!", "Getting error from server!");
        });
  }


  $scope.submitByAffiliate = function(){
    var selected = [];
        $('input:checked').each(function() {
          // console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.subAffiliateData.module = selected.filter(function(n){ return n != undefined });

        if(Number(new Date($scope.subAffiliateData.dob)) > 0){
          $scope.subAffiliateData.dob  = Number(new Date($scope.subAffiliateData.dob));
        }

        // console.log(JSON.stringify($scope.subAffiliateData));

        $http({
            method : "post",
            url : "/createSubAffiliate",
            data:  $scope.subAffiliateData,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            
            if(res.data.success){
                swal("Success!", "Successfully created sub-affilate!");
                $scope.subAffiliateData={};
                $scope.affiliateForm.$setPristine();
                for(var i in $scope.selectedList){
                  $scope.selectedList[i] = false;
                }
                $scope.subAffiliateData.role = {};
                $scope.subAffiliateData.role.name = "subAffiliate";
                assignAffiliateData();
                //$location.path('/listSubAffiliate');
            }else{
                swal(res.data.info)
            }

        }, function myError(err) {
            // console.log(err,"err")
                // swal(err);
                swal("Error!", "Getting error from server!");
        });
  }

    $scope.searchFunction = function(){
      if(!$scope.status && !$scope.name && !$scope.email && !$scope.loginId){
        swal("Please provide at least one input.")
      }
      else{
        $scope.getAffiliateCount();
      }
    }

    $scope.reset = function(){
      $scope.status = "";
      $scope.name = "";
      $scope.email = "";
      $scope.loginId= "";
      $scope.getAffiliateCount();
    }

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};

          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }


    $scope.exportData = function (tableId) {
      $scope.listUsers("", 0, 0, function(){
        $window.scrollTo(0, 0);
        setTimeout(function() {
          location.href=Excel(tableId,'sheet_name');
        }, 500);
      });
    };


}]);






;angular.module('MetronicApp').controller('AffiliateWithdrawalApproveCtrl', ["$location", "$cookies", "$rootScope", "$scope", "$http", "$stateParams", "$filter", function($location, $cookies, $rootScope, $scope, $http, $stateParams, $filter) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    // console.log("yessss",$rootScope.isAdminLogin)
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
        console.log('yes', $rootScope.role)
        $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    
    $scope.newPageList = function () {
      $scope.listApproveCashOutRequest(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
    }

    var affiliate = {
        // name     : $cookies.get('poker_name'),
        name     : $rootScope.poker_name,
        // userName : $cookies.get('poker_userName'),
        userName : $rootScope.poker_userName,
        // role     : JSON.parse($cookies.get('poker_role')),
        role     : JSON.parse($rootScope.poker_role),
        // id       : $cookies.get('poker_email'),
        id       : $rootScope.poker_email,
        // mobile   : $cookies.get('poker_loggedinUserMobileNum')
        mobile   : $rootScope.poker_loggedinUserMobileNum
    };

    console.log("*^*^*^*^*^*^*^*^*^*^*^*^*^*",JSON.stringify(affiliate));

   // get count of cashout request
    // $scope.getApproveCashoutCount = function(){
    //   console.log("getApproveCashoutCount-----------");
    //   $http.get("/approveCashoutCount")
    //     .success(function(res){
    //     if(res.success){
    //          $scope.totalPage = res.result;
    //          console.log("getApproveCashoutCount_______________"+$scope.totalPage);
    //          $scope.newPageList();
    //       } else{
    //         swal("Missing Keys");
    //       }
    //     }).error(function(err){
    //     swal("Error!", "Getting error from server in showing history",err.stack);
    //   });
    // }

    $scope.getApproveCashoutCount = function(){
      console.log("getApproveCashoutCount-----------");
      var data = {};
      if($scope.referenceNo){
        data.referenceNo = $scope.referenceNo;
      }
      $http({
           method : "post",
           url : "/approveCashoutCount",
           data:  data,
           headers: {'Content-Type': 'application/json'}
       }).then(function mySucces(res) {
          if(res.data.success){
            $scope.totalPage = res.data.result;
            console.log("getApproveCashoutCount_______________"+$scope.totalPage);
            if(res.data.result == 0){
              swal("No data found!")
            }
            $scope.newPageList(); 
          }
          else{
            swal("Error!", res.info);
          }

        }, function myError(err) {
          console.log(err,"err")
              swal("Error!", "Getting error from server in showing history");
      });
      
    }

    //______________ Get List Pending Req _____________
    $scope.listApproveCashOutRequest = function(dataSkip, dataLimit){
      var data = {};
      if($scope.referenceNo){
        data.referenceNo = $scope.referenceNo;
      }
      data.skip = dataSkip;
      data.limit = dataLimit;
  
      $http({
           method : "post",
           url : "/listApproveCashOutRequest",
           data:  data,
           headers: {'Content-Type': 'application/json'}
       }).then(function mySucces(res) {
           
          if(res.data.success){
            console.log(res.data);
            $scope.dataList = res.data.result;    
          }else{
            swal("Error!", res.data.info);
          }

        }, function myError(err) {
          console.log(err,"err")
              swal("Error!", "Getting error from server in login");
      });

    } 

    //____________ page action ________
    
    $scope.transfer = function(index,id,data){
       swal({
          title: "Transaction",
          text: '<div><h4><label>Transaction ID: </label><br><input type="text" id="transactionId" required><br><label>Supervised By: </label><br><input type="text" id="supervisedby" required></h4></div>',
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Proceed",
          closeOnConfirm: false,
          inputType : "text",
          html: true,
       }, function(){

          $scope.transactionId = $('#transactionId').val();
          $scope.supervisedby = $('#supervisedby').val();
          $scope.transactionId = $scope.transactionId.trim() ;
          $scope.supervisedby = $scope.supervisedby.trim() ;
          if($scope.transactionId.length === 0 || $scope.supervisedby.length === 0){
              swal("Transaction ID and Supervised By fields are required!");            
          }else{
             data.transactionId = $scope.transactionId;
             data.supervisedby  = $scope.supervisedby; 
             data.transferBy    = affiliate.userName;
             data.status        = "Success";
             data.createdAt     = Number(new Date());

             insertIntoCashoutHistory(index,id,data);

          }
       });
    }

    // proceed to insert data into cashout history on transfer
    function insertIntoCashoutHistory(index,id,data){
       $http({
           method : "post",
           url : "/insertIntoCashoutHistory/onTransfer",
           data:  data,
           headers: {'Content-Type': 'application/json'}
       }).then(function mySucces(res) {
           
          if(res.data.success){
            // console.log(res.data);
            swal("Transfer successful!"); 
            removeFromCashsoutApprovel(index,id);
          }else{
            $scope.dataList.splice(index,1); 
            swal("Error!", res.data.info);
          }

        }, function myError(err) {
          console.log(err,"err");
              swal("Error!", "Getting error from server in login");
      });
    }

    //remove from cash out pending collection in db transcation submit
    function removeFromCashsoutApprovel(index,id){
       $http({
           method : "post",
           url : "/removeFromCashsoutApprovel",
           data:  {_id : id},
           headers: {'Content-Type': 'application/json'}
       }).then(function mySucces(res) {
           
          if(res.data.success){
            console.log(res.data);
            $scope.dataList.splice(index,1);            
          }else{
            swal("Error!", res.data.info);
          }

        }, function myError(err) {
          console.log(err,"err");
            swal("Error!", "Getting error from server in login");
      }); 
    }


    $scope.resetForm = function(){
      $scope.referenceNo = "";
      $scope.getApproveCashoutCount();
    }

    $scope.incomplete = function(index,rejectReqData){
        var tempReqId = rejectReqData._id;
        rejectReqData.transactionId = "NA";
        rejectReqData.supervisedby  = "NA"; 
        rejectReqData.transferBy    = "NA";
        rejectReqData.tds    = "NA";
        rejectReqData.approveBy  = "NA";
        rejectReqData.netAmount  = "NA";
        rejectReqData.status = "Rejected";
        rejectReqData.reason = "Information incomplete.";
        rejectReqData.createdAt = Number(new Date());

        console.log("rejectReqData---------------"+JSON.stringify(rejectReqData));

        $http({
           method : "post",
           url : "/insertIntoCashoutHistory/onTransfer",
           data:  rejectReqData,
           headers: {'Content-Type': 'application/json'}
         }).then(function mySucces(res) {
           console.error(res)
            if(res.data.success){
              // console.log(res.data);
              swal("Success!", "Cashout request deleted sucessfully!");
              removeFromCashsoutApprovel(index,tempReqId);
            }else{
              swal("Error!", res.data.info);
              // removeFromCashsoutApprovel(tempReqId,index);
              $scope.dataList.splice(index,1);
            }

          }, function myError(err) {
          console.log(err,"err");
              swal("Error!", "Getting error from server in login");
        });
    }
}]);




;angular.module('MetronicApp').controller('AffiliateWithdrawalCtrl', ["$location", "$cookies", "$rootScope", "$scope", "$http", "$stateParams", "$filter", function($location, $cookies, $rootScope, $scope, $http, $stateParams, $filter) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    // console.log("yessss",$rootScope.isAdminLogin)
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
        console.log('yes', $rootScope.role)
        $location.path('/login.html')
    }

    // $scope.toggleLoader = false;

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    
    $scope.newPageList = function () {
      $scope.listPendingCashOutRequest(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
    }

    var affiliate = {
        // name     : $cookies.get('poker_name'),
        name     : $rootScope.poker_name,
        // userName : $cookies.get('poker_userName'),
        userName : $rootScope.poker_userName,
        // role     : JSON.parse($cookies.get('poker_role')),
        role     : JSON.parse($rootScope.poker_role),
        // id       : $cookies.get('poker_email'),
        id       : $rootScope.poker_email,
        // mobile   : $cookies.get('poker_loggedinUserMobileNum'),
        mobile   : $rootScope.poker_loggedinUserMobileNum,
    };
    var withdrawalTypes = "";
    
    $scope.setWithdrawType = function(){
      withdrawalTypes = $scope.withdrawalType;
    }


    function makeDefault(){      
      $scope.formData = {
        withdrawalType           : withdrawalTypes,
        totalAmountChips         : 0,
        totalAmountRake          : 0,
        requestedAmount          : null,
        currentDepositAmount     : 0,
        tds                      : 0,
        netAmount                : 0,
        name                     : null,
        accountNumber            : null,
        accountNumberConfirm     : null,
        ifcsCode                 : null,
        bankName                 : null,
        branchName               : null,
        affiliateId              : affiliate.userName,
        affiliateMobile          : affiliate.mobile,
        profile                  : "AFFILIATE",
        requestedAt              : Number(new Date())
      };
    }

     makeDefault();// set default


     $scope.getAffiliateDetails = function(){
         $http({
              method : "post",
              url : "/listAffiliate",
              data:  {userName : affiliate.userName},
              headers: {'Content-Type': 'application/json'}
          }).then(function mySucces(res) {                  
              if(res.data.success){
                 console.log("____________abc_____"+JSON.stringify(res.data.result));
                 $scope.formData.totalAmountChips = res.data.result[0].realChips;
                 $scope.formData.totalAmountRake = res.data.result[0].profit.toFixed(2);                 
              }else{
                swal(res.data.info)
              }          
          }, function myError(err) {          
              swal("Error!", "Getting error from server while requesting!");          
          });
      }

    function checkAccountNumber(){
      var validate = false;
      // console.log(Number($scope.formData.accountNumber) +"\n"+ Number($scope.formData.accountNumberConfirm));
       if(Number($scope.formData.accountNumber) === Number($scope.formData.accountNumberConfirm)){
          validate = true;          
       }       
       return validate;
    }
         
    // _______________ create affiliate ____________
    $scope.submit = function(){   

      if(withdrawalTypes == ""){
        swal("Error!", "Please select Withdraw Type");
        return;
      }
      $scope.formData.requestedAmount = parseInt($scope.formData.requestedAmount);
      $scope.formData.ifcsCode = $scope.formData.ifcsCode.toUpperCase();
      if(checkAccountNumber()){           
          $http({
              method : "post",
              url : "/craeteAffilateWithDrawlRequest",
              data:  $scope.formData,
              headers: {'Content-Type': 'application/json'}
          }).then(function mySucces(res) {                  
              if(res.data.success){
                swal("Success!", "Cashout request raised successfully!");
                $scope.formData={};
                $scope.withdrawalForm.$setPristine();
                withdrawalTypes = "";
                makeDefault();
                 $location.path('/pendingCashOutAffiliate');
              }else{
                swal(res.data.info)
              }          
          }, function myError(err) {          
              swal("Error!", "Getting error from server while requesting!");          
          });        
      }else{
        swal("Error!", "account number mismatch");
      }

    }


    // get count of cashout request
    $scope.getCashOutRequestCount = function(){
      var data = {};
      
      // if(JSON.parse($cookies.get('poker_role')).level == 0){
      if(JSON.parse($rootScope.poker_role).level == 0){
        // data.userName = $cookies.get('poker_userName');
        data.userName = $rootScope.poker_userName;
      }
      if($scope.referenceNo){
        data.referenceNo = $scope.referenceNo;
      }

      $http({
           method : "post",
           url : "/getCashOutRequestCount",
           data:  data,
           headers: {'Content-Type': 'application/json'}
       }).then(function mySucces(res) {
           
          if(res.data.success){
            console.log(res);
            $scope.totalPage = res.data.result;
            if(res.data.result == 0){
              swal("No data found!")
            }
            $scope.newPageList();  
          }else{
            swal("Error!", res.data.info);
          }

        }, function myError(err) {
          console.log(err,"err")
              swal("Error!", "Getting error from server in login");
      });

    }

    //______________ Get List Pending Req _____________
    $scope.listPendingCashOutRequest = function(dataSkip, dataLimit){
      var data = {};
      // if(JSON.parse($cookies.get('poker_role')).level == 0){
      if(JSON.parse($rootScope.poker_role).level == 0){
        // data.userName = $cookies.get('poker_userName');
        data.userName = $rootScope.poker_userName;
      }

      if($scope.referenceNo){
        data.referenceNo = $scope.referenceNo;
      }

      data.skip = dataSkip;
      data.limit = dataLimit;
  
      $http({
           method : "post",
           url : "/listPendingCashOutRequest",
           data:  data,
           headers: {'Content-Type': 'application/json'}
       }).then(function mySucces(res) {
           
          if(res.data.success){
            console.log(res.data);
            for(var i = 0 ; i<res.data.result.length; i++){
              res.data.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
            }
            $scope.dataList = res.data.result;    
          }else{
            swal("Error!", res.data.info);
          }

        }, function myError(err) {
          console.log(err,"err")
              swal("Error!", "Getting error from server in login");
      });

    }

    //________ Pending cash out action ________
        
    // approve cash out 
    $scope.approveCashOut = function(index,approveReqData){
        // $scope.toggleLoader = !$scope.toggleLoader;
        var tempReqId = approveReqData._id;
        // delete approveReqData._id;
        // approveReqData.approveBy = approveReqData.affiliateId;
        approveReqData.approveBy = affiliate.userName;
        $http({
            method : "post",
            url : "/processApproveCashout",
            data:  approveReqData,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {                  
            if(res.data.success){
              swal("Success!", "Cashout request raised successfully!");
              removeRequestOnAction(tempReqId,index);
            }else{
              swal(res.data.info);
              removeRequestOnAction(tempReqId,index);
            }          
        }, function myError(err) {          
            swal("Error!", "Getting error from server while requesting!");      
            // $scope.toggleLoader = !$scope.toggleLoader;    
        });     
    }

    // remove collection on approve, reject and reject with reason
    function removeRequestOnAction(tempReqId,index){
       $http({
            method : "post",
            url : "/removeCashoutRequestOnAction",
            data:  {_id : tempReqId},
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {                                
            if(res.data.success){
              // $location.path('/approveCashout');
              // $scope.toggleLoader = !$scope.toggleLoader;
              $scope.dataList.splice(index,1);
              console.info("Remove pending cashout request from db on approveCashout success. Done!");

            }else{
              console.log("error while removing data.");
              // $scope.toggleLoader = !$scope.toggleLoader;
            }          
        }, function myError(err) {          
            swal("Error!", "Getting error from server while requesting!");   
            // $scope.toggleLoader = !$scope.toggleLoader;       
        });     

    }

    // reject cashout request
    $scope.rejectCashOut = function(index,rejectReqData){          
        var tempReqId = rejectReqData._id;
        // delete rejectReqData._id;
        rejectReqData.transactionId = "NA";
        rejectReqData.supervisedby  = "NA"; 
        rejectReqData.transferBy    = "NA";
        rejectReqData.tds    = "NA";
        rejectReqData.approveBy  = "NA";
        rejectReqData.netAmount  = "NA";
        rejectReqData.status = "Rejected";
        rejectReqData.createdAt = Number(new Date());

        console.log("rejectReqData---------------"+JSON.stringify(rejectReqData));

        $http({
           method : "post",
           url : "/insertIntoCashoutHistory",
           data:  rejectReqData,
           headers: {'Content-Type': 'application/json'}
         }).then(function mySucces(res) {
           
            if(res.data.success){
              // console.log(res.data);
              swal("Success!", "Cashout request deleted sucessfully!");
              removeRequestOnAction(tempReqId,index);
            }else{
              swal("Error!", res.data.info);
              removeRequestOnAction(tempReqId,index);
            }

          }, function myError(err) {
          console.log(err,"err");
              swal("Error!", "Getting error from server in login");
        });
    }

    $scope.rejectCashOutReson = function(index,rejectReqData){

       swal({
          title: "Reason",
          text: '<div><h4><input type="text" id="reasonTxt" required></h4></div>',
          type: "info",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Proceed",
          closeOnConfirm: false,
          inputType : "text",
          html: true,
       }, function(){

          $scope.reasonTxt = $('#reasonTxt').val();
          
          if($scope.reasonTxt.length === 0){
              swal("Reason text can not be empty.");            
          }else{
              // console.log(JSON.stringify(rejectReqData));
              // console.log($scope.reasonTxt);
              rejectReqData.reason = $scope.reasonTxt;
              // console.log(JSON.stringify(rejectReqData));
              $scope.rejectCashOut(index,rejectReqData);
          }

       });
    }

    $scope.resetForm = function(){
      $scope.referenceNo = "";
      $scope.getCashOutRequestCount();
    }

}]);




;angular.module('MetronicApp').controller('AffiliatesController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss",$rootScope.isAdminLogin)
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.affiliateData = {};
    $scope.affiliateData.module = [];
    $scope.selectedList = {};
    $scope.xyz = true;
    console.log("DashboardController called",$rootScope.isAdminLogin,$rootScope.role,"role")
    if(!$rootScope.isAdminLogin){
        console.log('yes', $rootScope.role)
        $location.path('/login.html')
    }

    $scope.optionsData = [{name:"Finance", value:"Finance"}, {name:"Medical", value:"Medical"}, {name:"Risk Analysis", value:"RiskAnalysis"} ];
    $scope.submit = function(){
        
        // console.log("submit affilate==", $scope.affiliateData)
        var selected = [];
        $('input:checked').each(function() {
          console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.affiliateData.module = selected.filter(function(n){ return n != undefined });
        
         $http({
            method : "post",
            url : "/insertAffiliate",
            data:  $scope.affiliateData,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
        // $scope.myWelcome = response.data;
            
            if(res.data.success){
                swal("Success!", "Successfully affilate created!");
                $scope.affiliateData={};
                $location.path('/listAffiliate')
            }else{
                swal(res.data.info)
            }

            //console.log(moduleObj,"moduleObj")
        }, function myError(err) {
            // $scope.myWelcome = response.statusText;
            console.log(err,"err")
                // swal(err);
                swal("Error!", "Getting error from server in login!");
            // swal("Getting error from server in login");
        });
    }

   

}]);




;/* Setup blank page controller */
angular.module('MetronicApp').controller('BlankController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();

        // set default layout mode
        $rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
;angular.module('MetronicApp').controller('BroadcastManagementController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    console.log("Inside BroadcastManagementController  @@@@@@@@@");
    var bonusData = {};

    $('.date-picker').datepicker('setStartDate', new Date());
    
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.formdata = {};

    $scope.getAllTables = function(){
      console.log("line 16 ", $scope.formdata);
      var data = {};
      data.channelType = 'NORMAL';
      if($scope.formdata.channelVariation){
        data.channelVariation = $scope.formdata.channelVariation;
      }
      if($scope.formdata.isRealMoney){
        data.isRealMoney = JSON.parse($scope.formdata.isRealMoney);
      }
      data.isActive = true;
      data.skip = 0;
      data.limit = 0;
      $http.post("/listTable", data)
        .success(function(res){
          if(res.success){
            console.log(res.result);
            $scope.tableList = res.result
          }
          else{
            swal("Error!", res.result);
          }
        }).error(function(err){
          swal("Error!", "Getting error from server in broadcast ");
      });
    }

    $scope.getAllTables();


    $scope.submit = function(){
      if($scope.formdata.broadcastType == 'players'){
        delete $scope.formdata.channelVariation;
        delete $scope.formdata.isRealMoney;
        delete $scope.formdata.tableId;
      }
      var data = {};
      data.broadcastType = $scope.formdata.broadcastType;
      data.heading = $scope.formdata.heading;
      data.broadcastMessage = $scope.formdata.broadcastMessage;
      if($scope.formdata.tableId){
        data.channelId = $scope.formdata.tableId
      }
      console.log(data);
      if(data.broadcastMessage.length < 1){
        swal("Please enter a broadcast message");
        return;
      }
      $http.post("/broadcastToGame", data)
        .success(function(res){
          if(res.success){
            swal("Success!", "Broadcast sent successfully.");
            console.log(res);
            $scope.formdata = {};
            $scope.generateBonusForm.$setPristine();
            $scope.setVisible = false;
          }
          else{
            swal("Error!", res.info);
          }
        }).error(function(err){
          swal("Error!", "Getting error from server in sending broadcast ");
      });
    }

  }]);;angular.module('MetronicApp').controller('ChipsReportController', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside ChipsReportController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject = {};
    $scope.sortValue = "date";



    
    $scope.newPageList = function () {
        $scope.init(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
        $window.scrollTo(0, 0);
    }

    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }

    $scope.countData = function(){
      console.log("$$$$$$$$$$$$$$$$$$",$rootScope.poker_userName);
      if((JSON.parse($rootScope.poker_role)).level <= 0){
        $scope.queryObject.loginId = $rootScope.poker_userName;
      }
      var data = $scope.queryObject;
      if($scope.referenceNumber){
        data.referenceNumber = $scope.referenceNumber;
      }
      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }
      
      if(!$scope.endDate){
        swal("Error!", "Please select a end date!");
        return;
      }

      if($scope.minChips && $scope.maxChips && ($scope.minChips > $scope.maxChips)){
        swal("Error!", "Please enter a valid input!");
        return;
      }

      if(($scope.minChips && $scope.minChips <= 0) || ($scope.maxChips && $scope.maxChips <= 0)){
        swal("Input fields cannot contain zero or negative values");
        return false;
      }

      if($scope.Name){
        data.Name = $scope.Name;
      }

      if($scope.loginId){
        data.loginId = $scope.loginId;
      }

      if($scope.minChips && !$scope.maxChips){
        data.amount = { "$gte":$scope.minChips};
      }

      if(!$scope.minChips && $scope.maxChips){
        data.amount = { "$lte": $scope.maxChips};
      }

      if($scope.minChips && $scope.maxChips){
        data.amount = { "$gte":$scope.minChips, "$lte":$scope.maxChips};
      }

      if($scope.transferMode){
        data.transferMode = $scope.transferMode;
      }

      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      delete data.skip;
      delete data.limit;
      delete data.sortValue;
      
      // var startDate = new Date();
      // startDate.setDate(startDate.getDate()-7);
      // startDate.setHours(0);
      // startDate.setMinutes(0);
      // startDate.setSeconds(0);
      // startDate.setMilliseconds(0);
      data.date = { "$gte": Number(startDate), "$lt": Number(endDate)};
      console.log("line 93 ", data);
      $http.post("/countDataForDailyChips",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
            swal("Missing Keys");
          }
        }).error(function(err){
        swal("Getting error from server in showing transaction history",err.stack);
      });  
    }


    $scope.initCountData = function(){
      // console.log("$$$$$$$$$$$$$$$$$$",$cookies.get('poker_userName'));
      console.log("$$$$$$$$$$$$$$$$$$",$rootScope.poker_userName);
      // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
      $scope.queryObject = {};
      if((JSON.parse($rootScope.poker_role)).level <= 0){
        // $scope.queryObject.loginId = $cookies.get('poker_userName');
        $scope.queryObject.loginId = $rootScope.poker_userName;
      }
      var data = $scope.queryObject;
      
      var startDate = new Date();
      startDate.setDate(startDate.getDate()-7);
      startDate.setHours(0);
      startDate.setMinutes(0);
      startDate.setSeconds(0);
      startDate.setMilliseconds(0);
      data.date = { "$gte": Number(startDate), "$lt": Number(new Date())};
      $http.post("/countDataForDailyChips",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
            swal("Missing Keys");
          }
        }).error(function(err){
        swal("Getting error from server in showing transaction history",err.stack);
      });  
    }



    $scope.init = function(skipData,limitData,cb){
      showList = true;
      var data = {};
      // console.log("$$$$$$$$$$$$$$$$$$4",$cookies.get('poker_userName'));
      console.log("$$$$$$$$$$$$$$$$$$4",$rootScope.poker_userName);
      // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
      if((JSON.parse($rootScope.poker_role)).level <= 0){
         // $scope.queryObject.loginId = $cookies.get('poker_userName');
         $scope.queryObject.loginId = $rootScope.poker_userName;
      }
      data = $scope.queryObject;
      if($scope.referenceNumber){
        data.referenceNumber = $scope.referenceNumber;
      }

      if($scope.Name){
        data.Name = $scope.Name;
      }

      if($scope.loginId){
        data.loginId = $scope.loginId;
      }

      if($scope.minChips && !$scope.maxChips){
        data.amount = { "$gte":$scope.minChips};
      }

      if(!$scope.minChips && $scope.maxChips){
        data.amount = { "$lte": $scope.maxChips};
      }

      if($scope.minChips && $scope.maxChips){
        data.amount = { "$gte":$scope.minChips, "$lte":$scope.maxChips};
      }

      if($scope.transferMode){
        data.transferMode = $scope.transferMode;
      }
      
      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      if(!$scope.startDate){
        startDate = new Date();
        startDate.setDate(startDate.getDate()-7);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        endDate = new Date();
      }
      
      data.date = { "$gte": Number(startDate), "$lt": Number(endDate)};
      data.sortValue = $scope.sortValue;
      data.skip = skipData;
      data.limit = limitData;
      console.log("line 196 ", data);
      $http.post("/dailyChipsReport", data)
        .success(function(res){
          console.log("The result in transactionHistoryReportController", res.result);
          if(res.result.length == 0){
            swal("No data found.")
          }
          for(var i = 0 ; i<res.result.length; i++){
            res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
          }
          $scope.listTransaction = res.result;
          if(cb instanceof Function){
            cb();
          }
          else{

          }
        }).error(function(err){
          swal("Error!", "Getting error from server in showing transaction History");
      });
    }

    $scope.searchHistory = function(){
      $scope.currentPage = 1;
      console.log("************** queryObject",JSON.stringify($scope.queryObject));
      $scope.queryObject = {};
      $scope.countData();
    }

    $scope.initCountData();

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.referenceNumber = "";
      $('.date-picker1').data("datepicker").value = "";
      $scope.loginId = "";
      $scope.Name = "";
      $scope.minChips = "";
      $scope.maxChips = "";
      $scope.transferMode = "";
      $scope.initCountData();
    }

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.init(0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.init(0, 20);
          // $scope.resetForm();
        },500); // trigger download
      });
    };

    
}]);;angular.module('MetronicApp').controller('CreateTableController', ["$cookies", "$rootScope", "$window", "$scope", "$stateParams", "$http", "$timeout", "$location", function($cookies, $rootScope, $window, $scope, $stateParams, $http, $timeout, $location) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.togglePassword = false;
    $scope.checkPassword = function(){
      if($scope.formData.isPrivateTabel == "true"){
         $scope.togglePassword =  true;
      }
      if($scope.formData.isPrivateTabel == "false"){
         $scope.togglePassword =  false;
         $scope.formData.passwordForPrivate = "";
      }
    };

    $scope.data = {};
    $scope.turnTimesList = rootTools.turnTimesList;
    $scope.formData = {};
    $scope.formData.isPrivateTabel = false;


    // $scope.init = function(){
    //   $cookies.remove('poker_token');
    //   $cookies.remove('poker_name');
    //   $cookies.remove('poker_role');
    //   $cookies.remove('poker_userName');
    //   $cookies.remove('poker_email');
    //   $cookies.remove('poker_parent');
 

    // }


     $scope.listTables = function(id){
      // token = $cookies.get('poker_token');
      token = $rootScope.poker_token;
      var data ={};
      if(id){
        data._id = id;
      }
      // data.authToken = $cookies.get('poker_token');
      data.authToken = $rootScope.poker_token;
      
//      data.authToken = token;
      data.channelType = "NORMAL"
      var listTableResult = {};
      $http.post("/listTable", data)
      .success(function(res){
          console.log("res.result---------", res.result);
          $scope.dataList = res.result;
          listTableResult.result = res.result;
          var data1 = {};
          data1.isActive = true;
          if(id){
            data1._id = listTableResult.result[0].rakeRule;
            console.log("listTableResult==", listTableResult.result[0].rakeRule);
    
          }

           $http.post("/listRakeRuleName", data1)
             .success(function(res){
                 if(res.success){
                   $cookies.put('poker_token', res.authToken);
                   $scope.rakeList = res.result;
                   if(id){
                    $scope.dataList.rakeRuleName = res.result[0].name;
                   }
                   else{
                     for(var i=0; i<$scope.rakeList.length; i++){
                       for(var j=0; j<$scope.dataList.length; j++){
                         if($scope.dataList[j].rakeRule == $scope.rakeList[i]._id){
                           $scope.dataList[j].rakeRuleName = $scope.rakeList[i].name;
                         }
                       }
                     }
                   }
                 } else{
                   // swal("Missing Keys")
                 }
               
             }).error(function(err){
               // swal(err);
               // swal("Getting error from server in showing rake rules");
             });
      

          // 
          // 
      }).error(function(err){
            swal("Error!", "Error from server in showing tables!");
      });

      //   var data1 = {};
      //   data1.authToken = token;
      //   data1.isActive = true;
      //   if(id){
      //   data1._id = id;
      //   console.log("listTableResult==", listTableResult);
      //   console.log("listTableResult==", listTableResult.result);

      // }

      // $http.post("/listRakeRuleName", data1)
      //   .success(function(res){
      //       if(res.success){
      //         $cookies.put('poker_token', res.authToken);
      //         $scope.rakeList = res.result;
      //         for(var i=0; i<$scope.rakeList.length; i++){
      //           for(var j=0; j<$scope.dataList.length; j++){
      //             if($scope.dataList[j].rakeRule == $scope.rakeList[i]._id){
      //               $scope.dataList[j].rakeRuleName = $scope.rakeList[i].name;
      //             }
      //           }
      //         }
      //       } else{
      //         swal("Missing Keys")
      //       }
      //     // if(res.rTL){
      //     //   swal("Session Expired");
      //     //   $location.path('/login');
      //     // } else{
      //     // }
      //   }).error(function(err){
      //     // swal(err);
      //     swal("Getting error from server in showing rake rules");
      //   });
    }
    
    // if($stateParams.tableId){
    //   console.log("stateParams", $stateParams.tableId);
    //   $scope.listTables($stateParams.tableId);
    // }
    // else
    // {
    //   $scope.listTables();
    // }



  
    $scope.duplicate = function(table){
      console.log("duplicate function called");
      var data = angular.copy(table);
      data.authToken = token;
      data.channelName = (data.channelName) + new Date();
      var potLimitInfo = ($scope.formData.isPotLimit == "true")?("Pot Limit"):("No Limit");
      rakeStr = "";
      if($scope.formData.maxPlayers == 2 ){
        rakeStr = "Rake(%) 2 Players: " + $scope.formData.rake.rakePercentTwo;
      }
      if($scope.formData.maxPlayers > 2 && $scope.formData.maxPlayers < 5){
        rakeStr = "Rake(%) 3-4 Players: " + $scope.formData.rake.rakePercentThreeFour;
      }
      if($scope.formData.maxPlayers >= 5 ){
        rakeStr = "Rake(%) 5+ Players: " + $scope.formData.rake.rakePercentMoreThanFive;
      }
      var buyInStr = "\nBuy In : (" + $scope.formData.minBuyIn + "/" + $scope.formData.maxBuyIn + ")";
      data.gameInfo = "Table Name : " + $scope.formData.channelName +'\nGame Variation : ' + $scope.formData.channelVariation + '\nChips Type : ' + (($scope.formData.isRealMoney == "true")?("Real Money"):("Play Money")) + buyInStr + '\nStakes : ' + potLimitInfo +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')\n' + rakeStr + '\nMax. Players : ' + $scope.formData.maxPlayers + '\nStraddle : ' + (($scope.formData.isStraddleEnable == "true")?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time : '+ $scope.formData.turnTime; 
      delete data._id;
      $http.post("/createTable", data)
        .success(function(res){
          if(res.success){
            $cookies.put('poker_token', res.authToken);
            swal("Success!", "Table created successfully.");
            // swal("Successfully created !!");
            console.log('res.datable in dublicate is - ',res)
            $scope.listTables();
          } else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server in duplicate tables");
        });
    }



    $scope.submit = function(){
      // if(formValid){
      //   console.log("validation passed",formValid);
      // } else {
      //   console.log("validation failed",formValid);
      //   return;
      // }
      var data = angular.copy($scope.formData);
      data.rake.minStake = $scope.formData.smallBlind;
      data.rake.maxStake = $scope.formData.bigBlind;
      var potLimitInfo = ($scope.formData.isPotLimit == "true")?("Pot Limit"):("No Limit");
      // data.gameInfo = $scope.formData.channelName +'\n'+ $scope.formData.channelVariation +'\n'+ potLimitInfo +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')\nRake(%) 5+ Players: '+ $scope.formData.rake.rakePercentMoreThanFive +'\n'+ (($scope.formData.isStraddleEnable == "true")?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time: '+ $scope.formData.turnTime;    
      console.log("submit fucntion called ", data);
      rakeStr1 = "";
      rakeStr2 = "";
      var rakeToDisplay = "";
      if($scope.formData.maxPlayers > 2 && $scope.formData.maxPlayers < 5){
        rakeStr1 = "Rake                      : " + $scope.formData.rake.rakePercentThreeFour+'%';
        rakeToDisplay = $scope.formData.rake.rakePercentThreeFour;
      }
      if($scope.formData.maxPlayers >= 5 ){
        rakeStr1 = "Rake                      : " + $scope.formData.rake.rakePercentMoreThanFive+'%';
        rakeToDisplay = $scope.formData.rake.rakePercentMoreThanFive;
      }
      
      rakeStr2 = "Rake(Heads Up)   : " + $scope.formData.rake.rakePercentTwo;
      var buyInStr = "\nBuy In : (" + $scope.formData.minBuyIn + "/" + $scope.formData.maxBuyIn + ")";
      // data.gameInfo = "Table Name : " + $scope.formData.channelName +'\nGame Variation : ' + $scope.formData.channelVariation + '\nChips Type : ' + (($scope.formData.isRealMoney == "true")?("Real Money"):("Play Money")) + buyInStr + '\nStakes : ' + potLimitInfo +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')\n' + rakeStr + '\nMax. Players : ' + $scope.formData.maxPlayers + '\nStraddle : ' + (($scope.formData.isStraddleEnable == "true")?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time : '+ $scope.formData.turnTime; 
      data.gameInfoString = "Table Name : " + $scope.formData.channelName +'\nGame Variation : ' + $scope.formData.channelVariation + '\nChips Type : ' + (($scope.formData.isRealMoney == "true")?("Real Money"):("Play Money")) + buyInStr + '\nStakes : ' + potLimitInfo +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')\n' + rakeStr1 +'\n'+ rakeStr2 + '\nMax. Players : ' + $scope.formData.maxPlayers + '\nStraddle : ' + (($scope.formData.isStraddleEnable == 'true')?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time : '+ $scope.formData.turnTime; 
      // data.rakeRule = data.rakeRule._id;
      data.gameInfo = {};
      data.gameInfo['Table Name'] = $scope.formData.channelName;
      data.gameInfo['Game Variation'] = $scope.formData.channelVariation;
      data.gameInfo['Chips Type'] = (($scope.formData.isRealMoney == "true")?("Real Money"):("Play Money"));
      data.gameInfo['Buy In'] = $scope.formData.minBuyIn + "/" + $scope.formData.maxBuyIn;
      data.gameInfo['Stakes'] = ($scope.formData.isPotLimit == "true")?("Pot Limit"):("No Limit") +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')';
      if(rakeToDisplay){
        data.gameInfo['Rake'] = rakeToDisplay+'%';
      }
      data.gameInfo['Rake(Heads Up)'] = $scope.formData.rake.rakePercentTwo+'%';
      data.gameInfo['Cap Amount'] = Math.max($scope.formData.rake.capTwo, $scope.formData.rake.capThreeFour, $scope.formData.rake.capMoreThanFive);
      data.gameInfo['Max Players'] = $scope.formData.maxPlayers;
      data.gameInfo['Straddle'] = (($scope.formData.isStraddleEnable == 'true')?("Straddle Mandatory"):("Straddle Optional"));
      data.gameInfo['Turn Time'] = $scope.formData.turnTime+' sec.';
      data.gameInfo['Anti-Banking'] = rootTools.antiBankingTime/60+' min.';
      console.log("data===== ", data.gameInfo);
      // data.authToken = token;
      // data.createdBy = $cookies.get('poker_userName');
      data.createdBy = $rootScope.poker_userName;
      data.turnTime = JSON.parse(data.turnTime);
     // data.rakeRule = data.rakeRule._id;
      data.numberOfRebuyAllowed = 1;
      data.rebuyHourFactor = 1;
      data.hourLimitForRebuy = 1;
      data.gameInterval = 1;
      data.minPlayers   = 2;
      data.favourite = false;

      $http.post("/createTable", data)
        .success(function(res){
          if(res.rTL){
            swal("Session Expired");
            $location.path('/login');
          } else{
            if(res.success){
              $cookies.put('poker_token', res.authToken);
              swal("Success!", "Table created successfully.");
              $scope.formData.isPrivateTabel = false;
              // swal("Successfully created !!");
              $location.path('/listTable');
            } else{
              swal("Error!", res.info);
              // swal("Missing Keys")
            }
          }
        }).error(function(err){
          // swal(err);
          swal("Error!", "Getting error from server in creating table");
          // swal("Getting error from server in creating table");
        });

    }

    $scope.getRakeRules = function(){
       console.log('get rake rules', JSON.stringify($scope.formData));
       var data = {};
       data.channelVariation   = $scope.formData.channelVariation;
       data.minStake           = $scope.formData.smallBlind;
       data.maxStake           = $scope.formData.bigBlind;
       console.log("data==", data);
       if($scope.formData.smallBlind && $scope.formData.bigBlind && $scope.formData.channelVariation){

         console.log('needs to process rake rules');
           $http.post('/getRakeRules', data)
           .success(function(res){
             console.log('result @@@@@@@@@@@@@@@@', JSON.stringify(res.result));
               if(res.result !== null){
                 //$scope.formData.rakeRuleName = res.result.
                 console.log('needs to be set rules',res.result._id);
                 $scope.formData.rakeRuleName = res.result.name;
                 $scope.formData.rakeRule     = res.result._id;
               } else {
                 console.log('no needs to set rules');
                 $scope.formData.rakeRuleName = "";
                 $scope.formData.rakeRule     = "";
                 // swal('Please create new rules for small & big blind for this table');
                 return;
               }
           }).error(function(err){
             swal('getting error from server side in updating tables');
           });

       } else {
         $scope.formData.rakeRuleName = "";
         $scope.formData.rakeRule     = "";
         //swal('Please create new rules for small & big blind for this table');
       }

     }

    // var informPlayer = function(data) {
    //   return;
    //   console.log('data in informPlayer is - '+ JSON.stringify(data));
    //   var pomelo = window.pomelo;
    //   console.log('rootTools.connectorHost - ' + rootTools.connectorHost)
    //   pomelo.init({
    //     host: rootTools.connectorHost,
    //     port: rootTools.connectorPort,
    //     log: true
    //   }, function(){
    //     var table = cashGamesChangedData(data);
    //     console.log('tournament data is - ' + JSON.stringify(table));
    //     pomelo.request("connector.entryHandler.broadcastPlayers", {data: table, route: "addTable"} , function(data){
    //       console.log(data);
    //       pomelo.disconnect();
    //     })
    //   })
    // }

    // var cashGamesChangedData = function(data) {
    //   return {
    //     "_id"     : data._id,
    //     "updated" : {
    //       "isRealMoney"     : data.isRealMoney,
    //       "channelName"     : data.channelName,
    //       "turnTime"        : data.turnTime,
    //       "maxPlayers"      : data.maxPlayers,
    //       "smallBlind"      : data.smallBlind,
    //       "bigBlind"        : data.bigBlind,
    //       "minBuyIn"        : data.minBuyIn,
    //       "maxBuyIn"        : data.maxBuyIn,
    //       "channelVariation": data.channelVariation,
    //       "minPlayers"      : data.minPlayers,
    //       "favourite"       : data.favourite,
    //       "channelType"     : data.channelType,
    //       "avgStack"        : data.avgStack || 0,
    //       "flopPercent"     : data.flopPercent || 0,
    //       "isPotLimit"      : data.isPotLimit,
    //       "playingPlayers"  : data.playingPlayers||0,
    //       "queuePlayers"    : data.queuePlayers||0
    //     },
    //     "event"  : rootTools.event.cashGameTableChange
    //   }
    // }


}]);


;angular.module('MetronicApp').controller('DailyChipsChartController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) {
    console.log("Inside DailyChipsChartController  @@@@@@@@@");
    var data = {};

    $('.date-picker').datepicker('setEndDate', new Date());

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.setVisible = false;

    $scope.newSchedule = function(){
        console.log($('.scheduleDate').val())
        if(!$('.scheduleDate').val()) {
            return false;
        }

        var d = ($('.date-picker').data("datepicker").getUTCDate());
        // d.setDate(1);
        // d.setHours(0);
        // d.setMilliseconds(0);
        // d.setMinutes(0);
        // d.setSeconds(0);
        d.setUTCDate(1);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        console.log("the value of date is ", Number(d));
        data.addeddate = Number(d);
        $scope.init();
    }
    $scope.init = function(){
      $scope.setVisible = true;
      console.log($scope.formdata.name);
      // console.log($cookies.get('poker_userName'));
      console.log($rootScope.poker_userName);
      console.log("the value inside cookies of DailyChipsChartController is",$cookies.getAll());
      data.userName = $scope.formdata.name;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);
      if(data.role.level<=0){
        // data.loginId = $cookies.get('poker_userName');
        data.loginId = $rootScope.poker_userName;
      }
      console.log("the data in DailyChipsChartController ",JSON.stringify(data));
      if(data.addeddate){
        console.log("All fields are present");
        $http.post("/dailyChipsChart", data)
        .success(function(res){
          if(res.success){
              $scope.setVisible = true;
              swal("Success!", "Data Retreived  successfully.");
              var object = [];
              // for(var i = 0; i<res.result.currentMonthChipsData:.length;i++){
              console.log("*****************",res.result.currentMonthChipsData);
              console.log("*****************",res.result.previousMonthChipsData);
              var  j = 1;
              for(var i = res.result.currentMonthChipsData.length-1; i>=0;i--){
                  var tempObj = {};
                  tempObj.dailyChipsCurrentMonth = res.result.currentMonthChipsData[i].dailyChips;
                   tempObj.day = (new Date(res.result.currentMonthChipsData[i].date)).getUTCDate();
                  // tempObj.dailyChipsPrevMonth = res.result.previousMonthChipsData[i].dailyChips;
                  j = j + 1;
                  object.push(tempObj);
              }

              console.log("###############",object);
              var chart = AmCharts.makeChart( "chartdiv2", {
              "type": "serial",
              "addClassNames": true,
              "theme": "light",
              "autoMargins": false,
              "marginLeft": 80,
              "marginRight": 8,
              "marginTop": 10,
              "marginBottom": 26,
              "balloon": {
                "adjustBorderColor": false,
                "horizontalPadding": 10,
                "verticalPadding": 8,
                "color": "#ffffff"
              },

              "dataProvider": object,
              "valueAxes": [ {
                "axisAlpha": 0,
                "position": "left"
              } ],
              "startDuration": 1,
              "graphs": [ {
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                "fillAlphas": 1,
                "title": "Chips Current Month",
                "type": "column",
                "valueField": "dailyChipsCurrentMonth",
                "dashLengthField": "dashLengthColumn"
              }, {
                "id": "graph2",
                "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                "bullet": "round",
                "lineThickness": 3,
                "bulletSize": 7,
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "useLineColorForBulletBorder": true,
                "bulletBorderThickness": 3,
                "fillAlphas": 0,
                "lineAlpha": 1,
                "title": "Rake Previous Month",
                "valueField": "dailyChipsPrevMonth",
                "dashLengthField": "dashLengthLine"
              } ],
              "categoryField": "day",
              "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
              },
              "export": {
                "enabled": true
              }
            } );
            console.log(res);
            $scope.formdata = {};
            $scope.rakeChartForm.$setPristine();

          }else{
            swal("Error!", "No data found.");
            $scope.setVisible = false;
            // swal(res.result);
          }

                        //$cookies.put('poker_token', res.authToken);
          }).error(function(err){
              // swal(err);
            swal("Error!", "Getting error from server in showing daily rake report. ");
              // swal("Getting error from server in creating Bonus code ");
          });

      }
      else{
        console.log("Some fields are missing");
        swal("Error!", "Some Fields are missing");
        return;
      }

    }


  }]);
;angular.module('MetronicApp').controller('DashboardController', ["$location", "$rootScope", "$cookies", "$scope", "$http", "$timeout", function($location, $rootScope, $cookies, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    console.log("DashboardController called",$rootScope.isAdminLogin)
    if(!$rootScope.isAdminLogin){
    	console.log('yes')
    	$location.path('/login.html')
    }
    // set sidebar closed and body solid layout mode
   
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    
    var role = $rootScope.poker_role;
    if(typeof role == 'string'){
      role = JSON.parse($rootScope.poker_role);
    }

    // if($cookies.get('poker_role') && (JSON.parse($cookies.get('poker_role'))).level <= 0){
    if($rootScope.poker_role && role.level <= 0){
      console.log("affiliate");
      $scope.isAdminLogin = false;
      var data = {}; 
      // data.userName = $cookies.get('poker_userName');
      data.userName = $rootScope.poker_userName;
      $http.post("/listAffiliate", data)
        .success(function(res){
          if(res.success){
            // console.log('res in listAffiliate is - ',res.result[0]);
            $scope.dataList = res.result;
            $scope.dataList.bonusOrRealChips = parseFloat(res.result[0].realChips);
            $scope.dataList.deposit = parseFloat(res.result[0].chipsManagement.deposit);
            $scope.dataList.profit = parseFloat(res.result[0].profit);
            $scope.dataList.withdrawal = parseFloat(res.result[0].withdrawal);
            $scope.dataList.rakeCommision = parseFloat(res.result[0].rakeCommision);
            
            $scope.dataList.deposit = String($scope.dataList.deposit).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.dataList.bonusOrRealChips = String($scope.dataList.bonusOrRealChips).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.dataList.profit = String($scope.dataList.profit).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.dataList.withdrawal = String($scope.dataList.withdrawal).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.dataList.rakeCommision = String($scope.dataList.rakeCommision).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.key1 = "Total Chips Available";
            $scope.key2 = "Total Added Chips";
            $scope.key3 = "Profit";
            $scope.key4 = "Total Chips Pulled from Players";
            $scope.key5 = "Commission (%)";
            
          } else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }
    
    else{
      // if($cookies.get('poker_role')){
      if($rootScope.poker_role){
        $scope.isAdminLogin = true;

      }
      // $scope.findBalanceSheetDetails();
    }


}]);;angular.module('MetronicApp').controller('GameVersionsController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, GameVersionsController loaded");

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.setHidden = false;
    $scope.setDisabledForSubAff = false;
    // if((JSON.parse($cookies.get('poker_role'))).level < 0 ){
    if((JSON.parse($rootScope.poker_role)).level < 0 ){
      $scope.setDisabledForSubAff = true;
    }
    
    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listGameVersions("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    $scope.data = {};
    
    $scope.countData = function(){
      var data ={};
      $http.post("/countGameVersions",data)
        .success(function(res){
          if(res.success){
            console.log(res);
            $scope.totalPage = res.result;
            $scope.newPageList();
          } 
          else{
            swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server in showing players list",err.stack);
      });  
    }  



    $scope.listGameVersions = function(id, skipData, limitData){
      var data = {};
      if(id && id.length > 0){
        data._id = id;
      }
      data.skip = skipData;
      data.limit = limitData;
      console.log("data ", skipData, limitData, data);
      var listPlayerResult = {};
      $http.post("/listGameVersions", data)
      .success(function(res){
        console.log("res.result---------", res.result);
        $scope.dataList = res.result;
        $scope.editData = res.result[0];
         
      }).error(function(err){
        swal("Error!", "Getting error from server in showing Players");
      });
    }

    
    if($stateParams.gameVersionId){
      console.log("stateParams", $stateParams.gameVersionId);
      $scope.setHidden = true;
      $scope.listGameVersions($stateParams.gameVersionId, 0, 20);
    }
    
    $scope.submit = function(){
      console.log("submit function called in GameVersionsController", $scope.dataList[0]);
      var data = angular.copy($scope.dataList[0]);
      if(data.state == 'Active'){
        data.isUpdateRequired = false;
      }
      else{
        data.isUpdateRequired = true;
      }
      
      if(data.maintenanceState == 'Active'){
        data.isInMaintainance = true;
      }
      else{
        data.isInMaintainance = false;
      }
      console.log("data===== ", data);
      $http.post("/createGameVersion", data)
        .success(function(res){
          console.log("GameVersionsController line 125 ==", res);
          if(res.success){
            swal("Success!", "Game Version created successfully.");
            $scope.dataList = [];
            $scope.gameVersionForm.$setPristine();
          } 
          else{
            swal("Error!", res.info);
            console.log("=========line 107", res.info);
          }
        }).error(function(err){
          swal("Error!", "Getting error from server in creating game version!");
        });

    }

    $scope.update = function(){
      console.log("update function called in GameVersionsController", $scope.dataList[0]);
      var data = angular.copy($scope.dataList[0]);
      data._id = $stateParams.gameVersionId;
      if(data.state == 'Active'){
        data.isUpdateRequired = false;
      }
      else{
        data.isUpdateRequired = true;
      }
      
      if(data.maintenanceState == 'Active'){
        data.isInMaintainance = true;
      }
      else{
        data.isInMaintainance = false;
      }
      console.log("data===== ", data);
      $http.post("/editGameVersion", data)
        .success(function(res){
          if(res.success){
            console.log("GameVersionsController line 149 ==", res);
            swal("Success!", "Game Version updated successfully.");
            $scope.dataList = [];
            $scope.gameVersionForm.$setPristine();
            $location.path('/listGameVersions');

          } 
          else{
            swal("Error!", res.info);
            console.log("=========line 107", res.info);
          }
        }).error(function(err){
          swal("Error!", "Getting error from server in creating game version!");
        });

    }


}]);


;/* Setup general page controller */
angular.module('MetronicApp').controller('GeneralPageController', ['$rootScope', '$scope', 'settings', function($rootScope, $scope, settings) {
    $scope.$on('$viewContentLoaded', function() {   
    	// initialize core components
    	App.initAjax();

    	// set default layout mode
    	$rootScope.settings.layout.pageContentWhite = true;
        $rootScope.settings.layout.pageBodySolid = false;
        $rootScope.settings.layout.pageSidebarClosed = false;
    });
}]);
;angular.module('MetronicApp').controller('GenerateScratchCardController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded", $rootScope.isAdminLogin);
      if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.isAffiliate = false; 

    // swal("Do you agree to the Terms and Conditions?", "Server status changed to  success");
    

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $('.date-picker').datepicker('setStartDate', new Date());
    $scope.data = {};
    $scope.turnTimesList = rootTools.turnTimesList;
    $scope.dataTablePromotions = [{}];

    $scope.addRow = function(){
      console.log("dataTablePromotions", $scope.dataTablePromotions);
      $scope.dataTablePromotions.push({});
    }

    $scope.calculateTotalPromotions = function(){
      var sum = 0;
      console.log("calculateTotalPromotions called,,,,,,", JSON.stringify($scope.dataTablePromotions));
      for(var i=0; i<$scope.dataTablePromotions.length; i++){
          if($scope.dataTablePromotions[i].denomination && $scope.dataTablePromotions[i].quantity){
            if($scope.dataTablePromotions[i].denomination.toString().indexOf('.') > -1 || $scope.dataTablePromotions[i].quantity.toString().indexOf('.') > -1){
              sum = 0;
              swal('Denomination and quantity cannot contain decimal values!')
              break;
            }
            else{
              sum = sum + ($scope.dataTablePromotions[i].denomination * $scope.dataTablePromotions[i].quantity);
            }
          }
          else{
          }          
      }
      $scope.amount = sum;
    }
    
    $scope.testFunction = function(){
      var expiresIn = d - Number(new Date());
     console.log("date== ", Number(new Date()), d);
     console.log("expries in==  ", expiresIn);
      
    }

    $scope.submitScratchCardPromotions = function(){
      // swal('submitScratchCard function called');
      
      var data = {};
      data.scratchCardDetails = [];
      for(var i=0; i<$scope.dataTablePromotions.length;i++)
      {
        if($scope.dataTablePromotions[i].denomination && $scope.dataTablePromotions[i].quantity){
          data.scratchCardDetails.push({denomination: $scope.dataTablePromotions[i].denomination, quantity: $scope.dataTablePromotions[i].quantity})
        }
      }
      var d =  $('.date-picker').data("datepicker").getDate();
      d = Number(d.setDate(d.getDate()+1)) - 1000;
      data.scratchCardType = "PROMOTION";
      data.promoCode = $scope.promoCode.toUpperCase();
      // data.scratchCardDetails = $scope.dataTablePromotions;
      data.totalAmount = $scope.amount;
      data.isActive = true;
      data.expiresOn = d;
      data.transactionType = "Debit";
      // data.createdBy = { name: $cookies.get('poker_name'), userName: $cookies.get('poker_userName'), role: JSON.parse($cookies.get('poker_role')), id: $cookies.get('poker_email')};
      data.createdBy = { name: $rootScope.poker_name, userName: $rootScope.poker_userName, role: JSON.parse($rootScope.poker_role), id: $rootScope.poker_email};
      console.log("data== ", data);

      swal({
      title: "Are you sure you want to create the Scratch Card?",
      text: '',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Proceed",
      closeOnConfirm: false,
      inputType : "text",
      html: true,
    }, function(){
        $http.post("/createScratchCardPromotions", data)
        .success(function(res){
            console.log("res.result---------", res);
            if(res.success){
              swal("Success!", "Scratch card created successfully.");
              // swal('Scratch card created successfully!')
              //$location.path('/scratchCard/approve');
              $scope.promoCode = "";
              $scope.amount = "";
              $scope.expiresOn = "";
              for(var i=0; i<$scope.dataTablePromotions.length; i++){
                $scope.dataTablePromotions[i].denomination = "";
                $scope.dataTablePromotions[i].quantity = "";
              }
            }
            else{
              swal(res.info);
            }

        }).error(function(err){
            swal("Getting error from server in generating scratch cards!");
        });
    });
      
    }

    $scope.submitScratchCardAffilate = function(){
      // swal('submitScratchCard function called');
      
      var data = {};
      data.scratchCardDetails = [];
      for(var i=0; i<$scope.dataTableEmergency.length;i++)
      {
        if($scope.dataTableEmergency[i].denomination && $scope.dataTableEmergency[i].quantity){
          data.scratchCardDetails.push({denomination: $scope.dataTableEmergency[i].denomination, quantity: $scope.dataTableEmergency[i].quantity})
        }
      }
      
      var d =  $('.date-picker').data("datepicker").getDate();
      d = Number(d.setDate(d.getDate()+1)) - 1000;
      data.scratchCardType = "AFFILIATE";
      data.affiliateId = $scope.playerOrAffiliateId;
      // data.scratchCardDetails = $scope.dataTableEmergency;
      data.totalAmount = $scope.amount;
      data.isActive = true;
      data.expiresOn = d;
      data.transactionType = $scope.transactionType;
      // data.createdBy = { name: $cookies.get('poker_name'), userName: $cookies.get('poker_userName'), role: JSON.parse($cookies.get('poker_role')), id: $cookies.get('poker_email')};
      data.createdBy = { name: $rootScope.poker_name, userName: $rootScope.poker_userName, role: JSON.parse($rootScope.poker_role), id: $rootScope.poker_email};
      console.log("data== ", data);

      swal({
      title: "Are you sure you want to create the Scratch Card?",
      text: '',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Proceed",
      closeOnConfirm: false,
      inputType : "text",
      html: true,
    }, function(){
        $http.post("/createScratchCardAffiliate", data)
        .success(function(res){
            console.log("res.result---------", res);
            if(res.success){
              swal("Success!", "Scratch card created successfully.");
              $scope.playerOrAffiliateId = "";
              $scope.amount = "";
              $scope.expiresOn = "";
              $scope.transactionType = "";
              for(var i=0; i<$scope.dataTableEmergency.length; i++){
                $scope.dataTableEmergency[i].quantity = "";
              }
              // var role  = JSON.parse($cookies.get('poker_role'));
              var role  = JSON.parse($rootScope.poker_role);
              if( role.level <= 0){
                $scope.isAffiliate = true;
                // $scope.playerOrAffiliateId = $cookies.get('poker_userName');
                $scope.playerOrAffiliateId = $rootScope.poker_userName;
              }
   
              // swal('Scratch card created successfully!')
              //$location.path('/scratchCard/approve');
            }
            else{
              swal(res.info);
            }

        }).error(function(err){
            // swal(err);
            swal("Getting error from server in generating scratch cards!");
        });
      
    });

  }



    $scope.submitScratchCardEmergency = function(){
      // swal('submitScratchCard function called');
      
      var data = {};
      data.scratchCardDetails = [];
      for(var i=0; i<$scope.dataTableEmergency.length;i++)
      {
        if($scope.dataTableEmergency[i].denomination && $scope.dataTableEmergency[i].quantity){
          data.scratchCardDetails.push({denomination: $scope.dataTableEmergency[i].denomination, quantity: $scope.dataTableEmergency[i].quantity})
        }
      }
      
      var d =  $('.date-picker').data("datepicker").getDate();
      d = Number(d.setDate(d.getDate()+1)) - 1000;
      data.scratchCardType = "EMERGENCY";
      data.playerId = $scope.playerOrAffiliateId;
      // data.scratchCardDetails = $scope.dataTableEmergency;
      data.totalAmount = $scope.amount;
      data.isActive = true;
      data.expiresOn = d;
      data.transactionType = $scope.transactionType;
      // data.createdBy = { name: $cookies.get('poker_name'), userName: $cookies.get('poker_userName'), role: JSON.parse($cookies.get('poker_role')), id: $cookies.get('poker_email')};
      data.createdBy = { name: $rootScope.poker_name, userName: $rootScope.poker_userName, role: JSON.parse($rootScope.poker_role), id: $rootScope.poker_email};
      console.log("data== ", data);

      swal({
      title: "Are you sure you want to create the Scratch Card?",
      text: '',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Proceed",
      closeOnConfirm: false,
      inputType : "text",
      html: true,
    }, function(){
        $http.post("/createScratchCardEmergency", data)
        .success(function(res){
            console.log("res.result---------", res);
            if(res.success){
              swal("Success!", "Scratch card created successfully.");
              // swal('Scratch card created successfully!')
              // $location.path('/scratchCard/approve');
              $scope.playerOrAffiliateId = "";
              $scope.amount = "";
              $scope.expiresOn = "";
              $scope.transactionType = "";
              for(var i=0; i<$scope.dataTableEmergency.length; i++){
                $scope.dataTableEmergency[i].quantity = "";
              }
            }
            else{
              swal(res.info);
            }

        }).error(function(err){
            // swal(err);
            swal("Getting error from server in generating scratch cards!");
        });
      
    });




    }

    
    // $scope.init = function(){
    //   $cookies.remove('poker_token');
    //   $cookies.remove('poker_name');
    //   $cookies.remove('poker_role');
    //   $cookies.remove('poker_userName');
    //   $cookies.remove('poker_email');
    //   $cookies.remove('poker_parent');
 

    // }
     
    $scope.submitScratchCardHighRollers = function(){
      // swal('submitScratchCard function called');
      var data = angular.copy($scope.formData);
      var d =  $('.date-picker').data("datepicker").getDate();
      d = Number(d.setDate(d.getDate()+1)) - 1000;
      data.scratchCardType = "HIGH-ROLLERS";
      data.expiresOn = d;
      data.isActive = true;
      // data.createdBy = { name: $cookies.get('poker_name'), userName: $cookies.get('poker_userName'), role: JSON.parse($cookies.get('poker_role')), id: $cookies.get('poker_email')};
      data.createdBy = { name: $rootScope.poker_name, userName: $rootScope.poker_userName, role: JSON.parse($rootScope.poker_role), id: $rootScope.poker_email};
      console.log("data== ", data);


      swal({
      title: "Are you sure you want to create the Scratch Card?",
      text: '',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Proceed",
      closeOnConfirm: false,
      inputType : "text",
      html: true,
    }, function(){
        $http.post("/createScratchCardHighRollers", data)
        .success(function(res){
            console.log("res.result---------", res);
            if(res.success){
              swal("Success!", "Scratch card created successfully.");
              $scope.formData = {};
              // $scope.highRollersForm.$setUntouched();
              $scope.highRollersForm.$setPristine();
              // swal('Scratch card created successfully!')
              // $location.path('/scratchCard/approve');
              
            }
            else{
              swal(res.info);
            }

        }).error(function(err){
            // swal(err);
            swal("Getting error from server in generating scratch cards!");
        });
      
      
    });




      
    }

    $scope.dataTableEmergency = [{denomination: 5000},{denomination: 10000},{denomination: 20000},{denomination: 50000},{denomination: 100000}];
    $scope.calculateTotalEmergency = function(){
      var sum = 0;
      console.log("calculateTotalEmergency called,,,,,,", JSON.stringify($scope.dataTableEmergency));
      for(var i=0; i<$scope.dataTableEmergency.length; i++){
            if($scope.dataTableEmergency[i].quantity && $scope.dataTableEmergency[i].quantity.toString().indexOf('.') > -1){
              sum = 0;
              swal('Denomination and quantity cannot contain decimal values!')
              break;
            }
            else{
              // sum = sum + ($scope.dataTableEmergency[i].denomination * $scope.dataTableEmergency[i].quantity);
              console.log("calculateTotalEmergency called====", $scope.dataTableEmergency[i]);
              sum = sum + ($scope.dataTableEmergency[i].denomination * ($scope.dataTableEmergency[i].quantity)||0);
            }
        }
        console.log("amount== ", sum);
        $scope.amount = sum;
      // for(var i=0; i<$scope.dataTableEmergency.length; i++){
      //   console.log("calculateTotalEmergency called====", $scope.dataTableEmergency[i]);
      //   sum = sum + ($scope.dataTableEmergency[i].denomination * ($scope.dataTableEmergency[i].quantity)||0);
      // }
      // $scope.amount = sum;
    }


    // var role  = JSON.parse($cookies.get('poker_role'));
    var role  = JSON.parse($rootScope.poker_role);
    if( role.level <= 0){
      $scope.isAffiliate = true;
      // $scope.playerOrAffiliateId = $cookies.get('poker_userName');
      $scope.playerOrAffiliateId = $rootScope.poker_userName;
    }
   

}]);


;angular.module('MetronicApp').controller('ListAffiliatesController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss",$rootScope.isAdminLogin)
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.affiliateData = {};
    $scope.affiliateData.module = [];
    $scope.selectedList = {};
    $scope.xyz = true;
    console.log("ListAffiliatesController called",$rootScope.isAdminLogin,$rootScope.role,"role")
    if(!$rootScope.isAdminLogin){
        console.log('yes', $rootScope.role)
        $location.path('/login.html')
    }

     $scope.listAffiliates = function(){
        
         $http({
            method : "post",
            url : "/listAffiliate",
            data:  {},
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            
            if(res.data.success){
                // console.log(res.data);
                $scope.dataList = res.data.result;
                // swal("Successfully affilate created!!")
                $scope.affiliateData={}
            }else{
                swal("Error!", res.data.info);
                // swal(res.data.info)
            }

        }, function myError(err) {
            console.log(err,"err")
                swal("Error!", "Getting error from server in login");
            // swal("Getting error from server in login");
        });
    }



   $scope.listAffiliates();

}]);




;angular.module('MetronicApp').controller('ListTableController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    
    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listTables("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    $scope.togglePassword = false;
    $scope.checkPassword = function(){
      if($scope.formData.isPrivateTabel == "true"){
         $scope.togglePassword =  true;
      }
      if($scope.formData.isPrivateTabel == "false"){
         $scope.togglePassword =  false;
         $scope.formData.passwordForPrivate = "";
      }
    };

    $scope.data = {};
    $scope.turnTimesList = rootTools.turnTimesList;


    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');

    }


    $scope.countData = function(){
      $scope.currentPage = 1;
      var data ={};
      data.channelType = "NORMAL";
      if($scope.channelVariation){
        data.channelVariation = $scope.channelVariation;
      }
      if($scope.status){
        data.isActive = $scope.status;
      }
      if($scope.channelName){
        data.channelName = $scope.channelName;
      }
      if($scope.email){
        data.email = $scope.email;
      }
      if($scope.isPrivateTabel){
        data.isPrivateTabel = $scope.isPrivateTabel;
      }
      if($scope.minSmallBlind){
        data.minSmallBlind = $scope.minSmallBlind;
      }
      if($scope.maxSmallBlind){
        data.maxSmallBlind = $scope.maxSmallBlind;
      }
      if($scope.minBuyInMin){
        data.minBuyInMin = $scope.minBuyInMin;
      }
      if($scope.minBuyInMax){
        data.minBuyInMax = $scope.minBuyInMax;
      }
      if($scope.minPlayerLimit){
        data.minPlayerLimit = $scope.minPlayerLimit;
      }
      if($scope.maxPlayerLimit){
        data.maxPlayerLimit = $scope.maxPlayerLimit;
      }
      if($scope.turnTime){
        data.turnTime = parseInt($scope.turnTime);
      }
      if($scope.isRealMoney){
        data.isRealMoney = $scope.isRealMoney;
      }
      if($scope.isRealMoney === "All"){
        delete data.isRealMoney;
      }
      $http.post("/countlistTable",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             if(res.result.length == 0){
              swal("Error", "No data found!")
             }
             $scope.newPageList();
          } else{
        swal("Error!", res.info);
            // swal("Missing Keys");
          }
        }).error(function(err){
        swal("Getting error from server in showing rake rules",err);
      });  
    }  



     $scope.listTables = function(id,skipData,limitData){
      // token = $cookies.get('poker_token');
      var data ={};
      if(id && id.length > 0){
        data._id = id;
      }
      console.log("id== ", id);
      // data.authToken = token;
      data.channelType = "NORMAL";
      // data.authToken = $cookies.get('poker_token');
      
      data.skip = skipData;
      data.limit = limitData;
      if($scope.channelVariation){
        data.channelVariation = $scope.channelVariation;
      }
      if($scope.status){
        data.isActive = $scope.status;
      }
      if($scope.channelName){
        data.channelName = $scope.channelName;
      }
      if($scope.email){
        data.email = $scope.email;
      }
      if($scope.isPrivateTabel){
        data.isPrivateTabel = $scope.isPrivateTabel;
      }
      if($scope.minSmallBlind){
        data.minSmallBlind = $scope.minSmallBlind;
      }
      if($scope.maxSmallBlind){
        data.maxSmallBlind = $scope.maxSmallBlind;
      }
      if($scope.minBuyInMin){
        data.minBuyInMin = $scope.minBuyInMin;
      }
      if($scope.minBuyInMax){
        data.minBuyInMax = $scope.minBuyInMax;
      }
      if($scope.minPlayerLimit){
        data.minPlayerLimit = $scope.minPlayerLimit;
      }
      if($scope.maxPlayerLimit){
        data.maxPlayerLimit = $scope.maxPlayerLimit;
      }
      if($scope.turnTime){
        data.turnTime = parseInt($scope.turnTime);
      }
      if($scope.isRealMoney){
        data.isRealMoney = $scope.isRealMoney;
      }
      if($scope.isRealMoney === "All"){
        delete data.isRealMoney;
      }

      var listTableResult = {};
      $http.post("/listTable", data)
      .success(function(res){
          console.log("res.result---------", res.result);
          if(res.result.length == 0){
           swal("Error", "No data found!")
          }
          $scope.dataList = res.result;
          $scope.editData = res.result[0];
          listTableResult.result = res.result;
          var data1 = {};
          // data1.authToken = token;
          data1.isActive = true;
          if(id){
            $scope.formData = res.result[0];
            // $scope.formData.rakeRuleName = res.result.rakeRuleName;
            data1._id = listTableResult.result[0].rakeRule;
            // console.log("listTableResult==", listTableResult.result[0].rakeRule);
    
          }
          // 
          // 
      }).error(function(err){
          // swal(err);
        swal("Error!", "Getting error from server in showing tables");
          // swal("Getting error from server in showing tables");
      });

      
    }
    
    if($stateParams.tableId){
      console.log("stateParams", $stateParams.tableId);
      $scope.listTables($stateParams.tableId, 0, 20);
    }
    else
    {
      // $scope.listTables();
      $scope.countData();
    }
    
    // $scope.countData();
    var sortOrder = 1;

    $scope.sortByName = function(){
        // if(a.channelName < b.channelName) return -1;
        // if(a.channelName > b.channelName) return 1;
      if(sortOrder == 1){
        $scope.dataList.sort(function(a, b){
          if(a.channelName < b.channelName) return -1;
          if(a.channelName > b.channelName) return 1;
        })
        sortOrder = -1;
        return;
      }
      if(sortOrder == -1){
        $scope.dataList.sort(function(a, b){
          if(a.channelName > b.channelName) return -1;
          if(a.channelName < b.channelName) return 1;
        })
        sortOrder = 1;
        return;
      }
    }

    $scope.sortByMaxPlayers = function(){
      if(sortOrder == 1){
        $scope.dataList.sort(function(a, b){
          return parseInt(a.maxPlayers) - parseInt(b.maxPlayers);
        })
        sortOrder = -1;
        return;
      }
      if(sortOrder == -1){
        $scope.dataList.sort(function(a, b){
          return parseInt(b.maxPlayers) - parseInt(a.maxPlayers);
        })
        sortOrder = 1;
        return;
      }

    }


  
    $scope.duplicate = function(table){
      console.log("duplicate function called");
      var data = angular.copy($scope.dataList[0]);
      console.log("data===== ", data);
      // data.authToken = token;
      data.turnTime = JSON.parse(data.turnTime);
      var potLimitInfo = ($scope.formData.isPotLimit == "true")?("Pot Limit"):("No Limit");
      rakeStr1 = "";
      rakeStr2 = "";
      var rakeToDisplay = "";
      if($scope.formData.maxPlayers > 2 && $scope.formData.maxPlayers < 5){
        rakeStr1 = "Rake                      : " + $scope.formData.rake.rakePercentThreeFour+'%';
        rakeToDisplay = $scope.formData.rake.rakePercentThreeFour;
      }
      if($scope.formData.maxPlayers >= 5 ){
        rakeStr1 = "Rake                      : " + $scope.formData.rake.rakePercentMoreThanFive+'%';
        rakeToDisplay = $scope.formData.rake.rakePercentMoreThanFive;
      }
      
      rakeStr2 = "Rake(Heads Up)   : " + $scope.formData.rake.rakePercentTwo;
      var buyInStr = "\nBuy In : (" + $scope.formData.minBuyIn + "/" + $scope.formData.maxBuyIn + ")";
      // data.gameInfo = "Table Name : " + $scope.formData.channelName +'\nGame Variation : ' + $scope.formData.channelVariation + '\nChips Type : ' + (($scope.formData.isRealMoney == "true")?("Real Money"):("Play Money")) + buyInStr + '\nStakes : ' + potLimitInfo +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')\n' + rakeStr + '\nMax. Players : ' + $scope.formData.maxPlayers + '\nStraddle : ' + (($scope.formData.isStraddleEnable == "true")?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time : '+ $scope.formData.turnTime; 
      data.gameInfoString = "Table Name : " + $scope.formData.channelName +'\nGame Variation : ' + $scope.formData.channelVariation + '\nChips Type : ' + (($scope.formData.isRealMoney == "true")?("Real Money"):("Play Money")) + buyInStr + '\nStakes : ' + potLimitInfo +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')\n' + rakeStr1 +'\n'+ rakeStr2 + '\nMax. Players : ' + $scope.formData.maxPlayers + '\nStraddle : ' + (($scope.formData.isStraddleEnable == 'true')?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time : '+ $scope.formData.turnTime; 
      // data.rakeRule = data.rakeRule._id;
      data.gameInfo = {};
      data.gameInfo['Table Name'] = $scope.formData.channelName;
      data.gameInfo['Game Variation'] = $scope.formData.channelVariation;
      data.gameInfo['Chips Type'] = (($scope.formData.isRealMoney == "true")?("Real Money"):("Play Money"));
      data.gameInfo['Buy In'] = $scope.formData.minBuyIn + "/" + $scope.formData.maxBuyIn;
      data.gameInfo['Stakes'] = ($scope.formData.isPotLimit == "true")?("Pot Limit"):("No Limit") +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')';
      if(rakeToDisplay){
        data.gameInfo['Rake'] = rakeToDisplay+'%';
      }
      data.gameInfo['Rake(Heads Up)'] = $scope.formData.rake.rakePercentTwo+'%';
      data.gameInfo['Cap Amount'] = Math.max($scope.formData.rake.capTwo, $scope.formData.rake.capThreeFour, $scope.formData.rake.capMoreThanFive);
      data.gameInfo['Max Players'] = $scope.formData.maxPlayers;
      data.gameInfo['Straddle'] = (($scope.formData.isStraddleEnable == 'true')?("Straddle Mandatory"):("Straddle Optional"));
      data.gameInfo['Turn Time'] = $scope.formData.turnTime+' sec.';
      data.gameInfo['Anti-Banking'] = rootTools.antiBankingTime/60+' min.';
      
      data.numberOfRebuyAllowed = 1;
      data.rebuyHourFactor = 1;
      data.hourLimitForRebuy = 1;
      data.gameInterval = 1;
      data.minPlayers   = 2;
      data.favourite = false;
      // data.createdBy = $cookies.get('poker_userName');
      data.createdBy = $rootScope.poker_userName;
      $http.post("/createTable", data)
        .success(function(res){
          if(res.rTL){
            swal("Session Expired");
            $location.path('/login');
          } else{
            if(res.success){
              $cookies.put('poker_token', res.authToken);
               // informPlayer(res.table, 'addTable');
              swal("Success!", "Table created successfully.");
              // swal("Successfully created !!");
              $location.path('/listTable');
              $scope.listTables();

            } else{
              swal("Missing Keys")
            }
          }
        }).error(function(err){
          // swal(err);
        swal("Error!", "Getting error from server in creating table");
          // swal("Getting error from server in creating table");
        });
    }



    $scope.submit = function(){
      // if(formValid){
      //   console.log("validation passed",formValid);
      // } else {
      //   console.log("validation failed",formValid);
      //   return;
      // }
      console.log("submit fucntion called");
      var data = angular.copy($scope.formData);
      console.log("data===== ", data);
      // data.authToken = token;
      data.turnTime = JSON.parse(data.turnTime);
     // data.rakeRule = data.rakeRule._id;
      var potLimitInfo = ($scope.formData.isPotLimit == "true")?("Pot Limit"):("No Limit");
      // data.gameInfo = $scope.formData.channelName +'\n'+ $scope.formData.channelVariation +'\n'+ potLimitInfo +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')\nRake(%) 5+ Players: '+ $scope.formData.rake.rakePercentMoreThanFive +'\n'+ (($scope.formData.isStraddleEnable == "true")?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time: '+ $scope.formData.turnTime;    
      rakeStr1 = "";
      rakeStr2 = "";
      var rakeToDisplay = "";
      if($scope.formData.maxPlayers > 2 && $scope.formData.maxPlayers < 5){
        rakeStr1 = "Rake                      : " + $scope.formData.rake.rakePercentThreeFour+'%';
        rakeToDisplay = $scope.formData.rake.rakePercentThreeFour;
      }
      if($scope.formData.maxPlayers >= 5 ){
        rakeStr1 = "Rake                      : " + $scope.formData.rake.rakePercentMoreThanFive+'%';
        rakeToDisplay = $scope.formData.rake.rakePercentMoreThanFive;
      }
      
      rakeStr2 = "Rake(Heads Up)   : " + $scope.formData.rake.rakePercentTwo;
      var buyInStr = "\nBuy In : (" + $scope.formData.minBuyIn + "/" + $scope.formData.maxBuyIn + ")";
      // data.gameInfo = "Table Name : " + $scope.formData.channelName +'\nGame Variation : ' + $scope.formData.channelVariation + '\nChips Type : ' + (($scope.formData.isRealMoney == "true")?("Real Money"):("Play Money")) + buyInStr + '\nStakes : ' + potLimitInfo +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')\n' + rakeStr + '\nMax. Players : ' + $scope.formData.maxPlayers + '\nStraddle : ' + (($scope.formData.isStraddleEnable == "true")?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time : '+ $scope.formData.turnTime; 
      data.gameInfoString = "Table Name : " + $scope.formData.channelName +'\nGame Variation : ' + $scope.formData.channelVariation + '\nChips Type : ' + (($scope.formData.isRealMoney == "true")?("Real Money"):("Play Money")) + buyInStr + '\nStakes : ' + potLimitInfo +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')\n' + rakeStr1 +'\n'+ rakeStr2 + '\nMax. Players : ' + $scope.formData.maxPlayers + '\nStraddle : ' + (($scope.formData.isStraddleEnable == 'true')?("Straddle Mandatory"):("Straddle Optional"))+'\nTurn Time : '+ $scope.formData.turnTime; 
      // data.rakeRule = data.rakeRule._id;
      data.gameInfo = {};
      data.gameInfo['Table Name'] = $scope.formData.channelName;
      data.gameInfo['Game Variation'] = $scope.formData.channelVariation;
      data.gameInfo['Chips Type'] = (($scope.formData.isRealMoney == "true")?("Real Money"):("Play Money"));
      data.gameInfo['Buy In'] = $scope.formData.minBuyIn + "/" + $scope.formData.maxBuyIn;
      data.gameInfo['Stakes'] = ($scope.formData.isPotLimit == "true")?("Pot Limit"):("No Limit") +'('+$scope.formData.smallBlind+'/'+$scope.formData.bigBlind+')';
      if(rakeToDisplay){
        data.gameInfo['Rake'] = rakeToDisplay+'%';
      }
      data.gameInfo['Rake(Heads Up)'] = $scope.formData.rake.rakePercentTwo+'%';
      data.gameInfo['Cap Amount'] = Math.max($scope.formData.rake.capTwo, $scope.formData.rake.capThreeFour, $scope.formData.rake.capMoreThanFive);
      data.gameInfo['Max Players'] = $scope.formData.maxPlayers;
      data.gameInfo['Straddle'] = (($scope.formData.isStraddleEnable == 'true')?("Straddle Mandatory"):("Straddle Optional"));
      data.gameInfo['Turn Time'] = $scope.formData.turnTime+' sec.';
      data.gameInfo['Anti-Banking'] = rootTools.antiBankingTime/60+' min.';
      
      // data.updatedBy = $cookies.get('poker_userName');
      data.updatedBy = $rootScope.poker_userName;
      data.updatedByRole = $rootScope.poker_role;
      data.numberOfRebuyAllowed = 1;
      data.rebuyHourFactor = 1;
      data.hourLimitForRebuy = 1;
      data.gameInterval = 1;
      data.minPlayers   = 2;
      data.favourite = false;
      console.log(data.gameInfo);

      $http.put("/updateTable", data)
        .success(function(res){
          if(res.rTL){
            swal("Session Expired");
            $location.path('/login');
          } else{
            if(res.success){
              console.log("ListTableController line 223==", res);
              // informPlayer(data, 'tableUpdate');
              swal("Success!", "Table updated successfully.");
              // swal("Successfully updated !!");
              $location.path('/listTable');
              $scope.listTables();
            } else{
              swal("Error!", "This table is in running state. Cannot update!");
              // swal("This table is in running state. Cannot disable!")
            }
            $cookies.put('poker_token', res.authToken);
          }
        }).error(function(err){
          // swal(err);
          swal("Error!", "Getting error from server in updating table!");
          // swal("Getting error from server in updating tables");
        });

    }

   

    $scope.disable = function(list, check){

      swal({
      title: "Are you sure you want to " +check+ " this table?",
      text: '',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Proceed",
      closeOnConfirm: false,
      inputType : "text",
      html: true,
    }, function(){
       var data = {};

      if(list.isActive == true){
        data.isActive = false;
      } else{
        data.isActive = true;
      }
      data.id = list._id;
      $http.put("/disableTable", data)
        .success(function(res){
          if(res.rTL){
            swal("Session Expired");
            $location.path('/login');
          } 
          else{
            if(res.success){
              // $scope.listTables("", 0, 20);
              // $scope.$apply();
              console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + data);
              list.isActive = !list.isActive;

              if(!data.isActive) {
                disableTableBroadcast({route:"removeTable",tableId : list._id, event:"DISABLETABLE"});
              } else {
                console.log('going to active table in angular controller' + JSON.stringify(res));
                // informPlayer(res.table, 'addTable');
              }
              swal("Successfull !!");
            } else{
              swal("Error!", "This table is in running state. Cannot disable!");
            }
            $cookies.put('poker_token', res.authToken);
          }
        }).error(function(err){
          // swal(err);
          swal("Error!", "Getting error from server in updating tables");
        });
          
      });
      // if(confirm("Are you sure you want to " +check+ " this table?")){
      // console.log("disable function called===", list);
      
      // }
      // else{

      // }

    }

    $scope.revert = function(list, check){
      // console.log("revert function called===", list, check);
      swal({
      title: "Are you sure you want to " +check+ " this table?",
      text: '',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Proceed",
      closeOnConfirm: false,
      inputType : "text",
      html: true,
    }, function(){
        var data = {};
        data._id = list._id;
        $http.post("/revertTable", data)
          .success(function(res){
            console.log(res);
            if(res.success){
              $scope.listTables("", 0, 20);
              console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" + res);
              swal("Successfull !!", res.info);
            } else{
                swal("Info!", res.info);
            }
              $cookies.put('poker_token', res.authToken);
            
          }).error(function(err){
            swal("Error!", "Getting error from server in updating tables");
          });
          
      });
    }


    var disableTableBroadcast = function(broadcastData) {
      console.log('data in informPlayer is - '+ JSON.stringify(broadcastData));
      var pomelo = window.pomelo;
      console.log('rootTools.connectorHost - ' + rootTools.connectorHost)
      pomelo.init({
        host: rootTools.connectorHost,
        port: rootTools.connectorPort,
        log: true
      }, function(){
        console.log(' broadcastData is - ' + JSON.stringify(broadcastData));
        pomelo.request("connector.entryHandler.broadcastPlayers",{route: broadcastData.route, data:{event: broadcastData.event, _id: broadcastData.tableId}} , function(data){
          console.log(data);
          pomelo.disconnect();
        })
      })
    }


    var informPlayer = function(data, route) {
      console.log('data in informPlayer is - '+ JSON.stringify(data));
      var pomelo = window.pomelo;
      console.log('rootTools.connectorHost - ' + rootTools.connectorHost)
      pomelo.init({
        host: rootTools.connectorHost,
        port: rootTools.connectorPort,
        log: true
      }, function(){
        var table = cashGamesChangedData(data);
        console.log('tournament data is - ' + JSON.stringify(table));
        pomelo.request("connector.entryHandler.broadcastPlayers", {data: table, route: route} , function(data){
          console.log(data);
          pomelo.disconnect();
        })
      })
    }

    var cashGamesChangedData = function(data) {
      return {
        "_id"     : data._id,
        "updated" : {
          "isRealMoney"     : data.isRealMoney,
          "channelName"     : data.channelName,
          "turnTime"        : data.turnTime,
          "maxPlayers"      : data.maxPlayers,
          "smallBlind"      : data.smallBlind,
          "bigBlind"        : data.bigBlind,
          "minBuyIn"        : data.minBuyIn,
          "maxBuyIn"        : data.maxBuyIn,
          "channelVariation": data.channelVariation,
          "minPlayers"      : data.minPlayers,
          "favourite"       : data.favourite,
          "channelType"     : data.channelType,
          "avgStack"        : data.avgStack || 0,
          "flopPercent"     : data.flopPercent || 0,
          "isPotLimit"      : data.isPotLimit,
          "playingPlayers"  : data.playingPlayers||0,
          "queuePlayers"    : data.queuePlayers||0
        },
        "event"  : rootTools.event.cashGameTableChange
      }
    }

    $scope.searchFunction = function(){
      if(!$scope.channelVariation && !$scope.status && !$scope.channelName && !$scope.email && !$scope.isPrivateTabel && !$scope.minSmallBlind && !$scope.maxSmallBlind && !$scope.minBuyInMin && !$scope.minBuyInMax && !$scope.minPlayerLimit && !$scope.maxPlayerLimit && !$scope.turnTime ){
        swal("Please provide at least one input.")
      }
      else{
        $scope.getSubAffiliateCount();
      }
    }

    $scope.reset = function(){
      $scope.channelVariation = "";
      $scope.status = "";
      $scope.channelName = "";
      $scope.email = "";
      $scope.isPrivateTabel = "";
      $scope.minSmallBlind = "";
      $scope.maxSmallBlind = "";
      $scope.minBuyInMin = "";
      $scope.minBuyInMax = "";
      $scope.minPlayerLimit = "";
      $scope.maxPlayerLimit = "";
      $scope.turnTime = "";
      $scope.isRealMoney = "All";

      $scope.countData();
    }



   

    // $scope.init();    


}]);


;
var console = {};
console.log = function(){};
console.error = function(){};

angular.module('MetronicApp').controller('LoginController', ["$location", "$cookies", "$rootScope", "$scope", "$http", "$timeout", "$window", function($location, $cookies, $rootScope, $scope, $http, $timeout, $window) {
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
      data.keyForRakeModules = true;
      if((data.userName) && (data.password)){
        $http({
        method : "post",
        url : "/login",
        data:  data,
        headers: {'Content-Type': 'application/json'},
        unique: true,
        requestId: 'helpppp'

      }).then(function mySucces(res) {
        console.log('res.result++++++++++++++ '+JSON.stringify(res.data.result) );
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

          $rootScope.poker_token = $cookies.get('poker_token');
          $rootScope.poker_name = base64_decode($cookies.get('poker_name'));
          $rootScope.poker_role = JSON.stringify(res.data.result.role);
          console.error($rootScope.poker_role);
          console.error(typeof $rootScope.poker_role);
          $rootScope.poker_userName = base64_decode($cookies.get('poker_userName'));
          $rootScope.poker_email = base64_decode($cookies.get('poker_email'));
          $rootScope.poker_parent = base64_decode($cookies.get('poker_parent'));
          $rootScope.poker_uniqueSessionId = base64_decode($cookies.get('poker_uniqueSessionId'));
          $rootScope.poker_loggedinUserMobileNum = base64_decode($cookies.get('poker_loggedinUserMobileNum'));
          $rootScope.poker_modeAccess = res.data.result.moduleAccess;

          // console.log(typeof (base64_encode(res.data.result.role)))
          // console.log($rootScope.poker_token)
          // console.log($rootScope.poker_name)
          // console.log($rootScope.poker_role)
          // console.log($rootScope.poker_userName)
          // console.log($rootScope.poker_email)
          // console.log($rootScope.poker_parent)
          // console.log($rootScope.poker_uniqueSessionId)
          // console.log($rootScope.poker_loggedinUserMobileNum)
          console.log($rootScope.poker_modeAccess)
          // $rootScope.poker_token = base64_decode($cookies.get('poker_token'));
          // $rootScope.poker_name = base64_decode($cookies.get('poker_name'));
          // $rootScope.poker_role = JSON.stringify(base64_decode($cookies.get('poker_role')));
          // $rootScope.poker_userName = base64_decode($cookies.get('poker_userName'));
          // $rootScope.poker_email = base64_decode($cookies.get('poker_email'));
          // $rootScope.poker_parent = base64_decode($cookies.get('poker_parent'));
          // $rootScope.poker_uniqueSessionId = base64_decode($cookies.get('poker_uniqueSessionId'));
          // $rootScope.poker_loggedinUserMobileNum = base64_decode($cookies.get('poker_loggedinUserMobileNum'));
          // $rootScope.poker_modeAccess = base64_decode($cookies.get('poker_modeAccess'));

          $rootScope.isAdminLogin=true;

          if(res.data.result.role){
            $rootScope.role = "Super Admin";
          }

          else if(res.data.result.department == 'Admin'){
            $rootScope.role = 'Admin';
          }

          else{
            $rootScope.role = 'Affiliate';
          }

           // console.log("djfhkldnf== ", JSON.stringify($cookies.get('poker_role')));
           console.log("djfhkldnf== ", ($rootScope.poker_role));
           console.log("line 60 == ", res.data.result);
           console.log($rootScope.role)
           $rootScope.userName = res.data.result.userName;
           $rootScope.moduleAccess=res.data.result.moduleAccess;
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

}]);
;angular.module('MetronicApp').controller('LoyaltyPointsController', ["$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", "$location", function($cookies, $rootScope, $scope, $stateParams, $http, $timeout, $location) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, LoyaltyPointsController loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }


    $scope.data = {};
    $scope.turnTimesList = rootTools.turnTimesList;


    // $scope.init = function(){
    //   $cookies.remove('poker_token');
    //   $cookies.remove('poker_name');
    //   $cookies.remove('poker_role');
    //   $cookies.remove('poker_userName');
    //   $cookies.remove('poker_email');
    //   $cookies.remove('poker_parent');
 

    // }
    
    $scope.setDefaultValue = function(){
      if($scope.formData.loyaltyLevel == 'Bronze'){
        $scope.formData.levelThreshold = 0;
      }
      else{
        $scope.formData.levelThreshold = "";
      }
    }

  
    $scope.submitLoyaltyPoints = function(){
      console.log("submitLoyaltyPoints fucntion called");
      var data = angular.copy($scope.formData);
      console.log("data===== ", data);
      $http.post("/createLoyaltyPoints", data)
        .success(function(res){
          if(res.rTL){
            swal("Session Expired");
            $location.path('/login');
          } else{
            if(res.success){
              $cookies.put('poker_token', res.authToken);
              swal("Success!", "Loyalty level created successfully.");
              // swal("Successfully created !!");
              $scope.formData = {};
              $scope.loyaltyPointsForm.$setPristine();
              //$location.path('/loyaltyPoints/list');
            } else{
        swal("Error!", res.info);
              // swal(res.info);
              console.log(res)
            }
          }
        }).error(function(err){
          // swal(err);
          swal("Error!", "Getting error from server in creating table");
          // swal("Getting error from server in creating table");
        });

    }

    $scope.updateLoyaltyPoints = function(){
      console.log("updateLoyaltyPoints fucntion called");
      var data = angular.copy($scope.editData);
      console.log("data===== ", data);
      $http.post("/updateLoyaltyPoints", data)
        .success(function(res){
          if(res.rTL){
            swal("Session Expired");
            $location.path('/login');
          } else{
            if(res.success){
              $cookies.put('poker_token', res.authToken);
              swal("Success!", "Loyalty level updated successfully.");
              // swal("Successfully updated !!");
              $location.path('/loyaltyPoints/list');
            } else{
        swal("Error!", res.info);
              // swal(res.info);
              console.log(res)
            }
          }
        }).error(function(err){
          // swal(err);
          swal("Error!", "Getting error from server in updating loyalty level.");
          // swal("Getting error from server in creating table");
        });

    }

    $scope.listLoyaltyPoints = function(id){
      // token = $cookies.get('poker_token');
      var data ={};
      if(id){
        data._id = id;
      }
      console.log("listLoyaltyPoints called,,", data);
      $http.post("/listLoyaltyPoints", data)
      .success(function(res){
          console.log("res.result---------", res.result);
          $scope.dataList = res.result;
          $scope.editData = res.result[0];
          // listTableResult.result = res.result;

      }).error(function(err){
          swal("Error!", "Getting error from server in showing loyalty levels.");
          // swal("Getting error from server in showing tables");
      });

    }

      if($stateParams.loyaltyPointsId){
        console.log("stateParams", $stateParams.loyaltyPointsId);
        $scope.listLoyaltyPoints($stateParams.loyaltyPointsId);
      }
      else
      {
        $scope.listLoyaltyPoints();
      }





}]);


;angular.module('MetronicApp').controller('MaintenanceController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded", $rootScope.isAdminLogin);
      if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.isAffiliate = false; 

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.currentPage = 1;
    $scope.pageSize = 20;
    $scope.totalPage = 0;
    
    $scope.serverRunning = true;

    var downtimeOffset = 60;
    var uptimeOffset = 120;

    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listMaintenances("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    
    $('#datetimepicker1').datetimepicker('setStartDate', new Date(Number(new Date()) + downtimeOffset*60*1000));
    // $('#datetimepicker2').datetimepicker('setStartDate',  new Date($("#datetimepicker1").data("datetimepicker").getDate()));

    $scope.onStartDateChange = function(){
      $('#datetimepicker2').datetimepicker('setStartDate',  new Date(Number(new Date($("#datetimepicker1").data("datetimepicker").getDate())) + uptimeOffset*60*1000));
    }
    
    $scope.scheduleMaintenance = function(){
      var data = angular.copy($scope.formData);
      data.serverDownTime = Number(new Date(data.serverDownTime));
      data.serverUpTime = Number(new Date(data.serverUpTime));
      if(!data.serverUpTime || !data.serverDownTime){
        swal("Server uptime and downtime are required!");
        return false;
      }
      // data.createdBy = { name: $cookies.get('poker_name'), userName: $cookies.get('poker_userName'), role: JSON.parse($cookies.get('poker_role')), id: $cookies.get('poker_email')};
      data.createdBy = { name: $rootScope.poker_name, userName: $rootScope.poker_userName, role: JSON.parse($rootScope.poker_role), id: $rootScope.poker_email};
      console.log("data== ", data);
      swal({
      title: "Are you sure you want to schedule maintenance?",
      text: '',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Proceed",
      closeOnConfirm: false,
      inputType : "text",
      html: true,
    }, function(){
        $http.post("/scheduleMaintenance", data)
        .success(function(res){
            console.log("res.result---------", res);
            if(res.success){
              swal("Success!", "Scheduled successfully.");
              $location.path('/maintenance/list')
            }
            else{
              swal(res.info);
            }

        }).error(function(err){
            swal("Getting error from server in scheduling maintenance!");
        });
      
      
    });
  }

  $scope.editMaintenance = function(){
    var data = {};
    data.serverUpTime = Number(new Date($scope.dataList[0].serverUpTime));
    data._id = $stateParams.maintenanceId;
    console.log("data== ", data);
    swal({
    title: "Are you sure you want to re-schedule maintenance?",
    text: '',
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Proceed",
    closeOnConfirm: false,
    inputType : "text",
    html: true,
    }, function(){
        $http.post("/editMaintenance", data)
        .success(function(res){
            console.log("res.result---------", res);
            if(res.success){
              swal("Success!", res.info);
              $location.path('/maintenance/list')
            }
            else{
              swal(res.info);
            }

        }).error(function(err){
            // swal(err);
            swal("Getting error from server in scheduling maintenance!");
        });
    });
  }


  $scope.cancelSchedule = function(id){
    var data = {};
    data._id = id;
    console.log("data== ", data);
    swal({
    title: "Are you sure you want to cancel maintenance?",
    text: '',
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Proceed",
    closeOnConfirm: false,
    inputType : "text",
    html: true,
    }, function(){
        $http.post("/cancelMaintenance", data)
        .success(function(res){
            console.log("res.result---------", res);
            if(res.success){
              swal("Success!", res.info);
              $scope.countMaintenances();
            }
            else{
              swal(res.info);
            }

        }).error(function(err){
            // swal(err);
            swal("Getting error from server in scheduling maintenance!");
        });
    });
  }

  $scope.countMaintenances = function(id){
    var data = {};
    $http.post("/countMaintenances", data)
      .success(function(res){
          console.log("res.result---------", res);
          if(res.success){
            $scope.totalPage = res.result;
            $scope.newPageList();
          }
          else{
            swal(res.info);
          }
      }).error(function(err){
          // swal(err);
          swal("Getting error from server!");
      });
  }
  
  $scope.listMaintenances = function(id, skip, limit){
    var data = {};
    if(id){
      data._id = id;
    }
    data.skip = skip;
    data.limit = limit;
    $http.post("/listMaintenances", data)
      .success(function(res){
          console.log("res.result---------", res);
          if(res.success){
            $scope.dataList = res.result;
            if(id){
              res.result[0].serverUpTime = new Date(res.result[0].serverUpTime);
              $scope.dataList = res.result;
              data._id = id;
            }
          }
          else{
            swal(res.info);
          }
      }).error(function(err){
          // swal(err);
          swal("Getting error from server!");
      });
  }


  $scope.fetchServerState = function(){
    var data = {};
    $http.post("/getServerState", data)
      .success(function(res){
          console.log("res.result---------", res);
          if(res.success){
            $scope.serverRunning = res.status;
            $scope.serverInfo = res.info;
          }
          else{
            swal(res.info);
          }
      }).error(function(err){
          swal("Getting error from server!");
      });
  }

  $scope.changeServerState = function(){
    var data = {};
    // data.createdBy = { name: $cookies.get('poker_name'), userName: $cookies.get('poker_userName'), role: JSON.parse($cookies.get('poker_role')), id: $cookies.get('poker_email')};
    data.createdBy = { name: $rootScope.poker_name, userName: $rootScope.poker_userName, role: JSON.parse($rootScope.poker_role), id: $rootScope.poker_email};
    $http.post("/changeServerState", data)
      .success(function(res){
          console.log("res.result---------", res);
          if(res.success){
            $scope.serverRunning = res.status;
            $scope.serverInfo = res.info;
            $scope.countMaintenances()
          }
          else{
            swal(res.info);
          }
      }).error(function(err){
          swal("Getting error from server!");
      });
  }

  

  if($stateParams.maintenanceId){
    $('#datetimepicker2').datetimepicker('setStartDate',  new Date());
    $scope.listMaintenances($stateParams.maintenanceId)
  }


}]);


;angular.module('MetronicApp').controller('MonthlyChipsReportController', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside ChipsReportController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject = {};

    
    $scope.newPageList = function () {
        $scope.init(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
        $window.scrollTo(0, 0);
    }

    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }


    $scope.init = function(skipData,limitData){
      showList = true;
      var data = {};
      // console.log("$$$$$$$$$$$$$$$$$$4",$cookies.get('poker_userName'));
      console.log("$$$$$$$$$$$$$$$$$$4",$rootScope.poker_userName);
      // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
      if((JSON.parse($rootScope.poker_role)).level <= 0){
         // $scope.queryObject.loginId = $cookies.get('poker_userName');
         $scope.queryObject.loginId = $rootScope.poker_userName;
      }
      data = $scope.queryObject;
      
      var startDate =  new Date($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  new Date($('.date-picker2').data("datepicker").getUTCDate());
      startDate.setDate(1);
      endDate.setDate(1);
      endDate.setMonth(endDate.getMonth()+1);
      endDate = endDate - 1000;

      if(!$scope.startDate){
       startDate = new Date();
       startDate.setUTCMonth(startDate.getUTCMonth()-1);
       startDate.setUTCDate(1);
       startDate.setUTCHours(0);
       startDate.setUTCMinutes(0);
       startDate.setUTCSeconds(0);
       startDate.setUTCMilliseconds(0);
       endDate = new Date();
     }
      
      data.date = { "$gte": Number(startDate), "$lt": Number(endDate)};
      data.skip = skipData;
      data.limit = limitData;
      $http.post("/monthlyChipsReport", data)
        .success(function(res){
          console.log("The result in transactionHistoryReportController", res.result);
          $scope.listTransaction = res.result;
          if(res.result.length == 0){
            swal("No data found.")
          }
          $scope.listTransaction.sort(function(a, b){
            return b.date - a.date ;
          })
          $scope.listTransaction2 = $scope.listTransaction.slice(0, 20);
          $scope.totalPage = $scope.listTransaction.length;
        }).error(function(err){
          swal("Error!", "Getting error from server in showing transaction History");
      });
    }

    $scope.init();

    $scope.searchHistory = function(){
      $scope.currentPage = 1;
      console.log("************** queryObject",JSON.stringify($scope.queryObject));
      $scope.init();
    }


    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $('.date-picker1').data("datepicker").value = "";
      $scope.init();
    }

    $scope.newPageData = function(){
      // $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      var startIndex = (($scope.currentPage - 1) * $scope.pageSize);
      $scope.listTransaction2 = $scope.listTransaction.slice(startIndex, startIndex + 20);
      console.log("line 202", $scope.currentPage, $scope.pageSize, startIndex);
      console.log("line 203", $scope.listTransaction2.length);
      console.log("line 204", $scope.listTransaction);
    }

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      var exportHref=Excel(tableId,'sheet_name');
      $timeout(function(){location.href=exportHref;},100); // trigger download
    };
    
    
    // $scope.newPageData();
}]);;angular.module('MetronicApp').controller('PlayerController', ["$location", "$cookies", "$rootScope", "$stateParams", "$scope", "$http", "$timeout", function($location, $cookies, $rootScope, $stateParams, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss",$rootScope.isAdminLogin)
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.departmentList = rootTools.employeeList;
    $('.date-picker').datepicker({'autoclose' : true});

    $scope.playerData = {};
    $scope.xyz = true;
    console.log("DashboardController called",$rootScope.isAdminLogin,$rootScope.role,"role")
    if(!$rootScope.isAdminLogin){
      console.log('yes', $rootScope.role)
      $location.path('/login.html')
    }
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;
    $scope.userData = {};
    $scope.userData.module = [];
    $scope.selectedList = {};
    var selected = [];

    $scope.newPageList = function () {
        console.log("totalpage____________________________"+$scope.totalPage);
        $scope.listUsers("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
    }



    $('input:checked').each(function() {
      console.log($(this).is(":checked"))
        selected.push($(this).attr('value'));
    });
    $scope.userData.module = selected.filter(function(n){ return n != undefined });





    // console.log("======", $cookies.get('poker_role'));
    // $scope.userAccess = JSON.parse($cookies.get('poker_role'));
    $scope.userAccess = JSON.parse($rootScope.poker_role);
    console.log(($scope.userAccess));
    console.log("===", $scope.userAccess.level);
    if($scope.userAccess.level == -1){
      $scope.setDisabled = true;
      // $scope.playerData.affiliateId = $cookies.get('poker_userName');
      $scope.playerData.affiliateId = $rootScope.poker_userName;
    }

    if($scope.userAccess.level == 0){
      // $scope.playerData.affiliateId = $cookies.get('poker_userName');
      $scope.playerData.affiliateId = $rootScope.poker_userName;
    }
    
    $scope.submitByAdmin = function(){
         
        $scope.playerData.status = "INACTIVE";
        // $scope.playerData.createdBy = $cookies.get('poker_userName');
        $scope.playerData.createdBy = $rootScope.poker_userName;
        // $scope.playerData.parentUserRole = JSON.parse($cookies.get('poker_role'));
        $scope.playerData.parentUserRole = JSON.parse($rootScope.poker_role);
        $scope.playerData.isParentUserName = $scope.playerData.affiliateId || "";
        // $scope.playerData.loggedInUser = $cookies.get('poker_userName');
        $scope.playerData.loggedInUser = $rootScope.poker_userName;
        $scope.playerData.isParent = "";
        console.log("playerData== ", $scope.playerData);
        $http({
            method : "post",
            url : "/createPlayer",
            data:  $scope.playerData,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            if(res.data.success){
                swal("Success!", "Successfully player created!");
                $scope.playerData={};
                $scope.cnfpassword = "";
                $scope.playerForm.$setPristine();
                // $location.path('/listPlayer')
            }else{
                swal(res.data.info)
            }

        }, function myError(err) {
            console.log(err,"err")
                swal("Error!", "Getting error from server!");
        });
    }

    $scope.submitByAffiliate = function(){
         
      if(!$scope.playerData.affiliateId){
        swal('Affiliate ID cannot be blank!');
        return false;
      }
      $scope.playerData.status = "INACTIVE";
      // $scope.playerData.createdBy = $cookies.get('poker_userName');
      $scope.playerData.createdBy = $rootScope.poker_userName;
      // $scope.playerData.parentUserRole = JSON.parse($cookies.get('poker_role'));
      $scope.playerData.parentUserRole = JSON.parse($rootScope.poker_role);
      $scope.playerData.isParentUserName = $scope.playerData.affiliateId;
      // $scope.playerData.loggedInUser = $cookies.get('poker_userName');
      $scope.playerData.loggedInUser = $rootScope.poker_userName;
      console.log("playerData== ", $scope.playerData);
      $http({
          method : "post",
          url : "/createPlayer",
          data:  $scope.playerData,
          headers: {'Content-Type': 'application/json'}
      }).then(function mySucces(res) {
          if(res.data.success){
              swal("Success!", "Successfully user created!");
              $scope.playerData={};
              $scope.cnfpassword = "";
              $scope.playerForm.$setPristine();
              // console.log($scope.userAccess)
              if($scope.userAccess.level == -1){
                $scope.setDisabled = true;
                // $scope.playerData.affiliateId = $cookies.get('poker_userName');
                $scope.playerData.affiliateId = $rootScope.poker_userName;
              }
              // $location.path('/listPlayer')
          }else{
              swal(res.data.info)
          }
        }, function myError(err) {
            console.log(err,"err")
            swal("Error!", "Getting error from server!");
      });
    }

    
    $scope.update = function(){
         var selected = [];
        $('input:checked').each(function() {
          console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.userData.module = selected.filter(function(n){ return n != undefined });
        if(typeof $scope.userData.role == 'string'){
        	$scope.userData.role = JSON.parse($scope.userData.role);
        }
        $scope.userData.id = $stateParams.userId;
        console.log("userData== ", $scope.userData);
        $http({
            method : "post",
            url : "/updateUserInfo",
            data:  $scope.userData,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            if(res.data.success){
                swal("Success!", "Successfully user updated!");
                $scope.affiliateData={};
                $location.path('/listUsers')
            }else{
                swal(res.data.info)
            }

        }, function myError(err) {
            console.log(err,"err")
                swal("Error!", "Getting error from server in login!");
        });
    }



    $scope.listUsers = function(id, skip, limit){
      var data = {};
      if(id){
      	data._id = id;
      }
      data.level = $scope.userAccess.level;
      data.skip = skip;
			data.limit = limit;
      $http({
         method : "post",
         url : "/listUsersAndCalculateBonus",
         data:  data,
         headers: {'Content-Type': 'application/json'}
     }).then(function mySucces(res) {
         
      if(res.data.success){
        console.log(res.data);
        $scope.dataList = res.data.result
        if(id){
        	for(var i in res.data.result[0].module){
        		$scope.selectedList[res.data.result[0].module[i]] = true;
        	}
        }
        $scope.userData=res.data.result[0];
      }else{
        swal("Error!", res.data.info);
       }

          }, function myError(err) {
            console.log(err,"err")
            swal("Error!", "Getting error from server in login");
        });

    }


    $scope.editUser = function(){
    	if($stateParams.userId){
    		$scope.listUsers($stateParams.userId);
    	}

    }

    $scope.checkAge = function(birthDate) { 
      var today = new Date();
      var birthDate = new Date(birthDate);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
      {
          age--;
      }
      if(age < 18){
        swal("Info!", "You are less than 18 years so your account cannot be created.");
        $scope.playerData.dob = null;
      }
    }

}]);




;angular.module('MetronicApp').controller('PlayerGameHistoryController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }
    // $('.date-picker').datepicker('setEndDate', new Date());
    $('#datetimepicker').datetimepicker('setEndDate', new Date());
    $('#datetimepicker1').datetimepicker('setEndDate', new Date());
    $scope.pageSize = 7;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.totalRake = 0;
    
    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listPlayerData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    $scope.data = {};

    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');
    }

    $scope.countPlayerData = function(){
      $scope.dataList = "";
      $scope.totalPage = 0;
      if(!$scope.userId){
        swal("Error!", "Please enter a player ID!");
        return;
      }
      var data ={};
      data.userName = $scope.userId;
      if($scope.channelVariation){
        data.channelVariation = $scope.channelVariation;
      }
      if($scope.channelName){
        data.channelName = $scope.channelName;
      }
      if($scope.roundId){
        data.roundId = $scope.roundId;
      }
      if($scope.startDate){
        data.startDate = Number(new Date($scope.startDate));
      }
      if($scope.endDate){
        data.endDate = Number(new Date($scope.endDate));
      }

      // data.isRealMoney = $scope.isRealMoney;
      if($scope.isRealMoney){
        data.isRealMoney = $scope.isRealMoney;
      }
      console.log("data == ", data, $scope.startDate, $scope.endDate);

      $http.post("/countPlayerGameHistory", data)
      .success(function(res){
        console.log("res.result---------", res);
        if(res.success){
          $scope.totalPage = res.result;
          $scope.newPageList();
        }
        else{
          swal("No data found!");
        }

      }).error(function(err){
         swal("Error!", "Getting error from server in showing tables");
      });

    }


    $scope.listPlayerData = function(id, skip, limit, cb){
      if(!$scope.userId){
        swal("Error!", "Please enter a player ID!");
        return;
      }
      var data ={};
      data.userName = $scope.userId;
      if($scope.channelVariation){
        data.channelVariation = $scope.channelVariation;
      }
      if($scope.channelName){
        data.channelName = $scope.channelName;
      }
      if($scope.roundId){
        data.roundId = $scope.roundId;
      }
      if($scope.startDate){
        data.startDate = Number(new Date($scope.startDate));
      }
      if($scope.endDate){
        data.endDate = Number(new Date($scope.endDate));
      }
      if($scope.isRealMoney){
        data.isRealMoney = $scope.isRealMoney;
      }
      data.skip = skip;
      data.limit = limit;

      $http.post("/listPlayerGameHistory", data)
      .success(function(res){
        console.log("res.result---------", res);
        if(res.success){
          for(var i = 0 ; i<res.result.length; i++){
            res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
          }
          $scope.dataList = res.result;
        }
        else{
          swal("No data found!");
        }

        if(cb instanceof Function){
          cb();
        }

      }).error(function(err){
         swal("Error!", "Getting error from server in showing tables");
      });
    }

    $scope.resetForm = function(){
      $scope.userId = "";
      $scope.channelVariation = "";
      $scope.channelName = "";
      $scope.roundId = "";
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.dataList = "";
      $scope.totalPage = 0;
    }

    $scope.onStartDateChange = function(){
      $scope.endDate = !($scope.startDate)?$scope.startDate:"";
    }

    $scope.onEndDateChange = function(){

      if( Number(new Date($scope.startDate)) > Number(new Date($scope.endDate)) ){
         $scope.endDate = "";
         swal({
          title: "End date must be greater then start date.",
          text: '',
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Close",
          closeOnConfirm: true,
          inputType : "text",
          html: true,
        }, function(){
      
        });
       }
    }


    $scope.getTableList = function(){
      // console.log("getTableList called");
      var data = {};
      if($scope.isRealMoney){
        data.isRealMoney = $scope.isRealMoney;
      }
      console.log("line 177", data);
      $http.post("/listAllCashTable", data)
      .success(function(res){
        if(res.success){
          // console.log("res.result---------", res.result);
          $scope.tableList = res.result;
        }
        else{
          $scope.tableList = "";
          swal('Error', res.info);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });

    }
    
    $scope.getTableList();

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
      template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
      format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
      var table=$(tableId),
      ctx={worksheet:worksheetName,table:table.html()},
      href=uri+base64(format(template,ctx));
      console.log("ctx ", table.context);
      return href;
    }
  
 
    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listPlayerData("", 0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.listPlayerData("", 0, 7);
          // $scope.resetForm();
        },500); // trigger download
      });
    };


}]);


;angular.module('MetronicApp').controller('PlayerMagnetChipsHistoryController', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside ChipsReportController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    // $scope.queryObject = {};

    
    $scope.newPageList = function () {
        $scope.init(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
        $window.scrollTo(0, 0);
    }

    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }


    $scope.init = function(skipData,limitData){
      showList = true;
      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select an end date!");
        return;
      }

      if(!$scope.playerName){
        swal("Error!", "Please enter a username!");
        return;
      }
      var data = {};
      // console.log("$$$$$$$$$$$$$$$$$$4",$cookies.get('poker_userName'));
      // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
      //    $scope.queryObject.loginId = $cookies.get('poker_userName');
      // }
      // data = $scope.queryObject;
      
      var startDate =  new Date($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  new Date($('.date-picker2').data("datepicker").getUTCDate());
      // startDate.setDate(1);
      // endDate.setDate(1);
      // endDate.setMonth(endDate.getMonth()+1);

      startDate.setUTCDate(1);
      startDate.setUTCHours(0);
      startDate.setUTCMinutes(0);
      startDate.setUTCSeconds(0);
      startDate.setUTCMilliseconds(0);
      startDate.setUTCMonth(startDate.getMonth()+1);
      // endDate.setUTCDate(1);
      endDate.setUTCDate(1);
      endDate.setUTCHours(0);
      endDate.setUTCMinutes(0);
      endDate.setUTCSeconds(0);
      endDate.setUTCMilliseconds(0);
      endDate.setUTCMonth(endDate.getMonth()+2);



      
      // data.date = { "$gte": Number(startDate), "$lt": Number(endDate)};
      // data.skip = skipData;
      // data.limit = limitData;
      console.log("data ==== ", data);
      data.startDate = Number(startDate);
      data.endDate = Number(endDate);
      data.userName = $scope.playerName;
      $http.post("/playerMagnetChipsDetails", data)
        .success(function(res){
          if(res.success){
            console.log("The result in transactionHistoryReportController", res.result);
            $scope.listTransaction = res.result;
            $scope.listTransaction.sort(function(a, b){
              return b.date - a.date ;
            })
            $scope.listTransaction2 = $scope.listTransaction.slice(0, 20);
            $scope.totalPage = $scope.listTransaction.length;
          }
          else{
            swal("Error!", "No data found!");
            $scope.listTransaction2 = 0;
            $scope.totalPage = 0;
          }
        }).error(function(err){
          swal("Error!", "Getting error from server in showing transaction History");
      });
    }

    // $scope.init();

    $scope.searchHistory = function(){
      $scope.currentPage = 1;
      console.log("************** queryObject",JSON.stringify($scope.queryObject));
      $scope.init();
    }


    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.playerName = "";
      $('.date-picker1').data("datepicker").value = "";
      $scope.listTransaction = 0;
      $scope.listTransaction2 = 0;
      $scope.totalPage = 0;
    }

    $scope.newPageData = function(){
      // $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      var startIndex = (($scope.currentPage - 1) * $scope.pageSize);
      $scope.listTransaction2 = $scope.listTransaction.slice(startIndex, startIndex + 20);
      console.log("line 202", $scope.currentPage, $scope.pageSize, startIndex);
      console.log("line 203", $scope.listTransaction2.length);
      console.log("line 204", $scope.listTransaction);
    }

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      var exportHref=Excel(tableId,'sheet_name');
      $timeout(function(){location.href=exportHref;},100); // trigger download
    };
    
    
    // $scope.newPageData();
}]);;angular.module('MetronicApp').controller('RakeByTimeOfDayController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) {
    console.log("Inside RakeByTimeOfDayController  @@@@@@@@@");
    var data = {};

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.setVisible = false;

    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }

    $scope.generateChart = function(){
        if(!$scope.startDate){
          swal("Error!", "Please select a start date!");
          return;
        }

        if(!$scope.endDate){
          swal("Error!", "Please select a end date!");
          return;
        }

        var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
        var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
        if(startDate){
          data.startDate = startDate;
        }

        if(endDate){
          data.endDate = endDate;
        }
        // data.userName = $cookies.get('poker_userName');
        data.userName = $rootScope.poker_userName;
        // data.role = JSON.parse($cookies.get('poker_role'));
        data.role = JSON.parse($rootScope.poker_role);
        $scope.init();
    }
    $scope.init = function(){
      if(data.role.level<=0){
        // data.loginId = $cookies.get('poker_userName');
        data.loginId = $rootScope.poker_userName;
      }
      $scope.setVisible = true;
      console.log("the data in RakeByTimeOfDayController ",JSON.stringify(data));
      data.keyForRakeModules = true;
      $http.post("/generateRakeByTimeChart", data)
      .success(function(res){
        if(res.success){
            $scope.setVisible = true;
            swal("Success!", "Data Retreived  successfully.");
            var object = [];
            console.log("*****************",res.result);
            var  j = 1;
            for(var i = res.result.length-1; i>=0;i--){
                var tempObj = {};
                // tempObj.dailyRakeCurrentMonth = res.result.currentMonthRakeData[i].dailyAllRake;
                tempObj.day = new Date(res.result[i].date).getHours() + ":"+ new Date(res.result[i].date).getMinutes();
                if(new Date(res.result[i].date).getMinutes() == 0){
                  tempObj.day = tempObj.day + "0";
                }
                tempObj.dailyRakePrevMonth = res.result[i].hourlyAllRake;
                // j = j + 1;
                object.push(tempObj);
            }

            console.log("###############",object);
            var chart = AmCharts.makeChart( "chartdiv2", {
            "type": "serial",
            "addClassNames": true,
            "theme": "light",
            "autoMargins": false,
            "marginLeft": 80,
            "marginRight": 8,
            "marginTop": 10,
            "marginBottom": 26,
            "balloon": {
              "adjustBorderColor": false,
              "horizontalPadding": 10,
              "verticalPadding": 8,
              "color": "#ffffff"
            },

            "dataProvider": object,
            "valueAxes": [ {
              "axisAlpha": 0,
              "position": "left"
            } ],
            "startDuration": 1,
            "graphs": [ {
              "alphaField": "alpha",
              "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
              "fillAlphas": 1,
              "title": "dailyRakeCurrentMonth",
              "type": "column",
              "valueField": "dailyRakeCurrentMonth",
              "dashLengthField": "dashLengthColumn"
            }, {
              "id": "graph2",
              "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
              "bullet": "round",
              "lineThickness": 3,
              "bulletSize": 7,
              "bulletBorderAlpha": 1,
              "bulletColor": "#FFFFFF",
              "useLineColorForBulletBorder": true,
              "bulletBorderThickness": 3,
              "fillAlphas": 0,
              "lineAlpha": 1,
              "title": "Rake",
              "valueField": "dailyRakePrevMonth",
              "dashLengthField": "dashLengthLine"
            } ],
            "categoryField": "day",
            "categoryAxis": {
              "gridPosition": "start",
              "axisAlpha": 0,
              "tickLength": 0
            },
            "export": {
              "enabled": true
            }
          } );
          console.log(res);
          $scope.formdata = {};
          // $scope.rakeChartForm.$setPristine();

        }else{
          swal("Error!", res.result);
            $scope.setVisible = false;
        }

      }).error(function(err){
        swal("Error!", "Getting error from server in showing daily rake report. ");
      });


    }

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $("#chartdiv2").html("");
    }


  }]);
;angular.module('MetronicApp').controller('RakeDailyRakeChartController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) {
    console.log("Inside RakeDailyRakeChartController  @@@@@@@@@");
    var data = {};

    $('.date-picker').datepicker('setEndDate', new Date());

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.setVisible = false;

    $scope.newSchedule = function(){
        console.log($('.scheduleDate').val())
        if(!$('.scheduleDate').val()) {
            return false;
        }

        // d.setDate(1);
        // d.setHours(0);
        // d.setMilliseconds(0);
        // d.setMinutes(0);
        // d.setSeconds(0);
        var d = ($('.date-picker').data("datepicker").getUTCDate());

        d.setUTCDate(1);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        console.log("the value of date is ", Number(d));
        data.addeddate = Number(d);
        $scope.init();
    }
    $scope.init = function(){
      $scope.setVisible = true;
      console.log($scope.formdata.name);
      // console.log($cookies.get('poker_userName'));
      console.log($rootScope.poker_userName);
      console.log("the value inside cookies of RakeDailyRakeChartController is",$cookies.getAll());
      data.userName = $scope.formdata.name;
      // data.role = JSON.parse($cookies.get('poker_role'));

      data.role = ($rootScope.poker_role);
      if(typeof $rootScope.poker_role == 'string'){
        data.role = JSON.parse($rootScope.poker_role);
      }
      if(data.role.level<=0){
        // data.loginId = $cookies.get('poker_userName');
        data.loginId = $rootScope.poker_userName;
      }
      console.log("the data in RakeDailyRakeChartController ",JSON.stringify(data));
      if(data.addeddate){
        console.log("All fields are present");
        data.keyForRakeModules = true;
        $http.post("/generateDailyRakeChart", data)
        .success(function(res){
          console.log("res ", res);
          if(res.success && ((res.result.currentMonthRakeData && res.result.currentMonthRakeData.length > 0) || (res.result.previousMonthRakeData && res.result.previousMonthRakeData.length > 0))){
              console.log("line 58", $scope.setVisible)
              $scope.setVisible = true;
              console.log("line 60", $scope.setVisible)
              swal("Success!", "Data Retreived  successfully.");
              var object = [];
              // for(var i = 0; i<res.result.currentMonthRakeData.length;i++){
              console.log("*****************",res.result.currentMonthRakeData);
              console.log("*****************",res.result.previousMonthRakeData);
              var  j = 1;
              for(var i = res.result.currentMonthRakeData.length-1; i>=0;i--){
                  var tempObj = {};
                  tempObj.dailyRakeCurrentMonth = res.result.currentMonthRakeData[i].dailyAllRake;
                  tempObj.day = (new Date(res.result.currentMonthRakeData[i].date)).getDate();
                  if(res.result.previousMonthRakeData[i]){
                    tempObj.dailyRakePrevMonth = res.result.previousMonthRakeData[i].dailyAllRake;
                  }
                  j = j + 1;
                  object.push(tempObj);
              }

              console.log("###############",object);
              var chart = AmCharts.makeChart( "chartdiv2", {
              "type": "serial",
              "addClassNames": true,
              "theme": "light",
              "autoMargins": false,
              "marginLeft": 80,
              "marginRight": 8,
              "marginTop": 10,
              "marginBottom": 26,
              "balloon": {
                "adjustBorderColor": false,
                "horizontalPadding": 10,
                "verticalPadding": 8,
                "color": "#ffffff"
              },

              "dataProvider": object,
              "valueAxes": [ {
                "axisAlpha": 0,
                "position": "left"
              } ],
              "startDuration": 1,
              "graphs": [ {
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                "fillAlphas": 1,
                "title": "Rake Current Month",
                "type": "column",
                "valueField": "dailyRakeCurrentMonth",
                "dashLengthField": "dashLengthColumn"
              }],
              "categoryField": "day",
              "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
              },
              "export": {
                "enabled": true
              }
            } );
            console.log(res);
            $scope.formdata = {};
            $scope.rakeChartForm.$setPristine();

          }else{
            swal("Error!", "No data found!");
            $scope.setVisible = false;
            // swal(res.result);
          }

                        //$cookies.put('poker_token', res.authToken);
          }).error(function(err){
              // swal(err);
            swal("Error!", "Getting error from server in showing daily rake report. ");
              // swal("Getting error from server in creating Bonus code ");
          });

      }
      else{
        console.log("Some fields are missing");
        swal("Error!", "Some Fields are missing");
        return;
      }

    }


  }]);
;angular.module('MetronicApp').controller('RakeReportAffiliateController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }

    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.totalRake = 0;
    $scope.isSubAffiliate = false;
    
    // if(JSON.parse($cookies.get('poker_role')).level == -1){
    if(JSON.parse($rootScope.poker_role).level == -1){
      $scope.isSubAffiliate = true;
    }
    console.log("line 29 ", $scope.totalPage);
    $scope.newPageList = function () {
      console.log("totalpage____________________________", $scope.totalPage, $scope.currentPage);
      $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }


    $scope.data = {};


    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');

    }
    $scope.sortValue = "addeddate";
    
    $scope.initCountData = function(){
      var data = {};
      var endDate = Number(new Date());
      var startDate = endDate - (24*60*60*1000);
      data.startDate = startDate;
      data.endDate = endDate;
      data.parentUser = $rootScope.poker_userName;
      data.role = JSON.parse($rootScope.poker_role);
      data.sortValue = $scope.sortValue;
      data.keyForRakeModules = true;
      console.log("data====", data);

      $http.post("/countlistRakeDataForRakeReportAffiliate",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             console.log(res.result);
             $scope.newPageList();
          } else{
              console.log(res);
              swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server",err);
      });
    }
    $scope.initCountData();

    $scope.countData = function(){
    
      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select a end date!");
        return;
      }

      // if(!$scope.userId){
      //   swal("Error!", "Please enter a Player or Affiliate ID!");
      //   return;
      // }
      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      // console.log("the value of date is ", startDate, endDate);
      var data ={};
      
      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }

      // data.parentUser = $cookies.get('poker_userName');
      data.parentUser = $rootScope.poker_userName;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);
      data.sortValue = $scope.sortValue;

      // data.filter = $scope.filter;
      // if($scope.userId){
      //   if($scope.filter == "affiliates"){
      //     data.filterAffiliate = $scope.userId;
      //   }
      //   else{
      //     data.filterPlayer = $scope.userId;
      //   }

      // }
      console.log("data == ", data);
      data.keyForRakeModules = true;
      
      $http.post("/countlistRakeDataForRakeReportAffiliate",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             console.log(res.result);
             $scope.newPageList();
          } else{
              console.log(res);
              swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server",err);
      });  
    }  



     $scope.listRakeData = function(id,skipData,limitData){
      
      if($scope.startDate){
        var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      }
      if($scope.endDate){
        var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      }
      if(!$scope.startDate && !$scope.endDate){
        var endDate = Number(new Date());
        var startDate = endDate - (24*60*60*1000);
      }
      console.log("the value of date is ", startDate, endDate);
      var data ={};
      
      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }
      
      // if(JSON.parse($cookies.get('poker_role')).level <= 0){
      if(JSON.parse($rootScope.poker_role).level <= 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        // data.role = JSON.parse($cookies.get('poker_role'));
        data.role = JSON.parse($rootScope.poker_role);
      }
      data.sortValue = $scope.sortValue;

      
      data.skip = skipData;
      data.limit = limitData;

      console.log("data == ", data);


      data.keyForRakeModules = true;
      $http.post("/listRakeDataRakeReportAffiliate", data)
      .success(function(res){
        if(res.success){
          console.log("res.result---------", res.result);
          var k=0;
          $scope.dataList = res.result;
          var sum=0;
          for(var i=0; i<res.result.length; i++){
            res.result[i].megaPoints = res.result[i].megaPoints.toFixed(2);
            res.result[i].amount = res.result[i].amount.toFixed(2);
            if(res.result[i].megaCircle == 1){
              res.result[i].megaCircle = 'Bronze';    
            }
            if(res.result[i].megaCircle == 2){
              res.result[i].megaCircle = 'Chrome';    
            }
            if(res.result[i].megaCircle == 3){
              res.result[i].megaCircle = 'Silver';    
            }
            if(res.result[i].megaCircle == 4){
              res.result[i].megaCircle = 'Gold';    
            }
            if(res.result[i].megaCircle == 5){
              res.result[i].megaCircle = 'Diamond';    
            }
            if(res.result[i].megaCircle == 6){
              res.result[i].megaCircle = 'Platinum';    
            }

            if(!res.result[i].debitToSubaffiliatename && res.result[i].debitToAffiliatename){
              res.result[i].debitToSubaffiliatename = '-';
            }
          }
          $scope.totalRake = res.totalRake.toFixed(2);
        }
        else{
          $scope.dataList = "";
          $scope.totalRake = 0;
          swal('Error', res.info);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });

    }

    // $scope.listRakeData();

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.userId = "";
      // $scope.listRakeData();
      $scope.dataList = "";
      $scope.totalRake = 0;
      $scope.totalPage = 0;
      $scope.initCountData();
    }

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      var exportHref=Excel(tableId,'sheet_name');
      $timeout(function(){location.href=exportHref;},100); // trigger download
    };
    
    
}]);


;angular.module('MetronicApp').controller('RakeReportController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }
    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }
    $scope.pageSize =20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.totalRake = 0;
    console.log("line 29 ", $scope.totalPage);
    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    $scope.filter = "players";
    $scope.sortValue = "addeddate";
   

    $scope.data = {};


    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');

    }


    $scope.countData = function(){
    
      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select a end date!");
        return;
      }

      // if(!$scope.userId){
      //   swal("Error!", "Please enter a Player or Affiliate ID!");
      //   return;
      // }
      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      // console.log("the value of date is ", startDate, endDate);
      var data ={};
      
      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }

      // data.userName = $cookies.get('poker_userName');
      data.userName = $rootScope.poker_userName;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);
      data.sortValue = $scope.sortValue;

      // data.filter = $scope.filter;
      // if($scope.userId){
      //   if($scope.filter == "affiliates"){
      //     data.filterAffiliate = $scope.userId;
      //   }
      //   else{
      //     data.filterPlayer = $scope.userId;
      //   }

      // }
      console.log("data == ", data);

      data.keyForRakeModules = true;
      $http.post("/countlistRakeDataForRakeReport",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
              console.log(res);
              swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server",err);
      });  
    }  

    $scope.initCountData = function(){
      var data = {};
      var endDate = Number(new Date());
      var startDate = endDate - (24*60*60*1000);
      data.startDate = startDate;
      data.endDate = endDate;
      data.userName = $rootScope.poker_userName;
      data.role = JSON.parse($rootScope.poker_role);
      data.sortValue = $scope.sortValue;
      console.log("data====", data);
      data.keyForRakeModules = true;
      
      $http.post("/countlistRakeDataForRakeReport", data)
        .success(function(res){
          if(res.success){
            $scope.totalPage = res.result;
            console.log("totalpage 132line", $scope.totalPage, res.result);
            $scope.newPageList();
          } else{
            swal("Error!", res.info);
          }
        }).error(function(err){
          swal("Getting error from server", err);
        });
    }

    $scope.initCountData();

    $scope.listRakeData = function(id,skipData,limitData,cb){
      
      if($scope.startDate){
        var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      }
      if($scope.endDate){
        var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      }
      if(!$scope.startDate && !$scope.endDate){
        var endDate = Number(new Date());
        var startDate = endDate - (24*60*60*1000);
      }
      console.log("the value of date is ", startDate, endDate);
      var data ={};
      
      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }
      
      // if(JSON.parse($cookies.get('poker_role')).level <= 0){
      if(JSON.parse($rootScope.poker_role).level <= 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        // $scope.setDisabled = true;
      }
      data.sortValue = $scope.sortValue;

      console.log("data == ", data);
      
      data.skip = skipData;
      data.limit = limitData;



      data.keyForRakeModules = true;
      $http.post("/listRakeDataRakeReport", data)
      .success(function(res){
        if(res.success){
          console.log("res.result---------", res.result);
          var k=0;
          $scope.dataList = res.result;
          var sum=0;
          for(var i=0; i<res.result.length; i++){
            res.result[i].megaPoints = (res.result[i].megaPoints).toFixed(2);
            res.result[i].amount = (res.result[i].amount).toFixed(2);
            if(res.result[i].megaCircle == 1){
              res.result[i].megaCircle = 'Bronze';    
            }
            if(res.result[i].megaCircle == 2){
              res.result[i].megaCircle = 'Chrome';    
            }
            if(res.result[i].megaCircle == 3){
              res.result[i].megaCircle = 'Silver';    
            }
            if(res.result[i].megaCircle == 4){
              res.result[i].megaCircle = 'Gold';    
            }
            if(res.result[i].megaCircle == 5){
              res.result[i].megaCircle = 'Diamond';    
            }
            if(res.result[i].megaCircle == 6){
              res.result[i].megaCircle = 'Platinum';    
            }

            if(!res.result[i].debitToSubaffiliatename && res.result[i].debitToAffiliatename){
              res.result[i].debitToSubaffiliatename = '-';
            }
          }
          $scope.totalRake = res.totalRake.toFixed(2);
        }
        else{
          $scope.dataList = "";
          $scope.totalRake = 0;
          swal('Error', res.info);
        }
        if(cb instanceof Function){
          cb();
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });

    }

    // $scope.listRakeData();

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.userId = "";
      // $scope.listRakeData();
      $scope.dataList = "";
      $scope.totalRake = 0;
      $scope.totalPage = 0;
      $scope.initCountData();
    }

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("", 0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.listRakeData("", 0, 20);
          // $scope.resetForm();
        },500); // trigger download
      });
    };

    
}]);


;angular.module('MetronicApp').controller('RakeSummaryAffiliateDatewiseController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }
    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.totalRake = 0;
    $scope.dataList2 = "";
    console.log("line 29 ", $scope.totalPage);
    
    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    $scope.filter = "players";
    $scope.togglePassword = false;
    $scope.checkPassword = function(){
      if($scope.formData.isPrivateTabel == "true"){
         $scope.togglePassword =  true;
      }
      if($scope.formData.isPrivateTabel == "false"){
         $scope.togglePassword =  false;
         $scope.formData.passwordForPrivate = "";
      }
    };

    // if(JSON.parse($cookies.get('poker_role')).level < 0){
    if(JSON.parse($rootScope.poker_role).level < 0){
      $scope.setDisabled = true;
      // $scope.userId = $cookies.get('poker_userName')
      $scope.userId = $rootScope.poker_userName
    }


    $scope.data = {};

    var rakeSort = 1;
    var dateSort = 1;
    var nameSort = 1;


    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');

    }


    $scope.countData = function(){
    
      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select a end date!");
        return;
      }

      if(!$scope.userId){
        swal("Error!", "Please enter a Player or Affiliate ID!");
        return;
      }

      if(!$scope.minRake){
        swal("Error!", "Please enter Minimum Rake Amount!");
        return;
      }

      if(!$scope.maxRake){
        swal("Error!", "Please enter Maximum Rake Amount!");
        return;
      }

      if(!$scope.minCommission){
        swal("Error!", "Please enter Minimum Commission!");
        return;
      }

      if(!$scope.maxCommission){
        swal("Error!", "Please enter Maximum Commission!");
        return;
      }

      if(!$scope.minCommissionPercent){
        swal("Error!", "Please enter Minimum Commission Percent!");
        return;
      }

      if(!$scope.maxCommissionPercent){
        swal("Error!", "Please enter Maximum Commission Percent!");
        return;
      }

      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000);
      // console.log("the value of date is ", startDate, endDate);
      var data ={};
      
      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }

      data.filter = $scope.filter;
      if($scope.userId){
        if($scope.filter == "affiliates"){
          data.filterAffiliate = $scope.userId;
        }
        else{
          data.filterPlayer = $scope.userId;
        }

      }

      if($scope.minRake){
        data.minRake = $scope.minRake;
      }

      if($scope.maxRake){
        data.maxRake = $scope.maxRake;
      }

      if($scope.minCommission){
        data.minCommission = $scope.minCommission;
      }

      if($scope.maxCommission){
        data.maxCommission = $scope.maxCommission;
      }

      if($scope.minCommissionPercent){
        data.minCommissionPercent = $scope.minCommissionPercent;
      }

      if($scope.maxCommissionPercent){
        data.maxCommissionPercent = $scope.maxCommissionPercent;
      }

      console.log("data == ", data);
      
      data.keyForRakeModules = true;
      $http.post("/countlistRakeDataByPlayerOrAffiliate",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             // $scope.newPageList();
          } else{
              console.log(res);
              swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server",err);
      });  
    }  


    $scope.searchFunction = function(){
      if(!$scope.startDate && !$scope.endDate && !$scope.userId && !$scope.minRake && !$scope.maxRake && !$scope.minCommission && !$scope.maxCommission && !$scope.minCommissionPercent && !$scope.maxCommissionPercent){
        swal("Please provide any one filter.")
        return false;
      }
      else if(($scope.minRake && $scope.maxRake && ($scope.minRake > $scope.maxRake)) || ($scope.minCommission && $scope.maxCommission && ($scope.minCommission > $scope.maxCommission)) || ($scope.minCommissionPercent && $scope.maxCommissionPercent && ($scope.minCommissionPercent > $scope.maxCommissionPercent))){
        swal("Please enter valid Input");
        return false;
      }
      else if(($scope.minRake && $scope.minRake < 0) || ($scope.maxRake && $scope.maxRake < 0) || ($scope.minCommission && $scope.minCommission < 0) || ($scope.maxCommission && $scope.maxCommission < 0) || ($scope.minCommissionPercent && $scope.minCommissionPercent < 0) || ($scope.maxCommissionPercent && $scope.maxCommissionPercent < 0)){
        swal("Input fields cannot contain negative values");
        return false;
      }
      else{
        $scope.listRakeData();        
      }
    }
    $scope.listRakeData = function(id,skipData,limitData,cb){

      if($scope.startDate){
        var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      }
      if($scope.endDate){
        var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000);
      }
      console.log("the value of date is ", startDate, endDate);
      var data ={};
      data.containsFilters = false;

      
      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }

      if($scope.userId){
        data.filterAffiliate = $scope.userId;
      }
      
      if($scope.minRake){
        data.containsFilters = true;
        data.minRake = $scope.minRake;
      }

      if($scope.maxRake){
        data.containsFilters = true;
        data.maxRake = $scope.maxRake;
      }

      if($scope.minCommission){
        data.containsFilters = true;
        data.minCommission = $scope.minCommission;
      }

      if($scope.maxCommission){
        data.containsFilters = true;
        data.maxCommission = $scope.maxCommission;
      }

      if($scope.minCommissionPercent){
        data.containsFilters = true;
        data.minCommissionPercent = $scope.minCommissionPercent;
      }

      if($scope.maxCommissionPercent){
        data.containsFilters = true;
        data.maxCommissionPercent = $scope.maxCommissionPercent;
      }

      // if(JSON.parse($cookies.get('poker_role')).level <= 0){
      if(JSON.parse($rootScope.poker_role).level <= 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        // $scope.setDisabled = true;
      }

      data.filter = "affiliates";
      
      // if( $scope.userId && ($scope.userId.toUpperCase() == $cookies.get('poker_userName').toUpperCase())){
      if( $scope.userId && ($scope.userId.toUpperCase() == $rootScope.poker_userName.toUpperCase())){
        data.filter = 'self';
      }

      console.log("data == ", data);
      
      data.skip = skipData;
      data.limit = limitData;

      data.keyForRakeModules = true;
      $http.post("/listRakeDataDatewise", data)
      .success(function(res){
        if(res.success){
          console.log("res.result---------", res.result);
          $scope.currentPage = 1;// current page count
          var k=0;
          $scope.dataList = [];
          var sum=0;
          for(var i=0; i<res.result.length; i++){
            for(var j=0; j<res.result[i].dailyRakeData.length; j++){
              $scope.dataList[k] = res.result[i].dailyRakeData[j];
              $scope.dataList[k].rakeCommision = res.result[i].rakeCommision;
              $scope.dataList[k].userName = res.result[i].userName;
              $scope.dataList[k].parentUser = res.result[i].parentUser;
              sum = sum + res.result[i].dailyRakeData[j].dailyRake;
              console.log($scope.dataList[k])
              k++;
            }
          }
          $scope.totalRake = sum.toFixed(2);
          // console.log("line 187", $scope.dataList);
          $scope.totalPage =$scope.dataList.length;
          if(cb instanceof Function){
            $scope.dataList2 = $scope.dataList;
            cb();
          }
          else{
            $scope.newPageData();
          }
        }
        else{
          $scope.dataList = "";
          $scope.totalRake = 0;
          swal('Error', res.info);
        }
      }).error(function(err){
        // swal("Error!", "Getting error from server in showing tables");
      });

    }


    $scope.newPageData = function(){
      // $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      var startIndex = (($scope.currentPage - 1) * $scope.pageSize);
      $scope.dataList2 = $scope.dataList.slice(startIndex, startIndex + 20);
      console.log("line 202", $scope.currentPage, $scope.pageSize, startIndex);
      console.log("line 203", $scope.dataList2.length);
      console.log("line 204", $scope.dataList.length);
    }

    $scope.listRakeData();

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.userId = "";
      $scope.minRake = "";
      $scope.maxRake = "";
      $scope.minCommission = "";
      $scope.maxCommission = "";
      $scope.minCommissionPercent = "";
      $scope.maxCommissionPercent = "";
      $scope.dataList = "";
      $scope.totalRake = 0;
      // if(JSON.parse($cookies.get('poker_role')).level < 0){
      if(JSON.parse($rootScope.poker_role).level < 0){
        $scope.setDisabled = true;
        // $scope.userId = $cookies.get('poker_userName')
        $scope.userId = $rootScope.poker_userName
      }
      $scope.listRakeData();
    }

    $scope.sortTableByRake = function(){
      rakeSort = rakeSort * -1;
      if(rakeSort == 1){
        $scope.dataList2.sort(function(a, b){
          return parseFloat(a.dailyRake) - parseFloat(b.dailyRake)
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          return parseFloat(b.dailyRake) - parseFloat(a.dailyRake)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByDate = function(){
      dateSort = dateSort * -1;
      if(dateSort == 1){
        $scope.dataList2.sort(function(a, b){
          return parseFloat(a.date) - parseFloat(b.date)
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          return parseFloat(b.date) - parseFloat(a.date)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByName = function(){
      nameSort = nameSort * -1;
      if(nameSort == 1){
        $scope.dataList2.sort(function(a, b){
          if(a.userName > b.userName) return -1;
          if(a.userName < b.userName) return 1;
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          if(a.userName < b.userName) return -1;
          if(a.userName > b.userName) return 1;
        })
      }
      // console.log($scope.tableList)
      // $scope.$apply();
    }


    $scope.sortTableByRakeAff = function(){
      rakeSort = rakeSort * -1;
      if(rakeSort == 1){
        $scope.dataList2.sort(function(a, b){
          return parseFloat(a.dailyRake) - parseFloat(b.dailyRake)
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          return parseFloat(b.dailyRake) - parseFloat(a.dailyRake)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByDateAff = function(){
      dateSort = dateSort * -1;
      if(dateSort == 1){
        $scope.dataList2.sort(function(a, b){
          return parseFloat(a.date) - parseFloat(b.date)
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          return parseFloat(b.date) - parseFloat(a.date)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByNameAff = function(){
      nameSort = nameSort * -1;
      if(nameSort == 1){
        $scope.dataList2.sort(function(a, b){
          if(a.userName > b.userName) return -1;
          if(a.userName < b.userName) return 1;
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          if(a.userName < b.userName) return -1;
          if(a.userName > b.userName) return 1;
        })
      }
      // console.log($scope.tableList)
      // $scope.$apply();
    }

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }
 
 
    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("", 0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.listRakeData("", 0, 20);
          // $scope.resetForm();
        },500); // trigger download
      });
    };
    
}]);


;angular.module('MetronicApp').controller('RakeSummaryByAffiliateOrPlayerController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }
    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.totalRake = 0;
    console.log("line 29 ", $scope.totalPage);
    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    $scope.filter = "players";
    $scope.togglePassword = false;
    $scope.setHidden = false;
    // if(JSON.parse($cookies.get('poker_role')).level < 0){
    if(JSON.parse($rootScope.poker_role).level < 0){
      $scope.setHidden = true;
    }
    $scope.checkPassword = function(){
      if($scope.formData.isPrivateTabel == "true"){
         $scope.togglePassword =  true;
      }
      if($scope.formData.isPrivateTabel == "false"){
         $scope.togglePassword =  false;
         $scope.formData.passwordForPrivate = "";
      }
    };

    $scope.data = {};

    var rakeSort = 1;
    var nameSort = 1;
    var dateSort = -1;



    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');

    }

    $scope.setUser = function(){
      if($scope.filter == 'self'){
        // $scope.userId = $cookies.get('poker_userName');
        $scope.userId = $rootScope.poker_userName;
        $scope.isDisabled = true;
      }
      else{
        $scope.userId = "";
        $scope.isDisabled = false;
      }
    }



    $scope.countData = function(){
    
      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select a end date!");
        return;
      }

      if(!$scope.userId && $scope.filter != 'self'){
        if($scope.filter == 'self'){
          console.log('self selected');
        }
        else{
          swal("Error!", "Please enter a Player or Affiliate ID!");
          return;
        }
      }
      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000);
      // console.log("the value of date is ", startDate, endDate);
      var data ={};
      
      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }

      data.filter = $scope.filter;
      if($scope.userId){
        if($scope.filter == "affiliates"){
          data.filterAffiliate = $scope.userId;
        }
        else{
          data.filterPlayer = $scope.userId;
        }

      }
      console.log("data == ", data);
      

     // data.keyForRakeModules = true;
      $http.post("/countlistRakeDataByPlayerOrAffiliate",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             // $scope.newPageList();
          } else{
              console.log(res);
              swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server",err);
      });  
    }  



     $scope.listRakeData = function(id,skipData,limitData,cb){
      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select an end date!");
        return;
      }

      if(!$scope.userId && $scope.filter != 'self'){
        if($scope.filter == 'self'){
          console.log('self selected');
        }
        else{
          swal("Error!", "Please enter a Player or Affiliate ID!");
          return;
        }
      }
      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000);
      console.log("the value of date is ", startDate, endDate);
      var data ={};
      
      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }

      data.filter = $scope.filter;
      if($scope.userId){
        if($scope.filter == "affiliates"){
          data.filterAffiliate = $scope.userId;
        }
        else{
          data.filterPlayer = $scope.userId;
        }
      }
      if($scope.filter == 'self'){
        // data.filterAffiliate = $cookies.get('poker_userName');
        data.filterAffiliate = $rootScope.poker_userName;
      }
      console.log("data == ", data);
      data.userRole = JSON.parse($rootScope.poker_role);
      data.loggedInUser = $rootScope.poker_userName;
      data.skip = skipData;
      data.limit = limitData;

      if($scope.filter == "affiliates" || $scope.filter == 'self'){
        // swal("success");
        data.keyForRakeModules = true;
        $http.post("/listRakeDataAffiliatesByPlayerOrAffiliate", data)
        .success(function(res){
          if(res.success){
            console.log("res.result---------", res.result);
            $scope.dataList = res.result;
            $scope.totalPage = $scope.dataList.length;
            var sum=0;
            for(var i=0; i<res.result.length; i++){
              sum = sum + res.result[i].dailyRake;
            }
            $scope.totalRake = sum;
            $scope.totalRake = $scope.totalRake.toFixed(2);
            if(cb instanceof Function){
              $scope.dataList2 = res.result
              cb();
            }
            else{
              $scope.newPageData();
            }
          }
          else{
            $scope.dataList = "";
            $scope.dataList2 = "";
            $scope.totalPage = 0;
            $scope.totalRake = 0;
            swal('Error', res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server in showing tables");
        });
      }

      else{
        // if(JSON.parse($cookies.get('poker_role')).level <= 0){
        if(JSON.parse($rootScope.poker_role).level <= 0){
          // data.parentUser = $cookies.get('poker_userName');
          data.parentUser = $rootScope.poker_userName;
        }
      data.keyForRakeModules = true;
      $http.post("/listRakeDataPlayerByPlayerOrAffiliate", data)
        .success(function(res){
          if(res.success){
            console.log("res.result---------", res.result);
            $scope.dataList = res.result;
            $scope.totalPage = $scope.dataList.length;
            var sum=0;
            for(var i=0; i<res.result.length; i++){
              sum = sum + res.result[i].dailyRake;
            }
            $scope.totalRake = sum;
            $scope.totalRake = $scope.totalRake.toFixed(2);
            if(cb instanceof Function){
              $scope.dataList2 = res.result
              cb();
            }
            else{
              $scope.newPageData();
            }

          }
          else{
            $scope.dataList = "";
            $scope.dataList2 = "";
            $scope.totalPage = 0;
            $scope.totalRake = 0;
            swal('Error', res.info);
          }
        }).error(function(err){
          // swal("Error!", "Getting error from server in showing tables");
        });
      }
      

      
    }

    $scope.newPageData = function(){
      // $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      var startIndex = (($scope.currentPage - 1) * $scope.pageSize);
      $scope.dataList2 = $scope.dataList.slice(startIndex, startIndex + 20);
      console.log("line 202", $scope.currentPage, $scope.pageSize, startIndex);
      console.log("line 203", $scope.dataList2.length);
      console.log("line 204", $scope.dataList);
    }


    $scope.sortTableByRake = function(){
      rakeSort = rakeSort * -1;
      if(rakeSort == 1){
        $scope.dataList2.sort(function(a, b){
          return parseFloat(a.dailyRake) - parseFloat(b.dailyRake)
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          return parseFloat(b.dailyRake) - parseFloat(a.dailyRake)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByDate = function(){
      dateSort = dateSort * -1;
      if(dateSort == 1){
        $scope.dataList2.sort(function(a, b){
          return parseFloat(a.date) - parseFloat(b.date)
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          return parseFloat(b.date) - parseFloat(a.date)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByRakeAff = function(){
      rakeSort = rakeSort * -1;
      if(rakeSort == 1){
        $scope.dataList.sort(function(a, b){
          return parseFloat(a.dailyRake) - parseFloat(b.dailyRake)
        })
      }

      else{
        $scope.dataList.sort(function(a, b){
          return parseFloat(b.dailyRake) - parseFloat(a.dailyRake)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByDateAff = function(){
      dateSort = dateSort * -1;
      if(dateSort == 1){
        $scope.dataList.sort(function(a, b){
          return parseFloat(a.date) - parseFloat(b.date)
        })
      }

      else{
        $scope.dataList.sort(function(a, b){
          return parseFloat(b.date) - parseFloat(a.date)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }


    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("", 0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.listRakeData("", 0, 20);
          // $scope.resetForm();
        },500); // trigger download
      });
    };

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.userId = "";
      $scope.totalRake = 0;
      $scope.dataList = {};
      $scope.dataList2 = {};
      $scope.totalPage = 0;
    }


    // $scope.listRakeData();
    
}]);


;angular.module('MetronicApp').controller('RakeSummaryByCashTableController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }
    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.totalRake = 0;
    console.log("line 29 ", $scope.totalPage);
    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }


    $scope.data = {};
    var rakeSort = 1;
    var nameSort = 1;
    var dateSort = -1;


    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');

    }


    $scope.countData = function(){

      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select a end date!");
        return;
      }


      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      var data ={};

      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }

      // data.parentUser = $cookies.get('poker_userName');
      data.parentUser = $rootScope.poker_userName;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);

      console.log("data == ", data);

      data.keyForRakeModules = true;
      $http.post("/countlistRakeDataByCashTable",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
              console.log(res);
              swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server",err);
      });
    }



     $scope.listRakeData = function(id,skipData,limitData,cb){

      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select an end date!");
        return;
      }

      if(!$scope.tableName){
        swal("Error!", "Please select a table!");
        return;
      }

      if($scope.startDate){
        var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      }
      if($scope.endDate){
        var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      }
      console.log("the value of date is ", startDate, endDate);
      var data ={};

      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }

      // if(JSON.parse($cookies.get('poker_role')).level <= 0){
      if(JSON.parse($rootScope.poker_role).level <= 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        // data.role = JSON.parse($cookies.get('poker_role'));
        data.role = JSON.parse($rootScope.poker_role);
      }

      data.tableId = $scope.tableName;

      console.log("data == ", data);

      data.skip = skipData;
      data.limit = limitData;



      data.keyForRakeModules = true;
      $http.post("/listRakeDataByCashTable", data)
      .success(function(res){
        if(res.success){
          console.log("res.result---------", res.result);
          $scope.resultTableName = $scope.tableList.filter(function(table) {
            return table._id === data.tableId;
          })[0].channelName;
          var k=0;
          $scope.dataList = res.result;
          var sum=0;
          for(var i=0; i<res.result.length; i++){
            sum = sum + res.result[i].dailyRake;
          }
          $scope.totalRake = sum.toFixed(2);
          $scope.totalPage = $scope.dataList.length;
          if(cb instanceof Function){
            $scope.dataList2 = res.result
            cb();
          }
          else{
            $scope.newPageData();
          }
        }
        else{
          $scope.dataList = "";
          $scope.totalRake = 0;
          swal('Error', res.info);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });

    }

    $scope.newPageData = function(){
      // $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      var startIndex = (($scope.currentPage - 1) * $scope.pageSize);
      $scope.dataList2 = $scope.dataList.slice(startIndex, startIndex + 20);
      console.log("line 202", $scope.currentPage, $scope.pageSize, startIndex);
      console.log("line 203", $scope.dataList2.length);
      console.log("line 204", $scope.dataList);
    }

    // $scope.listRakeData();

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.tableName = "";
      // $scope.listRakeData();
      $scope.dataList = "";
      $scope.dataList2 = "";
      $scope.totalRake = 0;
      $scope.totalPage = 0;
    }

    $scope.getTableList = function(){
      var data = {};
      data.keyForRakeModules = true;
      $http.post("/listAllCashTable", data)
      .success(function(res){
        if(res.success){
          // console.log("res.result---------", res.result);
          $scope.tableList = res.result;
        }
        else{
          $scope.tableList = "";
          swal('Error', res.info);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });

    }

    $scope.sortTableByRake = function(){
      rakeSort = rakeSort * -1;
      if(rakeSort == 1){
        $scope.dataList2.sort(function(a, b){
          return parseFloat(a.dailyRake) - parseFloat(b.dailyRake)
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          return parseFloat(b.dailyRake) - parseFloat(a.dailyRake)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByDate = function(){
      dateSort = dateSort * -1;
      if(dateSort == 1){
        $scope.dataList2.sort(function(a, b){
          return parseFloat(a.date) - parseFloat(b.date)
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          return parseFloat(b.date) - parseFloat(a.date)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }


    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};

          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }


    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("", 0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.listRakeData("", 0, 20);
          // $scope.resetForm();
        },500); // trigger download
      });
    };


    $scope.getTableList();

}]);
;angular.module('MetronicApp').controller('RakeSummaryByDateController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }
    $('.date-picker').datepicker('setEndDate', new Date());

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.totalRake = 0;
    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    $scope.filter = "players";
    $scope.togglePassword = false;
    $scope.setHidden = false;
    // if(JSON.parse($cookies.get('poker_role')).level < 0){
    if(JSON.parse($rootScope.poker_role).level < 0){
      $scope.setHidden = true;
    }
    $scope.checkPassword = function(){
      if($scope.formData.isPrivateTabel == "true"){
         $scope.togglePassword =  true;
      }
      if($scope.formData.isPrivateTabel == "false"){
         $scope.togglePassword =  false;
         $scope.formData.passwordForPrivate = "";
      }
    };

     $scope.setUser = function(){
      if($scope.filter == 'self'){
        // $scope.userId = $cookies.get('poker_userName');
        $scope.userId = $rootScope.poker_userName;
        $scope.isDisabled = true;
      }
      else{
        $scope.userId = "";
        $scope.isDisabled = false;
      }
    }



    $scope.data = {};


    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');

    }

    $scope.initCountData = function(){
      var data = {};
      var date = new Date();
      date.setUTCHours(0);
      date.setUTCMinutes(0);
      date.setUTCSeconds(0);
      date.setUTCMilliseconds(0);
      data.addeddate = Number(date);
      data.filter = $scope.filter;
      data.keyForRakeModules = true;
      console.log("line 83 data", data);

      $http.post("/countlistRakeDataByDate",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             console.log("line 89", res.result, $scope.totalPage);
             $scope.newPageList();
          } else{
              $scope.totalPage = 0;
              $scope.dataList = "";
              $scope.totalRake = 0;
              swal("Error!", res.info);

          }
        }).error(function(err){
        swal("Getting error from server in showing rake rules",err.stack);
      });
    }

    $scope.countData = function(){
      $scope.currentPage = 1;// current page count


      var inputDate =  Number($('.date-picker').data("datepicker").getUTCDate());
      console.log("the value of date is ", inputDate);
      if(!inputDate){
        swal("Error!", "Please select a date!");
        return;
      }
      var data ={};
      if(inputDate){
        data.addeddate = inputDate;
      }
      data.filter = $scope.filter;
      if($scope.userId){
        if($scope.filter == "affiliates"){
          data.filterAffiliate = $scope.userId;
          // if(JSON.parse($cookies.get('poker_role')).level <= 0){
          if(JSON.parse($rootScope.poker_role).level <= 0){
            // data.parentUser = $cookies.get('poker_userName');
            data.parentUser = $rootScope.poker_userName;
            // $scope.setDisabled = true;
          }
        }
        else if($scope.filter == 'players'){
          data.filterPlayer = $scope.userId;
        }

      }
      if($scope.filter == 'self'){
        // data.filterAffiliate = $cookies.get('poker_userName');
        data.filterAffiliate = $rootScope.poker_userName;
      }

      // if(JSON.parse($cookies.get('poker_role')).level <= 0){
      if(JSON.parse($rootScope.poker_role).level <= 0){
        // data.isParentUserName = $cookies.get('poker_userName');
        data.isParentUserName = $rootScope.poker_userName;
      }
      console.log("data line 67== ", data);

      data.keyForRakeModules = true;
      $http.post("/countlistRakeDataByDate",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             // alert(res.result);
             $scope.newPageList();
          } else{
              $scope.totalPage = 0;
              $scope.dataList = "";
              $scope.totalRake = 0;
              swal("Error!", res.info);

          }
        }).error(function(err){
        swal("Getting error from server in showing rake rules",err.stack);
      });
    }

    $scope.searchAff = function(){
      var inputDate = Number($('.date-picker').data("datepicker").getUTCDate());
      if(!inputDate){
        swal("Error!", "Please select a date!");
        return;
      } else{
        $scope.listRakeData('',0,0);
      }
    }

    $scope.listRakeData = function(id,skipData,limitData, cb){
      var data ={};
      if($scope.searchDate){
        var inputDate = '';
        inputDate =  Number($('.date-picker').data("datepicker").getUTCDate());
      }
      if(inputDate){
        data.addeddate = inputDate;
      }
      if(!inputDate){
        var date = new Date();
        date.setUTCHours(0);
        date.setUTCMinutes(0);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);
        data.addeddate=Number(date);
      }
      data.filter = $scope.filter;
      if($scope.userId){
        if($scope.filter == "affiliates"){
          data.filterAffiliate = $scope.userId;
        }
        else if($scope.filter == 'players'){
          data.filterPlayer = $scope.userId;
        }
        else{
          // data.filterAffiliate = $cookies.get('poker_userName');
          data.filterAffiliate = $rootScope.poker_userName;
        }

      }

      // if(JSON.parse($cookies.get('poker_role')).level <= 0){
      if(JSON.parse($rootScope.poker_role).level <= 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        // data.isParentUserName = $cookies.get('poker_userName');
        data.isParentUserName = $rootScope.poker_userName;
        // $scope.setDisabled = true;
      }
      // data.userRole = JSON.parse($cookies.get('poker_role'));
      data.userRole = JSON.parse($rootScope.poker_role);
      data.skip = skipData;
      data.limit = limitData;
      console.log("data===== ", data);

      if($scope.filter == "affiliates"){
        // swal("success");
        data.keyForRakeModules = true;
        $http.post("/listRakeDataAffiliatesByDate", data)
        .success(function(res){
          console.log("res.result---------", res);
          if(res.success){
            $scope.totalRakeAllPages();
            $scope.dataList = res.result.affiliatesArray;
            // var sum=0;
            // for(var i=0; i<res.result.affiliatesArray.length; i++){
            //   sum = sum + res.result.affiliatesArray[i].totalRake;
            // }
            // $scope.totalRake = sum;
            // $scope.totalRake = $scope.totalRake.toFixed(2);
          }
          else{
            swal("Error!", res.err);
          }
          if(cb instanceof Function){
            cb();
          }
        }).error(function(err){
          swal("Error!", err.info);
        });
      }

      else if($scope.filter == "players"){
        data.keyForRakeModules = true;
        $http.post("/listRakeDataPlayerByDate", data)
        .success(function(res){
          console.log("res.result---------", res);
          if(res.success){
            $scope.totalRakeAllPages();
            $scope.dataList = res.result.playersArray;
            // var sum=0;
            // for(var i=0; i<res.result.playersArray.length; i++){
            //   sum = sum + res.result.playersArray[i].totalRake;
            // }
            // $scope.totalRake = sum;
            // $scope.totalRake = $scope.totalRake.toFixed(2);
          }
          else{
            swal("Error!", res.err);
          }
          if(cb instanceof Function){
            cb();
          }
        }).error(function(err){
          swal("Error!", res.err);
        });
      }

      else{
        data.keyForRakeModules = true;
        $http.post("/listRakeDataSelfByDate", data)
        .success(function(res){
          console.log("res.result---------", res);
          if(res.success){
            $scope.dataList = res.result.affiliatesArray;
            $scope.totalRakeAllPages();
            // var sum=0;
            // for(var i=0; i<res.result.affiliatesArray.length; i++){
            //   sum = sum + res.result.affiliatesArray[i].totalRake;
            // }
            // $scope.totalRake = sum;
            // $scope.totalRake = $scope.totalRake.toFixed(2);
          }
          else{
            swal("Error!", res.err);
          }
          if(cb instanceof Function){
            cb();
          }
        }).error(function(err){
          swal("Error!", res.err);
        });
      }
    }


    $scope.totalRakeAllPages = function(){
      if($scope.searchDate){
        var inputDate =  Number($('.date-picker').data("datepicker").getUTCDate());

      }
      
      var data ={};
      if(!inputDate){
        // swal("Error!", "Please select a date!");
        // return;
        var date = new Date();
        date.setUTCHours(0);
        date.setUTCMinutes(0);
        date.setUTCSeconds(0);
        date.setUTCMilliseconds(0);
        data.addeddate=Number(date);
      }
      if(inputDate){
        data.addeddate = inputDate;
      }
      data.filter = $scope.filter;
      if($scope.userId){
        if($scope.filter == "affiliates"){
          data.filterAffiliate = $scope.userId;
        }
        else if($scope.filter == 'players'){
          data.filterPlayer = $scope.userId;
        }
        else{
          // data.filterAffiliate = $cookies.get('poker_userName');
          data.filterAffiliate = $rootScope.poker_userName;
        }

      }

      // if(JSON.parse($cookies.get('poker_role')).level <= 0){
      if(JSON.parse($rootScope.poker_role).level <= 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        // data.isParentUserName = $cookies.get('poker_userName');
        data.isParentUserName = $rootScope.poker_userName;
        // $scope.setDisabled = true;
      }
      data.userRole = JSON.parse($rootScope.poker_role);
      data.skip = 0;
      data.limit = 0;

      if($scope.filter == "affiliates"){
        // swal("success");
        data.keyForRakeModules = true;
        $http.post("/listRakeDataAffiliatesByDate", data)
        .success(function(res){
          console.log("res.result---------", res);
          if(res.success){
            // $scope.dataList = res.result.affiliatesArray;
            var sum=0;
            for(var i=0; i<res.result.affiliatesArray.length; i++){
              sum = sum + res.result.affiliatesArray[i].totalRake;
            }
            $scope.totalRake = sum;
            $scope.totalRake = $scope.totalRake.toFixed(2);
          }
          else{
            swal("Error!", res.err);
          }
        }).error(function(err){
          swal("Error!", err.info);
        });
      }

      else if($scope.filter == "players"){
        data.keyForRakeModules = true;
        $http.post("/listRakeDataPlayerByDate", data)
        .success(function(res){
          console.log("res.result---------", res);
          if(res.success){
            // $scope.dataList = res.result.playersArray;
            var sum=0;
            for(var i=0; i<res.result.playersArray.length; i++){
              sum = sum + res.result.playersArray[i].totalRake;
            }
            $scope.totalRake = sum;
            $scope.totalRake = $scope.totalRake.toFixed(2);
          }
          else{
            swal("Error!", res.err);
          }
        }).error(function(err){
          swal("Error!", res.err);
        });
      }

      else{
        data.keyForRakeModules = true;
        $http.post("/listRakeDataSelfByDate", data)
        .success(function(res){
          console.log("res.result---------", res);
          if(res.success){
            // $scope.dataList = res.result.affiliatesArray;
            var sum=0;
            for(var i=0; i<res.result.affiliatesArray.length; i++){
              sum = sum + res.result.affiliatesArray[i].totalRake;
            }
            $scope.totalRake = sum;
            $scope.totalRake = $scope.totalRake.toFixed(2);
          }
          else{
            swal("Error!", res.err);
          }
        }).error(function(err){
          swal("Error!", res.err);
        });
      }
    }





    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};

          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }


    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("", 0, 0, function(){
        $window.scrollTo(0, 0);
        setTimeout(function() {
          location.href=Excel(tableId,'sheet_name');
        }, 500);
      });
    };

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.searchDate = "";
      $('.date-picker').data("datepicker").value = "";
      $scope.endDate = "";
      $scope.userId = "";
      $scope.dataList = {};
      $scope.dataList2 = {};
      $scope.totalRake = 0;
      $scope.totalPage = 0;
      $scope.initCountData();
    }



    // $scope.listRakeData();

}]);
;angular.module('MetronicApp').controller('RakeSummaryByGameVariantsController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }
    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.totalRake = 0;
    console.log("line 29 ", $scope.totalPage);
    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }


    $scope.data = {};
    var rakeSort = 1;
    var nameSort = 1;
    var dateSort = -1;


    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');

    }


    $scope.countData = function(){
    
      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select a end date!");
        return;
      }

      
      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      var data ={};
      
      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }

      // data.parentUser = $cookies.get('poker_userName');
      data.parentUser = $rootScope.poker_userName;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);

      console.log("data == ", data);

      data.keyForRakeModules = true;
      $http.post("/countlistRakeDataByCashTable",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
              console.log(res);
              swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server",err);
      });  
    }  



    $scope.listRakeData = function(id,skipData,limitData,cb){
      
      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select an end date!");
        return;
      }

      if(!$scope.channelVariation){
        swal("Error!", "Please select a game variant!");
        return;
      }

      if($scope.startDate){
        var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      }
      if($scope.endDate){
        var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      }
      console.log("the value of date is ", startDate, endDate);
      var data ={};
      
      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }
      
      // if(JSON.parse($cookies.get('poker_role')).level <= 0){
      if(JSON.parse($rootScope.poker_role).level <= 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        // data.role = JSON.parse($cookies.get('poker_role'));
        data.role = JSON.parse($rootScope.poker_role);
      }

      data.rakeRefVariation = $scope.channelVariation;

      console.log("data == ", data);
      
      data.skip = skipData;
      data.limit = limitData;



      data.keyForRakeModules = true;
      $http.post("/listRakeDataByGameVariant", data)
      .success(function(res){
        if(res.success){
          console.log("res.result---------", res.result);
          var k=0;
          $scope.dataList = res.result;
          var sum=0;
          for(var i=0; i<res.result.length; i++){
            sum = sum + res.result[i].dailyAllRake;
          }
          $scope.totalRake = (sum).toFixed(2);
          $scope.totalPage = $scope.dataList.length;
          if(cb instanceof Function){
            $scope.dataList2 = res.result
            cb();
          }
          else{
            $scope.newPageData();
          }
        }
        else{
          $scope.dataList = "";
          $scope.totalRake = 0;
          swal('Error', res.info);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });

    }

    $scope.newPageData = function(){
      // $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      var startIndex = (($scope.currentPage - 1) * $scope.pageSize);
      $scope.dataList2 = $scope.dataList.slice(startIndex, startIndex + 20);
      console.log("line 202", $scope.currentPage, $scope.pageSize, startIndex);
      console.log("line 203", $scope.dataList2.length);
      console.log("line 204", $scope.dataList);
    }

    // $scope.listRakeData();

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.tableName = "";
      // $scope.listRakeData();
      $scope.dataList = "";
      $scope.dataList2 = "";
      $scope.totalRake = 0;
      $scope.totalPage = 0;
    }


    $scope.sortTableByRake = function(){
      rakeSort = rakeSort * -1;
      if(rakeSort == 1){
        $scope.dataList2.sort(function(a, b){
          return parseFloat(a.dailyAllRake) - parseFloat(b.dailyAllRake)
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          return parseFloat(b.dailyAllRake) - parseFloat(a.dailyAllRake)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByDate = function(){
      dateSort = dateSort * -1;
      if(dateSort == 1){
        $scope.dataList2.sort(function(a, b){
          return parseFloat(a.date) - parseFloat(b.date)
        })
      }

      else{
        $scope.dataList2.sort(function(a, b){
          return parseFloat(b.date) - parseFloat(a.date)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }


    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("", 0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.listRakeData("", 0, 0);
          // $scope.resetForm();
        },500); // trigger download
      });
    };
    
}]);


;angular.module('MetronicApp').controller('RakeTableRakeReportController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }
    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.totalRake = 0;
    console.log("line 29 ", $scope.totalPage);
    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }


    $scope.data = {};


    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');

    }
    var rakeSort = 1;
    var nameSort = 1;


    $scope.countData = function(){
    
      var data ={};
      
      // data.parentUser = $cookies.get('poker_userName');
      data.parentUser = $rootScope.poker_userName;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);

      console.log("data == ", data);

      data.keyForRakeModules = true;
      $http.post("/countCashTables",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
              console.log(res);
              swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server",err);
      });  
    }  



     $scope.listRakeData = function(id,skipData,limitData,cb){
      
      var data ={};
      
      // if(JSON.parse($cookies.get('poker_role')).level <= 0){
      if(JSON.parse($rootScope.poker_role).level <= 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        // data.role = JSON.parse($cookies.get('poker_role'));
        data.role = JSON.parse($rootScope.poker_role);
      }


      console.log("data == ", data);
      
      data.skip = skipData;
      data.limit = limitData;

      data.keyForRakeModules = true;
      $http.post("/listEachCashTableRakeData", data)
      .success(function(res){
        if(res.success){
          console.log("res.result---------", res.result);
          $scope.findTotalRakeFromAllTables();
          // var k=0;
          $scope.tableList = res.result;
        }
        else{
          $scope.tableList = "";
          $scope.totalRake = 0;
          swal('Error', res.info);
        }
        
        if(cb instanceof Function){
          $scope.dataList2 = $scope.dataList;
          setTimeout(function() {
            cb();
          }, 100);
        }
        else{
          $scope.newPageData();
        }
      }).error(function(err){
        // swal("Error!", "Getting error from server in showing tables");
      });

    }


    $scope.findTotalRakeFromAllTables = function(){
      var data ={};
      
      // if(JSON.parse($cookies.get('poker_role')).level <= 0){
      if(JSON.parse($rootScope.poker_role).level <= 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        // data.role = JSON.parse($cookies.get('poker_role'));
        data.role = JSON.parse($rootScope.poker_role);
      }

      data.keyForRakeModules = true;
      $http.post("/listEachCashTableRakeData", data)
      .success(function(res){
        if(res.success){
          console.log("res.result---------", res.result);
          var k=0;
          var sum=0;
          for(var i=0; i<res.result.length; i++){
            res.result[i].rakeGenerated = res.result[i].rakeGenerated;
            sum = sum + res.result[i].rakeGenerated;
          }

          $scope.totalRake = sum.toFixed(2);
        }
        else{
          $scope.tableList = "";
          $scope.totalRake = 0;
          swal('Error', res.info);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });

    }

    // $scope.listRakeData();

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.tableName = "";
      // $scope.listRakeData();
      $scope.dataList = "";
      $scope.totalRake = 0;
    }

    $scope.getTableList = function(){
      var data = {};
      data.keyForRakeModules = true;
      $http.post("/listAllCashTable", data)
      .success(function(res){
        if(res.success){
          console.log("res.result---------", res.result);
          $scope.tableList = res.result;
          // var k=0;
          // $scope.dataList = res.result;
          // var sum=0;
          // for(var i=0; i<res.result.length; i++){
          //   sum = sum + res.result[i].dailyRake;
          // }
          // $scope.totalRake = parseInt(sum);
        }
        else{
          $scope.tableList = "";
          swal('Error', res.info);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });

    }


    $scope.sortTableByRake = function(){
      rakeSort = rakeSort * -1;
      if(rakeSort == 1){
        $scope.tableList.sort(function(a, b){
          return parseFloat(a.rakeGenerated) - parseFloat(b.rakeGenerated)
        })
      }

      else{
        $scope.tableList.sort(function(a, b){
          return parseFloat(b.rakeGenerated) - parseFloat(a.rakeGenerated)
        })
      }
      // console.log($scope.tableList)
      $scope.$apply();
    }

    $scope.sortTableByName = function(){
      nameSort = nameSort * -1;
      if(nameSort == 1){
        $scope.tableList.sort(function(a, b){
          if(a.channelName > b.channelName) return -1;
          if(a.channelName < b.channelName) return 1;
        })
      }

      else{
        $scope.tableList.sort(function(a, b){
          if(a.channelName < b.channelName) return -1;
          if(a.channelName > b.channelName) return 1;
        })
      }
      // console.log($scope.tableList)
      $scope.$apply();
    }
    // setTimeout(function(){
    //   $scope.sortTableByName();
    // }, 5000)



    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listRakeData("", 0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.listRakeData("", 0, 20);
          // $scope.resetForm();
        },500); // trigger download
      });
    };
    

    $scope.countData();
    
}]);


;angular.module('MetronicApp').controller('SubAffiliateCtrl', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$http", "$stateParams", "$filter", function($location, $window, $cookies, $rootScope, $scope, $http, $stateParams, $filter) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    // console.log("yessss",$rootScope.isAdminLogin)
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes', $rootScope.role)
      $location.path('/login.html')
    }
    $scope.affiliateData = {};
    $scope.affiliateData.module = [];
    $scope.selectedList = {};
    $scope.xyz = true;
    $scope.checkEdit = false;
 
    $('.date-picker').datepicker({'autoclose' : true});


    console.log("line 25 == ", $rootScope.moduleAccess)
    console.log("line 26 == ", $scope.subAffilateModuleAccess);
    var tempModuleAccess = JSON.stringify($rootScope.affilateModuleAccess);
    tempModuleAccess = JSON.parse(tempModuleAccess);
    for(var i in tempModuleAccess){
      if(rootTools.filterModuleSubAffiliate.indexOf(tempModuleAccess[i].code) > -1){
        tempModuleAccess[i].status = false;
      }

      for(var j in tempModuleAccess[i].subModule){
        if(rootTools.filterModuleSubAffiliate.indexOf(tempModuleAccess[i].subModule[j].code) > -1){
          tempModuleAccess[i].subModule[j].status = false;
        }
      }
    }
    $scope.subAffilateModuleAccess = tempModuleAccess;
    $scope.affilateModuleAccess = tempModuleAccess;
    

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    
    $scope.newPageList = function () {
      $scope.listUsers("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

     $scope.newPageListSubAffiliates = function () {
      $scope.listSubAffiliates("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    var createdBy = {
        // name     : $cookies.get('poker_name'),
        name     : $rootScope.poker_name,
        // userName : $cookies.get('poker_userName'),
        userName : $rootScope.poker_userName,
        // role     : JSON.parse($cookies.get('poker_role')),
        role     : JSON.parse($rootScope.poker_role),
        // id       : $cookies.get('poker_email')
        id       : $rootScope.poker_email
    };

    // console.log(JSON.stringify(createdBy));


     $scope.affiliateData = {
        name            : "",
        userName        : "",
        mobile          : null,
        email           : "",
        password        : "",
        panCard         : "",
        role            : {name : "affiliate", level : 0},
        dob             : null,
        creditLimit     : null,
        // countryName     : "",
        cityName        : "",
        rakeCommision   : null,
        realChips       : 0,
        profit          : 0,
        withdrawal      : 0,
        status          : null,
        address         : "",
        createdBy       : createdBy,
        createdAt       : Number(new Date()),
        upDateAt        : Number(new Date()),
        withdrawalChips : 0,
        pulledRealChips : 0,
        deposit         : 0
    };

    $scope.subAffiliateData = {
        name            : "",
        userName        : "",
        mobile          : null,
        email           : "",
        password        : "",
        panCard         : "",
        role            : {name : "subAffiliate", level : -1},
        // parentUser      : $cookies.get('poker_userName'),
        parentUser      : $rootScope.poker_userName,
        dob             : null,
        creditLimit     : null,
        // countryName     : "",
        cityName        : "",
        rakeCommision   : null,
        realChips       : 0,
        profit          : 0,
        withdrawal      : 0,
        status          : null,
        address         : "",
        createdBy       : createdBy,
        createdAt       : Number(new Date()),
        upDateAt        : Number(new Date()),
        withdrawalChips : 0,
        pulledRealChips : 0,
        deposit         : 0
    };

    $scope.subAffiliateDataAdmin = {
        name            : "",
        userName        : "",
        mobile          : null,
        email           : "",
        password        : "",
        panCard         : "",
        role            : {name : "subAffiliate", level : -1},
        parentUser      : "",
        dob             : null,
        creditLimit     : null,
        // countryName     : "",
        cityName        : "",
        rakeCommision   : null,
        realChips       : 0,
        profit          : 0,
        withdrawal      : 0,
        status          : null,
        address         : "",
        createdBy       : createdBy,
        createdAt       : Number(new Date()),
        upDateAt        : Number(new Date()),
        withdrawalChips : 0,
        pulledRealChips : 0,
        deposit         : 0
    };


    // $scope.checkParent = function(module,subModule,subSubModule) {
        
    //    if(module > 0){ 
    //      if($scope.selectedList.hasOwnProperty(module.toString())){           
    //        $scope.selectedList[module.toString()] = !$scope.selectedList[module.toString()];
    //      }else{
    //        $scope.selectedList[module.toString()] = true;
    //      }
    //    }

    //    if(subModule > 0){  
    //      if($scope.selectedList.hasOwnProperty(subModule.toString())){
    //        $scope.selectedList[subModule.toString()] = !$scope.selectedList[subModule.toString()];
    //      }else{     
    //        $scope.selectedList[subModule.toString()] = true;
    //      }
    //    }

    //    if(subSubModule > 0){    
    //       if($scope.selectedList.hasOwnProperty(subSubModule.toString())){
    //           $scope.selectedList[subSubModule.toString()] = !$scope.selectedList[subSubModule.toString()];
    //        }else{     
    //           $scope.selectedList[subSubModule.toString()] = true;
    //       }
    //    }

    // }


   
    // _______________ create affiliate ____________
    $scope.submit = function(){
        
        var selected = [];
        $('input:checked').each(function() {
          console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.affiliateData.module = selected.filter(function(n){ return n != undefined });
        // $scope.affiliateData.role   = {name : "affilate", level : 0};

        if(Number(new Date($scope.affiliateData.dob)) > 0){
          $scope.affiliateData.dob  = Number(new Date($scope.affiliateData.dob));
        }

        console.log(JSON.stringify($scope.affiliateData));

        $http({
            method : "post",
            url : "/createNewAffiliate",
            data:  $scope.affiliateData,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            
            if(res.data.success){
                swal("Success!", "Affiliate Created Successfully");
                $scope.affiliateData={};
                $scope.affiliateForm.$setPristine();
                for(var i in $scope.selectedList){
                  $scope.selectedList[i] = false;
                }
                //$location.path('/listOfAffiliate');
            }else{
                swal(res.data.info)
                $scope.affiliateData.dob  = new Date($scope.affiliateData.dob);
                $scope.affiliateData.dob = $scope.affiliateData.dob.toISOString().split('T')[0];
            }

        }, function myError(err) {
            console.log(err,"err")
                // swal(err);
                swal("Error!", "Getting error from server in login!");
        });
    }


    //get count of affiliate
    $scope.getAffiliateCount = function(){
      $http.get("/getAffiliateCount")
        .success(function(res){
        if(res.success){
             console.log("line 235== ", res.result);
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
            $scope.totalPage = 0;
            swal("No data found!");
          }
        }).error(function(err){
        swal("Error!", "Getting error from server in showing history",err.stack);
      });
    }

    // $scope.getSubAffiliateCount = function(){
    //   $http.get("/getSubAffiliateCount")
    //     .success(function(res){
    //     if(res.success){
    //          console.log("res.result line226== ", res);
    //          $scope.totalPage = res.result;
    //          $scope.newPageListSubAffiliates();
    //       } else{
    //         $scope.totalPage = 0;
    //         swal("No data found!");
    //       }
    //     }).error(function(err){
    //     swal("Error!", "Getting error from server in showing history",err.stack);
    //   });
    // }


    $scope.getSubAffiliateCount = function(){
      var data = {}
      // if(JSON.parse($cookies.get('poker_role')).level == 0){
      if(JSON.parse($rootScope.poker_role).level == 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        $scope.setDisabled = true;
      }
      
      if($stateParams.affiliateId){
        data.parentUser = $stateParams.affiliateId;
      }
      
      if($scope.status){
        data.status = $scope.status;
      }
      if($scope.name){
        data.name = $scope.name;
      }
      if($scope.email){
        data.email = $scope.email;
      }
      if($scope.loginId){
        data.loginId = $scope.loginId;
      }

      $http({
         method : "post",
         url : "/getSubAffiliateCount",
         data:  data,
         headers: {'Content-Type': 'application/json'}
     }).then(function mySucces(res) {
      console.log(res);
         
      if(res.data.success){
         console.log("res.result line226== ", res);
         $scope.totalPage = res.data.result;
         $scope.newPageListSubAffiliates();
      } else{
        $scope.totalPage = 0;
        swal("No data found!");
      }
      

          }, function myError(err) {
            console.log(err,"err")
                swal("Error!", "Getting error from server in login");
        });

      // $http.get("/getSubAffiliateCount")
      //   .success(function(res){
      //   if(res.success){
      //        console.log("res.result line226== ", res);
      //        $scope.totalPage = res.result;
      //        $scope.newPageListSubAffiliates();
      //     } else{
      //       $scope.totalPage = 0;
      //       swal("Missing Keys");
      //     }
      //   }).error(function(err){
      //   swal("Error!", "Getting error from server in showing history",err.stack);
      // });
    }

    //______________ get list of affliate _____________
    $scope.listUsers = function(id,dataSkip, dataLimit){
      var data = {};
      data.roleName = "affiliate";
      data.skip = dataSkip;
      data.limit = dataLimit;
      if(id){
        data._id = id;
      }
      if($scope.status){
        data.status = $scope.status;
      }
      if($scope.name){
        data.name = $scope.name;
      }
      if($scope.email){
        data.email = $scope.email;
      }
      if($scope.loginId){
        data.loginId = $scope.loginId;
      }

      $http({
         method : "post",
         url : "/listAffiliate",
         data:  data,
         headers: {'Content-Type': 'application/json'}
     }).then(function mySucces(res) {
         
      if(res.data.success){
        console.log(res.data);
        $scope.dataList = res.data.result;
        if(res.data.result.length == 1){
          $scope.totalPage = 0;
        }
        if(res.data.result.length == 0){
          $scope.totalPage = 0;
          swal("No data found.");
        }
        if(id){
          $scope.affiliateData = $scope.dataList[0];
          $scope.affiliateData.dob = $filter('date')($scope.affiliateData.dob, "yyyy-MM-dd");;
          for(var i in res.data.result[0].module){
                $scope.selectedList[res.data.result[0].module[i]] = true;
            }
        }
      }else{
        swal("Error!", res.data.info);
       }

          }, function myError(err) {
            console.log(err,"err")
                swal("Error!", "Getting error from server in login");
        });

    }

    $scope.listSubAffiliates = function(id,dataSkip, dataLimit,cb){
      var data = {};
      data.roleName = "affiliate";
      data.skip = dataSkip;
      data.limit = dataLimit;
      // console.log("line 280 == ", $cookies.get('poker_role'), $cookies.get('poker_role').level);
      console.log("line 280 == ", $rootScope.poker_role, $rootScope.poker_role.level);
      // if(JSON.parse($cookies.get('poker_role')).level == 0){
      if(JSON.parse($rootScope.poker_role).level == 0){
        // data.parentUser = $cookies.get('poker_userName');
        data.parentUser = $rootScope.poker_userName;
        $scope.setDisabled = true;
      }
      
      if($stateParams.affiliateId){
        data.parentUser = $stateParams.affiliateId;
      }
      
      if(id){
        data._id = id;
      }

      if($scope.status){
        data.status = $scope.status;
      }
      if($scope.name){
        data.name = $scope.name;
      }
      if($scope.email){
        data.email = $scope.email;
      }
      if($scope.loginId){
        data.loginId = $scope.loginId;
      }

      $http({
         method : "post",
         url : "/listSubAffiliate",
         data:  data,
         headers: {'Content-Type': 'application/json'}
     }).then(function mySucces(res) {
         
      if(res.data.success){
        console.log(res.data);
        $scope.dataList = res.data.result;
        // if(res.data.result.length == 1){
        //   $scope.totalPage = 0;
        // }
        if(res.data.result.length == 0){
          $scope.totalPage = 0;
          swal("No data found.");
        }
        if(id){
          $scope.subAffiliateDataAdmin = $scope.dataList[0];
          $scope.subAffiliateDataAdmin.dob = $filter('date')($scope.subAffiliateDataAdmin.dob, "yyyy-MM-dd");;
          for(var i in res.data.result[0].module){
                $scope.selectedList[res.data.result[0].module[i]] = true;
            }
        }
      }else{
        swal("Error!", res.data.info);
       }
       if(cb instanceof Function){
            cb();
          }

          }, function myError(err) {
            console.log(err,"err")
                swal("Error!", "Getting error from server in login");
        });

    }


    //_____________ check age limit _________
    
    $scope.checkAge = function(birthDate) { 
      var today = new Date();
      var birthDate = new Date(birthDate);
      var age = today.getFullYear() - birthDate.getFullYear();
      var m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
      {
          age--;
      }
      if(age < 18){
        swal("Info!", "You are less than 18 years so your account cannot be created.");
        $scope.affiliateData.dob = null;
        $scope.subAffiliateData.dob = null;
        $scope.subAffiliateDataAdmin.dob = null;
      }
    }

    $scope.cancelSubmit = function(){
      $scope.affiliateData={};
      $location.path('/listOfAffiliate');
    }


    // _______________ create affiliate ____________
    $scope.submitUpdate = function(){
        var selected = [];
        $('input:checked').each(function() {
          console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.affiliateData.module = selected.filter(function(n){ return n != undefined });

        if(Number(new Date($scope.affiliateData.dob)) > 0 && $scope.affiliateData.dob !== null){
          $scope.affiliateData.dob    = Number(new Date($scope.affiliateData.dob));
        }
      
        console.log(JSON.stringify($scope.affiliateData));

        $http({
            method : "post",
            url : "/updateAffiliate",
            data:  $scope.affiliateData,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            
            if(res.data.success){
                swal("Success!", "Affiliate successfully updated");
                $scope.affiliateData={};
                $location.path('/listOfAffiliate');
            }else{
                swal(res.data.info)
            }

        }, function myError(err) {
            console.log(err,"err")
                swal("Error!", "Getting error from server in login!");
        });
    }

    $scope.updateSubAffiliateByAdmin = function(){
        var selected = [];
        $('input:checked').each(function() {
          console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.subAffiliateDataAdmin.module = selected.filter(function(n){ return n != undefined });

        var data = angular.copy($scope.subAffiliateDataAdmin);
        
        if(Number(new Date($scope.subAffiliateDataAdmin.dob)) > 0 && $scope.subAffiliateDataAdmin.dob !== null){
          data.dob    = Number(new Date($scope.subAffiliateDataAdmin.dob));
        }
        
        console.log(JSON.stringify(data));

      
        // console.log(JSON.stringify($scope.subAffiliateDataAdmin));

        $http({
            method : "post",
            url : "/updateSubAffiliate",
            data:  data,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
        // $scope.myWelcome = response.data;
            
            if(res.data.success){
                swal("Success!", "Sub-affiliate Successfully updated");
                $scope.affiliateData={};
                $location.path('/listSubAffiliate');
            }else{
                swal(res.data.info)
            }

            //console.log(moduleObj,"moduleObj")
        }, function myError(err) {
            // $scope.myWelcome = response.statusText;
            console.log(err,"err")
                // swal(err);
                swal("Error!", "Getting error from server in login!");
            // swal("Getting error from server in login");
        });
    }

  // ________________ load data if edit page ________________
    if($stateParams.affilateId){
      $scope.checkEdit = true;
      $scope.listUsers($stateParams.affilateId,0,0);
    }

    if($stateParams.subAffilateId){
      $scope.checkEdit = true;
      $scope.listSubAffiliates($stateParams.subAffilateId,0,0);
    }


/*this function create sub-affiliate by admin*/

  $scope.submitByAdmin = function(){
    var selected = [];
        $('input:checked').each(function() {
          console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.subAffiliateDataAdmin.module = selected.filter(function(n){ return n != undefined });

        if(Number(new Date($scope.subAffiliateDataAdmin.dob)) > 0){
          $scope.subAffiliateDataAdmin.dob  = Number(new Date($scope.subAffiliateDataAdmin.dob));
        }

        console.log(JSON.stringify($scope.subAffiliateDataAdmin));

        $http({
            method : "post",
            url : "/createSubAffiliate",
            data:  $scope.subAffiliateDataAdmin,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            
            if(res.data.success){
                swal("Success!", "Successfully created sub-affilate!");
                $scope.subAffiliateDataAdmin={};
                $scope.affiliateForm.$setPristine();
                $scope.subAffiliateDataAdmin.role = {};
                $scope.subAffiliateDataAdmin.module = "";
                $scope.subAffiliateDataAdmin.role.name = "subAffiliate";
                $scope.subAffiliateDataAdmin.cnfpassword = "";
                for(var i in $scope.selectedList){
                  $scope.selectedList[i] = false;
                }
                //$location.path('/listSubAffiliate');
            }else{
                swal(res.data.info)
                $scope.subAffiliateDataAdmin.dob  = new Date($scope.subAffiliateDataAdmin.dob);
                $scope.subAffiliateDataAdmin.dob = $scope.subAffiliateDataAdmin.dob.toISOString().split('T')[0];
            }

        }, function myError(err) {
            console.log(err,"err")
                // swal(err);
                swal("Error!", "Getting error from server!");
        });
  }


  $scope.submitByAffiliate = function(){
    var selected = [];
        $('input:checked').each(function() {
          console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        $scope.subAffiliateData.module = selected.filter(function(n){ return n != undefined });

        if(Number(new Date($scope.subAffiliateData.dob)) > 0){
          $scope.subAffiliateData.dob  = Number(new Date($scope.subAffiliateData.dob));
        }

        console.log(JSON.stringify($scope.subAffiliateData));

        $http({
            method : "post",
            url : "/createSubAffiliate",
            data:  $scope.subAffiliateData,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            
            if(res.data.success){
                swal("Success!", "Successfully created sub-affilate!");
                $scope.subAffiliateData={};
                $scope.affiliateForm.$setPristine();
                $scope.subAffiliateData.role = {};
                $scope.subAffiliateData.module = "";
                $scope.subAffiliateData.role.name = "subAffiliate";
                $scope.subAffiliateData.cnfpassword = "";
                for(var i in $scope.selectedList){
                  $scope.selectedList[i] = false;
                }
                //$location.path('/listSubAffiliate');
            }else{
                swal(res.data.info)
                $scope.subAffiliateData.dob = new Date($scope.subAffiliateData.dob);
                $scope.subAffiliateData.dob = $scope.subAffiliateData.dob.toISOString().split('T')[0];
            }

        }, function myError(err) {
            console.log(err,"err")
                // swal(err);
                swal("Error!", "Getting error from server!");
        });
  }

  $scope.changeModule = function(check, module, module1, module2) {
        if(module2) {
          var checked = false;
          console.log(check, module2)
          module1.subModule.forEach(function(o) {
            if($scope.selectedList[o.code]) {
              checked = true;
            }
          })
          console.log(checked)
          $scope.selectedList[module1.code] = checked;
          // selectedList[module.code] = checked;
        }

        if(module1) {
          var checked = false;
          module.subModule.forEach(function(o) {
            if($scope.selectedList[o.code]) {
              checked = true;
            }
          })
          $scope.selectedList[module.code] = checked;
        }
        if(!module1 && !module2 && module.subModule) {
          module.subModule.forEach(function(o) {
            $scope.selectedList[o.code] = check;
            if(o.subModule) {
               o.subModule.forEach(function(SubO) {
                  $scope.selectedList[SubO.code] = check;
               });
            }
          })
        } else if(!module2 && module1 && module1.subModule) {
          module1.subModule.forEach(function(o) {
            $scope.selectedList[o.code] = check;
          })
        }
        
    }

    $scope.searchFunction = function(){
			if(!$scope.status && !$scope.name && !$scope.email && !$scope.loginId){
				swal("Please provide at least one input.")
			}
			else{
				$scope.getSubAffiliateCount();
			}
		}

		$scope.reset = function(){
			$scope.status = "";
			$scope.name = "";
			$scope.email = "";
			$scope.loginId= "";
			$scope.getSubAffiliateCount();
		}

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};

          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }


    $scope.exportData = function (tableId) {
      $scope.listSubAffiliates("", 0, 0, function(){
        $window.scrollTo(0, 0);
        setTimeout(function() {
          location.href=Excel(tableId,'sheet_name');
        }, 500);
      });
    };

}]);





;angular.module('MetronicApp').controller('TableEditedFieldsController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count

    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }

    if(!$stateParams.tableUpdateId || !$rootScope.dataListUpdateTable){
      swal('Update ID not found');
    }
    else{
      console.log("line 36 ", $rootScope.dataListUpdateTable, $stateParams.tableUpdateId);
      var updatesData = $rootScope.dataListUpdateTable;

      $scope.updateDataElement = updatesData.find(function(element) {
        return element._id == $stateParams.tableUpdateId;
      });

      console.log('line 42 ', $scope.updateDataElement);
    }

}]);


;angular.module('MetronicApp').controller('TableUpdateReportController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list table controller loaded");
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $cookies.remove('poker_token');
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count

    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }

    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listTableUpdateData("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }


    $scope.init = function(){
      $cookies.remove('poker_token');
      $cookies.remove('poker_name');
      $cookies.remove('poker_role');
      $cookies.remove('poker_userName');
      $cookies.remove('poker_email');
      $cookies.remove('poker_parent');

    }
    

    $scope.listTableUpdateData = function(id, skipData, limitData, cb){
      var data = {};
      if($scope.startDate){
        var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      }
      if($scope.endDate){
        var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      }
      // var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      // var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      console.log('line 55 ', startDate, endDate);
      if(!$scope.startDate){
        startDate =  Number(new Date())-(24*60*60*1000);
        endDate =  Number(new Date());
      }
      
      data.startDate = startDate;
      data.endDate = endDate;
      data.channelId = $stateParams.tableId;
      data.skip = skipData;
      data.limit = limitData;

      var listTableResult = {};
      $http.post("/getTableUpdateRecords", data)
      .success(function(res){
        console.log("res.result---------", res.result);
        $scope.dataList = res.result;
        $rootScope.dataListUpdateTable = res.result;
        if(cb instanceof Function){
          cb();
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });

      
    }

    $scope.countData = function(){
      if(!$scope.startDate || !$scope.endDate){
        swal("Please provide start date and end date.")
        return false
      }
      var data = {};
      
      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      
      data.startDate = startDate;
      data.endDate = endDate;
      data.channelId = $stateParams.tableId
      $http.post("/getTableUpdateRecordsCount", data)
      .success(function(res){
        console.log("res.result---------", res);
        if(res.success){
          $scope.totalPage = res.result;
          $scope.newPageList();
        }
        else{
          swal('No data found');
          $scope.startDate = '';
          $scope.endDate = '';
          $scope.totalPage = 0;
          $scope.dataList = "";
        }
        
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });
    }

    
    $scope.initCountData = function(){
      var data = {};
      var startDate =  Number(new Date())-(24*60*60*1000);
      var endDate =  Number(new Date());
      
      data.startDate = startDate;
      data.endDate = endDate;
      data.channelId = $stateParams.tableId
      $http.post("/getTableUpdateRecordsCount", data)
      .success(function(res){
        console.log("res.result---------", res);
        if(res.success){
          $scope.totalPage = res.result;
          $scope.newPageList();
        }
        else{
          swal('No data found');
          $scope.startDate = '';
          $scope.endDate = '';
          $scope.dataList = "";
        }
        
      }).error(function(err){
        swal("Error!", "Getting error from server in showing tables");
      });
    }

    $scope.initCountData();

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.dataList = "";
      $scope.totalPage = 0;
      $scope.initCountData();
    }

    var Excel = function(tableId, worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listTableUpdateData("", 0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.listTableUpdateData("", 0, 20);
          // $scope.resetForm();
        },500); // trigger download
      });
    };


}]);


;angular.module('MetronicApp').controller('TodoController', ["$rootScope", "$scope", "$http", "$timeout", function($rootScope, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax(); // initialize core components        
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
}]);;/**
 * AngularJS default filter with the following expression:
 * "person in people | filter: {name: $select.search, age: $select.search}"
 * performs a AND between 'name: $select.search' and 'age: $select.search'.
 * We want to perform a OR.
 */
angular.module('MetronicApp').filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);

            items.forEach(function(item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

angular.module('MetronicApp').controller('UISelectController', ["$scope", "$http", "$timeout", "$interval", function($scope, $http, $timeout, $interval) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initAjax(); // initialize core components
    });

    var vm = this;

    vm.disabled = undefined;
    vm.searchEnabled = undefined;

    vm.setInputFocus = function() {
        $scope.$broadcast('UiSelectDemo1');
    };

    vm.enable = function() {
        vm.disabled = false;
    };

    vm.disable = function() {
        vm.disabled = true;
    };

    vm.enableSearch = function() {
        vm.searchEnabled = true;
    };

    vm.disableSearch = function() {
        vm.searchEnabled = false;
    };

    vm.clear = function() {
        vm.person.selected = undefined;
        vm.address.selected = undefined;
        vm.country.selected = undefined;
    };

    vm.someGroupFn = function(item) {

        if (item.name[0] >= 'A' && item.name[0] <= 'M')
            return 'From A - M';

        if (item.name[0] >= 'N' && item.name[0] <= 'Z')
            return 'From N - Z';

    };

    vm.firstLetterGroupFn = function(item) {
        return item.name[0];
    };

    vm.reverseOrderFilterFn = function(groups) {
        return groups.reverse();
    };

    vm.personAsync = {
        selected: "wladimir@email.com"
    };
    vm.peopleAsync = [];

    $timeout(function() {
        vm.peopleAsync = [{
            name: 'Adam',
            email: 'adam@email.com',
            age: 12,
            country: 'United States'
        }, {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12,
            country: 'Argentina'
        }, {
            name: 'Estefanía',
            email: 'estefania@email.com',
            age: 21,
            country: 'Argentina'
        }, {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21,
            country: 'Ecuador'
        }, {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30,
            country: 'Ecuador'
        }, {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 30,
            country: 'United States'
        }, {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        }, {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54,
            country: 'Ecuador'
        }, {
            name: 'Michael',
            email: 'michael@email.com',
            age: 15,
            country: 'Colombia'
        }, {
            name: 'Nicolás',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        }];
    }, 3000);

    vm.counter = 0;
    vm.onSelectCallback = function(item, model) {
        vm.counter++;
        vm.eventResult = {
            item: item,
            model: model
        };
    };

    vm.removed = function(item, model) {
        vm.lastRemoved = {
            item: item,
            model: model
        };
    };

    vm.tagTransform = function(newTag) {
        var item = {
            name: newTag,
            email: newTag.toLowerCase() + '@email.com',
            age: 'unknown',
            country: 'unknown'
        };

        return item;
    };

    vm.peopleObj = {
        '1': {
            name: 'Adam',
            email: 'adam@email.com',
            age: 12,
            country: 'United States'
        },
        '2': {
            name: 'Amalie',
            email: 'amalie@email.com',
            age: 12,
            country: 'Argentina'
        },
        '3': {
            name: 'Estefanía',
            email: 'estefania@email.com',
            age: 21,
            country: 'Argentina'
        },
        '4': {
            name: 'Adrian',
            email: 'adrian@email.com',
            age: 21,
            country: 'Ecuador'
        },
        '5': {
            name: 'Wladimir',
            email: 'wladimir@email.com',
            age: 30,
            country: 'Ecuador'
        },
        '6': {
            name: 'Samantha',
            email: 'samantha@email.com',
            age: 30,
            country: 'United States'
        },
        '7': {
            name: 'Nicole',
            email: 'nicole@email.com',
            age: 43,
            country: 'Colombia'
        },
        '8': {
            name: 'Natasha',
            email: 'natasha@email.com',
            age: 54,
            country: 'Ecuador'
        },
        '9': {
            name: 'Michael',
            email: 'michael@email.com',
            age: 15,
            country: 'Colombia'
        },
        '10': {
            name: 'Nicolás',
            email: 'nicolas@email.com',
            age: 43,
            country: 'Colombia'
        }
    };

    vm.person = {};

    vm.person.selectedValue = vm.peopleObj[3];
    vm.person.selectedSingle = 'Samantha';
    vm.person.selectedSingleKey = '5';
    // To run the demos with a preselected person object, uncomment the line below.
    //vm.person.selected = vm.person.selectedValue;

    vm.people = [{
        name: 'Adam',
        email: 'adam@email.com',
        age: 12,
        country: 'United States'
    }, {
        name: 'Amalie',
        email: 'amalie@email.com',
        age: 12,
        country: 'Argentina'
    }, {
        name: 'Estefanía',
        email: 'estefania@email.com',
        age: 21,
        country: 'Argentina'
    }, {
        name: 'Adrian',
        email: 'adrian@email.com',
        age: 21,
        country: 'Ecuador'
    }, {
        name: 'Wladimir',
        email: 'wladimir@email.com',
        age: 30,
        country: 'Ecuador'
    }, {
        name: 'Samantha',
        email: 'samantha@email.com',
        age: 30,
        country: 'United States'
    }, {
        name: 'Nicole',
        email: 'nicole@email.com',
        age: 43,
        country: 'Colombia'
    }, {
        name: 'Natasha',
        email: 'natasha@email.com',
        age: 54,
        country: 'Ecuador'
    }, {
        name: 'Michael',
        email: 'michael@email.com',
        age: 15,
        country: 'Colombia'
    }, {
        name: 'Nicolás',
        email: 'nicolas@email.com',
        age: 43,
        country: 'Colombia'
    }];

    vm.availableColors = ['Red', 'Green', 'Blue', 'Yellow', 'Magenta', 'Maroon', 'Umbra', 'Turquoise'];

    vm.singleDemo = {};
    vm.singleDemo.color = '';
    vm.multipleDemo = {};
    vm.multipleDemo.colors = ['Blue', 'Red'];
    vm.multipleDemo.colors2 = ['Blue', 'Red'];
    vm.multipleDemo.selectedPeople = [vm.people[5], vm.people[4]];
    vm.multipleDemo.selectedPeople2 = vm.multipleDemo.selectedPeople;
    vm.multipleDemo.selectedPeopleWithGroupBy = [vm.people[8], vm.people[6]];
    vm.multipleDemo.selectedPeopleSimple = ['samantha@email.com', 'wladimir@email.com'];
    vm.multipleDemo.removeSelectIsFalse = [vm.people[2], vm.people[0]];

    vm.appendToBodyDemo = {
        remainingToggleTime: 0,
        present: true,
        startToggleTimer: function() {
            var scope = vm.appendToBodyDemo;
            var promise = $interval(function() {
                if (scope.remainingTime < 1000) {
                    $interval.cancel(promise);
                    scope.present = !scope.present;
                    scope.remainingTime = 0;
                } else {
                    scope.remainingTime -= 1000;
                }
            }, 1000);
            scope.remainingTime = 3000;
        }
    };

    vm.address = {};
    vm.refreshAddresses = function(address) {
        var params = {
            address: address,
            sensor: false
        };
        return $http.get(
            'http://maps.googleapis.com/maps/api/geocode/json', {
                params: params
            }
        ).then(function(response) {
            vm.addresses = response.data.results;
        });
    };

    vm.addPerson = function(item, model) {
        if (item.hasOwnProperty('isTag')) {
            delete item.isTag;
            vm.people.push(item);
        }
    }

    vm.country = {};
    vm.countries = [ // Taken from https://gist.github.com/unceus/6501985
        {
            name: 'Afghanistan',
            code: 'AF'
        }, {
            name: 'Åland Islands',
            code: 'AX'
        }, {
            name: 'Albania',
            code: 'AL'
        }, {
            name: 'Algeria',
            code: 'DZ'
        }, {
            name: 'American Samoa',
            code: 'AS'
        }, {
            name: 'Andorra',
            code: 'AD'
        }, {
            name: 'Angola',
            code: 'AO'
        }, {
            name: 'Anguilla',
            code: 'AI'
        }, {
            name: 'Antarctica',
            code: 'AQ'
        }, {
            name: 'Antigua and Barbuda',
            code: 'AG'
        }, {
            name: 'Argentina',
            code: 'AR'
        }, {
            name: 'Armenia',
            code: 'AM'
        }, {
            name: 'Aruba',
            code: 'AW'
        }, {
            name: 'Australia',
            code: 'AU'
        }, {
            name: 'Austria',
            code: 'AT'
        }, {
            name: 'Azerbaijan',
            code: 'AZ'
        }, {
            name: 'Bahamas',
            code: 'BS'
        }, {
            name: 'Bahrain',
            code: 'BH'
        }, {
            name: 'Bangladesh',
            code: 'BD'
        }, {
            name: 'Barbados',
            code: 'BB'
        }, {
            name: 'Belarus',
            code: 'BY'
        }, {
            name: 'Belgium',
            code: 'BE'
        }, {
            name: 'Belize',
            code: 'BZ'
        }, {
            name: 'Benin',
            code: 'BJ'
        }, {
            name: 'Bermuda',
            code: 'BM'
        }, {
            name: 'Bhutan',
            code: 'BT'
        }, {
            name: 'Bolivia',
            code: 'BO'
        }, {
            name: 'Bosnia and Herzegovina',
            code: 'BA'
        }, {
            name: 'Botswana',
            code: 'BW'
        }, {
            name: 'Bouvet Island',
            code: 'BV'
        }, {
            name: 'Brazil',
            code: 'BR'
        }, {
            name: 'British Indian Ocean Territory',
            code: 'IO'
        }, {
            name: 'Brunei Darussalam',
            code: 'BN'
        }, {
            name: 'Bulgaria',
            code: 'BG'
        }, {
            name: 'Burkina Faso',
            code: 'BF'
        }, {
            name: 'Burundi',
            code: 'BI'
        }, {
            name: 'Cambodia',
            code: 'KH'
        }, {
            name: 'Cameroon',
            code: 'CM'
        }, {
            name: 'Canada',
            code: 'CA'
        }, {
            name: 'Cape Verde',
            code: 'CV'
        }, {
            name: 'Cayman Islands',
            code: 'KY'
        }, {
            name: 'Central African Republic',
            code: 'CF'
        }, {
            name: 'Chad',
            code: 'TD'
        }, {
            name: 'Chile',
            code: 'CL'
        }, {
            name: 'China',
            code: 'CN'
        }, {
            name: 'Christmas Island',
            code: 'CX'
        }, {
            name: 'Cocos (Keeling) Islands',
            code: 'CC'
        }, {
            name: 'Colombia',
            code: 'CO'
        }, {
            name: 'Comoros',
            code: 'KM'
        }, {
            name: 'Congo',
            code: 'CG'
        }, {
            name: 'Congo, The Democratic Republic of the',
            code: 'CD'
        }, {
            name: 'Cook Islands',
            code: 'CK'
        }, {
            name: 'Costa Rica',
            code: 'CR'
        }, {
            name: 'Cote D\'Ivoire',
            code: 'CI'
        }, {
            name: 'Croatia',
            code: 'HR'
        }, {
            name: 'Cuba',
            code: 'CU'
        }, {
            name: 'Cyprus',
            code: 'CY'
        }, {
            name: 'Czech Republic',
            code: 'CZ'
        }, {
            name: 'Denmark',
            code: 'DK'
        }, {
            name: 'Djibouti',
            code: 'DJ'
        }, {
            name: 'Dominica',
            code: 'DM'
        }, {
            name: 'Dominican Republic',
            code: 'DO'
        }, {
            name: 'Ecuador',
            code: 'EC'
        }, {
            name: 'Egypt',
            code: 'EG'
        }, {
            name: 'El Salvador',
            code: 'SV'
        }, {
            name: 'Equatorial Guinea',
            code: 'GQ'
        }, {
            name: 'Eritrea',
            code: 'ER'
        }, {
            name: 'Estonia',
            code: 'EE'
        }, {
            name: 'Ethiopia',
            code: 'ET'
        }, {
            name: 'Falkland Islands (Malvinas)',
            code: 'FK'
        }, {
            name: 'Faroe Islands',
            code: 'FO'
        }, {
            name: 'Fiji',
            code: 'FJ'
        }, {
            name: 'Finland',
            code: 'FI'
        }, {
            name: 'France',
            code: 'FR'
        }, {
            name: 'French Guiana',
            code: 'GF'
        }, {
            name: 'French Polynesia',
            code: 'PF'
        }, {
            name: 'French Southern Territories',
            code: 'TF'
        }, {
            name: 'Gabon',
            code: 'GA'
        }, {
            name: 'Gambia',
            code: 'GM'
        }, {
            name: 'Georgia',
            code: 'GE'
        }, {
            name: 'Germany',
            code: 'DE'
        }, {
            name: 'Ghana',
            code: 'GH'
        }, {
            name: 'Gibraltar',
            code: 'GI'
        }, {
            name: 'Greece',
            code: 'GR'
        }, {
            name: 'Greenland',
            code: 'GL'
        }, {
            name: 'Grenada',
            code: 'GD'
        }, {
            name: 'Guadeloupe',
            code: 'GP'
        }, {
            name: 'Guam',
            code: 'GU'
        }, {
            name: 'Guatemala',
            code: 'GT'
        }, {
            name: 'Guernsey',
            code: 'GG'
        }, {
            name: 'Guinea',
            code: 'GN'
        }, {
            name: 'Guinea-Bissau',
            code: 'GW'
        }, {
            name: 'Guyana',
            code: 'GY'
        }, {
            name: 'Haiti',
            code: 'HT'
        }, {
            name: 'Heard Island and Mcdonald Islands',
            code: 'HM'
        }, {
            name: 'Holy See (Vatican City State)',
            code: 'VA'
        }, {
            name: 'Honduras',
            code: 'HN'
        }, {
            name: 'Hong Kong',
            code: 'HK'
        }, {
            name: 'Hungary',
            code: 'HU'
        }, {
            name: 'Iceland',
            code: 'IS'
        }, {
            name: 'India',
            code: 'IN'
        }, {
            name: 'Indonesia',
            code: 'ID'
        }, {
            name: 'Iran, Islamic Republic Of',
            code: 'IR'
        }, {
            name: 'Iraq',
            code: 'IQ'
        }, {
            name: 'Ireland',
            code: 'IE'
        }, {
            name: 'Isle of Man',
            code: 'IM'
        }, {
            name: 'Israel',
            code: 'IL'
        }, {
            name: 'Italy',
            code: 'IT'
        }, {
            name: 'Jamaica',
            code: 'JM'
        }, {
            name: 'Japan',
            code: 'JP'
        }, {
            name: 'Jersey',
            code: 'JE'
        }, {
            name: 'Jordan',
            code: 'JO'
        }, {
            name: 'Kazakhstan',
            code: 'KZ'
        }, {
            name: 'Kenya',
            code: 'KE'
        }, {
            name: 'Kiribati',
            code: 'KI'
        }, {
            name: 'Korea, Democratic People\'s Republic of',
            code: 'KP'
        }, {
            name: 'Korea, Republic of',
            code: 'KR'
        }, {
            name: 'Kuwait',
            code: 'KW'
        }, {
            name: 'Kyrgyzstan',
            code: 'KG'
        }, {
            name: 'Lao People\'s Democratic Republic',
            code: 'LA'
        }, {
            name: 'Latvia',
            code: 'LV'
        }, {
            name: 'Lebanon',
            code: 'LB'
        }, {
            name: 'Lesotho',
            code: 'LS'
        }, {
            name: 'Liberia',
            code: 'LR'
        }, {
            name: 'Libyan Arab Jamahiriya',
            code: 'LY'
        }, {
            name: 'Liechtenstein',
            code: 'LI'
        }, {
            name: 'Lithuania',
            code: 'LT'
        }, {
            name: 'Luxembourg',
            code: 'LU'
        }, {
            name: 'Macao',
            code: 'MO'
        }, {
            name: 'Macedonia, The Former Yugoslav Republic of',
            code: 'MK'
        }, {
            name: 'Madagascar',
            code: 'MG'
        }, {
            name: 'Malawi',
            code: 'MW'
        }, {
            name: 'Malaysia',
            code: 'MY'
        }, {
            name: 'Maldives',
            code: 'MV'
        }, {
            name: 'Mali',
            code: 'ML'
        }, {
            name: 'Malta',
            code: 'MT'
        }, {
            name: 'Marshall Islands',
            code: 'MH'
        }, {
            name: 'Martinique',
            code: 'MQ'
        }, {
            name: 'Mauritania',
            code: 'MR'
        }, {
            name: 'Mauritius',
            code: 'MU'
        }, {
            name: 'Mayotte',
            code: 'YT'
        }, {
            name: 'Mexico',
            code: 'MX'
        }, {
            name: 'Micronesia, Federated States of',
            code: 'FM'
        }, {
            name: 'Moldova, Republic of',
            code: 'MD'
        }, {
            name: 'Monaco',
            code: 'MC'
        }, {
            name: 'Mongolia',
            code: 'MN'
        }, {
            name: 'Montserrat',
            code: 'MS'
        }, {
            name: 'Morocco',
            code: 'MA'
        }, {
            name: 'Mozambique',
            code: 'MZ'
        }, {
            name: 'Myanmar',
            code: 'MM'
        }, {
            name: 'Namibia',
            code: 'NA'
        }, {
            name: 'Nauru',
            code: 'NR'
        }, {
            name: 'Nepal',
            code: 'NP'
        }, {
            name: 'Netherlands',
            code: 'NL'
        }, {
            name: 'Netherlands Antilles',
            code: 'AN'
        }, {
            name: 'New Caledonia',
            code: 'NC'
        }, {
            name: 'New Zealand',
            code: 'NZ'
        }, {
            name: 'Nicaragua',
            code: 'NI'
        }, {
            name: 'Niger',
            code: 'NE'
        }, {
            name: 'Nigeria',
            code: 'NG'
        }, {
            name: 'Niue',
            code: 'NU'
        }, {
            name: 'Norfolk Island',
            code: 'NF'
        }, {
            name: 'Northern Mariana Islands',
            code: 'MP'
        }, {
            name: 'Norway',
            code: 'NO'
        }, {
            name: 'Oman',
            code: 'OM'
        }, {
            name: 'Pakistan',
            code: 'PK'
        }, {
            name: 'Palau',
            code: 'PW'
        }, {
            name: 'Palestinian Territory, Occupied',
            code: 'PS'
        }, {
            name: 'Panama',
            code: 'PA'
        }, {
            name: 'Papua New Guinea',
            code: 'PG'
        }, {
            name: 'Paraguay',
            code: 'PY'
        }, {
            name: 'Peru',
            code: 'PE'
        }, {
            name: 'Philippines',
            code: 'PH'
        }, {
            name: 'Pitcairn',
            code: 'PN'
        }, {
            name: 'Poland',
            code: 'PL'
        }, {
            name: 'Portugal',
            code: 'PT'
        }, {
            name: 'Puerto Rico',
            code: 'PR'
        }, {
            name: 'Qatar',
            code: 'QA'
        }, {
            name: 'Reunion',
            code: 'RE'
        }, {
            name: 'Romania',
            code: 'RO'
        }, {
            name: 'Russian Federation',
            code: 'RU'
        }, {
            name: 'Rwanda',
            code: 'RW'
        }, {
            name: 'Saint Helena',
            code: 'SH'
        }, {
            name: 'Saint Kitts and Nevis',
            code: 'KN'
        }, {
            name: 'Saint Lucia',
            code: 'LC'
        }, {
            name: 'Saint Pierre and Miquelon',
            code: 'PM'
        }, {
            name: 'Saint Vincent and the Grenadines',
            code: 'VC'
        }, {
            name: 'Samoa',
            code: 'WS'
        }, {
            name: 'San Marino',
            code: 'SM'
        }, {
            name: 'Sao Tome and Principe',
            code: 'ST'
        }, {
            name: 'Saudi Arabia',
            code: 'SA'
        }, {
            name: 'Senegal',
            code: 'SN'
        }, {
            name: 'Serbia and Montenegro',
            code: 'CS'
        }, {
            name: 'Seychelles',
            code: 'SC'
        }, {
            name: 'Sierra Leone',
            code: 'SL'
        }, {
            name: 'Singapore',
            code: 'SG'
        }, {
            name: 'Slovakia',
            code: 'SK'
        }, {
            name: 'Slovenia',
            code: 'SI'
        }, {
            name: 'Solomon Islands',
            code: 'SB'
        }, {
            name: 'Somalia',
            code: 'SO'
        }, {
            name: 'South Africa',
            code: 'ZA'
        }, {
            name: 'South Georgia and the South Sandwich Islands',
            code: 'GS'
        }, {
            name: 'Spain',
            code: 'ES'
        }, {
            name: 'Sri Lanka',
            code: 'LK'
        }, {
            name: 'Sudan',
            code: 'SD'
        }, {
            name: 'Suriname',
            code: 'SR'
        }, {
            name: 'Svalbard and Jan Mayen',
            code: 'SJ'
        }, {
            name: 'Swaziland',
            code: 'SZ'
        }, {
            name: 'Sweden',
            code: 'SE'
        }, {
            name: 'Switzerland',
            code: 'CH'
        }, {
            name: 'Syrian Arab Republic',
            code: 'SY'
        }, {
            name: 'Taiwan, Province of China',
            code: 'TW'
        }, {
            name: 'Tajikistan',
            code: 'TJ'
        }, {
            name: 'Tanzania, United Republic of',
            code: 'TZ'
        }, {
            name: 'Thailand',
            code: 'TH'
        }, {
            name: 'Timor-Leste',
            code: 'TL'
        }, {
            name: 'Togo',
            code: 'TG'
        }, {
            name: 'Tokelau',
            code: 'TK'
        }, {
            name: 'Tonga',
            code: 'TO'
        }, {
            name: 'Trinidad and Tobago',
            code: 'TT'
        }, {
            name: 'Tunisia',
            code: 'TN'
        }, {
            name: 'Turkey',
            code: 'TR'
        }, {
            name: 'Turkmenistan',
            code: 'TM'
        }, {
            name: 'Turks and Caicos Islands',
            code: 'TC'
        }, {
            name: 'Tuvalu',
            code: 'TV'
        }, {
            name: 'Uganda',
            code: 'UG'
        }, {
            name: 'Ukraine',
            code: 'UA'
        }, {
            name: 'United Arab Emirates',
            code: 'AE'
        }, {
            name: 'United Kingdom',
            code: 'GB'
        }, {
            name: 'United States',
            code: 'US'
        }, {
            name: 'United States Minor Outlying Islands',
            code: 'UM'
        }, {
            name: 'Uruguay',
            code: 'UY'
        }, {
            name: 'Uzbekistan',
            code: 'UZ'
        }, {
            name: 'Vanuatu',
            code: 'VU'
        }, {
            name: 'Venezuela',
            code: 'VE'
        }, {
            name: 'Vietnam',
            code: 'VN'
        }, {
            name: 'Virgin Islands, British',
            code: 'VG'
        }, {
            name: 'Virgin Islands, U.S.',
            code: 'VI'
        }, {
            name: 'Wallis and Futuna',
            code: 'WF'
        }, {
            name: 'Western Sahara',
            code: 'EH'
        }, {
            name: 'Yemen',
            code: 'YE'
        }, {
            name: 'Zambia',
            code: 'ZM'
        }, {
            name: 'Zimbabwe',
            code: 'ZW'
        }
    ];
}]);;angular.module('MetronicApp').controller('UserController', ["$location", "$cookies", "$rootScope", "$stateParams", "$scope", "$http", "$timeout", "$window", function($location, $cookies, $rootScope, $stateParams, $scope, $http, $timeout,$window) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss",$rootScope.isAdminLogin)
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.departmentList = rootTools.employeeList;

    $scope.affiliateData = {};
    $scope.xyz = true;
    console.log("DashboardController called",$rootScope.isAdminLogin,$rootScope.role,"role")
    console.log("asdasdasds", $rootScope.createUserModuleAccess)
    if(!$rootScope.isAdminLogin){
        console.log('yes', $rootScope.role)
        $location.path('/login.html')
    }
    // console.log("=======", $rootScope.moduleAccess);
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;
    $scope.userData = {};
    $scope.userData.module = [];
    $scope.selectedList = {};
    var selected = [];

    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listUsers("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }



    $('input:checked').each(function() {
      console.log($(this).is(":checked"))
      selected.push($(this).attr('value'));
    });
    $scope.userData.module = selected.filter(function(n){ return n != undefined });
    $scope.userAccess = JSON.parse($cookies.get('poker_role'));
    // $scope.userAccess = JSON.parse($rootScope.poker_role);
    console.log(($scope.userAccess));
    console.log("===", $scope.userAccess.level);
    
    $scope.submit = function(){
        var selected = [];
        $('input:checked').each(function() {
          console.log($(this).is(":checked"))
          selected.push($(this).attr('value'));
        });
        var data = angular.copy($scope.userData);
        data.module = selected.filter(function(n){ return n != undefined });
        if(typeof $scope.userData.role == 'string'){
          data.role = JSON.parse($scope.userData.role);
        }
        // data.createdBy = $cookies.get('poker_userName');
        data.createdBy = $rootScope.poker_userName;

        console.log("userData== ", data);
        $http({
            method : "post",
            url : "/createUser",
            data:  data,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            if(res.data.success){
                swal("Success!", "User created successfully!");
                $scope.userData={};
                $scope.userForm.$setPristine();
                for(var i in $scope.selectedList){
                  $scope.selectedList[i] = false;
                }
                //$location.path('/listUsers')
            }else{
                console.log("userData== ", res);
                swal("Error!", res.data.info)
            }

        }, function myError(err) {
            console.log(err,"err")
                swal("Error!", "Getting error from server in login!");
        });
    }

    $scope.changeModule = function(check, module, module1, module2) {
     // if(check) {
        if(module2) {
          var checked = false;
          console.log(check, module2)
          module1.subModule.forEach(function(o) {
            if($scope.selectedList[o.code]) {
              checked = true;
            }
          })
          console.log(checked)
          $scope.selectedList[module1.code] = checked;
          // selectedList[module.code] = checked;
        }

        if(module1) {
          var checked = false;
          module.subModule.forEach(function(o) {
            if($scope.selectedList[o.code]) {
              checked = true;
            }
          })
          $scope.selectedList[module.code] = checked;
        }
        if(!module1 && !module2 && module.subModule) {
          module.subModule.forEach(function(o) {
            $scope.selectedList[o.code] = check;
            if(o.subModule) {
               o.subModule.forEach(function(SubO) {
                  $scope.selectedList[SubO.code] = check;
               });
            }
          })
        } else if(!module2 && module1 && module1.subModule) {
          module1.subModule.forEach(function(o) {
            $scope.selectedList[o.code] = check;
          })
        }
        
    // }
    }
    
    $scope.update = function(){
         var selected = [];
        $('input:checked').each(function() {
          console.log($(this).is(":checked"))
            selected.push($(this).attr('value'));
        });
        var data = angular.copy($scope.userData);
        data.module = selected.filter(function(n){ return n != undefined });
        if(typeof $scope.userData.role == 'string'){
          data.role = JSON.parse($scope.userData.role);
        }
        data.id = $stateParams.userId;
        console.log("userData== ", data);
        $http({
            method : "post",
            url : "/updateUserInfo",
            data:  data,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {
            if(res.data.success){
                swal("Success!", "User updated successfully!");
                $scope.affiliateData={};
                $location.path('/listUsers')
            }else{
                swal("Error!", res.data.info)
            }

        }, function myError(err) {
            console.log(err,"err")
                swal("Error!", "Getting error from server in login!");
        });
    }



    $scope.listUsers = function(id, skip, limit,cb){
      var data = {};
      if(id){
        data._id = id;
      }
      data.level = $scope.userAccess.level;
      data.skip = skip;
      data.limit = limit;
      if($scope.department){
        data.department = parseInt($scope.department);
      }
      if($scope.status){
        data.status = $scope.status;
      }
      if($scope.name){
        data.name = $scope.name;
      }
      if($scope.email){
        data.email = $scope.email;
      }
      
      $http({
         method : "post",
         url : "/listUser",
         data:  data,
         headers: {'Content-Type': 'application/json'}
     }).then(function mySucces(res) {
         
      if(res.data.success){
        console.log(res.data);
        $scope.dataList = res.data.result
        if(id){
          for(var i in res.data.result[0].module){
            $scope.selectedList[res.data.result[0].module[i]] = true;
          }
        }
        $scope.userData=res.data.result[0];
      }else{
        swal("Error!", res.data.info);
       }
       if(cb instanceof Function){
            cb();
          }
          }, function myError(err) {
            console.log(err,"err")
            swal("Error!", "Getting error from server in login");
        });

    }


    $scope.countUsers = function(id){
      var data = {};
      if(id){
        data._id = id;
      }
      data.level = $scope.userAccess.level;

      if($scope.department){
        data.department = parseInt($scope.department);
      }
      if($scope.status){
        data.status = $scope.status;
      }
      if($scope.name){
        data.name = $scope.name;
      }
      if($scope.email){
        data.email = $scope.email;
      }
      
      $http({
         method : "post",
         url : "/countUsers",
         data:  data,
         headers: {'Content-Type': 'application/json'}
     }).then(function mySucces(res) {
         
      if(res.data.success){
        $scope.totalPage = res.data.result;
        $scope.newPageList();
      }
      else{
        swal("Error!", res.data.info);
      }

        }, function myError(err) {
          console.log(err,"err")
          swal("Error!", "Getting error from server in login");
      });

    }

    $scope.searchFunction = function(){
      if(!$scope.status && !$scope.name && !$scope.email && !$scope.department){
        swal("Please provide at least one input.")
      }
      else{
        $scope.countUsers();
      }
    }

    $scope.reset = function(){
      $scope.status = "";
      $scope.name = "";
      $scope.email = "";
      $scope.department= "";
      $scope.countUsers();
    }


    $scope.editUser = function(){
      if($stateParams.userId){
        $scope.listUsers($stateParams.userId);
      }

    }

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};

          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }


    $scope.exportData = function (tableId) {
      $scope.listUsers("", 0, 0, function(){
        $window.scrollTo(0, 0);
        setTimeout(function() {
          location.href=Excel(tableId,'sheet_name');
        }, 500);
      });
    };


}]);



;angular.module('MetronicApp').controller('UserProfileController', ["$rootScope", "$scope", "$http", "$timeout", "$state", function($rootScope, $scope, $http, $timeout, $state) {
    $scope.$on('$viewContentLoaded', function() {   
        App.initAjax(); // initialize core components
        Layout.setAngularJsSidebarMenuActiveLink('set', $('#sidebar_menu_link_profile'), $state); // set profile link active in sidebar menu 
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageBodySolid = true;
    $rootScope.settings.layout.pageSidebarClosed = true;
}]); 
;angular.module('MetronicApp').controller('accountDetailsController', ["$location", "$rootScope", "$cookies", "$scope", "$http", "$timeout", function($location, $rootScope, $cookies, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    console.log("accountDetailsController called",$rootScope.isAdminLogin)
    if(!$rootScope.isAdminLogin){
    	console.log('yes')
    	$location.path('/login.html')
    }
    // set sidebar closed and body solid layout mode
   
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    $scope.findBalanceSheetDetails = function(){
      console.log("findBalanceSheetDetails function called in accountDetailsController");
      var data = {};
      data.userRole = JSON.parse($cookies.get('poker_role'));
      $http.post("/findBalanceSheet", data)
        .success(function(res){
          if(res.success){
            // $cookies.put('poker_token', res.authToken);
            console.log('res in findBalanceSheet in accountDetailsController is  - ',res)
            $scope.dataList = res.result;
            $scope.dataList.bonusOrRealChips = parseFloat($scope.dataList.bonus.toFixed(2));
            $scope.dataList.deposit = parseFloat($scope.dataList.deposit.toFixed(2));
            $scope.dataList.profit = parseFloat($scope.dataList.profit.toFixed(2));
            $scope.dataList.withdrawal = parseFloat($scope.dataList.withdrawal.toFixed(2));
            $scope.dataList.deposit = String($scope.dataList.deposit).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.dataList.bonusOrRealChips = String($scope.dataList.bonusOrRealChips).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.dataList.profit = String($scope.dataList.profit).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.dataList.withdrawal = String($scope.dataList.withdrawal).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            
            // if(parseInt($scope.dataList.bonusOrRealChips/1000) !=0){
            //   $scope.dataList.bonusOrRealChips = ($scope.dataList.bonusOrRealChips/1000).toFixed(2) + "K";
            // }
            // if(parseInt($scope.dataList.deposit/1000) !=0){
            //   $scope.dataList.deposit = ($scope.dataList.deposit/1000).toFixed(2) + "K";
            // }
            // if(parseInt($scope.dataList.profit/1000) !=0){
            //   $scope.dataList.profit = ($scope.dataList.profit/1000).toFixed(2) + "K";
            // }
            // if(parseInt($scope.dataList.withdrawal/1000) !=0){
            //   $scope.dataList.withdrawal = ($scope.dataList.withdrawal/1000).toFixed(2) + "K";
            // }
            
            $scope.key1 = "Bonus Chips Generated";
            $scope.key2 = "Total Magnet Chips";
            $scope.key3 = "Rake Earned";
            $scope.key4 = "Total Cashout";
            
          } else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    
    
      $scope.findBalanceSheetDetails();


}]);;angular.module('MetronicApp').controller('activityDetailsController', ["$location", "$rootScope", "$cookies", "$scope", "$http", "$timeout", function($location, $rootScope, $cookies, $scope, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });

    console.log("activityDetailsController called",$rootScope.isAdminLogin)
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }
    // set sidebar closed and body solid layout mode
   
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    $scope.setTodayRakeProfit = false;
    $scope.setWeekRakeProfit = false;
    $scope.setTodayChipsProfit = false;
    $scope.setWeekChipsProfit = false;

    $scope.findPlayerRakeYesterdayDetails = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findTopRakePlayersYesterday", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.playerRakeDetails = res.result.playersArray;
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findPlayerRakeYearDetails = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findTopRakePlayersYear", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.playerRakeDetails = res.result.playersArray;
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findTableRakeYesterdayDetails = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findTopRakeTablesYesterday", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.tableRakeYesterdayDetails = res.result;
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findAffiliateRakeYesterdayDetails = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findTopRakeAffiliatesYesterday", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.affiliateRakeDetails = res.result.affiliatesArray;
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findAffiliateRakeYearDetails = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findTopRakeAffiliatesYear", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.affiliateRakeDetails = res.result.affiliatesArray;
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findSubAffiliateRakeYearDetails = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findTopRakeSubAffiliatesYear", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.subAffiliateRakeDetails = res.result.affiliatesArray;
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findSubAffiliateRakeYesterdayDetails = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findTopRakeSubAffiliatesYesterday", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.subAffiliateRakeDetails = res.result.affiliatesArray;
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findTotalRakeYesterday = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findTotalRakeYesterday", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.totalRakeYesterday = res.result.sumOfRake;
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findPartialRakeGeneratedDay = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findPartialRakeGeneratedDay", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            if(res.result.partialRakeToday >= res.result.partialRakeYesterday){
              $scope.setTodayRakeProfit = true;
              $scope.percentRakeProfitToday = (res.result.partialRakeToday - res.result.partialRakeYesterday)*100/res.result.partialRakeYesterday;
            }
            else{
              $scope.setTodayRakeProfit = false;
              $scope.percentRakeProfitToday = (res.result.partialRakeYesterday - res.result.partialRakeToday)*100/res.result.partialRakeYesterday;
            }
            $scope.percentRakeProfitToday = $scope.percentRakeProfitToday.toFixed(2);
            $scope.partialRakeToday = res.result.partialRakeToday;
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findTotalRakeLastWeek = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findTotalRakeLastWeek", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.totalRakeLastWeek = res.result.sumOfRake;
            $scope.totalRakeLastWeek = String($scope.totalRakeLastWeek).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findPartialRakeGeneratedWeek = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findPartialRakeGenerated", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            if(res.result.partialRakeThisWeek >= res.result.partialRakeLastWeek){
              $scope.setWeekRakeProfit = true;
              $scope.percentRakeProfitThisWeek = (res.result.partialRakeThisWeek - res.result.partialRakeLastWeek)*100/res.result.partialRakeLastWeek;
            }
            else{
              $scope.setWeekRakeProfit = false;
              $scope.percentRakeProfitThisWeek = (res.result.partialRakeLastWeek - res.result.partialRakeThisWeek)*100/res.result.partialRakeLastWeek;
            }
            $scope.percentRakeProfitThisWeek = $scope.percentRakeProfitThisWeek.toFixed(2);
            $scope.partialRakeThisWeek = res.result.partialRakeThisWeek;
            $scope.averageRakeThisWeek = res.result.averageRakeThisWeek;
            $scope.averageRakeThisMonth = res.result.averageRakeThisMonth;
            $scope.averageRakeThisYear = res.result.averageRakeThisYear;
            $scope.partialRakeThisWeek = String($scope.partialRakeThisWeek).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.averageRakeThisWeek = String($scope.averageRakeThisWeek).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.averageRakeThisMonth = String($scope.averageRakeThisMonth).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.averageRakeThisYear = String($scope.averageRakeThisYear).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.partialRakeLastWeek = String($scope.partialRakeLastWeek).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");

          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }


    $scope.findChipsAddedData = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findTotalChipsAdded", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.totalChipsYesterday = 0;
            $scope.totalChipsLastWeek = 0;
            $scope.totalChipsPartialToday = 0;
            $scope.totalChipsPartialThisWeek = 0;
            $scope.totalChipsPartialYesterday = 0;
            $scope.totalChipsPartialLastWeek = 0;
            for(var i=0; i<res.result.totalChipsAddedYesterday.length; i++){
              $scope.totalChipsYesterday = $scope.totalChipsYesterday + res.result.totalChipsAddedYesterday[i].amount;
            }
            for(var i=0; i<res.result.totalChipsAddedLastWeek.length; i++){
              $scope.totalChipsLastWeek = $scope.totalChipsLastWeek + res.result.totalChipsAddedLastWeek[i].amount;
            }
            for(var i=0; i<res.result.totalChipsAddedPartialToday.length; i++){
              $scope.totalChipsPartialToday = $scope.totalChipsPartialToday + res.result.totalChipsAddedPartialToday[i].amount;
            }
            for(var i=0; i<res.result.totalChipsAddedPartialThisWeek.length; i++){
              $scope.totalChipsPartialThisWeek = $scope.totalChipsPartialThisWeek + res.result.totalChipsAddedPartialThisWeek[i].amount;
            }
            



            for(var i=0; i<res.result.totalChipsAddedPartialYesterday.length; i++){
              $scope.totalChipsPartialYesterday = $scope.totalChipsPartialYesterday + res.result.totalChipsAddedPartialYesterday[i].amount;
            }
            for(var i=0; i<res.result.totalChipsAddedPartialLastWeek.length; i++){
              $scope.totalChipsPartialLastWeek = $scope.totalChipsPartialLastWeek + res.result.totalChipsAddedPartialLastWeek[i].amount;
            }


            if($scope.totalChipsPartialToday >= $scope.totalChipsPartialYesterday){
              $scope.setTodayChipsProfit = true;
              $scope.percentChipsProfitToday = ($scope.totalChipsPartialToday - $scope.totalChipsPartialYesterday)*100/$scope.totalChipsPartialYesterday;
            }
            else{
              $scope.setTodayChipsProfit = false;
              $scope.percentChipsProfitToday = ($scope.totalChipsPartialYesterday - $scope.totalChipsPartialToday)*100/$scope.totalChipsPartialYesterday;
            }
            $scope.percentChipsProfitToday = $scope.percentChipsProfitToday.toFixed(2);



            if($scope.totalChipsPartialThisWeek >= $scope.totalChipsPartialLastWeek){
              $scope.setWeekChipsProfit = true;
              $scope.percentChipsProfitThisWeek = ($scope.totalChipsPartialThisWeek - $scope.totalChipsPartialLastWeek)*100/$scope.totalChipsPartialLastWeek;
            }
            else{
              $scope.setWeekChipsProfit = false;
              $scope.percentChipsProfitThisWeek = ($scope.totalChipsPartialLastWeek - $scope.totalChipsPartialThisWeek)*100/$scope.totalChipsPartialLastWeek;
            }
            $scope.percentChipsProfitThisWeek = $scope.percentChipsProfitThisWeek.toFixed(2);
            // $scope.partialRakeThisWeek = res.result.partialRakeThisWeek;
            $scope.totalChipsPartialThisWeek = String($scope.totalChipsPartialThisWeek).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.totalChipsLastWeek = String($scope.totalChipsLastWeek).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.totalChipsPartialToday = String($scope.totalChipsPartialToday).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
            $scope.totalChipsYesterday = String($scope.totalChipsYesterday).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
          } 
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findNewPlayersJoinData = function(){
      console.log("function called in activityDetailsController");
       var data ={};
      // data.keyForRakeModules = true;
      $http.post("/findNewPlayersJoinData", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            $scope.newPlayersToday = res.result.newPlayersToday;
            $scope.newPlayersThisMonth = res.result.newPlayersThisMonth;
            $scope.totalPlayersAllTime = res.result.totalPlayersAllTime;
            $scope.newPlayersThisYear = res.result.newPlayersThisYear;
          }
          
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    $scope.findPlayerLoginData = function(){
      console.log("function called in activityDetailsController");
      var data ={};
      data.keyForRakeModules = true;
      $http.post("/findPlayerLoginData", data)
        .success(function(res){
          if(res.success){
            console.log('res in findBalanceSheet in activityDetailsController is  - ',res)
            if(res.result.totalPlayersLoggedInPartialToday >= res.result.totalPlayersLoggedInPartialYesterday){
              $scope.setTodayPlayersProfit = true;
              $scope.percentPlayersJoinToday = (res.result.totalPlayersLoggedInPartialToday - res.result.totalPlayersLoggedInPartialYesterday)*100/res.result.totalPlayersLoggedInPartialYesterday;
            }
            else{
              $scope.setTodayPlayersProfit = false;
              $scope.percentPlayersJoinToday = (res.result.totalPlayersLoggedInPartialYesterday - res.result.totalPlayersLoggedInPartialToday)*100/res.result.totalPlayersLoggedInPartialYesterday;
            }
            $scope.percentPlayersJoinToday = $scope.percentPlayersJoinToday.toFixed(2);
            $scope.totalPlayersLoggedInPartialToday = res.result.totalPlayersLoggedInPartialToday;

            $scope.onlinePlayers = res.result.onlinePlayers;
            $scope.totalPlayersLoggedInPartialToday = res.result.totalPlayersLoggedInPartialToday;
            $scope.totalPlayersLoggedInYesterday = res.result.totalPlayersLoggedInYesterday;
            
          }
          
          else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });
    }

    
    $scope.findPlayerRakeYesterdayDetails();
    $scope.findTableRakeYesterdayDetails();
    $scope.findAffiliateRakeYesterdayDetails();
    $scope.findSubAffiliateRakeYesterdayDetails();
    // $scope.findPlayerRakeYearDetails();
    // $scope.findAffiliateRakeYearDetails();
    // $scope.findSubAffiliateRakeYearDetails();
    $scope.findTotalRakeYesterday();
    $scope.findPartialRakeGeneratedDay();
    $scope.findTotalRakeLastWeek();
    $scope.findPartialRakeGeneratedWeek();
    $scope.findChipsAddedData();
    $scope.findNewPlayersJoinData();
    setTimeout(function(){
      $scope.findPlayerLoginData();

    }, 10)


}]);;angular.module('MetronicApp').controller('ApprovePANCardCtrl', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) {
  $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
      });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.reasonOfRejection = "";

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    
    $scope.newPageList = function () {
        $scope.listTables(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
    }

    //get count for data for page limit
    $scope.countData = function(){
  
      $http.get("/getPANCardCount")
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
            swal("Missing Keys");
          }
        }).error(function(err){
        swal("Error!", "Getting error from server in showing history",err.stack);
      });  
    }  
    
    //get list of pan card
    $scope.listTables = function(skipData,limitData){
      var data = {};
      data.skip = skipData;
      data.limit = limitData;

      $http.post("/getPANCardList",data)
        .success(function(res){
        if(res.success){
            // console.log(JSON.stringify(res.result));
             $scope.dataList = res.result;
          } else{
            swal("Error!", "Missing Keys");
          }
        }).error(function(err){
        swal("Error!", "Getting error from server in showing history",err.stack);
        clearData();
      });  
    }   

  // this will get count to show data........
  $scope.countData();

  //_____________________ actions start __________________
  
  // approve the PAN Card
  $scope.approvePANCard = function(data){
    var dataId = data._id;
    delete data._id;
    data.verifiedAt = Number(new Date());
    $http.post("/approvePANCard",data)
     .success(function(res){
     if(res.success){
        console.log(JSON.stringify(res.result));
        swal("Success!", "PAN card approved successfully!");
        removePANOnApprovel(dataId);
        updateUserProfile(data.playerId);
       } else{
        swal("Error!", res.info);
       }
     }).error(function(err){     
        swal("Error!", err.stack);
   });  
  }


  // reject pan card approvel
  $scope.rejectPANCard = function(data){
     
     swal({
        title: "Reason for rejection?",
        text: '<div><h4><input type="radio" name="rad" value="PAN card does not exist." id="Radio0"  data-waschecked="true"><label for="Radio0">PAN card does not exist.</label><br><input type="radio" name="rad" id="Radio1" value="Name on PAN card does not match."  data-waschecked="true"><label for="Radio1"> Name on PAN card does not match.</label></h4></div>',
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Proceed",
        closeOnConfirm: false,
        // inputType : "text",
        html: true,
     }, function(){
        var radioValue = $("input[name='rad']:checked").val();
        console.log(radioValue);
        //this will process Reject after prompt
        // processsReject(data,$scope.reasonOfRejection);
        processsReject(data,radioValue);
     });

    // $(function(){
    //   $('input[name="rad"]').click(function(){
    //       var $radio = $(this);
    //       $scope.reasonOfRejection = this.value;
    //       // swal(this.value);
    //       if ($radio.data('waschecked') == true)
    //       {
    //         $radio.prop('checked', false);
    //         $radio.data('waschecked', false);
    //       }
    //       else
    //         $radio.data('waschecked', true);
    //         $radio.siblings('input[name="rad"]').data('waschecked', false);
    //   });
    // });
  }
 // get value of radio button on reject cash
 // $(function(){
 //    $('input[name="rad"]').click(function(){
 //        var $radio = $(this);
 //        $scope.reasonOfRejection = this.value;
 //        // swal(this.value);
 //        if ($radio.data('waschecked') == true)
 //        {
 //          $radio.prop('checked', false);
 //          $radio.data('waschecked', false);
 //        }
 //        else
 //          $radio.data('waschecked', true);
 //          $radio.siblings('input[name="rad"]').data('waschecked', false);
 //    });
 //  });

  // reject pan card
  function processsReject(data,reason){
    if(!reason){
      swal("Error", "Please select reason of rejection!");
      return false;
    }
    console.log("the Reason: ",data,reason);
    var dataId = data._id;
    delete data._id;
    $scope.reasonOfRejection = reason;
    data.reasonOfRejection = reason;;
    data.verifiedAt = Number(new Date());
    $http.post("/rejectPANCard",data)
     .success(function(res){
     if(res.success){
        console.log(JSON.stringify(res.result));
        swal("PAN card rejected.");
        removePANOnApprovel(dataId);
        updateUserProfile(data.playerId);
       } else{
        swal("Error!", res.info);
       }
     }).error(function(err){     
        swal("Error!", err.stack);
   });  
  }

  // internal function to remove pan card doc on approvel from approvePANCard
  function removePANOnApprovel(dataId){
    console.log("***********************",dataId);
    var data = {};
    data.id = dataId;
    $http.post("/removePANOnApprovel",data)
     .success(function(res){
     if(res.success){
        console.log(JSON.stringify(res.result));
        $scope.newPageList();
       } else{
        swal("Error!", res.info);
       }
     }).error(function(err){     
        swal("Error!", err.stack);
   });  
  }

  //update user profile
  function updateUserProfile(playerId){

    var updateObj = {};
    updateObj.playerId = playerId;
    updateObj.panNumberVerified = true;
console.log("@#@#@#@#@#@##",$scope.reasonOfRejection);

    if($scope.reasonOfRejection.length > 0){
       if($scope.reasonOfRejection === "PAN card does not exist." ){
          updateObj.panNumberVerifiedFailed = true;
       }else{
          updateObj.panNumberVerifiedFailed = true;
          updateObj.panNumberNameVerifiedFailed = true;
       }

       $scope.reasonOfRejection = "";
    }
    $http.post("/updateUserPANinfo",updateObj)
     .success(function(res){
     if(res.success){
        console.log(JSON.stringify(res.result));
       } else{
        swal("Error!", res.info);
       }
     }).error(function(err){     
        swal("Error!", err.stack);
    });  

  }

  //_____________________ actions end __________________

}]);


;angular.module('MetronicApp').controller('ApproveScratchCardCtrl', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
  $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
      });


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }


    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    
    $scope.newPageList = function () {
      $scope.listTables(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }


    $scope.data = {};
    $scope.turnTimesList = rootTools.turnTimesList;


    // $scope.init = function(){
    //   $cookies.remove('poker_token');
    //   $cookies.remove('poker_name');
    //   $cookies.remove('poker_role');
    //   $cookies.remove('poker_userName');
    //   $cookies.remove('poker_email');
    //   $cookies.remove('poker_parent');


    // }

    // $scope.countData = function(){

    //   $http.get("/getScratchCardListCount")
    //     .success(function(res){
    //     if(res.success){
    //          $scope.totalPage = res.result;
    //          $scope.newPageList();
    //       } else{
    //         // swal("Missing Keys");
    //       }
    //     }).error(function(err){
    //     swal(err);
    //     swal("Getting error from server in showing rake rules",err.stack);
    //   });  
    // }

    $scope.countData = function(skipData,limitData){

      console.log("inside list of countData---------");
      var data ={};
      if($scope.name){
        data.createdBy = $scope.name;
      }
      $http.post("/getScratchCardListCount",data)
        .success(function(res){
        if(res.success){
          $scope.totalPage = res.result;
          if(res.result == 0){
            swal("No data found")
          }
          $scope.newPageList();
            
          }
        else{
            swal("No data found")
            // swal("Missing Keys");
          }
        }).error(function(err){
            swal("Error!", err);
      }); 
    }    

    
    $scope.listTables = function(skipData,limitData){

      console.log("inside list of getScratchCardList---------");
      var data ={};
      data.skip = skipData;
      data.limit = limitData;
      if($scope.name){
        data.createdBy = $scope.name;
      }
      
      $http.post("/getScratchCardList",data)
        .success(function(res){
        if(res.success){
            console.log(JSON.stringify(res.result));
            for(var i = 0 ; i<res.result.length; i++){
              res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
            }
            $scope.dataList  = res.result;
            
          } else{
            // swal("Missing Keys");
          }
        }).error(function(err){
            swal("Error!", err.stack);
      }); 
    }    

    // approve scratch card
  $scope.approveScratchCard = function(index,data){
   console.log("approveScratchCard called");
   // data.issuedBy = { name: $cookies.get('poker_name'), userName: $cookies.get('poker_userName'), role: JSON.parse($cookies.get('poker_role')), id: $cookies.get('poker_email')};
   data.issuedBy = { name: $rootScope.poker_name, userName: $rootScope.poker_userName, role: JSON.parse($rootScope.poker_role), id: $rootScope.poker_email};
   if($scope.isDisabled){
    swal({title: "Error!", text: "Already generating Scratch cards!", showConfirmButton: false});
    return ;
   }
   $scope.isDisabled = true;
    swal({title: "Wait!", text: "Generating Scratch cards!", showConfirmButton: false});
    setTimeout(function(){
     $http.post("/approveScratchCard",data)
       .success(function(res){
       if(res.success){
          console.log(JSON.stringify(res.result));
          swal({title: "Success!", text: "Scratch cards generated successfully!", showConfirmButton: true});
          $scope.isDisabled = false;
          $scope.listTables(0, 20);
         } else{
            if(!!res.code && res.code == 500){
               $scope.isDisabled = false;
            }
            swal("Error!", res.info);
         }
       }).error(function(err){
            swal("Error!", err.stack);
     });     

    }, 500)

  }

    // reject scratch card
  $scope.rejectScratchCard = function(index, data){
    console.log("line 77== ", data);
    // data.issuedBy = { name: $cookies.get('poker_name'), userName: $cookies.get('poker_userName'), role: $cookies.get('poker_role'), id: $cookies.get('poker_email')};
    data.issuedBy = { name: $rootScope.poker_name, userName: $rootScope.poker_userName, role: JSON.parse($rootScope.poker_role), id: $rootScope.poker_email};
    swal({
      title: "Reason for rejection?",
      text: '<div><h4><input type="radio" name="rad" value="Exceeding credit limit" id="Radio0"  data-waschecked="true"><label for="Radio0">Exceeding credit limit</label><br><input type="radio" name="rad" id="Radio1" value="Exceeding legal limit"  data-waschecked="true"><label for="Radio1"> Exceeding legal limit</label><br><input type="radio" name="rad" id="Radio2" value="Scratch Card Expired"  data-waschecked="true"><label for="Radio2"> Scratch Card Expired </label></h4></div>',
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Proceed",
      closeOnConfirm: false,
      inputType : "text",
      html: true,
    }, function(){
      console.log("in reject scratchCard==");

      var radioValue = $("input[name='rad']:checked").val();
      console.log(radioValue);
      // data.reasonOfRejection = $scope.reasonOfRejection;
      data.reasonOfRejection = radioValue;
      console.log("data == ", JSON.stringify(data),"------------", $scope.reasonOfRejection);
      if(data.reasonOfRejection){
        $http.post("/rejectScratchCard",data)
       .success(function(res){
       if(res.success){
          console.log(JSON.stringify(res.result));
          swal("Success!",
               "The scratch card was rejected!",
               "success");
          // $location.path('/scratchCard/approve');
          $scope.listTables(0, 20);

         } else{
              swal("Error!", res.info);
         }
       }).error(function(err){
            swal("Error!", err.stack);
     });   
        
        
      }

    });

//     $(function(){
//     $('input[name="rad"]').click(function(){
//         var $radio = $(this);
//         $scope.reasonOfRejection = this.value;
//         console.log(this.value);
//         // if this was previously checked
//         if ($radio.data('waschecked') == true)
//         {
//             $radio.prop('checked', false);
//             $radio.data('waschecked', false);
//         }
//         else
//             $radio.data('waschecked', true);

//         // remove was checked from other radios
//         $radio.siblings('input[name="rad"]').data('waschecked', false);
//     });
// });

    // swal(index);
  }


  // $scope.rejectScratchCard = function(index, data){
  //   console.log("line 77== ", data);
  //   data.issuedBy = { name: $cookies.get('poker_name'), role: $cookies.get('poker_role'), id: $cookies.get('poker_email')};
  //   $http.post("/rejectScratchCard",data)
  //    .success(function(res){
  //    if(res.success){
  //       console.log(JSON.stringify(res.result));
  //       swal('Success!');
  //       // $location.path('/scratchCard/approve');
  //       $scope.listTables();

  //      } else{
  //        swal(res.info);
  //      }
  //    }).error(function(err){
  //    // swal(err);
  //    swal("Getting error from server",err.stack);
  //  });   
  //   // swal(index);
  // }

    //this will send mail 
  function sendMail(data){
    swal("send mail");
    console.log(JSON.stringify(data));
  }

  function updateScratchCardStatusinDB(){
    
  }

  //  for loading data while loading controller
  // if($stateParams.tableId){
  //   console.log("stateParams------------", $stateParams.tableId);
  //   $scope.listTables($stateParams.tableId);
  // }else{
    // $scope.listTables();
    $scope.countData();
  // }

}]);


;angular.module('MetronicApp').controller('bonusHistoryController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside bonusHistoryController @@@@@@@@@");
    //var showList = true, pagelimit = 5, pagelenth, currentpage = 1, previouspage;
    //$scope.pageSize = 5;
    //Set currentpage for pagintion
    //$scope.currentPage = 1;
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }
    $scope.init = function(){
        showList = true;
        var data = {};
        $http.post("/bonusHistory", data)
          .success(function(res){
            console.log("The result in bonusHistoryController", res);
            $scope.listBonus = res.result;
            console.log("######### res.result", res.result);
          }).error(function(err){
            swal("Error!", "Getting error from server in showing Bonus Deposit");
            // swal("Getting error from server in showing Bonus Deposit");
          });
    }
    $scope.init();
    
}]);;angular.module('MetronicApp').controller('cashoutDirectAffSubAffController', ["$location", "$cookies", "$rootScope", "$scope", "$http", "$stateParams", "$filter", function($location, $cookies, $rootScope, $scope, $http, $stateParams, $filter) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    console.log("Controller Loaded");

    if(!$rootScope.isAdminLogin){
        console.log('yes', $rootScope.role)
        $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    
    $scope.newPageList = function () {
        $scope.init(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
    }
   
    var user = {
        // name     : $cookies.get('poker_name'),
        name     : $rootScope.poker_name,
        // userName : $cookies.get('poker_userName'),
        userName : $rootScope.poker_userName,
        // role     : JSON.parse($cookies.get('poker_role')),
        role     : JSON.parse($rootScope.poker_role),
        // id       : $cookies.get('poker_email'),
        id       : $rootScope.poker_email,
        // mobile   : $cookies.get('poker_loggedinUserMobileNum'),
        mobile   : $rootScope.poker_loggedinUserMobileNum,
    };

    console.log("*^*^*^*^*^*^*^*^*^*^*^*^*^*",JSON.stringify(user));

    $scope.approveAccess = false;

    // if(JSON.parse($cookies.get('poker_role')).level == 0){
    if(JSON.parse($rootScope.poker_role).level == 0){
      $scope.approveAccess = true;
    }
   

    $scope.countData = function(){
      // console.log("$$$$$$$$$$$$$$$$$$",$cookies.get('poker_userName'));
      console.log("$$$$$$$$$$$$$$$$$$",$rootScope.poker_userName);
      console.log("user details are ",user);
      $http.post("/countDataForCashout",user)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
            swal("No data found for loggedIn user");
          }
        }).error(function(err){
        swal("Getting error from server in showing transaction history",err.stack);
      });  
    }

    $scope.init = function(skipData,limitData){
        showList = true;
        var data = {};
        // console.log("$$$$$$$$$$$$$$$$$$4",$cookies.get('poker_userName'));
        console.log("$$$$$$$$$$$$$$$$$$4",$rootScope.poker_userName);
        user.skip = skipData;
        user.limit = limitData;
        $http.post("/findDataForCashout", user)
          .success(function(res){
            console.log("The result in cashoutRequestDirectController", res.result);
            $scope.dataList = res.result.reverse();
          }).error(function(err){
            swal("Error!", "Getting error from server in showing transaction History");
            // swal("Getting error from server in showing Bonus Deposit");
          });
    }

   

        
    // approve cash out 
    $scope.approveCashOut = function(index,approveReqData){
        approveReqData.createdAt = Number(new Date());
        var data = {};
        data.tempReqId = approveReqData._id;
        console.log("The tempReqId is ------------------>>>>",data.tempReqId);
        data.affiliateId = approveReqData.affilateId;
        data.amount = approveReqData.amount;
        $http({
            method : "post",
            url : "/approveDataForCashout",
            data:  data,
            headers: {'Content-Type': 'application/json'}
        }).then(function mySucces(res) {                  
            if(res.data.success){
              swal("Success!", "Cashout request raised successfully!");
             // $location.path('/cashoutDirect.html')
              $scope.countData();  
              
            }else{
              swal(res.data.info);
            }          
        }, function myError(err) {          
            swal("Error!", "Getting error from server while requesting!");      
        });     
    }

    

    //reject cashout request
    $scope.rejectCashOut = function(index,rejectReqData){           
        var data = {};
        data.tempReqId = rejectReqData._id;;
        data.createdAt = Number(new Date());
        data.amount = rejectReqData.amount;
        data.playerId = rejectReqData.playerId;
        console.log("data---------------"+JSON.stringify(data));

        $http({
           method : "post",
           url : "/rejectDataForCashout",
           data:  data,
           headers: {'Content-Type': 'application/json'}
         }).then(function mySucces(res) {
           console.log(res);
            if(res.data.success){
              // console.log(res.data);
              swal("Success!", "Cashout request deleted sucessfully!");
               //$location.path('/cashoutDirect.html')
              $scope.countData();  
            }else{
              swal("Error!", res.data.info);
              removeRequestOnAction(tempReqId,index);
            }

          }, function myError(err) {
          console.log(err,"err");
              swal("Error!", "Getting error from server in login");
        });
    }

    $scope.countData();    

}]);




;angular.module('MetronicApp').controller('cashoutHistoryCtrl', ["$location", "$cookies", "$rootScope", "$scope", "$http", "$stateParams", "$filter", function($location, $cookies, $rootScope, $scope, $http, $stateParams, $filter) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    // console.log("yessss",$rootScope.isAdminLogin)
    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;

    if(!$rootScope.isAdminLogin){
        console.log('yes', $rootScope.role)
        $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    
    $scope.newPageList = function () {
      $scope.listCashOutHistory(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
    }

    var affiliate = {
        // name     : $cookies.get('poker_name'),
        name     : $rootScope.poker_name,
        // userName : $cookies.get('poker_userName'),
        userName : $rootScope.poker_userName,
        // role     : JSON.parse($cookies.get('poker_role')),
        role     : JSON.parse($rootScope.poker_role),
        // id       : $cookies.get('poker_email'),
        id       : $rootScope.poker_email,
        // mobile   : $cookies.get('poker_loggedinUserMobileNum')
        mobile   : $rootScope.poker_loggedinUserMobileNum
    };

    console.log("*^*^*^*^*^*^*^*^*^*^*^*^*^*",JSON.stringify(affiliate));

    $scope.getCashoutHistoryCount = function(){
      var data = {};
      if(affiliate.role.level == 0 || affiliate.role.level == -1){
        data.userName = affiliate.userName;
      }
      if($scope.referenceNo){
        data.referenceNo = $scope.referenceNo;
      }
      
      console.log("called ", data)  
      $http({
           method : "post",
           url : "/getCashoutHistoryCount",
           data:  data,
           headers: {'Content-Type': 'application/json'}
       }).then(function mySucces(res) {
           
            console.log("line 63 ", res)
          if(res.data.success){
            $scope.totalPage = res.data.result;                   
            $scope.newPageList();   
          }
          else{
            swal("Error!", res.data.info);
          }

        }, function myError(err) {
          console.log(err,"err")
          swal("Error!", "Getting error from server");
      });
    }

    //______________ Get List Pending Req _____________
    $scope.listCashOutHistory = function(dataSkip, dataLimit){
      var data = {};
      if(affiliate.role.level == 0 || affiliate.role.level == -1){
        data.userName = affiliate.userName;
      }
      if($scope.referenceNo){
        data.referenceNo = $scope.referenceNo;
      }
      data.skip = dataSkip;
      data.limit = dataLimit;
      console.log(data);
      $http({
           method : "post",
           url : "/listCashOutHistory",
           data:  data,
           headers: {'Content-Type': 'application/json'}
       }).then(function mySucces(res) {
           
          if(res.data.success){
            console.log(res.data);
            for(var i = 0 ; i<res.data.result.length; i++){
              res.data.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
            }
            $scope.dataList = res.data.result;    
          }else{
            swal("Error!", res.data.info);
          }

        }, function myError(err) {
          console.log(err,"err")
              swal("Error!", "Getting error from server in login");
      });

    }

    $scope.resetForm = function(){
      $scope.referenceNo = "";
      $scope.getCashoutHistoryCount();
    } 
}]);




;angular.module('MetronicApp').controller('cashoutSubAffiliateController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    console.log("Inside cashoutSubAffiliateController  @@@@@@@@@");
    var data = {};
    
     if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }
    $scope.formdata = {};
    //transfer fund to player
    
    var getSubAffiliateAccountData = function(){
      // data.userName = $cookies.get('poker_userName');
      data.userName = $rootScope.poker_userName;
      $http.post("/listAffiliate", data)
        .success(function(res){
          if(res.success){
            $scope.dataList = {};
            $scope.dataList.bonusOrRealChips = parseInt(res.result[0].realChips);
            $scope.dataList.profit = parseInt(res.result[0].profit);
            
          } else{
            swal("Error!", res.info);
          }
          
        }).error(function(err){
          swal("Error!", "Getting error from server");
        });

    }



    // $scope.toggleChips = $cookies.get('poker_role');
    $scope.toggleChips = $rootScope.poker_role;
    $scope.init = function(){
      console.log("init function of cashoutSubAffiliateController called");
      console.log($scope.formdata.transferTo);
      console.log($scope.formdata.amount);
      // console.log($cookies.get('poker_userName'));
      console.log($rootScope.poker_userName);
      console.log($scope.formdata.transactionType);
      console.log("the value inside cookies of cashoutSubAffiliateController is",$cookies.getAll());
      data.amount = $scope.formdata.amount;
      data.transactionType = $scope.formdata.transactionType;
      // data.role        = JSON.parse($cookies.get('poker_role'));
      data.role        = JSON.parse($rootScope.poker_role);
      // data.loggedInUser  = $cookies.get('poker_userName');
      data.loggedInUser  = $rootScope.poker_userName;
      // data.loggedInUserEmail = $cookies.get('poker_email');
      data.loggedInUserEmail = $rootScope.poker_email;
      // data.name = $cookies.get('poker_name');
      data.name = $rootScope.poker_name;
      // data.loggedInUserMobile = $cookies.get('poker_loggedinUserMobileNum');
      data.loggedInUserMobile = $rootScope.poker_loggedinUserMobileNum;
      // var role = JSON.parse($cookies.get('poker_role'));
      var role = JSON.parse($rootScope.poker_role);
      console.log("the role is ",JSON.stringify(role));
      console.log("the data is ",JSON.stringify(data));
      if(!!$scope.formdata.amount && !!$scope.formdata.transactionType ){
          console.log("All fields are present");
            swal({
                  title: "Are you sure you want to request the amount?",
                  text: '',
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Proceed",
                  closeOnConfirm: false,
                  inputType : "text",
                  html: true,
            }, function(){
                  $http.post("/cashoutSubAffiliate", data)
                  .success(function(res){
                    if(res.success){
                      swal("Request Made Successfully");
                      console.log(res);
                      $scope.formdata = {};
                      $scope.generateBonusForm.$setPristine();
                      getSubAffiliateAccountData();
                      //$location.path('/transferHistoryPlayer');
                    }else{
                      swal(res);
                    }
                        
                        //$cookies.put('poker_token', res.authToken);
            }).error(function(err){
              // swal(err);
                swal("Getting error from server in subAffiliate Cashout Request ");
            });
            
            });        

    }
      else{
        console.log("Some fields are missing");
        swal("Some Fields are missing");
        return;
      }
      
    }


   
    getSubAffiliateAccountData();

  

  }]);;angular.module('MetronicApp').controller('createRakeRuleController', ["$scope", "$http", "$rootScope", "$stateParams", "$cookies", "$location", function($scope, $http, $rootScope,  $stateParams,$cookies, $location) {
    $scope.data = {};
    $scope.data.list = [];
    var token = {};

    $scope.init = function(){
        var temp = {
            "minStake" : 0,
            "maxStake" : 0,
            "rakePercent": 0,
            "capTwo": 0,
            "capThreeFour": 0,
            "capMoreThanFive": 0
        }
        $scope.data.list.push(temp);
         // token = $cookies.get('poker_token');
         token = $rootScope.poker_token;
    }

/*    $scope.add = function(){
    	var temp = {
    		"minStake" : 0,
    		"maxStake" : 0,
    		"rakePercent": 0,
    		"capLessThanThree": 0,
            "capMoreThanThree": 0
    	}
    	$scope.data.list.push(temp);

    }*/

    // $scope.del = function(index){
    // not used - as of 30 Nov. - sushiljain
    // 	$scope.data.list.splice(index, 1);
    // }

   /* $scope.init = function(){

    }*/

    $scope.save = function(formValid){
      // if(formValid){
      //   console.log("validation passed",formValid);
      // } else {
      //   console.log("validation failed",formValid);
      //   return;
      // }
        console.log("the data inside save function of createRakeRule is ",JSON.stringify(data));

    	var data = angular.copy($scope.data);
        
        // list2[0] = data.list.0
        console.log("the data inside save function of createRakeRule is ",JSON.stringify(data));
        if(data.list.length){
            if(validateRake(data.list, data.list.length)){
//            	data.authToken = token;
            	$http.post("/createRakeRule", data)
                .success(function(res){
                        swal("Successfull !!");
                        $location.path('/listRakeRule');
              	      	$cookies.put('poker_token', res.authToken);
                }).error(function(err){
                    // swal(err);
                    swal("Getting error from server in creating rake rule");
                });
            } else{
                swal("Rake can't be more than 5%");
            }
        } else{
            swal("Enter some rule");
        }
    }

    function validateRake(list, length){
        for(var i=0; i<length; i++){
            if(list[i].rakePercent > 5 || list[i].capLessThanThree > 5 || list[i].capMoreThanThree > 5){
                return false
            }
        }
        return true;
    }

    $scope.cancel = function(){
        $location.path('/listrakerules');
    }

    $scope.init();

}]);
;angular.module('MetronicApp').controller('customerSupportController', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside customerSupportController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject = {};

    $scope.init = function(){
        showList = true;
        var data = {};
        // console.log("$$$$$$$$$$$$$$$$$$4",$cookies.get('poker_userName'));
        console.log("$$$$$$$$$$$$$$$$$$4",$rootScope.poker_userName);
        //data.createdBy = $cookies.get('poker_email');
        //data.profile = $cookies.get('poker_role').toUpperCase();
        // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
        //    $scope.queryObject.loginId = $cookies.get('poker_userName');
        // }
        // data = $scope.queryObject;

        if(!$scope.userNameFilter && !$scope.emailIdFilter && !$scope.mobileNumberFilter){
          swal('Please provide atleast one filter!');
          $scope.listPlayer = [];
          return;
        }

        if($scope.userNameFilter){
          data.userName = $scope.userNameFilter;  
        }
        if($scope.emailIdFilter){
          data.email = $scope.emailIdFilter;  
        }
        if($scope.mobileNumberFilter){
          data.mobileNumber = $scope.mobileNumberFilter;  
        }


        $http.post("/personalDetailsPlayer", data)
          .success(function(res){
            console.log("The result in personalDetailsPlayer", res);
            $scope.listPlayer = res.userData;
            if(res.userData.length==0){
              $scope.listPlayer = [];
              swal("Please enter valid player details");
            }
            console.log("the value of listplayer is ",$scope.listPlayer);
          }).error(function(err){
            swal("Error!", "Getting error from server in showing personalDetailsPlayer");
            // swal("Getting error from server in showing Bonus Deposit");
          });
    }

    $scope.searchTransactionHistory = function(){
        showList = true;
        var data = {};
        // console.log("$$$$ in searchTransactionHistory",$cookies.get('poker_userName'));
        console.log("$$$$ in searchTransactionHistory",$rootScope.poker_userName);
        //data.createdBy = $cookies.get('poker_email');
        //data.profile = $cookies.get('poker_role').toUpperCase();
        // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
        //    $scope.queryObject.loginId = $cookies.get('poker_userName');
        // }
        data = $scope.queryObject;
        $http.post("/transactionHistoryCustomerSupport", data)
          .success(function(res){
            if(res.success){
              console.log("The result in searchTransactionHistory", res);
              res.finalResult.sort(function(a, b){
                return a.createdAt - b.createdAt;
              })
              for(var i = 0 ; i<res.finalResult.length; i++){
                res.finalResult[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
              }
              $scope.listPlayer = res.finalResult;
              console.log("the value of listplayer is ",$scope.listPlayer);
            }
            else{
              console.log("the result in customerSupportController searchTransactionHistory is",res);
              swal(res.result);
            }
          }).error(function(err){
            swal("Error!", "Getting error from server in showing searchTransactionHistory");
            // swal("Getting error from server in showing Bonus Deposit");
          });
    }

    $scope.searchGameData = function(){
        showList = true;
        var data = {};
        // console.log("$$$$ in searchGameData",$cookies.get('poker_userName'));
        console.log("$$$$ in searchGameData",$rootScope.poker_userName);
        //data.createdBy = $cookies.get('poker_email');
        //data.profile = $cookies.get('poker_role').toUpperCase();
        // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
        //    $scope.queryObject.loginId = $cookies.get('poker_userName');
        // }
        // data = $scope.queryObject;
        if(!$scope.userNameFilter && !$scope.emailIdFilter && !$scope.mobileNumberFilter){
          swal('Please provide atleast one filter!');
          $scope.listPlayer = [];
          return;
        }

        if($scope.userNameFilter){
          data.userName = $scope.userNameFilter;  
        }
        if($scope.emailIdFilter){
          data.email = $scope.emailIdFilter;  
        }
        if($scope.mobileNumberFilter){
          data.mobileNumber = $scope.mobileNumberFilter;  
        }
        $http.post("/gameProfileDetails", data)
          .success(function(res){
            if(res.success){
              console.log("The result in searchGameData", res);
              $scope.listPlayer = res.result;
              console.log("the value of listplayer in searchGameData is ",$scope.listPlayer);
            }
            else{
              console.log("the result in customerSupportController searchGameData is",res);
              $scope.listPlayer = [];
              swal(res.result);
            }
          }).error(function(err){
            swal("Error!", "Getting error from server in showing searchGameData");
            // swal("Getting error from server in showing Bonus Deposit");
          });
    }

    $scope.searchCashGame = function(){
        showList = true;
        var data = {};
        // console.log("$$$$ in searchCashGame",$cookies.get('poker_userName'));
        console.log("$$$$ in searchCashGame",$rootScope.poker_userName);
        //data.createdBy = $cookies.get('poker_email');
        //data.profile = $cookies.get('poker_role').toUpperCase();
        // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
        //    $scope.queryObject.loginId = $cookies.get('poker_userName');
        // }
        data = $scope.queryObject;
        $http.post("/searchCashGameData", data)
          .success(function(res){
            if(res.success){
              console.log("The result in searchCashGame", res);
              // $scope.listPlayer = res.finalResult;
              var winnersString = "";
              for(var i=0; i<res.winnerCards.length; i++){

                winnersString = winnersString + res.winnerCards[i].name +" ("+res.winnerCards[i].text +") ("
                for(var j=0; j<res.winnerCards[i].cards.length; j++){
                  winnersString = winnersString + res.winnerCards[i].cards[j];
                }
                if(i==res.winnerCards.length-1){
                  winnersString = winnersString + ")\n" ;
                }
                else{
                  winnersString = winnersString + "),\n" ;
                }
              }
              $scope.gameData = res;
              $scope.gameData.winnersString = winnersString;
              console.log("--------------",$scope.gameData);
            }
            else{
              console.log("the result in customerSupportController searchCashGame is",res);
              swal(res.result);
            }
          }).error(function(err){
            swal("Error!", "Getting error from server in showing searchCashGame");
            // swal("Getting error from server in showing Bonus Deposit");
          });
    }
     // for clearing scope variable
   $scope.clearData = function(){
      $scope.queryObject = {};
      $scope.userNameFilter = "" ;
      $scope.emailIdFilter = "" ;
      $scope.mobileNumberFilter = "" ;
      $scope.listPlayer = [];
      $scope.channelIdFilter = "";
      $scope.roundIdFilter = "";
      $scope.transactionIdFilter = "";
      $scope.gameData = "";
   }

  $scope.searchHistory = function(){
    if(!$scope.userNameFilter && !$scope.emailIdFilter && !$scope.mobileNumberFilter){
      swal("Error!", "Please provide at least one filter" );
      return;
    }
    $scope.currentPage = 1;
    if(!!$scope.userNameFilter && $scope.userNameFilter !== ""){
      console.log("Inside userNameFilter",$scope.userNameFilter);
     $scope.queryObject.userName = $scope.userNameFilter;
    }

    if(!!$scope.emailIdFilter && $scope.emailIdFilter !== ""){
      console.log("Inside emailIdFilter",$scope.emailIdFilter);
     $scope.queryObject.email = $scope.emailIdFilter;
    }

    if(!!$scope.mobileNumberFilter && $scope.mobileNumberFilter !== ""){
      console.log("Inside mobileNumberFilter",$scope.mobileNumberFilter);
      $scope.queryObject.mobileNumber = $scope.mobileNumberFilter;
    }
    console.log("************** queryObject",JSON.stringify($scope.queryObject));
    $scope.init();
  }

  $scope.searchPlayerTransactionHistory = function(){

    $scope.queryObject = {};

    if(!$scope.userNameFilter && !$scope.emailIdFilter && !$scope.mobileNumberFilter){
      swal("Error!", "Please provide at least one filter" );
      return;
    }
    $scope.currentPage = 1;
    if(!!$scope.userNameFilter && $scope.userNameFilter !== ""){
      console.log("Inside userNameFilter",$scope.userNameFilter);
     $scope.queryObject.userName = $scope.userNameFilter;
    }

    if(!!$scope.emailIdFilter && $scope.emailIdFilter !== ""){
      console.log("Inside emailIdFilter",$scope.emailIdFilter);
     $scope.queryObject.email = $scope.emailIdFilter;
    }

    if(!!$scope.mobileNumberFilter && $scope.mobileNumberFilter !== ""){
      console.log("Inside mobileNumberFilter",$scope.mobileNumberFilter);
      $scope.queryObject.mobileNumber = $scope.mobileNumberFilter;
    }

    if(!!$scope.transactionIdFilter && $scope.transactionIdFilter !== ""){
      console.log("Inside transactionIdFilter",$scope.transactionIdFilter);
      $scope.queryObject.transactionId = $scope.transactionIdFilter;
    }
    

    console.log("************** queryObject",JSON.stringify($scope.queryObject));
    $scope.searchTransactionHistory();
  }

   $scope.searchGameProfileData = function(){
    if(!$scope.userNameFilter && !$scope.emailIdFilter && !$scope.mobileNumberFilter){
      swal("Error!", "Please provide at least one filter" );
      return;
    }
    $scope.currentPage = 1;
    if(!!$scope.userNameFilter && $scope.userNameFilter !== ""){
      console.log("Inside userNameFilter",$scope.userNameFilter);
     $scope.queryObject.userName = $scope.userNameFilter;
    }

    if(!!$scope.emailIdFilter && $scope.emailIdFilter !== ""){
      console.log("Inside emailIdFilter",$scope.emailIdFilter);
     $scope.queryObject.email = $scope.emailIdFilter;
    }

    if(!!$scope.mobileNumberFilter && $scope.mobileNumberFilter !== ""){
      console.log("Inside mobileNumberFilter",$scope.mobileNumberFilter);
      $scope.queryObject.mobileNumber = $scope.mobileNumberFilter;
    }
    console.log("************** queryObject",JSON.stringify($scope.queryObject));
    $scope.searchGameData();
  }
  
  $scope.searchCashGameHistory = function(){
    if(!$scope.userNameFilter || !$scope.roundIdFilter){
      swal("Error!", "Please provide all the filters" );
      return;
    }
    $scope.currentPage = 1;
    if(!!$scope.userNameFilter && $scope.userNameFilter !== ""){
      console.log("Inside userNameFilter",$scope.userNameFilter);
     $scope.queryObject.userName = $scope.userNameFilter;
    }

    if(!!$scope.channelIdFilter && $scope.channelIdFilter !== ""){
      console.log("Inside channelIdFilter",$scope.channelIdFilter);
     $scope.queryObject.channelId = $scope.channelIdFilter;
    }

    if(!!$scope.roundIdFilter && $scope.roundIdFilter !== ""){
      console.log("Inside roundIdFilter",$scope.roundIdFilter);
      $scope.queryObject.roundId = $scope.roundIdFilter;
    }
    console.log("************** queryObject",JSON.stringify($scope.queryObject));
    $scope.searchCashGame();
  }    

    
}]);;angular.module('MetronicApp').controller('dailyCashoutChartController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) {
    console.log("Inside dailyCashoutChartController  @@@@@@@@@");
    var data = {};

    $('.date-picker').datepicker('setEndDate', new Date());

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.setVisible = false;

    $scope.newSchedule = function(){
        console.log($('.scheduleDate').val())
        if(!$('.scheduleDate').val()) {
            return false;
        }
        var d = ($('.date-picker').data("datepicker").getUTCDate());
        // d.setDate(1);
        // d.setHours(0);
        // d.setMilliseconds(0);
        // d.setMinutes(0);
        // d.setSeconds(0);
        console.log("the value of date is ",d, Number(d));

        d.setUTCDate(1);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        console.log("the value of date is ",d, Number(d));
        data.addeddate = Number(d);
        $scope.init();
    }
    $scope.init = function(){
      //data.createdAt = { "$gte": Number(addeddate), "$lt": Number(endDate)};

      // data.userName = $cookies.get('poker_userName');
      $scope.setVisible = true;
      data.userName = $rootScope.poker_userName;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);
      data.keyForCashoutChart = 1;
      console.log("the data in dailyCashoutChartController ",JSON.stringify(data));
      if(data.addeddate){
        console.log("All fields are present");
        $http.post("/dailyCashoutChart", data)
        .success(function(res){
          if(res.success){
              $scope.setVisible = true;
              swal("Success!", "Data Retreived  successfully.");
              var object = [];
              // for(var i = 0; i<res.result.currentMonthCashoutData:.length;i++){
              console.log("*****************",res.result.currentMonthCashoutData);
              console.log("*****************",res.result.previousMonthCashoutData);
              var  j = 1;
              for(var i = res.result.currentMonthCashoutData.length-1; i>=0;i--){
                  var tempObj = {};
                  tempObj.dailyCashoutCurrentMonth = res.result.currentMonthCashoutData[i].dailyCashout;
                  tempObj.day = j;
//tempObj.dailyCashoutPreviousMonth = res.result.previousMonthCashoutData[i].dailyCashout;
                  j = j + 1;
                  object.push(tempObj);
              }

              console.log("###############",object);
              var chart = AmCharts.makeChart( "chartdiv2", {
              "type": "serial",
              "addClassNames": true,
              "theme": "light",
              "autoMargins": false,
              "marginLeft": 80,
              "marginRight": 8,
              "marginTop": 10,
              "marginBottom": 26,
              "balloon": {
                "adjustBorderColor": false,
                "horizontalPadding": 10,
                "verticalPadding": 8,
                "color": "#ffffff"
              },

              "dataProvider": object,
              "valueAxes": [ {
                "axisAlpha": 0,
                "position": "left"
              } ],
              "startDuration": 1,
              "graphs": [ {
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                "fillAlphas": 1,
                "title": "Cashout",
                "type": "column",
                "valueField": "dailyCashoutCurrentMonth",
                "dashLengthField": "dashLengthColumn"
              }, {
                "id": "graph2",
                "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                "bullet": "round",
                "lineThickness": 3,
                "bulletSize": 7,
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "useLineColorForBulletBorder": true,
                "bulletBorderThickness": 3,
                "fillAlphas": 0,
                "lineAlpha": 1,
                "title": "Cashout",
                "valueField": "dailyCashoutPreviousMonth",
                "dashLengthField": "dashLengthLine"
              } ],
              "categoryField": "day",
              "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
              },
              "export": {
                "enabled": true
              }
            } );
            console.log(res);
            $scope.formdata = {};
            $scope.rakeChartForm.$setPristine();

          }else{
            swal("Error!", res.result);
            $scope.setVisible = false;
            // swal(res.result);
          }

                        //$cookies.put('poker_token', res.authToken);
          }).error(function(err){
              // swal(err);
            swal("Error!", "Getting error from server in showing daily rake report. ");
              // swal("Getting error from server in creating Bonus code ");
          });

      }
      else{
        console.log("Some fields are missing");
        swal("Error!", "Some Fields are missing");
        return;
      }

    }


  }]);
;angular.module('MetronicApp').controller('dailyCashoutController', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside dailyCashoutController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject  = {};
    $scope.sortValue = "date";

    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }
    
    var user = {
        // name     : $cookies.get('poker_name'),
        name     : $rootScope.poker_name,
        // userName : $cookies.get('poker_userName'),
        userName : $rootScope.poker_userName,
        // role     : JSON.parse($cookies.get('poker_role')),
        role     : JSON.parse($rootScope.poker_role),
        // id       : $cookies.get('poker_email'),
        id       : $rootScope.poker_email,
        // mobile   : $cookies.get('poker_loggedinUserMobileNum'),
        mobile   : $rootScope.poker_loggedinUserMobileNum,
    };
    console.log("*^*^*^*^*^*^*^*^*^*^*^*^*^*",JSON.stringify(user));
    
    $scope.init = function(){
        showList = true;
        // console.log("The value of cookies is",$cookies.getAll());
        console.log("line 40", $scope.queryObject);
        // if(data.role.level<=0){
        //   data.isParentUserName = $cookies.get('poker_userName');  
        // }
        console.log("____________________************",$scope.queryObject);
        if($scope.queryObject.createdAt){
          var data = $scope.queryObject;
          // data.userName = $cookies.get('poker_userName');
          data.userName = $rootScope.poker_userName;
          // data.role     = JSON.parse($cookies.get('poker_role'));
          data.role     = JSON.parse($rootScope.poker_role);
          data.sortValue = $scope.sortValue;
          console.log("*******inside datefilter", $scope.queryObject);
            $http.post("/findDailyCashoutDateFilter", data)
            .success(function(res){
              console.log("The result in findDailyCashoutDateFilter dailyCashoutController", res);
              if(res.result.totalCashouts.length == 0){
                swal("No data found!");
              }
              $scope.listHistory = res.result.totalCashouts;
              console.log("######### res.result", res.result);
              //clearData();
            }).error(function(err){
              swal("Getting error from server in showing fund Transfer History Player");
              //clearData();
            });
        }
        else{
          var data = $scope.queryObject;
          // data.userName = $cookies.get('poker_userName');
          data.userName = $rootScope.poker_userName;
          // data.role     = JSON.parse($cookies.get('poker_role'));
          data.role     = JSON.parse($rootScope.poker_role);
          data.sortValue = $scope.sortValue;

          console.log("*******date filter not passed");
            $http.post("/findDailyCashoutReport", data)
              .success(function(res){
                console.log("The result in dailyCashoutController", res);
                $scope.listHistory = res.result.totalCashouts;
                console.log("######### res.result", res.result);
                //clearData();
              }).error(function(err){
                swal("Getting error from server in showing fund Transfer History Player");
                //clearData();
              });
        }
    }
     // for clearing scope variable
   $scope.clearData = function(){
        $scope.queryObject = {};
         $scope.startDate = "";
         $scope.endDate = "";
         $scope.referenceNo = "";
         $scope.listHistory = "";
        // $scope.userNameFilter = "";
        // $scope.countData();
         $scope.userId = "";
         $scope.userName = "";
         $scope.affiliateId = "";
         $scope.minAmount = "";
         $scope.maxAmount = "";
         $scope.init();
   }

    $scope.onStartDateChange = function(){
      $scope.endDate = !($scope.startDate)?$scope.startDate:"";
    }

    $scope.onEndDateChange = function(){

      if( Number(new Date($scope.startDate)) > Number(new Date($scope.endDate)) ){
         $scope.endDate = "";
         swal({
          title: "End date must be greater then start date.",
          text: '',
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Close",
          closeOnConfirm: true,
          inputType : "text",
          html: true,
        }, function(){
      
        });
       }
    }


  $scope.searchHistory = function(){
    $scope.queryObject = {};
    $scope.currentPage = 1;

    // if(!!$scope.userNameFilter && $scope.userNameFilter !== ""){
    //   console.log("Inside userNameFilter",$scope.userNameFilter);
    //  $scope.queryObject.userName = $scope.userNameFilter;
    // }
    console.log("Inside dailyCashoutController -------------------");
    if(Number(new Date($scope.startDate)) > 0 || Number(new Date($scope.endDate)) > 0){
      $scope.queryObject.createdAt = {};
      $scope.queryObject.createdAt['$gte'] =  Number($('.date-picker1').data("datepicker").getUTCDate());
      $scope.queryObject.createdAt['$lte'] =  Number($('.date-picker2').data("datepicker").getUTCDate()) + 24*60*60*1000;
      if($scope.referenceNo){
        $scope.queryObject.referenceNo = $scope.referenceNo;
      }
      if($scope.minAmount && $scope.maxAmount && ($scope.minAmount > $scope.maxAmount)){
        swal("Please enter a valid Input!");
        return;
      }
      if(($scope.minAmount && $scope.minAmount <= 0) || ($scope.maxAmount && $scope.maxAmount <= 0)){
        swal("Input fields cannot contain zero or negative values");
        return false;
      }
      if($scope.userId){
        $scope.queryObject.userId = $scope.userId;
      }
      if($scope.affiliateId){
        $scope.queryObject.affiliateId = $scope.affiliateId;
      }
      if($scope.minAmount){
        $scope.queryObject.minAmount = $scope.minAmount;
      }
      if($scope.maxAmount){
        $scope.queryObject.maxAmount = $scope.maxAmount;
      }
    }
    else{
      swal("Start Date or End Date are required.");
    }  

    console.log("************** queryObject in dailyCashoutController",JSON.stringify($scope.queryObject));
    // $scope.listTables();
    $scope.init();
  }
   $scope.init();



    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      var exportHref=Excel(tableId,'sheet_name');
      $timeout(function(){location.href=exportHref;},100); // trigger download
    };
    
    //$scope.countData();
    

    
}]);;angular.module('MetronicApp').controller('dictionaryController', ["$scope", "$http", "$rootScope", "$stateParams", "$cookies", "$location", function($scope, $http, $rootScope, $stateParams,$cookies, $location) {
    $scope.data = {};
    var token = {};
    var showList = true,
        pagelimit = 1;


    if(!$rootScope.isAdminLogin){
        console.log('yes')
        $location.path('/login.html')
    }

    $scope.init = function() {
        var data = {};
        console.log(' Initialize listusersController');
        $scope.data.blockedWordsList = [];
        getSpamWordsList();
        //countuserlist();
    }

    var getSpamWordsList = function() {
        console.log($cookies);
        // console.log('get spam words list - ' + $cookies.get('poker_role'));
        console.log('get spam words list - ' + $rootScope.poker_role);
        var data = {};
        // data.authToken = $cookies.get('poker_token');
        data.authToken = $rootScope.poker_token;
        console.log(JSON.stringify(data));
        $http.post("/listSpamWords", data)
            .success(function(res) {
                    $scope.data.blockedWordsList = res.result[0] || {};
                    console.log("data from db in browser spamwords--" + JSON.stringify($scope.blockedWordsList))
            }).error(function(err) {
            swal("Error!", "dict error: " + err);
                // swal("dict error: " + err);
            })
    }



    //update dictionary details by admin
    $scope.updateSpamWord = function() {
            console.log('data from updateSpamWord - ' + JSON.stringify($scope.data));
            var tagValues = $scope.data.blockedWordsList['blockedWords'] ? ($scope.data.blockedWordsList['blockedWords'].map(function(input) {
                return input.text;
            })) : [];
            console.log("tagValues-----" + tagValues);
            console.log('testSushil', $('#testSushil'));
            // console.log("newTag.text", JSON.stringify($scope.newTag));
            // return;
            var data = $scope.data;
            // data.authToken = $cookies.get('poker_token');
            data.authToken = $rootScope.poker_token;
            data.blockedWords = tagValues;

            //data.blockedWordsList = $scope.blockedWordsList || undefined;
            // console.log("+++++++++",JSON.stringify($scope.data));
            console.log("==========", JSON.stringify(data));
            $http.post('/updateSpamWord', data)
                .success(function(res) {
                    if (res.rTL) {
                        swal("Session Expired");
                        $location.path('/login');
                    } else {
                        console.log("data from db in browser spamwords--" + JSON.stringify(res))
                        $scope.blockedWordsList = res.result;
                        getSpamWordsList();
                    }

                    JSON.stringify("in addSpamWords Controller 26 lines" + res.data);
                }).error(function(err) {
            swal("Error!", "dict error: " + err);
                    // swal("dict error: " + err);
                })

        }
        //get current page user details

    $scope.init();

}]);
;angular.module('MetronicApp').controller('directCashoutHistoryController', ["$location", "$cookies", "$rootScope", "$scope", "$http", "$stateParams", "$filter", "$window", function($location, $cookies, $rootScope, $scope, $http, $stateParams, $filter, $window) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    console.log("Cashout History Controller Loaded");

    if(!$rootScope.isAdminLogin){
        console.log('yes', $rootScope.role)
        $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    
    $scope.newPageList = function () {
        $scope.init(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
    }
   
    var user = {
        // name     : $cookies.get('poker_name'),
        name     : $rootScope.poker_name,
        // userName : $cookies.get('poker_userName'),
        userName : $rootScope.poker_userName,
        // role     : JSON.parse($cookies.get('poker_role')),
        role     : JSON.parse($rootScope.poker_role),
        // id       : $cookies.get('poker_email'),
        id       : $rootScope.poker_email,
        // mobile   : $cookies.get('poker_loggedinUserMobileNum'),
        mobile   : $rootScope.poker_loggedinUserMobileNum,
    };

    console.log("*^*^*^*^*^*^*^*^*^*^*^*^*^*",JSON.stringify(user));
   

    $scope.countData = function(){
      // console.log("$$$$$$$$$$$$$$$$$$",$cookies.get('poker_userName'));
      console.log("$$$$$$$$$$$$$$$$$$",$rootScope.poker_userName);
      console.log("user details are ",user);
      if($scope.referenceNo){
        user.referenceNo = $scope.referenceNo;
      }
      $http.post("/countDataForCashoutHistory",user)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             if(res.result.length == 0){
              swal("No data found!")
             }
             $scope.newPageList();
          } else{
            swal("No data found for loggedIn user");
          }
        }).error(function(err){
        swal("Getting error from server in showing transaction history",err.stack);
      });  
    }

    $scope.init = function(skipData,limitData,cb){
        showList = true;
        var data = {};
        // console.log("$$$$$$$$$$$$$$$$$$4",$cookies.get('poker_userName'));
        console.log("$$$$$$$$$$$$$$$$$$4",$rootScope.poker_userName);
        if($scope.referenceNo){
          user.referenceNo = $scope.referenceNo;
        }
        user.skip = skipData;
        user.limit = limitData;
        $http.post("/findDataForCashoutHistory", user)
          .success(function(res){
            console.log("The result in findDataForCashoutHistory directCashoutHistoryController", res.result);
            for(var i = 0 ; i<res.result.length; i++){
              res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
            }
            $scope.dataList = res.result;
            if(cb instanceof Function){
            cb();
          }
          }).error(function(err){
            swal("Error!", "Getting error from server in showing transaction History");
            // swal("Getting error from server in showing Bonus Deposit");
          });
    }

    $scope.countData();

    $scope.resetForm = function(){
      $scope.referenceNo = "";
      user.referenceNo = "";
      $scope.countData();
    }    

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};

          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }

    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.init(0, 0, function(){
        $window.scrollTo(0, 0);
        setTimeout(function() {
          location.href=Excel(tableId,'sheet_name');
        }, 500);
      });
    };

}]);




;angular.module('MetronicApp').controller('duplicateRakeRulesController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.data = {};
    $scope.listRule = [];
    $scope.data_test={};
    $scope.data_test.description="QWERTYUI";
    
    var token = {};
    var showList = true;
    console.log("Inside duplicate Rake Rules controller @@@@@@@@@");
    $scope.showList = function(){
      return showList;
    }

    $scope.init = function(id){
        showList = true;
        //token = $cookies.get('poker_token');
        //console.log("#$#$$#$#$ the token inside listRakeRulesController is", token );
        var data = {};
        if(id){
            data._id = id;
        }
        //data.authToken = token;
        //console.log("Inside listRakeRule the data for routing is ************",data);
        $http.post("/listRakeRule", data)
          .success(function(res){
            //console.log("The result inside listRakeRule is ", JSON.stringify(res));
            $scope.listRule = res.result;
            if(id){
                $scope.listRule = res.result[0];
            }
            console.log("######### res.result", res.result);
              // if(res.rTL){
              //   //swal("Session Expired");
              //   //$location.path('/login');
              // } else{
              //   if(res.success){
              //     console.log(res);
              //     $scope.listRule = res.result;
              //   } else{
              //     swal("Missing Keys")
              //   }
              //     $cookies.put('poker_token', res.authToken);
              // }
          }).error(function(err){
            // swal(err);
            swal("Getting error from server in showing rake rule");
          });
    }

    // $scope.createrule = function(){
    //   $location.path('/createrakerules');
    // }

    $scope.edit = function(data){
      console.log("Edit rakerule called @@@@@@@");
      showList = false;
      $scope.data = data;
    }

    $scope.cancel = function(){
      $scope.init();
    }

    // $scope.duplicate = function(rule){
    //   var data = angular.copy(rule);
    //   data.authToken = token;
    //   data.name = (data.name)+"_dup";
    //   delete data._id;
    //   $http.post("/createRakeRule", data)
    //     .success(function(res){
    //         if(res.rTL){
    //           swal("Session Expired");
    //           $location.path('/login');
    //         } else{
    //           if(res.success){
    //             swal("Successfull !!");
    //             $scope.init();
    //           } else{
    //             swal("Missing Keys")
    //           }
    //             $cookies.put('poker_token', res.authToken);
    //         }
    //     }).error(function(err){
    //       // swal(err);
    //       swal("Getting error from server in duplicate rake rule");
    //     });
    // }

    // $scope.add = function(){ //not used - as of 27 oct
    //   var temp = {
    //     "level" : $scope.data.list.length+1,
    //     "smallBlind" : 0,
    //     "bigBlind": 0,
    //     "minutes": 0
    //   }
    //   $scope.data.list.push(temp);
    // }

    // $scope.del = function(index){ //not used - as of 27 oct
    //   $scope.data.list.splice(index, 1);
    // }

    //get rake rules
  var getRakeRules = function(){
      console.log('get rake rules', JSON.stringify($scope.data));
    }

    $scope.submit = function(formValid){
      // if(formValid){
      //   console.log("validation passed",formValid);
      // } else {
      //   console.log("validation failed",formValid);
      //   return;
      // }
      console.log("Data to submit is in duplicateRakeRules is ", JSON.stringify($scope.listRule));
      var data = angular.copy($scope.listRule);
      console.log('lines 88', JSON.stringify(data));
      if(data.list.length){
        if(validateRake(data.list, data.list.length)){
          data.authToken = token;
          $http.post("/createRakeRule", data)
            .success(function(res){
                if(res.rTL){
                  swal("Session Expired");
                  $location.path('/login');
                } else{
                  if(res.success){
                    swal("Successfully updated");
                    $location.path('/listRakeRule');

                    // $scope.init();
                  } else{
                    swal("Missing Keys")
                  }
                    $cookies.put('poker_token', res.authToken);
                }
            }).error(function(err){
              // swal(err);
              swal("Getting error from server in updating rake rule");
            });
        } else{
          swal("Rake can't be more than 5%");
        }
      } else{
        swal("Enter some rule");
      }
    }

    function validateRake(list, length){
        for(var i=0; i<length; i++){
            if(list[i].rakePercent > 5)
            {
                return false
            }
        }
        return true;
    }

    // $scope.disable = function(list){
    //   var data = {};
    //   data.authToken = token;

    //   if(list.isActive == true){
    //     data.isActive = false;
    //   } else{
    //     data.isActive = true;
    //   }
    //   data.id = list._id;
    //   $http.put("/disableRakeRules", data)
    //     .success(function(res){
    //       if(res.rTL){
    //         swal("Session Expired");
    //         $location.path('/login');
    //       } else{
    //         if(res.success){
    //           swal("Successfull !!");
    //           $scope.init();
    //         } else{
    //           swal("Unable to disable !!");
    //         }
    //         $cookies.put('poker_token', res.authToken);
    //       }
    //     }).error(function(err){
    //       // swal(err);
    //       swal("Getting error from server in updating rake rule");
    //     });
    // }
  if($stateParams.rakeRuleId){
      console.log("stateParams", $stateParams.rakeRuleId);
      $scope.init($stateParams.rakeRuleId);
    }
    else
    {
      $scope.init();
    }  

  

  }]);;angular.module('MetronicApp').controller('forgotPasswordController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", "$window", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout,$window) { 
    console.log("Inside forgotPasswordController  @@@@@@@@@");
    var email = $scope.email;
    console.log("the email is ",email);

    $scope.status = $stateParams.status;

    function checkPassword(){
      var validate = false;
       if($scope.password === $scope.newPassword){
          validate = true;          
       }       
       return validate;
    }
    $scope.forgotPasswordLogin = function(){
      console.log($scope.email);
      console.log($cookies.getAll());
      var data = {};
      data.email = $scope.email;
        $http.post("/forgotPasswordLogin", data)
        .success(function(res){
          console.log("res is ",res);
          if(res.success){
              swal("Success!", "A link to reset your password has been sent to your registered email.");
              $scope.email = " ";
            console.log(res);
          }else{
            swal("Error!", res.result);
            // swal(res.result);
          }
                        
          }).error(function(err){
              // swal(err);
            swal("Error!", "Getting error from server  ");
              // swal("Getting error from server in creating Bonus code ");
          });

      }

    $scope.resetPassword = function(){
      console.log($stateParams.forgotId);
      //console.log($cookies.getAll());
      var data = {};
      data.id = $stateParams.forgotId;
      data.password = $scope.password;
      data.newPassword = $scope.newPassword
        if(checkPassword()){
          $http.post("/resetPasswordLogin", data)
          .success(function(res){
            console.log("res is ",res);
            if(res.success){
                swal("Success!", "Password "+(($scope.status==200||$scope.status==201)? 'Set' : 'Reset')+" Successfully.");
                // setTimeout(function(){
                //   $window.close();
                // }, 5000)
                $location.path('/login.html');
              console.log(res);
            }else{
              swal("Error!", res.result);
              // swal(res.result);
            }
                          
            }).error(function(err){
                // swal(err);
              swal("Error!", "Getting error from server  ");
                // swal("Getting error from server in creating Bonus code ");
            });
        }
        else{
          swal("Error!", "Password and ConfirmPassword should be same");
        }

    }

    function checkPasswordPlayer(){
      var validate = false;
       if($scope.passwordPlayer === $scope.newPasswordPlayer){
          validate = true;          
       }       
       return validate;
    }

    $scope.resetPasswordPlayer= function(){
      console.log($stateParams.forgotId);
      //console.log($cookies.getAll());
      var data = {};
      data.id = $stateParams.forgotPlayerId;
      data.password = $scope.passwordPlayer;
      data.newPassword = $scope.newPasswordPlayer;
        if(checkPasswordPlayer()){
          $http.post("/resetPasswordPlayer", data)
          .success(function(res){
            console.log("res is ",res);
            if(res.success){
                swal("Success!", "Password "+(($scope.status==200||$scope.status==201)? 'Set' : 'Reset')+" Successfully.");
                //$location.path('/login.html');
                if ($stateParams.status == 200) {
                  $window.location.href = rootTools.websiteLink + "/emailVerify?status=200";
                } else if ($stateParams.status == 201) {
                  $window.location.href = rootTools.websiteLink + "/emailVerify?status=201";
                } else {
                  $window.location.href = rootTools.websiteLink;
                }
              console.log(res);
            }else{
              swal("Error!", res.result||res.info);
              // swal(res.result);
            }
                          
            }).error(function(err){
                // swal(err);
              swal("Error!", "Getting error from server  ");
                // swal("Getting error from server in creating Bonus code ");
            });
        }
        else{
          swal("Error!", "Password and ConfirmPassword should be same");
        }

    }
      // else{
      //   console.log("Some fields are missing");
      //       swal("Error!", "Some Fields are missing");
      //   // swal("Some Fields are missing");
      //   return;
      // }
      
      console.log("The forgot id is ",$stateParams.forgotId);
      console.log("The forgot id of player is ",$stateParams.forgotPlayerId );
  

  }]);;angular.module('MetronicApp').controller('fundTransferController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    console.log("Inside fundTransferController  @@@@@@@@@");
    var fundTransferData = {};
    
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }
    $scope.formdata = {};
    $scope.formdata.transactionType = "Credit";
    //transfer fund to player
    // $scope.toggleChips = $cookies.get('poker_role');
    $scope.toggleChips = $rootScope.poker_role;
    $scope.init = function(){
      console.log($scope.formdata.transferTo);
      console.log($scope.formdata.amount);
      // console.log($cookies.get('poker_userName'));
      console.log($rootScope.poker_userName);
      console.log($scope.formdata.transactionType);
      console.log($scope.formdata.description);
      console.log("the value inside cookies of fundTransferController is",$cookies.getAll());
      fundTransferData.transferTo = $scope.formdata.transferTo;
      fundTransferData.amount = parseInt($scope.formdata.amount);
      if(fundTransferData.amount < 100){
        swal("Error", "Amount not valid!");
        return false;
      }
      fundTransferData.transactionType = $scope.formdata.transactionType;
      fundTransferData.description = $scope.formdata.description;
      // fundTransferData.role        = JSON.parse($cookies.get('poker_role'));
      fundTransferData.role        = JSON.parse($rootScope.poker_role);
      //fundTransferData.transferBy  = $cookies.get('poker_email');
      // fundTransferData.transferBy  = $cookies.get('poker_userName');
      fundTransferData.transferBy  = $rootScope.poker_userName;
      //fundTransferData.Name  = $cookies.get('poker_userName');
      //fundTransferData.Name  = $cookies.get('poker_name');
      // fundTransferData.approvedBy = $cookies.get('poker_userName');
      fundTransferData.approvedBy = $rootScope.poker_userName;
      fundTransferData.Name  = $scope.formdata.transferTo;
      // fundTransferData.parentEmail = $cookies.get('poker_email');
      fundTransferData.parentEmail = $rootScope.poker_email;
      // fundTransferData.parentMobile = $cookies.get('poker_loggedinUserMobileNum');
      fundTransferData.parentMobile = $rootScope.poker_loggedinUserMobileNum;
      // var role = JSON.parse($cookies.get('poker_role'));
      var role = JSON.parse($rootScope.poker_role);
      console.log("the role is ",JSON.stringify(role));
      //fundTransferData.createdBy = $cookies.get('poker_email');
      //fundTransferData.profile   = $cookies.get('poker_role').toUpperCase();
      console.log("the fundTransferData is ",JSON.stringify(fundTransferData));
      if(!!$scope.formdata.transferTo && !!$scope.formdata.amount ){
          console.log("All fields are present");
          if(role.level > 0){
            swal({
                  title: "Are you sure you want to transfer the amount?",
                  text: '',
                  type: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#DD6B55",
                  confirmButtonText: "Proceed",
                  closeOnConfirm: false,
                  inputType : "text",
                  html: true,
            }, function(){
                  $http.post("/transferFundChips", fundTransferData)
                  .success(function(res){
                    if(res.success){
                      swal("Chips Transfer Successful!!");
                      console.log(res);
                      $scope.formdata = {};
                      $scope.generateBonusForm.$setPristine();
                      //$location.path('/transferHistoryPlayer');
                    }else{
                      swal(res.result);
                    }
                        
                        //$cookies.put('poker_token', res.authToken);
            }).error(function(err){
              // swal(err);
                swal("Getting error from server in fund transfer ");
            });
            
          });
          
        }
        else{
              //fundTransferData.Affiliate = $cookies.get('poker_email');
              // fundTransferData.Affiliate = $cookies.get('poker_userName');
              fundTransferData.Affiliate = $rootScope.poker_userName;
              swal({
                    title: "Are you sure you want to transfer the amount?",
                    text: '',
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Proceed",
                    closeOnConfirm: false,
                    inputType : "text",
                    html: true,
              }, function(){
                    $http.post("/transferChipsByAffiliateToPlayer", fundTransferData)
                    .success(function(res){
                     if(res.success){
                        swal("Chips Transfer Successful!!");
                        $scope.formdata = {};
                        $scope.generateBonusForm.$setPristine();
                        console.log(res);
                       // $location.path('/transferHistoryPlayer');
                     }else{
                        swal(res.result);
                     }
                        
                        //$cookies.put('poker_token', res.authToken);
              }).error(function(err){
                  // swal(err);
                    swal("Getting error from server in fund transfer ");
              });

              });
        }

    }
      else{
        console.log("Some fields are missing");
        swal("Some Fields are missing");
        return;
      }
      
    }

    // $scope.cancel = function(){
    //   $scope.formdata.amount = " ";
    //   $scope.formdata.transferTo = " ";
    // }

    //transfer fund to affiliate
    $scope.fundTransferToAffiliate = function(){
      console.log($scope.formdata.transferTo);
      console.log($scope.formdata.amount);
      // console.log($cookies.get('poker_userName'));
      console.log($rootScope.poker_userName);
      // console.log($cookies.get('poker_role'));
      console.log($rootScope.poker_role);
      console.log($scope.formdata.transactionType);
      console.log($scope.formdata.description);
      console.log("the value inside cookies of fundTransferToAffiliate is",$cookies.getAll());
      fundTransferData.transferTo = $scope.formdata.transferTo;
      fundTransferData.amount = parseInt($scope.formdata.amount);
      if(fundTransferData.amount < 100){
        swal("Error", "Amount not valid!");
        return false;
      }
      fundTransferData.transactionType = $scope.formdata.transactionType;
      fundTransferData.description = $scope.formdata.description;
      // fundTransferData.role        = JSON.parse($cookies.get('poker_role'));
      fundTransferData.role        = JSON.parse($rootScope.poker_role);
      
      //fundTransferData.transferBy  = $cookies.get('poker_email');
      // fundTransferData.transferBy  = $cookies.get('poker_userName');
      fundTransferData.transferBy  = $rootScope.poker_userName;
      fundTransferData.Name  = $scope.formdata.transferTo;
      // fundTransferData.approvedBy = $cookies.get('poker_userName');
      fundTransferData.approvedBy = $rootScope.poker_userName;
      // fundTransferData.parentEmail = $cookies.get('poker_email');
      fundTransferData.parentEmail = $rootScope.poker_email;
      // fundTransferData.parentMobile = $cookies.get('poker_loggedinUserMobileNum');
      fundTransferData.parentMobile = $rootScope.poker_loggedinUserMobileNum;
      //fundTransferData.Name  = $cookies.get('poker_userName');      
      //fundTransferData.createdBy = $cookies.get('poker_email');
      //fundTransferData.profile   = $cookies.get('poker_role').toUpperCase();
      console.log("the fundTransferData in fundTransferToAffiliate is-------",JSON.stringify(fundTransferData));
      if(!!$scope.formdata.transferTo && !!$scope.formdata.amount ){
        console.log("All fields are present");
        swal({
              title: "Are you sure you want to transfer the amount?",
              text: '',
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Proceed",
              closeOnConfirm: false,
              inputType : "text",
              html: true,
        }, function(){
            $http.post("/transferFundChipsToAffiliate", fundTransferData)
            .success(function(res){
              if(res.success){
                swal("Chips Transfer Successful!!");
                console.log(res);
                $scope.formdata = {};
                $scope.generateBonusForm.$setPristine();
                //$location.path('/transferHistoryAffiliate');
            
              }else{
                swal(res.result);
              }
                        
                        //$cookies.put('poker_token', res.authToken);
            }).error(function(err){
              // swal(err);
                swal("Getting error from server in fund transfer ");
            });

          });

      }
      else{
        console.log("Some fields are missing");
        swal("Some Fields are missing");
        return;
      }
      
    }

    //transfer fund to subaffiliate
    $scope.fundTransferToSubAffiliate = function(){
      console.log($scope.formdata.transferTo);
      console.log($scope.formdata.amount);
      // console.log($cookies.get('poker_userName'));
      console.log($rootScope.poker_userName);
      // console.log($cookies.get('poker_role'));
      console.log($rootScope.poker_role);
      console.log($scope.formdata.transactionType);
      console.log($scope.formdata.description);
      console.log("the value inside cookies of fundTransferToAffiliate is",$cookies.getAll());
      fundTransferData.transferTo = $scope.formdata.transferTo;
      fundTransferData.amount = parseInt($scope.formdata.amount);
      if(fundTransferData.amount < 100){
        swal("Error", "Amount not valid!");
        return false;
      }
      fundTransferData.transactionType = $scope.formdata.transactionType;
      fundTransferData.description = $scope.formdata.description;
      // fundTransferData.role        = JSON.parse($cookies.get('poker_role'));
          console.error($rootScope.poker_role);
          console.error(typeof $rootScope.poker_role);
      fundTransferData.role        = JSON.parse($rootScope.poker_role);
      
      //fundTransferData.transferBy  = $cookies.get('poker_email');
      // fundTransferData.transferBy  = $cookies.get('poker_userName');
      fundTransferData.transferBy  = $rootScope.poker_userName;
      fundTransferData.Name  = $scope.formdata.transferTo;
      // fundTransferData.approvedBy = $cookies.get('poker_userName');
      fundTransferData.approvedBy = $rootScope.poker_userName;
      // fundTransferData.parentEmail = $cookies.get('poker_email');
      fundTransferData.parentEmail = $rootScope.poker_email;
      // fundTransferData.parentMobile = $cookies.get('poker_loggedinUserMobileNum');      
      fundTransferData.parentMobile = $rootScope.poker_loggedinUserMobileNum;      
      //fundTransferData.Name  = $cookies.get('poker_userName');      
      //fundTransferData.createdBy = $cookies.get('poker_email');
      //fundTransferData.profile   = $cookies.get('poker_role').toUpperCase();
      console.log("the fundTransferData in fundTransferToAffiliate is ",JSON.stringify(fundTransferData));
      if(!!$scope.formdata.transferTo && !!$scope.formdata.amount ){
        console.log("All fields are present");
        swal({
              title: "Are you sure you want to transfer the amount?",
              text: '',
              type: "warning",
              showCancelButton: true,
              confirmButtonColor: "#DD6B55",
              confirmButtonText: "Proceed",
              closeOnConfirm: false,
              inputType : "text",
              html: true,
        }, function(){
            $http.post("/transferFundChipsToSubAffiliate", fundTransferData)
            .success(function(res){
              if(res.success){
                swal("Chips Transfer Successful!!");
                console.log(res);
                $scope.formdata = {};
                $scope.generateBonusForm.$setPristine();
                //$location.path('/transferHistoryAffiliate');
            
              }else{
                swal(res.result);
              }
                        
                        //$cookies.put('poker_token', res.authToken);
            }).error(function(err){
              // swal(err);
                swal("Getting error from server in fund transfer ");
            });

          });

      }
      else{
        console.log("Some fields are missing");
        swal("Some Fields are missing");
        return;
      }
      
    }

    var withdrawData = {};
    $scope.withdrawChips = function(){
      console.log($scope.withdrawFrom);
      console.log($scope.formdata.amount);
      // console.log($cookies.get('poker_email'));
      console.log($rootScope.poker_email);
      console.log($scope.formdata.transactionType);
      console.log($scope.formdata.description);
      console.log("the value inside cookies of withdrawChips is",$cookies.getAll());
      withdrawData.withdrawFrom = $scope.withdrawFrom;
      withdrawData.amount = parseInt($scope.formdata.amount);
      if(fundTransferData.amount < 1){
        swal("Error", "Amount not valid!");
        return false;
      }
      //withdrawData.Affiliate = $cookies.get('poker_email');
      // withdrawData.Affiliate = $cookies.get('poker_userName');
      withdrawData.Affiliate = $rootScope.poker_userName;
      withdrawData.transactionType = $scope.formdata.transactionType;
      withdrawData.description = $scope.formdata.description;
      //fundTransferData.createdBy = $cookies.get('poker_email');
      //fundTransferData.profile   = $cookies.get('poker_role').toUpperCase();
      console.log("the withdrawChipsData in fundTransferController is ",JSON.stringify(withdrawData));
      if(!!$scope.withdrawFrom && !!$scope.formdata.amount ){
        console.log("All fields are present");
        $http.post("/withdrawChips", withdrawData)
        .success(function(res){
          if(res.success){
            swal("Withdraw Successful!!");
            console.log(res);
            //$location.path('/withdrawChipsHistory');
          }else{
            swal(res.result);
          }
                        
                        //$cookies.put('poker_token', res.authToken);
          }).error(function(err){
              // swal(err);
              swal("Getting error from server in withdrawing ");
          });
          
      }
      else{
        console.log("Some fields are missing");
        swal("Some Fields are missing");
        return;
      }
      
    }
  

  }]);;angular.module('MetronicApp').controller('fundTransferToAffiliateHistory', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside fundTransfer to affiliate history controller @@@@@@@@@");
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject  = {};
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }
    
    $scope.newPageList = function () {
      $scope.init(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }
    
    $scope.countData = function(){
       // alert("count data call");
      //var data = {};
      var data = $scope.queryObject;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);
      // data.userName = $cookies.get('poker_userName');
      data.userName = $rootScope.poker_userName;
      $http.post("/countAffiliateHistory",data)
        .success(function(res){
        if(res.success){
            // alert(JSON.stringify(res));
             $scope.totalPage = res.result;
             $scope.newPageList();
             clearData();
          } else{
            alert("Missing Keys");
          }
        }).error(function(err){
        alert(err);
        clearData();

        alert("Getting error from server in showing transfer History",err.stack);
        // clearData();
      });  
    }
    // for clearing scope variable
   function clearData(){
      $scope.queryObject = {};
      // $scope.loginId = "";
      // $scope.loginType = "";
      // $scope.promoCode = "";
      // $scope.type = "";
      // $scope.status = "";
      // $scope.startDate = "";
      // $scope.endDate = "";
   }

    $scope.init = function(skipData,limitData){
        showList = true;
        //var data = {};
        var data = $scope.queryObject;
        data.skip = skipData;
        data.limit = limitData;
        // data.role = (JSON.parse($cookies.get('poker_role')));
        data.role = (JSON.parse($rootScope.poker_role));
        //data.userName = $cookies.get('poker_email');
        // data.userName = $cookies.get('poker_userName');
        data.userName = $rootScope.poker_userName;

        $http.post("/fundTransferAffiliateHistory", data)
          .success(function(res){
            console.log("The result in fundTransfer to affiliate History", res);
            if(res.result.length == 0){
              swal("No data found.")
            }
            for(var i = 0 ; i<res.result.length; i++){
                   var date = new Date(res.result[i].date);
                   var validityMonth = date.getMonth() + 1;
                   var validityDay = date.getDate();
                   var validityYear = date.getFullYear();
                   var datenew = validityDay + "-" + validityMonth + "-" + validityYear;
                   console.log(datenew);
                   res.result[i].date = datenew;
                   res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
            }
            $scope.listHistory = res.result;
            console.log("######### res.result", res.result);
            clearData();

          }).error(function(err){
            swal("Getting error from server in showing fund Transfer History by Affiliate");
            clearData();

          });
    }

    $scope.searchHistory = function(){
    $scope.currentPage = 1;

    if(!$scope.transferToFilter && !$scope.transferByFilter && !$scope.transferTypeFilter && !$scope.usersTypeFilter){
      swal("Please provide atleast one filter.");
      return false;
    }
    
    if(!!$scope.transferToFilter && $scope.transferToFilter !== ""){
      console.log("Inside transferToFilter",$scope.transferToFilter);
     $scope.queryObject.transferTo = $scope.transferToFilter;
    }

    if(!!$scope.transferByFilter && $scope.transferByFilter !== ""){
      console.log("Inside transferByFilter",$scope.transferByFilter);
     $scope.queryObject.transferBy = $scope.transferByFilter;
    }

    if(!!$scope.transferTypeFilter && $scope.transferTypeFilter !== ""){
      console.log("Inside transferTypeFilter",$scope.transferTypeFilter);
     $scope.queryObject.transactionType = $scope.transferTypeFilter;
    }

    if(!!$scope.usersTypeFilter && $scope.usersTypeFilter !== ""){
      console.log("Inside usersTypeFilter",$scope.usersTypeFilter);
     $scope.queryObject.usersType = $scope.usersTypeFilter;
    }

    console.log("************** queryObject",JSON.stringify($scope.queryObject));
    // $scope.listTables();
    $scope.countData();
  }

    //$scope.init();
    $scope.countData();

    $scope.reset = function(){
      $scope.transferToFilter = "";
      $scope.transferByFilter = "";
      $scope.transferTypeFilter = "";
      $scope.usersTypeFilter = "";
      $scope.queryObject = {};
      $scope.countData();
    }
    
}]);;angular.module('MetronicApp').controller('fundTransfertoPlayerHistoryController', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside fundTransferToPlayerHistoryController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject  = {};

    $scope.newPageList = function () {
        $scope.init(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
        $window.scrollTo(0, 0);
    }
    $scope.countData = function(){
      var data = $scope.queryObject;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);
      //data.userName = $cookies.get('poker_email');
      // data.userName = $cookies.get('poker_userName');
      data.userName = $rootScope.poker_userName;
      $http.post("/countPlayerHistory",data)
        .success(function(res){
        if(res.success){
            // alert(JSON.stringify(res));
             $scope.totalPage = res.result;
             $scope.newPageList();
             clearData();
          } else{
            alert("Missing Keys");
          }
        }).error(function(err){
        alert(err);
        alert("Getting error from server in showing transfer History",err.stack);
        clearData();
      });  
    }

    $scope.init = function(skipData,limitData){
        showList = true;
        //var data = {};
        var data = $scope.queryObject;
        // console.log($cookies.get('poker_role'));
        console.log($rootScope.poker_role);
        data.skip = skipData;
        data.limit = limitData;
        // data.role = JSON.parse($cookies.get('poker_role'));
        data.role = JSON.parse($rootScope.poker_role);
        //data.userName = $cookies.get('poker_email');
        // data.userName = $cookies.get('poker_userName');
        data.userName = $rootScope.poker_userName;
        console.error(data);
        console.log("The value of cookies is",$cookies.getAll());
        $http.post("/fundTransferPlayerHistory", data)
          .success(function(res){
            console.log("The result in fundTransfer to fundTransferPlayerHistory History", res);
            if(res.result.length == 0){
              swal("No data found")
            }
            for(var i = 0 ; i<res.result.length; i++){
                   var date = new Date(res.result[i].date);
                   var validityMonth = date.getMonth() + 1;
                   var validityDay = date.getDate();
                   var validityYear = date.getFullYear();
                   var datenew = validityDay + "-" + validityMonth + "-" + validityYear;
                   console.log(datenew);
                   res.result[i].date = datenew;
                   res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
            }
            $scope.listHistory = res.result;
            console.log("######### res.result", res.result);
            clearData();
          }).error(function(err){
            swal("Getting error from server in showing fund Transfer History Player");
            clearData();
          });
    }
     // for clearing scope variable
   function clearData(){
      $scope.queryObject = {};
      // $scope.loginId = "";
      // $scope.loginType = "";
      // $scope.promoCode = "";
      // $scope.type = "";
      // $scope.status = "";
      // $scope.startDate = "";
      // $scope.endDate = "";
   }


    $scope.searchHistory = function(){
    $scope.currentPage = 1;
    if(!$scope.transferToFilter && !$scope.transferByFilter && !$scope.transferTypeFilter){
      swal("Please provide atleast one filter.");
      return false;
    }

    if(!!$scope.transferToFilter && $scope.transferToFilter !== ""){
      console.log("Inside transferToFilter",$scope.transferToFilter);
      $scope.queryObject.transferTo = $scope.transferToFilter;
    }

    if(!!$scope.transferByFilter && $scope.transferByFilter !== ""){
      console.log("Inside transferByFilter",$scope.transferByFilter);
      $scope.queryObject.transferBy = $scope.transferByFilter;
    }

    if(!!$scope.transferTypeFilter && $scope.transferTypeFilter !== ""){
      console.log("Inside transferTypeFilter",$scope.transferTypeFilter);
      $scope.queryObject.transactionType = $scope.transferTypeFilter;
    }

    console.log("************** queryObject",JSON.stringify($scope.queryObject));
    // $scope.listTables();
    $scope.countData();
  }
    //$scope.init();
    $scope.countData();

    $scope.reset = function(){
      $scope.transferToFilter = "";
      $scope.transferByFilter = "";
      $scope.transferTypeFilter = "";
      $scope.queryObject = {};
      $scope.countData();

    }
    
}]);;angular.module('MetronicApp').controller('generateBonusCodeController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    console.log("Inside generateBonusCodeController  @@@@@@@@@");
    var bonusData = {};

    $('.date-picker').datepicker('setStartDate', new Date());
    
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.bonusCodeTypes = rootTools.bonusCodeTypes;
    $scope.setVisible = false;



    $scope.newSchedule = function(){
      console.log($('.scheduleDate').val())
      if(!$('.scheduleDate').val()) {
        return false;
      }
      var d =  Number($('.date-picker').data("datepicker").getUTCDate());
      console.log("the value of date is ", d);
      bonusData.validTill = d;
      $scope.init();
    }

    $scope.init = function(){
      console.log($scope.formdata.name);
      console.log($scope.formdata.bonusPercent);
      console.log($rootScope.poker_userName);
      console.log("the value inside cookies of generateBonus is",$cookies.getAll());
      bonusData.codeName = $scope.formdata.name.toUpperCase();
      bonusData.bonusPercent = $scope.formdata.bonusPercent;
      bonusData.bonusCodeType = JSON.parse($scope.formdata.bonusCodeType);
      if($scope.formdata.capAmount){
        bonusData.capAmount = JSON.parse($scope.formdata.capAmount);
      }
      bonusData.tag = $scope.formdata.tag;

      if($scope.tagDescription){
        bonusData.tagDescription = '<li>' + $scope.formdata.tagDescription;
      }
      bonusData.createdBy = $rootScope.poker_userName;
      bonusData.createdAt = Number(new Date());
      bonusData.profile   = JSON.parse($rootScope.poker_role);
      console.log("The bonusData role is ",bonusData.role);
      bonusData.status = "Live";
      console.log("the bonusData is ",JSON.stringify(bonusData));
      if(!!$scope.formdata.name && !!$scope.formdata.bonusPercent && !!bonusData.validTill){
        console.log("All fields are present");
        $http.post("/createBonusCode", bonusData)
        .success(function(res){
          if(res.success){
            swal("Success!", "Bonus code created successfully.");
            console.log(res);
            $scope.formdata = {};
            $scope.generateBonusForm.$setPristine();
            $scope.setVisible = false;

          }else{
            swal("Error!", res.result);
          }
                        
          }).error(function(err){
            swal("Error!", "Getting error from server in creating Bonus code ");
          });

      }
      else{
        console.log("Some fields are missing");
        swal("Error!", "Some Fields are missing");
        return;
      }
    }

    $scope.isCapAmountRequired = function(){
      if(JSON.parse($scope.formdata.bonusCodeType).type == 'oneTime' || JSON.parse($scope.formdata.bonusCodeType).type == 'recurring'){
        $scope.setVisible = true;
      }
      else{
        $scope.setVisible = false;
      }
    }

  }]);;angular.module('MetronicApp').controller('listBonusDepositController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside listBonusDepositController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject = {};

    
    $scope.newPageList = function () {
        $scope.init("", ($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
    }

    $scope.countData = function(){
       // swal("count data call");
       //var data = {};
        // console.log("$$$$$$$$$$$$$$$$$$4",$cookies.get('poker_userName'));
        console.log("$$$$$$$$$$$$$$$$$$4",$rootScope.poker_userName);
        var data = $scope.queryObject;
        //data.createdBy = $cookies.get('poker_email');
        //data.profile = JSON.parse($cookies.get('poker_role'));

      $http.post("/countBonusDeposit",data)
        .success(function(res){
        if(res.success){
            // swal(JSON.stringify(res));
             $scope.totalPage = res.result;
              if(res.result.length == 0){
                swal("Error", "No data found!")
              }
             $scope.newPageList();
             clearData();
          } else{
            swal("Missing Keys");
          }
        }).error(function(err){
        // swal(err);
        swal("Getting error from server in showing rake rules",err.stack);
        clearData();
      });  
    }

    $scope.init = function(id, skipData, limitData){
        showList = true;
        //var data = {};
        var data = $scope.queryObject;
        console.log("$$$$$$$$$$$$$$$$$$4",$rootScope.poker_userName);

        data.skip = skipData;
        data.limit = limitData;
        if($stateParams.bonusCodeId){
          data._id = $stateParams.bonusCodeId;
        }
        data.keyFromDashboard = 1; 

        $http.post("/listBonusDeposit", data)
          .success(function(res){
            console.log("The result in listBonusDepositController", res.result);
            if(res.result.length == 0){
              swal("Error", "No data found!")
            }
            for(var i = 0 ; i<res.result.length; i++){
              var validityDate = new Date(res.result[i].validTill);
              var createdAt    = new Date(res.result[i].createdAt);
              var validityMonth = validityDate.getMonth() + 1;
              var validityDay = validityDate.getDate();
              var validityYear = validityDate.getFullYear();
              var validityMonth = validityDate.getMonth() + 1;
              var createdAtDay   = createdAt.getDate();
              var createdAtYear   = createdAt.getFullYear();
              var createdAtMonth   = createdAt.getMonth() + 1;
              var validTill = validityDay + "-" + validityMonth + "-" + validityYear;
              var creationDate = createdAtDay + "-" + createdAtMonth + "-" + createdAtYear;
              console.log(validTill);
              console.log(creationDate);
              res.result[i].validTill = validTill;
              res.result[i].createdAt = creationDate;
              res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
            }

            if(id){
              // res.result[0].
              $scope.formdata = res.result[0];
              $scope.formdata2 = 'asasasas';
              $scope.formdata.name = res.result[0].codeName;
              $scope.formdata.tag = res.result[0].tag;
              
              res.result[0].tagDescription = res.result[0].tagDescription.split('</li><li>').join('\n');
              res.result[0].tagDescription = res.result[0].tagDescription.split('</li>').join('');
              res.result[0].tagDescription = res.result[0].tagDescription.split('<li>').join('');
              $scope.formdata.tagDescription = res.result[0].tagDescription;


            }
            
            $scope.listBonus = res.result;
            clearData();
          }).error(function(err){
            swal("Error!", "Getting error from server in showing Bonus Deposit");
            clearData();
          });
    }

   function clearData(){
      $scope.queryObject = {};
      // $scope.loginId = "";
      // $scope.loginType = "";
      // $scope.promoCode = "";
      // $scope.type = "";
      // $scope.status = "";
      // $scope.startDate = "";
      // $scope.endDate = "";
   }
     //for searching history data
  $scope.searchHistory = function(){
    $scope.currentPage = 1;

    if(!$scope.codeNameFilter && !$scope.createdByFilter && !$scope.bonusPercentFilter){
      swal("Please provide any one filter.");
      return false;
    }

    if($scope.codeNameFilter ){
      console.log("Inside codeNameFilter",$scope.codeNameFilter);
      $scope.queryObject.codeName = $scope.codeNameFilter.toUpperCase();
    }
     
    if($scope.createdByFilter){
      console.log("Inside createdByFilter",$scope.createdByFilter);
      $scope.queryObject.createdBy = $scope.createdByFilter;
    }
    if($scope.bonusPercentFilter){
      console.log($scope.bonusPercentFilter, parseInt($scope.bonusPercentFilter), typeof (parseInt($scope.bonusPercentFilter)))
      if (!(/^[1-9][0-9]+$/.test($scope.bonusPercentFilter))) {
        console.log("Please provide valid input for bonus percent")
        swal("Please provide valid input for bonus percent.");
        $scope.bonusPercentFilter = "";
        return false;
      }
      
      console.log("Inside bonusPercentFilter",$scope.bonusPercentFilter);
      $scope.queryObject.bonusPercent = parseInt($scope.bonusPercentFilter);
    }    

    console.log("************** $scope.queryObject",JSON.stringify($scope.queryObject));
    $scope.countData();
  }


  if($stateParams.bonusCodeId){
    $scope.init($stateParams.bonusCodeId, 0, 0);
  }


   $scope.submitUpdate = function(){
      console.log($scope.formdata.name);
      console.log($scope.formdata.bonusPercent);
      console.log($rootScope.poker_userName);
      var bonusData = {};
      bonusData._id = $stateParams.bonusCodeId;
      bonusData.tag = $scope.formdata.tag;
      if($scope.tagDescription){
        bonusData.tagDescription = '<li>' + $scope.formdata.tagDescription;
      }
      bonusData.updatedBy = $rootScope.poker_userName;
      bonusData.updatedByRole = JSON.parse($rootScope.poker_role);
      console.log("the bonusData is ",JSON.stringify(bonusData));
      console.log("All fields are present");
      $http.post("/updateBonusCode", bonusData)
      .success(function(res){
        if(res.success){
          swal("Success!", "Bonus code updated successfully.");
          console.log(res);
          $scope.formdata = {};
          $scope.generateBonusForm.$setPristine();
          $scope.setVisible = false;
          $location.path('/listBonusDeposit')

        }else{
          swal("Error!", res.result);
        }
                      
        }).error(function(err){
          swal("Error!", "Getting error from server in updating Bonus code ");
        });
      if(!!$scope.formdata.name && !!$scope.formdata.bonusPercent && !!bonusData.validTill){

      }
      
    }

  $scope.reset = function(){
    $scope.queryObject = {};
    $scope.codeNameFilter = "";
    $scope.createdByFilter = "";
    $scope.bonusPercentFilter = "";
    $scope.countData();

  }
    
}]);;angular.module('MetronicApp').controller('listPlayersController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
    });
    console.log("yessss, list players controller loaded");

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.setHidden = false;
    $scope.setDisabledForSubAff = false;
    // if((JSON.parse($cookies.get('poker_role'))).level < 0 ){
    if((JSON.parse($rootScope.poker_role)).level < 0 ){
      $scope.setDisabledForSubAff = true;
    }

    
    $scope.newPageList = function () {
        console.log("totalpage____________________________"+$scope.totalPage);
        $scope.listPlayers("",($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
        $window.scrollTo(0, 0);
    }


    $scope.searchPlayer = function(){
      if(!$scope.userId){
        swal("Please enter a username.");
        return false;
      }
      else{
        $scope.countData();
      }
    }

    $scope.reset = function(){
      $scope.userId = "";
      $scope.isOrganic = "";
      $scope.countData();
    }


    $scope.data = {};
    $scope.countData = function(){
      var data ={};
      // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
      if((JSON.parse($rootScope.poker_role)).level <= 0){
        // data.userName = $cookies.get('poker_userName');
        data.userName = $rootScope.poker_userName;
      }
      data.isOrganic = "All";
      if($scope.isOrganic == 'true'){
        data.isOrganic = true;
      }
      if($scope.isOrganic == 'false'){
        data.isOrganic = false;
      }
      if($scope.isOrganic == 'All'){
        data.isOrganic = 'All';
      }
      if($scope.userId){
        data.userId = $scope.userId;
      }

      $http.post("/countlistPlayer",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
        swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server in showing players list",err.stack);
      });  
    }  



     $scope.listPlayers = function(id,skipData,limitData,cb){
      var data ={};
      if(id && id.length > 0){
        data._id = id;
      }
      console.log("id== ", data, $scope.isOrganic);
      data.isOrganic = "All";
      if($scope.isOrganic == 'true'){
        data.isOrganic = true;
      }
      if($scope.isOrganic == 'false'){
        data.isOrganic = false;
      }
      if($scope.isOrganic == 'All'){
        data.isOrganic = 'All';
      }
      if($scope.userId){
        data.userId = $scope.userId;
      }
      data.skip = skipData;
      data.limit = limitData;
      // console.log("line 48== ", $cookies.get('poker_userName'));
      console.log("line 48== ", $rootScope.poker_userName);
      // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
      if((JSON.parse($rootScope.poker_role)).level <= 0){
        // data.userName = $cookies.get('poker_userName');
        data.userName = $rootScope.poker_userName;
      }

      console.log("data ", skipData, limitData, data);

      var listPlayerResult = {};
      $http.post("/listUsersAndCalculateBonus", data)
      .success(function(res){
          console.log("res.result---------", res.result);
           $scope.dataList = res.result;
          for(var i = 0; i<res.result.length; i++){
            //$scope.dataList[i].parent = res.result[i].isParentUserName + "/" + res.result[i].userName ;mobileNumberNew
            $scope.dataList[i].parent = res.result[i].isParentUserName ? (res.result[i].isParentUserName + "(" +res.result[i].parentType + ")") : "";
            $scope.dataList[i].mobileNumberNew = parseInt(res.result[i].mobileNumber) ;
            var date = new Date(res.result[i].createdAt);
            // console.log("the date is ------",date);
            // console.log("created at ------",res.result[i].createdAt);
            var validityMonth = date.getMonth() + 1;
            var validityDay = date.getDate();
            var validityYear = date.getFullYear();
            
          }
          $scope.dataList = res.result;
          // $scope.dataList[0].status = res.result[0].isBlocked ? "BLOCKED" : "ACTIVE"
          $scope.editData = res.result[0];
          listPlayerResult.result = res.result;
          var data1 = {};
          // if(id){
          //   $scope.formData = res.result[0];
          //   data1._id = listPlayerResult.result[0].rakeRule;
          // }
          if(cb instanceof Function){
            cb();
          }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing Players");
      });
    }

    $scope.listPlayersAffiliate = function(userName,skipData,limitData){
      var data ={};
      if(userName && userName.length > 0){
        data.userName = userName;
      }
      console.log("userName== ", data);
      data.isOrganic = "All";
      if($scope.isOrganic == 'true'){
        data.isOrganic = true;
      }
      if($scope.isOrganic == 'false'){
        data.isOrganic = false;
      }
      if($scope.isOrganic == 'All'){
        data.isOrganic = 'All';
      }      

      data.skip = skipData;
      data.limit = limitData;
      // console.log("line 48== ", $cookies.get('poker_userName'));
      console.log("line 48== ", $rootScope.poker_userName);
      // if((JSON.parse($cookies.get('poker_role'))).level == 0){
      //   data.userName = $cookies.get('poker_userName');
      // }


      var listPlayerResult = {};
      $http.post("/listUsersAndCalculateBonus", data)
      .success(function(res){
          console.log("res.result---------", res.result);
          $scope.dataList = res.result;
          for(var i = 0; i<res.result.length; i++){
            //$scope.dataList[i].parent = res.result[i].isParentUserName + "/" + res.result[i].userName ;mobileNumberNew
            $scope.dataList[i].parent = res.result[i].parentType + "/" + res.result[i].isParentUserName ;
            $scope.dataList[i].mobileNumberNew = parseInt(res.result[i].mobileNumber) ;
            var date = new Date(res.result[i].createdAt);
            console.log("the date is ------",date);
            console.log("created at ------",res.result[i].createdAt);
            var validityMonth = date.getMonth() + 1;
            var validityDay = date.getDate();
            var validityYear = date.getFullYear();
            var datenew = validityDay + "-" + validityMonth + "-" + validityYear;
            console.log(datenew);
            res.result[i].datenew = datenew;
          }
          $scope.dataList = res.result;
          $scope.dataList[0].status = res.result[0].isBlocked ? "BLOCKED" : "ACTIVE"
          $scope.editData = res.result[0];
          listPlayerResult.result = res.result;
          var data1 = {};
          if(userName){
            $scope.formData = res.result[0];
            data1._id = listPlayerResult.result[0].rakeRule;
          }
      }).error(function(err){
        swal("Error!", "Getting error from server in showing Players");
      });

      
    }
    
    if($stateParams.affiliateId){
      console.log("stateParams", $stateParams.affiliateId);
      $scope.setHidden = true;
      $scope.listPlayersAffiliate($stateParams.affiliateId, 0, 20);
    }
    
    else if($stateParams.playerId){
      console.log("stateParams", $stateParams.playerId);
      $scope.listPlayers($stateParams.playerId, 0, 20);
    }
    

    else
    {
      $scope.countData();
    }

    $scope.filterPlayers = function(){
        if($stateParams.affiliateId){
          console.log("stateParams", $stateParams.affiliateId);
          $scope.listPlayersAffiliate($stateParams.affiliateId, 0, 20);
        }
        
        else if($stateParams.playerId){
          console.log("stateParams", $stateParams.playerId);
          $scope.listPlayers($stateParams.playerId, 0, 20);
        }
    

        else{
          $scope.countData();
        }

    }

    $scope.submit = function(){
      console.log("submit function called in listPlayersController", $scope.dataList[0].status);
      var data = angular.copy($scope.dataList[0]);
      if($scope.dataList[0].status == 'Active'){
        data.isBlocked = false;
      }

      if($scope.dataList[0].status == 'Block'){
        data.isBlocked = true;
      }
      // data.loggedInUser = $cookies.get('poker_userName');
      data.loggedInUser = $rootScope.poker_userName;
      // data.userRole = JSON.parse($cookies.get('poker_role'));
      data.userRole = JSON.parse($rootScope.poker_role);
      if(data.userRole.level < 1 && !$scope.dataList[0].isParentUserName){
        swal("Error", "Parent ID cannot be blank!");
        return false;
      }
      console.log("data===== ", data);

      $http.put("/updatePlayer", data)
        .success(function(res){
          if(res.rTL){
            swal("Session Expired");
            $location.path('/login');
          } else{
            if(res.success){
              console.log("listPlayersController line 88==", res);
              swal("Success!", "Player updated successfully.");
              $location.path('/listPlayer');
              //$scope.listPlayers();
            } else{
              swal("Error!", res.info);
              console.log("=========line 107", res.info);
              // swal("This table is in running state. Cannot disable!")
            }
            $cookies.put('poker_token', res.authToken);
          }
        }).error(function(err){
          // swal(err);
          swal("Error!", "Getting error from server in updating table!");
          // swal("Getting error from server in updating tables");
        });

    }

    $scope.forgotPasswordLogin = function(emailId){
      console.log(emailId);
      console.log($cookies.getAll());
      var data = {};
      data.emailId = emailId;
      $http.post("/forgotPasswordUser", data)
      .success(function(res){
        console.log("res is ",res);
        if(res.successDashboard){
          swal("Success!", "A link to reset your password has been sent to your registered email.");
          $scope.email = " ";
          console.log(res);
        }
        else{
          swal("Error!", res.result);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server  ");
      });
    }

    $scope.resendVerificationLink = function(emailId, userName){
      console.log(emailId);
      console.log($cookies.getAll());
      var data = {};
      data.emailId = emailId;
      data.userName = userName;
      $http.post("/resendVerificationLinkDasboard", data)
      .success(function(res){
        console.log("res is ",res);
        if(res.success){
          swal("Success!", "A link to verify email has been sent on registered email.");
          $scope.email = " ";
          console.log(res);
        }
        else{
          swal("Error!", res.info);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server  ");
      });
    }

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
      template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
      format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};

      var table=$(tableId),
        ctx={worksheet:worksheetName,table:table.html()},
        href=uri+base64(format(template,ctx));
        console.log("ctx ", table.context);
      return href;
    }


    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listPlayers("", 0, 0, function(){
        $window.scrollTo(0, 0);
        setTimeout(function() {
          location.href=Excel(tableId,'sheet_name');
        }, 500);
      });
    };

}]);


;angular.module('MetronicApp').controller('listRakeRulesController', ['$scope', '$http','$rootScope','$stateParams' ,'$cookies', '$location', function($scope, $http, $rootScope, $stateParams, $cookies, $location) {
    $scope.data = {};
    $scope.listRule = [];
    var token = {};
    var showList = true;
    console.log("Inside listrakerulesController @@@@@@@@@");
    $scope.showList = function(){
      return showList;
    }

    $scope.init = function(){
        showList = true;
        //token = $cookies.get('poker_token');
        //console.log("#$#$$#$#$ the token inside listRakeRulesController is", token );
        var data = {};
        //data.authToken = token;
        //console.log("Inside listRakeRule the data for routing is ************",data);
        $http.post("/listRakeRule", data)
          .success(function(res){
            //console.log("The result inside listRakeRule is ", JSON.stringify(res));
            $scope.listRule = res.result;
              // if(res.rTL){
              //   //swal("Session Expired");
              //   //$location.path('/login');
              // } else{
              //   if(res.success){
              //     console.log(res);
              //     $scope.listRule = res.result;
              //   } else{
              //     swal("Missing Keys")
              //   }
              //     $cookies.put('poker_token', res.authToken);
              // }
          }).error(function(err){
            // swal(err);
            swal("Getting error from server in showing rake rule");
          });
    }

    // $scope.createrule = function(){
    //   $location.path('/createrakerules');
    // }

    $scope.edit = function(data){
      console.log("Edit rakerule called @@@@@@@");
      showList = false;
      $scope.data = data;
    }

    // $scope.cancel = function(){
    //   $scope.init();
    // }

    // $scope.duplicate = function(rule){
    //   var data = angular.copy(rule);
    //   data.authToken = token;
    //   data.name = (data.name)+"_dup";
    //   delete data._id;
    //   $http.post("/createRakeRule", data)
    //     .success(function(res){
    //         if(res.rTL){
    //           swal("Session Expired");
    //           $location.path('/login');
    //         } else{
    //           if(res.success){
    //             swal("Successfull !!");
    //             $scope.init();
    //           } else{
    //             swal("Missing Keys")
    //           }
    //             $cookies.put('poker_token', res.authToken);
    //         }
    //     }).error(function(err){
    //       // swal(err);
    //       swal("Getting error from server in duplicate rake rule");
    //     });
    // }

    // $scope.add = function(){ //not used - as of 27 oct
    //   var temp = {
    //     "level" : $scope.data.list.length+1,
    //     "smallBlind" : 0,
    //     "bigBlind": 0,
    //     "minutes": 0
    //   }
    //   $scope.data.list.push(temp);
    // }

    // $scope.del = function(index){ //not used - as of 27 oct
    //   $scope.data.list.splice(index, 1);
    // }

    //get rake rules
  var getRakeRules = function(){
      console.log('get rake rules', JSON.stringify($scope.data));
    }

    // $scope.submit = function(formValid){
    //   if(formValid){
    //     console.log("validation passed",formValid);
    //   } else {
    //     console.log("validation failed",formValid);
    //     return;
    //   }
    //   var data = angular.copy($scope.data);
    //   console.log('lines 88', JSON.stringify(data));
    //   if(data.list.length){
    //     if(validateRake(data.list, data.list.length)){
    //       data.authToken = token;
    //       $http.put("/updateRakeRules", data)
    //         .success(function(res){
    //             if(res.rTL){
    //               swal("Session Expired");
    //               $location.path('/login');
    //             } else{
    //               if(res.success){
    //                 swal("Successfully updated");
    //                 $scope.init();
    //               } else{
    //                 swal("Missing Keys")
    //               }
    //                 $cookies.put('poker_token', res.authToken);
    //             }
    //         }).error(function(err){
    //           // swal(err);
    //           swal("Getting error from server in updating rake rule");
    //         });
    //     } else{
    //       swal("Rake can't be more than 5%");
    //     }
    //   } else{
    //     swal("Enter some rule");
    //   }
    // }

    // function validateRake(list, length){
    //     for(var i=0; i<length; i++){
    //         if(list[i].rakePercent > 5)
    //         {
    //             return false
    //         }
    //     }
    //     return true;
    // }

    // $scope.disable = function(list){
    //   var data = {};
    //   data.authToken = token;

    //   if(list.isActive == true){
    //     data.isActive = false;
    //   } else{
    //     data.isActive = true;
    //   }
    //   data.id = list._id;
    //   $http.put("/disableRakeRules", data)
    //     .success(function(res){
    //       if(res.rTL){
    //         swal("Session Expired");
    //         $location.path('/login');
    //       } else{
    //         if(res.success){
    //           swal("Successfull !!");
    //           $scope.init();
    //         } else{
    //           swal("Unable to disable !!");
    //         }
    //         $cookies.put('poker_token', res.authToken);
    //       }
    //     }).error(function(err){
    //       // swal(err);
    //       swal("Getting error from server in updating rake rule");
    //     });
    // }


  $scope.init();

}]);
;angular.module('MetronicApp').controller('listRakerulesController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.data = {};
    $scope.listRule = [];
    $scope.data_test={};
    $scope.data_test.description="QWERTYUI";
    if(!$rootScope.isAdminLogin){
        console.log('yes')
        $location.path('/login.html')
    }
    var token = {};
    var showList = true;
    console.log("Inside listrakerulesController @@@@@@@@@");
    $scope.showList = function(){
      return showList;
    }

    $scope.init = function(id){
        showList = true;
        //token = $cookies.get('poker_token');
        //console.log("#$#$$#$#$ the token inside listRakeRulesController is", token );
        var data = {};
        if(id){
            data._id = id;
        }
        //data.authToken = token;
        //console.log("Inside listRakeRule the data for routing is ************",data);
        $http.post("/listRakeRule", data)
          .success(function(res){
            //console.log("The result inside listRakeRule is ", JSON.stringify(res));
            $scope.listRule = res.result;
            if(id){
                $scope.listRule = res.result[0];
            }
            console.log("######### res.result", res.result);
              // if(res.rTL){
              //   //swal("Session Expired");
              //   //$location.path('/login');
              // } else{
              //   if(res.success){
              //     console.log(res);
              //     $scope.listRule = res.result;
              //   } else{
              //     swal("Missing Keys")
              //   }
              //     $cookies.put('poker_token', res.authToken);
              // }
          }).error(function(err){
            // swal(err);
            swal("Getting error from server in showing rake rule");
          });
    }

    // $scope.createrule = function(){
    //   $location.path('/createrakerules');
    // }

    $scope.edit = function(data){
      console.log("Edit rakerule called @@@@@@@");
      showList = false;
      $scope.data = data;
    }

    $scope.cancel = function(){
      $scope.init();
    }

    // $scope.duplicate = function(rule){
    //   var data = angular.copy(rule);
    //   data.authToken = token;
    //   data.name = (data.name)+"_dup";
    //   delete data._id;
    //   $http.post("/createRakeRule", data)
    //     .success(function(res){
    //         if(res.rTL){
    //           swal("Session Expired");
    //           $location.path('/login');
    //         } else{
    //           if(res.success){
    //             swal("Successfull !!");
    //             $scope.init();
    //           } else{
    //             swal("Missing Keys")
    //           }
    //             $cookies.put('poker_token', res.authToken);
    //         }
    //     }).error(function(err){
    //       // swal(err);
    //       swal("Getting error from server in duplicate rake rule");
    //     });
    // }

    // $scope.add = function(){ //not used - as of 27 oct
    //   var temp = {
    //     "level" : $scope.data.list.length+1,
    //     "smallBlind" : 0,
    //     "bigBlind": 0,
    //     "minutes": 0
    //   }
    //   $scope.data.list.push(temp);
    // }

    // $scope.del = function(index){ //not used - as of 27 oct
    //   $scope.data.list.splice(index, 1);
    // }

    //get rake rules
  var getRakeRules = function(){
      console.log('get rake rules', JSON.stringify($scope.data));
    }

    $scope.submit = function(formValid){
      // if(formValid){
      //   console.log("validation passed",formValid);
      // } else {
      //   console.log("validation failed",formValid);
      //   return;
      // }
      console.log("Data to submit is ", JSON.stringify($scope.listRule));
      var data = angular.copy($scope.listRule);
      console.log('lines 88', JSON.stringify(data));
      if(data.list.length){
        if(validateRake(data.list, data.list.length)){
          data.authToken = token;
          $http.put("/updateRakeRules", data)
            .success(function(res){
                if(res.rTL){
                  swal("Session Expired");
                  $location.path('/login');
                } else{
                  if(res.success){
                    swal("Successfully updated");
                    // $scope.init();
                    $location.path('/listRakeRule');
                  } else{
                    swal("Missing Keys")
                  }
                    $cookies.put('poker_token', res.authToken);
                }
            }).error(function(err){
              // swal(err);
              swal("Getting error from server in updating rake rule");
            });
        } else{
          swal("Rake can't be more than 5%");
        }
      } else{
        swal("Enter some rule");
      }
    }

    function validateRake(list, length){
        for(var i=0; i<length; i++){
            if(list[i].rakePercent > 5)
            {
                return false
            }
        }
        return true;
    }

    // $scope.disable = function(list){
    //   var data = {};
    //   data.authToken = token;

    //   if(list.isActive == true){
    //     data.isActive = false;
    //   } else{
    //     data.isActive = true;
    //   }
    //   data.id = list._id;
    //   $http.put("/disableRakeRules", data)
    //     .success(function(res){
    //       if(res.rTL){
    //         swal("Session Expired");
    //         $location.path('/login');
    //       } else{
    //         if(res.success){
    //           swal("Successfull !!");
    //           $scope.init();
    //         } else{
    //           swal("Unable to disable !!");
    //         }
    //         $cookies.put('poker_token', res.authToken);
    //       }
    //     }).error(function(err){
    //       // swal(err);
    //       swal("Getting error from server in updating rake rule");
    //     });
    // }
  if($stateParams.rakeRuleId){
      console.log("stateParams", $stateParams.rakeRuleId);
      $scope.init($stateParams.rakeRuleId);
    }
    else
    {
      $scope.init();
    }  

  

  }]);;angular.module('MetronicApp').controller('monthlyCashoutReportController', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside monthlyCashoutReportController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject = {};
    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }


    $scope.init = function(){
      showList = true;
      var data = {};
      // console.log("$$$$$$$$$$$$$$$$$$4",$cookies.get('poker_userName'));
      console.log("$$$$$$$$$$$$$$$$$$4",$rootScope.poker_userName);
      // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
      if((JSON.parse($rootScope.poker_role)).level <= 0){
         // $scope.queryObject.loginId = $cookies.get('poker_userName');
         $scope.queryObject.loginId = $rootScope.poker_userName;
      }
      data = $scope.queryObject;
      
      var startDate =  new Date($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  new Date($('.date-picker2').data("datepicker").getUTCDate());
      startDate.setDate(1);
      endDate.setDate(1);
      endDate.setMonth(endDate.getMonth()+1);
      endDate = endDate - 1000;

      if(!$scope.startDate){
       startDate = new Date();
       startDate.setUTCMonth(startDate.getUTCMonth()-1);
       startDate.setUTCDate(1);
       startDate.setUTCHours(0);
       startDate.setUTCMinutes(0);
       startDate.setUTCSeconds(0);
       startDate.setUTCMilliseconds(0);
       endDate = new Date();
     }
      
      data.createdAt = { "$gte": Number(startDate), "$lt": Number(endDate)};
      // data.userName = $cookies.get('poker_userName');
      data.userName = $rootScope.poker_userName;
      // data.role     = JSON.parse($cookies.get('poker_role'));
      data.role     = JSON.parse($rootScope.poker_role);
      $http.post("/monthlyCashoutReport", data)
        .success(function(res){
          console.log("The result in monthlyCashoutReportController", res.result);
          $scope.listTransaction = res.result;
        }).error(function(err){
          swal("Error!", "Getting error from server in showing monthly Cashout History");
      });
    }

    $scope.searchHistory = function(){
      console.log("************** queryObject",JSON.stringify($scope.queryObject));
      if(!$scope.startDate || !$scope.endDate){
        swal("Please provide start date & end date.")
        return false;
      }
      $scope.init();
    }

    $scope.init();

    $scope.resetForm = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $('.date-picker1').data("datepicker").value = "";
      $scope.init();
    }

    var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      var exportHref=Excel(tableId,'sheet_name');
      $timeout(function(){location.href=exportHref;},100); // trigger download
    };
    
    
}]);;angular.module('MetronicApp').controller('PlayerBannedReportController', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside playerBannedReportController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.filter = "players";

    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    $('.date-picker3').datepicker('setEndDate', new Date());
    $('.date-picker4').datepicker('setEndDate', new Date());

    var rakeSort = 1;
    var dateSort = 1;
    var nameSort = 1;
    var loyaltyLevelArray = ['Bronze', 'Chrome', 'Silver', 'Gold', 'Diamond', 'Platinum']


    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }
    $scope.fixEndDateJoin = function(){
      $('.date-picker4').datepicker('setStartDate', $('.date-picker3').data("datepicker").getUTCDate());
      if($scope.startDateJoin > $scope.endDateJoin){
        $scope.endDateJoin = "";
      }
    }

    $scope.newPageList = function () {
      console.log("totalpage____________________________"+$scope.totalPage);
        $scope.listPlayerBannedData(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
        $window.scrollTo(0, 0);
    }

    $scope.initCountData = function(){
      var data = {};
      var endDate = Number(new Date());
      var startDate = endDate - (30*24*60*60*1000);
      data.startDate = startDate;
      data.endDate = endDate;

      data.filter = $scope.filter;
     
      console.log("data-----------", data);
      $http.post("/countPlayerBannedData",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
              console.log(res);
              swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server",err);
      });  
    }

    $scope.initCountData();

    $scope.countData = function(){
      if(!$scope.startDate){
        swal("Error!", "Please select a start date!");
        return;
      }

      if(!$scope.endDate){
        swal("Error!", "Please select a end date!");
        return;
      }

      var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate());
      var data ={};

      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate + (24*60*60*1000) - 1000;
      }

      data.filter = $scope.filter;
      if($scope.filter == "players"){
        if($scope.userId){
          data.userName = $scope.userId;
        }
      }  
      if($scope.filter == "affiliates"){
        if($scope.userId){
          data.parent = $scope.userId;
        } else {
          swal("Error!", "Please enter Affiliate Id");
        }
      } 
      if($scope.startDateJoin){
        var startDateJoin =  Number($('.date-picker3').data("datepicker").getUTCDate());
      }
      if($scope.endDateJoin){
        var endDateJoin =  Number($('.date-picker4').data("datepicker").getUTCDate())+ (24*60*60*1000) - 1000;
      }

      if($scope.reasonForBan){
        data.reasonForBan = $scope.reasonForBan;
      }
      if($scope.minRake){
        data.minRake = $scope.minRake;
      }
      if($scope.maxRake){
        data.maxRake = $scope.maxRake;
      }
      if($scope.megaCircle){
        data.megaCircle = $scope.megaCircle;
      }
      if(startDateJoin){
        console.log("Start Join Date------", startDateJoin);
        data.startDateJoin = startDateJoin;
      }
      if(endDateJoin){
        console.log("End Join Date------", endDateJoin);
        data.endDateJoin = endDateJoin+ (24*60*60*1000) - 1000;
      }
      
      console.log("data-----------", data);

      $http.post("/countPlayerBannedData",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
              console.log(res);
              swal("Error!", res.info);
          }
        }).error(function(err){
        swal("Getting error from server",err);
      });  
    }

    $scope.listPlayerBannedData = function(skipData,limitData,cb){
      var data = {};
      
      data.skip = skipData;
      data.limit = limitData;
      if($scope.startDate){
        var startDate =  Number($('.date-picker1').data("datepicker").getUTCDate());
      }
      if($scope.endDate){
        var endDate =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000) - 1000;
      }
      if(!$scope.startDate && !$scope.endDate){
        var endDate = Number(new Date());
        var startDate = endDate - (30*24*60*60*1000);
      }

      if(startDate){
        data.startDate = startDate;
      }

      if(endDate){
        data.endDate = endDate;
      }
      if($scope.startDateJoin){
        var startDateJoin =  Number($('.date-picker3').data("datepicker").getUTCDate());
      }
      if($scope.endDateJoin){
        var endDateJoin =  Number($('.date-picker4').data("datepicker").getUTCDate())+ (24*60*60*1000) - 1000;
      }
      data.filter = $scope.filter;
      if($scope.userId){
        if($scope.filter == "affiliates"){
          data.parent = $scope.userId;
        } else {
          data.userName = $scope.userId;
        }
      }
      if($scope.reasonForBan){
        data.reasonForBan = $scope.reasonForBan;
      }
      if($scope.minRake){
        data.minRake = $scope.minRake;
      }
      if($scope.maxRake){
        data.maxRake = $scope.maxRake;
      }
      if($scope.megaCircle){
        data.megaCircle = $scope.megaCircle;
      }
      if(startDateJoin){
        data.startDateJoin = startDateJoin;
      }
      if(endDateJoin){
        data.endDateJoin = endDateJoin;
      }

      console.log("data in line 121", data);

      $http.post("/listPlayerBannedData", data)
      .success(function(res){
        if(res.success){
          for (var i = 0; i < res.result.length; i++) {
            res.result[i].index = i+1;
            res.result[i].megaCircle = loyaltyLevelArray[res.result[i].megaCircle - 1];
            res.result[i].megaPoints = (res.result[i].megaPoints).toFixed(2);
            res.result[i].totalRake = (res.result[i].totalRake).toFixed(2);
          }
          $scope.dataList = res.result;
        } else {
          swal("Error!", res.info);
        }
      }).error(function(err){
        swal("Getting error from server",err);
      }); 
    }


    // for clearing scope variable
    $scope.clearData = function(){
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.userId = "";
      $scope.filter = "players";
      $scope.reasonForBan = "";
      $scope.minRake = "";
      $scope.maxRake = "";
      $scope.megaCircle = "";
      $scope.startDateJoin = "";
      $scope.endDateJoin = "";
      $scope.initCountData();
   }


    $scope.sortDataByRake = function(){
      rakeSort = rakeSort * -1;
      if(rakeSort == 1){
        $scope.dataList.sort(function(a, b){
          return parseFloat(a.totalRake) - parseFloat(b.totalRake);
        })
      }

      else{
        $scope.dataList.sort(function(a, b){
          return parseFloat(b.totalRake) - parseFloat(a.totalRake);
        })
      }
    }



    $scope.sortDataByDate = function(){
      dateSort = dateSort * -1;
      if(dateSort == 1){
        $scope.dataList.sort(function(a, b){
          return parseFloat(a.createdAt) - parseFloat(b.createdAt);
        })
      }
      else{
        $scope.dataList.sort(function(a, b){
          return parseFloat(b.createdAt) - parseFloat(a.createdAt);
        })
      }
    }


    $scope.sortDataByName = function(){
      nameSort = nameSort * -1;
      if(nameSort == 1){
        $scope.dataList.sort(function(a, b){
          if(a.userName > b.userName) return -1;
          if(a.userName < b.userName) return 1;
        })
      }

      else{
        $scope.dataList.sort(function(a, b){
          if(a.userName < b.userName) return -1;
          if(a.userName > b.userName) return 1;
        })
      }
    }

    


  var Excel = function(tableId,worksheetName){
    var uri='data:application/vnd.ms-excel;base64,',
      template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
      format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
     
        var table=$(tableId),
          ctx={worksheet:worksheetName,table:table.html()},
          href=uri+base64(format(template,ctx));
          console.log("ctx ", table.context);
        return href;
  }
 
  $scope.exportData = function (tableId) {
    console.log("totalpage____________________________"+$scope.totalPage);
    $scope.init(0, 0, function(){
      $window.scrollTo(0, 0);

      $timeout(function(){
        location.href=Excel(tableId,'sheet_name');
        $scope.init(0, 20);
      },500); // trigger download
    });
  };
    
}]);;angular.module('MetronicApp').controller('playerReportChartController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) {
    console.log("Inside playerReportChartController  @@@@@@@@@");
    var data = {};

    $('.date-picker').datepicker('setEndDate', new Date());

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.setVisible = false;

    $scope.newSchedule = function(){
      console.log($('.scheduleDate').val())
      if(!$('.scheduleDate').val()) {
          return false;
      }
      var d = ($('.date-picker').data("datepicker").getUTCDate());
      // d.setDate(1);
      // d.setHours(0);
      // d.setMilliseconds(0);
      // d.setMinutes(0);
      // d.setSeconds(0);
      d.setUTCDate(1);
      d.setUTCHours(0);
      d.setUTCMinutes(0);
      d.setUTCSeconds(0);
      d.setUTCMilliseconds(0);
      console.log("the value of date is ", Number(d));
      data.addeddate = Number(d);
      $scope.init();
    }
    $scope.init = function(){
      $scope.setVisible = true;
      console.log($scope.formdata.name);
      // console.log($cookies.get('poker_userName'));
      console.log($rootScope.poker_userName);
      console.log("the value inside cookies of playerReportChartController is",$cookies.getAll());
      data.userName = $scope.formdata.name;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);
      if(data.role.level<=0){
        // data.loginId = $cookies.get('poker_userName');
        data.loginId = $rootScope.poker_userName;
      }
      console.log("the data in playerReportChartController ",JSON.stringify(data));
      if(!!$scope.formdata.name && !!data.addeddate){
        console.log("All fields are present");
        $http.post("/findPlayerDataChart", data)
        .success(function(res){
          if(res.success){
              $scope.setVisible = true;
              swal("Success!", "Data Retreived  successfully.");
              var object = [];
              // for(var i = 0; i<res.result.currentMonthRakeData.length;i++){
                  console.log("*****************",res.result.currentMonthRakeData);
                  var  j = 1;
                  for(var i = res.result.currentMonthRakeData.length-1; i>=0;i--){
                      var tempObj = {};
                      tempObj.dailyRakeCurrentMonth = res.result.currentMonthRakeData[i].dailyRake;
                      tempObj.day = j;
                      // tempObj.dailyRakePrevMonth = res.result.previousMonthRakeData[i].dailyRake;
                      j = j + 1;
                      object.push(tempObj);
                  }

                  // console.log("###############",object);
              var chart = AmCharts.makeChart( "chartdiv2", {
              "type": "serial",
              "addClassNames": true,
              "theme": "light",
              "autoMargins": false,
              "marginLeft": 80,
              "marginRight": 8,
              "marginTop": 10,
              "marginBottom": 26,
              "balloon": {
                "adjustBorderColor": false,
                "horizontalPadding": 10,
                "verticalPadding": 8,
                "color": "#ffffff"
              },

              "dataProvider": object,
              "valueAxes": [ {
                "axisAlpha": 0,
                "position": "left"
              } ],
              "startDuration": 1,
              "graphs": [ {
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                "fillAlphas": 1,
                "title": "dailyRakeCurrentMonth",
                "type": "column",
                "valueField": "dailyRakeCurrentMonth",
                "dashLengthField": "dashLengthColumn"
              },
              // {
              //   "id": "graph2",
              //   "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
              //   "bullet": "round",
              //   "lineThickness": 3,
              //   "bulletSize": 7,
              //   "bulletBorderAlpha": 1,
              //   "bulletColor": "#FFFFFF",
              //   "useLineColorForBulletBorder": true,
              //   "bulletBorderThickness": 3,
              //   "fillAlphas": 0,
              //   "lineAlpha": 1,
              //   "title": "dailyRakePrevMonth",
              //   "valueField": "dailyRakePrevMonth",
              //   "dashLengthField": "dashLengthLine"
              // }
              ],
              "categoryField": "day",
              "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
              },
              "export": {
                "enabled": true
              }
            } );
            console.log(res);
            $scope.formdata = {};
            $scope.generateBonusForm.$setPristine();

          }else{
            swal("Error!", "No data found");
            $scope.setVisible = false;
            // swal(res.result);
          }

                        //$cookies.put('poker_token', res.authToken);
          }).error(function(err){
              // swal(err);
            swal("Error!", "Getting error from server in showing playerReport ");
              // swal("Getting error from server in creating Bonus code ");
          });

      }
      else{
        console.log("Some fields are missing");
        swal("Error!", "Some Fields are missing");
        return;
      }

    }


  }]);
;angular.module('MetronicApp').controller('playerReportChartGamesPlayedController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) {
    console.log("Inside playerReportChartGamesPlayedController  @@@@@@@@@");
    var data = {};

    $('.date-picker').datepicker('setEndDate', new Date());

    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.setVisible = false;

    $scope.newSchedule = function(){
        console.log($('.scheduleDate').val())
        if(!$('.scheduleDate').val()) {
            return false;
        }
        var d = ($('.date-picker').data("datepicker").getUTCDate());
        // d.setDate(1);
        // d.setHours(0);
        // d.setMinutes(0);
        // d.setSeconds(0);
        // d.setMilliseconds(0);
        d.setUTCDate(1);
        d.setUTCHours(0);
        d.setUTCMinutes(0);
        d.setUTCSeconds(0);
        d.setUTCMilliseconds(0);
        console.log("the value of date is ", Number(d));
        data.timestamp = Number(d);
        $scope.init();

    }
    $scope.init = function(){
      $scope.setVisible = true;
      console.log($scope.formdata.name);
      // console.log($cookies.get('poker_userName'));
      console.log($rootScope.poker_userName);
      console.log("the value inside cookies of playerReportChartGamesPlayedController is",$cookies.getAll());
      data.userName = $scope.formdata.name;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);
      if(data.role.level<=0){
        // data.loginId = $cookies.get('poker_userName');
        data.loginId = $rootScope.poker_userName;
      }
      console.log("the data in playerReportChartGamesPlayedController ",JSON.stringify(data));
      if(!!$scope.formdata.name && !!data.timestamp){
        console.log("All fields are present");

        $http.post("/findPlayerDataChartGamesPlayed", data)
        .success(function(res){
          if(res.success){
              swal("Success!", "Data Retreived  successfully.");
              $scope.setVisible = true;
              //  var obj = [{"day": 1,
              //   "handsplayed": 23.5,
              //   "handsplayedPrevMonth": 21.1},{
              //   "day": 2,
              //   "handsplayed": 26.2,
              //   "handsplayedPrevMonth": 30.5
              // }]
              var object = [];
              // for(var i = 0; i<res.result.gameDataCurrentMonth.length;i++){
                  console.log("*****************",res.result.gameDataCurrentMonth);
                  console.log("##########",res.result.gameDataPreviousMonth);
                  // var xAxis = Math.max(res.result.gameDataCurrentMonth.length,res.result.gameDataPreviousMonth.length);
                  var xAxis = res.result.gameDataCurrentMonth.length;
                  console.log("the xAxis is ------",xAxis);
                  for(var i = 0; i<xAxis; i++){
                      var tempObj = {};
                      if(res.result.gameDataCurrentMonth[i]){
                        //console.log("----->>>>>>>>>>>>>",res.result.gameDataCurrentMonth[i]);
                        tempObj.handsplayed = res.result.gameDataCurrentMonth[i].handsPlayed;
                      }
                      else{
                        tempObj.handsPlayed = 0;
                      }

                      // if(!!res.result.gameDataPreviousMonth[i]){
                      //   tempObj.handsplayedPrevMonth = res.result.gameDataPreviousMonth[i].handsplayed;
                      // }
                      // else{
                      //   tempObj.handsplayedPrevMonth = 0;
                      // }
                      // tempObj.day = i+1;
                      tempObj.day = (new Date(res.result.gameDataCurrentMonth[i].date)).getUTCDate();
                      object.push(tempObj);
                  }
                  // for(var i = 0; i<res.result.gameDataPreviousMonth.length;i++){
                  //     var tempObj = {};
                  //     tempObj.handsplayedPrevMonth = res.result.gameDataPreviousMonth[i].handsPlayed;
                  //     object[i].push(tempObj);
                  // }
                  console.log("----------------->>",object);
              // }
              var chart = AmCharts.makeChart( "chartdiv", {
              "type": "serial",
              "addClassNames": true,
              "theme": "light",
              "autoMargins": false,
              "marginLeft": 80,
              "marginRight": 8,
              "marginTop": 10,
              "marginBottom": 26,
              "balloon": {
                "adjustBorderColor": false,
                "horizontalPadding": 10,
                "verticalPadding": 8,
                "color": "#ffffff"
              },

              "dataProvider": object,
              "valueAxes": [ {
                "axisAlpha": 0,
                "position": "left"
              } ],
              "startDuration": 1,
              "graphs": [ {
                "alphaField": "alpha",
                "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                "fillAlphas": 1,
                "title": "Hands Played",
                "type": "column",
                "valueField": "handsplayed",
                "dashLengthField": "dashLengthColumn"
              }, {
                // "id": "graph2",
                // "balloonText": "<span style='font-size:12px;'>[[title]] on [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                // "bullet": "round",
                // "lineThickness": 3,
                // "bulletSize": 7,
                // "bulletBorderAlpha": 1,
                // "bulletColor": "#FFFFFF",
                // "useLineColorForBulletBorder": true,
                // "bulletBorderThickness": 3,
                // "fillAlphas": 0,
                // "lineAlpha": 1,
                // "title": "handsplayedPrevMonth",
                // "valueField": "handsplayedPrevMonth",
                // "dashLengthField": "dashLengthLine"
              }
              ],
              "categoryField": "day",
              "categoryAxis": {
                "gridPosition": "start",
                "axisAlpha": 0,
                "tickLength": 0
              },
              "export": {
                "enabled": true
              }
            } );
            // console.log(res);
            $scope.formdata = {};
            $scope.generateBonusForm.$setPristine();

          }else{
            console.log("line 147", res)
            swal("Error!", "No data found!");
            $scope.setVisible = false;
            // swal(res.result);
          }

                        //$cookies.put('poker_token', res.authToken);
          }).error(function(err){
              // swal(err);
            swal("Error!", "Getting error from server in creating player ");
              // swal("Getting error from server in creating Bonus code ");
          });

      }
      else{
        console.log("Some fields are missing");
        swal("Error!", "Some Fields are missing");
        return;
      }

    }


  }]);
;angular.module('MetronicApp').controller('playerReportController', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside playerReportController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }
    $scope.pageSize = 0;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject  = {};
    $('.date-picker1').datepicker('setEndDate', new Date());
    $('.date-picker2').datepicker('setEndDate', new Date());
    var rakeSort = 1;
    var dateSort = 1;
    var nameSort = 1;
    var handsPlayedSort = 1;
    var handsWonSort = 1;
    var totalWinningsSort = 1;
    var tournamentsPlayedSort = 1;
    var chipsBalanceSort = 1;


    $scope.fixEndDate = function(){
      $('.date-picker2').datepicker('setStartDate', $('.date-picker1').data("datepicker").getUTCDate());
      if($scope.startDate > $scope.endDate){
        $scope.endDate = "";
      }
    }
    $scope.newPageList = function () {
        $scope.init(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
        $window.scrollTo(0, 0);
    }
    $scope.countData = function(){
      //var data = {};
      var data = $scope.queryObject;
      // data.role = JSON.parse($cookies.get('poker_role'));
      data.role = JSON.parse($rootScope.poker_role);
      // data.userName = $cookies.get('poker_userName');
       if(data.role.level<=0){
          // data.isParentUserName = $cookies.get('poker_userName');  
          data.isParentUserName = $rootScope.poker_userName;  
        }
        $http.post("/countPlayerReport",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
             //clearData();
          } else{
            alert("Missing Keys");
          }
        }).error(function(err){
        // alert(err);
        // alert("Getting error from server in counting playerReport ",err.stack);
        //clearData();
        // clearData();
      });  
    }

    $scope.init = function(skipData,limitData,cb){
        showList = true;
        //var data = {};
        var data = $scope.queryObject;
        // console.log($cookies.get('poker_role'));
        console.log($rootScope.poker_role);
        data.skip = skipData;
        data.limit = limitData;
        // data.role = JSON.parse($cookies.get('poker_role'));
        data.role = JSON.parse($rootScope.poker_role);
        //data.userName = $cookies.get('poker_userName');
        console.log("The value of cookies is",$cookies.getAll());
        if(data.role.level<=0){
          // data.isParentUserName = $cookies.get('poker_userName');  
          data.isParentUserName = $rootScope.poker_userName;  
        }
        if(data.createdAt){
            $http.post("/findPlayersReportDateFilter", data)
            .success(function(res){
              console.log("The result in playerReportController", res);
              // for(var i = 0 ; i<res.result.length; i++){
              //        var date = new Date(res.result[i].date);
              //        var validityMonth = date.getMonth() + 1;
              //        var validityDay = date.getDate();
              //        var validityYear = date.getFullYear();
              //        var datenew = validityDay + "-" + validityMonth + "-" + validityYear;
              //        console.log(datenew);
              //        res.result[i].date = datenew;
              // }
              for(var i = 0 ; i<res.result.length; i++){
                res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
              }
              $scope.listHistory = res.result;
              console.log("######### res.result", res.result);
              if(cb instanceof Function){
                $scope.dataList2 = $scope.dataList;
                setTimeout(function() {
                  cb();
                }, 100);
              }
              else{
              }
              //clearData();
            }).error(function(err){
              swal("Getting error from server in showing fund Transfer History Player");
              //clearData();
            });
        }
        else{
            $http.post("/findPlayersReport", data)
              .success(function(res){
                console.log("The result in playerReportController", res);
                console.log("------------->>>>>>>",res.result);
                if(!res.success){
                    console.log("Data not found---------");
                    swal("No data found for entered user");
                }
                else{
                  for(var i = 0 ; i<res.result.length; i++){
                    res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
                  }
                  $scope.listHistory = res.result;
                  console.log("######### res.result", res.result);
                }
                if(cb instanceof Function){
                  $scope.dataList2 = $scope.dataList;
                  setTimeout(function() {
                    cb();
                  }, 100);
                }
                else{
                }

                //clearData();
              }).error(function(err){
                swal("Getting error from server in showing fund Transfer History Player");
                //clearData();
              });
        }
    }
     // for clearing scope variable
   $scope.clearData = function(){
      $scope.queryObject = {};
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.userNameFilter = "";
      $scope.userId = "";
      $scope.city = "";
      $scope.minRake = "";
      $scope.maxRake = "";
      $scope.minHandsPlayed = "";
      $scope.maxHandsPlayed = "";
      $scope.minPercentHandsWon = "";
      $scope.maxPercentHandsWon = "";
      $scope.minWinnings = "";
      $scope.maxWinnings = "";
      $scope.countData();

      
   }

    $scope.onStartDateChange = function(){
      $scope.endDate = !($scope.startDate)?$scope.startDate:"";
    }

    $scope.onEndDateChange = function(){

      if( Number(new Date($scope.startDate)) > Number(new Date($scope.endDate)) ){
         $scope.endDate = "";
         swal({
          title: "End date must be greater then start date.",
          text: '',
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Close",
          closeOnConfirm: true,
          inputType : "text",
          html: true,
        }, function(){
      
        });
       }
    }


  $scope.searchHistory = function(){
    $scope.currentPage = 1;
    if(!$scope.userNameFilter && !$scope.startDate && !$scope.endDate){
      swal("Please provide any one filter.")
      return false;
    }
    if(($scope.minRake && $scope.maxRake &&($scope.minRake>$scope.maxRake))||($scope.minHandsPlayed && $scope.maxHandsPlayed &&($scope.minHandsPlayed>$scope.maxHandsPlayed))||($scope.minPercentHandsWon && $scope.maxPercentHandsWon &&($scope.minPercentHandsWon>$scope.maxPercentHandsWon))||($scope.minWinnings && $scope.maxWinnings &&($scope.minWinnings>$scope.maxWinnings))){
      swal("Please enter a valid input!");
      return;
    }
    
    if(($scope.minRake && $scope.minRake < 0) || ($scope.maxRake && $scope.maxRake < 0) || ($scope.minHandsPlayed && $scope.minHandsPlayed < 0) || ($scope.maxHandsPlayed && $scope.maxHandsPlayed < 0) || ($scope.minPercentHandsWon && $scope.minPercentHandsWon < 0) || ($scope.maxPercentHandsWon && $scope.maxPercentHandsWon < 0) || ($scope.minWinnings && $scope.minWinnings < 0) || ($scope.maxWinnings && $scope.maxWinnings < 0) || ($scope.minPercentHandsWon && $scope.minPercentHandsWon < 0) || ($scope.maxPercentHandsWon && $scope.maxPercentHandsWon < 0)){
      swal("Input fields cannot contain negative values.");
      return;
    }

    $scope.queryObject = {};
    if(!!$scope.userNameFilter && $scope.userNameFilter !== ""){
      console.log("Inside userNameFilter",$scope.userNameFilter);
      $scope.queryObject.userName = $scope.userNameFilter;
    }
    
    $scope.queryObject.containsFilters = false;
    
    if($scope.userId){
      $scope.queryObject.containsFilters = true;
      $scope.queryObject.userId = $scope.userId;
    }
    if($scope.city){
      $scope.queryObject.containsFilters = true;
      $scope.queryObject.city = $scope.city;
    }
    if($scope.minRake){
      $scope.queryObject.containsFilters = true;
      $scope.queryObject.minRake = $scope.minRake;
    }
    if($scope.maxRake){
      $scope.queryObject.containsFilters = true;
      $scope.queryObject.maxRake = $scope.maxRake;
    }
    if($scope.minHandsPlayed){
      $scope.queryObject.containsFilters = true;
      $scope.queryObject.minHandsPlayed = $scope.minHandsPlayed;
    }
    if($scope.maxHandsPlayed){
      $scope.queryObject.containsFilters = true;
      $scope.queryObject.maxHandsPlayed = $scope.maxHandsPlayed;
    }
    if($scope.minPercentHandsWon){
      $scope.queryObject.containsFilters = true;
      $scope.queryObject.minPercentHandsWon = $scope.minPercentHandsWon;
    }
    if($scope.maxPercentHandsWon){
      $scope.queryObject.containsFilters = true;
      $scope.queryObject.maxPercentHandsWon = $scope.maxPercentHandsWon;
    }
    if($scope.minWinnings){
      $scope.queryObject.containsFilters = true;
      $scope.queryObject.minWinnings = $scope.minWinnings;
    }
    if($scope.maxWinnings){
      $scope.queryObject.containsFilters = true;
      $scope.queryObject.maxWinnings = $scope.maxWinnings;
    }

    if(Number(new Date($scope.startDate)) > 0 || Number(new Date($scope.endDate)) > 0){
      $scope.queryObject.createdAt = {};
      $scope.queryObject.createdAt['$gte'] =  Number($('.date-picker1').data("datepicker").getUTCDate());
      $scope.queryObject.createdAt['$lte'] =  Number($('.date-picker2').data("datepicker").getUTCDate()) + (24*60*60*1000);
      // if(Number(new Date($scope.startDate)) > 0){
      //   $scope.queryObject.createdAt['$gte'] = Number(new Date($scope.startDate));
      // }
      // if(Number(new Date($scope.endDate)) > 0){
      //   $scope.queryObject.createdAt['$lte'] = Number(new Date($scope.endDate)) + 86400000; // added 24 hours
      // }
    }  

    console.log("************** queryObject in playerReportController",$scope.queryObject);
    // $scope.listTables();
    $scope.countData();
  }
    //$scope.init();
    $scope.countData();

    $scope.sortTableByRake = function(){
      rakeSort = rakeSort * -1;
      if(rakeSort == 1){
        $scope.listHistory.sort(function(a, b){
          return parseFloat(a.totalRake) - parseFloat(b.totalRake)
        })
      }

      else{
        $scope.listHistory.sort(function(a, b){
          return parseFloat(b.totalRake) - parseFloat(a.totalRake)
        })
      }
      // console.log($scope.dataList)
    }

    // $scope.sortTableByDate = function(){
    //   dateSort = dateSort * -1;
    //   if(dateSort == 1){
    //     $scope.listHistory.sort(function(a, b){
    //       return parseFloat(a.date) - parseFloat(b.date)
    //     })
    //   }

    //   else{
    //     $scope.listHistory.sort(function(a, b){
    //       return parseFloat(b.date) - parseFloat(a.date)
    //     })
    //   }
    //   // console.log($scope.dataList)
    //   // $scope.$apply();
    // }

    $scope.sortTableByChipsBalance = function(){
      chipsBalanceSort = chipsBalanceSort * -1;
      if(chipsBalanceSort == 1){
        $scope.listHistory.sort(function(a, b){
          return parseFloat(a.realChips) - parseFloat(b.realChips)
        })
      }

      else{
        $scope.listHistory.sort(function(a, b){
          return parseFloat(b.realChips) - parseFloat(a.realChips)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByHandsPlayed = function(){
      handsPlayedSort = handsPlayedSort * -1;
      if(handsPlayedSort == 1){
        $scope.listHistory.sort(function(a, b){
          return parseInt(a.statistics.handsPlayedRM) - parseInt(b.statistics.handsPlayedRM)
        })
      }

      else{
        $scope.listHistory.sort(function(a, b){
          return parseInt(b.statistics.handsPlayedRM) - parseInt(a.statistics.handsPlayedRM)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByHandsWon = function(){
      handsWonSort = handsWonSort * -1;
      if(handsWonSort == 1){
        $scope.listHistory.sort(function(a, b){
          return parseInt(a.statistics.handsWonRM) - parseInt(b.statistics.handsWonRM)
        })
      }

      else{
        $scope.listHistory.sort(function(a, b){
          return parseInt(b.statistics.handsWonRM) - parseInt(a.statistics.handsWonRM)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByTotalWinnings = function(){
      totalWinningsSort = totalWinningsSort * -1;
      if(totalWinningsSort == 1){
        $scope.listHistory.sort(function(a, b){
          return parseFloat(a.totalWinnings) - parseFloat(b.totalWinnings)
        })
      }

      else{
        $scope.listHistory.sort(function(a, b){
          return parseFloat(b.totalWinnings) - parseFloat(a.totalWinnings)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByTournamentsPlayed = function(){
      tournamentsPlayedSort = tournamentsPlayedSort * -1;
      if(tournamentsPlayedSort == 1){
        $scope.listHistory.sort(function(a, b){
          return parseFloat(a.tournamentsPlayed) - parseFloat(b.tournamentsPlayed)
        })
      }

      else{
        $scope.listHistory.sort(function(a, b){
          return parseFloat(b.tournamentsPlayed) - parseFloat(a.tournamentsPlayed)
        })
      }
      // console.log($scope.dataList)
      // $scope.$apply();
    }

    $scope.sortTableByName = function(){
      nameSort = nameSort * -1;
      if(nameSort == 1){
        $scope.listHistory.sort(function(a, b){
          if(a.userName > b.userName) return -1;
          if(a.userName < b.userName) return 1;
        })
      }

      else{
        $scope.listHistory.sort(function(a, b){
          if(a.userName < b.userName) return -1;
          if(a.userName > b.userName) return 1;
        })
      }
      // console.log($scope.tableList)
      // $scope.$apply();
    }

    


  var Excel = function(tableId,worksheetName){
    var uri='data:application/vnd.ms-excel;base64,',
      template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
      base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
      format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
     
        var table=$(tableId),
          ctx={worksheet:worksheetName,table:table.html()},
          href=uri+base64(format(template,ctx));
          console.log("ctx ", table.context);
        return href;
  }
 
  $scope.exportData = function (tableId) {
    console.log("totalpage____________________________"+$scope.totalPage);
    $scope.init(0, 0, function(){
      $window.scrollTo(0, 0);

      $timeout(function(){
        location.href=Excel(tableId,'sheet_name');
        $scope.init(0, 20);
        // $scope.resetForm();
      },500); // trigger download
    });
  };
    
}]);;angular.module('MetronicApp').controller('ScratchCardHistoryCtrl', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
  $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        App.initAjax();
      });
     


    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageContentWhite = true;
    $rootScope.settings.layout.pageBodySolid = false;
    $rootScope.settings.layout.pageSidebarClosed = false;
    
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
      return;
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.sortValue = "createdAt";

    
   var affiliate = {
        // name     : $cookies.get('poker_name'),
        name     : $rootScope.poker_name,
        // userName : $cookies.get('poker_userName'),
        userName : $rootScope.poker_userName,
        // role     : JSON.parse($cookies.get('poker_role')),
        role     : ($rootScope.poker_role),
        // id       : $cookies.get('poker_email'),
        id       : $rootScope.poker_email,
        // mobile   : $cookies.get('poker_loggedinUserMobileNum')
        mobile   : $rootScope.poker_loggedinUserMobileNum
    };

    if(typeof affiliate.role == 'string'){
      affiliate.role = JSON.parse(affiliate.role);
    }

    $scope.newPageList = function () {
        // swal($scope.pageSize, ",,,,,");
        $scope.listTables(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
        // $scope.listTables(5, 20);
        $window.scrollTo(0, 0);
    }
    

    $('.date-picker').datepicker({'autoclose' : true});




    $scope.loginId = "";
    $scope.loginType = "";
    $scope.promoCode = "";
    $scope.type = "";
    $scope.status = "";
    $scope.startDate = "";
    $scope.endDate =  "";
    $scope.queryObject = {};

    $scope.listTables = function(skipData,limitData,cb){
      var data = $scope.queryObject;
      data.skip = skipData;
      data.limit = limitData;
      if(affiliate.role.level<1){
        data.scratchCardType = "AFFILIATE";
        data.affiliateId = affiliate.userName;
      }
      data.sortValue = $scope.sortValue;
      
      console.log('___________________________________________________', affiliate);
      $http.post("/getScratchCardHistory",data)
        .success(function(res){
          if(res.success){
            console.log(res.result.length);
            // for(var i=0;i<res.result.length;i++){
            //   res.result[i].code = "XXXXXXXXXXXXXXXX"+ res.result[i].code.substr(-6);
            // }
            if(res.result.length == 0){
              swal("No data found.")
            }
            for(var i = 0 ; i<res.result.length; i++){
              res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
            }
            $scope.dataList = res.result;
            if(cb instanceof Function){
              setTimeout(function() {
                cb();
              }, 100);
            }
            else{
            }
             // clearData();
          } else{
            // swal("Error!", "Missing Keys");
            // swal("Missing Keys");
          }
        }).error(function(err){
        // swal(err);
        swal("Error!", "Getting error from server in showing history",err.stack);
        // swal("Getting error from server in showing rake rules",err.stack);
        // clearData();
      });  
    }   

    //get count for data for page limit
    $scope.countData = function(){
      // var role  = JSON.parse($cookies.get('poker_role'));
      var role = $rootScope.poker_role
      
      if(typeof $rootScope.poker_role == 'string'){
        role = JSON.parse($rootScope.poker_role);
      }
      // if(role.name === "affiliate" && role.level == 0){
      //   $scope.queryObject.affiliateId = $cookies.get('poker_userName');
      //   //$scope.queryObject["createdBy.userName"] = $cookies.get('poker_userName');

      // }
      var data = $scope.queryObject;
      console.log('line 123 ', affiliate);
      if(affiliate.role.level<1){
        data.scratchCardType = "AFFILIATE";
        data.affiliateId = affiliate.userName;
      }
      delete data.skip;
      delete data.limit;
      delete data.sortValue;

      console.log("count data == ", data);

      $http.post("/getScratchCardHistoryCount",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
          } else{
             swal(JSON.stringify(res));
            swal("Missing Keys");
          }
        }).error(function(err){
        // swal(err);
        swal("Error!", "Getting error from server in showing history",err.stack);
        // swal("Getting error from server in showing rake rules",err.stack);
        // clearData();
      });  
    }  


   //for searching history data
  $scope.searchHistory = function(){
    $scope.currentPage = 1;
    if(!$scope.loginType && !$scope.type && !$scope.promoCode && !$scope.status && !$scope.referenceNo && !$scope.transferType && !$scope.scratchID){
      swal("Please provide at least one input.")
    }
    else{

    if($scope.loginType !== "all" && $scope.loginType !== ""){
     // $scope.queryObject[$scope.loginType + ".id"] = $scope.loginId;
       if($scope.loginId.length > 0){      
          $scope.queryObject[$scope.loginType + ".userName"] = $scope.loginId;
       }
    }

    if($scope.type !== "all" && $scope.type !== ""){
     $scope.queryObject.scratchCardType = $scope.type;
    }

    if($scope.promoCode.length > 0 && $scope.promoCode !== ""){
     $scope.queryObject.promoCode = $scope.promoCode.toUpperCase();
    }

    if($scope.status !== "all" && $scope.status !== ""){
     $scope.queryObject.status = $scope.status;
    }

    if($scope.referenceNo){
      $scope.queryObject.generationId = $scope.referenceNo;
    }    

    if($scope.transferType){
      $scope.queryObject.transactionType = $scope.transferType;
    }

    if($scope.scratchID){
      if($scope.scratchID.length != 6){
        swal("Error", "Please enter last 6 digits for scratch card.");
        return false;
      }
      $scope.queryObject.code = {'$regex': $scope.scratchID +"$"};
    }    



    // if(Number(new Date($scope.startDate)) > 0 && Number(new Date($scope.endDate)) > 0){
      // $scope.queryObject.createdAt = {'$gte' : Number(new Date($scope.startDate)), '$lte' : Number(new Date($scope.endDate))};
    // }
    // 
    if(Number(new Date($scope.startDate)) > 0 || Number(new Date($scope.endDate)) > 0){
      $scope.queryObject.createdAt = {};
      if(Number(new Date($scope.startDate)) > 0){
        $scope.queryObject.createdAt['$gte'] = Number(new Date($scope.startDate));
      }
      if(Number(new Date($scope.endDate)) > 0){
        $scope.queryObject.createdAt['$lte'] = Number(new Date($scope.endDate)) + 86400000; // added 24 hours
      }
    }  

    // var role  = JSON.parse($cookies.get('poker_role'));
    var role  = JSON.parse($rootScope.poker_role);
    // if(role.name === "affiliate" && role.level == 0){
    //   $scope.queryObject.affiliateId = $cookies.get('poker_userName');
    //   //$scope.queryObject["createdBy.userName"] = $cookies.get('poker_userName');

    // }
    // if(affiliate.role.level<1){
    //     data.scratchCardType = "AFFILIATE";
    //     data.affiliateId = affiliate.userName;
    // }
    console.log("**************\n",JSON.stringify($scope.queryObject));
    // $scope.listTables();
    $scope.countData();
      
    }
  }

   // for clearing scope variable
   function clearData(){
      $scope.queryObject = {};
      $scope.loginId = "";
      $scope.loginType = "";
      $scope.promoCode = "";
      $scope.type = "";
      $scope.status = "";
      $scope.startDate = "";
      $scope.endDate = "";
      $scope.referenceNo = "";
      $scope.transferType = "";
      $scope.scratchID = "";
   }

   $scope.reset = function(){
    clearData();
    $scope.countData();
   }

    // for handling date range validation
    $scope.onStartDateChange = function(){
      $scope.endDate = !($scope.startDate)?$scope.startDate:"";
    }

    $scope.onEndDateChange = function(){

      if( Number(new Date($scope.startDate)) > Number(new Date($scope.endDate)) ){
         $scope.endDate = "";
         swal({
          title: "End date must be greater then start date.",
          text: '',
          type: "warning",
          showCancelButton: false,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Close",
          closeOnConfirm: true,
          inputType : "text",
          html: true,
        }, function(){
      
        });
       }
    }



    var Excel = function(tableId,worksheetName){
      console.log('function called')
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", href);
          return href;
    }
 
    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.listTables(0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.listTables(0, 20);
          // $scope.resetForm();
        },500); // trigger download
      });
    };


   // $scope.listTables();
   $scope.countData();

}]);

;angular.module('MetronicApp').controller('transactionHistoryReportController', ["$location", "$window", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $window, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside transactionHistoryReportController @@@@@@@@@");
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject = {};
    $scope.sortValue = "date";


    
    $scope.newPageList = function () {
      $scope.init(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
      $window.scrollTo(0, 0);
    }

    $scope.setDisabled = false;

    $scope.countData = function(){
      // console.log("$$$$$$$$$$$$$$$$$$",$cookies.get('poker_userName'));
      console.log("$$$$$$$$$$$$$$$$$$",$rootScope.poker_userName);
      if((JSON.parse($rootScope.poker_role)).level <= 0){
        // $scope.queryObject.loginId = $cookies.get('poker_userName');
        $scope.queryObject.loginId = $rootScope.poker_userName;
        $scope.userNameFilter = $rootScope.poker_userName;
        $scope.setDisabled = true;
      }
      var data = $scope.queryObject;
      data.sortValue = $scope.sortValue;

      $http.post("/countDataInTransactionHistory",data)
        .success(function(res){
        if(res.success){
             $scope.totalPage = res.result;
             $scope.newPageList();
             // clearData();
          } else{
            swal("Missing Keys");
          }
        }).error(function(err){
        swal("Getting error from server in showing transaction history",err.stack);
        clearData();
      });  
    }


    $scope.init = function(skipData,limitData,cb){
      showList = true;
      var data = {};
      // console.log("$$$$$$$$$$$$$$$$$$4",$cookies.get('poker_userName'));
      console.log("$$$$$$$$$$$$$$$$$$4",$rootScope.poker_userName);
      // if((JSON.parse($cookies.get('poker_role'))).level <= 0){
      if((JSON.parse($rootScope.poker_role)).level <= 0){
        // $scope.queryObject.loginId = $cookies.get('poker_userName');
        $scope.queryObject.loginId = $rootScope.poker_userName;
        $scope.userNameFilter = $rootScope.poker_userName;
      }
      data = $scope.queryObject;
      data.sortValue = $scope.sortValue;
      data.skip = skipData;
      data.limit = limitData;
      $http.post("/listTransactionHistory", data)
        .success(function(res){
          if(res.result.length == 0){
            swal("No data found.")
          }
          for(var i = 0 ; i<res.result.length; i++){
            res.result[i].index = ($scope.currentPage-1)*$scope.pageSize + i + 1;
            res.result[i].amount = String(res.result[i].amount).split("").reverse().join("").replace(/(\d{3}\B)/g, "$1,").split("").reverse().join("");
          }
          console.log("The result in transactionHistoryReportController", res.result);
          $scope.listTransaction = res.result;
          if(cb instanceof Function){
            setTimeout(function() {
              cb();
            }, 100);
          }
          else{
          }

          // clearData();
        }).error(function(err){
          swal("Error!", "Getting error from server in showing transaction History");
          clearData();
      });
    }
     // for clearing scope variable
   function clearData(){
      $scope.queryObject = {};
      // $scope.loginId = "";
      // $scope.loginType = "";
      // $scope.promoCode = "";
      // $scope.type = "";
      // $scope.status = "";
      // $scope.startDate = "";
      // $scope.endDate = "";
   }

  $scope.searchHistory = function(){
    $scope.currentPage = 1;
    $scope.queryObject = {};

    if(!$scope.userNameFilter && !$scope.bonusCodeFilter && !$scope.transferTypeFilter && !$scope.transferModeFilter && !$scope.referenceNoFilter){
      swal("Please provide atleast one filter");
      return false;
    }
      
    if(!!$scope.userNameFilter && $scope.userNameFilter !== "" && (JSON.parse($rootScope.poker_role)).level > 0){
      console.log("Inside userNameFilter",$scope.userNameFilter);
      $scope.queryObject.Name = $scope.userNameFilter;
    }

    if(!!$scope.bonusCodeFilter && $scope.bonusCodeFilter !== ""){
      console.log("Inside bonusCodeFilter",$scope.bonusCodeFilter);
      $scope.queryObject.bonusCode = $scope.bonusCodeFilter.toUpperCase();
    }

    if(!!$scope.transferTypeFilter && $scope.transferTypeFilter !== ""){
      console.log("Inside transferTypeFilter",$scope.transferTypeFilter);
      $scope.queryObject.transactionType = $scope.transferTypeFilter;
    }

    if(!!$scope.transferModeFilter && $scope.transferModeFilter !== ""){
      console.log("Inside transferModeFilter",$scope.transferModeFilter);
      $scope.queryObject.transferMode = $scope.transferModeFilter;
    }

    if(!!$scope.referenceNoFilter && $scope.referenceNoFilter !== ""){
      console.log("Inside referenceNoFilter",$scope.referenceNoFilter);
      $scope.queryObject.referenceNumber = $scope.referenceNoFilter;
    }

    console.log("************** queryObject",JSON.stringify($scope.queryObject));
    $scope.countData();
  }

  $scope.reset = function(){
    $scope.userNameFilter = "";
    $scope.bonusCodeFilter = "";
    $scope.transferTypeFilter = "";
    $scope.transferModeFilter = "";
    $scope.referenceNoFilter = "";
    $scope.queryObject = {};
    $scope.countData();

  }

  
var Excel = function(tableId,worksheetName){
      var uri='data:application/vnd.ms-excel;base64,',
        template='<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
        base64=function(s){return $window.btoa(unescape(encodeURIComponent(s)));},
        format=function(s,c){return s.replace(/{(\w+)}/g,function(m,p){return c[p];})};
       
          var table=$(tableId),
            ctx={worksheet:worksheetName,table:table.html()},
            href=uri+base64(format(template,ctx));
            console.log("ctx ", table.context);
          return href;
    }
  
 
    $scope.exportData = function (tableId) {
      console.log("totalpage____________________________"+$scope.totalPage);
      $scope.init(0, 0, function(){
        $window.scrollTo(0, 0);

        $timeout(function(){
          location.href=Excel(tableId,'sheet_name');
          $scope.init(0, 20);
          // $scope.resetForm();
        },500); // trigger download
      });
    };

    // $scope.init();
  $scope.countData();

  
    
}]);;angular.module('MetronicApp').controller('withdrawChipsController', ["$location", "$cookies", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout) { 
    console.log("Inside withdrawchipsController  @@@@@@@@@");
    var fundTransferData = {};
    
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    // if($cookies.get('poker_role') == 'admin'){
    //     console.log('yes')
    //     swal("Sorry, you don't have access to this module.");
    //     $location.path('/dashboard')
    //   }

    $scope.formdata = {};
    $scope.formdata.transactionType = "Debit";
    //transfer fund to player
    // $scope.toggleChips = $cookies.get('poker_role');
    $scope.toggleChips = $rootScope.poker_role;
    $scope.init = function(){
      console.log($scope.transferTo);
      console.log($scope.formdata.amount);
      // console.log($cookies.get('poker_userName'));
      console.log($rootScope.poker_userName);
      console.log($scope.formdata.transactionType);
      console.log($scope.formdata.description);
      console.log("the value inside cookies of fundTransferController is",$cookies.getAll());
      fundTransferData.transferTo = $scope.transferTo;
      fundTransferData.amount = $scope.formdata.amount;
      fundTransferData.transactionType = $scope.formdata.transactionType;
      fundTransferData.description = $scope.formdata.description;
      // fundTransferData.role        = JSON.parse($cookies.get('poker_role'));
      fundTransferData.role        = JSON.parse($rootScope.poker_role);
      // fundTransferData.transferBy  = $cookies.get('poker_email');
      fundTransferData.transferBy  = $rootScope.poker_email;
      // fundTransferData.Name  = $cookies.get('poker_userName');
      fundTransferData.Name  = $rootScope.poker_userName;
      // var role = JSON.parse($cookies.get('poker_role'));
      var role = JSON.parse($rootScope.poker_role);
      //fundTransferData.createdBy = $cookies.get('poker_email');
      //fundTransferData.profile   = $cookies.get('poker_role').toUpperCase();
      console.log("the fundTransferData is ",JSON.stringify(fundTransferData));
      if(!!$scope.transferTo && !!$scope.formdata.amount ){
          console.log("All fields are present");
          if(role.name == "admin"){
            $http.post("/transferFundChips", fundTransferData)
            .success(function(res){
                if(res.success){
                  swal("Chips Transfer Successful!!");
                  console.log(res);
                  //$location.path('/transferHistoryPlayer');
                }else{
                  swal(res.result);
                }
                        
                        //$cookies.put('poker_token', res.authToken);
            }).error(function(err){
              // swal(err);
                swal("Getting error from server in fund transfer ");
            });
          
        }
        else{
              // fundTransferData.Affiliate = $cookies.get('poker_email');
              fundTransferData.Affiliate = $rootScope.poker_email;
              $http.post("/transferChipsByAffiliateToPlayer", fundTransferData)
              .success(function(res){
                  if(res.success){
                    swal("Chips Transfer Successful!!");
                    console.log(res);
                    //$location.path('/transferHistoryPlayer');
                  }else{
                    swal(res.result);
                  }
                        
                        //$cookies.put('poker_token', res.authToken);
              }).error(function(err){
                  // swal(err);
                    swal("Getting error from server in fund transfer ");
              });
        }

    }
      else{
        console.log("Some fields are missing");
        swal("Some Fields are missing");
        return;
      }
      
    }

    // $scope.cancel = function(){
    //   $scope.formdata.amount = " ";
    //   $scope.transferTo = " ";
    // }

    //transfer fund to affiliate
    $scope.fundTransferToAffiliate = function(){
      console.log($scope.transferTo);
      console.log($scope.formdata.amount);
      // console.log($cookies.get('poker_userName'));
      console.log($rootScope.poker_userName);
      // console.log($cookies.get('poker_role'));
      console.log($rootScope.poker_role);
      console.log($scope.formdata.transactionType);
      console.log($scope.formdata.description);
      console.log("the value inside cookies of fundTransferToAffiliate is",$cookies.getAll());
      fundTransferData.transferTo = $scope.transferTo;
      fundTransferData.amount = $scope.formdata.amount;
      fundTransferData.transactionType = $scope.formdata.transactionType;
      fundTransferData.description = $scope.formdata.description;
      // fundTransferData.role        = JSON.parse($cookies.get('poker_role'));
      fundTransferData.role        = JSON.parse($rootScope.poker_role);
      // fundTransferData.transferBy  = $cookies.get('poker_email');
      fundTransferData.transferBy  = $rootScope.poker_email;
      // fundTransferData.Name  = $cookies.get('poker_userName');      
      fundTransferData.Name  = $rootScope.poker_userName;      
      //fundTransferData.createdBy = $cookies.get('poker_email');
      //fundTransferData.profile   = $cookies.get('poker_role').toUpperCase();
      console.log("the fundTransferData in fundTransferToAffiliate is ",JSON.stringify(fundTransferData));
      if(!!$scope.transferTo && !!$scope.formdata.amount ){
        console.log("All fields are present");
        $http.post("/transferFundChipsToAffiliate", fundTransferData)
        .success(function(res){
          if(res.success){
            swal("Chips Transfer Successful!!");
            console.log(res);
            //$location.path('/transferHistoryAffiliate');
            
          }else{
            swal(res.result);
          }
                        
                        //$cookies.put('poker_token', res.authToken);
          }).error(function(err){
              // swal(err);
              swal("Getting error from server in fund transfer ");
          });

      }
      else{
        console.log("Some fields are missing");
        swal("Some Fields are missing");
        return;
      }
      
    }

    var withdrawData = {};
    $scope.withdrawChips = function(){
      console.log($scope.formdata.withdrawFrom);
      console.log($scope.formdata.amount);
      // console.log($cookies.get('poker_email'));
      console.log($rootScope.poker_email);
      console.log($scope.formdata.transactionType);
      console.log($scope.formdata.description);
      console.log("the value inside cookies of withdrawChips is",$cookies.getAll());
      withdrawData.withdrawFrom = $scope.formdata.withdrawFrom;
      withdrawData.amount = $scope.formdata.amount;
      //withdrawData.Affiliate = $cookies.get('poker_email');
      // withdrawData.Affiliate = $cookies.get('poker_userName');
      withdrawData.Affiliate = $rootScope.poker_userName;
      withdrawData.transactionType = $scope.formdata.transactionType;
      withdrawData.description = $scope.formdata.description;
      // withdrawData.role        = JSON.parse($cookies.get('poker_role'));
      withdrawData.role        = JSON.parse($rootScope.poker_role);
      // withdrawData.name        = $cookies.get('poker_name');
      withdrawData.name        = $rootScope.poker_name;
      // withdrawData.userName    = $cookies.get('poker_userName');
      withdrawData.userName    = $rootScope.poker_userName;
      // var role = JSON.parse($cookies.get('poker_role'));
      var role = JSON.parse($rootScope.poker_role);
      //fundTransferData.createdBy = $cookies.get('poker_email');
      //fundTransferData.profile   = $cookies.get('poker_role').toUpperCase();
      console.log("the withdrawChipsData in withdrawChipsController is----- ",JSON.stringify(withdrawData));
      if(!!$scope.formdata.withdrawFrom && !!$scope.formdata.amount ){
        console.log("All fields are present");
        if(role.name == "admin"){
          swal({
                title: "Are you sure you want to pull chips ?",
                text: '',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Proceed",
                closeOnConfirm: false,
                inputType : "text",
                html: true,
          }, function(){
              $http.post("/withdrawChipsAdmin", withdrawData)
                .success(function(res){
                if(res.success){
                 swal("Withdraw Successful!!");
                  console.log(res);
                  $scope.formdata = {};
                  $scope.generateBonusForm.$setPristine();
                  //$location.path('/withdrawChipsHistory');
                }else{
                  swal(res.result);
              }
                          
                          //$cookies.put('poker_token', res.authToken);
            }).error(function(err){
                // swal(err);
                swal("Getting error from server in withdrawing ");
            });
          });
        }
        else{
          swal({
                title: "Are you sure you want to pull chips ?",
                text: '',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Proceed",
                closeOnConfirm: false,
                inputType : "text",
                html: true,
          }, function(){
              $http.post("/withdrawChips", withdrawData)
                .success(function(res){
                if(res.success){
                 swal("Withdraw Successful!!");
                  console.log(res);
                  $scope.formdata = {};
                  $scope.generateBonusForm.$setPristine();
                  //$location.path('/withdrawChipsHistory');
                }else{
                  swal(res.result);
              }
                          
                          //$cookies.put('poker_token', res.authToken);
            }).error(function(err){
                // swal(err);
                swal("Getting error from server in withdrawing ");
            });
          });
        }
      }
      else{
        console.log("Some fields are missing");
        swal("Some Fields are missing");
        return;
      }
      
    }
  

  }]);;angular.module('MetronicApp').controller('withdrawHistoryController', ["$location", "$cookies", "$window", "$rootScope", "$scope", "$stateParams", "$http", "$timeout", function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) { 
    $scope.listBonus = [];
    console.log("Inside withdrawHistoryController @@@@@@@@@");
    
    if(!$rootScope.isAdminLogin){
      console.log('yes')
      $location.path('/login.html')
    }

    // if($cookies.get('poker_role') == 'admin'){
    //   console.log('yes')
    //   swal("Sorry, you don't have access to this module.");
    //   $location.path('/dashboard')
    // }

    
    $scope.pageSize = 20;// no. or record to show
    $scope.currentPage = 1;// current page count
    $scope.totalPage = 0;// tatal data count
    $scope.queryObject = {};

    $scope.newPageList = function () {
        $scope.init(($scope.currentPage - 1) * $scope.pageSize, $scope.pageSize);
        $window.scrollTo(0, 0);
    }
    $scope.countData = function(){
       // alert("count data call");
      //var data = {};
      var data = $scope.queryObject; 
      // data.userName = $cookies.get('poker_userName');
      data.userName = $rootScope.poker_userName;
      // data.role     = JSON.parse($cookies.get('poker_role'));
      data.role     = JSON.parse($rootScope.poker_role);
      $http.post("/countWithdrawHistory",data)
        .success(function(res){
        if(res.success){
            // alert(JSON.stringify(res));
             $scope.totalPage = res.result;
             $scope.newPageList();
             clearData();
          } else{
            alert("Missing Keys");
          }
        }).error(function(err){
        alert(err);
        alert("Getting error from server in showing withdraw History",err.stack);
        clearData();
      });  
    }
    $scope.init = function(skipData,limitData){
        showList = true;
        //var data = {};
        var data = $scope.queryObject;        
        data.skip = skipData;
        data.limit = limitData;
        // data.userName = $cookies.get('poker_userName');
        data.userName = $rootScope.poker_userName;
        // data.role     = JSON.parse($cookies.get('poker_role'));
        data.role     = JSON.parse($rootScope.poker_role);
        console.log("Inside withdrawhistory Controller",$cookies.getAll());
        $http.post("/withdrawHistory", data)
          .success(function(res){
            console.log("The result in withdrawHistory", res);
            for(var i = 0 ; i<res.result.length; i++){
                   var date = new Date(res.result[i].date);
                   var validityMonth = date.getMonth() + 1;
                   var validityDay = date.getDate();
                   var validityYear = date.getFullYear();
                   var datenew = validityDay + "-" + validityMonth + "-" + validityYear;
                   console.log(datenew);
                   res.result[i].date = datenew;
            }
            $scope.listHistory = res.result;
            console.log("######### res.result", res.result);
            clearData();
          }).error(function(err){
            swal("Getting error from server in showing Bonus Deposit");
            clearData();
          });
    }

  function clearData(){
      $scope.queryObject = {};
      // $scope.loginId = "";
      // $scope.loginType = "";
      // $scope.promoCode = "";
      // $scope.type = "";
      // $scope.status = "";
      // $scope.startDate = "";
      // $scope.endDate = "";
   }
       //for searching history data
  $scope.searchHistory = function(){
    $scope.currentPage = 1;

    if(!!$scope.playerNameFilter && $scope.playerNameFilter !== ""){
      console.log("Inside playerNameFilter",$scope.playerNameFilter);
     $scope.queryObject.withdrawFrom = $scope.playerNameFilter;
    }

    if(!!$scope.pulledByFilter && $scope.pulledByFilter !== ""){
      console.log("Inside pulledByFilter",$scope.pulledByFilter);
     $scope.queryObject.Affiliate = $scope.pulledByFilter;
    }

    if(!!$scope.transferTypeFilter && $scope.transferTypeFilter !== ""){
      console.log("Inside transferTypeFilter",$scope.transferTypeFilter);
     $scope.queryObject.transactionType = $scope.transferTypeFilter;
    }
    // if(!!$scope.bonusPercentFilter && $scope.bonusPercentFilter !== ""){
    //   console.log("Inside bonusPercentFilter",$scope.bonusPercentFilter);
    //  $scope.queryObject.bonusPercent = parseInt($scope.bonusPercentFilter);
    // }    

    // if(Number(new Date($scope.startDate)) > 0 && Number(new Date($scope.endDate)) > 0){
      // $scope.queryObject.createdAt = {'$gte' : Number(new Date($scope.startDate)), '$lte' : Number(new Date($scope.endDate))};
    // }
    // 
    // if(Number(new Date($scope.startDate)) > 0 || Number(new Date($scope.endDate)) > 0){
    //   $scope.queryObject.createdAt = {};
    //   if(Number(new Date($scope.startDate)) > 0){
    //     $scope.queryObject.createdAt['$gte'] = Number(new Date($scope.startDate));
    //   }
    //   if(Number(new Date($scope.endDate)) > 0){
    //     $scope.queryObject.createdAt['$lte'] = Number(new Date($scope.endDate)) + 86400000; // added 24 hours
    //   }
    // }  

    // var role  = JSON.parse($cookies.get('poker_role'));
    // if(role.name === "affiliate" && role.level == 0){
    //   $scope.queryObject.affiliateId = $cookies.get('poker_userName');
    //   //$scope.queryObject["createdBy.userName"] = $cookies.get('poker_userName');

    // }

    console.log("************** queryObject",JSON.stringify($scope.queryObject));
    // $scope.listTables();
    $scope.countData();
  }
    //$scope.init();
    $scope.countData();
    
}]);