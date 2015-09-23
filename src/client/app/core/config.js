(function () {
    'use strict';

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    var config = {
        appErrorPrefix: '[usta Error] ',
        appTitle: 'usta'
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', 'routerHelperProvider', 'exceptionHandlerProvider', 
    '$mdThemingProvider', '$mdIconProvider'];

    /* @ngInject */
    function configure($logProvider, routerHelperProvider, exceptionHandlerProvider, $mdThemingProvider, $mdIconProvider) {
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
        exceptionHandlerProvider.configure(config.appErrorPrefix);
        routerHelperProvider.configure({docTitle: config.appTitle + ': '});

        $mdIconProvider
          .icon('menu', './images/menu.svg', 24)
          .icon('tennis-ball', './images/tennis-ball.svg', 24);

        $mdThemingProvider.theme('default')
          .primaryPalette('cyan')
          .accentPalette('lime');

    }

})();
