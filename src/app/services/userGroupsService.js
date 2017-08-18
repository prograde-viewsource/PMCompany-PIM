angular.module('productManager').factory('UserGroupService', UserGroupService);

function UserGroupService($rootScope, $state, OrderCloud) {
    "use strict";
    return {
        getList: function() {

            var self = this;
            let promise = new Promise((resolve, reject) => {
                if (!$rootScope._ug) {
                    OrderCloud.Me.Get().then(function(uD) {
                        OrderCloud.AdminUserGroups.ListUserAssignments(null, uD.ID).then(function(ug) {

                            let IDs = "";
                            angular.forEach(ug.Items, function(item) {
                                IDs += item.UserGroupID + "|";
                            });
                            IDs = IDs.substr(0, IDs.length - 1);

                            OrderCloud.AdminUserGroups.List(null, null, null, null, null, { 'ID': IDs }).then(function(data) {
                                 console.log('UserGroups')
                            console.log(data);
                                $rootScope._ug = data.Items;
                                resolve($rootScope._ug);
                            });
                        }).catch(function(error) {
                            console.log('Error --------------')
                            console.log(error);
                            try {
                                error.data.Errors[0].Data.AssignedRoles.forEach(function(assign) {
                                    if (assign.toLowerCase() === "passwordreset") {
                                        if ($state.current.name != "login.resetpass")
                                            $state.go('login', { token: 'resetpass' });
                                    }
                                });
                            } catch (e) {}

                        });;
                    }).catch(function(error) {
                        console.log(error);

                    });
                } else {
                    resolve($rootScope._ug);
                }
            });

            return promise;
        }
    };
}