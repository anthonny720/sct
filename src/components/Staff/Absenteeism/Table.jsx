import React from 'react';
import {map} from "lodash";
import {size} from "lodash/collection";

const Table = ({data}) => {


    const columns = ['Tipo de absentismo']

    return (<div className="relative overflow-x-auto ">
            <table className="w-full text-sm text-left text-gray-500  overflow-y-hidden container">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
                <tr>
                    <th className="px-6 py-3 w-max">
                        Nombre
                    </th>
                    <th className="px-6 py-3 w-max hidden md:block">
                        Descripción
                    </th>
                </tr>
                </thead>
                <tbody className={""}>
                {data && data !== null && data !== undefined && size(data) > 0 && map(data, item => {
                    return (<tr className="bg-white border-b hover:bg-gray-50 ">
                            <th scope="row"
                                className="text-gray-900 whitespace-wrap gap-2 p-2 ">
                                <div className="text-xs font-semibold">
                                        <p style={{backgroundColor: item?.color}}
                                            className={`p-2 bg-[${item?.color}] rounded-xl w-full md:w-max text-center text-white`}>{item?.name}</p>
                                    </div>
                            </th>
                        <th
                                className="text-gray-900 whitespace-wrap font-normal gap-2 p-2 hidden sm:block">
                                    {item?.description}asdasdkadshbsahb
                            </th>

                        </tr>)
                })}


                </tbody>
            </table>
        </div>);
};

export default Table;
