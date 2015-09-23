(function() {
    'use strict';

    angular
        .module('app.layout')
        .controller('SidebarController', SidebarController);

    //SidebarController.$inject = ['$state', 'routerHelper', 'authFactory'];
    /* @ngInject */
    function SidebarController($state, $scope, routerHelper, authFactory, $mdSidenav, $location, $mdToast) {
        var vm = this;
        var states = routerHelper.getStates();
        vm.isSelected = isSelected;
        vm.logout = logout;
        vm.toggleList = toggleList;
        vm.importMatches =  importMatches;
        vm.updateMatches = updateMatches;
        vm.sideNavClick = sideNavClick;

        activate();

        function activate() { getNavRoutes(); }

        authFactory.ref().onAuth(function(authData) {
          if (authData) {
            vm.user = authFactory.user();
            vm.signedIn = true;
            vm.user.profile = authFactory.getProfile(vm.user.uid);
          } else {
            vm.signedIn = false;
            console.log("Client unauthenticated.");
          }
        });

        $scope.$on('$locationChangeStart', function(next, current) { 
           showToolbar();
         });

        function getNavRoutes() {
            vm.navRoutes = states.filter(function(r) {
                return r.settings && r.settings.nav;
            }).sort(function(r1, r2) {
                return r1.settings.nav - r2.settings.nav;
            });
        }

        function showToolbar() {
            if ( $location.path() === '/login' ||
                $location.path() === '/register' ||
                $location.path() === '/') {

                vm.showToolbar = false;
            } else {
                vm.showToolbar = true;
            }
        }

        function isSelected(route) {
            if (!route.title || !$state.current || !$state.current.title) {
                return '';
            }
            var menuName = route.title;
            return $state.current.title.substr(0, menuName.length) === menuName ? 'selected' : '';
        }

        function importMatches () {

          authFactory.import(vm.user).then(function (data) {
            console.log(data);  
            $mdToast.show(
              $mdToast.simple()
                .content('Matches Updated!')
                .position('right bottom')
                .hideDelay(1000)
            );
          });
                
        }

        function updateMatches () {

          authFactory.updateMatches(vm.user).then(function (data) {
                console.log(data);
            });
             console.log("foooo");   
        }

        function logout() {
          $mdSidenav('left')
            .close()
            .then(function(){
              authFactory.logout();
              vm.signedIn = false;
              $location.path('/login');
            });
            
        }

        function toggleList() {
            $mdSidenav('left').toggle();
        } 

        function sideNavClick(route) {
            $mdSidenav('left')
              .close()
              .then(function(){
                $state.go(route.name);
              });
                
        }

    }
})();
