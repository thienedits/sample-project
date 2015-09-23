(function() {
    'use strict';

    angular
        .module('app.home')
        .run(appRun);

    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    /* @ngInject */
    function getStates() {
        return [
            {
                state: 'home',
                config: {
                    url: '/',
                    templateUrl: 'app/home/home.html',
                    controller: 'HomeController',
                    controllerAs: 'vm',
                    title: 'Home',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-lock"></i> Home'
                    },
                }
            }
        ];
    }
})();
