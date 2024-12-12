import { makeAutoObservable } from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false;
        this._isAdmin = false;
        this._user = {};
        this._product = {};
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

    clearUser() {
        this._isAuth = false;
        this._isAdmin = false;
        this._user = {};
    }

    clearProduct() {
        this._product = {};
    }
}