import React from 'react';
import {map} from 'lodash'
import {size} from "lodash/collection";

const Table = ({data, option, reference}) => {

    return (<div className="relative overflow-x-auto scrollbar-hide ">
            <table className="w-full text-sm text-left text-gray-500 " ref={reference}>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
                <tr>
                    <th scope="col" className="px-6 py-2 text-center whitespace-nowrap sticky left-0 bg-white">
                        Apellidos y Nombres
                    </th>
                    {data && data !== null && data !== undefined && size(data) > 0 && data?.date !== null && map(data.date, (item, index) => {
                        return (<th key={index} scope="col" className="px-6 py-2 text-center">
                            {item}
                        </th>)
                    })}
                </tr>
                </thead>
                <tbody>
                {data && data !== null && data !== undefined && size(data) > 0 && data?.users !== null && map(data.users, (item, index) => {
                    return (<tr className="bg-white border-b " key={index}>
                        <th scope="row"
                            className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap cursor-pointer hover:text-green-400 sticky left-0 bg-white">
                            {index}
                        </th>
                        {map(item, (item, index) => {
                            return (<td key={index} className={`px-6 py-2 text-center whitespace-nowrap`}>
                                {option === 'worked' && item?.worked_hours}
                                {option === 'delay' && <p className={item?.delay_hours>"00:00"&&"text-red-400" }>{item?.delay_hours}</p>}
                                {option === 'overtime' && item?.overtime_hours}
                                {option === 'compensated' && item?.compensation_hours}
                            </td>)
                        })}


                    </tr>)
                })}
                </tbody>
            </table>
        </div>

    );
};

export default Table;
