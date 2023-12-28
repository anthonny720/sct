import React from 'react';

import background from '../../assets/sign-up-form.svg';
import Layout from "../../hocs/Layout";
import ChangePasswordForm from "./FormPassword";
import {Helmet} from "react-helmet";
import {Navigate} from "react-router-dom";
import {useSelector} from "react-redux";

const ChangePassword = () => {
    const user = useSelector(state => state.Auth?.user);


    if (user && (user.permissions === 'VIEWER' || user.permissions === 'FIND')) return <Navigate to='/home'/>;
    return (<Layout>
        <Helmet>
            <title>Restablecer contraseña</title>
        </Helmet>
        <div className="container mx-auto">
            <div className="flex justify-center px-6 my-12">
                <div className="w-full xl:w-3/4 lg:w-11/12 flex">
                    <div
                        className="w-full h-auto bg-transparent hidden lg:block lg:w-1/2 bg-cover rounded-l-lg"
                        style={{backgroundImage: `url(${background})`}}>
                    </div>
                    <div className="w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none">
                        <div className="px-8 mb-4 text-center">
                            <h3 className="pt-4 mb-2 text-black text-2xl">Cambia tu contraseña</h3>
                        </div>
                        <ChangePasswordForm/>
                    </div>
                </div>
            </div>
        </div>
    </Layout>);
};
export default ChangePassword;
