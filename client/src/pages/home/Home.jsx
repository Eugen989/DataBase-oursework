import React, { useContext, useEffect, useState } from "react";
import { Context } from "../..";
import { jwtDecode } from "jwt-decode";
import { toJS } from "mobx";
import jewleryPhoto from "../../components/media/jewelryPhoto.jpg";
import { useNavigate } from "react-router-dom";
import { REGISTRATION_ROUTE, RESERVATION_ROUTE } from "../../utils/consts";

function Home() {

    const navigate = useNavigate();

    function output() {
        let token = JSON.parse(localStorage.getItem("token"));
        console.log(token);
    }

    const {user} = useContext(Context);

    const userData = toJS(user.user);
    // console.log("Данные пользователя -", ( userData && userData.data ? jwtDecode(userData.data.token) : "нет") );
    // console.log("Токен пользователя -", ( userData && userData.data ? userData.data.token : "нет") );
    console.log("userData - ", userData);
    try {
        console.log("Распаршеный токен пользователя -", (jwtDecode(userData.data.token)));
    } catch(e) {
        console.log("Распаршеный токен пользователя - данных нет");
    }
    useEffect(() => {
        console.log("Авторизован - ", user.isAuth);

    }, [])
    
    

    return (
        <div>
            <section class="lending">
            <a onClick={ () => { navigate(RESERVATION_ROUTE) } }>
                <div class="lending__img-container">
                    <img src={jewleryPhoto} alt="" href=""/>
                </div>
            </a>

            <div class="lending__text-block">
                <h2 class="title-text m-bottom-107">Покупайте бижутерию только<br />
                    в нашем ювелирном магазине</h2>

                <p class="lending__text-block__description m-bottom-60">В нашем магазине только лучшие товары, высокопробные металлы, и не только.
                    У нас только опытный персонал, 
                    который быстро найдет украшение подходящее именно вам! </p>

                {user.isAuth ? (
                    <div>
                        <p class="lending__text-block__description m-bottom-60">Вы зарегестрированы</p>
                    </div>
                ) : (
                <div>
                    <a class="btn" onClick={ () => { navigate(REGISTRATION_ROUTE) } }>Зарегестрироваться</a>
                </div>)}
            </div>
        </section>
        </div>
    )
}

export default Home;