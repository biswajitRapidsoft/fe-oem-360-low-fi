import config from '../config/config'
import services from '../services/services'


const pageData = async(params) => {
    const apiEndPoint = config.baseUrl + config.apiName.pageData

    try{
        const response = await services.get(apiEndPoint, params)
        if(response) {
            return response
        }
    } catch(error) {
        return error
    }
}

const addRecommendation = async(payload) => {
    const apiEndPoint = config.baseUrl + config.apiName.addRecommendation

    try{
        const response = await services.post(apiEndPoint, payload)

        if(response) {
            return response
        }
    } catch(error) {
        return error
    }
}

const RecommendationFormAction = { pageData, addRecommendation }

export default RecommendationFormAction