'use strict';

var AdminPeople = angular.module('corvusadmin.people', [
    'ui.router',
    'corvusadmin.people.controllers'
]);

AdminPeople.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('app.admin.people', {
        url: '/people',
        views: { 'content@': {
            templateUrl: '/app/admin/people/partials/people.html',
            controller: 'PeopleList'
        }}
    });
    $stateProvider.state('app.admin.people_add', {
        url: '/people/add',
        views: { 'content@': {
            templateUrl: '/app/admin/people/partials/people_add.html',
            controller: 'PeopleAdd'
        }}
    });
}]);
