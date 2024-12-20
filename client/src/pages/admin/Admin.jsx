import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Context } from "../..";
import {jwtDecode} from "jwt-decode"; // исправленный импорт
import { toJS } from "mobx";
import { backend_delete_products, backend_get_products, backend_post_products, backend_update_products, backend_get_shedules, backend_get_user_shedules, backend_update_shedules, backend_post_shedules, backend_delete_shedules } from "../../http/userApi";
import { ADMIN_ROUTE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

function Admin() {
    const navigate = useNavigate();

    const [checkAdmin, setCheckAdmin] = useState();
    const [serverData, setServerData] = useState();
    const [newServerData, setNewServerData] = useState();
    const [files, setFiles] = useState();

    const [productId, setProductId] = useState();
    const [brand, setBrand] = useState();
    const [metal, setMetal] = useState();
    const [probe, setProbe] = useState();
    const [weight, setWeight] = useState();
    const [productSize, setProductSize] = useState();
    const [cost, setCost] = useState();
    const [type, setType] = useState();
    const [gemSize, setGemSize] = useState();
    const [purity, setPurity] = useState();

    const [shedules, setShedules] = useState();
    const [sheduleId, setSheduleId] = useState();
    const [sheduleData, setSheduleData] = useState();
    const [sheduleWorkStart, setSheduleWorkStart] = useState();
    const [sheduleWorkEnd, setSheduleWorkEnd] = useState();
    const [sheduleEmployeeId, setSheduleEmployeeId] = useState();

    const [flagUpdate, setFlagUpdate] = useState();
    
    const { user } = useContext(Context);

    const loadProducts = async () => {
        let data = await backend_get_products();
        user.setProduct(data);
    }

    const loadShedules = async () => {
        let data = await backend_get_shedules();
        setShedules(data);
        // console.log(shedules);
        // console.log("loadShedules -", shedules);
        // user.setDataAndTime(data);
    }

    useEffect(() => {
        // console.log("Контекст пользователя:", user);
        setFlagUpdate(false);
        loadProducts();
        loadShedules();
        // setShedules

        if (user) {
            const token = user.user;
            console.log("Токен:", token);

            let decodedToken;
            let decodedProductToken;
            try {
                decodedToken = jwtDecode(token);
                console.log("Декодированный токен админа:", decodedToken);
                setCheckAdmin(decodedToken.role);
                console.log("checkAdmin -",checkAdmin);
                console.log("Все продукты - ", toJS(user.product));
            } catch (error) {
                console.error("Ошибка декодирования токена админа:", error);
            }

            try {
                console.log(toJS(user.product));
                // decodedProductToken = jwtDecode(product);
            } catch (error) {
                console.error("Ошибка декодирования токена продукта:", error);
            }
        } else {
            console.log("Токен пользователя не определён");
        }

        // axios.get("http://localhost:5000/api/user")
        //     .then((response) => {
        //         setServerData(response.data);
        //         console.log("Данные с сервера:", response.data);
        //     })
        //     .catch(error => {
        //         console.error("Ошибка при получении данных с сервера:", error);
        //     });

        // const storedData = localStorage.getItem("TestData");
        // if (storedData) {
        //     setCheckAdmin(JSON.parse(storedData).text);
        // }
    }, [user]);

    const btnAddProduct = async (e) => {
        e.preventDefault();
        try {
            let addData = {
                brand,
                metal,
                probe,
                weight,
                productSize,
                cost,
                type,
                gemSize,
                purity
            }
            let data = await backend_post_products(productId, addData);
            await loadProducts();
            navigate(ADMIN_ROUTE);
        } catch (error) {
            console.error(error);
            alert("Не получилось добавить данные продукта.");
        }
    }

    const btnAddShedule = async (e) => {
        e.preventDefault();
        try {
            let addData = {
                employeeId: sheduleEmployeeId,
                data: sheduleData,
                workStart: sheduleWorkStart,
                workEnd: sheduleWorkEnd
            }
            let data = await backend_post_shedules(sheduleId, addData);
            console.log(data);
            await loadShedules();
            navigate(ADMIN_ROUTE);
        } catch (error) {
            console.error(error);
            alert("Не получилось добавить данные продукта.");
        }
    }

    const btnDeleteProduct = async (id) => {
        await backend_delete_products(id);
        await loadProducts();
        navigate(ADMIN_ROUTE);
    }

    const btnDeleteShedule = async (id) => {
        await backend_delete_shedules(id);
        await loadShedules();
        navigate(ADMIN_ROUTE);
    }

    const btnUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            let updateData = {
                brand,
                metal,
                probe,
                weight,
                productSize,
                cost,
                type,
                gemSize,
                purity
            }
            // console.log("update data - ", updateData);
            // console.log("Id data - ", productId);
            let data = await backend_get_user_shedules(productId, updateData);
            await loadProducts();
            navigate(ADMIN_ROUTE);
        } catch (error) {
            console.log(e);
            alert("Не получилось обновить данные.");
        }
    }

    const btnUpdateShedule = async (e) => {
        e.preventDefault();
        try {
            let updateData = {
                employeeId: sheduleEmployeeId,
                data: sheduleData,
                workStart: sheduleWorkStart,
                workEnd: sheduleWorkEnd
            }

            // console.log("update shedule data - ", updateData);
            // console.log("Id shedule data - ", sheduleId);

            await backend_update_shedules(sheduleId, updateData);
            await loadShedules();
            navigate(ADMIN_ROUTE);
        } catch (error) {
            console.error(error);
            alert("Не получилось добавить данные расписания.");
        }
    }

    function input() {
        localStorage.setItem("TestData", JSON.stringify({ text: "Admin" }));
        console.log("Тестовые данные записаны");
    }

    function output() {
        if (serverData && serverData.length > 0) {
            console.log("Данные сервера:", serverData[0]["name"]);
        } else {
            console.log("Нет данных для отображения");
        }
    }

    function exit() {
        console.log("Тестовые данные удалены");
        localStorage.removeItem("TestData");
        setCheckAdmin(null);
    }

    const selectFile = (e) => {
        console.log(e.target.files);
        setFiles(e.target.files[0]);
    }

    const fillingUpdateForm = (item) => {
        setProductId(item.productId)
        setBrand(item.brand)
        setMetal(item.metal);
        setProbe(item.probe);
        setWeight(item.weight);
        setProductSize(item.productSize);
        setCost(item.cost);
        setType(item.type);
        setGemSize(item.gemSize);
        setPurity(item.purity);
    }

    const fillingSheduleUpdateForm = (item) => {
        setSheduleId(item.id);
        setSheduleData(item.data);
        setSheduleWorkStart(item.workStart);
        setSheduleWorkEnd(item.workEnd);
        setSheduleEmployeeId(item.employeeId);
    }



    return (
        <div>
            { checkAdmin == "Admin" ? (
                <div>
                    <h1 className="admin_title"> Админка </h1>

                    <div className="admin_container">

                        {/* <button onClick={input}> Войти </button>
                        <button onClick={output}> Вывести </button>
                        <button onClick={exit}> Выйти </button>
                        <input type="file" onChange={selectFile}></input>
                        <button>Отправить данные</button> */}
                        <div className="admin_card_container">
                        {Array.isArray(toJS(user.product)) && toJS(user.product).map(item => (
                            <div className="admin_card_item">
                                <div class="list-products__product">
                                    <div class="list-products__product__description-block">
                                        <p>Номер товара: {item.productId}</p>
                                        <p>Тип изделия: {item.brand}</p>
                                        <p>Материал: {item.type}</p>
                                        <p>Проба: {item.probe}</p>
                                        <p>Вес: {item.weight}</p>
                                        <p>Размер: {item.productSize}</p>
                                        {item.type ? (
                                        <div>
                                            <p> Тип камня: {item.type} </p>
                                            <p> Размер камня: {item.gemSize} </p>
                                            <p> Чистота камня: {item.purity} карат </p>
                                        </div>
                                        ) : (
                                            <div></div>
                                        )}
                                        <p>Стоимость {item.cost}</p>
                                        <div className="d-flex admin_card_item_btn">
                                            <button className="btn" onClick={() => fillingUpdateForm(item)}>Изменить</button>
                                            <button className="btn " onClick={() => btnDeleteProduct(item.productId)}>Удалить</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        ))}
                        </div>

                        {productId ? (
                            <form>
                                <h4>Обновление товара</h4>
                                <div> <input className="admin__form__input" placeholder="Тип" value={brand} onChange={e => setBrand(e.target.value)} /> </div>
                                <div> <input className="admin__form__input" placeholder="Материал" value={metal} onChange={e => setMetal(e.target.value)} /> </div>
                                <div> <input className="admin__form__input" placeholder="Проба" value={probe} onChange={e => setProbe(e.target.value)} /> </div>
                                <div> <input className="admin__form__input" placeholder="Вес" value={weight} onChange={e => setWeight(e.target.value)} /> </div>
                                <div> <input className="admin__form__input" placeholder="Размер изд." value={productSize} onChange={e => setProductSize(e.target.value)} /> </div>
                                <div> <input className="admin__form__input" placeholder="Стоимость" value={cost} onChange={e => setCost(e.target.value)} /> </div>
                                {(type || purity || gemSize) ? (
                                    <div>
                                        <div> <input className="admin__form__input" placeholder="Тип" value={type} onChange={e => setType(e.target.value)} /> </div>
                                        <div> <input className="admin__form__input" placeholder="Размер кам." value={gemSize} onChange={e => setGemSize(e.target.value)} /> </div>
                                        <div> <input className="admin__form__input" placeholder="Чистота" value={purity} onChange={e => setPurity(e.target.value)} /> </div>
                                    </div>
                                ) : (
                                    <div> </div>
                                ) }
                                <div className="admin_container_btn">
                                    <button className="btn_update" onClick={btnUpdateProduct}>Отправить</button>
                                    <button className="btn_update" onClick={() => setProductId()}>Закрыть</button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <form>
                                    <h3>Добавление товара</h3>
                                    <div> <input className="admin__form__input" placeholder="Тип" value={brand} onChange={e => setBrand(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="Материал" value={metal} onChange={e => setMetal(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="Проба" value={probe} onChange={e => setProbe(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="Вес" value={weight} onChange={e => setWeight(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="Размер изд." value={productSize} onChange={e => setProductSize(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="Стоимость" value={cost} onChange={e => setCost(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="Тип" value={type} onChange={e => setType(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="Размер кам." value={gemSize} onChange={e => setGemSize(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="Чистота" value={purity} onChange={e => setPurity(e.target.value)} /> </div>
                                    <button className="btn_admin" onClick={btnAddProduct}>Добавить</button>
                                </form>
                            </div>
                        )}
                    


                    <div className="admin_card_container">
                        {Array.isArray(toJS(shedules)) && toJS(shedules).map(item => (
                            <div className="admin_card_item">
                                <div class="list-products__product">
                                    <div class="list-products__product__description-block">
                                        <p>Id: {item.id}</p>
                                        <p>Дата: {item.data}</p>
                                        <p>Начало работы: {item.workStart}</p>
                                        <p>Конец работы: {item.workEnd}</p>
                                        <div className="d-flex admin_card_item_btn">
                                            <button className="btn" onClick={() => fillingSheduleUpdateForm(item)}>Изменить</button>
                                            <button className="btn " onClick={() => btnDeleteShedule(item.id)}>Удалить</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {sheduleId ? (
                            <form>
                                <h4>Обновление расписания</h4>
                                <div> <input className="admin__form__input" placeholder="Id user" value={sheduleEmployeeId} onChange={e => setSheduleEmployeeId(e.target.value)} /> </div>
                                <div> <input className="admin__form__input" placeholder="Data" value={sheduleData} type="date" onChange={e => setSheduleData(e.target.value)} /> </div>
                                <div> <input className="admin__form__input" placeholder="Start" value={sheduleWorkStart} onChange={e => setSheduleWorkStart(e.target.value)} /> </div>
                                <div> <input className="admin__form__input" placeholder="End" value={sheduleWorkEnd} onChange={e => setSheduleWorkEnd(e.target.value)} /> </div>
                                <div className="admin_container_btn">
                                    <button className="btn_update" onClick={btnUpdateShedule}>Отправить</button>
                                    <button className="btn_update" onClick={() => setSheduleId()}>Закрыть</button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <form>
                                    <h3>Добавление расписания</h3>
                                    <div> <input className="admin__form__input" placeholder="Id user" value={sheduleEmployeeId} onChange={e => setSheduleEmployeeId(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="Data" value={sheduleData} type="date" onChange={e => setSheduleData(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="Start" value={sheduleWorkStart} onChange={e => setSheduleWorkStart(e.target.value)} /> </div>
                                    <div> <input className="admin__form__input" placeholder="End" value={sheduleWorkEnd} onChange={e => setSheduleWorkEnd(e.target.value)} /> </div>
                                    <button className="btn_admin" onClick={btnAddShedule}>Добавить</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div>Вы попали сюда по ошибке</div>
            )}
        </div>
    )
}

export default Admin;
