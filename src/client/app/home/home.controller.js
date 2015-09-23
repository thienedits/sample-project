(function () {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    /* @ngInject */
    function HomeController(logger, $location, authFactory) {
        var vm = this;
        vm.title = 'Home';
        //vm.user = authFactory.user;

        // if (user) {
        //     $location.path();
        // }
        activate();

        function activate() {
            logger.info('Activated Home View');
            
        }
    }
})();
