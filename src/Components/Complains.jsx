import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import { fetchComplains } from "../Services/ComplainsService";
import jsPDF from "jspdf";
import { render } from "@testing-library/react";
import ShowUserDetails from "./ShowUserDetails";

const Complains = () => {
  const [complains, setComplains] = useState([]);

  useEffect(() => {
    const loadComplains = async () => {
      try {
        const data = await fetchComplains();
        setComplains(data);
      } catch (error) {
        console.error("Failed to fetch complains:", error);
      }
    };

    loadComplains();
  }, []);

  const columns = [
    { title: "Complain ID", dataIndex: "id", key: "id" },
    {
      title: "User Id",
      dataIndex: "uid",
      key: "uid",
      render: (uid) => <ShowUserDetails id={uid} />,
    },
    { title: "Complain", dataIndex: "complain", key: "complain" },
  ];

  const exportPDF = () => {
    const unit = "pt";
    const size = "A4"; // Use A3, A4, A5, B3, B4, B5, etc.
    const orientation = "portrait"; // portrait or landscape

    const doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(12);
    const title = "Complains Report";
    const headers = [["Complain ID", "Complain", "Uid"]];

    const data = complains.map((elt) => [elt.id, elt.complain, elt.uid]);

    let content = {
      startY: 50,
      head: headers,
      body: data,
    };

    doc.text(title, 40, 40);
    doc.autoTable(content);
    doc.save("complains_report.pdf");
  };

  return (
    <div>
      <Button type="primary" onClick={exportPDF} style={{ marginBottom: 16 }}>
        Export to PDF
      </Button>
      <Table dataSource={complains} columns={columns} rowKey="id" />
    </div>
  );
};

export default Complains;
