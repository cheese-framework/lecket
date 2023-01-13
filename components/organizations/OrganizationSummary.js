import { Box, Grid } from "@mui/material";
import CardLayout from "@/components/container/CardLayout";
import DetailCard from "@/components/cards/DetailCard";
import OrganizationTable from "@/components/organizations/OrganizationTable";

export default function OrganizationSummary({
  totalOrganizations,
  userData,
  webSubs,
  appSubs,
  customers,
}) {
  const cards = [
    <DetailCard
      text={totalOrganizations}
      value={totalOrganizations > 1 ? "Total Subscribers" : "Total Subscriber"}
      key={Math.random().toString(36)}
    />,
    <DetailCard
      text={webSubs}
      value={webSubs > 1 ? "Total Web Subscribers" : "Total Web Subscriber"}
      key={Math.random().toString(36)}
    />,
    <DetailCard
      text={appSubs}
      value={appSubs > 1 ? "Total App Merchants" : "Total App Merchant"}
      key={Math.random().toString(36)}
    />,
    <DetailCard
      text={customers}
      value={customers > 1 ? "Total Customers" : "Total Customer"}
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
