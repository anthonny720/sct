import React from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {map} from "lodash";
import {add_tracking, update_tracking} from "../../redux/actions/tracking";
import {format} from 'date-fns';
import {Switch} from "@headlessui/react";

const Form = ({close, data, params}) => {
    const absenteeism = useSelector(state => state.Staff.absenteeism);
    const users = useSelector(state => state.Staff.staffs);
    const dispatch = useDispatch();


    /*Formik*/
    const formik = useFormik({
        initialValues: initialValues(data),
        validationSchema: Yup.object(newSchema()),
        validateOnChange: true,
        onSubmit: (form) => {
            if (form.date === '') {
                form.date = null
            }
            if (form.check_in === '') {
                form.check_in = null
            }
            if (form.check_out === '') {
                form.check_out = null
            }
            if (form.lunch_start === '') {
                form.lunch_start = null
            }
            if (form.lunch_end === '') {
                form.lunch_end = null
            }
            data ? dispatch(update_tracking(form, data.id, params)) : dispatch(add_tracking(form, params))
            close()
        }
    })
    return (<form
        className="relative bg-white rounded-lg shadow dark:bg-gray-700">
        <div className="flex items-start justify-between p-4 border-b rounded-t ">
            <button type="button" onClick={() => close()}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center  "
                    data-modal-hide="editUserModal">
                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                     viewBox="0 0 14 14">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
                <span className="sr-only">Cerrar</span>
            </button>
        </div>

        <div className="p-6 space-y-6">

            <div className="grid grid-cols-6 gap-6">

                <div className="col-span-6 ">
                    <label htmlFor="area"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.staff ? 'text-gray-900' : 'text-red-400'}`}>Colaborador</label>
                    <select disabled={data ? true : false}
                            onChange={(value) => formik.setFieldValue('staff', value.target.value)}
                            defaultValue={formik.values.staff}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                            aria-label="Default select example">
                        <option value={null}>Seleccione</option>
                        {users !== null && map(users, item => (
                            <option key={item.id} value={item.id}>{item.full_name}</option>))}
                    </select>
                </div>
                <div className="col-span-6 sm:col-span-6">
                    <label htmlFor="lunch_end"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.date ? 'text-gray-900' : 'text-red-400'}`}>Fecha</label>
                    <input type="date" name="date" id="date" value={formik.values.date}
                           onChange={(value) => formik.setFieldValue('date', value.target.value)}

                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                    />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="check_in"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.check_in ? 'text-gray-900' : 'text-red-400'}`}>Ingreso</label>
                    <input type="datetime-local" name="check_in" id="check_in" value={formik.values.check_in}
                           onChange={(value) => formik.setFieldValue('check_in', value.target.value)}

                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                    />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="lunch_start"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.lunch_start ? 'text-gray-900' : 'text-red-400'}`}>Inicio
                        break</label>
                    <input type="datetime-local" name="lunch_start" id="lunch_start" value={formik.values.lunch_start}
                           onChange={(value) => formik.setFieldValue('lunch_start', value.target.value)}

                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                    />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="lunch_end"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.lunch_end ? 'text-gray-900' : 'text-red-400'}`}>Fin
                        break</label>
                    <input type="datetime-local" name="lunch_end" id="lunch_end" value={formik.values.lunch_end}
                           onChange={(value) => formik.setFieldValue('lunch_end', value.target.value)}

                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                    />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="check_out"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.check_out ? 'text-gray-900' : 'text-red-400'}`}>Salida</label>
                    <input type="datetime-local" name="check_out" id="check_out" value={formik.values.check_out}
                           onChange={(value) => formik.setFieldValue('check_out', value.target.value)}

                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                    />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="absenteeism"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.absenteeism ? 'text-gray-900' : 'text-red-400'}`}>Ausentismo</label>
                    <select onChange={(value) => formik.setFieldValue('absenteeism', value.target.value)}
                            defaultValue={formik.values.absenteeism}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                            aria-label="Default select example">
                        <option value={''}>Seleccione</option>
                        {absenteeism !== null && map(absenteeism, item => (
                            <option key={item.id} value={item.id}>{item.name}</option>))}
                    </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="absenteeism_hours"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.absenteeism_hours ? 'text-gray-900' : 'text-red-400'}`}>Horas
                        de ausentismo</label>
                    <input type="time" name="absenteeism_hours" id="absenteeism_hours"
                           value={formik.values.absenteeism_hours}
                           onChange={(value) => formik.setFieldValue('absenteeism_hours', value.target.value)}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                    />
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="absenteeism"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.absenteeism_extra ? 'text-gray-900' : 'text-red-400'}`}>Ausentismo
                        extraordinario</label>
                    <select onChange={(value) => formik.setFieldValue('absenteeism_extra', value.target.value)}
                            defaultValue={formik.values.absenteeism_extra}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                            aria-label="Default select example">
                        <option value={''}>Seleccione</option>
                        {absenteeism !== null && map(absenteeism, item => (
                            <option key={item.id} value={item.id}>{item.name}</option>))}
                    </select>
                </div>

                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="absenteeism_hours_extra"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.absenteeism_hours ? 'text-gray-900' : 'text-red-400'}`}>Horas
                        de ausentismo extra</label>
                    <input type="time" name="absenteeism_hours_extra" id="absenteeism_hours_extra"
                           value={formik.values.absenteeism_hours_extra}
                           onChange={(value) => formik.setFieldValue('absenteeism_hours_extra', value.target.value)}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                    />
                </div>

                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="absenteeism_hours_extra"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.absenteeism_hours ? 'text-gray-900' : 'text-red-400'}`}>Aprobar H.E.</label>
                    <Switch
                        checked={formik.values.approved}
                        onChange={(value)=>formik.setFieldValue('approved',value)}
                        className={`${formik.values.approved ? 'bg-green-600' : 'bg-green-200'}
          relative inline-flex h-[24px] w-[60px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
                    >
                        <span
                            aria-hidden="true"
                            className={`${formik.values.approved ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                        />
                    </Switch>
                </div>


            </div>
        </div>
        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
            <button type="button" onClick={() => formik.handleSubmit()}
                    className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Guardar
            </button>
        </div>
    </form>);
};

const formatDate = (date) => (date ? format(new Date(date), "yyyy-MM-dd' 'HH:mm") : undefined);

const initialValues = (data) => {
    return {
        staff: data?.staff || '',
        date: data?.date || new Date().toISOString().split('T')[0],
        check_in: formatDate(data?.check_in),
        lunch_start: formatDate(data?.lunch_start),
        lunch_end: formatDate(data?.lunch_end),
        check_out: formatDate(data?.check_out),
        absenteeism: data?.absenteeism || undefined,
        absenteeism_extra: data?.absenteeism_extra || undefined,
        absenteeism_hours: data?.absenteeism_hours || "00:00:00",
        absenteeism_hours_extra: data?.absenteeism_hours_extra || "00:00:00",
        approved: data?.approved || false,
    }
}

const newSchema = () => {
    return {
        staff: Yup.number().required(),
        date: Yup.date(),
        absenteeism_hours: Yup.string(),
        absenteeism_hours_extra: Yup.string(),
        approved: Yup.boolean(),
    }
}

export default Form;
