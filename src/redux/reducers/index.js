import {combineReducers} from "redux";
import Staff from "./staff";
import Alert from "./alert";
import Tracking from "./tracking";
import Auth from "./auth";


export default combineReducers({
    Staff, Alert, Tracking,Auth
});
