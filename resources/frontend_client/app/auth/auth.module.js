'use strict';

var Auth = angular.module('corvus.auth', [
    'ui.router',
    'corvus.auth.controllers'
]);

Auth.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('app.auth', {
        url: 'auth',
        // views: { 'content@': { template: '<ui-view></ui-view>' }},
        deepStateRedirect: { default: { state: 'app.auth.login' }}
    });
    $stateProvider.state('app.auth.login', {
        url: '/login',
        views: { 'content@': {
            templateUrl: '/app/auth/partials/login.html',
            controller: 'Login'
        }}
    });
    $stateProvider.state('app.auth.logout', {
        url: '/logout',
        views: { 'content@': {
            template: '',
            controller: 'Logout'
        }}
    });
    $stateProvider.state('app.auth.forgot_password', {
        url: '/forgot_password',
        views: { 'content@': {
            templateUrl: '/app/auth/partials/forgot_password.html',
            controller: 'ForgotPassword'
        }}
    });
    $stateProvider.state('app.auth.reset_password', {
        url: '/forgot_password/:token',
        views: { 'content@': {
            templateUrl: '/app/auth/partials/password_reset.html',
            controller: 'PasswordReset'
        }}
    });
}]);
