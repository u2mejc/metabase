'use strict';

// Dashboard
var Dashboard = angular.module('corvus.dashboard', [
    'ui.router',
    'ngCookies',
    'corvus.filters',
    'corvus.directives',
    'corvus.services',
    'corvus.dashboard.services',
    'corvus.dashboard.controllers',
    'corvus.dashboard.directives',
    'corvus.card.services'
]);

Dashboard.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('app.dash', {
        url: 'dash',
        views: { 'content@': {
            templateUrl: '/app/dashboard/partials/dash_list.html',
            controller: 'DashList'
        }}
    });
    $stateProvider.state('app.dash.create', {
        url: '/create',
        views: { 'content@': {
            templateUrl: '/app/dashboard/partials/dash_create.html',
            controller: 'DashDetail'
        }}
    });
    $stateProvider.state('app.dash.dashboard', {
        url: '/:dashId',
        views: { 'content@': {
            templateUrl: '/app/dashboard/partials/dash_view.html',
            controller: 'DashDetail'
        }}
    });
    $stateProvider.state('app.dash.for_card', {
        url: '/for_card/:cardId',
        views: { 'content@': {
            templateUrl: '/app/dashboard/partials/dash_list_for_card.html',
            controller: 'DashListForCard'
        }}
    });
}]);
