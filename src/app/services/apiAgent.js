angular.module('productManager').factory('apiAgentService', APIAgentService);

function APIAgentService($q, $rootScope, clientsecret) {
    "use strict";
    return {
        send: _send,
        assignProducts: _assignProducts,
        unassignProducts: _unassignProducts,
        assignAllProductsToCategory: _assignAllProductsToCategory,
        unassignProductsFromCategory: _unassignProductsFromCategory
    };

    function _send(callsArray) {

        $(function() {
            // Declare a proxy to reference the hub.
            var bulkHub = $.connection.bulkHub;
            $.connection.hub.url = 'https://pimbulkapi.azurewebsites.net/signalr/hubs';

            // Create a function that the hub can call to broadcast messages.
            bulkHub.client.broadcastMessage = function(resp) {
                $.connection.hub.stop();
                $rootScope.$broadcast('signalrStop', resp);
            };

            // Start the connection.
            $.connection.hub.start({ withCredentials: false }).done(function() {
                bulkHub.server.callAPI(clientsecret, JSON.stringify(callsArray));
                $rootScope.$broadcast('signalrStart');
            });

            $.connection.hub.error(function(error) {
                $rootScope.$broadcast('signalrStop', resp);
                alert('SignalR error: ' + error);
            });
        });
    }

    function _assignProducts(BuyerID, Filters = null, SearchFilter = null, TopRows = null) {

        $(function() {
            // Declare a proxy to reference the hub.
            var bulkHub = $.connection.bulkHub;
            $.connection.hub.url = 'https://pimbulkapi.azurewebsites.net/signalr';

            // Create a function that the hub can call to broadcast messages.
            bulkHub.client.broadcastMessage = function(resp) {
                $.connection.hub.stop();
                $rootScope.$broadcast('signalrStop', resp);
            };

            // Start the connection.
            $.connection.hub.start({ withCredentials: false }).done(function() {
                bulkHub.server.assignAllProducts(clientsecret, BuyerID, Filters, SearchFilter, null);
                $rootScope.$broadcast('signalrStart');
            });

            $.connection.hub.error(function(error) {
                $rootScope.$broadcast('signalrStop', resp);
                alert('SignalR error: ' + error);
            });
        });

    }

    function _assignAllProductsToCategory(BuyerID, CategoryID, Filters = null, SearchFilter = null, TopRows = null) {


        try {
            delete Filters.categoryid;
        } catch (e) {

        }
        $(function() {
            // Declare a proxy to reference the hub.
            var bulkHub = $.connection.bulkHub;
            $.connection.hub.url = 'https://pimbulkapi.azurewebsites.net/signalr';

            // Create a function that the hub can call to broadcast messages.
            bulkHub.client.broadcastMessage = function(resp) {
                $.connection.hub.stop();
                $rootScope.$broadcast('signalrStop', resp);
            };

            // Start the connection.
            $.connection.hub.start({ withCredentials: false }).done(function() {
                bulkHub.server.assignAllProductsToCategory(clientsecret, BuyerID, CategoryID, Filters, SearchFilter, null);
                $rootScope.$broadcast('signalrStart');
            });

            $.connection.hub.error(function(error) {
                $rootScope.$broadcast('signalrStop', resp);
                alert('SignalR error: ' + error);
            });
        });

    }

    function _unassignProducts(BuyerID, Filters = null, TopRows = null) {

        $(function() {
            // Declare a proxy to reference the hub.
            var bulkHub = $.connection.bulkHub;
            $.connection.hub.url = 'https://pimbulkapi.azurewebsites.net/signalr';

            // Create a function that the hub can call to broadcast messages.
            bulkHub.client.broadcastMessage = function(resp) {
                $.connection.hub.stop();
                $rootScope.$broadcast('signalrStop', resp);
            };

            // Start the connection.
            $.connection.hub.start({ withCredentials: false }).done(function() {
                bulkHub.server.removeAllProducts(clientsecret, BuyerID, null, null);
                $rootScope.$broadcast('signalrStart');
            });

            $.connection.hub.error(function(error) {
                $rootScope.$broadcast('signalrStop', resp);
                alert('SignalR error: ' + error);
            });
        });

    }

    function _unassignProductsFromCategory(BuyerID, CategoryID, Filters = null, TopRows = null) {

        $(function() {
            // Declare a proxy to reference the hub.
            var bulkHub = $.connection.bulkHub;
            $.connection.hub.url = 'https://pimbulkapi.azurewebsites.net/signalr';

            // Create a function that the hub can call to broadcast messages.
            bulkHub.client.broadcastMessage = function(resp) {
                $.connection.hub.stop();
                $rootScope.$broadcast('signalrStop', resp);
            };

            // Start the connection.
            $.connection.hub.start({ withCredentials: false }).done(function() {
                bulkHub.server.removeAllProductsFromCategory(clientsecret, BuyerID, CategoryID, null, null);
                $rootScope.$broadcast('signalrStart');
            });

            $.connection.hub.error(function(error) {
                $rootScope.$broadcast('signalrStop', resp);
                alert('SignalR error: ' + error);
            });
        });

    }
}