//import { toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';

const DELAY = 2000;

function update(toastObj, toastID, message, type) {
    toastObj.update(toastID, { render: message, type: type });
    setTimeout(() => { toastObj.dismiss(toastID); }, DELAY);
}

module.exports.update = update;