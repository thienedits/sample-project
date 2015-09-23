(function() {
    'use strict';

    angular
        .module('app.core')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper, $rootScope, $state) {
        var otherwise = '/404';
        routerHelper.configureStates(getStates(), otherwise);

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
          // We can catch the error thrown when the $requireAuth promise is rejected
          // and redirect the user back to the home page
          if (error === 'AUTH_REQUIRED') {
            $state.go('login');
            console.log(error);
          }
        });
    }

    function getStates() {
        return [
            {
                state: '404',
                config: {
                    url: '/404',
                    templateUrl: 'app/core/404.html',
                    title: '404'
                }
            }
        ];
    }
})();
