import React, { useEffect, useState } from "react";
import Oemform from "./Oemform";
// disecting the modules based on user type

// importing the types of table
import {
  ACTION_TYPE_TABLE,
  APPLICATION_OWNER,
  GM_IT_INFRA,
  OEM_SI,
  VIEW_TYPE_TABLE,
  AGM,
} from "../constants/constant";

import { dashAction } from "../actions/dashAction";
import { Box } from "@mui/material";
import ParentTable from "./ParentTable";
import Navbar from "./Navbar";
import PieChart from "./PieChart";

const Dash = () => {
  // useState for displaying a particular type of table
  const [actionTable, setActionTable] = useState(false);
  const [viewtable, setViewTable] = useState(false);
  // console.log(viewtable, "viewtable response");
  // console.log(actionTable, "action table reponse");

  // data for table mapping
  const [tableDataForOemAndAgm, setTableDataForOemAndAgm] = useState([]);

  const [approvedTableData, setApprovedTableData] = useState([]);

  const [pendingTableData, setPendingTableData] = useState([]);

  // GMIT AND OEM
  const [oemAndGm, setOemAndGm] = useState(false);

  const [birdEye, setBirdEye] = useState(false);
  console.log("bird eye", birdEye);

  const loginInformation = JSON.parse(sessionStorage.getItem("loginresponse"));
  // console.log("loginInformation", loginInformation);

  const usertype = loginInformation.userType;

  // function to check type of user

  // useEffect(() => {
  //   const typeOfUser = () => {
  //     usertype
  //       ? usertype === OEM_SI ||
  //         usertype === APPLICATION_OWNER ||
  //         usertype === GM_IT_INFRA
  //         ? setViewTable(true)
  //         : setViewTable(false)
  //       : console.log("User type not available.");
  //     // passedexperience key
  //     usertype
  //       ? usertype === APPLICATION_OWNER || usertype === AGM
  //         ? setActionTable(true)
  //         : setActionTable(false)
  //       : console.log("no such user");
  //     usertype
  //       ? usertype === OEM_SI || usertype === GM_IT_INFRA
  //         ? setOemAndGm(true)
  //         : setOemAndGm(false)
  //       : console.log("no such user");
  //     usertype
  //       ? usertype === AGM || usertype === GM_IT_INFRA
  //         ? setBirdEye(true)
  //         : setBirdEye(false)
  //       : "nothing to do";
  //   };
  //   typeOfUser();
  // }, [loginInformation]);

  // function to check type of user

  useEffect(() => {
    if (usertype) {
      if (
        usertype === OEM_SI ||
        usertype === APPLICATION_OWNER ||
        usertype === GM_IT_INFRA
      ) {
        setViewTable(true);
      } else {
        setViewTable(false);
      }

      if (usertype === APPLICATION_OWNER || usertype === AGM) {
        setActionTable(true);
      } else {
        setActionTable(false);
      }

      if (usertype === OEM_SI || usertype === GM_IT_INFRA) {
        setOemAndGm(true);
      } else {
        setOemAndGm(false);
      }

      if (usertype === AGM || usertype === GM_IT_INFRA) {
        setBirdEye(true);
      } else {
        setBirdEye(false);
      }
    }
  }, [loginInformation, usertype]);

  // functions for tabledata  for different users
  // agm and oem
  const fetchTableDataOemAndAgm = async () => {
    try {
      const res = await dashAction.agmAndOemRecommendation();
      if (res.status === 200) {
        const recommendations = res?.data?.data?.recommendations || [];

        setTableDataForOemAndAgm(recommendations);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // appowner and gm/it(data for approved recommendation table for app owner)

  const fetchTableDataForApprovedRecommendations = async () => {
    try {
      const res = await dashAction.approvedTableDataForAppOwner();

      if (res.status === 200) {
        const approvedData = res?.data?.data?.approvedRecommendation || [];
        setApprovedTableData(approvedData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTableDataForPendingRecommendations = async () => {
    try {
      const res = await dashAction.pendingTableDataForAppOwner();

      if (res.status === 200) {
        const pendingData = res?.data?.data?.pendingRecommendation || [];
        setPendingTableData(pendingData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // time to call the functions

  useEffect(() => {
    const fetchData = () => {
      if (usertype === OEM_SI || usertype === AGM || usertype === GM_IT_INFRA) {
        fetchTableDataOemAndAgm();
      }
      if (usertype === APPLICATION_OWNER) {
        fetchTableDataForPendingRecommendations();
      }
      if (usertype === APPLICATION_OWNER) {
        fetchTableDataForApprovedRecommendations();
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000);
    return () => clearInterval(interval);
  }, [usertype]);

  if (!usertype) {
    return null;
  }
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      {/* <Oemform /> */}
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          top: 0,
          zIndex: 999,
          // marginBottom: "2rem",
        }}
      >
        <Navbar />
      </Box>
      <Box sx={{ width: "90%", marginTop: "5.3em" }}>
        {usertype === OEM_SI ? (
          <Oemform fetchTableDataOemAndAgm={fetchTableDataOemAndAgm} />
        ) : null}
        {usertype === AGM || usertype === GM_IT_INFRA ? <PieChart /> : null}

        {actionTable ? (
          <ParentTable
            tableData={
              usertype === AGM
                ? tableDataForOemAndAgm
                : usertype === APPLICATION_OWNER
                ? pendingTableData
                : []
            }
            tableType={ACTION_TYPE_TABLE}
            tableTitle={
              usertype === APPLICATION_OWNER
                ? "Pending Recommendations"
                : usertype === AGM
                ? "List of approvals"
                : ""
            }
          />
        ) : (
          ""
        )}

        {viewtable ? (
          <ParentTable
            tableData={
              usertype === OEM_SI
                ? tableDataForOemAndAgm
                : usertype === APPLICATION_OWNER
                ? approvedTableData
                : usertype === GM_IT_INFRA
                ? tableDataForOemAndAgm
                : []
            }
            tableType={VIEW_TYPE_TABLE}
            isOemandGm={oemAndGm}
            tableTitle={
              usertype === APPLICATION_OWNER ||
              usertype === OEM_SI ||
              GM_IT_INFRA
                ? "Recommendation Status"
                : ""
            }
          />
        ) : (
          ""
        )}
      </Box>
    </Box>
  );
};

export default Dash;
