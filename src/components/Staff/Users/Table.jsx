import React from 'react';
import {map} from "lodash";
import {size} from "lodash/collection";
import {EllipsisVerticalIcon, QrCodeIcon} from "@heroicons/react/24/outline";

const Table = ({data, update, showBar}) => {


    const columns = ['', 'Nombre', 'DNI', 'Estado', 'Teléfono', 'Fecha de ingreso/retiro', 'Departamento', 'Cargo']

    return (<div className="relative overflow-x-auto  sm:rounded-lg max-h-[550px] overflow-scroll scrollbar-hide">
        <table className="w-full text-sm text-left text-gray-500  overflow-y-hidden container">

            <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">

            <tr>
                {map(columns, (column, index) => (<th key={index} scope="col" className="px-6 py-3 text-center">
                    {column}
                </th>))}
            </tr>

            </thead>
            <tbody className={""}>
            {data && data !== null && data !== undefined && size(data) > 0 && map(data, item => {
                return (<tr className="bg-white border-b hover:bg-gray-50 " key={item?.id}>
                    <td className="w-4 p-4 ">
                        <div className={"flex"}>
                            <EllipsisVerticalIcon onClick={() => update(item)}
                                                  className="w-5 h-5 text-gray-400 cursor-pointer" aria-hidden="true"/>
                            <QrCodeIcon onClick={()=>showBar(item?.uuid)}
                                        className="w-5 h-5 text-gray-400 cursor-pointer" aria-hidden="true"/>
                        </div>
                    </td>
                    <th scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                        <div className="pl-3">
                            <div className="text-xs font-semibold">{item?.full_name}</div>
                            <div className="font-normal text-gray-500 text-xs">{item?.email}</div>
                        </div>
                    </th>

                    <td className="px-6 py-4 text-xs">{item?.dni}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center text-xs">
                            <div
                                className={`h-2.5 w-2.5 rounded-full ${item?.status ? 'bg-green-500' : 'bg-red-500'}  mr-2`}></div>
                            {item?.status ? 'Activo' : 'Inactivo'}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-xs">{item?.phone}</td>

                    <th scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap ">
                        <div>
                            <div className="text-xs font-semibold">
                                {new Date(item?.date_of_admission + "T00:00:00").toLocaleDateString('es-PE', {
                                    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Lima'
                                })}</div>
                            <div
                                className="font-normal text-gray-500 text-xs">{item?.date_of_farewell && new Date(item?.date_of_farewell + "T00:00:00").toLocaleDateString('es-PE', {
                                year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Lima'
                            })}</div>
                        </div>
                    </th>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">{item?.department_name}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-xs">{item?.position}</td>

                </tr>)
            })}

            </tbody>
        </table>
    </div>);
};

export default Table;
