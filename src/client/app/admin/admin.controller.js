(function () {
    'use strict';

    angular
        .module('app.admin')
        .controller('AdminController', AdminController);

    //AdminController.$inject = ['logger', '$location'];
    /* @ngInject */
    function AdminController(logger, $location, authFactory) {
        var vm = this;
        vm.title = 'Admin';
        //vm.user = authFactory.user;

        // if (user) {
        //     $location.path();
        // }
        activate();

        function activate() {
            logger.info('Activated Admin View');
            
        }
    }
})();
