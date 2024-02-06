import React, { useEffect, useState } from "react";
import RecommendationTable from "../RecommendationTable/RecommendationTable";
import RecommendationForm from "../RecommendationForm/RecommendationForm";

import DashboardAction from "../../actions/dashboardAction";
import {
  ACTION_TYPE_TABLE,
  AGM,
  APPLICATION_OWNER,
  GM_IT_INFRA,
  OEM_SI,
  VIEW_TYPE_TABLE,
} from "../../helper/constant";
import Overview from "../Overview/Overview";
import ComponentHeader from "../ComponentHeader/ComponentHeader";
import AppLoader from "../AppLoader/AppLoader";

const Dashboard = () => {
  const loginData = JSON.parse(sessionStorage.getItem("loginData"));
  const userType = loginData?.userType || "";
  const [isLoading, setIsLoading] = useState(false);
  const [isOemAndIt, setIsOemAndIt] = useState(false);
  const [isAllowedOnViewTable, setIsAllowedOnViewTable] = useState(false);
  const [isAllowedOnActionTable, setIsAllowedOnActionTable] = useState(false);
  const [isAllowedOverview, setIsAllowedOverview] = useState(false);
  const [recommendationsOemAndAgmData, setRecommendationsOemAndAgmData] =
    useState([]);
  const [
    pendingRecommendationForAppOwnerAllData,
    setPendingRecommendationForAppOwnerAllData,
  ] = useState([]);
  const [
    approvedRecommendationForAppOwnerAndGmItInfraAllData,
    setApprovedRecommendationForAppOwnerAndGmItInfraAllData,
  ] = useState([]);

  const [overviewData, setOverviewData] = useState([]);

  // console.log(' logged user data', loginData)
  // console.log(" checking renders");

  useEffect(() => {
    if (userType) {
      if (
        userType === OEM_SI ||
        userType === APPLICATION_OWNER ||
        userType === GM_IT_INFRA
      ) {
        setIsAllowedOnViewTable(true);
      } else {
        setIsAllowedOnViewTable(false);
      }

      if (userType === APPLICATION_OWNER || userType === AGM) {
        setIsAllowedOnActionTable(true);
      } else {
        setIsAllowedOnActionTable(false);
      }

      if (userType === OEM_SI || userType === GM_IT_INFRA) {
        setIsOemAndIt(true);
      } else {
        setIsOemAndIt(false);
      }

      if (userType === AGM || userType === GM_IT_INFRA) {
        setIsAllowedOverview(true);
      } else {
        setIsAllowedOverview(false);
      }
    }
  }, [loginData]);

  const fetchAllPendingRecommendationForAppOwner = async () => {
    try {
      setIsLoading(true);
      const response =
        await DashboardAction.allPendingRecommendationForAppOwner();

      if (response && (response.status === 200 || response.status === 201)) {
        const responseData = response?.data?.data || "";
        const pendingRecommendationsAllData =
          responseData?.pendingRecommendation || [];
        // console.log('Pending Res:  ', pendingRecommendationsAllData)

        setPendingRecommendationForAppOwnerAllData(
          pendingRecommendationsAllData
        );
      }
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllApprovedRecommendationForAppOwner = async () => {
    try {
      setIsLoading(true);
      const response =
        await DashboardAction.allApprovedRecommendationForAppOwnerAndGmItInfra();

      if (response && (response.status === 200 || response.status === 201)) {
        const responseData = response?.data?.data || "";

        const approvedRecommendationsAllData =
          responseData?.approvedRecommendation || [];
        // console.log('approved Res:  ', approvedRecommendationsAllData)
        // console.log('AppOwner recommend table data', responseData)

        setApprovedRecommendationForAppOwnerAndGmItInfraAllData(
          approvedRecommendationsAllData
        );
      }
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendationAgmAndOem = async () => {
    // const params = {

    // }

    try {
      setIsLoading(true);
      const response = await DashboardAction.recommendationAgnAndOem();

      if (response && (response.status === 200 || response.status === 201)) {
        const recommendationsAllData = response?.data?.data || "";
        const recommendations = recommendationsAllData?.recommendations || [];

        // console.log('response', response)
        // console.log(' OEM recommendations:  ', recommendationsAllData)
        // console.log('recommendations:  ', recommendations)

        setRecommendationsOemAndAgmData(recommendations);
      }
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDashboardDetails = async (selectedFilter) => {
    const params = {
      value: selectedFilter,
    };

    // console.log("params", params);

    try {
      setIsLoading(true);
      const response = await DashboardAction.funcDashboardDetails(params);

      if (response && (response.status === 200 || response.status === 201)) {
        const dashBoardOverviewData = response?.data?.data || null;
        // console.log(" dashboard details response:  ", dashBoardOverviewData);
        setOverviewData(dashBoardOverviewData);
      }
    } catch (error) {
      console.error(" dashboard details res negetive:  ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userType) {
      if (userType === OEM_SI || userType === AGM || userType === GM_IT_INFRA) {
        fetchRecommendationAgmAndOem(); //OEM_SI VIEW  &  AGM ACTION
      }

      if (userType === APPLICATION_OWNER) {
        fetchAllPendingRecommendationForAppOwner(); //APP_OWNER ACTION
        fetchAllApprovedRecommendationForAppOwner();
      }
    }

    const intervalRecommendations = setInterval(() => {
      if (userType) {
        if (
          userType === OEM_SI ||
          userType === AGM ||
          userType === GM_IT_INFRA
        ) {
          fetchRecommendationAgmAndOem(); //OEM_SI VIEW  &  AGM ACTION
        }

        if (userType === APPLICATION_OWNER) {
          fetchAllPendingRecommendationForAppOwner(); //APP_OWNER ACTION
          fetchAllApprovedRecommendationForAppOwner();
        }
      }
    }, 20000);

    return () => clearInterval(intervalRecommendations);
  }, [userType]);

  return (
    <>
      {/* <AppLoader isLoading={isLoading} /> */}
      <div
        style={{
          width: "90%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "110px 0 10px 0",
        }}
      >
        {/* <Navbar /> */}
        <ComponentHeader />

        {userType === OEM_SI ? (
          <RecommendationForm
            fetchRecommendationAgmAndOem={fetchRecommendationAgmAndOem}
          />
        ) : null}

        {isAllowedOverview ? (
          <Overview
            fetchDashboardDetails={fetchDashboardDetails}
            overviewData={overviewData}
          />
        ) : null}

        {isAllowedOnActionTable ? (
          <RecommendationTable
            tableData={
              userType === AGM
                ? recommendationsOemAndAgmData
                : userType === APPLICATION_OWNER
                ? pendingRecommendationForAppOwnerAllData
                : []
            }
            tableTitle={
              userType === APPLICATION_OWNER
                ? "Pending recommendations"
                : userType === AGM
                ? "List of approvals"
                : ""
            }
            tableType={ACTION_TYPE_TABLE}
            isOemAndIt={isOemAndIt}
            fetchAllPendingRecommendationForAppOwner={
              fetchAllPendingRecommendationForAppOwner
            }
            fetchAllApprovedRecommendationForAppOwner={
              fetchAllApprovedRecommendationForAppOwner
            }
            fetchRecommendationAgmAndOem={fetchRecommendationAgmAndOem}
          />
        ) : null}

        {isAllowedOnViewTable ? (
          <RecommendationTable
            tableData={
              userType === OEM_SI || userType === GM_IT_INFRA
                ? recommendationsOemAndAgmData
                : userType === APPLICATION_OWNER
                ? approvedRecommendationForAppOwnerAndGmItInfraAllData
                : []
            }
            tableTitle={"Recommendation status"}
            tableType={VIEW_TYPE_TABLE}
            isOemAndIt={isOemAndIt}
          />
        ) : null}
      </div>
    </>
  );
};

export default Dashboard;
