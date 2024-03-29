import React, {useEffect, useState} from 'react';
import Layout from "../../../hocs/Layout";
import Table from "../../../components/Tracking/TableSummary";
import {useDispatch, useSelector} from "react-redux";
import {get_summary} from "../../../redux/actions/tracking";
import {Navigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import {get_departments} from "../../../redux/actions/staff";
import {map} from "lodash";
import {PaperAirplaneIcon} from "@heroicons/react/24/outline";

const Summary = () => {
    const dispatch = useDispatch();
    const payload = useSelector(state => state.Tracking.summary);
    const departments = useSelector(state => state.Staff.departments);

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const currentDay = currentDate.getDate();

    let previousYear = currentYear;
    let previousMonth = currentMonth;

    if (currentDay < 24) {
        // Si estamos antes del día 24, retrocedemos un mes
        if (currentMonth === 1) {
            // Si estamos en enero, retrocedemos a diciembre del año anterior
            previousMonth = 12;
            previousYear--;
        } else {
            previousMonth--;
        }
    }
    const [params, setParams] = useState({year: previousYear, month: previousMonth, user: '', department: ''});
    const user = useSelector(state => state.Auth?.user);

    useEffect(() => {
        const payload = {
            start_date: `${params.year}-${params.month}-24`,
            end_date: `${parseInt(params.month) === 12 ? parseInt(params.year) + 1 : params.year}-${parseInt(params.month) === 12 ? 1 : parseInt(params.month) + 1}-23`,
            user: params.user,
            department: params.department
        }
        dispatch(get_summary(payload))
    }, [dispatch]);

    const handleFilter = () => {
        const payload = {
            start_date: `${params.year}-${params.month}-24`,
            end_date: `${parseInt(params.month) === 12 ? parseInt(params.year) + 1 : params.year}-${parseInt(params.month) === 12 ? 1 : parseInt(params.month) + 1}-23`,
            user: params.user,
            department: params.department
        }
        dispatch(get_summary(payload))
    }

    useEffect(() => {
        dispatch(get_departments());
    }, []);

    if (user && user.permissions !== 'EDITOR') return <Navigate to='/home'/>;

    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return (<Layout>
        <Helmet>
            <title>Resumen mensual</title>
        </Helmet>
        <div className="mx-auto container bg-white mt-4 p-4 ">


            <div className="flex flex-col md:flex-row items-center gap-2 justify-between  bg-white w-full md:w-max">
                <div
                    className="relative flex flex-col md:flex-row items-center gap-2 justify-between bg-white w-full md:w-max">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 " aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="text"
                           onChange={(value) => setParams({...params, 'user': value.target.value})}
                           className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full md:w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500   "
                           placeholder="Búsqueda de usuarios"/>
                </div>
                <select
                    onChange={(event) => setParams({...params, 'month': event.target.value})}
                    className="block text-gray-400 p-2  text-sm text-gray-900 border border-gray-300 rounded-lg w-full md:w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Búsqueda de usuarios"
                    value={params.month}
                >
                    {monthNames.map((monthName, index) => (
                        <option key={index + 1} value={index + 1}>{monthName}</option>))}
                </select>

                <select
                    onChange={(event) => setParams({...params, 'year': event.target.value})}
                    className="block text-gray-400 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-full md:w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Búsqueda de usuarios"
                    value={params.year}
                >
                    {Array.from({length: 9}, (_, index) => (
                        <option key={2022 + index} value={2022 + index}>{2022 + index}</option>))}
                </select>
                <select
                    onChange={(event) => setParams({...params, 'department': event.target.value})}
                    className="block text-gray-400 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-full md:w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Búsqueda de usuarios"
                    value={params.department}
                >
                    <option value={''}>Todos los departamentos</option>
                    {departments && map(departments, (department, index) => (
                        <option key={index} value={department.id}>{department.name}</option>))}

                </select>
                <PaperAirplaneIcon className={'h-6 w-6 cursor-pointer text-green-400'} onClick={handleFilter}/>
            </div>

            <Table data={payload}/>

        </div>

    </Layout>);
};
export default Summary;
