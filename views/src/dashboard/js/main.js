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
        }
      }, function myError(err) {
          console.log(err,"err")
      });
    }
    else{
      //
    }
  }, 30000)



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
          $rootScope.userName = base64_decode($cookies.get('poker_userName'));
          if(JSON.parse(($cookies.get('poker_role'))).level != 7){
          }
          var tempy = $state;
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

        
      $http({
          method : "post",
          url : "/getModuleList",
          data:  {},
          headers: {'Content-Type': 'application/json'}
      }).then(function mySucces(res) {
          if(res.data.success){
              var moduleAccess = $rootScope.moduleAccess;
              console.log('line 421 ', moduleAccess);
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
              // if(checkLoginType.level > 6){
              //   var versionMaintenanceModule = 
              //     {
              //       name: 'Version & Maintenance',
              //       code: 2301,
              //       iconClass: 'icon-settings',
              //       status: true,
              //       subModule: [
              //         {
              //           name: 'Create New Version',
              //           code: 2303,
              //           route: 'createGameVersion',
              //           iconClass: 'icon-puzzle',
              //           status: true
              //         },
              //         {
              //           name: 'List Versions',
              //           code: 2304,
              //           route: 'listGameVersions',
              //           iconClass: 'icon-puzzle',
              //           status: true
              //         },
              //         {
              //           name: 'Schedule Maintenance',
              //           code: 2305,
              //           route: 'listScheduledMaintenances',
              //           iconClass: 'icon-puzzle',
              //           status: true
              //         }
              //       ]
              //     }
              //   $rootScope.moduleAccess.push(versionMaintenanceModule);   
              // }
              console.log($rootScope.moduleAccess,"==$rootScope.moduleAccess")
             
          }else{
              alert("Not found module for sidebar")
          }
      }, function myError(err) {
          alert("Getting error from server in login");
      });
      
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

// rootTools.turnTimesList = [
//   {
//     "key": "standard", "value": 30, "label": "Standard (30s)"
//   },
//   {
//     "key": "turbo", "value": 20, "label": "Turbo (20s)"
//   },
//   {
//     "key": "hyTurbo", "value": 10, "label": "Hyper-Turbo (10s)"
//   },
// ]

rootTools.websiteLink                = "http://192.168.2.178/";
rootTools.connectorHost              = "192.168.2.27";
rootTools.connectorPort              = "3050";
rootTools.event                      = {};
rootTools.broadcast                  = {};
// rootTools.event.tournamentRoomChange = "TOURNAMENTROOMCHANGE";
// rootTools.event.cashGameTableChange  = "CASHGAMETABLECHANGE";
// rootTools.broadcast.tableUpdate      = "tableUpdate";
// rootTools.broadcast.addTable         = "addTable";
// rootTools.broadcast.removeTable      = "removeTable";
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

// rootTools.bonusCodeTypes = [
//   {
//     name: "Sign Up Bonus", type: 'signUp'
//   },
//   {
//     name: "One Time Bonus", type: 'oneTime'
//   },
//   {
//     name: "Recurring Bonus", type: 'recurring'
//   },
// ];

