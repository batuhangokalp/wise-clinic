import { combineReducers } from 'redux';

import Auth from './auth/reducers';
import Chat from './chat/reducers';
import Layout from './layout/reducer';
import Templates from './template/reducer';
import User from './user/reducer';
import Contact from './contact/reducer';
import Role from './role/reducer';


export default combineReducers({
    Auth,
    Chat,
    Layout,
    Templates,
    User,
    Contact,
    Role
});