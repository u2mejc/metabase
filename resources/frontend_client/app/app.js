'use strict';
/*jslint browser:true*/

// Declare app level module which depends on filters, and services
var Corvus = angular.module('corvus', [
    'ui.router',
    'ct.ui.router.extras.sticky',
    'ct.ui.router.extras.dsr',
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'xeditable', // inplace editing capabilities
    'angularytics', // google analytics
    'ui.bootstrap', // bootstrap LIKE widgets via angular directives
    'gridster', // used for dashboard grids
    'ui.sortable',
    'readableTime',
    'corvus.admin',
    'corvus.auth',
    'corvus.filters',
    'corvus.directives',
    'corvus.controllers',
    'corvus.components',
    'corvus.card',
    'corvus.dashboard',
    'corvus.explore',
    'corvus.operator', // this is a short term hack
    'corvus.reserve',
    'corvus.user',
    'corvus.setup'
]);
Corvus.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });

    $urlRouterProvider.otherwise('/404');

    $stateProvider.state('app', {
        url: '/',
        views: {
            'nav@': {
                templateUrl: '/app/nav-main.html'
            },
            'content@': {
                template: '',
                controller: 'Homepage'
            }
        },
        resolve: {
            appState: ["AppState", function(AppState) {
                return AppState.init();
            }]
        }
    });
    $stateProvider.state('app.unauthorized', {
        url: 'unauthorized',
        views: {
            'content@': {
                templateUrl: '/app/unauthorized.html',
                controller: 'Unauthorized'
            }
        }
    });
    $stateProvider.state('app.notfound', {
        url: '404',
        views: {
            'content@': {
                template: 'not found'
            }
        }
    });
}]);

Corvus.run(["$rootScope", "$state", "$stateParams", "AppState", "editableOptions", "editableThemes", function($rootScope, $state, $stateParams, AppState, editableOptions, editableThemes) {
    // initialize app state
    AppState.init();

    // set `default` theme
    editableOptions.theme = 'default';

    // overwrite submit button template
    editableThemes['default'].submitTpl = '<button class="Button Button--primary" type="submit">Save</button>';
    editableThemes['default'].cancelTpl = '<button class="Button" ng-click="$form.$cancel()">cancel</button>';

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
}]);


if (document.location.hostname != "localhost") {
    // Only set up logging in production
    Corvus.config(["AngularyticsProvider", function(AngularyticsProvider) {
        AngularyticsProvider.setEventHandlers(['Console', 'GoogleUniversal']);
    }]).run(["Angularytics", function(Angularytics) {
        Angularytics.init();
    }]);
}
