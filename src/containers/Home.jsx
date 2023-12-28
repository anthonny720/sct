import React, {useEffect, useRef, useState} from 'react';
import Layout from "../hocs/Layout";
import {useDispatch, useSelector} from "react-redux";
import {send_tracking} from "../redux/actions/tracking";
import {ClockIcon} from "@heroicons/react/24/outline";
import {CheckCircleIcon} from "@heroicons/react/24/solid";
import Cerro from "../assets/back.png"
import {Helmet} from "react-helmet";
import {Navigate} from "react-router-dom";

const Home = () => {
    const dispatch = useDispatch();
    const info = useSelector(state => state.Tracking.info);
    const [code, setCode] = useState('');
    const inputRef = useRef(null);
    const [attendance, setAttendance] = useState('check_in');

    const user = useSelector(state => state.Auth?.user);


    useEffect(() => {
        inputRef?.current?.focus();
        const handleClickOutside = (e) => {
            if (!inputRef.current?.contains(e.target)) {
                inputRef.current?.focus();
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.length === 8 && attendance !== '') {
            dispatch(send_tracking({code, attendance}));
            setCode('');
        }
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= 8) {
            setCode(inputValue.replace(/'/g, '-'));
        }
    };

    const handleAttendanceChange = (e) => {
        setAttendance(e.target.value);
        inputRef.current.focus();
    };

    const options = [{id: 'check_in', label: 'Ingreso', icon: <ClockIcon className="h-5 w-5"/>}, {
        id: 'lunch_start', label: 'Ingreso receso', icon: <ClockIcon className="h-5 w-5"/>
    }, {id: 'lunch_end', label: 'Salida receso', icon: <ClockIcon className="h-5 w-5"/>}, {
        id: 'check_out', label: 'Salida', icon: <ClockIcon className="h-5 w-5"/>
    },];

    if (user && (user.permissions === 'FIND' || user.permissions === 'VIEWER')) return <Navigate to='/scanner'/>;

    return (<Layout>
        <Helmet>
            <title>Sistema de Control de Tareos (SCT)</title>
        </Helmet>
        <section className="absolute w-full h-full bg-white">
            <div
                className="absolute  w-full h-full  "
                style={{
                    backgroundImage: "url(" + Cerro + ")", backgroundSize: "cover", backgroundRepeat: "repeat",
                }}
            ></div>
            <div className="container mx-auto px-4 h-full">
                <div className="flex content-center items-center justify-center h-full">


                    <div className="w-full lg:w-7/12 px-4">

                        <div
                            className="relative flex flex-col min-w-0 break-words w-full  shadow-xl rounded-lg bg-white border-1">
                            <div className="mb-0 px-6 bg-green-400 bg-opacity-60 py-2">
                                <h6 className="text-white text-md text-center font-bold">
                                    {!info?.staff_name && 'ASISTENCIA'} <span
                                    className={"uppercase"}>{info?.staff_name}</span>
                                </h6>
                            </div>

                            <div className="flex flex-col px-4 ">
                                <div className="text-gray-500 text-center font-bold">
                                    <div className="gap-4 grid w-full p-4 flex-col lg:flex-row items-center">
                                        <div className="col-span-4 lg:col-span-1 bg-white text-black">
                                            <ul className="items-center w-full text-sm font-medium text-gray-900  border border-gray-200 rounded-lg sm:flex ">
                                                {options.map((option) => (<li
                                                    key={option.id}
                                                    className={`w-full ${option.id === 'check_out' ? '' : 'border-b border-gray-200 sm:border-b-0 sm:border-r '}`}
                                                >
                                                    <button
                                                        id={option.id}
                                                        type="button"
                                                        value={option.id}
                                                        className={`w-full py-3 pl-3 pr-6 flex items-center justify-between focus:outline-none ${attendance === option?.id ? 'bg-blue-50' : ''}`}
                                                        onClick={handleAttendanceChange}
                                                    >
                                                        <div className="flex items-center">
                                                            {option.icon}
                                                            <span className="ml-2">{option?.label}</span>
                                                        </div>
                                                        {attendance === option.id ? (<CheckCircleIcon
                                                            className="h-5 w-5 text-blue-600 "/>) : null}
                                                    </button>
                                                </li>))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <input
                                        ref={inputRef}
                                        value={code}
                                        onChange={handleInputChange}
                                        type="text"
                                        tabIndex={0}
                                        className="text-sm w-2 absolute -top-3 bg-transparent px-4 py-2 border border-solid border-gray-300 rounded mt-4"
                                        maxLength={8}
                                        minLength={8}
                                    />
                                </form>
                                <p className={"text-black text-center"}></p>
                                <div className={"grid md:grid-cols-2 text-gray-400 text-sm font-light w-full mb-4"}>
                                    <p className={"text-center"}>Ingreso: <span>{info?.check_in && info?.check_in !== null && new Date(info?.check_in).toLocaleTimeString('es-PE', {
                                        hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Lima'
                                    })}</span></p>

                                    <p className={"text-center"}>Ingreso
                                        receso: <span>{info?.lunch_start && info?.lunch_start !== null && new Date(info?.lunch_start).toLocaleTimeString('es-PE', {
                                            hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Lima'
                                        })}</span></p>
                                    <p className={"text-center"}>Fin
                                        receso: <span>{info?.lunch_end && info?.lunch_end !== null && new Date(info?.lunch_end).toLocaleTimeString('es-PE', {
                                            hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Lima'
                                        })}</span></p>
                                    <p className={"text-center"}>Salida: <span>{info?.check_out && info?.check_out !== null && new Date(info?.check_out).toLocaleTimeString('es-PE', {
                                        hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Lima'
                                    })}</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </Layout>);
};
export default Home;
