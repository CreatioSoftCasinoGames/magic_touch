angular.module('MetronicApp').controller('DashboardController', function($location, $rootScope, $cookies, $scope, $http, $timeout) {
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

      // if($cookies.get('poker_role')){
      if($rootScope.poker_role){
        $scope.isAdminLogin = true;

      }
      // $scope.findBalanceSheetDetails();


});