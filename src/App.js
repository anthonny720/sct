import './App.css';
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import store, {Persistor} from "./store";
import Error404 from "./containers/errors/Error404";
import Sidebar from "./components/navigation/Sidebar";
import Home from "./containers/Home";
import Login from "./containers/auth/Login";
import ChangePassword from "./containers/auth/Password";
import Users from "./containers/pages/Staff/Users";
import Departments from "./containers/pages/Staff/Departments";
import Tracking from "./containers/pages/Tracking/Tracking";
import Summary from "./containers/pages/Tracking/Summary";
import Outsourcing from "./containers/pages/Tracking/Outsourcing";
import Calendar from "./containers/pages/Tracking/Calendar";

const App = () => {


    return (<Provider store={store}>
            <PersistGate loading={null} persistor={Persistor}>

                <Router>
                    <section className="flex flex-row items-start  max-h-screen ">
                        <Sidebar/>
                        <Routes>
                            {/*Error Display*/}
                            <Route path="*" element={<Error404/>}/>
                            <Route exact path="/home" element={<Home/>}/>

                            {/*Authentication*/}
                            <Route path="/" element={<Login/>}/>
                            <Route path="settings/change-password/" element={<ChangePassword/>}/>

                            {/*Staff*/}
                            <Route path="people" element={<Users/>}/>
                            <Route path="staff/departments" element={<Departments/>}/>

                            {/*Tracking*/}
                            <Route path="attendance" element={<Tracking/>}/>
                            <Route path="summary" element={<Summary/>}/>
                            <Route path="outsourcing" element={<Outsourcing/>}/>
                            <Route path="calendar" element={<Calendar/>}/>
                        </Routes>
                    </section>
                </Router>
            </PersistGate>
        </Provider>


    );
}

export default App;
