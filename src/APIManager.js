// Copyright [2018] [Sushenkov Andrey]
// http://www.apache.org/licenses/LICENSE-2.0

import axios from '../node_modules/axios/index'

export default class APIManager {
    constructor(baseURL, language, projectId){
        this.baseURL = baseURL;
        this.contentType = 'application/json';
        this.language = language;
        this.token = '';
        this.projectId = projectId;
    }

    /**
     * @description Default data in headers in querys of API methods
     * @return {{headers: {accept: string, "Content-Type": string, "Accept-Language": string, Authorization: string}}}
     */
    setDefaultHeaders = () => {
        return {
            headers: {
                'accept': `${this.contentType}`,
                'Content-Type':  `${this.contentType}`,
                'Accept-Language': `${this.language}`,
                'Authorization': `Bearer ${this.token}`
            }}
    };

    /**
     * @description Set token as property of APIManager object
     * @param {string} token
     */
    setToken(token){
        this.token = token;
    }

    /**
     * @description Getting token of session if query is success
     * @param {string} email Email of user
     * @param {string} password
     * @return {Promise<object>}
     */
    login = async (email, password) => {
        try {
            const data = { email, password, project: this.projectId };

            let response = await axios.post(
              `${this.baseURL}/api/v1/auth/base-login`,
              data,
              this.setDefaultHeaders());

            this.token  = response.data.token;

            return response;

        } catch (e) {

            console.warn(e.response);

            return e.response;
        }
    };


    /**
     * @description User registration and getting token of session if query is success
     * @param {string} email
     * @param {string} password
     * @return {Promise<*>}
     */
    register = async (email, password) => {
        try {
            const formData = { email, password, project: this.projectId };

            let response = await axios.post(
              `${this.baseURL}/api/v1/auth/register`,
              formData,
              this.setDefaultHeaders());

            this.token  = response.data.token;

            return response;

        } catch (e) {

            console.warn(e.response);

            return e.response;
        }
    };

    /**
     * @description Get code for verification by SMS
     * @param {string} email
     * @returns {Promise<boolean>}
     */
    recoveryPasswordStepOne = async (email) => {
        try {
            const data = { email: email, project: this.projectId };

            let response = await axios.post(
              `${this.baseURL}/api/v1/auth/forgot/step-one`,
              data,
              this.setDefaultHeaders());

            return response;
            // return true; // поменять в проде

        } catch (e) {

            console.warn(e.response);

            return e.response;
        }
    };

    /**
     * @description Sending code from SMS and new password for user account
     * @param {string} code - from sms phone
     * @param {string} password
     * @returns {Promise<boolean>}
     */
    recoveryPasswordStepTwo = async (code, password) => {
        try {
            const formData = { code: code, password: password };

            let response = await axios.post(
              `${this.baseURL}/api/v1/auth/forgot/step-two`,
              formData,
              this.setDefaultHeaders());

            return response.status;

        } catch (e) {

            console.warn(e.response);

            return e.response.status;
        }
    };

    /**
     * @description LogOut user
     * @returns {Promise<boolean>}
     */
    logOut = async () => {
        try {
            this.setToken('');
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    };

    /**
     * @description Get All State of user data
     * @returns {Promise<object>}
     */
    getAllState = async () => {
        try {

            const response = await axios.get(
              `${this.baseURL}/api/v1/user/all-state`,
              this.setDefaultHeaders());
            // console.log(response.data);
            return response.data;

        } catch (e) {

            console.warn(e.response);

            return false;
        }
    };

    /**
     * @description Generate new Wallet Address for exist wallet
     * @param walletAccountId
     * @returns {Promise<Boolean>}
     */
    generateNewWalletAddress = async (walletAccountId) => {
        try {

            await axios.post(
              `${this.baseURL}/api/v1/wallet/generate`,
              {walletAccountId: walletAccountId},
              this.setDefaultHeaders());

            return true;

        } catch (e) {

            console.warn(e.response);

            return false;
        }
    };

    /**
     * @description Do active or inactive wallet
     * @param {string} accountTypeId id of wallet
     * @returns {Promise<boolean>}
     */
    openOrCloseWallet = async (accountTypeId) => {
        try {

            await axios.post(
              `${this.baseURL}/api/v1/wallet/open-or-close`,
              {accountTypeId},
              this.setDefaultHeaders());

            return true;

        } catch (e) {

            console.warn(e.response);

            return false;
        }
    };

    /**
     * @description Sending user data and get SMS code for verification
     * @param {string} number - phone number
     * @param {string} name - user name
     * @return {Promise<boolean>}
     */
    verifyPhoneNumberStepOne = async (name, number) => {
        try {
            const data = {name: name, phone: number};

            const response = await axios.post(
              `${this.baseURL}/api/v1/account/phone-validate/step-one`,
              data,
              this.setDefaultHeaders());

            return response; // Пока для тестов отправляем код

            // return true // раскомментировать в прод

        } catch (e) {

            console.warn(e.response);

            return false;

        }
    };

    /**
     * @description Send verify code
     * @param {string} code
     * @returns {Promise<boolean>}
     */
    verifyPhoneNumberStepTwo = async (code) => {
        try {
            await axios.post(
              `${this.baseURL}/api/v1/account/phone-validate/step-two`,
              {code: code},
              this.setDefaultHeaders());

            return true;

        } catch (e) {

            console.warn(e.response);

            return false;
        }
    };

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
    subscribeOnPushNotifications = async (type, device_id, token, model, os, os_version) => {
        try {
            let data = { type, device_id, token, model, os, os_version };
            await axios.post(
              `${this.baseURL}/api/v1/account/push`,
              data,
              this.setDefaultHeaders());

            return true;

        } catch (e) {

            console.warn(e.response);

            return false;
        }
    };

    /**
     * @description Send array of phones number
     * @param phones [ { "name": "Test" "number": "7912312312" } ]
     * @return {Promise<boolean>}
     */
     updatePhonesContacts = async (phones) => {
         try {

             await axios.post(
               `${this.baseURL}/api/v1/account/update-phones`,
               {phones: phones},
               this.setDefaultHeaders());

             return true;

         } catch (e) {

             console.warn(e.response);

             return false;
         }
    };

    /**
     * @description Send first data for transfer tokens
     * @param accountId - user account id (from getAllState.account.user.id)
     * @param by - wallet address of sender
     * @param amount - amount of tokens
     * @param address - wallet address of recipient
     * @return {Promise<boolean>}
     */
    sendTokensStepOne = async (accountId, by, amount, address) => {
        try {

            let data = { accountId, by, amount, address };

            const response = await axios.post(
              `${this.baseURL}/api/v1/wallet/send/step-one`,
              data,
              this.setDefaultHeaders());

            return response.data;

        } catch (e) {

            console.warn(e.response);

            return false;
        }
    };

    /**
     * @description Send last data for transfer tokens
     * @param sendMoneyId - id from response of sendTokensStepOne
     * @param commission - array of commissions
     * @return {Promise<boolean>}
     */
    sendTokensStepTwo = async (sendMoneyId, commission) => {
        try {

            await axios.post(
              `${this.baseURL}/api/v1/wallet/send/step-two`,
              {sendMoneyId, commission},
              this.setDefaultHeaders());

            return true;

        } catch (e) {

            console.warn(e.response);

            return false
        }
    };
}
