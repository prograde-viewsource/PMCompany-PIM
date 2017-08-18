angular.module('productManager')
    .config(AdminUserGroupsConfig)
    .controller('AdminUserGroupsCtrl', AdminUserGroupsController)
    .controller('AdminUserGroupEditCtrl', AdminUserGroupEditController)
    .controller('AdminUserGroupCreateCtrl', AdminUserGroupCreateController)
    .controller('AdminUserGroupAssignCtrl', AdminUserGroupAssignController);

function AdminUserGroupsConfig($stateProvider) {
    "use strict";
    $stateProvider
        .state('adminusergroups', {
            parent: 'base',
            templateUrl: 'adminUserGroups/templates/adminUserGroups.tpl.html',
            controller: 'AdminUserGroupsCtrl',
            controllerAs: 'adminUserGroups',
            url: '/adminusergroups',
            data: { componentName: 'User Groups' },
            resolve: {
                Parameters: function($stateParams, OrderCloudParameters) {
                    return OrderCloudParameters.Get($stateParams);
                },
                AdminUserGroupList: function(OrderCloud, Parameters) {
                    return OrderCloud.AdminUserGroups.List(Parameters.search, Parameters.page, Parameters.pageSize || 100, Parameters.searchOn, Parameters.sortBy, Parameters.filters);
                }
            }
        })
        .state('adminusergroups.edit', {
            url: '/:adminusergroupid/edit',
            templateUrl: 'adminUserGroups/templates/adminUserGroupEdit.tpl.html',
            controller: 'AdminUserGroupEditCtrl',
            controllerAs: 'adminUserGroupEdit',
            resolve: {
                SelectedAdminUserGroup: function($stateParams, OrderCloud) {
                    return OrderCloud.AdminUserGroups.Get($stateParams.adminusergroupid);
                }
            }
        })
        .state('adminusergroups.create', {
            url: '/create',
            templateUrl: 'adminUserGroups/templates/adminUserGroupCreate.tpl.html',
            controller: 'AdminUserGroupCreateCtrl',
            controllerAs: 'adminUserGroupCreate'
        })
        .state('adminusergroups.assign', {
            url: '/:adminusergroupid/assign',
            templateUrl: 'adminUserGroups/templates/adminUserGroupAssign.tpl.html',
            controller: 'AdminUserGroupAssignCtrl',
            controllerAs: 'adminUserGroupAssign',
            resolve: {
                AdminUserList: function(OrderCloud) {
                    return OrderCloud.AdminUsers.List(null, 1, 20);
                },
                AssignedAdminUsers: function($stateParams, OrderCloud) {
                    return OrderCloud.AdminUserGroups.ListUserAssignments($stateParams.adminusergroupid);
                },
                SelectedAdminUserGroup: function($stateParams, OrderCloud) {
                    return OrderCloud.AdminUserGroups.Get($stateParams.adminusergroupid);
                }
            }
        });
}

function AdminUserGroupsController($state, $ocMedia, OrderCloud, OrderCloudParameters, AdminUserGroupList, Parameters) {
    "use strict";
    var vm = this;
    vm.list = AdminUserGroupList;

    vm.parameters = Parameters;
    vm.sortSelection = Parameters.sortBy ? (Parameters.sortBy.indexOf('!') === 0 ? Parameters.sortBy.split('!')[1] : Parameters.sortBy) : null;


    //check if filters are applied:
    vm.filtersApplied = vm.parameters.filters || ($ocMedia('max-width: 767px') && vm.sortSelection);
    vm.showFilters = vm.filtersApplied;

    //check if search was used:
    vm.searchResults = Parameters.search && Parameters.search.length > 0;

    //reload the state with new parameters:
    vm.filter = function(resetPage) {
        $state.go('.', OrderCloudParameters.Create(vm.parameters, resetPage));
    };

    //reload the state with new search parameters & reset the page
    vm.search = function() {
        vm.filter(true);
    };

    //clear the search parameter, reload the state & reset the page
    vm.clearSearch = function() {
        vm.parameters.search = null;
        vm.filter(true);
    };

    //clear the relevant filters, reload the state & reset the page
    vm.clearFilters = function() {
        vm.parameters.filters = null;
        $ocMedia('max-width: 767px') ? vm.parameters.sortBy = null : angular.noop();
        vm.filter(true);
    };

    //conditionally set, reverse, and remove the sortBy parameters & reload the state
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

    vm.reverseSort = function() {
        Parameters.sortBy.indexOf('!') === 0 ? vm.parameters.sortBy = Parameters.sortBy.split("!")[1] : vm.parameters.sortBy = '!' + Parameters.sortBy;
        vm.filter(false);
    };

    //reload the state with the incremented page parameter
    vm.pageChanged = function() {
        $state.go('.', { page: vm.list.Meta.Page });
    };

    //load the next page of results with all the same parameters
    vm.loadMore = function() {
        return OrderCloud.AdminUserGroups.List(Parameters.search, vm.list.Meta.Page + 1, Parameters.pageSize || vm.list.Meta.PageSize, Parameters.searchOn, Parameters.sortBy, Parameters.filters)
            .then(function(data) {
                vm.list.Items = vm.list.Items.concat(data.Items);
                vm.list.Meta = data.Meta;
            });
    };
}

