import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode"

export const backend_registration = async (fullName, birthday, position, login, password, role) => {
    const {data} = await $host.post("api/authorization/reg", {fullName, birthday, position, login, password, role});
    return data.token;
};

export const backend_login = async (login, password) => {
    const {data} = await $host.post("api/authorization/log", {login, password});
    return data.token;
};

export const backend_post_products = async (id, addData) => {
    const {data} = await $host.post("api/product", {id, addData});
    return data;
}

export const backend_post_shedules = async (id, addData) => {
    const {data} = await $host.post("api/shedule", {id, addData});
    return data;
}

export const backend_get_products = async () => {
    const {data} = await $host.get("api/product");
    return data;
}

export const backend_get_shedules = async () => {
    const {data} = await $host.get("api/shedule");
    return data;
}

export const backend_get_sold_products = async () => {
    const {data} = await $host.get("api/soldProduct");
    return data;
}

export const backend_get_user_shedules = async (id) => {
    const {data} = await $host.post("api/shedule/byId", {id});
    return data;
}

export const backend_update_products = async (id, updatedData) => {
    const {data} = await $host.post("api/product/update", {id, updatedData});
    return data;
}

export const backend_update_shedules = async (id, updatedData) => {
    const {data} = await $host.post("api/shedule/update", {id, updatedData});
    return data;
}

export const backend_sell_products = async (idProduct, idEmployee) => {
    const {data} = await $host.post("api/product/sell", {idProduct, idEmployee});
    return data;
}

export const backend_delete_products = async (id) => {
    const {data} = await $host.post("api/product/del", {id});
    return data;
}

export const backend_delete_shedules = async (id) => {
    const {data} = await $host.post("api/shedule/del", {id});
    return data;
}

export const backend_check = async () => {
    const response = $host.post("api/authorization/auth", {});
    return response;
};

export const backend_user_info = async (id) => {
    const response = $authHost.post("api/authorization/info", {id});
    return response;
};

export const backend_update_img = async (id, img) => {
    const response = $authHost.post("api/authorization/setImg", {id, img});
    return response;
};

