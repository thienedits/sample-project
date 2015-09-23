(function() {
    'use strict';

    angular
        .module('app.admin')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    /* @ngInject */
    function getStates() {
        return [
            {
                state: 'admin',
                config: {
                    url: '/admin',
                    templateUrl: 'app/admin/admin.html',
                    controller: 'AdminController',
                    controllerAs: 'vm',
                    title: 'Admin',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Admin'
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
