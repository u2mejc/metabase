'use strict';

angular
.module('corvus.admin', [
    'ui.router',
    'corvusadmin.databases',
    'corvusadmin.people',
    'corvusadmin.settings'
])
.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('app.admin', {
        url: 'admin',
        views: {
            'nav@': { templateUrl: '/app/nav-admin.html' }
        },
        deepStateRedirect: {
            default:  { state: 'app.admin.settings' }
        }
    })
}]);
