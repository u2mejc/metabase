"use strict";

var UserAdmin = angular.module('corvus.user', [
    'ui.router',
    'ngCookies',
    'corvus.filters',
    'corvus.directives',
    'corvus.services',
    'corvus.metabase.services',
    'corvus.user.controllers',
    'corvus.user.directives'
]);

UserAdmin.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('app.user', {
        url: 'user',
        abstract: true
    })
    $stateProvider.state('app.user.edit', {
        url: '/edit_current',
        views: { 'content@': {
            templateUrl: '/app/user/partials/edit_current_user.html',
            controller: 'EditCurrentUser'
        }}
    });
}]);
