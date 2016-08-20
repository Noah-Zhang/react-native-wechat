import Welcome from './scenes/Welcome';
import Messages from './scenes/Messages';
import ChatPage from './scenes/ChatPage';
import Contacts from './scenes/Contacts';
import Login from './scenes/Login';
import Register from './scenes/Register';
export default {

    welcome: {
        title: 'GeoVis',
        component: Welcome,//require().default,

    },
    messages: {
        title: 'Messages',
        component: Messages,
        children: {
            chatpage: {
                title: 'ChatPage',
                component: ChatPage
            }
        }
    },
    login:{
        initialRoute: true,
        title:'Login',
        component:Login
    },
    register:{
        title:'Register',
        component:Register
    },
    contacts:{
        title:'Contacts',
        component:Contacts,
        children: {
            chatpage: {
                title: 'ChatPage',
                component: ChatPage 
            }
        }
    }

}