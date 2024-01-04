import React, {useEffect} from 'react';
import Tree from "../../../components/Staff/Departments/Tree";
import {useDispatch, useSelector} from "react-redux";
import {get_departments} from "../../../redux/actions/staff";
import {Navigate} from "react-router-dom";

const Departments = () => {
    const dispatch = useDispatch();
    const payload = useSelector(state => state.Staff.departments);
    const user = useSelector(state => state.Auth?.user);

    useEffect(() => {
        dispatch(get_departments());
    }, [dispatch]);


    if (user && user.permissions !== 'EDITOR') return <Navigate to='/home'/>;
    return (<div className="mx-auto container bg-white ">
        <Tree items={payload}/>
    </div>);
};

export default Departments;
