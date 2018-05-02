angular.module('MetronicApp').controller('adsManagementController', function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
  $scope.$on('$viewContentLoaded', function() {  
      // initialize core components
      App.initAjax();
  });
  console.log("yessss, list players controller loaded");
  if(!$rootScope.isAdminLogin){
    console.log('yes')
    $location.path('/login.html')
  }
   
  $scope.formData = {};
  $scope.formData.isAdsVisible = 'false';
  $scope.checkTime = function(){
    if($scope.formData.isAdsVisible == "true"){
       $scope.toggleTime =  true;
    }
    if($scope.formData.isAdsVisible == "false"){
       $scope.toggleTime =  false;
       $scope.formData.levelTime = 0;
    }
  };


  $scope.submit = function(){
    var data = angular.copy($scope.formData);
    console.log("data===== ", data);
    $http.post("/updateAdsStatus", data)
        .success(function(res){
          if(res.success){
            swal("Success!", 'Ads Status Updated Successfully');
            $location.path('/dashboard');
          }else{
            swal(res.info);
          }
        }).error(function(err){
          swal("Error!", "Getting error from server in updating Ads status!");
        });
  }

  $scope.getAdsStatus = function(){
    var data = {};
    $http.get("/getAdsStatus", data)
      .success(function(res){
        if(res.success){
          console.log("--------", res);
          $scope.formData.isAdsVisible = res.result.isAdsVisible;
          $scope.toggleTime = 'true';
        }else{
          swal(res.info);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in getting level time!");
      })
  }

  $scope.getAdsStatus();

});
