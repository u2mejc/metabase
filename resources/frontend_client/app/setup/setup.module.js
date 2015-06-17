'use strict';

var Setup = angular.module('corvus.setup', [
    'ui.router',
    'corvus.setup.controllers',
    'corvus.setup.directives'
]);

Setup.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('app.setup', {
        url: 'setup'
    });
    $stateProvider.state('app.setup.init', {
        url: '/init/:setupToken',
        views: { 'content@': {
                template: '',
                controller: 'SetupInit'
        }}
    });
    $stateProvider.state('app.setup.welcome', {
        url: '/welcome',
        views: { 'content@': {
                templateUrl: '/app/setup/partials/setup_welcome.html'
        }}
    });
    $stateProvider.state('app.setup.info', {
        url: '/info',
        views: { 'content@': {
            templateUrl: '/app/setup/partials/setup_info.html',
            controller: 'SetupInfo'
        }}
    });
}]);
