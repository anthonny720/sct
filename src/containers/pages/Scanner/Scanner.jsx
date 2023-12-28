import React, {Fragment, useEffect, useState} from 'react';
import {Helmet} from 'react-helmet';
import Layout from '../../../hocs/Layout';
import BarcodeScannerComponent from 'react-barcode-scanner-updated';
import {Menu, Switch, Transition} from "@headlessui/react";
import {map, size} from "lodash";
import {ChevronDownIcon} from "@heroicons/react/24/solid";
import {useDispatch, useSelector} from "react-redux";
import {send_tracking} from "../../../redux/actions/tracking";
import {find_user} from "../../../redux/actions/staff";

const Scanner = () => {
    const [data, setData] = React.useState("");
    const [option, setOptions] = useState({id: 'find', label: 'Buscar'});
    const [torchOn, setTorchOn] = React.useState(true);
    const info = useSelector(state => state.Tracking.info);
    const me = useSelector(state => state.Auth?.user);
    const find = useSelector(state => state.Staff.user);

    const dispatch = useDispatch();


    useEffect(() => {
        // Move the logic that depends on option inside this block
        if (data && size(data) ===8) {
            setTorchOn(false);

            if (option.id === 'find') {
                dispatch(find_user({code: data}));
            } else {
                dispatch(send_tracking({code: data, attendance: option.id}));
            }
            setTorchOn(true);
            setData("");


        }
    }, [data, option, dispatch]);

    const options = me && me.get_permission_name === 'Buscador' ? [{id: 'find', label: 'Buscar'}] : [{
        id: 'find', label: 'Buscar'
    }, {id: 'check_in', label: 'Ingreso'}, {id: 'lunch_start', label: 'Ingreso receso'}, {
        id: 'lunch_end', label: 'Salida receso'
    }, {id: 'check_out', label: 'Salida'},];

    return <Layout>
        <Helmet>
            <title>Scanner</title>
        </Helmet>
        <div className={"p-2 flex gap-10"}>
            <Menu as="div" className="inline-block text-left z-10 relative ">
                <div>
                    <Menu.Button
                        className="inline-flex w-full gap-2 justify-center rounded-md bg-green-300 px-4 py-2 text-sm font-medium text-white hover:bg-green-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75">
                        <ChevronDownIcon
                            className="h-5 w-5 text-green-500 hover:text-green-100"
                            aria-hidden="true"
                        />
                        {option.label}
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items
                        className="absolute -ml-0 w-max divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="px-1 py-1 ">
                            {options && size(options) > 0 && map(options, (item, index) => <Menu.Item key={index}>
                                {({active}) => (<button onClick={() => setOptions({id: item.id, label: item.label})}
                                                        className={`${active ? 'bg-green-300 text-white' : 'text-gray-900'} group flex w-full  items-center rounded-md px-2 py-2 text-xs`}
                                >
                                    {item.label}
                                </button>)}
                            </Menu.Item>)}
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
            <Switch
                checked={torchOn}
                onChange={setTorchOn}
                className={`${torchOn ? 'bg-green-400' : 'bg-gray-300'}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
            >
                <span className="sr-only">Use setting</span>
                <span
                    aria-hidden="true"
                    className={`${torchOn ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
            </Switch>
        </div>

        <div className={"flex flex-col justify-center items-center"}>
            {torchOn && <BarcodeScannerComponent
                width={500}
                height={500}
                torch={torchOn}
                onUpdate={(err, result) => {
                    if (result) setData(result.text);
                }}
                onError={(err) => console.log(err)}
            />}
            <div className={"text-black bg-white w-11/12 rounded-2xl relative mt-10"}>
                <div className={"flex flex-col items-center justify-center absolute bg-green-400 rounded-t-2xl w-full"}>
                    <p className={"text-xs md:text-md font-bold text-white"}>{info?.staff_name ? info?.staff_name : 'Registro'}</p>
                </div>
                <div className={"grid md:grid-cols-2 text-gray-400 text-sm font-light w-full mb-4 px-4 pt-8"}>
                    {option && option.id !== 'find' ? <>
                        <p className={"text-start"}>Ingreso: <span>{info?.check_in && info?.check_in !== null && new Date(info?.check_in).toLocaleTimeString('es-PE', {
                            hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Lima'
                        })}</span></p>

                        <p className={"text-start"}>Ingreso
                            receso: <span>{info?.lunch_start && info?.lunch_start !== null && new Date(info?.lunch_start).toLocaleTimeString('es-PE', {
                                hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Lima'
                            })}</span></p>
                        <p className={"text-start"}>Fin
                            receso: <span>{info?.lunch_end && info?.lunch_end !== null && new Date(info?.lunch_end).toLocaleTimeString('es-PE', {
                                hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Lima'
                            })}</span></p>
                        <p className={"text-start"}>Salida: <span>{info?.check_out && info?.check_out !== null && new Date(info?.check_out).toLocaleTimeString('es-PE', {
                            hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'America/Lima'
                        })}</span></p>
                    </> : <>
                        <p className={"text-start"}>Nombre: {find?.name}<span></span></p>
                        <p className={"text-start"}>Apellidos: {find?.last_name}<span></span></p>
                        <p className={"text-start"}>Area: {find?.department_name}<span></span></p>
                        <p className={"text-start"}>Cargo: {find?.position}<span></span></p>
                        <p className={"text-start"}>DNI: {find?.dni}<span></span></p>
                        <p className={"text-start"}>Status: {find?.name}<span></span></p>
                    </>}
                </div>
            </div>
        </div>


    </Layout>;
};

export default Scanner;
