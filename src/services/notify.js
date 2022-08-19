import 'react-notifications/lib/notifications.css';
import { NotificationManager } from 'react-notifications';

export const notify = {
    success: (msg,title='',timeout=5000) => {
        if(title!==''){
            NotificationManager.warning(msg,title,timeout);
        }else {
            NotificationManager.success(msg, 'Success', timeout);
        }
    },
    error: (msg,title='',timeout=5000) => {
        if(title!==''){
            NotificationManager.warning(msg,title,timeout);
        }else {
            NotificationManager.error(msg, 'Error', timeout);
        }
    },
    warn: (msg,title='',timeout=5000) => {
        if(title!==''){
            NotificationManager.warning(msg,title,timeout);
        }else{
            NotificationManager.warning(msg,'Warning',timeout);
        }

    },
    info: (msg,title='',timeout=5000) => {
        if(title!==''){
            NotificationManager.warning(msg,title,timeout);
        }else {
            NotificationManager.info(msg, 'Information', timeout);
        }
    }
    /*This Is Toasty Notifation*/
};
