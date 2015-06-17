'use strict';

var SettingsAdmin = angular.module('corvusadmin.settings', [
    'ui.router',
    'corvusadmin.settings.controllers',
    'corvusadmin.settings.services'
]);

SettingsAdmin.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('app.admin.settings', {
        url: '/settings',
        views: { 'content@': {
            templateUrl: '/app/admin/settings/partials/settings.html',
            controller: 'SettingsAdminController'
        }}
    });
}]);
