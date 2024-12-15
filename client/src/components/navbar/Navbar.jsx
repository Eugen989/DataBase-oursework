import "./../styles/style.css"
import { useState, useEffect, useContext } from "react";

// import Logo from "./../media/";
import ImgLogo from "./../media/Logo.png";
import ImgRestaurantSymbol from "./../media/restaurant-symbol.png";
import ImgLock from "./../media/lock.png";
import ImgProfile from "./../media/profile.png";
import { Context } from "../..";
import { useNavigate, useLocation } from "react-router-dom";
import { MAIN_ROUTE, AUTH_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, PROFILE_ROUTE, PRODUCT_LIST_ROUTE, ADMIN_ROUTE } from "../../utils/consts";
import { toJS } from "mobx";
import { jwtDecode } from "jwt-decode";

function Navbar() {
    const location = useLocation();
    const [checkAuth, setCheckAuth] = useState();
    const {user} = useContext(Context);
    const navigate = useNavigate();

    // console.log("Данные пользователя в navbar -", user.user.data.token);

    useEffect(() => {
        if(user && user.user) {
            console.log("Navbar -", user.user);
            // jwtDecode(user.user)
            // console.log("Navbar -", jwtDecode(user.user));
        }
        // if(localStorage.getItem("TestData"))
        //     setCheckAuth(JSON.parse(localStorage.getItem("TestData")).text);
    }, []);

    function renderAdminbtn() {
        let typeRole = null;
        if(user && user.user) typeRole = jwtDecode(user.user).role;
        console.log("Navbar role -", typeRole);
        return (
            <div></div>
        )
    }

    return (
        <div>
            <header className="navbar_container">
                <a class="logo-link m-left-26" onClick={() => { navigate(MAIN_ROUTE); }} >
                    <img src={ImgLogo} />
                </a>

                <nav class="navbar">
                    {/* <renderAdminbtn /> */}
                    {/* <div class="navbar__item">
                        <a class={location.pathname === ADMIN_ROUTE ? "navbar__item__link chosen-link" : "navbar__item__link"} onClick={() => { navigate(ADMIN_ROUTE) }}>Админка</a>
                    </div> */}
                    <div class="navbar__item">
                        <a class={location.pathname === PRODUCT_LIST_ROUTE ? "navbar__item__link chosen-link" : "navbar__item__link"} onClick={() => { navigate(PRODUCT_LIST_ROUTE) }}>Товары</a>
                    </div>

                    <div class="navbar__item">
                        <a  class="navbar__item__img-link" onClick={() => { navigate(user.isAuth ? PROFILE_ROUTE : LOGIN_ROUTE); }}>
                            <img src={ImgProfile} alt="" />
                        </a>

                        <a class={location.pathname === AUTH_ROUTE || location.pathname === LOGIN_ROUTE || location.pathname === PROFILE_ROUTE || location.pathname === REGISTRATION_ROUTE ? "navbar__item__link chosen-link" : "navbar__item__link"} onClick={() => { navigate(user.isAuth ? PROFILE_ROUTE : LOGIN_ROUTE); }} > {user.isAuth ? "Профиль" : "Войти" }</a>
                    </div>
                </nav>
            </header>
        </div>
    )
}

export default Navbar;