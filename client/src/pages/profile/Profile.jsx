// Profile.jsx
import React, { useContext } from "react";
import { useState, useEffect } from 'react';
import { Context } from "../..";
import {jwtDecode} from "jwt-decode";
import { backend_user_info } from "../../http/userApi";
import { MAIN_ROUTE } from "../../utils/consts";

function Profile() {
    const [userData, setUserData] = useState(false);
    const { user } = useContext(Context);

    useEffect(() => {
        userInfo();
    }, []);

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
                        <p> Ваша должность - {userData.position}</p>
                        <p> Ваша роль - {userData.role}</p>
                        {/* <button onClick={ exit }> Выйти </button> */}
                    </div> 
                </div>            

                <div class="profile__promotions-container">
                    <h2 class="profile__promotions-container__description">Ваши акции и бонусы:</h2>

                    <div class="profile__promotions-container__promotions">
                        <div class="profile__promotions-container__promotions__promotion">
                            <div class="profile__promotions-container__promotions__promotion__img-container">
                                <p>Картинка акции или бонуса</p>
                            </div>

                            <div class="profile__promotions-container__promotions__promotion__description-block">
                                <p class="profile__promotions-container__promotions__promotion__description-block__text">Описание акции</p>
                            </div>
                        </div>
                    </div>

                    <div class="profile__promotions-container__promotions">
                        <div class="profile__promotions-container__promotions__promotion">
                            <div class="profile__promotions-container__promotions__promotion__img-container">
                                <p>Картинка акции или бонуса</p>
                            </div>

                            <div class="profile__promotions-container__promotions__promotion__description-block">
                                <p class="profile__promotions-container__promotions__promotion__description-block__text">Описание акции</p>
                            </div>
                        </div>
                    </div>

                    <a href="" class="watchmore-link">Смотреть ещё</a>
                </div>

                <div class="profile__user-info__text-info">
                    <p>{userData.login}</p>
                    <p>{userData.fullName}</p>
                    <button onClick={ exit }> Выйти </button>
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
