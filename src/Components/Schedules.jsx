import React, { useEffect, useState } from "react";
import { Table, Space, Button, Modal } from "antd";
import { useSnapshot } from "valtio";
import state from "../Store";
import { fetchRequestsPending } from "../Services/RequestService";
import GoogleMapComponent from "./Map/GoogleMapComponent";
import { PoundOutlined } from "@ant-design/icons";
import AssaignADriver from "./Modals/AssaignADriver";

const Schedules = () => {
  const snap = useSnapshot(state);
  const [locationOpened, setLocationOpened] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState();
  const [markers, setMarkers] = useState([]);
  const [shceduleModalOpend, setScheduleModalOpend] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    const requests = await fetchRequestsPending();
    state.requests = requests;
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "garbageType",
      key: "garbageType",
    },

    {
      title: "Vehicle",
      dataIndex: "vehicleType",
      key: "vehicleType",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedRequest(record);
              setLocationOpened(true);
            }}
          >
            <PoundOutlined />
          </Button>
        </Space>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => {
              setSelectedRequest(record);
              setScheduleModalOpend(true);
            }}
          >
            Schedule
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Schedules (Pending Requests)</h2>
      <Table
        dataSource={snap.requests}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
      {selectedRequest && (
        <Modal
          footer={null}
          onCancel={() => {
            setLocationOpened(false);
          }}
          destroyOnClose
          open={locationOpened}
        >
          <GoogleMapComponent markers={markers} />
        </Modal>
      )}
      <AssaignADriver
        open={shceduleModalOpend}
        onClose={() => {
          setScheduleModalOpend(false);
        }}
        selectedRequest={selectedRequest}
      />
    </div>
  );
};

export default Schedules;
