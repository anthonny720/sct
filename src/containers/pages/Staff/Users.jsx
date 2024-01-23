import React, {useEffect, useState} from 'react';
import Layout from "../../../hocs/Layout";
import {useDispatch, useSelector} from "react-redux";
import {get_staffs} from "../../../redux/actions/staff";
import Modal from "../../../components/util/Modal";
import ModalHook from "../../../components/util/hooks";
import Form from "../../../components/Staff/Users/Form";
import {Switch, Tab} from "@headlessui/react";
import {PlusIcon} from "@heroicons/react/24/solid";
import Table from "../../../components/Staff/Users/Table";
import Departments from "./Departments";
import {Navigate} from "react-router-dom";
import {Helmet} from "react-helmet";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const Users = () => {
    const dispatch = useDispatch();
    const payload = useSelector(state => state.Staff.staffs);
    const {content, setContent, isOpen, setIsOpen, openModal} = ModalHook();
    const [params, setParams] = useState({'full_name': '', 'status': true})

    const user = useSelector(state => state.Auth?.user);


    useEffect(() => {
        dispatch(get_staffs(params));
    }, [dispatch, params]);


    const handleShowBar = async (item) => {
        setIsOpen(true)
        setContent(<div className={""}>
            <img alt='barcode'
                 src={`https://barcode.tec-it.com/barcode.ashx?data=${item}&translate-esc=on`}/>
        </div>)
    }
    const handleCreate = () => {
        setIsOpen(true)
        setContent(<div className={"h-full md:h-screen"}>
            <Form close={openModal} params={params}/>
        </div>)
    }
    const handleUpdate = (data) => {
        setIsOpen(true)
        setContent(<div className={"h-full md:h-screen"}>
            <Form close={openModal} data={data} params={params}/>
        </div>)
    }

    if (user && user.permissions !== 'EDITOR') return <Navigate to='/home'/>;

    return (<Layout>
        <Helmet>
            <title>Colaboradores</title>
        </Helmet>
        <Modal isOpen={isOpen} close={openModal} children={content}/>
        <div>
            <button type="button" onClick={() => handleCreate()}
                    className="absolute bottom-8 z-20 right-2 items-center px-2.5 py-2.5 text-sm font-medium text-center text-white bg-[#0dcd79] rounded-full hover:bg-green-500 focus:ring-4 focus:outline-none focus:ring-green-300 ">
                <PlusIcon className="w-5 h-5 " aria-hidden="true"/>
            </button>
        </div>
        <div className="mx-auto container bg-white mt-4 p-4 overflow-auto scrollbar-hide">
            <Tab.Group>
                <Tab.List className="flex space-x-1  border-b-4 p-1 ">
                    <Tab

                        className={({selected}) => classNames('w-max px-8  py-2.5 text-sm font-medium leading-5 border-r-2 ', selected ? 'bg-white text-green-400 font-bold' : 'text-gray-500 hover:bg-green-200 hover:bg-opacity-10 hover:text-green-600')}
                    >
                        Staff
                    </Tab>

                    <Tab

                        className={({selected}) => classNames('w-max px-8  py-2.5 text-sm font-medium leading-5  ', selected ? 'bg-white text-green-400 font-bold' : 'text-gray-500 hover:bg-green-200 hover:bg-opacity-10 hover:text-green-600')}
                    >
                        Departamentos
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                    <Tab.Panel>
                        <div className="flex flex-col md:flex-row items-center gap-2 justify-end py-4 bg-white ">

                            <label form="table-search" className="sr-only">Buscar</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4 text-gray-500 " aria-hidden="true"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                    </svg>
                                </div>
                                <input type="text"
                                       onChange={(value) => setParams({...params, 'full_name': value.target.value})}
                                       className="p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500   "
                                       placeholder="Búsqueda"/>
                            </div>
                            <Switch
                                checked={params.status}
                                onChange={(value) => setParams({...params, 'status': value})}
                                className={`${params.status ? 'bg-green-600' : 'bg-green-200'}
          relative inline-flex h-[24px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`${params.status ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                                />
                            </Switch>


                        </div>

                        <Table data={payload} update={handleUpdate} showBar={handleShowBar}/>
                    </Tab.Panel>
                    <Tab.Panel>
                        <Departments/>
                    </Tab.Panel>

                </Tab.Panels>
            </Tab.Group>


        </div>
    </Layout>);


};

export default Users;
