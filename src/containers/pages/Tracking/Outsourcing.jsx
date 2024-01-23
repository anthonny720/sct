import React, {useEffect, useRef, useState} from 'react';
import Layout from "../../../hocs/Layout";
import {useDispatch, useSelector} from "react-redux";
import {get_outsourcing} from "../../../redux/actions/tracking";
import Table from "../../../components/Tracking/TableOutsourcing";
import {Navigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import {DownloadTableExcel} from "react-export-table-to-excel";

const Outsourcing = () => {
    const tableRef = useRef(null);
    const dispatch = useDispatch();
    const payload = useSelector(state => state.Tracking.outsourcing);
    const user = useSelector(state => state.Auth?.user);

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
    const [params, setParams] = useState({year: previousYear, month: previousMonth});


    useEffect(() => {
        const payload = {
            start_date: `${params.year}-${params.month}-24`,
            end_date: `${parseInt(params.month) === 12 ? parseInt(params.year) + 1 : params.year}-${parseInt(params.month) === 12 ? 1 : parseInt(params.month) + 1}-23`,
        }
        dispatch(get_outsourcing(payload))
    }, [dispatch, params]);

    if (user && user.permissions !== 'EDITOR') return <Navigate to='/home'/>;


    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return (<Layout>
        <Helmet>
            <title>Outsourcing</title>
        </Helmet>
        <div className="mx-auto container bg-white mt-4 p-4 ">
            <div className="flex flex-row items-center gap-2  py-4 bg-white ">
                <DownloadTableExcel
                    filename={`Outsourcing ${params.month}/${params.year}`}
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
                <select
                    onChange={(event) => setParams({...params, 'month': event.target.value})}
                    className="block text-gray-400 p-2  text-sm text-gray-900 border border-gray-300 rounded-lg w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Búsqueda de usuarios"
                    value={params.month}
                >
                    {monthNames.map((monthName, index) => (
                        <option key={index + 1} value={index + 1}>{monthName}</option>))}
                </select>

                <select
                    onChange={(event) => setParams({...params, 'year': event.target.value})}
                    className="block text-gray-400 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Búsqueda de usuarios"
                    value={params.year}
                >
                    {Array.from({length: 9}, (_, index) => (
                        <option key={2022 + index} value={2022 + index}>{2022 + index}</option>))}
                </select>
            </div>
            <Table data={payload} reference={tableRef}/>

        </div>

    </Layout>);
};
export default Outsourcing;
