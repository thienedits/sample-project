(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('ShellController', ShellController);

    ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger', 'authFactory', '$mdSidenav'];
    /* @ngInject */
    function ShellController($rootScope, $timeout, config, logger, authFactory, $mdSidenav) {
        var vm = this;
        vm.busyMessage = 'Please wait ...';
        vm.isBusy = true;
        vm.logout = logout;
        //vm.signedIn = (authFactory.user()) ? true : false;
        vm.toggleList = toggleList;

        $rootScope.showSplash = true;
        vm.navline = {
            title: config.appTitle,
            text: 'Created by John Papa',
            link: 'http://twitter.com/john_papa'
        };

        activate();

        function activate() {
            logger.success(config.appTitle + ' loaded!', null);
            hideSplash();
        }

        function hideSplash() {
            //Force a 1 second delay so we can see the splash.
            $timeout(function() {
                $rootScope.showSplash = false;
            }, 1000);
        }

        function logout() {
            authFactory.logout();
        }

        function toggleList() {
            $mdSidenav('left').toggle();
        } 

    }
})();
