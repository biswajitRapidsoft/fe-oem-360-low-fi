import config from '../config/config';
import { Services } from "../services/services";



const  SubmitRejectAgm = async (payload) => {
    const apiEndPoint = config.baseUrl + config.apiEndPoints.rejectByAgm


    const res = await Services.POST(apiEndPoint, payload);
        if(res) {
            return res;
        }else {
            return null;
        }
    
}


const  SubmitRejectAppOwner = async (payload) => {
    const apiEndPoint = config.baseUrl + config.apiEndPoints.rejectByAppOwner

   


    const res = await Services.POST(apiEndPoint, payload);
        if(res) {
            return res;
        }else {
            return null;
        }
    
}













export const RejectModalAction = {SubmitRejectAgm,SubmitRejectAppOwner}