import { makeAutoObservable } from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._isAdmin = false;
        this._user = {};
        this._product = {};
        this._dataAndTime = {};
        makeAutoObservable(this);
        
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }
    
    setIsAdmin(bool) {
        this._isAdmin = bool
    }

    setUser(user) {
        this._user = user;
    }

    setProduct(product) {
        this._product = product
    }

    setDataAndTime(dataAndTime) {
        this._dataAndTime = dataAndTime;
    }

    get isAuth() {
        return this._isAuth;
    }

    get isAdmin() {
        return this._isAdmin;
    }

    get user() {
        return this._user;
    }

    get product() {
        return this._product;
    }

    get dataAndTime() {
        return this._dataAndTime;
    }

    clearUser() {
        this._isAuth = false;
        this._isAdmin = false;
        this._user = {};
        this._dataAndTime = {};
    }

    clearProduct() {
        this._product = {};
    }
}