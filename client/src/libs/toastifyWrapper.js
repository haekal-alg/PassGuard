//import { toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

const DELAY = 3000;

export function update(toastObj, toastID, message, type) {
    toastObj.update(toastID, { render: message, type: type });
    setTimeout(() => { toastObj.dismiss(toastID); }, DELAY);
}
