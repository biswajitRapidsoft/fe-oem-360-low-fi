import config from '../config/config';
import { Services } from "../services/services";



const  submit = async (payload) => {
    const apiEndPoint = config.baseUrl + config.apiEndPoints.addRecommendation

   


    const res = await Services.OEMFORM_POST(apiEndPoint, payload);
        if(res) {
            return res;
        }else {
            return null;
        }
    
}

const allData = async (payload) => {
    const apiEndPoint = config.baseUrl + config.apiEndPoints.pageData

   


    const res = await Services.GET(apiEndPoint, {...payload});
        if(res) {
            return res;
        }else {
            return null;
        }
}

export const OemFormAction = {submit,allData}