rootTools.filterModuleSubAffiliate = [1208, 1209, 1007, 1301, 1302, 1303, 1305];
rootTools.filterModuleAffiliate = [2005];
rootTools.antiBankingTime = 5400;





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


      // .state('createGameVersion', {
      //       url: "/createGameVersion",
      //       templateUrl: "views/createGameVersion.html",            
      //       data: {pageTitle: 'Admin Dashboard Template'},
      //       controller: "GameVersionsController",
      //       resolve: {
      //           deps: ['$ocLazyLoad', function($ocLazyLoad) {
      //               return $ocLazyLoad.load({
      //                   name: 'MetronicApp',
      //                   insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
      //                   files: [
      //                       '../assets/global/plugins/morris/morris.css',                            
      //                       '../assets/global/plugins/morris/morris.min.js',
      //                       '../assets/global/plugins/morris/raphael-min.js',                            
      //                       '../assets/global/plugins/jquery.sparkline.min.js',

                            
      //                       '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
      //                       'js/controllers/GameVersionsController.js',
      //                   ] 
      //               });
      //           }]
      //       }
      //   })

      //   .state('listGameVersions', {
      //       url: "/listGameVersions",
      //       templateUrl: "views/listGameVersions.html",            
      //       data: {pageTitle: 'Admin Dashboard Template'},
      //       controller: "GameVersionsController",
      //       resolve: {
      //           deps: ['$ocLazyLoad', function($ocLazyLoad) {
      //               return $ocLazyLoad.load({
      //                   name: 'MetronicApp',
      //                   insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
      //                   files: [
      //                       '../assets/global/plugins/morris/morris.css',                            
      //                       '../assets/global/plugins/morris/morris.min.js',
      //                       '../assets/global/plugins/morris/raphael-min.js',                            
      //                       '../assets/global/plugins/jquery.sparkline.min.js',

      //                       '../assets/pages/scripts/pagination.js',
      //                       '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
      //                       'js/controllers/GameVersionsController.js',
      //                   ] 
      //               });
      //           }]
      //       }
      //   })

      //   .state('editGameVersion', {
      //       url: "/gameVersion/edit/:gameVersionId",
      //       templateUrl: "views/editGameVersion.html",            
      //       data: {pageTitle: 'Admin Dashboard Template'},
      //       controller: "GameVersionsController",
      //       resolve: {
      //           deps: ['$ocLazyLoad', function($ocLazyLoad) {
      //               return $ocLazyLoad.load({
      //                   name: 'MetronicApp',
      //                   insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
      //                   files: [
      //                       '../assets/global/plugins/morris/morris.css',                            
      //                       '../assets/global/plugins/morris/morris.min.js',
      //                       '../assets/global/plugins/morris/raphael-min.js',                            
      //                       '../assets/global/plugins/jquery.sparkline.min.js',

                            
      //                       '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
      //                       'js/controllers/GameVersionsController.js',
      //                   ] 
      //               });
      //           }]
      //       }
      //   })

      //   .state('listScheduledMaintenances', {
      //       url: "/maintenance/list",
      //       templateUrl: "views/listMaintenance.html",            
      //       data: {pageTitle: 'Admin Dashboard Template'},
      //       controller: "MaintenanceController",
      //       resolve: {
      //           deps: ['$ocLazyLoad', function($ocLazyLoad) {
      //               return $ocLazyLoad.load({
      //                   name: 'MetronicApp',
      //                   insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
      //                   files: [
      //                       '../assets/global/plugins/morris/morris.css',                            
      //                       '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
      //                       '../assets/global/plugins/morris/morris.min.js',
      //                       '../assets/global/plugins/morris/raphael-min.js',                            
      //                       '../assets/global/plugins/jquery.sparkline.min.js',

                            
      //                       '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
      //                       '../assets/pages/scripts/pagination.js',
      //                       '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
      //                       'js/controllers/MaintenanceController.js',
      //                   ] 
      //               });
      //           }]
      //       }
      //   })

      //   .state('scheduleMaintenance', {
      //       url: "/maintenance/schedule",
      //       templateUrl: "views/scheduleMaintenance.html",            
      //       data: {pageTitle: 'Admin Dashboard Template'},
      //       controller: "MaintenanceController",
      //       resolve: {
      //           deps: ['$ocLazyLoad', function($ocLazyLoad) {
      //               return $ocLazyLoad.load({
      //                   name: 'MetronicApp',
      //                   insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
      //                   files: [
      //                       '../assets/global/plugins/morris/morris.css',                            
      //                       '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
      //                       '../assets/global/plugins/morris/morris.min.js',
      //                       '../assets/global/plugins/morris/raphael-min.js',                            
      //                       '../assets/global/plugins/jquery.sparkline.min.js',
                            
      //                       '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
      //                       '../assets/pages/scripts/pagination.js',
      //                       '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
      //                       'js/controllers/MaintenanceController.js',

      //                   ] 
      //               });
      //           }]
      //       }
      //   })

      //    .state('editMaintenance', {
      //       url: "/maintenance/schedule/edit/:maintenanceId",
      //       templateUrl: "views/editMaintenance.html",            
      //       data: {pageTitle: 'Admin Dashboard Template'},
      //       controller: "MaintenanceController",
      //       resolve: {
      //           deps: ['$ocLazyLoad', function($ocLazyLoad) {
      //               return $ocLazyLoad.load({
      //                   name: 'MetronicApp',
      //                   insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
      //                   files: [
      //                       '../assets/global/plugins/morris/morris.css',                            
      //                       '../assets/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
      //                       '../assets/global/plugins/morris/morris.min.js',
      //                       '../assets/global/plugins/morris/raphael-min.js',                            
      //                       '../assets/global/plugins/jquery.sparkline.min.js',
                            
      //                       '../assets/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
      //                       '../assets/pages/scripts/pagination.js',
      //                       '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
      //                       'js/controllers/MaintenanceController.js',

      //                   ] 
      //               });
      //           }]
      //       }
      //   })

         .state('levelTime', {
            url: "/levelTime",
            templateUrl: "views/levelTime.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "levelTimeController",
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
                            '../assets/global/plugins/bootstrap/css/bootstrap.css',
                            '../assets/pages/scripts/dashboard.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/levelTimeController.js',
                             '../assets/pages/scripts/pagination.js'
                        ] 
                    });
                }]
            }
        })

         .state('adsManagement', {
            url: "/adsManagement",
            templateUrl: "views/adsManagement.html",            
            data: {pageTitle: 'Admin Dashboard Template'},
            controller: "adsManagementController",
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
                            '../assets/global/plugins/bootstrap/css/bootstrap.css',
                            '../assets/pages/scripts/dashboard.min.js',
                            '../assets/global/plugins/bootstrap-sweetalert/sweetalert.min.js',
                            'js/controllers/adsManagementController.js',
                             '../assets/pages/scripts/pagination.js',
                              '../assets/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '../assets/apps/css/todo-2.css',
                            '../assets/global/plugins/select2/css/select2.min.css',
                            '../assets/global/plugins/select2/css/select2-bootstrap.min.css',

                            '../assets/global/plugins/select2/js/select2.full.min.js',
                            
                            '../assets/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',

                            '../assets/apps/scripts/todo-2.min.js',
                        ] 
                    });
                }]
            }
        })
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
}]);