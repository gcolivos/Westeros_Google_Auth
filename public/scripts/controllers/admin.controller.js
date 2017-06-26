googleAuthApp.controller('adminController', ['$http', '$scope', '$timeout', 'PDFService', 'EmailSearchService', 'UpdateUserService', 'AuthFactory', '$location', function($http, $scope, $timeout, PDFService, EmailSearchService, UpdateUserService, AuthFactory, $location) {
  console.log('inside admin controller');
  var vm = this;

  AuthFactory.isLoggedIn()
  .then(function (response) {
    if (response.data.status) {
      vm.displayLogout = true;
      AuthFactory.setLoggedIn(true);
      console.log(response.data);
      vm.username = response.data.name;
      vm.email = response.data.email;
      vm.id = response.data.id;
      if(response.data.admin !== true && response.data.teacher !== true){
        $location.path('/students');
      }
      else if(response.data.teacher){
        $location.path('/teachers');
      }
      // vm.homeroom = response.data.homeroom_id;
    } else { // is not logged in on server
      vm.displayLogout = false;
      AuthFactory.setLoggedIn(false);
    }
  },

  function () {
    vm.message.text = 'Unable to properly authenticate user';
    vm.message.type = 'error';
  });

  //start get slips for grades one and two
  vm.gradesKThroughTwo = function() {
    console.log('hitting k through two');
    return $http({
      method: 'GET',
      url: "/private/admin/" + "('k-1', 'k-2', '1-1', '1-2', '2-1', '2-2')"
    }).then(function(response) {
      vm.kThroughTwo = response.data;
      console.log('inside the then k-2');
      console.log('response: ', response);
    });
  }; //end get slips for grades one and two
  // vm.gradesKThroughTwo();

  //start get slips for three and four
  vm.gradesThreeAndFour = function() {
    console.log('hitting three and four');
    return $http({
      method: 'GET',
      url: "/private/admin/" + "('3-1', '3-1', '4-1', '4-2')"
    }).then(function(response) {
      vm.threeAndFour = response.data;
    });
  }; //end get slips for three and four

  //start get all slips for all grades
  vm.getAllSlipsForAllGrades = function() {
    console.log('hitting all slips for all grades');
    $http({
      method: 'GET',
      url: '/private/admin'
    }).then(function(response) {
      vm.allSlips = response.data.length;
    });
  }; //end of get all slips for all grades
  vm.getAllSlipsForAllGrades();

  //start post incentive
  vm.postIncentive = function() {
    console.log('hitting post inscentive');
    $http({
      method: 'POST',
      url: '/private/admin'
    }).then(function(response) {
      vm.incentive = response.data;
    });
  }; //end post incentive


  //start get incentive
  vm.getIncentive = function() {
    console.log('hitting get incentive');
    $http({
      method: 'GET',
      url: '/private/admin'
    }).then(function(response) {
      vm.incentive = response.data;
    });
  }; //end get incentive

  vm.clickKTwo = function() {
    vm.gradesKThroughTwo().then(function(response) {
      //need if statement to make sure it shows the correct grade group
      for (var i = 0; i < vm.kThroughTwo.length; i++) {
        console.log('inside loop click k two');
      }
    });
  };

  vm.clickThreeFour = function() {
    vm.gradesThreeAndFour().then(function(response){
      //need if statement to make sure it shows the correct grade group
      for (var i = 0; i<vm.threeAndFour.length; i++){
        console.log('inside loop click three four');
      }
    });
  };

  vm.makePDF = function() {
    PDFService.makeNewPDF();
  };

  vm.searchForEmail = function() {
    // vm.emailResults = [];
    EmailSearchService.findEmail(vm.searchedEmail).then(function(data){
      vm.emailResults = data;
    });
  };

  vm.makeUserAdmin = function(user){
    user.admin = true;
    UpdateUserService.updateUser(user, 'admin').then(function(response){
      if(response){
        vm.madeAdmin = true;
      }
      else{
        vm.madeAdmin = false;
      }
    });
  };

  vm.makeUserTeacher = function(user){
    user.teacher = true;
    UpdateUserService.updateUser(user, 'teacher').then(function(response){
      if(response){
        vm.madeTeacher = true;
      }
      else{
        vm.madeTeacher = false;
      }
    });
  };
}]);
