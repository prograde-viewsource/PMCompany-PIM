angular.module('productManager').factory('ResourceService', ResourceService);

function ResourceService(OrderCloud) {
    "use strict";
    var _specGroups = [{
            "Name": "EXCEPTION ATTRIBUTES"
        },
        {
            "Name": "TECHNICAL SPECIFICATION ATTRIBUTES"
        },
        {
            "Name": "ORDERING/SHIPPING ATTRIBUTES"
        },
        {
            "Name": "MARKETING COPY ATTRIBUTES"
        }
    ];

    var _productGroups = function() {
        return OrderCloud.Categories.List(null, null, 100, null, null, null, null, 'product-groups').then(function(response) {
            var result = {};
            angular.forEach(response.Items, function(group) {
                result[group.ID] = {};
                result[group.ID].Name = group.Name;
                result[group.ID].ID = group.ID;
            });

            return result;
        });
    };

    var _globalSpecs = [{
            AllowOpenText: false,
            DefaultOptionID: null,
            DefaultValue: null,
            DefinesVariant: false,
            ID: "PartNumber",
            ListOrder: 0,
            Name: "Part Number",
            OptionCount: 0,
            Required: false,
            xp: { "Group": "BASIC ATTRIBUTES" }
        },
        {
            AllowOpenText: false,
            DefaultOptionID: null,
            DefaultValue: null,
            DefinesVariant: false,
            ID: "ShortDescription",
            ListOrder: 0,
            Name: "Short Description",
            OptionCount: 0,
            Required: false,
            xp: { "Group": "BASIC ATTRIBUTES" }
        },
        {
            AllowOpenText: false,
            DefaultOptionID: null,
            DefaultValue: null,
            DefinesVariant: false,
            ID: "LongDescription",
            ListOrder: 0,
            Name: "LongDescription",
            OptionCount: 0,
            Required: false,
            xp: { "Group": "BASIC ATTRIBUTES" }
        },
        {
            AllowOpenText: false,
            DefaultOptionID: null,
            DefaultValue: null,
            DefinesVariant: false,
            ID: "SAPDescription",
            ListOrder: 0,
            Name: "SAP Description",
            OptionCount: 0,
            Required: false,
            xp: { "Group": "BASIC ATTRIBUTES" }
        },
        {
            AllowOpenText: false,
            DefaultOptionID: null,
            DefaultValue: null,
            DefinesVariant: false,
            ID: "Status",
            ListOrder: 0,
            Name: "Status",
            OptionCount: 0,
            Required: false,
            xp: { "Group": "BASIC ATTRIBUTES" }
        },
        {
            AllowOpenText: false,
            DefaultOptionID: null,
            DefaultValue: null,
            DefinesVariant: false,
            ID: "BrandName",
            ListOrder: 0,
            Name: "Brand Name",
            OptionCount: 0,
            Required: false,
            xp: { "Group": "BASIC ATTRIBUTES" }
        },
        {
            AllowOpenText: false,
            DefaultOptionID: null,
            DefaultValue: null,
            DefinesVariant: false,
            ID: "UPCEach",
            ListOrder: 0,
            Name: "UPC Each",
            OptionCount: 0,
            Required: false,
            xp: { "Group": "BASIC ATTRIBUTES" }
        },
        {
            AllowOpenText: false,
            DefaultOptionID: null,
            DefaultValue: null,
            DefinesVariant: false,
            ID: "ProductGroup",
            ListOrder: 0,
            Name: "Product Group",
            OptionCount: 0,
            Required: false,
            xp: { "Group": "BASIC ATTRIBUTES" }
        }
    ];

    return {
        SpecGroups: _specGroups,
        ProductGroups: _productGroups,
        GlobalSpecs: _globalSpecs
    };
}