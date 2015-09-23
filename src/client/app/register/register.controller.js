(function() {
  'use strict';

  angular
  .module('app.register')
  .controller('RegisterController', RegisterController);

  RegisterController.$inject = ['logger', '$location', 'authFactory', '$state'];
  /* @ngInject */
  function RegisterController(logger, $location, authFactory, $state) {
    var vm = this;

    if (authFactory.user()) {
      //$location.path('/dashboard');

      $state.go('dashboard');
    }

    activate();

    function activate() {
      logger.info('Activated Register View');
    }

    vm.login = function () {
      authFactory.login(vm.user).then(function () {
        $location.path('/dashboard');
      });
    };

    vm.register = function () {
      authFactory.register(vm.user).then(function(user) {
        return authFactory.login(vm.user).then(function(user) {
          user.username = vm.user.name;
          return authFactory.createProfile(user);
        }).then(function() {
          $location.path('/dashboard');
        });
      }, function(error) {
        vm.error = error.toString();
      });
    };

    vm.facebookLogin = function () {
      authFactory.ref().authWithOAuthRedirect("facebook", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }
      });
    };

    vm.googleLogin = function () {
      authFactory.ref().authWithOAuthRedirect("google", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }
      });
    };
  }
})();

