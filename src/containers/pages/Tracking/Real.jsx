import React, {useEffect, useRef, useState} from 'react';
import Layout from "../../../hocs/Layout";
import {useDispatch, useSelector} from "react-redux";
import {get_real_tracking, get_tracking} from "../../../redux/actions/tracking";
import {get_absenteeism, get_departments, get_staffs} from "../../../redux/actions/staff";
import {Navigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import {PaperAirplaneIcon} from "@heroicons/react/24/outline";
import {map} from "lodash";
import {DownloadTableExcel} from "react-export-table-to-excel";
import TableRealTracking from "../../../components/Tracking/TableRealTracking";

const RealTracking = () => {
    const tableRef = useRef(null);
    const dispatch = useDispatch();
    const payload = useSelector(state => state.Tracking.tracking_real);
    const departments = useSelector(state => state.Staff.departments);
    const [params, setParams] = useState({user: '', date: '', department: ''});
    const user = useSelector(state => state.Auth?.user);

    useEffect(() => {
        dispatch(get_tracking());
        dispatch(get_staffs({'status': true}));
        dispatch(get_departments());
        dispatch(get_absenteeism());
    }, [dispatch]);

    useEffect(() => {
        dispatch(get_real_tracking(params));
    }, [dispatch]);

    const handleFilter = () => {
        dispatch(get_real_tracking(params));
    }


    if (user && user.permissions !== 'EDITOR') return <Navigate to='/home'/>;
    return (<Layout>
        <Helmet>
            <title>Registro de horas</title>
        </Helmet>

        <div className="mx-auto container bg-white mt-4 p-4 overflow-auto scrollbar-hide">


            <div className={"flex flex-col md:flex-row  gap-2 items-center pt-4"}>
                <DownloadTableExcel
                    filename={`Registro asistencia`}
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
                    className="relative flex flex-col md:flex-row items-center gap-2 justify-between  bg-white w-full  md:w-max">
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

                <input type="date"
                       onChange={(value) => setParams({...params, 'date': value.target.value})}
                       className="block text-gray-400 p-2 pl-10 text-sm border border-gray-300 rounded-lg w-full md:w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500   "
                       placeholder=""/>

                <select
                    onChange={(event) => setParams({...params, 'department': event.target.value})}
                    className="block text-gray-400 p-2 text-sm  border border-gray-300 rounded-lg w-full  md:w-max bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    value={params.department}
                >
                    <option value={''}>Todos los departamentos</option>
                    {departments && map(departments, (department, index) => (
                        <option key={index} value={department.id}>{department.name}</option>))}

                </select>

                <PaperAirplaneIcon className={'h-6 w-6 cursor-pointer text-green-400'} onClick={handleFilter}/>
            </div>
            <TableRealTracking data={payload} reference={tableRef}/>

        </div>
    </Layout>);

};
export default RealTracking;