(function() {
  'use strict';

  angular
  .module('app.dashboard')
  .controller('DashboardController', DashboardController);

  //DashboardController.$inject = ['$q', 'dataservice', 'logger', 'authFactory', '$firebaseObject'];
  /* @ngInject */
  function DashboardController($q, dataservice, logger, authFactory, $firebaseArray, $scope, AnalyticsFactory) {
    var vm = this;
    vm.news = {
      title: 'usta',
      description: 'Hot Towel Angular is a SPA template for Angular developers.'
    };
    vm.messageCount = 0;
    vm.people = [];
    vm.matches = [];
    vm.wins = 0;
    vm.losses = 0;
    vm.title = 'Dashboard';    
    vm.user = authFactory.user();
    vm.signedIn = true;
    vm.user.profile = authFactory.getProfile(vm.user.uid);
    vm.matches = $firebaseArray(authFactory.ref().child('user_matches').child(vm.user.uid));
    var matchList = new AnalyticsFactory(authFactory.ref().child('user_matches').child(vm.user.uid));

    activate();

    function activate() {
      
        
      
    }

    matchList.$watch(function(){
        vm.wins = matchList.getTotal().wins;
        vm.losses = matchList.getTotal().loss;
      });

  }
})();
