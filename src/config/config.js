const config = {
  // baseUrl: "http://localhost:9092/",
  baseUrl: "http://192.168.12.54:9092/",
  // baseUrl: "http://192.168.12.16:9092/",

  apiEndPoints: {
    login: "user/v1/signIn",
    pageData: "recommendation/page/data",
    addRecommendation: "recommendation/create",
    getAllRecommendation: "recommendation/view/details/agmAndoem",
    getAllApprovedRecommendationForAppOwner:
      "recommendation/approved/details/for/appowner",
    getAllPendingRecommendationForAppOwner:
      "recommendation/pending/details/for/appowner",
    getNotifications: "notification/pending/request",
    notificationMarkSeen: "notification/mark/seen",
    rejectByAppOwner: "recommendation/rejected/by/appowner",
    getAllDepartment: "department/get/all",
    acceptByAppOwner: "recommendation/deplyoment/details/provide",
    rejectByAgm: "recommendation/reject/by/agm",
    approveByAgm: "recommendation/request/accept/by/agm",
    revertByAgm: "recommendation/reject/request/revert/by/agm",
    dashboardDetails: "dashboard/details",
    getAllStatus: "status/get/all",
    updateStatus: "recommendation/status/update",
  },
};

export default config;
