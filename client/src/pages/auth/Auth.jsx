import React, { useContext, useState } from "react";
import {jwtDecode} from "jwt-decode";
import { backend_get_products, backend_login, backend_registration } from "../../http/userApi";
import { useNavigate, useLocation } from "react-router-dom";
import { AUTORIZATION_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE } from "../../utils/consts";
import { observer } from "mobx-react";
import { Context } from "../..";
import { toJS } from "mobx";

const userRoles = {
    "user": "Employee",
    "admin": "Admin"
}

const userPositions = {
    "Programmer": 40000,
    "Saller": 20000
}

const Auth = observer(() => {
    const location = useLocation();
    const LoginPage = location.pathname === AUTORIZATION_ROUTE;
    const navigate = useNavigate();

    // const [name, setName] = useState("");
    // const [surname, setSurname] = useState("");
    // const [mail, setMail] = useState("");
    const [fullName, setFullName] = useState("");
    const [birthday, setBirthday] = useState("");
    const [position, setPosition] = useState("");
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const { user } = useContext(Context);

    const role = userRoles["user"];
    // const salary = userPositions["Programmer"];

    const click = async (e) => {
        e.preventDefault();
        try {
            let data;
            if (LoginPage) {
                data = await backend_login(login, password, role);
            } else {
                data = await backend_registration(fullName, birthday, position, login, password, role);
            }
            
            user.setUser(data);
            user.setIsAuth(true);

            // data = await backend_get_products();
            // user.setProduct(data);
            
            // console.log("Все продукты - ", toJS(user.product));

            const userData = toJS(user.user);
            console.log("Данные пользователя -", jwtDecode(userData));

            localStorage.setItem("token", JSON.stringify({token: userData}));
            
            // const testToken = localStorage.getItem("token");
            // console.log("token -", testToken);

            navigate(MAIN_ROUTE);
        } catch (e) {
            console.error(e);
            if (e.response && e.response.data && e.response.data.message) {
                alert(e.response.data.message);
            } else {
                console.log(e);
                alert("Произошла непредвиденная ошибка при передаче данных.");
            }
        }
    };

    return (
        <div>
            {LoginPage ? (
                <div>
                    <div className="auth">
                        <form className="auth__form">
                            <input type="text" className="auth__form__input" placeholder="Введите логин" value={login} onChange={e => setLogin(e.target.value)} />
                            <input type="password" className="auth__form__input" placeholder="Введите пароль" value={password} onChange={e => setPassword(e.target.value)} />
                            <p className="auth__form__reg-text">Или <a class="auth__form__reg-link m-left-0" onClick={() => { navigate(REGISTRATION_ROUTE); }}>Зарегистрируйтесь</a></p>
                            <button className="btn auth-btn" onClick={click}>Войти</button>
                        </form>
                    </div>
                </div>

            ) : (
                
                <div className="reg">
                    <form id="registration" className="reg__form">
                        <input type="text" className="reg__form__input" placeholder="Введите ФИО" value={fullName} onChange={e => setFullName(e.target.value)} />
                        <input type="date" className="reg__form__input" placeholder="Введите дату рождения" value={birthday} onChange={e => setBirthday(e.target.value)} />
                        <input type="text" className="reg__form__input" placeholder="Введите вашу должность" value={position} onChange={e => setPosition(e.target.value)} />
                        <input type="text" className="reg__form__input" placeholder="Введите логин" value={login} onChange={e => setLogin(e.target.value)} />
                        <input type="password" className="reg__form__input" placeholder="Введите пароль" value={password} onChange={e => setPassword(e.target.value)} />
                        <p className="reg__form__auth-text">Или <a class="reg__form__auth-link m-left-0" onClick={() => { navigate(AUTORIZATION_ROUTE); }}>Войдите</a> в свой аккаунт</p>
                        <button className="btn reg-btn" onClick={click}>Готово</button>
                    </form>
                </div>
            )}
        </div>
    );
});

export default Auth;