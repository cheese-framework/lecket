import { useContext } from "react";
import LecketContext from "@/context/LecketContext";
import Link from "next/link";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import styles from "@/styles/Buttons.module.css";
import CardLayout from "@/components/container/CardLayout";
import DetailCard from "@/components/cards/DetailCard";
import BarChartCard from "@/components/cards/BarChartCard";
import PieChartCard from "@/components/cards/PieChartCard";
import PartnersTable from "@/components/partners/PartnersTable";
import { groupByKey } from "@/utils/utils";
import customStyle from "@/styles/DetailPage.module.css";

export default function PartnerSummary({ partners }) {
  const { appTheme } = useContext(LecketContext);

  const partnerTypeGrouping = groupByKey(partners.data, "partner_type");
  const accessGrouping = groupByKey(partners.data, "status");

  const cards = [
    <DetailCard
      text={partners ? partners.total : 0}
      value={
        partners.total
          ? partners.total > 1
            ? "Partners"
            : "Partner"
          : "Partner"
      }
      key={Math.random().toString(36)}
    />,
    <BarChartCard
      title="Status"
      labels={["Active", "Inactive"]}
      dataset={[
        accessGrouping.active ? accessGrouping.active.length : 0,
        accessGrouping.inactve ? accessGrouping.inactve.length : 0,
      ]}
      key={Math.random().toString(36)}
    />,
    <PieChartCard
      title="Partners"
      labels={["Strategic", "Paid", "FSP"]}
      dataset={[
        partnerTypeGrouping.strategic
          ? partnerTypeGrouping.strategic.length
          : 0,
        partnerTypeGrouping.paid ? partnerTypeGrouping.paid.length : 0,
        partnerTypeGrouping.fsp ? partnerTypeGrouping.fsp.length : 0,
      ]}
      key={Math.random().toString(36)}
    />,
  ];

  return (
    <div className={`${customStyle.view_edit} ${appTheme}`}>
      <Box>
        <CardLayout cards={cards} />
        <Grid container spacing={2}>
          <div className={customStyle.header}>
            <h1 className={customStyle.name}></h1>
            <Link href="/partners/add" passHref>
              <Button
                className={`${customStyle.back} ${styles.btn_primary} button`}
              >
                Add Partner
              </Button>
            </Link>
          </div>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <PartnersTable partners={partners} />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
