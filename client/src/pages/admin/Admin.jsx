import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { Context } from "../..";
import {jwtDecode} from "jwt-decode"; // исправленный импорт
import { toJS } from "mobx";
import { backend_delete_products, backend_get_products, backend_post_products, backend_update_products } from "../../http/userApi";
import { ADMIN_ROUTE } from "../../utils/consts";
import { useNavigate } from "react-router-dom";

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

    const [flagUpdate, setFlagUpdate] = useState();
    
    const { user } = useContext(Context);

    const loadProducts = async () => {
        let data = await backend_get_products();
        user.setProduct(data);
    }

    useEffect(() => {
        // console.log("Контекст пользователя:", user);
        setFlagUpdate(false);

        if (user) {
            loadProducts();

            const token = user.user;
            console.log("Токен:", token);

            let decodedToken;
            let decodedProductToken;
            try {
                decodedToken = jwtDecode(token);
                console.log("Декодированный токен админа:", decodedToken);
                setCheckAdmin(decodedToken.role);
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

    const btnAdd = async (e) => {
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
            alert("Не получилось добавить данные.");
        }
    }

    const btnDelete = async (id) => {
        await backend_delete_products(id);
        await loadProducts();
        navigate(ADMIN_ROUTE);
    }

    const btnUpdate = async (e) => {
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
            let data = await backend_update_products(productId, updateData);
            await loadProducts();
            navigate(ADMIN_ROUTE);
        } catch (error) {
            console.log(e);
            alert("Не получилось обновить данные.");
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
        setCheckAdmin(null); // очищаем состояние checkAdmin при выходе
    }

    const selectFile = (e) => {
        console.log(e.target.files);
        setFiles(e.target.files[0]);
    }



    return (
        <div>
            { checkAdmin == "Admin" ? (
                <div>
                    <h1> Админка </h1>

                    {/* <button onClick={input}> Войти </button>
                    <button onClick={output}> Вывести </button>
                    <button onClick={exit}> Выйти </button>
                    <input type="file" onChange={selectFile}></input>
                    <button>Отправить данные</button> */}

                    <form>
                        <h3>Добавление</h3>
                        <div> <input placeholder="Тип" value={brand} onChange={e => setBrand(e.target.value)} /> </div>
                        <div> <input placeholder="Материал" value={metal} onChange={e => setMetal(e.target.value)} /> </div>
                        <div> <input placeholder="Проба" value={probe} onChange={e => setProbe(e.target.value)} /> </div>
                        <div> <input placeholder="Вес" value={weight} onChange={e => setWeight(e.target.value)} /> </div>
                        <div> <input placeholder="Размер" value={productSize} onChange={e => setProductSize(e.target.value)} /> </div>
                        <div> <input placeholder="Стоимость" value={cost} onChange={e => setCost(e.target.value)} /> </div>
                        <div> <input placeholder="Тип" value={type} onChange={e => setType(e.target.value)} /> </div>
                        <div> <input placeholder="Размер камня" value={gemSize} onChange={e => setGemSize(e.target.value)} /> </div>
                        <div> <input placeholder="Чистота" value={purity} onChange={e => setPurity(e.target.value)} /> </div>
                        <button onClick={btnAdd}>Добавить</button>
                    </form>


                    {Array.isArray(toJS(user.product)) && toJS(user.product).map(item => (
                        <div className="product-card" border="1px">
                            <div className="flex-container">
                                <div> Тип изделия: &nbsp; </div>
                                <div>{item.brand}</div>
                            </div>
                            <div className="flex-container">
                                <div> Материал: &nbsp; </div>
                                <div>{item.metal}</div>
                            </div>
                            <div className="flex-container">
                                <div> Проба: &nbsp; </div>
                                <div>{item.probe}</div>
                            </div>
                            <div className="flex-container">
                                <div> Вес: &nbsp; </div>
                                <div>{item.weight}</div>
                            </div>
                            <div className="flex-container">
                                <div> Размер: &nbsp; </div>
                                <div>{item.productSize}</div>
                            </div>
                            <div className="flex-container">
                                <div> Стоимость: &nbsp; </div>
                                <div>{item.cost} р.</div>
                            </div>
                            {item.type ? (
                                <div>
                                    <div className="flex-container">
                                        <div> Тип камня: &nbsp; </div>
                                        <div>{item.type}</div>
                                    </div>
                                    <div className="flex-container">
                                        <div> Размер камня: &nbsp; </div>
                                        <div>{item.gemSize}</div>
                                    </div>
                                    <div className="flex-container">
                                        <div> Чистота камня: &nbsp; </div>
                                        <div>{item.purity} карат</div>
                                    </div>
                                </div>
                            ) : (
                                <div> </div>
                            )}
                            

                            <button onClick={() => {
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

                                console.log("Данные камня - ", type, gemSize, purity);
                            }}>Изменить</button>
                            <button onClick={() => btnDelete(item.productId)}>Удалить</button>
                        </div>
                    ))}
                    {productId ? (
                        <form>
                            <h4>Updating</h4>
                            <div> <input placeholder="Тип" value={brand} onChange={e => setBrand(e.target.value)} /> </div>
                            <div> <input placeholder="Материал" value={metal} onChange={e => setMetal(e.target.value)} /> </div>
                            <div> <input placeholder="Проба" value={probe} onChange={e => setProbe(e.target.value)} /> </div>
                            <div> <input placeholder="Вес" value={weight} onChange={e => setWeight(e.target.value)} /> </div>
                            <div> <input placeholder="Размер" value={productSize} onChange={e => setProductSize(e.target.value)} /> </div>
                            <div> <input placeholder="Стоимость" value={cost} onChange={e => setCost(e.target.value)} /> </div>
                            {(type || purity || gemSize) ? (
                                <div>
                                    <div> <input placeholder="Тип" value={type} onChange={e => setType(e.target.value)} /> </div>
                                    <div> <input placeholder="Размер камня" value={gemSize} onChange={e => setGemSize(e.target.value)} /> </div>
                                    <div> <input placeholder="Чистота" value={purity} onChange={e => setPurity(e.target.value)} /> </div>
                                </div>
                            ) : (
                                <div> </div>
                            ) }
                            <button onClick={btnUpdate}>Отправить изменения</button>
                            <button onClick={() => setProductId()}>Закрыть</button>
                        </form>
                    ) : (
                        <div> </div>
                    )}

                </div>
            ) : (
                <div>Вы попали сюда по ошибке</div>
            )}
        </div>
    )
}

export default Admin;
