angular.module('ordercloud-paging-helpers', ['ordercloud-assignment-helpers'])

.factory('Paging', PagingHelpers)

;

function PagingHelpers($q, OrderCloud, Assignments) {
    "use strict";
    return {
        setSelected: setSelected,
        paging: pagingFunction,
        filteredPaging: filteredPagingFunction
    };

    function setSelected(ListArray, AssignmentsArray, ID_Name) {
        if (!ListArray || !AssignmentsArray || !ID_Name) { return; }
        var assigned = Assignments.getAssigned(AssignmentsArray, ID_Name);
        angular.forEach(ListArray, function(item) {
            if (assigned.indexOf(item.ID) > -1) {
                item.selected = true;
            }
        });
    }

    function pagingFunction(ListObject, ServiceName, AssignmentObjects, AssignmentFunc) {
        var Service = OrderCloud[ServiceName];
        if (Service && ListObject.Meta.Page < ListObject.Meta.TotalPages) {
            var queue = [];
            var dfd = $q.defer();
            if (ServiceName !== 'Orders' && ServiceName !== 'Categories') {
                queue.push(Service.List(null, ListObject.Meta.Page + 1, ListObject.Meta.PageSize));
            }
            if (ServiceName === 'Orders') {
                queue.push(Service.ListIncoming(null, null, null, ListObject.Meta.Page + 1, ListObject.Meta.PageSize));
            }
            if (ServiceName === 'Categories') {
                queue.push(Service.List(null, 'all', ListObject.Meta.Page + 1, ListObject.Meta.PageSize));
            }
            if (AssignmentFunc !== undefined && (AssignmentObjects.Meta.Page < AssignmentObjects.Meta.TotalPages)) {
                queue.push(AssignmentFunc());
            }
            $q.all(queue).then(function(results) {
                dfd.resolve();
                ListObject.Meta = results[0].Meta;
                ListObject.Items = [].concat(ListObject.Items, results[0].Items);
                if (results[1]) {
                    AssignmentObjects.Meta = results[1].Meta;
                    AssignmentObjects.Items = [].concat(AssignmentObjects.Items, results[1].Items);
                }
            });
            return dfd.promise;
        } else { return null; }
    }

    // AG - added 1/12/17 to accomodate filtered pagining 
    function filteredPagingFunction(ListObject, ServiceName, searchValue, paramObject, assigned = null) {
        var Service = OrderCloud[ServiceName];
        console.log(Service);
        console.log(ListObject.Meta);
        if (Service && ListObject.Meta.Page <= ListObject.Meta.TotalPages) {
            var queue = [];
            var dfd = $q.defer();
            if (ServiceName !== 'Orders' && ServiceName !== 'Categories') {
                queue.push(Service.List(searchValue, ListObject.Meta.Page + 1, ListObject.Meta.PageSize, null, null, paramObject));
            }
            if (ServiceName === 'Orders') {
                queue.push(Service.ListIncoming(searchValue, null, null, ListObject.Meta.Page + 1, ListObject.Meta.PageSize));
            }
            if (ServiceName === 'Categories') {
                queue.push(Service.List(searchValue, 'all', ListObject.Meta.Page + 1, ListObject.Meta.PageSize));
            }

            $q.all(queue).then(function(results) {
                dfd.resolve();
                ListObject.Meta = results[0].Meta;

                if (assigned == null) {
                    ListObject.Items = [].concat(ListObject.Items, results[0].Items);
                } else {

                    ListObject.Items = [].concat(ListObject.Items, results[0].Items);

                    ListObject.Items = ListObject.Items.filter(function(current) {
                        return assigned.Items.filter(function(current_b) {
                            return current_b.ID === current.ID;
                        }).length === 0;

                    });

                    ListObject.Items = _.uniq(ListObject.Items, function(item, key, a) {
                        return item.ID;
                    });
                }
                if (results[1]) {
                    AssignmentObjects.Meta = results[1].Meta;
                    AssignmentObjects.Items = [].concat(AssignmentObjects.Items, results[1].Items);
                }
            });
            return dfd.promise;
        } else { return null; }
    }
}