'use strict';

// Card
var Card = angular.module('corvus.card', [
    'ui.router',
    'ngCookies',
    'corvus.filters',
    'corvus.directives',
    'corvus.services',
    'corvus.aceeditor.directives',
    'corvus.card.services',
    'corvus.card.controllers',
    'corvus.card.directives'
]);

Card.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('app.card', {
        url: 'card',
        views: { 'content@': {
            templateUrl: '/app/card/partials/card_list.html',
            controller: 'CardList'
        }}
    });
    $stateProvider.state('app.card.create', {
        url: '/create',
        views: { 'content@': {
            templateUrl: '/app/card/partials/card_detail.html',
            controller: 'CardDetail'
        }}
    });
    $stateProvider.state('app.card.show', {
        url: '/:cardId',
        views: { 'content@': {
            templateUrl: '/app/card/partials/card_detail.html',
            controller: 'CardDetail'
        }}
    });
}]);
