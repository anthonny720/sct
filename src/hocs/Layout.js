import React, {useEffect} from 'react';
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/navigation/Header";
import {Helmet} from "react-helmet";
import {Footer} from "../components/navigation/Footer";
import {useDispatch, useSelector} from "react-redux";
import {check_authenticated, load_user, refresh} from "../redux/actions/auth";
import {Navigate} from "react-router-dom";

export const Layout = (props) => {
    const isAuthenticated = useSelector(state => state.Auth.isAuthenticated);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(refresh())
        dispatch(check_authenticated())
        dispatch(load_user())
    }, []);


    if (!isAuthenticated) return <Navigate to='/'/>;

    return (<>
            <Helmet>
                <title>Sistema de Control de Tareos (SCT)</title>
                <meta name="description" content="App created by Anthonny Gómez"/>
            </Helmet>

            <div
                className="relative overflow-auto scrollbar-hide m-3 text-xl text-gray-900  text-white font-semibold bg-gray-400 bg-opacity-10 rounded-xl max-h-screen min-h-screen  max-w-screen shadow-xl flex flex-col items-center w-full">
                <Header/>
                {props.children}

            </div>
            <Footer/>
        </>


    );
};
export default Layout;
