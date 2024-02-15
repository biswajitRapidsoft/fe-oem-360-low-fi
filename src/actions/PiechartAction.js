import config from '../config/config';
import { Services } from "../services/services";

const pieChart = async (payload) => {
    const apiEndPoint = config.baseUrl + config.apiEndPoints.dashboardDetails
   
    const res = await Services.GET(apiEndPoint,{
        ...payload
    });
        if(res) {
            return res;
        }else {
            return null;
        }
    
}

const agmData = async () => {
    const apiEndPoint = config.baseUrl + config.apiEndPoints.getAllRecommendation
   
    const res = await Services.GET(apiEndPoint);
        if(res) {
            return res;
        }else {
            return null;
        }
    
}


const appownerData = async () => {
    const apiEndPoint = config.baseUrl + config.apiEndPoints.getAllPendingRecommendationForAppOwner
   
    const res = await Services.GET(apiEndPoint);
        if(res) {
            return res;
        }else {
            return null;
        }
    
}

const approvedAppownerData = async () => {
    const apiEndPoint = config.baseUrl + config.apiEndPoints.getAllApprovedRecommendationForAppOwner
   
    const res = await Services.GET(apiEndPoint);
        if(res) {
            return res;
        }else {
            return null;
        }
    
}
















export const PiechartAction = {pieChart,agmData,appownerData,approvedAppownerData}