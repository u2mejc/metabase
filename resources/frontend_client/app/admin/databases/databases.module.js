'use strict';

var AdminDatabases = angular.module('corvusadmin.databases', [
    'ui.router',
    'corvusadmin.databases.controllers'
]);

AdminDatabases.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('app.admin.databases', {
        url: '/databases',
        views: { 'content@': {
            templateUrl: '/app/admin/databases/partials/database_list.html',
            controller: 'DatabaseList'
        }}
    });
    $stateProvider.state('app.admin.database_create', {
        url: '/databases/create',
        views: { 'content@': {
            templateUrl: '/app/admin/databases/partials/database_edit.html',
            controller: 'DatabaseEdit'
        }}
    });
    $stateProvider.state('app.admin.database', {
        url: '/databases/:databaseId',
        views: { 'content@': {
            templateUrl: '/app/admin/databases/partials/database.html',
            controller: 'DatabaseController'
        }},
        deepStateRedirect: {
            default: { state: 'app.admin.database.tables' },
            params: ['databaseId']
        }
    });
    $stateProvider.state('app.admin.database.settings', {
        url: '/settings',
        views: {
            'settings': {
                templateUrl: '/app/admin/databases/partials/database_edit_pane.html',
                controller: 'DatabaseEdit'
            }
        },
        sticky: true,
        deepStateRedirect: { params: ['databaseId'] }
    });
    $stateProvider.state('app.admin.database.tables', {
        url: '/tables',
        views: {
            'tables': {
                templateUrl: '/app/admin/databases/partials/database_master_detail.html',
            }
        },
        sticky: true,
        deepStateRedirect: { params: ['databaseId'] }
    });
    $stateProvider.state('app.admin.database.tables.detail', {
        url: '/:tableId',
        views: {
            'detail': {
                templateUrl: '/app/admin/databases/partials/database_table_detail.html',
                controller: 'DatabaseTable'
            }
        }
    });
}]);
