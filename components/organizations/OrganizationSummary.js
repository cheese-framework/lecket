import { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import CardLayout from "@/components/container/CardLayout";
import DetailCard from "@/components/cards/DetailCard";
import PieChartCard from "@/components/cards/PieChartCard";
import OrganizationTable from "@/components/organizations/OrganizationTable";
import { API_URL } from "@/config/index";
import Axios from "axios";

export default function OrganizationSummary({ totalOrganizations, userData }) {
  const [totalInActiveOrg, setTotalInActiveOrg] = useState(0);
  const [totalActiveOrg, setTotalActiveOrg] = useState(0);

  const loadOrgSegmentData = async () => {
    try {
      const response = await Axios.get(
        `${API_URL}/afrijula/afrijula/dashboard`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `token ${userData.auth_token}`,
            UserProfile: userData.profile,
            UserKey: userData.UserKey,
            "X-Requested-With": "XMLHttpRequest",
          },
        }
      );
      if (response.status === 200) {
        const data = response.data.counts.active_inactive_orgs;
        setTotalInActiveOrg(data.inactive);
        setTotalActiveOrg(data.active);
      }
    } catch (err) {}
  };

  useEffect(() => {
    loadOrgSegmentData();
  }, []);

  const cards = [
    <DetailCard
      text={totalOrganizations}
      value={totalOrganizations > 1 ? "Subscribers" : "Subscriber"}
      key={Math.random().toString(36)}
    />,
    <PieChartCard
      labels={["Active", "Inactve"]}
      title="Subscribers"
      dataset={[totalActiveOrg, totalInActiveOrg]}
      key={Math.random().toString(36)}
    />,
  ];

  return (
    <Box>
      <CardLayout cards={cards} />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <OrganizationTable userData={userData} />
        </Grid>
      </Grid>
    </Box>
  );
}
