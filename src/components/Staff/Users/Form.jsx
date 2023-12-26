import React from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch, useSelector} from "react-redux";
import {map} from "lodash";
import {Switch} from "@headlessui/react";
import {add_staff, update_staff} from "../../../redux/actions/staff";

const Form = ({close, data, params}) => {
    const departments = useSelector(state => state.Staff.departments);
    const dispatch = useDispatch();

    /*Formik*/
    const formik = useFormik({
        initialValues: initialValues(data),
        validationSchema: Yup.object(newSchema()),
        validateOnChange: true,
        onSubmit: (form) => {
            if (form.date_of_farewell === "") {
                form.date_of_farewell = null
            }
            data ? dispatch(update_staff(form, data?.id, params)) : dispatch(add_staff(form, params));
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
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="name"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.name ? 'text-gray-900' : 'text-red-400'}`}>Nombre</label>
                    <input type="text" name="name" id="name" value={formik.values.name}
                           onChange={(value) => formik.setFieldValue('name', value.target.value)}
                           maxLength={50}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                           placeholder="Nombre" required=""/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="last_name"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.last_name ? 'text-gray-900' : 'text-red-400'}`}>Apellido</label>
                    <input type="text" name="last_name" id="last_name" value={formik.values.last_name}
                           maxLength={50}
                           onChange={(value) => formik.setFieldValue('last_name', value.target.value)}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                           placeholder="Apellido" required=""/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="dni"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.dni ? 'text-gray-900' : 'text-red-400'}`}>DNI</label>
                    <input type="text" name="dni" id="dni" value={formik.values.dni}
                           onChange={(value) => formik.setFieldValue('dni', value.target.value)}
                           maxLength={8}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                           placeholder="••••••••" required=""/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="birthday"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.birthday ? 'text-gray-900' : 'text-red-400'}`}>Fecha
                        de nacimiento</label>
                    <input type="date" name="birthday" id="birthday"
                           value={formik.values.birthday}
                           onChange={(value) => formik.setFieldValue('birthday', value.target.value)}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                           placeholder="" required=""/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="email"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.email ? 'text-gray-900' : 'text-red-400'}`}>Correo</label>
                    <input type="email" name="email" id="email" value={formik.values.email}
                           onChange={(value) => formik.setFieldValue('email', value.target.value)}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                           placeholder="Correo" required=""/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="phone"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.phone ? 'text-gray-900' : 'text-red-400'}`}>Celular</label>
                    <input type="phone" name="phone" id="phone" value={formik.values.phone}
                           onChange={(value) => formik.setFieldValue('phone', value.target.value)}
                           maxLength={10}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                           placeholder="+51 XXX XXX XXX" required=""/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="position"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.position ? 'text-gray-900' : 'text-red-400'}`}>Cargo</label>
                    <input type="text" name="position" id="position" value={formik.values.position}
                           onChange={(value) => formik.setFieldValue('position', value.target.value)}
                           maxLength={50}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                           placeholder="" required=""/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="date_of_admission"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.date_of_admission ? 'text-gray-900' : 'text-red-400'}`}>Fecha
                        de
                        ingreso</label>
                    <input type="date" name="date_of_admission" id="date_of_admission"
                           value={formik.values.date_of_admission}
                           onChange={(value) => formik.setFieldValue('date_of_admission', value.target.value)}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                           placeholder="" required=""/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="date_of_farewell"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.date_of_farewell ? 'text-gray-900' : 'text-red-400'}`}>Fecha
                        de
                        salida</label>
                    <input type="date" name="date_of_farewell" id="date_of_farewell"
                           value={formik.values.date_of_farewell}
                           onChange={(value) => formik.setFieldValue('date_of_farewell', value.target.value)}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                           placeholder=""/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="area"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.area ? 'text-gray-900' : 'text-red-400'}`}>Departamento</label>
                    <select onChange={(value) => formik.setFieldValue('area', value.target.value)}
                            defaultValue={formik.values.area}
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                            aria-label="Default select example">
                        <option value={null}>Seleccione un departamento</option>
                        {departments !== null && map(departments, item => (
                            <option key={item.id} value={item.id}>{item.name}</option>))}
                    </select>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="overtime_hours"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.overtime_hours ? 'text-gray-900' : 'text-red-400'}`}>Horas extras</label>
                    <input type="text" name="overtime_hours" id="overtime_hours"
                           value={formik.values.overtime_hours}
                           onChange={(value) => formik.setFieldValue('overtime_hours', value.target.value)}
                           className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                           placeholder=""/>
                </div>
                <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="area"
                           className={`block mb-2 text-sm font-medium ${!formik.errors.status ? 'text-gray-900' : 'text-red-400'}`}>Status</label>
                    <Switch
                        id={'status'}
                        name={'status'}
                        checked={formik.values.status}
                        onChange={() => formik.setFieldValue('status', !formik.values.status)}
                        className={`${formik.values.status ? 'bg-green-600' : 'bg-green-200'} relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                        <span
                            className={`${formik.values.status ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`}
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

const initialValues = (data) => {
    return {
        name: data?.name || '',
        last_name: data?.last_name || '',
        dni: data?.dni || '',
        email: data?.email || '',
        status: data?.status || false,
        phone: data?.phone || '',
        position: data?.position || '',
        date_of_admission: data?.date_of_admission || '',
        date_of_farewell: data?.date_of_farewell || undefined,
        birthday: data?.birthday || undefined,
        area: data?.area || '',
        overtime_hours: data?.overtime_hours || '00:00:00',

    }
}

const newSchema = () => {
    return {
        name: Yup.string().required(),
        last_name: Yup.string().required(),
        dni: Yup.string().min(8).required(),
        email: Yup.string().email(),
        status: Yup.bool().required(),
        phone: Yup.string().required(),
        position: Yup.string().required(),
        date_of_admission: Yup.date().required(),
        birthday: Yup.date(),
        area: Yup.number().required(),
        overtime_hours: Yup.string().required(),

    }
}

export default Form;
