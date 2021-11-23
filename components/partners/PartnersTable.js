import useRouter from "next/router";
import Table from "@/components/container/Table";

export default function PartnersTable({ partners }) {
  const loadDetails = (rowData) => {
    const id = rowData._id.$oid;
    useRouter.push(`/partners/${id}`);
  };

  const columns = [
    {
      title: "Name",
      field: "name",
    },
    {
      title: "Contact Person",
      field: "contact_person",
    },
    {
      title: "Type",
      field: "partner_type",
    },
    {
      title: "Status",
      field: "status",
    },
  ];

  return (
    <Table
      title="Partners"
      columnsData={columns}
      dataset={partners.data}
      method={loadDetails}
    />
  );
}
