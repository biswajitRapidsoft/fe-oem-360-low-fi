import config from '../config/config';
import { Services } from "../services/services";

const  Department = async (payload) => {
    const apiEndPoint = config.baseUrl + config.apiEndPoints.getAllDepartment 
   
    const res = await Services.GET(apiEndPoint,{
        ...payload
    });
        if(res) {
            return res;
        }else {
            return null;
        }
    
}



const SubmitApproval =async(payload)=>{

    const apiEndPoint = config.baseUrl + config.apiEndPoints.acceptByAppOwner
    const res = await Services.POST(apiEndPoint,payload);
    if(res){
        return res;

    }else{
        return null;
    }

}




export const AcceptModalAppOwnerAction = {Department,SubmitApproval}