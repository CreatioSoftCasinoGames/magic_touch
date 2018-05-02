angular.module('MetronicApp').controller('levelTimeController', function($location, $cookies, $window, $rootScope, $scope, $stateParams, $http, $timeout) {
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
  $scope.levelList = [];
  $scope.formData.isLevelTime = 'false';
  $scope.formData.isBestTime = 'false';
  $scope.checkTime = function(){
    if($scope.formData.isLevelTime == "true"){
      $scope.toggleTime =  true;
      for(var i = 1; i<= 50; i++){
        var a = {level : i, time : 10}
        $scope.levelList.push(a);
      }
    }
    if($scope.formData.isLevelTime == "false"){
       $scope.toggleTime =  false;
    }
  };

  

  $scope.submit = function(){
    var data = angular.copy($scope.formData);
    data.levelTimeList = [];
    data.levelTimeList= $scope.levelList;
    console.log("data===== ", data);
    $http.post("/updateLevelTime", data)
        .success(function(res){
          if(res.success){
            swal("Success!", 'Level Time Updated Successfully');
            $location.path('/dashboard');
          }else{
            swal(res.info);
          }
        }).error(function(err){
          swal("Error!", "Getting error from server in updating table!");
        });
  }

  $scope.getLevelTime = function(){
    var data = {};
    $http.get("/getLevelTime", data)
      .success(function(res){
        if(res.success){
          console.log("--------", res);
          $scope.formData.isBestTime = res.result.isBestTime;
          if(res.result == null || res.result.isLevelTime == 'false'){
            $scope.formData.isLevelTime = 'false';
            // $scope.levelList = [];
            $scope.toggleTime = 'false';
          }else if(res.result.isLevelTime == 'true'){
            $scope.formData.isLevelTime = res.result.isLevelTime;
            $scope.levelList = res.result.levelTimeList;
            $scope.toggleTime = 'true';
          }
        }else{
          swal(res.info);
        }
      }).error(function(err){
        swal("Error!", "Getting error from server in getting level time!");
      })
  }

  $scope.getLevelTime();

});
