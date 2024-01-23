import React from 'react';
import {map} from 'lodash'
import {size} from "lodash/collection";

const Table = ({data, reference}) => {

    const columns = ['N°', 'Cargo', 'DNI', 'APELLIDOS Y NOMBRES', 'DIAS LABORADOS', 'HORAS EXTRAS 25%', 'HORAS EXTRAS 35%', 'BONIFICACIÓN NOCTURNA POR HORAS', 'COMPENSACIÓN FERIADO', 'HORAS FERIADO', 'FERIADO', 'TOTAL', 'VACACIONES', 'TOTAL', 'DESCANSO MÉDICO', 'TOTAL', 'LICENCIA SIN GOCE', 'TOTAL', 'INASISTENCIAS', 'TOTAL', 'FECHA DE CESE',]
    return (<div className="relative overflow-x-auto scrollbar-hide ">
            <table className="w-full text-sm text-left text-gray-500 " ref={reference}>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                    {map(columns, (item, index) => {
                        return (<th key={index} scope="col" className="px-4 py-2 text-center whitespace-nowrap">
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
                            {index + 1}
                        </th>
                        <td className="px-6 py-2 font-light text-center whitespace-nowrap">
                            {item?.position}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.dni}
                        </td>
                        <td className="px-6 py-2 font-medium text-center whitespace-nowrap">
                            {item?.user}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.total_days_worked + item?.vacaciones + item?.descanso_medico + item?.descanso_semanal}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.overtime_25}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.overtime_35}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.total_worked_night}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.compensación_feriados}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.horas_feriado}
                        </td>
                        <td className="px-6 py-2 font-light text-center">
                            {item?.dias_feriado.join(", ")}
                        </td>
                        <td className="px-6 py-2 font-bold text-center">
                            {item?.feriado}
                        </td>
                        <td className="px-6 py-2 font-light text-center whitespace-nowrap">
                            {item?.dias_vacaciones.join(", ")}
                        </td>
                        <td className="px-6 py-2 font-bold text-center">
                            {item?.vacaciones}
                        </td>
                        <td className="px-6 py-2 font-light text-center whitespace-nowrap">
                            {item?.dias_descanso_medico.join(", ")}
                        </td>
                        <td className="px-6 py-2 font-bold text-center">
                            {item?.descanso_medico}
                        </td>
                        <td className="px-6 py-2 font-light text-center whitespace-nowrap">
                            {item?.dias_licencia_sin_gose_de_haber.join(", ")}
                        </td>
                        <td className="px-6 py-2 font-bold text-center">
                            {item?.licencia_sin_gose_de_haber}
                        </td>
                        <td className="px-6 py-2 font-light text-center whitespace-nowrap">
                            {item?.dias_inasistencia.join(", ")}
                        </td>
                        <td className="px-6 py-2 font-bold text-center">
                            {item?.inasistencia}
                        </td>
                        <td className="px-6 py-2 font-bold text-center whitespace-nowrap">
                            {item?.out ? new Date(item?.out + "T00:00:00").toLocaleDateString('es-PE', {
                                year: 'numeric', month: 'short', day: 'numeric', timeZone: 'America/Lima'
                            }) : ''}
                        </td>

                    </tr>)
                })}
                </tbody>
            </table>
        </div>

    );
};

export default Table;
