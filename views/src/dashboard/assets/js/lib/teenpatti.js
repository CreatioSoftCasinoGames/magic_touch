angular.module('slot', []).controller('BingoController', ['$scope', '$window', function($scope, $window) {

	$scope.machines = [];
  $scope.deck = [];
  $scope.numPlayers = 0;
  $scope.totalBingosLeft = 0;
  $scope.totalCards = 0;

  $scope.getMachines = function() {
		window.pomelo.request("slot.slotHandler.getMachines", {}, function(data) {
			console.log(data)
      mySlot.showPartial(".machines");
      $scope.$apply(function () {
        $scope.machines = data.machines;
      });
    });
  };

  $scope.joinMachine = function(machineId) {
  	window.pomelo.request("connector.entryHandler.joinMachine", {machineId: machineId}, function(data) {
      console.log(data)
  		mySlot.showPartial(".machine");
      $scope.$apply(function () {
        $scope.machineDetails = data.machineName + " | " + data.level + " | " + data.startsIn + " sec | " + data.endsIn + " sec | " + data.pointsRequired + " pt" ;
        $scope.players        = data.players;
        $scope.playersToAdd   = 0;
        $scope.pot            = data.pot;
        $scope.seedMoney      = data.seedMoney;
        $scope.myPoints       = data.playerPoints;
        $scope.awards         = data.awards;
        $scope.playerId       = data.playerId;
      });
  	})
  };

  $scope.sit = function() {
    var amount = prompt("Enter total amount!");
    window.pomelo.request("slot.slotHandler.sit", {amount: amount}, function(data) {
      console.log(data)
    })
  };

  $scope.myFriends = function() {
    window.pomelo.request("slot.slotHandler.myFriends", {}, function(data) {
      console.log(data)
    })
  };

  $scope.spinStatus = function() {
    var amount = prompt("Enter amount to bet!");
    window.pomelo.request("slot.slotHandler.spinStatus", {coinsBet: amount, coinsWin: parseInt(amount)/20}, function(data) {
      console.log(data)
      $scope.$apply(function () {
        if(data.success) {
          $scope.myPoints = data.playerPoints;
        } else {
          $scope.myPoints = data.msg;
        }
      })
    });
  };

  $scope.standUp = function() {
    window.pomelo.request("connector.entryHandler.standUp", {}, function(data) {
      mySlot.showPartial(".machines");
      console.log(data)
    })
  };

  $scope.killChannel = function() {
    var tournamentId = prompt("Which tournament (id from dashboard) do you want to kill?")
    if(!!tournamentId) {
      window.pomelo.request("slot.slotHandler.killChannel", {tournamentId: parseInt(tournamentId)}, function(data) {
        console.log(data)
      });
    }
  };

  var listenCallbacks = function() {

    window.pomelo.on("gameStarted", function(data) {
      $scope.$apply(function () {
        
      })
    })

    window.pomelo.on("gameOver", function(data) {
      alert('Game is over !');
      $scope.$apply(function () {
        $scope.gameStatus = "// (" + data.uid + ") finished at rank " + data.rank + " with points - " + data.point + " and prize - " + data.prize ;
      })
    });

    window.pomelo.on("refresh_tournament", function(data) {
      alert('The tournament has been killed, Play again!');
      mySlot.showPartial(".machines");
    })

    window.pomelo.on("customLeaderBoard", function(data) {
      $scope.$apply(function () {
        $scope.topThreeList   = data.topThreeList;
        $scope.remainingList  = data.remainingList;
        $scope.winners        = data.awards.length;
        $scope.players        = data.totalPlayers;
        $scope.pot            = data.pot;
        $scope.awards         = data.awards;
      })
    })

    window.pomelo.on("jackpot", function(data) {
      $scope.$apply(function () {
        $scope.maxJackpot = data[0].amount;
        $scope.minJackpot = data[1].amount;
      })
    })

    window.pomelo.on("jackpotWinner", function(data) {
      alert(data.winner_name + " ("+data.winner_token+") wins " + data.jackpot_type + " jackpot of amount - " + data.amount);
    })

    window.pomelo.on("serverMaintenace", function(data) {
      alert(data);
    })

    window.pomelo.on("kickPlayer", function(data) {
      alert(data);
    })

    window.pomelo.on("addPlayer", function(data) {
      $scope.$apply(function () {
        $scope.players = data.players;
        $scope.playersToAdd = data.playersToAdd;
      })
    })

  };

  listenCallbacks();

}])