import React from 'react';
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDispatch} from "react-redux";
import {sync_overtime} from "../../redux/actions/tracking";

const Sync = ({close,}) => {

    const dispatch = useDispatch();

    /*Formik*/
    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object(newSchema()),
        validateOnChange: true,
        onSubmit: (form) => {
            dispatch(sync_overtime(form))
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


            <div className="col-span-6 sm:col-span-3">
                <label htmlFor="date"
                       className={`block mb-2 text-sm font-medium ${!formik.errors.date ? 'text-gray-900' : 'text-red-400'}`}>Fecha</label>
                <input type="date" name="date" id="date"
                       value={formik.values.date}
                       onChange={(value) => formik.setFieldValue('date', value.target.value)}
                       className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 "
                />
            </div>


        </div>
        <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b ">
            <button type="button" onClick={() => formik.handleSubmit()}
                    className="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Guardar
            </button>
        </div>
    </form>);
};

const initialValues = () => {
    return {
        date: new Date(),
    }
}

const newSchema = () => {
    return {
        date: Yup.date().required('La fecha es requerida'),
    }
}

export default Sync;
