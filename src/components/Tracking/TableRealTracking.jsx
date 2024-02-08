import React from 'react';
import {map} from 'lodash'
import {size} from "lodash/collection";

const TableRealTracking = ({data, reference}) => {


    const columns = ['Nombre', 'Fecha', 'Entrada', 'Entrada Break', 'Salida Break', 'Salida','Horas trabajadas']
    return (<div className="relative overflow-x-auto scrollbar-hide ">
            <table className="w-full text-sm text-left text-gray-500 " ref={reference}>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                    {map(columns, (item, index) => {
                        return (<th key={index} scope="col" className="px-6 py-2 text-center">
                            {item}
                        </th>)
                    })}
                </tr>
                </thead>
                <tbody>
                {data && data !== null && data !== undefined && size(data) > 0 && map(data, (item, index) => {
                    return (<tr className="bg-white border-b " key={index}>
                        <th scope="row"
                            className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap cursor-pointer hover:text-green-400">
                            {item?.staff_name}
                        </th>
                        <td className="px-6 py-2 font-light text-center">
                            {new Date(item?.date + "T00:00:00").toLocaleDateString('es-PE', {
                                year: '2-digit', month: '2-digit', day: 'numeric', timeZone: 'America/Lima'
                            })}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.real_check_in && new Date(item?.real_check_in).toLocaleTimeString('es-PE', {
                                hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Lima'
                            })}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.lunch_start && new Date(item?.lunch_start).toLocaleTimeString('es-PE', {
                                hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Lima'
                            })}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.real_lunch_end && new Date(item?.real_lunch_end).toLocaleTimeString('es-PE', {
                                hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Lima'
                            })}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.check_out && new Date(item?.check_out).toLocaleTimeString('es-PE', {
                                hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Lima'
                            })}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.real_time}
                        </td>
                    </tr>)
                })}
                </tbody>
            </table>
        </div>

    );
};

export default TableRealTracking;