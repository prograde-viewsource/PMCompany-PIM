angular.module('productManager')

.config(AdminUsersConfig)
    .controller('AdminUsersCtrl', AdminUsersController)
    .controller('AdminUserEditCtrl', AdminUserEditController)
    .controller('AdminUserCreateCtrl', AdminUserCreateController);

function AdminUsersConfig($stateProvider) {
    "use strict";
    $stateProvider
        .state('adminusers', {
            parent: 'base',
            templateUrl: 'adminUsers/templates/adminUsers.tpl.html',
            controller: 'AdminUsersCtrl',
            controllerAs: 'adminUsers',
            url: '/adminUsers?search&page&pageSize&searchOn&sortBy&filters',
            data: { componentName: 'Users', OrderIndex: 999 },
            resolve: {
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                AdminUsersList: function(OrderCloud, Parameters, $state) {
                    return OrderCloud.AdminUsers.List(Parameters.search, Parameters.page, Parameters.pageSize || 50, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
                        .then(function(data) {
                            if (data.Items.length === 1 && Parameters.search) {
                                $state.go('adminUsers.edit', { adminuserid: data.Items[0].ID });
                            } else {
                                return data;
                            }
                        });
                }
            }
        })
        .state('adminusers.edit', {
            url: '/:adminuserid/edit',
            templateUrl: 'adminUsers/templates/adminUserEdit.tpl.html',
            controller: 'AdminUserEditCtrl',
            controllerAs: 'adminUserEdit',
            resolve: {
                SelectedAdminUser: function($stateParams, OrderCloud) {
                    return OrderCloud.AdminUsers.Get($stateParams.adminuserid);
                },
                SecurityProfilesAvailable: function($stateParams, OrderCloud) {
                    return OrderCloud.AdminUserGroups.List(null, null, 100, null, null, null);
                },
                AssignedSecurityProfile: function($stateParams, OrderCloud) {
                    return OrderCloud.AdminUserGroups.ListUserAssignments(null, $stateParams.adminuserid) //OrderCloud.SecurityProfiles.ListAssignments(null, $stateParams.adminuserid);
                }
            }
        })
        .state('adminusers.create', {
            url: '/create',
            templateUrl: 'adminUsers/templates/adminUserCreate.tpl.html',
            controller: 'AdminUserCreateCtrl',
            controllerAs: 'adminUserCreate',
            resolve: {
                SecurityProfilesAvailable: function(OrderCloud) {
                    return OrderCloud.AdminUserGroups.List(null, null, 100, null, null, null);
                }
            }
        });
}

function AdminUsersController($state, $ocMedia, OrderCloudParameters, AdminUsersList, OrderCloud, Parameters) {
    "use strict";
    var vm = this;
    vm.list = AdminUsersList;
    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;

    //Check if filters are applied
    vm.filtersApplied = vm.parameters.filters || ($ocMedia('max-width:767px') && vm.sortSelection); //Sort by is a filter on mobile devices
    vm.showFilters = vm.filtersApplied;

    //Check if search was used
    vm.searchResults = Parameters.search && Parameters.search.length > 0;

    //Reload the state with new parameters
    vm.filter = function(resetPage) {
        $state.go('.', OrderCloudParameters.Create(vm.parameters, resetPage));
    };

    //Reload the state with new search parameter & reset the page
    vm.search = function() {
        vm.filter(true);
    };

    //Clear the search parameter, reload the state & reset the page
    vm.clearSearch = function() {
        vm.parameters.search = null;
        vm.filter(true);
    };

    //Clear relevant filters, reload the state & reset the page
    vm.clearFilters = function() {
        vm.parameters.filters = null;
        $ocMedia('max-width:767px') ? vm.parameters.sortBy = null : angular.noop(); //Clear out sort by on mobile devices
        vm.filter(true);
    };

    //Conditionally set, reverse, remove the sortBy parameter & reload the state
    vm.updateSort = function(value) {
        value ? angular.noop() : value = vm.sortSelection;
        switch (vm.parameters.sortBy) {
            case value:
                vm.parameters.sortBy = '!' + value;
                break;
            case '!' + value:
                vm.parameters.sortBy = null;
                break;
            default:
                vm.parameters.sortBy = value;
        }
        vm.filter(false);
    };

    //Used on mobile devices
    vm.reverseSort = function() {
        Parameters.sortBy.indexOf('!') === 0 ? vm.parameters.sortBy = Parameters.sortBy.split('!')[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    };

    //Reload the state with the incremented page parameter
    vm.pageChanged = function() {
        $state.go('.', { page: vm.list.Meta.Page });
    };

    //Load the next page of results with all of the same parameters
    vm.loadMore = function() {
        return OrderCloud.AdminUsers.List(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };
}

function AdminUserEditController($exceptionHandler, $state, $q, OrderCloud, SelectedAdminUser, toastr, SecurityProfilesAvailable, AssignedSecurityProfile, Audit) {
    "use strict";
    var vm = this,
        adminuserid = SelectedAdminUser.ID;
    vm.adminUserName = SelectedAdminUser.Username;
    vm.adminUser = SelectedAdminUser;
    vm.securityProfilesAvailable = SecurityProfilesAvailable.Items;
    vm.adminUser.SecurityProfileIDS = [];



    AssignedSecurityProfile.Items.forEach(function(sp) {
        vm.adminUser.SecurityProfileIDS.push(sp.UserGroupID);
    });

    vm.securityProfilesAvailable.forEach(function(spa) {
        if (vm.adminUser.SecurityProfileIDS.includes(spa.ID)) {
            spa.selected = true;
        }
    });

    vm.assignedSecurityProfile = AssignedSecurityProfile;
    if (vm.adminUser.TermsAccepted !== null) {
        vm.TermsAccepted = true;
    }



    vm.Submit = function() {
        OrderCloud.AdminUsers.Update(adminuserid, vm.adminUser)
            .then(function() {
                var q = [];
                vm.securityProfilesAvailable.forEach(function(spa) {
                    if (spa.selected) {
                        q.push(OrderCloud.AdminUserGroups.SaveUserAssignment({
                            UserID: vm.adminUser.ID,
                            UserGroupID: spa.ID
                        }));
                    } else {
                        if (vm.adminUser.SecurityProfileIDS.includes(spa.ID)) {
                            q.push(OrderCloud.AdminUserGroups.DeleteUserAssignment(spa.ID, vm.adminUser.ID));
                        }
                    }
                });


                $q.all(q).then(function(results) {
                    $state.go('adminusers', {}, { reload: true });
                    toastr.success('User Updated', 'Success');
                    Audit.log("User", vm.adminUser.Email, [{ "Type": "User", "TargetID": vm.adminUser.Email, "newState": vm.adminUser.ID }], 'UPDATE');
                });

                if (q.length > 1) {
                    $state.go('adminusers', {}, { reload: true });
                    toastr.success('User Updated', 'Success');
                    Audit.log("User", vm.adminUser.Email, [{ "Type": "User", "TargetID": vm.adminUser.Email, "newState": vm.adminUser.ID }], 'UPDATE');
                }

            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.Delete = function() {
        OrderCloud.AdminUsers.Delete(adminuserid)
            .then(function() {
                $state.go('adminusers', {}, { reload: true });
                toastr.success('User Deleted', 'Success');
                Audit.log("User", vm.adminUserName, [{ "Type": "User", "TargetID": vm.adminUser.ID, }], 'DELETE');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };
}


function AdminUserCreateController($exceptionHandler, $state, OrderCloud, toastr, SecurityProfilesAvailable, Audit, $q) {
    "use strict";
    var vm = this;
    vm.adminUser = { Email: "", Password: "" };
    vm.securityProfilesAvailable = SecurityProfilesAvailable.Items;

    vm.Submit = function() {
        var today = new Date();
        vm.adminUser.TermsAccepted = today;
        OrderCloud.AdminUsers.Create(vm.adminUser)
            .then(function(results) {
                OrderCloud.SecurityProfiles.SaveAssignment({
                    "SecurityProfileID": "Admin",
                    "UserID": results.ID
                }).then(function(data) {

                    var q = [];
                    console.log(data)

                    vm.securityProfilesAvailable.forEach(function(spa) {
                        if (spa.selected) {
                            q.push(OrderCloud.AdminUserGroups.SaveUserAssignment({ UserID: data.UserID, UserGroupID: spa.ID }));

                        }
                    });

                    $q.all(q).then(function(results) {
                        $state.go('adminusers', {}, { reload: true });
                        toastr.success('User Created', 'Success');
                        Audit.log("User", vm.adminUser.Email, [{ "Type": "User", "TargetID": vm.adminUser.Email, "newState": data.ID }], 'CREATE');
                    });

                    if (q.length > 1) {
                        $state.go('adminusers', {}, { reload: true });
                        toastr.success('User Created', 'Success');
                        Audit.log("User", vm.adminUser.Email, [{ "Type": "User", "TargetID": vm.adminUser.Email, "newState": data.ID }], 'CREATE');
                    }

                }).catch(function(ex) {
                    $exceptionHandler(ex);
                });
            }).catch(function(ex) {
                $exceptionHandler(ex);
            });
    };
}