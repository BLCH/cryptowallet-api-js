// Copyright [2018] [Sushenkov Andrey]
// http://www.apache.org/licenses/LICENSE-2.0

import axios from '../node_modules/axios/index'

export default class APIManager {
    constructor(baseURL, language, projectId){
        this.projectId = projectId;
        this.axiosInstance = axios.create({
            baseURL: baseURL,
            headers: {
                'accept': 'application/json',
                'Content-Type':  'application/json',
                'Accept-Language': language,
            }
        })
    }

    /**
     * @description Set token in header Authorization for axiosInstance
     * @param {string} token
     */
    setToken(token){
        this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
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

            let response = await this.axiosInstance.post('/auth/base-login', data);

            this.setToken(response.data.token);

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

            let response = await this.axiosInstance.post('/auth/register', formData);

            this.setToken(response.data.token);

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
            const data = { email, project: this.projectId };

            let response = await this.axiosInstance.post('/auth/forgot/step-one', data);

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
            const data = { code, password };

            let response = await this.axiosInstance.post('/auth/forgot/step-two', data);

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
            const response = await this.axiosInstance.get(`/user/all-state`);
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
            await this.axiosInstance.post('/wallet/generate', {walletAccountId});

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
            await this.axiosInstance.post('/wallet/open-or-close', {accountTypeId});

            return true;

        } catch (e) {

            console.warn(e.response);

            return false;
        }
    };

    /**
     * @description Sending user data and get SMS code for verification
     * @param {string} name - user name
     * @param {string} phone - user phone number
     * @return {Promise<boolean>}
     */
    verifyPhoneNumberStepOne = async (name, phone) => {
        try {
            const data = { name, phone };

            const response = await this.axiosInstance.post('/account/phone-validate/step-one', data);

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
            await this.axiosInstance.post('/account/phone-validate/step-two', {code: code});

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

            await this.axiosInstance.post('/account/push', data);

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
            await this.axiosInstance.post('/account/update-phones', {phones: phones});

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

            const response = await this.axiosInstance.post('/wallet/send/step-one', data);

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
            let data = { sendMoneyId, commission };

            await this.axiosInstance.post('/wallet/send/step-two', data);

            return true;

        } catch (e) {

            console.warn(e.response);

            return false
        }
    };
}
