import React, {useEffect, useRef, useState} from 'react';
import Layout from "../../../hocs/Layout";
import {useDispatch, useSelector} from "react-redux";
import Table from "../../../components/Tracking/TableCalendar";
import {get_calendar} from "../../../redux/actions/tracking";
import {Navigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import {get_departments} from "../../../redux/actions/staff";
import {map} from "lodash";
import {PaperAirplaneIcon} from "@heroicons/react/24/outline";
import {DownloadTableExcel} from "react-export-table-to-excel";

const Calendar = () => {
    const tableRef = useRef(null);
    const dispatch = useDispatch();
    const payload = useSelector(state => state.Tracking.calendar);
    const departments = useSelector(state => state.Staff.departments);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11
    const currentDay = currentDate.getDate();

    let previousYear = currentYear;
    let previousMonth = currentMonth;

    const [selectedOption, setSelectedOption] = useState('worked');


    const radioOptions = [{value: 'worked', label: 'Horas trabajadas'}, {
        value: 'delay', label: 'Horas de tardanza'
    }, {value: 'overtime', label: 'Horas extras'}, {value: 'compensated', label: 'Horas compensadas'},];


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


    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];


    useEffect(() => {
        const payload = {
            start_date: `${params.year}-${params.month}-24`,
            end_date: `${parseInt(params.month) === 12 ? parseInt(params.year) + 1 : params.year}-${parseInt(params.month) === 12 ? 1 : parseInt(params.month) + 1}-23`,
            user: params.user,
            department: params.department
        }
        dispatch(get_calendar(payload));
    }, [dispatch]);

    const handleFilter = () => {
        const payload = {
            start_date: `${params.year}-${params.month}-24`,
            end_date: `${parseInt(params.month) === 12 ? parseInt(params.year) + 1 : params.year}-${parseInt(params.month) === 12 ? 1 : parseInt(params.month) + 1}-23`,
            user: params.user,
            department: params.department
        }
        dispatch(get_calendar(payload));
    }

    useEffect(() => {
        dispatch(get_departments());
    }, []);

    if (user && user.permissions !== 'EDITOR') return <Navigate to='/home'/>;


    return (<Layout>
        <Helmet>
            <title>Control diario</title>
        </Helmet>
        <div className="mx-auto container bg-white mt-4 p-4 ">

            <div
                className="flex flex-col md:flex-row items-center gap-2 justify-between mb-2  bg-white w-full md:w-max">
                <DownloadTableExcel
                    filename={`Control diario ${params.month}/${params.year}`}
                    sheet="Reporte"
                    currentTableRef={tableRef.current}
                >
                    <svg xmlns="http://www.w3.org/2000/svg"
                         className="icon cursor-pointer icon-tabler icon-tabler-edit text-black" width={20}
                         height={20}
                         viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none"
                         strokeLinecap="round" strokeLinejoin="round">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                    </svg>

                </DownloadTableExcel>
                <div
                    className=" relative flex flex-col md:flex-row items-center gap-2 justify-between bg-white w-full md:w-max">

                    <div
                        className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none w-full md:w-max">
                        <svg className="w-4 h-4 text-gray-500 " aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="text"
                           onChange={(value) => setParams({...params, 'user': value.target.value})}
                           className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full  md:w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500   "
                           placeholder="Búsqueda de usuarios"/>

                </div>
                <select
                    onChange={(event) => setParams({...params, 'month': event.target.value})}
                    className="block text-gray-400 p-2  text-sm text-gray-900 border border-gray-300 rounded-lg w-full  md:w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Búsqueda de usuarios"
                    value={params.month}
                >
                    {monthNames.map((monthName, index) => (
                        <option key={index + 1} value={index + 1}>{monthName}</option>))}
                </select>

                <select
                    onChange={(event) => setParams({...params, 'year': event.target.value})}
                    className="block text-gray-400 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-full  md:w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Búsqueda de usuarios"
                    value={params.year}
                >
                    {Array.from({length: 9}, (_, index) => (
                        <option key={2022 + index} value={2022 + index}>{2022 + index}</option>))}
                </select>

                <select
                    onChange={(event) => setParams({...params, 'department': event.target.value})}
                    className="block text-gray-400 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-full  md:w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Búsqueda de usuarios"
                    value={params.department}
                >
                    <option value={''}>Todos los departamentos</option>
                    {departments && map(departments, (department, index) => (
                        <option key={index} value={department.id}>{department.name}</option>))}

                </select>

                <PaperAirplaneIcon className={'h-6 w-6 cursor-pointer text-green-400'} onClick={handleFilter}/>

            </div>


            <div className="flex sm:flex-row gap-2 flex-col justify-center items-center sm:justify-start">
                {radioOptions.map((option) => (
                    <label key={option.value} className="flex items-center mb-2 text-black text-xs w-full  md:w-max ">
                        <input
                            type="radio"
                            value={option.value}
                            checked={selectedOption === option.value}
                            onChange={() => setSelectedOption(option.value)}
                            className="mr-2 items-start"
                        />
                        {option.label}
                    </label>))}
            </div>

            <Table data={payload} option={selectedOption} reference={tableRef}/>

        </div>
    </Layout>);


};

export default Calendar;
