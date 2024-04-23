import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  TimePicker,
  message,
  Select,
  Descriptions,
} from "antd";
import {
  fetchSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
} from "../Services/ScheduleService";
import moment from "moment";
import { render } from "@testing-library/react";
import { useSnapshot } from "valtio";
import state from "../Store";
import { EditOutlined, DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import GoogleMapComponent from "./Map/GoogleMapComponent";
const { Option } = Select;

const ScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [form] = Form.useForm();
  const [requestOpend, setRequestOpened] = useState(false);
  const [selectedRecord, setSelectedRequest] = useState();
  const snap = useSnapshot(state);
  const riders = snap.riders;

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    const loadedSchedules = await fetchSchedules();
    setSchedules(loadedSchedules);
  };

  const handleAdd = () => {
    form.resetFields();
    setCurrentSchedule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setCurrentSchedule(record);
    form.setFieldsValue({
      ...record,
      date: moment(record.date),
      time: moment(record.time, "HH:mm"),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteSchedule(id);
    loadSchedules();
    message.success("Schedule deleted successfully");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (values) => {
    const scheduleData = {
      ...values,
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
    };

    if (currentSchedule) {
      await updateSchedule(currentSchedule.id, scheduleData);
      message.success("Schedule updated successfully");
    } else {
      await addSchedule(scheduleData);
      message.success("Schedule added successfully");
    }
    setIsModalOpen(false);
    loadSchedules();
  };

  const columns = [
    {
      title: "Rider ID",
      dataIndex: "riderId",
      key: "riderId",
      render: (_, record) => {
        const rider = riders.find((rider) => rider.id === record.riderId);
        return (
          <p>{rider ? `${rider?.firstName} ${rider?.lastName}` : "N/A"}</p>
        );
      },
    },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Notes", dataIndex: "note", key: "note" },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <React.Fragment>
          <Button
            style={{ marginRight: 8 }}
            onClick={() => {
              setSelectedRequest(record);
              setRequestOpened(true);
            }}
          >
            {<EyeOutlined />}
          </Button>
          <Button style={{ marginRight: 8 }} onClick={() => handleEdit(record)}>
            {<EditOutlined />}
          </Button>

          <Button onClick={() => handleDelete(record.id)} danger type="dashed">
            <DeleteOutlined />
          </Button>
        </React.Fragment>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={schedules} columns={columns} rowKey="id" />

      <Modal
        title={currentSchedule ? "Edit Schedule" : "Add Schedule"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="riderId"
            label="Rider ID"
            rules={[{ required: true, message: "Please input the rider ID!" }]}
          >
            <Select>
              {riders.map((rider) => (
                <Option value={rider?.id} key={rider?.id}>
                  {rider?.firstName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select the date!" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please select the time!" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item name="note" label="Notes">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {selectedRecord && (
        <Modal
          width={1200}
          open={requestOpend}
          footer={null}
          bodyStyle={{ padding: 16 }}
          onCancel={() => {
            setRequestOpened(false);
          }}
        >
          <Descriptions bordered>
            <Descriptions.Item label="Type">
              {selectedRecord?.garbageType}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedRecord?.status}
            </Descriptions.Item>
            <Descriptions.Item label="Vehicle">
              {selectedRecord?.vehicleType}
            </Descriptions.Item>
          </Descriptions>
          <GoogleMapComponent markers={[]} />
        </Modal>
      )}
    </div>
  );
};

export default ScheduleManager;