function AdminUserGroupEditController($exceptionHandler, $state, toastr, OrderCloud, SelectedAdminUserGroup, Audit, option_list) {
    "use strict";
    var vm = this,
        adminGroupID = SelectedAdminUserGroup.ID;
    vm.adminUserGroupName = SelectedAdminUserGroup.Name;
    vm.adminUserGroup = SelectedAdminUserGroup;


    vm.getBitArray = function(bit = 0) {
        var b = [];
        for (var i = 0; i < 5; i++)
            b[i] = (bit >> i) & 1;

        return b.reverse();
    };

    vm.checkAll = function(addBit, idx) {
        vm.permissionGroups.forEach(function(group) {
            if (addBit) {

                switch (idx) {
                    case 4:
                        {
                            if (group.Read)
                                group.Perm[idx] = 1;
                            break;
                        }
                    case 3:
                        {
                            if (group.Create) {
                                group.Perm[idx] = 1;
                                group.Perm[4] = 1;
                            }
                            break;
                        }
                    case 2:
                        {
                            if (group.Update) {
                                group.Perm[idx] = 1;
                                group.Perm[4] = 1;
                            }
                            break;
                        }
                    case 1:
                        {
                            if (group.Delete) {
                                group.Perm[idx] = 1;
                                group.Perm[4] = 1;
                            }
                            break;
                        }
                    case 1:
                        {
                            if (group.Execute) {
                                group.Perm[idx] = 1;
                                group.Perm[4] = 1;
                            }
                            break;
                        }
                }
            } else {
                group.Perm[idx] = 0;
            }
        });
    };


    vm.checkAllSpec = function(addBit, idx) {
        vm.specGroups.forEach(function(group) {
            if (addBit) {

                switch (idx) {
                    case 4:
                        {
                            if (group.Read)
                                group.Perm[idx] = 1;
                            break;
                        }
                    case 3:
                        {
                            if (group.Create) {
                                group.Perm[idx] = 1;
                                group.Perm[4] = 1;
                            }
                            break;
                        }
                    case 2:
                        {
                            if (group.Update) {
                                group.Perm[idx] = 1;
                                group.Perm[4] = 1;
                            }
                            break;
                        }
                    case 1:
                        {
                            if (group.Delete) {
                                group.Perm[idx] = 1;
                                group.Perm[4] = 1;
                            }
                            break;
                        }
                    case 1:
                        {
                            if (group.Execute) {
                                group.Perm[idx] = 1;
                                group.Perm[4] = 1;
                            }
                            break;
                        }
                }
            } else {
                group.Perm[idx] = 0;
            }
        });
    };

    vm.validateCheck = function(group, idx) {

        if (idx < 4) {
            group.Perm[4] = 1;
        }

    };

    vm.hasBit = function(val, index) {
        var bitnum = index !== 0 ? Math.pow(2, index - 1) : 0;
        return !!((val & bitnum) === bitnum);
    };

    vm.Submit = function() {
        vm.permissionGroups = vm.permissionGroups.concat(vm.specGroups);
        vm.adminUserGroup.xp = {};
        vm.permissionGroups.forEach(function(group) {
            group.Perm.reverse();
            let bitArray = group.Perm.slice(0);
            let bitTotal = bitArray.reverse().join('');
            var b = parseInt(bitTotal, 2);
            vm.adminUserGroup.xp[group.xp] = b;
        });

        OrderCloud.AdminUserGroups.Update(adminGroupID, vm.adminUserGroup)
            .then(function() {
                $state.go('adminusergroups', {}, { reload: true });
                toastr.success('Admin User Group Updated', 'Success');
                Audit.log("User Group", vm.adminUserGroupName, [{ "Type": "User Group", "TargetID": adminGroupID, }], 'UPDATE');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };

    vm.Delete = function() {
        OrderCloud.AdminUserGroups.Delete(SelectedAdminUserGroup.ID)
            .then(function() {
                $state.go('adminusergroups', {}, { reload: true });
                Audit.log("User Group", vm.adminUserGroupName, [{ "Type": "User Group", "TargetID": adminGroupID, }], 'DELETE');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };



    vm.permissionGroups = [
        { Title: 'Audit Logs', xp: 'auditlogs', Perm: vm.getBitArray(vm.adminUserGroup.xp['auditlogs']), Read: true, Create: false, Update: false, Delete: false, Execute: false, },
        { Title: 'Channels', xp: 'channels', Perm: vm.getBitArray(vm.adminUserGroup.xp['channels']), Read: true, Create: true, Update: true, Delete: true, Execute: false, },
        { Title: 'Products', xp: 'products', Perm: vm.getBitArray(vm.adminUserGroup.xp['products']), Read: true, Create: true, Update: true, Delete: true, Execute: false, },
        { Title: 'Master Product Groups', xp: 'masterproductgroups', Perm: vm.getBitArray(vm.adminUserGroup.xp['masterproductgroups']), Read: true, Create: true, Update: true, Delete: true, Execute: false, },
        { Title: 'Product Groups', xp: 'productgroups', Perm: vm.getBitArray(vm.adminUserGroup.xp['productgroups']), Read: true, Create: true, Update: true, Delete: true, Execute: false, },
        { Title: 'Product Attributes', xp: 'specs', Perm: vm.getBitArray(vm.adminUserGroup.xp['specs']), Read: true, Create: true, Update: true, Delete: true, Execute: false, },
        { Title: 'Distribution Templates', xp: 'templates', Perm: vm.getBitArray(vm.adminUserGroup.xp['templates']), Read: true, Create: true, Update: true, Delete: true, Execute: true, },
        { Title: 'Reports', xp: 'reports', Perm: vm.getBitArray(vm.adminUserGroup.xp['reports']), Read: true, Create: true, Update: true, Delete: true, Execute: true, },
        { Title: 'Users', xp: 'adminusers', Perm: vm.getBitArray(vm.adminUserGroup.xp['adminusers']), Read: true, Create: true, Update: true, Delete: true, Execute: false, },
        { Title: 'User Groups', xp: 'adminusergroups', Perm: vm.getBitArray(vm.adminUserGroup.xp['adminusergroups']), Read: true, Create: true, Update: true, Delete: true, Execute: false, },
        { Title: 'Audit Logs', xp: 'audit', Perm: vm.getBitArray(vm.adminUserGroup.xp['audit']), Read: true, Create: false, Update: false, Delete: false, Execute: false, },
        { Title: 'Data Manager', xp: 'datamanager', Perm: vm.getBitArray(vm.adminUserGroup.xp['datamanager']), Read: true, Create: true, Update: true, Delete: true, Execute: true },
    ];

    vm.specGroups = [];
    option_list.spec_groups.forEach(function(s) {
        var ts = { Title: s, xp: s, Perm: vm.getBitArray(vm.adminUserGroup.xp[s]), Read: false, Create: false, Update: true, Delete: false, Execute: false }
        vm.specGroups.push(ts);
    });


}

function AdminUserGroupCreateController($exceptionHandler, $state, toastr, OrderCloud, Audit) {
    "use strict";
    var vm = this;

    vm.Submit = function() {
        OrderCloud.AdminUserGroups.Create(vm.adminUserGroup)
            .then(function(data) {
                $state.go('adminusergroups', {}, { reload: true });
                toastr.success('Admin User Group Created', 'Success');
                Audit.log("User Group", vm.adminUserGroup.Name, [{ "Type": "User Group", "TargetID": data.ID, }], 'CREATE');
            })
            .catch(function(ex) {
                $exceptionHandler(ex);
            });
    };
    if (!vm.adminUserGroup) {
        vm.adminUserGroup = {};
    }

    vm.adminUserGroup.xp = {
        "Permissions": {
            "buyers": 0,
            "templates": 0,
            "productgroups": 0,
            "products": 0,
            "specs": 0,
            "reports": 0,
            "adminusergroups": 0,
            "adminusers": 0,
            "audit": 0,
        }
    };
}

function AdminUserGroupAssignController($scope, toastr, OrderCloud, Assignments, Paging, AdminUserList, AssignedAdminUsers, SelectedAdminUserGroup, Audit) {
    "use strict";

    let vm = this;
    let auditTargets = [];

    vm.AdminUserGroup = SelectedAdminUserGroup;
    vm.list = AdminUserList;
    vm.assignments = AssignedAdminUsers;
    vm.saveAssignments = SaveAssignment;
    vm.pagingfunction = PagingFunction;

    $scope.$watchCollection(function() {
        return vm.list;
    }, function() {
        Paging.setSelected(vm.list.Items, vm.assignments.Items, 'UserID');
    });

    function SaveFunc(ID) {
        auditTargets.push({ "Type": "User", "TargetID": ID, newState: "true", PerviousState: "false" });
        return OrderCloud.AdminUserGroups.SaveUserAssignment({
            UserID: ID,
            UserGroupID: vm.AdminUserGroup.ID
        });
    }

    function DeleteFunc(ID) {
        auditTargets.push({ "Type": "User", "TargetID": ID, newState: "false", PerviousState: "true" });
        return OrderCloud.AdminUserGroups.DeleteUserAssignment(vm.AdminUserGroup.ID, ID);
    }

    function SaveAssignment() {
        toastr.success('Assignment Updated', 'Success');
        return Assignments.saveAssignments(vm.list.Items, vm.assignments.Items, SaveFunc, DeleteFunc, 'UserID').then(function(a) {
            Audit.log("User Group Assignments", vm.AdminUserGroup.Name, auditTargets, 'UPDATE');
        });
    }

    function AssignmentFunc() {
        return OrderCloud.AdminUserGroups.ListUserAssignments(vm.AdminUserGroup.ID, null, vm.assignments.Meta.PageSize, 'UserID');
    }

    function PagingFunction() {
        return Paging.Paging(vm.list, 'AdminUsers', vm.assignments, AssignmentFunc);
    }
}