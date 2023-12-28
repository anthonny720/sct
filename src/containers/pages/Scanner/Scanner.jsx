import React, {useState} from 'react';
import {ClockIcon} from "@heroicons/react/24/outline";
import {Helmet} from "react-helmet";
import Layout from "../../../hocs/Layout";
import BarcodeScannerComponent from "react-barcode-scanner-updated";
import {Switch} from "@headlessui/react";

const Scanner = () => {
    const [data, setData] = useState("Not Found");
    const [isCameraOn, setIsCameraOn] = useState(true); // Puedes establecer el estado inicial según tus necesidades

    const options = [{id: 'check_in', label: 'Ingreso', icon: <ClockIcon className="h-5 w-5"/>}, {
        id: 'lunch_start', label: 'Ingreso receso', icon: <ClockIcon className="h-5 w-5"/>
    }, {id: 'lunch_end', label: 'Salida receso', icon: <ClockIcon className="h-5 w-5"/>}, {
        id: 'check_out', label: 'Salida', icon: <ClockIcon className="h-5 w-5"/>
    },];

    const handleScannerUpdate = (err, result) => {
        if (result) {
            setData(result.text);
        } else {
            setData("");
        }
    };

    const toggleCamera = () => {
        setIsCameraOn(prevState => !prevState);
    };

    return (<Layout>
        <Helmet>
            <title>Scanner</title>
        </Helmet>

        {/* Botón para encender/apagar la cámara */}
        <Switch
            checked={isCameraOn}
            onChange={setIsCameraOn}
            className={`${isCameraOn ? 'bg-teal-900' : 'bg-teal-700'}
          relative inline-flex h-[38px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white/75`}
        >
            <span className="sr-only">Use setting</span>
            <span
                aria-hidden="true"
                className={`${isCameraOn ? 'translate-x-9' : 'translate-x-0'}
            pointer-events-none inline-block h-[34px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
            />
        </Switch>

        {isCameraOn && (<BarcodeScannerComponent
            width={500}
            height={500}
            onUpdate={handleScannerUpdate}
        />)}
        <p className={"text-green-400"}>Resultado:{data}</p>
    </Layout>);
};

export default Scanner;

