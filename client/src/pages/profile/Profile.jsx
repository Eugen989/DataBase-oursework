import React, { useContext } from "react";
import { useState, useEffect } from 'react';
import { Context } from "../..";
import {jwtDecode} from "jwt-decode";
import { backend_get_products, backend_get_sold_products, backend_user_info } from "../../http/userApi";
import { ADMIN_ROUTE, MAIN_ROUTE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";
import { toJS } from "mobx";

function Profile() {
    const { user } = useContext(Context);

    const [userData, setUserData] = useState(false);

    const [soldProducts, setSoldProducts] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        userInfo();
        loadProducts();
    }, []);

    const loadProducts = async () => {
        let soldData = await backend_get_sold_products();
        let productData = await backend_get_products();

        console.log("soldData -", soldData);
        console.log("productData -", productData);

        for (let i = 0; i < soldData.length; i++) {
            if (soldData[i].employeeId == userData.id) {
                soldData.splice(i, 1);
                i--;
            } else {
                for (let j = 0; j < productData.length; j++) {
                    if (soldData[i].productId == productData[j].productId) {
                        soldData[i].brand = productData[j].brand;
                        soldData[i].metal = productData[j].metal;
                        soldData[i].timeAndDate = productData[j].timeAndDate;
                    }
                }
            }
        }
            

        user.setProduct(soldData);

        console.log("new soldData -", soldProducts);

    }

    const userInfo = async () => {
        if (user) {
            try {
                // console.log(user.user);
                const decodeToken = jwtDecode(user.user);
                console.log("Токен -", decodeToken);

                // const data = await backend_user_info(decodeToken.id);
                // console.log(jwtDecode(data.data));
                setUserData(decodeToken);
                console.log("userData from profile - ", userData);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }
    };

    const exit = async () => {
        localStorage.setItem("token", "");
        user.clearUser();
        window.location.href = MAIN_ROUTE;
    }

    return (
        <div>
        {userData ? (
            <section class="profile">
                <div class="profile__user-info">
                    <div class="img-container">
                        <img src="../../..public/media/user.png" alt="" />
                    </div>

                    <div class="profile__user-info__text-info">
                        <p> Ваша должность: {userData.position}</p>
                        <p> Ваша роль: {userData.role}</p>
                        {userData.role == "Admin" ? (
                            <button className="btn" onClick={() => navigate(ADMIN_ROUTE)}>Админка</button>
                        ) : (
                            <div></div>
                        )}
                        {/* <button onClick={ exit }> Выйти </button> */}
                    </div> 
                </div>            

                <div class="profile__promotions-container">
                    <h2 class="profile__promotions-container__description">Ваши продажи:</h2>

                    
                    {user.product && user.product.length != 0 && Array.isArray(toJS(user.product)) && toJS(user.product).map(item => (
                        <div class="profile__promotions-container__promotions">
                            <div class="profile__promotions-container__promotions__promotion">
                                <div class="profile__promotions-container__promotions__promotion__img-container">
                                    <p>Дата: {item.timeAndDate ? item.timeAndDate.slice(0, 10) : "Дата не указана"}</p>
                                    <p>Id товара: {item.productId}</p>
                                </div>

                                <div class="profile__promotions-container__promotions__promotion__description-block">
                                    <div class="profile__promotions-container__promotions__promotion__description-block__text">
                                        <h5>Проданный товар</h5>
                                        <p>Тип: {item.brand}</p>
                                        <p>Материал: {item.metal}</p>
                                        <p>Стоимость: {item.cost}</p>
                                        <p>Скидка: {item.discount}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* <a href="" class="watchmore-link">Смотреть ещё</a> */}
                </div>

                <div class="profile__user-info__text-info">
                    <p>{userData.login}</p>
                    <p>{userData.fullName}</p>
                    <button className="btn" onClick={ exit }> Выйти </button>
                </div> 

            </section>
        ) : (
            <div>
                <h2>Вы ещё не зарегестрированы</h2>
            </div>
        )}

        </div>
    );
}

export default Profile;
