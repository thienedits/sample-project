(function() {
  'use strict';

  angular
  .module('app.register')
  .run(appRun);

  appRun.$inject = ['routerHelper'];
  
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return [
      {
        state: 'register',
        config: {
          url: '/register',
          templateUrl: 'app/register/register.html',
          controller: 'RegisterController',
          controllerAs: 'vm',
          title: 'register',
          settings: {
            
          }
        }
      },
      {
        state: 'login',
        config: {
          url: '/login',
          templateUrl: 'app/register/login.html',
          controller: 'RegisterController',
          controllerAs: 'vm',
          title: 'login',
          settings: {
            
          }
        }
      }
    ];
  }
})();
