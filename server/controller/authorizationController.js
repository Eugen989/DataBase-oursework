    const uuid = require("uuid");
    const path = require("path");
    const ApiError = require("../errors/ApiError");
    const {Authorization, Employee} = require("../models/models");
    const bcrypt = require("bcrypt");
    const jwt = require("jsonwebtoken");

    const employeeController = require("./employeeController.js"); 

    const generateJwt = (id, login, fullName, role, position) => {
        return jwt.sign({id, login, fullName, role, position}, "key_secret_555", {expiresIn: "24h"});
    }

    const generateJWTFromInfi = (id, login, fullName, role, position) => {
        return jwt.sign({id, login, fullName, role, position}, "key_secret_555", {expiresIn: "24h"});
    }

    const authorizationRoles = {
        "user": "Employee",
        "admin": "Admin"
    }

    const employeePositions = {
        "Programmer": 40000,
        "Saller": 20000
    }

    class AuthorizationController {

        async create(req, res, next) {
            try {
                const {login, password, employeeId, role} = req.body;

                if(!login || !password || !employeeId) {
                    return next(ApiError.badRequest("Не все основные поля заполнены"))
                }

                if(!req.files || !req.files.img) {
                    // console.log("Create data", {login, password, employeeId: 1, role: authorizationRoles["admin"]});
                    const newAuthorization = await Authorization.create({login, password, employeeId, role: ((await Employee.findOne({where: {id: employeeId}})).dataValues.position == employeePositions[0] ? authorizationRoles["user"] : authorizationRoles["admin"])});

                    return res.json(newAuthorization);
                }

                const {img} = req.files;
                let fileName = uuid.v4 + ".jpg";
                img.mv(path.resolve(__dirname, "..", "static", fileName));

                console.log(login, password);

                const newAuthorization = await Authorization.create({login, password, role: authorizationRoles["user"], img: fileName});

                return res.json(newAuthorization);
            }
            catch (e) {
                console.log(e);
                next(ApiError.badRequest(e.message));
            }
        }


        async getAll(req, res) {
            // const users = await db.query("SELECT * FROM user");

            const Authorizations = await Authorization.findAll();
            // console.log(users);


            // let returnData = users.map((user) => {
            //     return user.name, user.surname;
            // })
            
            return res.json(Authorizations);
            // return res.json( {message: "work"} );
        }


        async getOneUser(req, res) {
            const id = req.params.id;

            res.json(Authorization.rows[0]);
        }


        async updateUser(req, res) {
            const {id, name, surname, mail, password} = req.body;

            res.json(Authorization.rows[0]);
        }


        async deleteUser(req, res) {
            const id = req.params.id;
            console.log(id);
            const authorization = await Authorization.destroy({where: {id}});

            if(authorization) {
                res.json({message: `Deleted authorization with id ${id}`})
            } else res.json({message: `Not found authorization with id ${id}`});
            // res.json(authorization.rows[0]);
        }


        async registration(req, res, next) {
            let candidate;
            const {fullName, birthday, position, login, password, role} = req.body;

            console.log({fullName, birthday, position, login, password, role})
            if(!fullName || !birthday || !position || !login || !password || !role) {
                return next(ApiError.badRequest("Некоректный данные указанные при регистрации"));
            }

            candidate = await Authorization.findOne({where: {login}});
            if(candidate) {
                return next(ApiError.badRequest("Пользователь с таким login или password уже существует"));
            }

            candidate = await Employee.findOne({where: {fullName, position}});
            if(!candidate) {
                candidate = await Employee.create({salary: employeePositions[position], fullName, birthday, position});
            }

            let newRole;
            if (position == "Programmer") {
                newRole = authorizationRoles["admin"];
            }
            else {
                newRole = authorizationRoles["user"];
            }

            let user;
            const hashPassword = await bcrypt.hash(password, 2);
            try {
                if(!login || !password || !candidate.id) {
                    return next(ApiError.badRequest("Не все основные поля переданы"))
                }
                user = await Authorization.create({login, password: hashPassword, role: newRole, employeeId: candidate.id});
            } catch (e) {
                return next(ApiError.internal("Ошибка не получилось создать нового пользователя"));
            }

            console.log("Output data from client - ", generateJwt(user.id, user.login, candidate.fullName, user.role, candidate.position))
            const token = generateJwt(user.id, user.login, candidate.fullName, user.role, candidate.position);

            return res.json({token});
            
            // return res.json({message: "Autorization has been good"});
        }


        async login(req, res, next) {
            const {login, password} = req.body;

            const user = await Authorization.findOne({where: {login}});
            console.log(user);
            const employee = await Employee.findOne({where: {id: user.employeeId}});
            // console.log(user, employee);
            if(!user) {
                return next(ApiError.iternal("Такого пользователя не существует"));
            }

            let comparePassword = bcrypt.compareSync(password, user.password);
            if(!comparePassword) {
                return next(ApiError.iternal("Такого пользователя не существует"))
            }

            console.log("Output data from client - ", generateJwt(user.id, user.login, employee.fullName, user.role, employee.position))
            const token = generateJwt(user.id, user.login, employee.fullName, user.role, employee.position);

            return res.json({token});
        }


        async check(req, res, next) {
            const token = generateJwt(req.user.id, req.user.login, req.user.role);

            res.json({token});
        }

        async AuthorizationInfo(req, res, next) {
            try {
                const {id} = req.body;
                const authorization = await Authorization.findOne({where: {id}});
                if (!authorization) {
                    return next(ApiError.internal("Такого пользователя не существует"));
                }

                const token = generateJWTFromInfi(authorization.id, authorization.name, authorization.surname, authorization.mail, authorization.role);

                return res.json({token});
            } catch (e) {
                return next(ApiError.internal("Ошибка при получении данных пользователя"));
            }
        }

        // async setImg(req, res, next) {
        //     try {
        //         const { id } = req.body;
        //         const user = await User.findOne({ where: { id } });
        //         if (!user) {
        //             return next(ApiError.internal("Такого пользователя не существует"));
        //         }
        
        //         if (!req.files || !req.files.img) {
        //             return next(ApiError.badRequest("Изображение не загружено"));
        //         }
        
        //         const { img } = req.files;
        //         const fileName = uuid.v4() + ".jpg";
        //         const filePath = path.resolve(__dirname, "..", "static", fileName);
            
        //         img.mv(filePath, async (err) => {
        //             if (err) {
        //                 return next(ApiError.internal("Ошибка при загрузке файла"));
        //             }
        
        //             if (user.img) {
        //                 const oldFilePath = path.resolve(__dirname, "..", "static", user.img);
        //                 fs.unlink(oldFilePath, (err) => {
        //                     if (err) {
        //                         console.log("Не удалось удалить старое изображение:", err);
        //                     }
        //                 });
        //             }
        
        //             await User.update({ img: fileName }, { where: { id } });
        
        //             const updatedUser = await User.findOne({ where: { id } });
        //             const token = generateJWTFromInfi(
        //                 updatedUser.id,
        //                 updatedUser.name,
        //                 updatedUser.surname,
        //                 updatedUser.mail,
        //                 updatedUser.role,
        //                 updatedUser.img
        //             );
        
        //             console.log(updatedUser.id, updatedUser.name, updatedUser.surname, updatedUser.img, updatedUser.mail, updatedUser.role);
        
        //             return res.json({ token });
        //         });
        //     } catch (e) {
        //         return next(ApiError.internal("Ошибка при обновлении данных пользователя"));
        //     }
        // }

        
    }

    module.exports = new AuthorizationController();