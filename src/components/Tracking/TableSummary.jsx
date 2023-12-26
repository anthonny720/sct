import React from 'react';
import {map} from 'lodash'
import {size} from "lodash/collection";

const Table = ({data}) => {

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


    const columns = ['Nombre',  'Horas extras 25%', 'Horas extras 35%', 'Horas extras', 'Horas noche', 'Días trabajados', 'Vacaciones', 'Descanso médico', 'Inasistencia','Licencia sin gose de haber','Descanso','Total días']
    return (<div className="relative overflow-x-auto scrollbar-hide ">
            <table className="w-full text-sm text-left text-gray-500 ">
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
                            {item?.user}
                        </th>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.overtime_25}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                           {item?.overtime_35}
                        </td>
                        <td className="px-6 py-2 font-bold text-center">
                            {calculateTotalTime([item?.overtime_25,item?.overtime_35])}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.total_worked_night}
                        </td> <td className="px-6 py-2 font-light text-center">
                            {item?.total_days_worked}
                        </td>
                        <td className={`px-6 py-2 text-center ${item?.vacaciones > 0 && "bg-[#10724b] bg-opacity-40 text-white"}`}>
                            {item?.vacaciones}
                        </td>
                        <td className={`px-6 py-2 text-center ${item?.descanso_medico > 0 && "bg-[#205a6d] bg-opacity-40 text-white"}`}>
                            {item?.descanso_medico}
                        </td>
                        <td className={`px-6 py-2 text-center ${item?.inasistencia > 0 && "bg-red-500 bg-opacity-40 text-white"}`}>
                            {item?.inasistencia}
                        </td>
                        <td className={`px-6 py-2 text-center ${item?.licencia_sin_gose_de_haber > 0 && "bg-[#727572] bg-opacity-40 text-white"}`}>
                            {item?.licencia_sin_gose_de_haber}
                        </td>
                        <td className={`px-6 py-2 text-center text-black"}`}>
                            {item?.descanso_semanal}
                        </td>
                        <td className="px-6 py-2 font-bold text-center ">
                            {item?.total_days_worked+item?.vacaciones+item?.descanso_medico + item?.descanso_semanal}
                        </td>
                    </tr>)
                })}
                </tbody>
            </table>
        </div>

    );
};

export default Table;
