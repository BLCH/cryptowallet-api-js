# crypto-wallet-api

## Installing

* You can install _crypto-wallet-api_ package with npm command in terminal

1. ```npm install --save https://github.com/BLCH/cryptowallet-api-js```
or 

2. add dependence 
```"crypto-wallet-api": "git+https://github.com/BLCH/cryptowallet-api-js.git",```
in your package.json file in _dependencies_:
``` 
"dependencies": {
    ...     
     "crypto-wallet-api": "git+https://github.com/BLCH/cryptowallet-api-js.git",
     ...
```
## Usage

Import the api in your file from the package. Example:
+ `var APIManager = require('crypto-wallet-api')`<br/>
  or
+ `import APIManager from 'crypto-wallet-api'`
  
Create the instance of APIManager class:

```export const apiManager = new APIManager(baseURL, language, projectId);```
or define a global variable `var apiManager = new APIManager(baseURL, language, projectId);`

Define 3 variables for the parameters of the class constructor:

+ _baseURL_ - url of server. Now `https://gate.coin-charger.com/api/v1`
+ _language_ - is string in format `ru_RU` or `ru-RU`
+ _projectId_ - id of project which you received

After that you can use instance methods like this _apiManager.login(yourEmail, yourPassword)_

## Instance methods

```     
/**
* @description Set token in header Authorization for axiosInstance
* @param {string} token
*/
setToken(token)

/**
* @description Getting token of session if query is success
* @param {string} email Email of user
* @param {string} password
* @return {Promise<object>}
*/
login(email, password)

/**
* @description User registration and getting token of session if query is success
* @param {string} email
* @param {string} password
* @return {Promise<object>}
*/
register(email, password)

/**
* @description Get code for verification by SMS
* @param {string} email
* @returns {Promise<boolean>}
*/
recoveryPasswordStepOne(email)

/**
* @description Sending code from SMS and new password for user account
* @param {string} code - from sms phone
* @param {string} password
* @returns {Promise<boolean>}
*/
recoveryPasswordStepTwo(code, password)

/**
* @description clear token in instance
* @returns {Promise<boolean>}
*/
logOut();

/**
* @description Get All State of user data
* @returns {Promise<object>}
*/
getAllState();

/**
* @description Generate new Wallet Address for exist wallet
* @param walletAccountId
* @returns {Promise<Boolean>}
*/
generateNewWalletAddress(walletAccountId)

/**
* @description Do active or inactive wallet
* @param {string} accountTypeId id of wallet
* @returns {Promise<boolean>}
*/
openOrCloseWallet(accountTypeId)


/**
* @description Sending user data and get SMS code for verification
* @param {string} name - user name
* @param {string} phone - user phone number
* @return {Promise<boolean>}
*/
verifyPhoneNumberStepOne(name, phone)

/**
* @description Send verify code
* @param {string} code
* @returns {Promise<boolean>}
*/
verifyPhoneNumberStepTwo(code)

/**
* @description Send data for push notification
* @param {string} type
* @param {string} device_id
* @param {string} token
* @param {string} model
* @param {string} os
* @param {string} os_version
* @return {Promise<boolean>}
*/
subscribeOnPushNotifications(type, device_id, token, model, os, os_version)

/**
* @description Send array of phones number
* @param phones [ { "name": "Test" "number": "7912312312" } ]
* @return {Promise<boolean>}
*/
updatePhonesContacts(phones)

/**
* @description Send first data for transfer tokens
* @param accountId - user account id (from getAllState.account.user.id)
* @param by - wallet address of sender
* @param amount - amount of tokens
* @param address - wallet address of recipient
* @return {Promise<boolean>}
*/
sendTokensStepOne(accountId, by, amount, address);

/**
* @description Send last data for transfer tokens
* @param sendMoneyId - id from response of sendTokensStepOne
* @param commission - array of commissions
* @return {Promise<boolean>}
*/
sendTokensStepTwo(sendMoneyId, commission)
```





