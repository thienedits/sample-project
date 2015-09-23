(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'dashboard',
                config: {
                    url: '/dashboard',
                    templateUrl: 'app/dashboard/dashboard.html',
                    controller: 'DashboardController',
                    controllerAs: 'vm',
                    title: 'dashboard',
                    settings: {
                        nav: 1,
                        content: '<i class="fa fa-dashboard"></i> Dashboard'
                    },
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        // Auth refers to our $firebaseAuth wrapper in the example above
                        user: ['authFactory', function(authFactory) {
                          // $requireAuth returns a promise so the resolve waits for it to complete
                          // If the promise is rejected, it will throw a $stateChangeError (see above)
                          return authFactory.requireAuth();
                        }]
                    }
                }
            }
        ];
    }
})();
