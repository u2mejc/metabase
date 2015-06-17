'use strict';

// Explore (Metabase)
var Explore = angular.module('corvus.explore', [
    'ui.router',
    'corvus.explore.controllers',
    'corvus.explore.services',
    'corvus.explore.directives'
]);

Explore.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('app.explore', {
        url: 'explore',
        views: { 'content@': {
            templateUrl: '/app/explore/partials/database_list.html',
            controller: 'ExploreDatabaseList'
        }}
    });
    $stateProvider.state('app.explore.table', {
        url: '/table/:tableId',
        views: { 'content@': {
            templateUrl: '/app/explore/partials/table_detail.html',
            controller: 'ExploreTableDetail'
        }}
    });
    $stateProvider.state('app.explore.table.entity', {
        url: '/:entityKey',
        views: { 'content@': {
            templateUrl: '/app/explore/partials/entity_detail.html',
            controller: 'ExploreEntityDetail'
        }}
    });
}]);
