# OrderCloud SDK

An AngularJs SDK for OrderCloud API
***

# Table of Contents

- [Getting Started](#getting-started)

- [Requirements](#requirements)

- [Cache](#cache)

- [SecurityProfiles](#securityprofiles)

  - [Get a Single Security Profile](#get-a-single-security-profile)

  - [Get a List of Security Profiles](#get-a-list-of-security-profiles)

  - [List Assignments](#list-assignments)

  - [Delete Assignment](#delete-assignment)

  - [Save Assignment](#save-assignment)

- [ForgottenPassword](#forgottenpassword)

  - [Send Verification Code](#send-verification-code)

  - [Reset Password](#reset-password)

- [Me](#me)

  - [Get the Current Authenticated User](#get-the-current-authenticated-user)

  - [Update the Currently Authenticated User](#update-the-currently-authenticated-user)

  - [Patch the Currently Authenticated User.](#patch-the-currently-authenticated-user.)

  - [Create From Temp User](#create-from-temp-user)

- [CostCenters](#costcenters)

  - [List Cost Centers](#list-cost-centers)

- [UserGroups](#usergroups)

  - [List User Groups](#list-user-groups)

- [Addresses](#addresses)

  - [List Addresses](#list-addresses)

  - [Create Address](#create-address)

  - [Get Address](#get-address)

  - [Update Address](#update-address)

  - [Patch Address](#patch-address)

  - [Delete Address](#delete-address)

- [CreditCards](#creditcards)

  - [Create Credit Card](#create-credit-card)

  - [List Credit Cards](#list-credit-cards)

  - [Get Credit Card](#get-credit-card)

  - [Update Credit Card](#update-credit-card)

  - [Patch Credit Card](#patch-credit-card)

  - [Delete Credit Card](#delete-credit-card)

- [Categories](#categories)

  - [List Categories](#list-categories)

- [Products](#products)

  - [List Products](#list-products)

  - [Get Product](#get-product)

  - [List Specs](#list-specs)

  - [Get Spec](#get-spec)

- [Orders](#orders)

  - [List Outgoing Orders](#list-outgoing-orders)

  - [List Incoming Orders](#list-incoming-orders)

  - [Get Order](#get-order)

- [Promotions](#promotions)

  - [List Promotions](#list-promotions)

  - [Get Promotion](#get-promotion)

- [Orders](#orders)

  - [Get a Single Order](#get-a-single-order)

  - [Create New Order](#create-new-order)

  - [Create or Update Order](#create-or-update-order)

  - [Delete Order](#delete-order)

  - [List Outgoing](#list-outgoing)

  - [List Incoming](#list-incoming)

  - [List Approvals](#list-approvals)

  - [List Eligible Approvers](#list-eligible-approvers)

  - [Partially Update Order](#partially-update-order)

  - [Submit Order](#submit-order)

  - [Approve Order](#approve-order)

  - [Decline Order](#decline-order)

  - [Cancel Order](#cancel-order)

  - [Ship Order](#ship-order)

  - [Set Shipping Address](#set-shipping-address)

  - [Patch Shipping Address](#patch-shipping-address)

  - [Set Billing Address](#set-billing-address)

  - [Patch Billing Address](#patch-billing-address)

  - [Add Promotion](#add-promotion)

  - [List Promotions](#list-promotions)

  - [Remove Promotion](#remove-promotion)

  - [Transfer Temp User Order](#transfer-temp-user-order)

- [LineItems](#lineitems)

  - [Get a Single Line Item](#get-a-single-line-item)

  - [Get a List of Line Items](#get-a-list-of-line-items)

  - [Create New Line Item](#create-new-line-item)

  - [Create or Update Line Item](#create-or-update-line-item)

  - [Delete Line Item](#delete-line-item)

  - [Partially Update Line Item](#partially-update-line-item)

  - [Set Shipping Address](#set-shipping-address)

  - [Patch Shipping Address](#patch-shipping-address)

- [Payments](#payments)

  - [Get a Single Payment](#get-a-single-payment)

  - [Get a List of Payments](#get-a-list-of-payments)

  - [Create New Payment](#create-new-payment)

  - [Create or Update Payment](#create-or-update-payment)

  - [Delete Payment](#delete-payment)

  - [Partially Update Payment](#partially-update-payment)

  - [Create Transaction](#create-transaction)

  - [Update Transaction](#update-transaction)

  - [Patch Transaction](#patch-transaction)

  - [Delete Transaction](#delete-transaction)

- [Shipments](#shipments)

  - [Get a Single Shipment](#get-a-single-shipment)

  - [Get a List of Shipments](#get-a-list-of-shipments)

  - [Create New Shipment](#create-new-shipment)

  - [Create or Update Shipment](#create-or-update-shipment)

  - [Delete Shipment](#delete-shipment)

  - [Partially Update Shipment](#partially-update-shipment)

  - [Save Item](#save-item)

  - [Delete Item](#delete-item)

- [Buyers](#buyers)

  - [Get a Single Buyer](#get-a-single-buyer)

  - [Get a List of Buyers](#get-a-list-of-buyers)

  - [Create New Buyer](#create-new-buyer)

  - [Create or Update Buyer](#create-or-update-buyer)

  - [Delete Buyer](#delete-buyer)

  - [Partially Update Buyer](#partially-update-buyer)

- [AdminUsers](#adminusers)

  - [Get a Single Admin User](#get-a-single-admin-user)

  - [Get a List of Admin Users](#get-a-list-of-admin-users)

  - [Create New Admin User](#create-new-admin-user)

  - [Create or Update Admin User](#create-or-update-admin-user)

  - [Delete Admin User](#delete-admin-user)

  - [Partially Update Admin User](#partially-update-admin-user)

- [Catalogs](#catalogs)

  - [Get a Single Catalog](#get-a-single-catalog)

  - [Get a List of Catalogs](#get-a-list-of-catalogs)

  - [Create New Catalog](#create-new-catalog)

  - [Create or Update Catalog](#create-or-update-catalog)

  - [Delete Catalog](#delete-catalog)

  - [Partially Update Catalog](#partially-update-catalog)

  - [List Assignments](#list-assignments)

  - [Save Assignment](#save-assignment)

  - [Delete Assignment](#delete-assignment)

- [Categories](#categories)

  - [Get a Single Category](#get-a-single-category)

  - [Get a List of Categories](#get-a-list-of-categories)

  - [Create New Category](#create-new-category)

  - [Create or Update Category](#create-or-update-category)

  - [Delete Category](#delete-category)

  - [Partially Update Category](#partially-update-category)

  - [List Assignments](#list-assignments)

  - [Delete Assignment](#delete-assignment)

  - [Save Assignment](#save-assignment)

  - [List Product Assignments](#list-product-assignments)

  - [Save Product Assignment](#save-product-assignment)

  - [Delete Product Assignment](#delete-product-assignment)

- [Specs](#specs)

  - [Get a Single Spec](#get-a-single-spec)

  - [Get a List of Specs](#get-a-list-of-specs)

  - [Create New Spec](#create-new-spec)

  - [Create or Update Spec](#create-or-update-spec)

  - [Delete Spec](#delete-spec)

  - [Partially Update Spec](#partially-update-spec)

  - [List Product Assignments](#list-product-assignments)

  - [Delete Product Assignment](#delete-product-assignment)

  - [Save Product Assignment](#save-product-assignment)

  - [Create Option](#create-option)

  - [List Options](#list-options)

  - [Update Option](#update-option)

  - [Patch Option](#patch-option)

  - [Get Option](#get-option)

  - [Delete Option](#delete-option)

- [Products](#products)

  - [Get a Single Product](#get-a-single-product)

  - [Get a List of Products](#get-a-list-of-products)

  - [Create New Product](#create-new-product)

  - [Create or Update Product](#create-or-update-product)

  - [Delete Product](#delete-product)

  - [Partially Update Product](#partially-update-product)

  - [Generate Variants](#generate-variants)

  - [List Variants](#list-variants)

  - [Update Variant](#update-variant)

  - [Patch Variant](#patch-variant)

  - [Get Variant](#get-variant)

  - [List Variant Inventory](#list-variant-inventory)

  - [Get Variant Inventory](#get-variant-inventory)

  - [Update Variant Inventory](#update-variant-inventory)

  - [List Inventory](#list-inventory)

  - [Get Inventory](#get-inventory)

  - [Update Inventory](#update-inventory)

  - [Save Assignment](#save-assignment)

  - [List Assignments](#list-assignments)

  - [Delete Assignment](#delete-assignment)

- [PriceSchedules](#priceschedules)

  - [Get a Single Price Schedule](#get-a-single-price-schedule)

  - [Get a List of Price Schedules](#get-a-list-of-price-schedules)

  - [Create New Price Schedule](#create-new-price-schedule)

  - [Create or Update Price Schedule](#create-or-update-price-schedule)

  - [Delete Price Schedule](#delete-price-schedule)

  - [Partially Update Price Schedule](#partially-update-price-schedule)

  - [Save Price Break](#save-price-break)

  - [Delete Price Break](#delete-price-break)

- [Promotions](#promotions)

  - [Get a Single Promotion](#get-a-single-promotion)

  - [Get a List of Promotions](#get-a-list-of-promotions)

  - [Create New Promotion](#create-new-promotion)

  - [Create or Update Promotion](#create-or-update-promotion)

  - [Delete Promotion](#delete-promotion)

  - [Partially Update Promotion](#partially-update-promotion)

  - [List Assignments](#list-assignments)

  - [Save Assignment](#save-assignment)

  - [Delete Assignment](#delete-assignment)

- [AdminAddresses](#adminaddresses)

  - [Get a Single Admin Address](#get-a-single-admin-address)

  - [Get a List of Admin Addresses](#get-a-list-of-admin-addresses)

  - [Create New Admin Address](#create-new-admin-address)

  - [Create or Update Admin Address](#create-or-update-admin-address)

  - [Delete Admin Address](#delete-admin-address)

  - [Partially Update Admin Address](#partially-update-admin-address)

- [AdminUserGroups](#adminusergroups)

  - [Get a Single Admin User Group](#get-a-single-admin-user-group)

  - [Get a List of Admin User Groups](#get-a-list-of-admin-user-groups)

  - [Create New Admin User Group](#create-new-admin-user-group)

  - [Create or Update Admin User Group](#create-or-update-admin-user-group)

  - [Delete Admin User Group](#delete-admin-user-group)

  - [Partially Update Admin User Group](#partially-update-admin-user-group)

  - [List User Assignments](#list-user-assignments)

  - [Delete User Assignment](#delete-user-assignment)

  - [Save User Assignment](#save-user-assignment)

- [MesageSenders](#mesagesenders)

  - [Get a Single Message Sender](#get-a-single-message-sender)

  - [Get a List of Message Senders](#get-a-list-of-message-senders)

  - [List Assignments](#list-assignments)

  - [Delete Assignment](#delete-assignment)

  - [Save Assignment](#save-assignment)

  - [List CC Listener Assignments](#list-cc-listener-assignments)

  - [Save CC Listener Assignment](#save-cc-listener-assignment)

- [Users](#users)

  - [Get a Single User](#get-a-single-user)

  - [Get a List of Users](#get-a-list-of-users)

  - [Create New User](#create-new-user)

  - [Create or Update User](#create-or-update-user)

  - [Delete User](#delete-user)

  - [Partially Update User](#partially-update-user)

  - [Get Access Token](#get-access-token)

- [UserGroups](#usergroups)

  - [Get a Single User Group](#get-a-single-user-group)

  - [Get a List of User Groups](#get-a-list-of-user-groups)

  - [Create New User Group](#create-new-user-group)

  - [Create or Update User Group](#create-or-update-user-group)

  - [Delete User Group](#delete-user-group)

  - [Partially Update User Group](#partially-update-user-group)

  - [List User Assignments](#list-user-assignments)

  - [Delete User Assignment](#delete-user-assignment)

  - [Save User Assignment](#save-user-assignment)

- [Addresses](#addresses)

  - [Get a Single Address](#get-a-single-address)

  - [Get a List of Addresses](#get-a-list-of-addresses)

  - [Create New Address](#create-new-address)

  - [Create or Update Address](#create-or-update-address)

  - [Delete Address](#delete-address)

  - [Partially Update Address](#partially-update-address)

  - [List Assignments](#list-assignments)

  - [Delete Assignment](#delete-assignment)

  - [Save Assignment](#save-assignment)

- [SpendingAccounts](#spendingaccounts)

  - [Get a Single Spending Account](#get-a-single-spending-account)

  - [Get a List of Spending Accounts](#get-a-list-of-spending-accounts)

  - [Create New Spending Account](#create-new-spending-account)

  - [Create or Update Spending Account](#create-or-update-spending-account)

  - [Delete Spending Account](#delete-spending-account)

  - [Partially Update Spending Account](#partially-update-spending-account)

  - [List Assignments](#list-assignments)

  - [Save Assignment](#save-assignment)

  - [Delete Assignment](#delete-assignment)

- [CostCenters](#costcenters)

  - [Get a Single Cost Center](#get-a-single-cost-center)

  - [Get a List of Cost Centers](#get-a-list-of-cost-centers)

  - [Create New Cost Center](#create-new-cost-center)

  - [Create or Update Cost Center](#create-or-update-cost-center)

  - [Delete Cost Center](#delete-cost-center)

  - [Partially Update Cost Center](#partially-update-cost-center)

  - [List Assignments](#list-assignments)

  - [Delete Assignment](#delete-assignment)

  - [Save Assignment](#save-assignment)

- [ApprovalRules](#approvalrules)

  - [Get a Single Approval Rule](#get-a-single-approval-rule)

  - [Get a List of Approval Rules](#get-a-list-of-approval-rules)

  - [Create New Approval Rule](#create-new-approval-rule)

  - [Create or Update Approval Rule](#create-or-update-approval-rule)

  - [Delete Approval Rule](#delete-approval-rule)

  - [Partially Update Approval Rule](#partially-update-approval-rule)

- [CreditCards](#creditcards)

  - [Get a Single Credit Card](#get-a-single-credit-card)

  - [Get a List of Credit Cards](#get-a-list-of-credit-cards)

  - [Create New Credit Card](#create-new-credit-card)

  - [Create or Update Credit Card](#create-or-update-credit-card)

  - [Delete Credit Card](#delete-credit-card)

  - [Partially Update Credit Card](#partially-update-credit-card)

  - [List Assignments](#list-assignments)

  - [Save Assignment](#save-assignment)

  - [Delete Assignment](#delete-assignment)

- [Extending the OrderCloud Data Model](#extending-the-ordercloud-data-model)

***

# Getting Started

```js
$ bower install ordercloud-angular-sdk --save-dev
```

Or just include the output in the dist folder directly in your project.

# REQUIREMENTS

This sdk is to always be used in conjunction with another angular project.
You must also define some variable constants in the referecing application.

```js
angular.module('orderCloud', [])
.constant('clientid', '...')
.constant('authurl', '...')
.constant('apiurl', '...')
```

In some cases, your app will need to access multiple buyer companies, so the buyerid is not stored as a constant. Instead, the buyerid is stored in an AngularJS factory named BuyerID within this sdk.
In order to set an initial/default buyerid, add a run function in addition to the above constants.

```js
.run(function(BuyerID) { OrderCloud.BuyerID.Set('BUYERIDHERE'); })
```

The BuyerID function can be used within any AngularJS controller and/or factory within your application in order to change which buyerid should be used.
Simply inject the BuyerID factory into your controller or factory and call OrderCloud.BuyerID.Set('NEWIDHERE');.
If needed, OrderCloud.BuyerID().Get() will return the buyerid that is currently set.

The CatalogID function can be used within any AngularJS controller and/or factory within your application in order to change which catalogid should be used.
Simply inject the CatalogID factory into your controller or factory and call OrderCloud.CatalogID.Set('NEWIDHERE');.
If needed, OrderCloud.CatalogID().Get() will return the catalogid that is currently set.

***

# API RESOURCES AND METHODS

***

# SecurityProfiles

```js
angular.module('orderCloud.sdk).factory(SecurityProfiles, SecurityProfilesFactory)
```


## Get a Single Security Profile

```js
OrderCloud.SecurityProfiles.Get(securityProfileID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|securityProfileID|string|ID of the security profile.|
### Response Body Sample

```json
{
  "ID": "…",
  "IsDevProfile": false,
  "Name": "…",
  "Roles": [
    "…"
  ]
}
```

## Get a List of Security Profiles

```js
OrderCloud.SecurityProfiles.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "IsDevProfile": false,
      "Name": "…",
      "Roles": [
        "…"
      ]
    }
  ]
}
```

## List Assignments

```js
OrderCloud.SecurityProfiles.ListAssignments(securityProfileID,userID,userGroupID,level,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|securityProfileID|string|ID of the security profile.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
|level|string|Level of the security profile.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "SecurityProfileID": "…",
      "BuyerID": "…",
      "UserID": "…",
      "UserGroupID": "…"
    }
  ]
}
```

## Delete Assignment

```js
OrderCloud.SecurityProfiles.DeleteAssignment(securityProfileID,userID,userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|securityProfileID|string|ID of the security profile.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
## Save Assignment

```js
OrderCloud.SecurityProfiles.SaveAssignment(assignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "SecurityProfileID": "…",
  "BuyerID": "…",
  "UserID": "…",
  "UserGroupID": "…"
}
```

# ForgottenPassword

```js
angular.module('orderCloud.sdk).factory(ForgottenPassword, ForgottenPasswordFactory)
```


## Send Verification Code

```js
OrderCloud.ForgottenPassword.SendVerificationCode(passwordResetRequest).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ClientID": "…",
  "Email": "…",
  "Username": "…",
  "URL": "…"
}
```

## Reset Password

```js
OrderCloud.ForgottenPassword.ResetPassword(verificationCode,passwordReset).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|verificationCode|string|Verification code of the forgotten password.|
### Request Body Sample

```json
{
  "ClientID": "…",
  "Username": "…",
  "Password": "…"
}
```

# Me

```js
angular.module('orderCloud.sdk).factory(Me, MeFactory)
```

"Me" is a container for read-only endpoints that return a filtered view of things that the current buyer user is allowed to see, i.e. things that they are assigned to either directly or as a member of a buyer organization or user group. It also provides ways for a user to update or change their own information.

## Get the Current Authenticated User

```js
OrderCloud.Me.Get().then(successFn).catch(errorFn);
```

### Response Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null,
  "AvailableRoles": [
    "…"
  ]
}
```

## Update the Currently Authenticated User

```js
OrderCloud.Me.Update(user).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "Password": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null
}
```

## Patch the Currently Authenticated User.

```js
OrderCloud.Me.Patch(user).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "Password": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null
}
```

## Create From Temp User

```js
OrderCloud.Me.CreateFromTempUser(user,tempUserToken).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|tempUserToken|string|Temp user token of the me.|
### Request Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "Password": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null
}
```

# CostCenters

```js
angular.module('orderCloud.sdk).factory(CostCenters, CostCentersFactory)
```

"Me" is a container for read-only endpoints that return a filtered view of things that the current buyer user is allowed to see, i.e. things that they are assigned to either directly or as a member of a buyer organization or user group. It also provides ways for a user to update or change their own information.

## List Cost Centers

```js
OrderCloud.CostCenters.ListCostCenters(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "xp": null
    }
  ]
}
```

# UserGroups

```js
angular.module('orderCloud.sdk).factory(UserGroups, UserGroupsFactory)
```

"Me" is a container for read-only endpoints that return a filtered view of things that the current buyer user is allowed to see, i.e. things that they are assigned to either directly or as a member of a buyer organization or user group. It also provides ways for a user to update or change their own information.

## List User Groups

```js
OrderCloud.UserGroups.ListUserGroups(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "xp": null
    }
  ]
}
```

# Addresses

```js
angular.module('orderCloud.sdk).factory(Addresses, AddressesFactory)
```

"Me" is a container for read-only endpoints that return a filtered view of things that the current buyer user is allowed to see, i.e. things that they are assigned to either directly or as a member of a buyer organization or user group. It also provides ways for a user to update or change their own information.

## List Addresses

```js
OrderCloud.Addresses.ListAddresses(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Shipping": false,
      "Billing": false,
      "Editable": false,
      "CompanyName": "…",
      "FirstName": "…",
      "LastName": "…",
      "Street1": "…",
      "Street2": "…",
      "City": "…",
      "State": "…",
      "Zip": "…",
      "Country": "…",
      "Phone": "…",
      "AddressName": "…",
      "xp": null
    }
  ]
}
```

## Create Address

```js
OrderCloud.Addresses.CreateAddress(address).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "Shipping": false,
  "Billing": false,
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Get Address

```js
OrderCloud.Addresses.GetAddress(addressID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
### Response Body Sample

```json
{
  "ID": "…",
  "Shipping": false,
  "Billing": false,
  "Editable": false,
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Update Address

```js
OrderCloud.Addresses.UpdateAddress(addressID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
### Request Body Sample

```json
{
  "Shipping": false,
  "Billing": false,
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Patch Address

```js
OrderCloud.Addresses.PatchAddress(addressID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
### Request Body Sample

```json
{
  "Shipping": false,
  "Billing": false,
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Delete Address

```js
OrderCloud.Addresses.DeleteAddress(addressID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
# CreditCards

```js
angular.module('orderCloud.sdk).factory(CreditCards, CreditCardsFactory)
```

"Me" is a container for read-only endpoints that return a filtered view of things that the current buyer user is allowed to see, i.e. things that they are assigned to either directly or as a member of a buyer organization or user group. It also provides ways for a user to update or change their own information.

## Create Credit Card

```js
OrderCloud.CreditCards.CreateCreditCard(creditCard).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "Token": "…",
  "CardType": "…",
  "PartialAccountNumber": "…",
  "CardholderName": "…",
  "ExpirationDate": null,
  "xp": null
}
```

## List Credit Cards

```js
OrderCloud.CreditCards.ListCreditCards(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Editable": false,
      "Token": "…",
      "DateCreated": null,
      "CardType": "…",
      "PartialAccountNumber": "…",
      "CardholderName": "…",
      "ExpirationDate": null,
      "xp": null
    }
  ]
}
```

## Get Credit Card

```js
OrderCloud.CreditCards.GetCreditCard(creditcardID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|creditcardID|string|ID of the creditcard.|
### Response Body Sample

```json
{
  "ID": "…",
  "Editable": false,
  "Token": "…",
  "DateCreated": null,
  "CardType": "…",
  "PartialAccountNumber": "…",
  "CardholderName": "…",
  "ExpirationDate": null,
  "xp": null
}
```

## Update Credit Card

```js
OrderCloud.CreditCards.UpdateCreditCard(creditcardID,creditCard).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|creditcardID|string|ID of the creditcard.|
### Request Body Sample

```json
{
  "Token": "…",
  "CardType": "…",
  "PartialAccountNumber": "…",
  "CardholderName": "…",
  "ExpirationDate": null,
  "xp": null
}
```

## Patch Credit Card

```js
OrderCloud.CreditCards.PatchCreditCard(creditcardID,creditCard).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|creditcardID|string|ID of the creditcard.|
### Request Body Sample

```json
{
  "Token": "…",
  "CardType": "…",
  "PartialAccountNumber": "…",
  "CardholderName": "…",
  "ExpirationDate": null,
  "xp": null
}
```

## Delete Credit Card

```js
OrderCloud.CreditCards.DeleteCreditCard(creditcardID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|creditcardID|string|ID of the creditcard.|
# Categories

```js
angular.module('orderCloud.sdk).factory(Categories, CategoriesFactory)
```

"Me" is a container for read-only endpoints that return a filtered view of things that the current buyer user is allowed to see, i.e. things that they are assigned to either directly or as a member of a buyer organization or user group. It also provides ways for a user to update or change their own information.

## List Categories

```js
OrderCloud.Categories.ListCategories(listArgs,depth,catalogID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|depth|string|Depth of the category.|
|catalogID|string|ID of the catalog.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "xp": null,
      "ListOrder": 1,
      "Active": false,
      "ParentID": "…",
      "ChildCount": 0
    }
  ]
}
```

# Products

```js
angular.module('orderCloud.sdk).factory(Products, ProductsFactory)
```

"Me" is a container for read-only endpoints that return a filtered view of things that the current buyer user is allowed to see, i.e. things that they are assigned to either directly or as a member of a buyer organization or user group. It also provides ways for a user to update or change their own information.

## List Products

```js
OrderCloud.Products.ListProducts(listArgs,categoryID,catalogID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|categoryID|string|ID of the category.|
|catalogID|string|ID of the catalog.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ReplenishmentPriceSchedule": {
        "ID": "…",
        "Name": "…",
        "ApplyTax": false,
        "ApplyShipping": false,
        "MinQuantity": null,
        "MaxQuantity": null,
        "UseCumulativeQuantity": false,
        "RestrictedQuantity": false,
        "OrderType": "Standard",
        "PriceBreaks": [
          {
            "Quantity": 0,
            "Price": 0.0
          }
        ],
        "xp": null
      },
      "StandardPriceSchedule": {
        "ID": "…",
        "Name": "…",
        "ApplyTax": false,
        "ApplyShipping": false,
        "MinQuantity": null,
        "MaxQuantity": null,
        "UseCumulativeQuantity": false,
        "RestrictedQuantity": false,
        "OrderType": "Standard",
        "PriceBreaks": [
          {
            "Quantity": 0,
            "Price": 0.0
          }
        ],
        "xp": null
      },
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "QuantityMultiplier": 0,
      "ShipWeight": null,
      "ShipHeight": null,
      "ShipWidth": null,
      "ShipLength": null,
      "Active": false,
      "Type": "Static",
      "InventoryEnabled": false,
      "InventoryNotificationPoint": null,
      "VariantLevelInventory": false,
      "SpecCount": 0,
      "xp": null,
      "AllowOrderExceedInventory": false,
      "InventoryVisible": false,
      "VariantCount": 0,
      "ShipFromAddressID": "…"
    }
  ]
}
```

## Get Product

```js
OrderCloud.Products.GetProduct(productID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
### Response Body Sample

```json
{
  "ReplenishmentPriceSchedule": {
    "ID": "…",
    "Name": "…",
    "ApplyTax": false,
    "ApplyShipping": false,
    "MinQuantity": null,
    "MaxQuantity": null,
    "UseCumulativeQuantity": false,
    "RestrictedQuantity": false,
    "OrderType": "Standard",
    "PriceBreaks": [
      {
        "Quantity": 0,
        "Price": 0.0
      }
    ],
    "xp": null
  },
  "StandardPriceSchedule": {
    "ID": "…",
    "Name": "…",
    "ApplyTax": false,
    "ApplyShipping": false,
    "MinQuantity": null,
    "MaxQuantity": null,
    "UseCumulativeQuantity": false,
    "RestrictedQuantity": false,
    "OrderType": "Standard",
    "PriceBreaks": [
      {
        "Quantity": 0,
        "Price": 0.0
      }
    ],
    "xp": null
  },
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "QuantityMultiplier": 0,
  "ShipWeight": null,
  "ShipHeight": null,
  "ShipWidth": null,
  "ShipLength": null,
  "Active": false,
  "Type": "Static",
  "InventoryEnabled": false,
  "InventoryNotificationPoint": null,
  "VariantLevelInventory": false,
  "SpecCount": 0,
  "xp": null,
  "AllowOrderExceedInventory": false,
  "InventoryVisible": false,
  "VariantCount": 0,
  "ShipFromAddressID": "…"
}
```

## List Specs

```js
OrderCloud.Products.ListSpecs(productID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "Options": [
        {
          "ID": "…",
          "Value": "…",
          "ListOrder": 0,
          "IsOpenText": false,
          "PriceMarkupType": null,
          "PriceMarkup": null,
          "xp": null
        }
      ],
      "ID": "…",
      "ListOrder": 0,
      "Name": "…",
      "DefaultValue": "…",
      "Required": false,
      "AllowOpenText": false,
      "DefaultOptionID": "…",
      "DefinesVariant": false,
      "xp": null
    }
  ]
}
```

## Get Spec

```js
OrderCloud.Products.GetSpec(productID,specID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|specID|string|ID of the spec.|
### Response Body Sample

```json
{
  "Options": [
    {
      "ID": "…",
      "Value": "…",
      "ListOrder": 0,
      "IsOpenText": false,
      "PriceMarkupType": null,
      "PriceMarkup": null,
      "xp": null
    }
  ],
  "ID": "…",
  "ListOrder": 0,
  "Name": "…",
  "DefaultValue": "…",
  "Required": false,
  "AllowOpenText": false,
  "DefaultOptionID": "…",
  "DefinesVariant": false,
  "xp": null
}
```

# Orders

```js
angular.module('orderCloud.sdk).factory(Orders, OrdersFactory)
```

"Me" is a container for read-only endpoints that return a filtered view of things that the current buyer user is allowed to see, i.e. things that they are assigned to either directly or as a member of a buyer organization or user group. It also provides ways for a user to update or change their own information.

## List Outgoing Orders

```js
OrderCloud.Orders.ListOutgoingOrders(listArgs,from,to).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|from|date|Lower bound of date range that the order was created (if outgoing) or submitted (if incoming).|
|to|date|Upper bound of date range that the order was created (if outgoing) or submitted (if incoming).|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Type": "Standard",
      "FromUserID": "…",
      "FromUserFirstName": "…",
      "FromUserLastName": "…",
      "BillingAddress": {
        "ID": "…",
        "CompanyName": "…",
        "FirstName": "…",
        "LastName": "…",
        "Street1": "…",
        "Street2": "…",
        "City": "…",
        "State": "…",
        "Zip": "…",
        "Country": "…",
        "Phone": "…",
        "AddressName": "…",
        "xp": null
      },
      "ShippingAddressID": "…",
      "Comments": "…",
      "LineItemCount": 0,
      "Status": "Unsubmitted",
      "DateCreated": null,
      "DateSubmitted": null,
      "DateApproved": null,
      "DateDeclined": null,
      "DateCanceled": null,
      "DateCompleted": null,
      "Subtotal": 0.0,
      "ShippingCost": 0.0,
      "TaxCost": 0.0,
      "PromotionDiscount": 0.0,
      "Total": 0.0,
      "IsSubmitted": false,
      "xp": null
    }
  ]
}
```

## List Incoming Orders

```js
OrderCloud.Orders.ListIncomingOrders(listArgs,from,to).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|from|date|Lower bound of date range that the order was created (if outgoing) or submitted (if incoming).|
|to|date|Upper bound of date range that the order was created (if outgoing) or submitted (if incoming).|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Type": "Standard",
      "FromUserID": "…",
      "FromUserFirstName": "…",
      "FromUserLastName": "…",
      "BillingAddress": {
        "ID": "…",
        "CompanyName": "…",
        "FirstName": "…",
        "LastName": "…",
        "Street1": "…",
        "Street2": "…",
        "City": "…",
        "State": "…",
        "Zip": "…",
        "Country": "…",
        "Phone": "…",
        "AddressName": "…",
        "xp": null
      },
      "ShippingAddressID": "…",
      "Comments": "…",
      "LineItemCount": 0,
      "Status": "Unsubmitted",
      "DateCreated": null,
      "DateSubmitted": null,
      "DateApproved": null,
      "DateDeclined": null,
      "DateCanceled": null,
      "DateCompleted": null,
      "Subtotal": 0.0,
      "ShippingCost": 0.0,
      "TaxCost": 0.0,
      "PromotionDiscount": 0.0,
      "Total": 0.0,
      "IsSubmitted": false,
      "xp": null
    }
  ]
}
```

## Get Order

```js
OrderCloud.Orders.GetOrder(orderID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Response Body Sample

```json
{
  "ID": "…",
  "Type": "Standard",
  "FromUserID": "…",
  "FromUserFirstName": "…",
  "FromUserLastName": "…",
  "BillingAddress": {
    "ID": "…",
    "CompanyName": "…",
    "FirstName": "…",
    "LastName": "…",
    "Street1": "…",
    "Street2": "…",
    "City": "…",
    "State": "…",
    "Zip": "…",
    "Country": "…",
    "Phone": "…",
    "AddressName": "…",
    "xp": null
  },
  "ShippingAddressID": "…",
  "Comments": "…",
  "LineItemCount": 0,
  "Status": "Unsubmitted",
  "DateCreated": null,
  "DateSubmitted": null,
  "DateApproved": null,
  "DateDeclined": null,
  "DateCanceled": null,
  "DateCompleted": null,
  "Subtotal": 0.0,
  "ShippingCost": 0.0,
  "TaxCost": 0.0,
  "PromotionDiscount": 0.0,
  "Total": 0.0,
  "IsSubmitted": false,
  "xp": null
}
```

# Promotions

```js
angular.module('orderCloud.sdk).factory(Promotions, PromotionsFactory)
```

"Me" is a container for read-only endpoints that return a filtered view of things that the current buyer user is allowed to see, i.e. things that they are assigned to either directly or as a member of a buyer organization or user group. It also provides ways for a user to update or change their own information.

## List Promotions

```js
OrderCloud.Promotions.ListPromotions(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Code": "…",
      "Name": "…",
      "RedemptionLimit": null,
      "RedemptionLimitPerUser": null,
      "RedemptionCount": 0,
      "Description": "…",
      "FinePrint": "…",
      "StartDate": null,
      "ExpirationDate": null,
      "EligibleExpression": "…",
      "ValueExpression": "…",
      "CanCombine": false,
      "xp": null
    }
  ]
}
```

## Get Promotion

```js
OrderCloud.Promotions.GetPromotion(promotionID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|promotionID|string|ID of the promotion.|
### Response Body Sample

```json
{
  "ID": "…",
  "Code": "…",
  "Name": "…",
  "RedemptionLimit": null,
  "RedemptionLimitPerUser": null,
  "RedemptionCount": 0,
  "Description": "…",
  "FinePrint": "…",
  "StartDate": null,
  "ExpirationDate": null,
  "EligibleExpression": "…",
  "ValueExpression": "…",
  "CanCombine": false,
  "xp": null
}
```

# Orders

```js
angular.module('orderCloud.sdk).factory(Orders, OrdersFactory)
```

An Order represents a business transaction between two parties. It typically consists of a collection of Line Items, a Payment Method, Tax and Shipping information, etc. The OrderCloud platform defines various "actions" that can be performed against Orders, such as Submit, Approve, Ship, etc. These actions transform the state of the order and often trigger external events such as financial transactions.

## Get a Single Order

```js
OrderCloud.Orders.Get(orderID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Response Body Sample

```json
{
  "ID": "…",
  "Type": "Standard",
  "FromUserID": "…",
  "FromUserFirstName": "…",
  "FromUserLastName": "…",
  "BillingAddress": {
    "ID": "…",
    "CompanyName": "…",
    "FirstName": "…",
    "LastName": "…",
    "Street1": "…",
    "Street2": "…",
    "City": "…",
    "State": "…",
    "Zip": "…",
    "Country": "…",
    "Phone": "…",
    "AddressName": "…",
    "xp": null
  },
  "ShippingAddressID": "…",
  "Comments": "…",
  "LineItemCount": 0,
  "Status": "Unsubmitted",
  "DateCreated": null,
  "DateSubmitted": null,
  "DateApproved": null,
  "DateDeclined": null,
  "DateCanceled": null,
  "DateCompleted": null,
  "Subtotal": 0.0,
  "ShippingCost": 0.0,
  "TaxCost": 0.0,
  "PromotionDiscount": 0.0,
  "Total": 0.0,
  "IsSubmitted": false,
  "xp": null
}
```

## Create New Order

```js
OrderCloud.Orders.Create(order).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Type": "Standard",
  "FromUserID": "…",
  "BillingAddressID": "…",
  "ShippingAddressID": "…",
  "Comments": "…",
  "ShippingCost": 0.0,
  "TaxCost": 0.0,
  "xp": null
}
```

## Create or Update Order

```js
OrderCloud.Orders.Update(orderID,order).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Request Body Sample

```json
{
  "ID": "…",
  "Type": "Standard",
  "FromUserID": "…",
  "BillingAddressID": "…",
  "ShippingAddressID": "…",
  "Comments": "…",
  "ShippingCost": 0.0,
  "TaxCost": 0.0,
  "xp": null
}
```

## Delete Order

```js
OrderCloud.Orders.Delete(orderID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
## List Outgoing

```js
OrderCloud.Orders.ListOutgoing(from,to,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|from|date|Lower bound of date range that the order was created.|
|to|date|Upper bound of date range that the order was created.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Type": "Standard",
      "FromUserID": "…",
      "FromUserFirstName": "…",
      "FromUserLastName": "…",
      "BillingAddress": {
        "ID": "…",
        "CompanyName": "…",
        "FirstName": "…",
        "LastName": "…",
        "Street1": "…",
        "Street2": "…",
        "City": "…",
        "State": "…",
        "Zip": "…",
        "Country": "…",
        "Phone": "…",
        "AddressName": "…",
        "xp": null
      },
      "ShippingAddressID": "…",
      "Comments": "…",
      "LineItemCount": 0,
      "Status": "Unsubmitted",
      "DateCreated": null,
      "DateSubmitted": null,
      "DateApproved": null,
      "DateDeclined": null,
      "DateCanceled": null,
      "DateCompleted": null,
      "Subtotal": 0.0,
      "ShippingCost": 0.0,
      "TaxCost": 0.0,
      "PromotionDiscount": 0.0,
      "Total": 0.0,
      "IsSubmitted": false,
      "xp": null
    }
  ]
}
```

## List Incoming

```js
OrderCloud.Orders.ListIncoming(from,to,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|from|date|Lower bound of date range that the order was submitted.|
|to|date|Upper bound of date range that the order was submitted.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Type": "Standard",
      "FromUserID": "…",
      "FromUserFirstName": "…",
      "FromUserLastName": "…",
      "BillingAddress": {
        "ID": "…",
        "CompanyName": "…",
        "FirstName": "…",
        "LastName": "…",
        "Street1": "…",
        "Street2": "…",
        "City": "…",
        "State": "…",
        "Zip": "…",
        "Country": "…",
        "Phone": "…",
        "AddressName": "…",
        "xp": null
      },
      "ShippingAddressID": "…",
      "Comments": "…",
      "LineItemCount": 0,
      "Status": "Unsubmitted",
      "DateCreated": null,
      "DateSubmitted": null,
      "DateApproved": null,
      "DateDeclined": null,
      "DateCanceled": null,
      "DateCompleted": null,
      "Subtotal": 0.0,
      "ShippingCost": 0.0,
      "TaxCost": 0.0,
      "PromotionDiscount": 0.0,
      "Total": 0.0,
      "IsSubmitted": false,
      "xp": null
    }
  ]
}
```

## List Approvals

```js
OrderCloud.Orders.ListApprovals(orderID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ApprovalRuleID": "…",
      "ApprovingGroupID": "…",
      "Status": "Pending",
      "DateCreated": "0001-01-01T00:00:00+00:00",
      "DateCompleted": null,
      "ApproverID": "…",
      "ApproverUserName": "…",
      "ApproverEmail": "…",
      "Comments": "…"
    }
  ]
}
```

## List Eligible Approvers

```js
OrderCloud.Orders.ListEligibleApprovers(orderID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Username": "…",
      "FirstName": "…",
      "LastName": "…",
      "Email": "…",
      "Phone": "…",
      "TermsAccepted": null,
      "Active": false,
      "xp": null,
      "AvailableRoles": [
        "…"
      ]
    }
  ]
}
```

## Partially Update Order

```js
OrderCloud.Orders.Patch(orderID,partialOrder).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Request Body Sample

```json
{
  "ID": "…",
  "Type": "Standard",
  "FromUserID": "…",
  "BillingAddressID": "…",
  "ShippingAddressID": "…",
  "Comments": "…",
  "ShippingCost": 0.0,
  "TaxCost": 0.0,
  "xp": null
}
```

## Submit Order

```js
OrderCloud.Orders.Submit(orderID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Response Body Sample

```json
{
  "ID": "…",
  "Type": "Standard",
  "FromUserID": "…",
  "FromUserFirstName": "…",
  "FromUserLastName": "…",
  "BillingAddress": {
    "ID": "…",
    "CompanyName": "…",
    "FirstName": "…",
    "LastName": "…",
    "Street1": "…",
    "Street2": "…",
    "City": "…",
    "State": "…",
    "Zip": "…",
    "Country": "…",
    "Phone": "…",
    "AddressName": "…",
    "xp": null
  },
  "ShippingAddressID": "…",
  "Comments": "…",
  "LineItemCount": 0,
  "Status": "Unsubmitted",
  "DateCreated": null,
  "DateSubmitted": null,
  "DateApproved": null,
  "DateDeclined": null,
  "DateCanceled": null,
  "DateCompleted": null,
  "Subtotal": 0.0,
  "ShippingCost": 0.0,
  "TaxCost": 0.0,
  "PromotionDiscount": 0.0,
  "Total": 0.0,
  "IsSubmitted": false,
  "xp": null
}
```

## Approve Order

```js
OrderCloud.Orders.Approve(orderID,comments).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|comments|string|Comments to be saved with the order approval.|
### Response Body Sample

```json
{
  "ID": "…",
  "Type": "Standard",
  "FromUserID": "…",
  "FromUserFirstName": "…",
  "FromUserLastName": "…",
  "BillingAddress": {
    "ID": "…",
    "CompanyName": "…",
    "FirstName": "…",
    "LastName": "…",
    "Street1": "…",
    "Street2": "…",
    "City": "…",
    "State": "…",
    "Zip": "…",
    "Country": "…",
    "Phone": "…",
    "AddressName": "…",
    "xp": null
  },
  "ShippingAddressID": "…",
  "Comments": "…",
  "LineItemCount": 0,
  "Status": "Unsubmitted",
  "DateCreated": null,
  "DateSubmitted": null,
  "DateApproved": null,
  "DateDeclined": null,
  "DateCanceled": null,
  "DateCompleted": null,
  "Subtotal": 0.0,
  "ShippingCost": 0.0,
  "TaxCost": 0.0,
  "PromotionDiscount": 0.0,
  "Total": 0.0,
  "IsSubmitted": false,
  "xp": null
}
```

## Decline Order

```js
OrderCloud.Orders.Decline(orderID,comments).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|comments|string|Comments to be saved with the order denial.|
### Response Body Sample

```json
{
  "ID": "…",
  "Type": "Standard",
  "FromUserID": "…",
  "FromUserFirstName": "…",
  "FromUserLastName": "…",
  "BillingAddress": {
    "ID": "…",
    "CompanyName": "…",
    "FirstName": "…",
    "LastName": "…",
    "Street1": "…",
    "Street2": "…",
    "City": "…",
    "State": "…",
    "Zip": "…",
    "Country": "…",
    "Phone": "…",
    "AddressName": "…",
    "xp": null
  },
  "ShippingAddressID": "…",
  "Comments": "…",
  "LineItemCount": 0,
  "Status": "Unsubmitted",
  "DateCreated": null,
  "DateSubmitted": null,
  "DateApproved": null,
  "DateDeclined": null,
  "DateCanceled": null,
  "DateCompleted": null,
  "Subtotal": 0.0,
  "ShippingCost": 0.0,
  "TaxCost": 0.0,
  "PromotionDiscount": 0.0,
  "Total": 0.0,
  "IsSubmitted": false,
  "xp": null
}
```

## Cancel Order

```js
OrderCloud.Orders.Cancel(orderID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Response Body Sample

```json
{
  "ID": "…",
  "Type": "Standard",
  "FromUserID": "…",
  "FromUserFirstName": "…",
  "FromUserLastName": "…",
  "BillingAddress": {
    "ID": "…",
    "CompanyName": "…",
    "FirstName": "…",
    "LastName": "…",
    "Street1": "…",
    "Street2": "…",
    "City": "…",
    "State": "…",
    "Zip": "…",
    "Country": "…",
    "Phone": "…",
    "AddressName": "…",
    "xp": null
  },
  "ShippingAddressID": "…",
  "Comments": "…",
  "LineItemCount": 0,
  "Status": "Unsubmitted",
  "DateCreated": null,
  "DateSubmitted": null,
  "DateApproved": null,
  "DateDeclined": null,
  "DateCanceled": null,
  "DateCompleted": null,
  "Subtotal": 0.0,
  "ShippingCost": 0.0,
  "TaxCost": 0.0,
  "PromotionDiscount": 0.0,
  "Total": 0.0,
  "IsSubmitted": false,
  "xp": null
}
```

## Ship Order

```js
OrderCloud.Orders.Ship(orderID,shipment).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Request Body Sample

```json
{
  "ID": "…",
  "Shipper": "…",
  "DateShipped": null,
  "TrackingNumber": "…",
  "Cost": null,
  "Items": [
    {
      "OrderID": "…",
      "LineItemID": "…",
      "QuantityShipped": 0
    }
  ],
  "xp": null
}
```

## Set Shipping Address

```js
OrderCloud.Orders.SetShippingAddress(orderID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Patch Shipping Address

```js
OrderCloud.Orders.PatchShippingAddress(orderID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Set Billing Address

```js
OrderCloud.Orders.SetBillingAddress(orderID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Patch Billing Address

```js
OrderCloud.Orders.PatchBillingAddress(orderID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Add Promotion

```js
OrderCloud.Orders.AddPromotion(orderID,promoCode).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|promoCode|string|Promo code of the order.|
### Response Body Sample

```json
{
  "ID": "…",
  "Code": "…",
  "Name": "…",
  "RedemptionLimit": null,
  "RedemptionLimitPerUser": null,
  "RedemptionCount": 0,
  "Description": "…",
  "FinePrint": "…",
  "StartDate": null,
  "ExpirationDate": null,
  "EligibleExpression": "…",
  "ValueExpression": "…",
  "CanCombine": false,
  "xp": null
}
```

## List Promotions

```js
OrderCloud.Orders.ListPromotions(orderID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "Amount": 0.0,
      "ID": "…",
      "Code": "…",
      "Name": "…",
      "RedemptionLimit": null,
      "RedemptionLimitPerUser": null,
      "RedemptionCount": 0,
      "Description": "…",
      "FinePrint": "…",
      "StartDate": null,
      "ExpirationDate": null,
      "EligibleExpression": "…",
      "ValueExpression": "…",
      "CanCombine": false,
      "xp": null
    }
  ]
}
```

## Remove Promotion

```js
OrderCloud.Orders.RemovePromotion(orderID,promoCode).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|promoCode|string|Promo code of the order.|
### Response Body Sample

```json
{
  "ID": "…",
  "Type": "Standard",
  "FromUserID": "…",
  "FromUserFirstName": "…",
  "FromUserLastName": "…",
  "BillingAddress": {
    "ID": "…",
    "CompanyName": "…",
    "FirstName": "…",
    "LastName": "…",
    "Street1": "…",
    "Street2": "…",
    "City": "…",
    "State": "…",
    "Zip": "…",
    "Country": "…",
    "Phone": "…",
    "AddressName": "…",
    "xp": null
  },
  "ShippingAddressID": "…",
  "Comments": "…",
  "LineItemCount": 0,
  "Status": "Unsubmitted",
  "DateCreated": null,
  "DateSubmitted": null,
  "DateApproved": null,
  "DateDeclined": null,
  "DateCanceled": null,
  "DateCompleted": null,
  "Subtotal": 0.0,
  "ShippingCost": 0.0,
  "TaxCost": 0.0,
  "PromotionDiscount": 0.0,
  "Total": 0.0,
  "IsSubmitted": false,
  "xp": null
}
```

## Transfer Temp User Order

```js
OrderCloud.Orders.TransferTempUserOrder(tempUserToken).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|tempUserToken|string|Temp user token of the order.|
# LineItems

```js
angular.module('orderCloud.sdk).factory(LineItems, LineItemsFactory)
```

A Line Item represents a single line on an Order. At a minimum, it contains a single Product SKU and a quantity. A line item may also include Spec values, a Cost Center, shipping details, date needed, and other custom information.

## Get a Single Line Item

```js
OrderCloud.LineItems.Get(orderID,lineItemID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|lineItemID|string|ID of the line item.|
### Response Body Sample

```json
{
  "ID": "…",
  "ProductID": "…",
  "Quantity": 0,
  "DateAdded": "0001-01-01T00:00:00+00:00",
  "QuantityShipped": 0,
  "UnitPrice": null,
  "LineTotal": 0.0,
  "CostCenter": "…",
  "DateNeeded": null,
  "ShippingAccount": "…",
  "ShippingAddress": {
    "ID": "…",
    "CompanyName": "…",
    "FirstName": "…",
    "LastName": "…",
    "Street1": "…",
    "Street2": "…",
    "City": "…",
    "State": "…",
    "Zip": "…",
    "Country": "…",
    "Phone": "…",
    "AddressName": "…",
    "xp": null
  },
  "ShipFromAddress": {
    "ID": "…",
    "CompanyName": "…",
    "FirstName": "…",
    "LastName": "…",
    "Street1": "…",
    "Street2": "…",
    "City": "…",
    "State": "…",
    "Zip": "…",
    "Country": "…",
    "Phone": "…",
    "AddressName": "…",
    "xp": null
  },
  "Specs": [
    {
      "SpecID": "…",
      "Name": "…",
      "OptionID": "…",
      "Value": "…"
    }
  ],
  "xp": null
}
```

## Get a List of Line Items

```js
OrderCloud.LineItems.List(orderID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "ProductID": "…",
      "Quantity": 0,
      "DateAdded": "0001-01-01T00:00:00+00:00",
      "QuantityShipped": 0,
      "UnitPrice": null,
      "LineTotal": 0.0,
      "CostCenter": "…",
      "DateNeeded": null,
      "ShippingAccount": "…",
      "ShippingAddress": {
        "ID": "…",
        "CompanyName": "…",
        "FirstName": "…",
        "LastName": "…",
        "Street1": "…",
        "Street2": "…",
        "City": "…",
        "State": "…",
        "Zip": "…",
        "Country": "…",
        "Phone": "…",
        "AddressName": "…",
        "xp": null
      },
      "ShipFromAddress": {
        "ID": "…",
        "CompanyName": "…",
        "FirstName": "…",
        "LastName": "…",
        "Street1": "…",
        "Street2": "…",
        "City": "…",
        "State": "…",
        "Zip": "…",
        "Country": "…",
        "Phone": "…",
        "AddressName": "…",
        "xp": null
      },
      "Specs": [
        {
          "SpecID": "…",
          "Name": "…",
          "OptionID": "…",
          "Value": "…"
        }
      ],
      "xp": null
    }
  ]
}
```

## Create New Line Item

```js
OrderCloud.LineItems.Create(orderID,lineItem).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Request Body Sample

```json
{
  "ID": "…",
  "ProductID": "…",
  "Quantity": 0,
  "UnitPrice": null,
  "CostCenter": "…",
  "DateNeeded": null,
  "ShippingAccount": "…",
  "ShippingAddressID": "…",
  "ShipFromAddressID": "…",
  "Specs": [
    {
      "SpecID": "…",
      "OptionID": "…",
      "Value": "…"
    }
  ],
  "xp": null
}
```

## Create or Update Line Item

```js
OrderCloud.LineItems.Update(orderID,lineItemID,lineItem).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|lineItemID|string|ID of the line item.|
### Request Body Sample

```json
{
  "ID": "…",
  "ProductID": "…",
  "Quantity": 0,
  "UnitPrice": null,
  "CostCenter": "…",
  "DateNeeded": null,
  "ShippingAccount": "…",
  "ShippingAddressID": "…",
  "ShipFromAddressID": "…",
  "Specs": [
    {
      "SpecID": "…",
      "OptionID": "…",
      "Value": "…"
    }
  ],
  "xp": null
}
```

## Delete Line Item

```js
OrderCloud.LineItems.Delete(orderID,lineItemID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|lineItemID|string|ID of the line item.|
## Partially Update Line Item

```js
OrderCloud.LineItems.Patch(orderID,lineItemID,partialLineItem).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|lineItemID|string|ID of the line item.|
### Request Body Sample

```json
{
  "ID": "…",
  "ProductID": "…",
  "Quantity": 0,
  "UnitPrice": null,
  "CostCenter": "…",
  "DateNeeded": null,
  "ShippingAccount": "…",
  "ShippingAddressID": "…",
  "ShipFromAddressID": "…",
  "Specs": [
    {
      "SpecID": "…",
      "OptionID": "…",
      "Value": "…"
    }
  ],
  "xp": null
}
```

## Set Shipping Address

```js
OrderCloud.LineItems.SetShippingAddress(orderID,lineItemID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|lineItemID|string|ID of the line item.|
### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Patch Shipping Address

```js
OrderCloud.LineItems.PatchShippingAddress(orderID,lineItemID,partialAddress).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|lineItemID|string|ID of the line item.|
### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

# Payments

```js
angular.module('orderCloud.sdk).factory(Payments, PaymentsFactory)
```


## Get a Single Payment

```js
OrderCloud.Payments.Get(orderID,paymentID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|paymentID|string|ID of the payment.|
### Response Body Sample

```json
{
  "ID": "…",
  "Type": "PurchaseOrder",
  "DateCreated": "0001-01-01T00:00:00+00:00",
  "CreditCardID": "…",
  "SpendingAccountID": "…",
  "Description": "…",
  "Amount": null,
  "xp": null,
  "Transactions": [
    {
      "ID": "…",
      "Type": "…",
      "DateExecuted": "0001-01-01T00:00:00+00:00",
      "Amount": null,
      "Succeeded": false,
      "ResultCode": "…",
      "ResultMessage": "…",
      "xp": null
    }
  ]
}
```

## Get a List of Payments

```js
OrderCloud.Payments.List(orderID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Type": "PurchaseOrder",
      "DateCreated": "0001-01-01T00:00:00+00:00",
      "CreditCardID": "…",
      "SpendingAccountID": "…",
      "Description": "…",
      "Amount": null,
      "xp": null,
      "Transactions": [
        {
          "ID": "…",
          "Type": "…",
          "DateExecuted": "0001-01-01T00:00:00+00:00",
          "Amount": null,
          "Succeeded": false,
          "ResultCode": "…",
          "ResultMessage": "…",
          "xp": null
        }
      ]
    }
  ]
}
```

## Create New Payment

```js
OrderCloud.Payments.Create(orderID,payment).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
### Request Body Sample

```json
{
  "ID": "…",
  "Type": "PurchaseOrder",
  "CreditCardID": "…",
  "SpendingAccountID": "…",
  "Description": "…",
  "Amount": null,
  "xp": null
}
```

## Create or Update Payment

```js
OrderCloud.Payments.Update(orderID,paymentID,payment).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|paymentID|string|ID of the payment.|
### Request Body Sample

```json
{
  "ID": "…",
  "Type": "PurchaseOrder",
  "CreditCardID": "…",
  "SpendingAccountID": "…",
  "Description": "…",
  "Amount": null,
  "xp": null
}
```

## Delete Payment

```js
OrderCloud.Payments.Delete(orderID,paymentID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|paymentID|string|ID of the payment.|
## Partially Update Payment

```js
OrderCloud.Payments.Patch(orderID,paymentID,partialPayment).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|paymentID|string|ID of the payment.|
### Request Body Sample

```json
{
  "ID": "…",
  "Type": "PurchaseOrder",
  "CreditCardID": "…",
  "SpendingAccountID": "…",
  "Description": "…",
  "Amount": null,
  "xp": null
}
```

## Create Transaction

```js
OrderCloud.Payments.CreateTransaction(orderID,paymentID,transaction).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|paymentID|string|ID of the payment.|
### Request Body Sample

```json
{
  "ID": "…",
  "Type": "…",
  "DateExecuted": "0001-01-01T00:00:00+00:00",
  "Amount": null,
  "Succeeded": false,
  "ResultCode": "…",
  "ResultMessage": "…",
  "xp": null
}
```

## Update Transaction

```js
OrderCloud.Payments.UpdateTransaction(orderID,paymentID,transactionID,transaction).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|paymentID|string|ID of the payment.|
|transactionID|string|ID of the transaction.|
### Request Body Sample

```json
{
  "ID": "…",
  "Type": "…",
  "DateExecuted": "0001-01-01T00:00:00+00:00",
  "Amount": null,
  "Succeeded": false,
  "ResultCode": "…",
  "ResultMessage": "…",
  "xp": null
}
```

## Patch Transaction

```js
OrderCloud.Payments.PatchTransaction(orderID,paymentID,transactionID,partialTransaction).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|paymentID|string|ID of the payment.|
|transactionID|string|ID of the transaction.|
### Request Body Sample

```json
{
  "ID": "…",
  "Type": "…",
  "DateExecuted": "0001-01-01T00:00:00+00:00",
  "Amount": null,
  "Succeeded": false,
  "ResultCode": "…",
  "ResultMessage": "…",
  "xp": null
}
```

## Delete Transaction

```js
OrderCloud.Payments.DeleteTransaction(orderID,paymentID,transactionID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|paymentID|string|ID of the payment.|
|transactionID|string|ID of the transaction.|
# Shipments

```js
angular.module('orderCloud.sdk).factory(Shipments, ShipmentsFactory)
```

A Shipment is a grouping of one or more Line Items from one or more Orders that is physically packaged and delivered to the Buyer as a single unit. It is typically created by the Seller after the Order is submitted as part of the fulfillment process.

## Get a Single Shipment

```js
OrderCloud.Shipments.Get(shipmentID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|shipmentID|string|ID of the shipment.|
### Response Body Sample

```json
{
  "ID": "…",
  "Shipper": "…",
  "DateShipped": null,
  "TrackingNumber": "…",
  "Cost": null,
  "Items": [
    {
      "OrderID": "…",
      "LineItemID": "…",
      "QuantityShipped": 0
    }
  ],
  "xp": null
}
```

## Get a List of Shipments

```js
OrderCloud.Shipments.List(orderID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|orderID|string|ID of the order.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Shipper": "…",
      "DateShipped": null,
      "TrackingNumber": "…",
      "Cost": null,
      "Items": [
        {
          "OrderID": "…",
          "LineItemID": "…",
          "QuantityShipped": 0
        }
      ],
      "xp": null
    }
  ]
}
```

## Create New Shipment

```js
OrderCloud.Shipments.Create(shipment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Shipper": "…",
  "DateShipped": null,
  "TrackingNumber": "…",
  "Cost": null,
  "Items": [
    {
      "OrderID": "…",
      "LineItemID": "…",
      "QuantityShipped": 0
    }
  ],
  "xp": null
}
```

## Create or Update Shipment

```js
OrderCloud.Shipments.Update(shipmentID,shipment).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|shipmentID|string|ID of the shipment.|
### Request Body Sample

```json
{
  "ID": "…",
  "Shipper": "…",
  "DateShipped": null,
  "TrackingNumber": "…",
  "Cost": null,
  "Items": [
    {
      "OrderID": "…",
      "LineItemID": "…",
      "QuantityShipped": 0
    }
  ],
  "xp": null
}
```

## Delete Shipment

```js
OrderCloud.Shipments.Delete(shipmentID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|shipmentID|string|ID of the shipment.|
## Partially Update Shipment

```js
OrderCloud.Shipments.Patch(shipmentID,shipment).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|shipmentID|string|ID of the shipment.|
### Request Body Sample

```json
{
  "ID": "…",
  "Shipper": "…",
  "DateShipped": null,
  "TrackingNumber": "…",
  "Cost": null,
  "Items": [
    {
      "OrderID": "…",
      "LineItemID": "…",
      "QuantityShipped": 0
    }
  ],
  "xp": null
}
```

## Save Item

```js
OrderCloud.Shipments.SaveItem(shipmentID,item).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|shipmentID|string|ID of the shipment.|
### Request Body Sample

```json
{
  "OrderID": "…",
  "LineItemID": "…",
  "QuantityShipped": 0
}
```

## Delete Item

```js
OrderCloud.Shipments.DeleteItem(shipmentID,orderID,lineItemID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|shipmentID|string|ID of the shipment.|
|orderID|string|ID of the order.|
|lineItemID|string|ID of the line item.|
### Response Body Sample

```json
{
  "ID": "…",
  "Shipper": "…",
  "DateShipped": null,
  "TrackingNumber": "…",
  "Cost": null,
  "Items": [
    {
      "OrderID": "…",
      "LineItemID": "…",
      "QuantityShipped": 0
    }
  ],
  "xp": null
}
```

# Buyers

```js
angular.module('orderCloud.sdk).factory(Buyers, BuyersFactory)
```

Buyers, or customers, are the organizations that view the categories and products and place orders.

## Get a Single Buyer

```js
OrderCloud.Buyers.Get().then(successFn).catch(errorFn);
```

### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "DefaultCatalogID": "…",
  "Active": false,
  "xp": null
}
```

## Get a List of Buyers

```js
OrderCloud.Buyers.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "DefaultCatalogID": "…",
      "Active": false,
      "xp": null
    }
  ]
}
```

## Create New Buyer

```js
OrderCloud.Buyers.Create(company).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "DefaultCatalogID": "…",
  "Active": false,
  "xp": null
}
```

## Create or Update Buyer

```js
OrderCloud.Buyers.Update(company).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "DefaultCatalogID": "…",
  "Active": false,
  "xp": null
}
```

## Delete Buyer

```js
OrderCloud.Buyers.Delete().then(successFn).catch(errorFn);
```

## Partially Update Buyer

```js
OrderCloud.Buyers.Patch(company).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "DefaultCatalogID": "…",
  "Active": false,
  "xp": null
}
```

# AdminUsers

```js
angular.module('orderCloud.sdk).factory(AdminUsers, AdminUsersFactory)
```

Users on an Organization level are users that have administrative access to things like adding users, creating catalogs, processing orders or creating products. These users are not specific to a buyer company.

## Get a Single Admin User

```js
OrderCloud.AdminUsers.Get(userID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userID|string|ID of the user.|
### Response Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null,
  "AvailableRoles": [
    "…"
  ]
}
```

## Get a List of Admin Users

```js
OrderCloud.AdminUsers.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Username": "…",
      "FirstName": "…",
      "LastName": "…",
      "Email": "…",
      "Phone": "…",
      "TermsAccepted": null,
      "Active": false,
      "xp": null,
      "AvailableRoles": [
        "…"
      ]
    }
  ]
}
```

## Create New Admin User

```js
OrderCloud.AdminUsers.Create(user).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "Password": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null
}
```

## Create or Update Admin User

```js
OrderCloud.AdminUsers.Update(userID,user).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userID|string|ID of the user.|
### Request Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "Password": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null
}
```

## Delete Admin User

```js
OrderCloud.AdminUsers.Delete(userID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userID|string|ID of the user.|
## Partially Update Admin User

```js
OrderCloud.AdminUsers.Patch(userID,user).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userID|string|ID of the user.|
### Request Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "Password": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null
}
```

# Catalogs

```js
angular.module('orderCloud.sdk).factory(Catalogs, CatalogsFactory)
```

A Catalog represents a group of categories used to group and place content for a specific audience. All buyers are issued and assigned a default catalog upon creation. Catalogs can be shared between buyers using assignments.

## Get a Single Catalog

```js
OrderCloud.Catalogs.Get(catalogID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "CategoryCount": 0,
  "xp": null
}
```

## Get a List of Catalogs

```js
OrderCloud.Catalogs.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "CategoryCount": 0,
      "xp": null
    }
  ]
}
```

## Create New Catalog

```js
OrderCloud.Catalogs.Create(catalog).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Create or Update Catalog

```js
OrderCloud.Catalogs.Update(catalogID,catalog).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Delete Catalog

```js
OrderCloud.Catalogs.Delete(catalogID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
## Partially Update Catalog

```js
OrderCloud.Catalogs.Patch(catalogID,partialCatalog).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## List Assignments

```js
OrderCloud.Catalogs.ListAssignments(catalogID,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "CatalogID": "…",
      "BuyerID": "…"
    }
  ]
}
```

## Save Assignment

```js
OrderCloud.Catalogs.SaveAssignment(assignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "CatalogID": "…",
  "BuyerID": "…"
}
```

## Delete Assignment

```js
OrderCloud.Catalogs.DeleteAssignment(catalogID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
# Categories

```js
angular.module('orderCloud.sdk).factory(Categories, CategoriesFactory)
```

Categories are used within a catalog to group and place content for a specific audience. Content can be in the form of another category, nested categories, products or HTML.

## Get a Single Category

```js
OrderCloud.Categories.Get(catalogID,categoryID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
|categoryID|string|ID of the category.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null,
  "ListOrder": 1,
  "Active": false,
  "ParentID": "…",
  "ChildCount": 0
}
```

## Get a List of Categories

```js
OrderCloud.Categories.List(catalogID,listArgs,depth).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
|depth|string|Depth of the category.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "xp": null,
      "ListOrder": 1,
      "Active": false,
      "ParentID": "…",
      "ChildCount": 0
    }
  ]
}
```

## Create New Category

```js
OrderCloud.Categories.Create(catalogID,category).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null,
  "ListOrder": 1,
  "Active": false,
  "ParentID": "…"
}
```

## Create or Update Category

```js
OrderCloud.Categories.Update(catalogID,categoryID,category).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
|categoryID|string|ID of the category.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null,
  "ListOrder": 1,
  "Active": false,
  "ParentID": "…"
}
```

## Delete Category

```js
OrderCloud.Categories.Delete(catalogID,categoryID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
|categoryID|string|ID of the category.|
## Partially Update Category

```js
OrderCloud.Categories.Patch(catalogID,categoryID,category).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
|categoryID|string|ID of the category.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null,
  "ListOrder": 1,
  "Active": false,
  "ParentID": "…"
}
```

## List Assignments

```js
OrderCloud.Categories.ListAssignments(catalogID,categoryID,userID,userGroupID,level,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
|categoryID|string|ID of the category.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
|level|string|Level of the category.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "CategoryID": "…",
      "BuyerID": "…",
      "UserID": "…",
      "UserGroupID": "…"
    }
  ]
}
```

## Delete Assignment

```js
OrderCloud.Categories.DeleteAssignment(catalogID,categoryID,userID,userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
|categoryID|string|ID of the category.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
## Save Assignment

```js
OrderCloud.Categories.SaveAssignment(catalogID,categoryAssignment).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
### Request Body Sample

```json
{
  "CategoryID": "…",
  "BuyerID": "…",
  "UserID": "…",
  "UserGroupID": "…"
}
```

## List Product Assignments

```js
OrderCloud.Categories.ListProductAssignments(catalogID,categoryID,productID,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
|categoryID|string|ID of the category.|
|productID|string|ID of the product.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "CategoryID": "…",
      "ProductID": "…",
      "ListOrder": null
    }
  ]
}
```

## Save Product Assignment

```js
OrderCloud.Categories.SaveProductAssignment(catalogID,productAssignment).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
### Request Body Sample

```json
{
  "CategoryID": "…",
  "ProductID": "…",
  "ListOrder": null
}
```

## Delete Product Assignment

```js
OrderCloud.Categories.DeleteProductAssignment(catalogID,categoryID,productID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|catalogID|string|ID of the catalog.|
|categoryID|string|ID of the category.|
|productID|string|ID of the product.|
# Specs

```js
angular.module('orderCloud.sdk).factory(Specs, SpecsFactory)
```

Specs are used to capture user input when adding a Product to an Order. At its simplest, a spec is a name/value pair. A spec value may have a price markup or markdown associated with it. In more advanced scenarios, specs can drive the product SKU. For example, a product may be available in 3 colors and 3 sizes and therefore have a total of 9 SKUs. **The OrderCloud platform will choose the correct SKU based on the user-selected color and size specs**.

## Get a Single Spec

```js
OrderCloud.Specs.Get(specID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
### Response Body Sample

```json
{
  "OptionCount": 0,
  "ID": "…",
  "ListOrder": 0,
  "Name": "…",
  "DefaultValue": "…",
  "Required": false,
  "AllowOpenText": false,
  "DefaultOptionID": "…",
  "DefinesVariant": false,
  "xp": null
}
```

## Get a List of Specs

```js
OrderCloud.Specs.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "OptionCount": 0,
      "ID": "…",
      "ListOrder": 0,
      "Name": "…",
      "DefaultValue": "…",
      "Required": false,
      "AllowOpenText": false,
      "DefaultOptionID": "…",
      "DefinesVariant": false,
      "xp": null
    }
  ]
}
```

## Create New Spec

```js
OrderCloud.Specs.Create(spec).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "ListOrder": 0,
  "Name": "…",
  "DefaultValue": "…",
  "Required": false,
  "AllowOpenText": false,
  "DefaultOptionID": "…",
  "DefinesVariant": false,
  "xp": null
}
```

## Create or Update Spec

```js
OrderCloud.Specs.Update(specID,spec).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
### Request Body Sample

```json
{
  "ID": "…",
  "ListOrder": 0,
  "Name": "…",
  "DefaultValue": "…",
  "Required": false,
  "AllowOpenText": false,
  "DefaultOptionID": "…",
  "DefinesVariant": false,
  "xp": null
}
```

## Delete Spec

```js
OrderCloud.Specs.Delete(specID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
## Partially Update Spec

```js
OrderCloud.Specs.Patch(specID,spec).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
### Request Body Sample

```json
{
  "ID": "…",
  "ListOrder": 0,
  "Name": "…",
  "DefaultValue": "…",
  "Required": false,
  "AllowOpenText": false,
  "DefaultOptionID": "…",
  "DefinesVariant": false,
  "xp": null
}
```

## List Product Assignments

```js
OrderCloud.Specs.ListProductAssignments(specID,productID,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
|productID|string|ID of the product.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "SpecID": "…",
      "ProductID": "…",
      "DefaultValue": "…",
      "DefaultOptionID": "…"
    }
  ]
}
```

## Delete Product Assignment

```js
OrderCloud.Specs.DeleteProductAssignment(specID,productID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
|productID|string|ID of the product.|
## Save Product Assignment

```js
OrderCloud.Specs.SaveProductAssignment(productAssignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "SpecID": "…",
  "ProductID": "…",
  "DefaultValue": "…",
  "DefaultOptionID": "…"
}
```

## Create Option

```js
OrderCloud.Specs.CreateOption(specID,option).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
### Request Body Sample

```json
{
  "ID": "…",
  "Value": "…",
  "ListOrder": 0,
  "IsOpenText": false,
  "PriceMarkupType": null,
  "PriceMarkup": null,
  "xp": null
}
```

## List Options

```js
OrderCloud.Specs.ListOptions(specID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Value": "…",
      "ListOrder": 0,
      "IsOpenText": false,
      "PriceMarkupType": null,
      "PriceMarkup": null,
      "xp": null
    }
  ]
}
```

## Update Option

```js
OrderCloud.Specs.UpdateOption(specID,optionID,option).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
|optionID|string|ID of the option.|
### Request Body Sample

```json
{
  "ID": "…",
  "Value": "…",
  "ListOrder": 0,
  "IsOpenText": false,
  "PriceMarkupType": null,
  "PriceMarkup": null,
  "xp": null
}
```

## Patch Option

```js
OrderCloud.Specs.PatchOption(specID,optionID,option).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
|optionID|string|ID of the option.|
### Request Body Sample

```json
{
  "ID": "…",
  "Value": "…",
  "ListOrder": 0,
  "IsOpenText": false,
  "PriceMarkupType": null,
  "PriceMarkup": null,
  "xp": null
}
```

## Get Option

```js
OrderCloud.Specs.GetOption(specID,optionID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
|optionID|string|ID of the option.|
### Response Body Sample

```json
{
  "ID": "…",
  "Value": "…",
  "ListOrder": 0,
  "IsOpenText": false,
  "PriceMarkupType": null,
  "PriceMarkup": null,
  "xp": null
}
```

## Delete Option

```js
OrderCloud.Specs.DeleteOption(specID,optionID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|specID|string|ID of the spec.|
|optionID|string|ID of the option.|
# Products

```js
angular.module('orderCloud.sdk).factory(Products, ProductsFactory)
```

A Product represents a physical, digital, or absract good that is offered for sale by a seller organization and is purchase-able by Buyer Users via an Order. 
Products can be a static SKU or a version of a static SKU, known as a Variant.  For example, a variant is often a size or color choice that drives a different product SKU.
Products may also have inventory associated with them and various inventory attributes like quantity available and re-order notifications.

## Get a Single Product

```js
OrderCloud.Products.Get(productID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "QuantityMultiplier": 0,
  "ShipWeight": null,
  "ShipHeight": null,
  "ShipWidth": null,
  "ShipLength": null,
  "Active": false,
  "Type": "Static",
  "InventoryEnabled": false,
  "InventoryNotificationPoint": null,
  "VariantLevelInventory": false,
  "SpecCount": 0,
  "xp": null,
  "AllowOrderExceedInventory": false,
  "InventoryVisible": false,
  "VariantCount": 0,
  "ShipFromAddressID": "…"
}
```

## Get a List of Products

```js
OrderCloud.Products.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "QuantityMultiplier": 0,
      "ShipWeight": null,
      "ShipHeight": null,
      "ShipWidth": null,
      "ShipLength": null,
      "Active": false,
      "Type": "Static",
      "InventoryEnabled": false,
      "InventoryNotificationPoint": null,
      "VariantLevelInventory": false,
      "SpecCount": 0,
      "xp": null,
      "AllowOrderExceedInventory": false,
      "InventoryVisible": false,
      "VariantCount": 0,
      "ShipFromAddressID": "…"
    }
  ]
}
```

## Create New Product

```js
OrderCloud.Products.Create(product).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "QuantityMultiplier": 0,
  "ShipWeight": null,
  "ShipHeight": null,
  "ShipWidth": null,
  "ShipLength": null,
  "Active": false,
  "Type": "Static",
  "InventoryEnabled": false,
  "InventoryNotificationPoint": null,
  "VariantLevelInventory": false,
  "xp": null,
  "AllowOrderExceedInventory": false,
  "InventoryVisible": false,
  "ShipFromAddressID": "…"
}
```

## Create or Update Product

```js
OrderCloud.Products.Update(productID,product).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "QuantityMultiplier": 0,
  "ShipWeight": null,
  "ShipHeight": null,
  "ShipWidth": null,
  "ShipLength": null,
  "Active": false,
  "Type": "Static",
  "InventoryEnabled": false,
  "InventoryNotificationPoint": null,
  "VariantLevelInventory": false,
  "xp": null,
  "AllowOrderExceedInventory": false,
  "InventoryVisible": false,
  "ShipFromAddressID": "…"
}
```

## Delete Product

```js
OrderCloud.Products.Delete(productID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
## Partially Update Product

```js
OrderCloud.Products.Patch(productID,product).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "QuantityMultiplier": 0,
  "ShipWeight": null,
  "ShipHeight": null,
  "ShipWidth": null,
  "ShipLength": null,
  "Active": false,
  "Type": "Static",
  "InventoryEnabled": false,
  "InventoryNotificationPoint": null,
  "VariantLevelInventory": false,
  "xp": null,
  "AllowOrderExceedInventory": false,
  "InventoryVisible": false,
  "ShipFromAddressID": "…"
}
```

## Generate Variants

```js
OrderCloud.Products.GenerateVariants(productID,overwriteExisting).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|overwriteExisting|boolean|Overwrite existing of the product.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "QuantityMultiplier": 0,
  "ShipWeight": null,
  "ShipHeight": null,
  "ShipWidth": null,
  "ShipLength": null,
  "Active": false,
  "Type": "Static",
  "InventoryEnabled": false,
  "InventoryNotificationPoint": null,
  "VariantLevelInventory": false,
  "SpecCount": 0,
  "xp": null,
  "AllowOrderExceedInventory": false,
  "InventoryVisible": false,
  "VariantCount": 0,
  "ShipFromAddressID": "…"
}
```

## List Variants

```js
OrderCloud.Products.ListVariants(productID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "Active": false,
      "xp": null
    }
  ]
}
```

## Update Variant

```js
OrderCloud.Products.UpdateVariant(productID,variantID,variant).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|variantID|string|ID of the variant.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "Active": false,
  "xp": null
}
```

## Patch Variant

```js
OrderCloud.Products.PatchVariant(productID,variantID,variant).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|variantID|string|ID of the variant.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "Active": false,
  "xp": null
}
```

## Get Variant

```js
OrderCloud.Products.GetVariant(productID,variantID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|variantID|string|ID of the variant.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "Active": false,
  "xp": null
}
```

## List Variant Inventory

```js
OrderCloud.Products.ListVariantInventory(productID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Available": null,
      "Reserved": null,
      "LastUpdated": null
    }
  ]
}
```

## Get Variant Inventory

```js
OrderCloud.Products.GetVariantInventory(productID,variantID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|variantID|string|ID of the variant.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Available": null,
  "Reserved": null,
  "LastUpdated": null
}
```

## Update Variant Inventory

```js
OrderCloud.Products.UpdateVariantInventory(productID,variantID,inventory).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|variantID|string|ID of the variant.|
|inventory|integer|Inventory of the product.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Available": null,
  "Reserved": null,
  "LastUpdated": null
}
```

## List Inventory

```js
OrderCloud.Products.ListInventory(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Available": null,
      "Reserved": null,
      "LastUpdated": null
    }
  ]
}
```

## Get Inventory

```js
OrderCloud.Products.GetInventory(productID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Available": null,
  "Reserved": null,
  "LastUpdated": null
}
```

## Update Inventory

```js
OrderCloud.Products.UpdateInventory(productID,inventory).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|inventory|integer|Inventory of the product.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Available": null,
  "Reserved": null,
  "LastUpdated": null
}
```

## Save Assignment

```js
OrderCloud.Products.SaveAssignment(productAssignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ProductID": "…",
  "PriceScheduleID": "…",
  "BuyerID": "…",
  "UserID": "…",
  "UserGroupID": "…"
}
```

## List Assignments

```js
OrderCloud.Products.ListAssignments(productID,userID,userGroupID,level,priceScheduleID,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
|level|string|Level of the product.|
|priceScheduleID|string|ID of the price schedule.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ProductID": "…",
      "PriceScheduleID": "…",
      "BuyerID": "…",
      "UserID": "…",
      "UserGroupID": "…"
    }
  ]
}
```

## Delete Assignment

```js
OrderCloud.Products.DeleteAssignment(productID,userID,userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|productID|string|ID of the product.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
# PriceSchedules

```js
angular.module('orderCloud.sdk).factory(PriceSchedules, PriceSchedulesFactory)
```

Price schedules allow the same product to be sold across multiple channels.  A price schedule may include quantity price breaks, min and max quantity per order, whether to apply tax or shipping calculations, or to what type of order the price schedule applies.

## Get a Single Price Schedule

```js
OrderCloud.PriceSchedules.Get(priceScheduleID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|priceScheduleID|string|ID of the price schedule.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "ApplyTax": false,
  "ApplyShipping": false,
  "MinQuantity": null,
  "MaxQuantity": null,
  "UseCumulativeQuantity": false,
  "RestrictedQuantity": false,
  "OrderType": "Standard",
  "PriceBreaks": [
    {
      "Quantity": 0,
      "Price": 0.0
    }
  ],
  "xp": null
}
```

## Get a List of Price Schedules

```js
OrderCloud.PriceSchedules.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "ApplyTax": false,
      "ApplyShipping": false,
      "MinQuantity": null,
      "MaxQuantity": null,
      "UseCumulativeQuantity": false,
      "RestrictedQuantity": false,
      "OrderType": "Standard",
      "PriceBreaks": [
        {
          "Quantity": 0,
          "Price": 0.0
        }
      ],
      "xp": null
    }
  ]
}
```

## Create New Price Schedule

```js
OrderCloud.PriceSchedules.Create(priceSchedule).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "ApplyTax": false,
  "ApplyShipping": false,
  "MaxQuantity": null,
  "UseCumulativeQuantity": false,
  "RestrictedQuantity": false,
  "OrderType": "Standard",
  "PriceBreaks": [
    {
      "Quantity": 0,
      "Price": 0.0
    }
  ],
  "xp": null
}
```

## Create or Update Price Schedule

```js
OrderCloud.PriceSchedules.Update(priceScheduleID,priceSchedule).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|priceScheduleID|string|ID of the price schedule.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "ApplyTax": false,
  "ApplyShipping": false,
  "MaxQuantity": null,
  "UseCumulativeQuantity": false,
  "RestrictedQuantity": false,
  "OrderType": "Standard",
  "PriceBreaks": [
    {
      "Quantity": 0,
      "Price": 0.0
    }
  ],
  "xp": null
}
```

## Delete Price Schedule

```js
OrderCloud.PriceSchedules.Delete(priceScheduleID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|priceScheduleID|string|ID of the price schedule.|
## Partially Update Price Schedule

```js
OrderCloud.PriceSchedules.Patch(priceScheduleID,priceSchedule).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|priceScheduleID|string|ID of the price schedule.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "ApplyTax": false,
  "ApplyShipping": false,
  "MaxQuantity": null,
  "UseCumulativeQuantity": false,
  "RestrictedQuantity": false,
  "OrderType": "Standard",
  "PriceBreaks": [
    {
      "Quantity": 0,
      "Price": 0.0
    }
  ],
  "xp": null
}
```

## Save Price Break

```js
OrderCloud.PriceSchedules.SavePriceBreak(priceScheduleID,priceBreak).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|priceScheduleID|string|ID of the price schedule.|
### Request Body Sample

```json
{
  "Quantity": 0,
  "Price": 0.0
}
```

## Delete Price Break

```js
OrderCloud.PriceSchedules.DeletePriceBreak(priceScheduleID,quantity).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|priceScheduleID|string|ID of the price schedule.|
|quantity|integer|Quantity of the price schedule.|
# Promotions

```js
angular.module('orderCloud.sdk).factory(Promotions, PromotionsFactory)
```

Promotions are used to reduce the cost of a line item or an order.  Promotions can have redemption rules that can be applied for available dates, occurences and value.
Promotions can be assigned to Products, Categories, Buyers, UserGroups and Users for redemption.

## Get a Single Promotion

```js
OrderCloud.Promotions.Get(promotionID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|promotionID|string|ID of the promotion.|
### Response Body Sample

```json
{
  "ID": "…",
  "Code": "…",
  "Name": "…",
  "RedemptionLimit": null,
  "RedemptionLimitPerUser": null,
  "RedemptionCount": 0,
  "Description": "…",
  "FinePrint": "…",
  "StartDate": null,
  "ExpirationDate": null,
  "EligibleExpression": "…",
  "ValueExpression": "…",
  "CanCombine": false,
  "xp": null
}
```

## Get a List of Promotions

```js
OrderCloud.Promotions.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Code": "…",
      "Name": "…",
      "RedemptionLimit": null,
      "RedemptionLimitPerUser": null,
      "RedemptionCount": 0,
      "Description": "…",
      "FinePrint": "…",
      "StartDate": null,
      "ExpirationDate": null,
      "EligibleExpression": "…",
      "ValueExpression": "…",
      "CanCombine": false,
      "xp": null
    }
  ]
}
```

## Create New Promotion

```js
OrderCloud.Promotions.Create(promo).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Code": "…",
  "Name": "…",
  "RedemptionLimit": null,
  "RedemptionLimitPerUser": null,
  "Description": "…",
  "FinePrint": "…",
  "StartDate": null,
  "ExpirationDate": null,
  "EligibleExpression": "…",
  "ValueExpression": "…",
  "CanCombine": false,
  "xp": null
}
```

## Create or Update Promotion

```js
OrderCloud.Promotions.Update(promotionID,promo).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|promotionID|string|ID of the promotion.|
### Request Body Sample

```json
{
  "ID": "…",
  "Code": "…",
  "Name": "…",
  "RedemptionLimit": null,
  "RedemptionLimitPerUser": null,
  "Description": "…",
  "FinePrint": "…",
  "StartDate": null,
  "ExpirationDate": null,
  "EligibleExpression": "…",
  "ValueExpression": "…",
  "CanCombine": false,
  "xp": null
}
```

## Delete Promotion

```js
OrderCloud.Promotions.Delete(promotionID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|promotionID|string|ID of the promotion.|
## Partially Update Promotion

```js
OrderCloud.Promotions.Patch(promotionID,partialPromotion).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|promotionID|string|ID of the promotion.|
### Request Body Sample

```json
{
  "ID": "…",
  "Code": "…",
  "Name": "…",
  "RedemptionLimit": null,
  "RedemptionLimitPerUser": null,
  "Description": "…",
  "FinePrint": "…",
  "StartDate": null,
  "ExpirationDate": null,
  "EligibleExpression": "…",
  "ValueExpression": "…",
  "CanCombine": false,
  "xp": null
}
```

## List Assignments

```js
OrderCloud.Promotions.ListAssignments(promotionID,userID,userGroupID,level,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|promotionID|string|ID of the promotion.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
|level|string|Level of the promotion.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "PromotionID": "…",
      "BuyerID": "…",
      "UserID": "…",
      "UserGroupID": "…"
    }
  ]
}
```

## Save Assignment

```js
OrderCloud.Promotions.SaveAssignment(assignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "PromotionID": "…",
  "BuyerID": "…",
  "UserID": "…",
  "UserGroupID": "…"
}
```

## Delete Assignment

```js
OrderCloud.Promotions.DeleteAssignment(promotionID,userID,userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|promotionID|string|ID of the promotion.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
# AdminAddresses

```js
angular.module('orderCloud.sdk).factory(AdminAddresses, AdminAddressesFactory)
```


## Get a Single Admin Address

```js
OrderCloud.AdminAddresses.Get(addressID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
### Response Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Get a List of Admin Addresses

```js
OrderCloud.AdminAddresses.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "CompanyName": "…",
      "FirstName": "…",
      "LastName": "…",
      "Street1": "…",
      "Street2": "…",
      "City": "…",
      "State": "…",
      "Zip": "…",
      "Country": "…",
      "Phone": "…",
      "AddressName": "…",
      "xp": null
    }
  ]
}
```

## Create New Admin Address

```js
OrderCloud.AdminAddresses.Create(address).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Create or Update Admin Address

```js
OrderCloud.AdminAddresses.Update(addressID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Delete Admin Address

```js
OrderCloud.AdminAddresses.Delete(addressID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
## Partially Update Admin Address

```js
OrderCloud.AdminAddresses.Patch(addressID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

# AdminUserGroups

```js
angular.module('orderCloud.sdk).factory(AdminUserGroups, AdminUserGroupsFactory)
```


## Get a Single Admin User Group

```js
OrderCloud.AdminUserGroups.Get(userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Get a List of Admin User Groups

```js
OrderCloud.AdminUserGroups.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "xp": null
    }
  ]
}
```

## Create New Admin User Group

```js
OrderCloud.AdminUserGroups.Create(group).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Create or Update Admin User Group

```js
OrderCloud.AdminUserGroups.Update(userGroupID,group).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Delete Admin User Group

```js
OrderCloud.AdminUserGroups.Delete(userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
## Partially Update Admin User Group

```js
OrderCloud.AdminUserGroups.Patch(userGroupID,group).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## List User Assignments

```js
OrderCloud.AdminUserGroups.ListUserAssignments(userGroupID,userID,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
|userID|string|ID of the user.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "UserGroupID": "…",
      "UserID": "…"
    }
  ]
}
```

## Delete User Assignment

```js
OrderCloud.AdminUserGroups.DeleteUserAssignment(userGroupID,userID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
|userID|string|ID of the user.|
## Save User Assignment

```js
OrderCloud.AdminUserGroups.SaveUserAssignment(userGroupAssignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "UserGroupID": "…",
  "UserID": "…"
}
```

# MesageSenders

```js
angular.module('orderCloud.sdk).factory(MesageSenders, MesageSendersFactory)
```


## Get a Single Message Sender

```js
OrderCloud.MesageSenders.Get(messageSenderID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|messageSenderID|string|ID of the message sender.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "MessageTypes": [
    "OrderDeclined"
  ]
}
```

## Get a List of Message Senders

```js
OrderCloud.MesageSenders.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "MessageTypes": [
        "OrderDeclined"
      ]
    }
  ]
}
```

## List Assignments

```js
OrderCloud.MesageSenders.ListAssignments(messageSenderID,userID,userGroupID,level,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|messageSenderID|string|ID of the message sender.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
|level|string|Level of the message sender.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "MessageSenderID": "…",
      "BuyerID": "…",
      "UserID": "…",
      "UserGroupID": "…",
      "MessageConfigName": "…"
    }
  ]
}
```

## Delete Assignment

```js
OrderCloud.MesageSenders.DeleteAssignment(messageSenderID,userID,userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|messageSenderID|string|ID of the message sender.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
## Save Assignment

```js
OrderCloud.MesageSenders.SaveAssignment(assignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "MessageSenderID": "…",
  "BuyerID": "…",
  "UserID": "…",
  "UserGroupID": "…"
}
```

## List CC Listener Assignments

```js
OrderCloud.MesageSenders.ListCCListenerAssignments(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "MessageSenderAssignment": {
        "MessageSenderID": "…",
        "BuyerID": "…",
        "UserID": "…",
        "UserGroupID": "…",
        "MessageConfigName": "…"
      },
      "MessageConfigName": "…",
      "MessageType": "OrderDeclined",
      "BuyerID": "…",
      "UserGroupID": "…",
      "UserID": "…"
    }
  ]
}
```

## Save CC Listener Assignment

```js
OrderCloud.MesageSenders.SaveCCListenerAssignment(assignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "MessageSenderAssignment": {
    "MessageSenderID": "…",
    "BuyerID": "…",
    "UserID": "…",
    "UserGroupID": "…"
  },
  "MessageType": "OrderDeclined",
  "BuyerID": "…",
  "UserGroupID": "…",
  "UserID": "…"
}
```

# Users

```js
angular.module('orderCloud.sdk).factory(Users, UsersFactory)
```

A user is a person with access to the application.  The properties of a user define who they are and what they are able to do with their login to the application.

## Get a Single User

```js
OrderCloud.Users.Get(userID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userID|string|ID of the user.|
### Response Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null,
  "AvailableRoles": [
    "…"
  ]
}
```

## Get a List of Users

```js
OrderCloud.Users.List(userGroupID,listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Username": "…",
      "FirstName": "…",
      "LastName": "…",
      "Email": "…",
      "Phone": "…",
      "TermsAccepted": null,
      "Active": false,
      "xp": null,
      "AvailableRoles": [
        "…"
      ]
    }
  ]
}
```

## Create New User

```js
OrderCloud.Users.Create(user).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "Password": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null
}
```

## Create or Update User

```js
OrderCloud.Users.Update(userID,user).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userID|string|ID of the user.|
### Request Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "Password": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null
}
```

## Delete User

```js
OrderCloud.Users.Delete(userID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userID|string|ID of the user.|
## Partially Update User

```js
OrderCloud.Users.Patch(userID,user).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userID|string|ID of the user.|
### Request Body Sample

```json
{
  "ID": "…",
  "Username": "…",
  "Password": "…",
  "FirstName": "…",
  "LastName": "…",
  "Email": "…",
  "Phone": "…",
  "TermsAccepted": null,
  "Active": false,
  "xp": null
}
```

## Get Access Token

```js
OrderCloud.Users.GetAccessToken(userID,tokenRequest).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userID|string|ID of the user.|
### Request Body Sample

```json
{
  "ClientID": "…",
  "Claims": [
    "DevCenterImpersonate"
  ]
}
```

# UserGroups

```js
angular.module('orderCloud.sdk).factory(UserGroups, UserGroupsFactory)
```

User Groups are used to streamline the management of users within an application.  By placing like users in groups, you can filter content, define order management rules, and manage changes much more easily than trying to account for individual users.

## Get a Single User Group

```js
OrderCloud.UserGroups.Get(userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Get a List of User Groups

```js
OrderCloud.UserGroups.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "xp": null
    }
  ]
}
```

## Create New User Group

```js
OrderCloud.UserGroups.Create(group).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Create or Update User Group

```js
OrderCloud.UserGroups.Update(userGroupID,group).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Delete User Group

```js
OrderCloud.UserGroups.Delete(userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
## Partially Update User Group

```js
OrderCloud.UserGroups.Patch(userGroupID,group).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## List User Assignments

```js
OrderCloud.UserGroups.ListUserAssignments(userGroupID,userID,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
|userID|string|ID of the user.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "UserGroupID": "…",
      "UserID": "…"
    }
  ]
}
```

## Delete User Assignment

```js
OrderCloud.UserGroups.DeleteUserAssignment(userGroupID,userID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|userGroupID|string|ID of the user group.|
|userID|string|ID of the user.|
## Save User Assignment

```js
OrderCloud.UserGroups.SaveUserAssignment(userGroupAssignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "UserGroupID": "…",
  "UserID": "…"
}
```

# Addresses

```js
angular.module('orderCloud.sdk).factory(Addresses, AddressesFactory)
```

Addresses are used for the purposes of billing and shipping an order.  An address may belong to a list that can be shared among many users if appropriate.

## Get a Single Address

```js
OrderCloud.Addresses.Get(addressID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
### Response Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Get a List of Addresses

```js
OrderCloud.Addresses.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "CompanyName": "…",
      "FirstName": "…",
      "LastName": "…",
      "Street1": "…",
      "Street2": "…",
      "City": "…",
      "State": "…",
      "Zip": "…",
      "Country": "…",
      "Phone": "…",
      "AddressName": "…",
      "xp": null
    }
  ]
}
```

## Create New Address

```js
OrderCloud.Addresses.Create(address).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Create or Update Address

```js
OrderCloud.Addresses.Update(addressID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## Delete Address

```js
OrderCloud.Addresses.Delete(addressID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
## Partially Update Address

```js
OrderCloud.Addresses.Patch(addressID,address).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
### Request Body Sample

```json
{
  "ID": "…",
  "CompanyName": "…",
  "FirstName": "…",
  "LastName": "…",
  "Street1": "…",
  "Street2": "…",
  "City": "…",
  "State": "…",
  "Zip": "…",
  "Country": "…",
  "Phone": "…",
  "AddressName": "…",
  "xp": null
}
```

## List Assignments

```js
OrderCloud.Addresses.ListAssignments(addressID,userID,userGroupID,level,isShipping,isBilling,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
|level|string|Level of the address.|
|isShipping|boolean|Is shipping of the address.|
|isBilling|boolean|Is billing of the address.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "AddressID": "…",
      "UserID": "…",
      "UserGroupID": "…",
      "IsShipping": false,
      "IsBilling": false
    }
  ]
}
```

## Delete Assignment

```js
OrderCloud.Addresses.DeleteAssignment(addressID,userID,userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|addressID|string|ID of the address.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
## Save Assignment

```js
OrderCloud.Addresses.SaveAssignment(assignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "AddressID": "…",
  "UserID": "…",
  "UserGroupID": "…",
  "IsShipping": false,
  "IsBilling": false
}
```

# SpendingAccounts

```js
angular.module('orderCloud.sdk).factory(SpendingAccounts, SpendingAccountsFactory)
```

Spending Accounts are funds given to users by a managing entity and are managed as part of a user's account.  These funds are generally used as "corporate dollars", "rewards dollars", or "gift cards".
They can be used to pay for all of or part of an order with parameters that control account expiration, balance available, balance renewal, user access and overdraft.
Multiple spending accounts can be assigned to a member of an organization and applied to all transactions, but only one can be used as a payment method.
When multiple Spending Accounts are used on a transaction each is deducted individually.

## Get a Single Spending Account

```js
OrderCloud.SpendingAccounts.Get(spendingAccountID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|spendingAccountID|string|ID of the spending account.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Balance": 0.0,
  "AllowAsPaymentMethod": false,
  "RedemptionCode": "…",
  "StartDate": null,
  "EndDate": null,
  "xp": null
}
```

## Get a List of Spending Accounts

```js
OrderCloud.SpendingAccounts.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Balance": 0.0,
      "AllowAsPaymentMethod": false,
      "RedemptionCode": "…",
      "StartDate": null,
      "EndDate": null,
      "xp": null
    }
  ]
}
```

## Create New Spending Account

```js
OrderCloud.SpendingAccounts.Create(spendingAccount).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Balance": 0.0,
  "AllowAsPaymentMethod": false,
  "RedemptionCode": "…",
  "StartDate": null,
  "EndDate": null,
  "xp": null
}
```

## Create or Update Spending Account

```js
OrderCloud.SpendingAccounts.Update(spendingAccountID,spendingAccount).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|spendingAccountID|string|ID of the spending account.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Balance": 0.0,
  "AllowAsPaymentMethod": false,
  "RedemptionCode": "…",
  "StartDate": null,
  "EndDate": null,
  "xp": null
}
```

## Delete Spending Account

```js
OrderCloud.SpendingAccounts.Delete(spendingAccountID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|spendingAccountID|string|ID of the spending account.|
## Partially Update Spending Account

```js
OrderCloud.SpendingAccounts.Patch(spendingAccountID,spendingAccount).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|spendingAccountID|string|ID of the spending account.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Balance": 0.0,
  "AllowAsPaymentMethod": false,
  "RedemptionCode": "…",
  "StartDate": null,
  "EndDate": null,
  "xp": null
}
```

## List Assignments

```js
OrderCloud.SpendingAccounts.ListAssignments(spendingAccountID,userID,userGroupID,level,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|spendingAccountID|string|ID of the spending account.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
|level|string|Level of the spending account.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "SpendingAccountID": "…",
      "UserID": "…",
      "UserGroupID": "…",
      "AllowExceed": false
    }
  ]
}
```

## Save Assignment

```js
OrderCloud.SpendingAccounts.SaveAssignment(assignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "SpendingAccountID": "…",
  "UserID": "…",
  "UserGroupID": "…",
  "AllowExceed": false
}
```

## Delete Assignment

```js
OrderCloud.SpendingAccounts.DeleteAssignment(spendingAccountID,userID,userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|spendingAccountID|string|ID of the spending account.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
# CostCenters

```js
angular.module('orderCloud.sdk).factory(CostCenters, CostCentersFactory)
```

A cost center is used to allocate organizational expenditures.  Different businesses call these by different names such as "allocation codes" or "charge back codes", but the basic purpose is the same - to allocate an expense back to someone or some department of an organization.

## Get a Single Cost Center

```js
OrderCloud.CostCenters.Get(costCenterID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|costCenterID|string|ID of the cost center.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Get a List of Cost Centers

```js
OrderCloud.CostCenters.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "xp": null
    }
  ]
}
```

## Create New Cost Center

```js
OrderCloud.CostCenters.Create(costCenter).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Create or Update Cost Center

```js
OrderCloud.CostCenters.Update(costCenterID,costCenter).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|costCenterID|string|ID of the cost center.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## Delete Cost Center

```js
OrderCloud.CostCenters.Delete(costCenterID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|costCenterID|string|ID of the cost center.|
## Partially Update Cost Center

```js
OrderCloud.CostCenters.Patch(costCenterID,costCenter).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|costCenterID|string|ID of the cost center.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "xp": null
}
```

## List Assignments

```js
OrderCloud.CostCenters.ListAssignments(costCenterID,userID,userGroupID,level,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|costCenterID|string|ID of the cost center.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
|level|string|Level of the cost center.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "CostCenterID": "…",
      "UserID": "…",
      "UserGroupID": "…"
    }
  ]
}
```

## Delete Assignment

```js
OrderCloud.CostCenters.DeleteAssignment(costCenterID,userID,userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|costCenterID|string|ID of the cost center.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
## Save Assignment

```js
OrderCloud.CostCenters.SaveAssignment(assignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "CostCenterID": "…",
  "UserID": "…",
  "UserGroupID": "…"
}
```

# ApprovalRules

```js
angular.module('orderCloud.sdk).factory(ApprovalRules, ApprovalRulesFactory)
```

Approval rules are used to verify the integrity of an order.  Common examples include orders requiring managerial approval, approval for orders that contain a specific product category, approval for quantity thresholds or approval for orders that exceed a specific price.  Properties are also available to control the triggers and timing for processing approvals whether parallel to another rule, or in succession of a previous rule.

## Get a Single Approval Rule

```js
OrderCloud.ApprovalRules.Get(approvalRuleID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|approvalRuleID|string|ID of the approval rule.|
### Response Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "ApprovingGroupID": "…",
  "RuleExpression": "…",
  "Scope": "PerOrder",
  "ScopeTimeUnit": null,
  "ScopeTimeNumber": null,
  "ScopeStartDate": null,
  "ExpireAfterTimeUnit": null,
  "ExpireAfterNumber": null,
  "ApproveOnExpire": false,
  "xp": null
}
```

## Get a List of Approval Rules

```js
OrderCloud.ApprovalRules.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Name": "…",
      "Description": "…",
      "ApprovingGroupID": "…",
      "RuleExpression": "…",
      "Scope": "PerOrder",
      "ScopeTimeUnit": null,
      "ScopeTimeNumber": null,
      "ScopeStartDate": null,
      "ExpireAfterTimeUnit": null,
      "ExpireAfterNumber": null,
      "ApproveOnExpire": false,
      "xp": null
    }
  ]
}
```

## Create New Approval Rule

```js
OrderCloud.ApprovalRules.Create(approvalRule).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "ApprovingGroupID": "…",
  "RuleExpression": "…",
  "Scope": "PerOrder",
  "ScopeTimeUnit": null,
  "ScopeTimeNumber": null,
  "ScopeStartDate": null,
  "ExpireAfterTimeUnit": null,
  "ExpireAfterNumber": null,
  "ApproveOnExpire": false,
  "xp": null
}
```

## Create or Update Approval Rule

```js
OrderCloud.ApprovalRules.Update(approvalRuleID,approvalRule).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|approvalRuleID|string|ID of the approval rule.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "ApprovingGroupID": "…",
  "RuleExpression": "…",
  "Scope": "PerOrder",
  "ScopeTimeUnit": null,
  "ScopeTimeNumber": null,
  "ScopeStartDate": null,
  "ExpireAfterTimeUnit": null,
  "ExpireAfterNumber": null,
  "ApproveOnExpire": false,
  "xp": null
}
```

## Delete Approval Rule

```js
OrderCloud.ApprovalRules.Delete(approvalRuleID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|approvalRuleID|string|ID of the approval rule.|
## Partially Update Approval Rule

```js
OrderCloud.ApprovalRules.Patch(approvalRuleID,partialApprovalRule).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|approvalRuleID|string|ID of the approval rule.|
### Request Body Sample

```json
{
  "ID": "…",
  "Name": "…",
  "Description": "…",
  "ApprovingGroupID": "…",
  "RuleExpression": "…",
  "Scope": "PerOrder",
  "ScopeTimeUnit": null,
  "ScopeTimeNumber": null,
  "ScopeStartDate": null,
  "ExpireAfterTimeUnit": null,
  "ExpireAfterNumber": null,
  "ApproveOnExpire": false,
  "xp": null
}
```

# CreditCards

```js
angular.module('orderCloud.sdk).factory(CreditCards, CreditCardsFactory)
```

Credit cards are used as a payment method for an order.  A user may have access to one or many credit cards for personal spend or group spending.
Credit Cards may be saved and assigned to members of an organization for use during purchase.

## Get a Single Credit Card

```js
OrderCloud.CreditCards.Get(creditCardID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|creditCardID|string|ID of the credit card.|
### Response Body Sample

```json
{
  "ID": "…",
  "Token": "…",
  "DateCreated": null,
  "CardType": "…",
  "PartialAccountNumber": "…",
  "CardholderName": "…",
  "ExpirationDate": null,
  "xp": null
}
```

## Get a List of Credit Cards

```js
OrderCloud.CreditCards.List(listArgs).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|search|string|Word or phrase to search for.|
|searchOn|string|Comma-delimited list of fields to search on.|
|sortBy|string|Comma-delimited list of fields to sort by.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
|filters||Any additional key/value pairs passed in the query string are interpretted as filters. Valid keys are top-level properties of the returned model or 'xp.???'|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "ID": "…",
      "Token": "…",
      "DateCreated": null,
      "CardType": "…",
      "PartialAccountNumber": "…",
      "CardholderName": "…",
      "ExpirationDate": null,
      "xp": null
    }
  ]
}
```

## Create New Credit Card

```js
OrderCloud.CreditCards.Create(card).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "ID": "…",
  "Token": "…",
  "CardType": "…",
  "PartialAccountNumber": "…",
  "CardholderName": "…",
  "ExpirationDate": null,
  "xp": null
}
```

## Create or Update Credit Card

```js
OrderCloud.CreditCards.Update(creditCardID,card).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|creditCardID|string|ID of the credit card.|
### Request Body Sample

```json
{
  "ID": "…",
  "Token": "…",
  "CardType": "…",
  "PartialAccountNumber": "…",
  "CardholderName": "…",
  "ExpirationDate": null,
  "xp": null
}
```

## Delete Credit Card

```js
OrderCloud.CreditCards.Delete(creditCardID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|creditCardID|string|ID of the credit card.|
## Partially Update Credit Card

```js
OrderCloud.CreditCards.Patch(creditCardID,card).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|creditCardID|string|ID of the credit card.|
### Request Body Sample

```json
{
  "ID": "…",
  "Token": "…",
  "CardType": "…",
  "PartialAccountNumber": "…",
  "CardholderName": "…",
  "ExpirationDate": null,
  "xp": null
}
```

## List Assignments

```js
OrderCloud.CreditCards.ListAssignments(creditCardID,userID,userGroupID,level,page,pageSize).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|creditCardID|string|ID of the credit card.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
|level|string|Level of the credit card.|
|page|integer|Page of results to return. Default: 1|
|pageSize|integer|Number of results to return per page. Default: 20, max: 100.|
### Response Body Sample

```json
{
  "Meta": {
    "Page": 1,
    "PageSize": 20,
    "TotalCount": 25,
    "TotalPages": 2,
    "ItemRange": [
      1,
      20
    ]
  },
  "Items": [
    {
      "CreditCardID": "…",
      "UserID": "…",
      "UserGroupID": "…"
    }
  ]
}
```

## Save Assignment

```js
OrderCloud.CreditCards.SaveAssignment(assignment).then(successFn).catch(errorFn);
```

### Request Body Sample

```json
{
  "CreditCardID": "…",
  "UserID": "…",
  "UserGroupID": "…"
}
```

## Delete Assignment

```js
OrderCloud.CreditCards.DeleteAssignment(creditCardID,userID,userGroupID).then(successFn).catch(errorFn);
```

### Parameters

| Name | Type | Description |
| -------------- | ----------- | --------------- |
|creditCardID|string|ID of the credit card.|
|userID|string|ID of the user.|
|userGroupID|string|ID of the user group.|
# Extending the OrderCloud Data Model

Many times, object(s) returned from the OrderCloud API require additional data points derived from the provided information in order to more easily and elegantly drive UI functionality. One simple example of this is to create a FullName property on User objects derived from the FirstName and LastName properties.
Similarly, another example would be to create a FullAddress property on an Address object by combining the AddressName, Street1, Street2, City, State, Zip, and Country properties. Additionally, functions can be extended onto data model objects in order to drive such AngularJS directives as ng-show, ng-if, etc.

When the $promise is returned from AngularJS' $resource factory, the OrderCloud-Angular-SDK will attempt to locate and inject an 'Extend' factory from your AngularJS application. If this factory exists and a method within the factory with the respective OrderCloud end point exists, you can proceed to extend the data model.
A list of available end points and a simple example are located below.

```js
angular.module('myApp', [])
.factory('Extend', extendFactory)

function extendFactory() {
    var service = {
        Users: _users
    };

    function _users(user) {
        user.FullName = user.FirstName + ' ' + user.LastName;
    }

    return service;
}
```

