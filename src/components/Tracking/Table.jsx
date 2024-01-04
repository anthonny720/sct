import React from 'react';
import {map} from 'lodash'
import {size} from "lodash/collection";
import {CheckCircleIcon, XCircleIcon} from "@heroicons/react/24/solid";

const Table = ({data, update,reference}) => {

    function calculateTotalTime(timeStrings) {
        const totalSeconds = timeStrings.reduce((total, timeString) => {
            if (timeString) {
                const [hours, minutes, seconds] = timeString.split(':').map(Number);
                return total + hours * 3600 + minutes * 60 + seconds;
            }
            return total;
        }, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    }

    const columns = ['Nombre', 'Fecha', 'Entrada', 'Entrada Break', 'Salida Break', 'Salida', 'Ausentismo', 'Horas ausentismo', 'Horas laborales', 'Horas 25%', 'Horas 35%', 'Tardanza',]
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
                        <th scope="row" onClick={() => update(item)}
                            className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap cursor-pointer hover:text-green-400">
                            {item?.staff_name}
                        </th>
                        <td className="px-6 py-2 font-light text-center">
                            {new Date(item?.date + "T00:00:00").toLocaleDateString('es-PE', {
                                year: '2-digit', month: '2-digit', day: 'numeric', timeZone: 'America/Lima'
                            })}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.check_in && new Date(item?.check_in).toLocaleTimeString('es-PE', {
                                hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Lima'
                            })}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.lunch_start && new Date(item?.lunch_start).toLocaleTimeString('es-PE', {
                                hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Lima'
                            })}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.lunch_end && new Date(item?.lunch_end).toLocaleTimeString('es-PE', {
                                hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Lima'
                            })}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.check_out && new Date(item?.check_out).toLocaleTimeString('es-PE', {
                                hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'America/Lima'
                            })}
                        </td>
                        <td className="px-6 py-2 font-light text-center text-xs">
                            {item?.absenteeism_name} {item?.absenteeism_extra_name && " | "} {item?.absenteeism_extra_name}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {calculateTotalTime([item?.absenteeism_hours, item?.absenteeism_hours_extra])}
                        </td>
                        <td className={`px-6 py-2 text-center ${item?.worked_hours > "07:55:00" ? "bg-green-400 bg-opacity-20" : "bg-red-400 bg-opacity-20"}`}>{item?.worked_hours}</td>

                        <td className="px-6 py-2 text-center"><p className={"flex"}>{item?.approved ?
                            <CheckCircleIcon className={"w-4 mr-2 text-green-400"}/> :
                            <XCircleIcon className={"w-4 mr-2 text-red-400"}/>} {item?.overtime_25_hours}</p></td>
                        <td className="px-6 py-2 text-center">{item?.overtime_35_hours}</td>
                        <td className="px-6 py-2 text-center">{item?.delay_hours}</td>
                        <td className={"hidden"}>{item?.is_day_shift ? "Dia":"Noche"}</td>
                        <td className={"hidden"}>{item?.approved ? "SI":"NO"}</td>
                    </tr>)
                })}
                </tbody>
            </table>
        </div>

    );
};

export default Table;