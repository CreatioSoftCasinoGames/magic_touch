angular.module('MetronicApp').controller('forgotPasswordController', function($location, $cookies, $rootScope, $scope, $stateParams, $http, $timeout,$window) { 
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
  

  });