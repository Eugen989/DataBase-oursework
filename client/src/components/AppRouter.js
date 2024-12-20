import React, { useContext } from "react";
import {Route, Redirect, Routes} from "react-router-dom";
import { authRoutes, publicRoutes } from "../routes";
import { Context } from "../index";
import { jwtDecode } from "jwt-decode";

function AppRouter() {
    const {user} = useContext(Context);
    return (
        <div>
            <Routes>
                {/* {jwtDecode(user)} */}
                {user.isAuth && authRoutes.map(({path, Component}) => 
                    <Route key={ path } path={ path } Component={ Component }/>
                )}
                {publicRoutes.map(({path, Component}) => 
                    <Route key={ path } path={ path } Component={ Component }/>
                )}
            </Routes>
        </div>
    )
}

export default AppRouter;