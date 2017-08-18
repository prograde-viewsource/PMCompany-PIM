function makeApiCall(method, routingUrl, parameters, requestBody) {
    var d = $q.defer();
    $resource(apiurl + routingUrl, parameters, {
        callApi: {
            method: method,
            headers: {'Authorization': 'Bearer ' + Auth().ReadToken()}
        }
    }).callApi(requestBody).$promise
        .then(function(data) {
            d.resolve(data);
        })
        .catch(function(ex) {
            d.reject(ex);
        });
    impersonating = false;
    return d.promise;
}