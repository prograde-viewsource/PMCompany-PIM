angular.module('productManager').factory('FullProductService', FullProductService);

function FullProductService(OrderCloud, FullOrderCloud, $q) {
    "use strict";
    return {
        Get: _get,
        FullSpec: _fullspec
    };

    function _get(ProductID, specsAssignments = null) {
        var uberQ = $q.defer();
        OrderCloud.Products.Get(ProductID).then(function(response) {
            var p = response;
            p.Specs = [];
            console.log("--_--------")
            console.log(p)
            console.log("--0--------")
            if (!_.isNull(specsAssignments)) {
                angular.forEach(specsAssignments, function(s) {
                    console.log(s)
                    let blankObj = {
                        "ID": s.ID,
                        "Name": s.Name,
                        "DefaultValue": null,
                        "xp": {
                            "Group": "BASIC ATTRIBUTES",
                            "Base": true
                        }
                    };


                    if (s.ID === 'ID') {
                        blankObj.DefaultValue = p.ID;
                    }
                    if (s.ID === 'Name') {
                        if (p.Name) {
                            blankObj.DefaultValue = p.Name;
                        }
                    }
                    if (s.ID === 'Description') {
                        if (p.Description) {
                            blankObj.DefaultValue = p.Description;
                        }
                    }
                    if (s.ID === 'SAPDescription') {
                        if (p.xp['SAP-Description']) {
                            blankObj.DefaultValue = p.xp['SAP-Description'];
                        }
                    }
                    if (s.ID === 'ShortDescription') {
                        if (p.xp['Short-Description']) {
                            blankObj.DefaultValue = p.xp['Short-Description'];
                        }
                    }
                    if (s.ID === 'xp.Status') {
                        if (p.xp.Status) {
                            blankObj.DefaultValue = p.xp.Status;
                        }
                    }
                    if (s.ID === 'xp.Brand-Name') {
                        if (p.xp['Brand-Name']) {
                            blankObj.DefaultValue = p.xp['Brand-Name'];
                        }
                    }
                    if (s.ID === 'xp.UPC-Each') {

                        if (p.xp['UPC-Each']) {
                            blankObj.DefaultValue = p.xp['UPC-Each'];
                        }
                    }
                    if (s.ID === 'ProductGroup') {
                        // if (response.xp['Product-Group']) { blankObj.DefaultValue = ProductGroups[response.xp['Product-Group']].Name; }
                    }
                    //  console.log(blankObj.DefaultValue)
                    if (blankObj.DefaultValue !== null)
                        p.Specs.push(blankObj);
                });
                // console.log(specsAssignments);
            }

            FullOrderCloud.Specs.ListProductAssignments(null, ProductID).then(function(specs) {
                var q = [];


                angular.forEach(specs.Items, function(s) {

                    q.push(function() {

                        var df = $q.defer();
                        var tempValue = s.DefaultValue;
                        var tempOption = s.DefaultOptionID;

                        let callAPI = false;
                        if (_.isNull(specsAssignments)) {
                            callAPI = true;
                        } else {
                            angular.forEach(specsAssignments, function(sa) {
                                if (sa.ID === s.SpecID) {
                                    callAPI = true;
                                }
                            });
                        }

                        if (callAPI) {
                            //    console.log(callAPI)
                            OrderCloud.Specs.Get(s.SpecID).then(function(response) {
                                s = response;
                                s.DefaultValue = tempValue;
                                s.DefaultOptionID = tempOption;
                                // console.log(s.OptionCount)
                                if (s.OptionCount) {
                                    FullOrderCloud.Specs.ListOptions(response.ID).then(function(response) {
                                        s.xp.Options = response.Items;
                                        p.Specs.push(s);
                                        df.resolve();
                                    });
                                } else {
                                    p.Specs.push(s);
                                    df.resolve();
                                }
                            }).catch(function() {
                                df.resolve();

                            });
                        } else {
                            df.resolve();
                        }
                        return df.promise;
                    }());
                });
                $q.all(q).then(function() {

                    //console.log(p)
                    uberQ.resolve(p);
                });
            });
        });

        return uberQ.promise;
    }

    function _fullspec(SpecID) {
        var df = $q.defer();
        OrderCloud.Specs.Get(SpecID).then(function(response) {
            var s = response;
            if (s.OptionCount) {
                FullOrderCloud.Specs.ListOptions(response.ID).then(function(response) {
                    s.xp.Options = response.Items;
                    df.resolve(s);
                }).catch(function() {
                    df.resolve(s);
                });
            } else {
                df.resolve(s);
            }
        }).catch(function(err) {
            console.log(err)
            df.resolve();
        });
        return df.promise;
    }
}