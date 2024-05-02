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
} from "antd";
import moment from "moment";
import {
  fetchSchedules,
  addSchedule,
  updateSchedule,
  deleteSchedule,
} from "../Services/NormalSchedules";
import { useSnapshot } from "valtio";
import state from "../Store";
import { render } from "@testing-library/react";
import ShowUserDetails from "./ShowUserDetails";

const { Option } = Select;

const NormalSchedules = () => {
  const snap = useSnapshot(state);
  const riders = snap.riders;
  const [schedules, setSchedules] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const loadedSchedules = await fetchSchedules();
      setSchedules(loadedSchedules);
    } catch (error) {
      console.error("Failed to fetch schedules:", error);
    }
  };

  const handleAdd = () => {
    form.resetFields();
    setCurrentSchedule(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setCurrentSchedule(record);
    form.setFieldsValue({
      riderId: record.riderId,
      date: moment(record.date),
      time: moment(record.time, "HH:mm"),
      location: record.location,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSchedule(id);
      loadSchedules();
      message.success("Schedule deleted successfully");
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      message.error("Failed to delete schedule");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (values) => {
    const scheduleData = {
      riderId: values.riderId,
      date: values.date.format("YYYY-MM-DD"),
      time: values.time.format("HH:mm"),
      location: values.location,
      status: "Pending", // Default status is set to "Pending"
    };

    try {
      if (currentSchedule) {
        await updateSchedule(currentSchedule.id, scheduleData);
        message.success("Schedule updated successfully");
      } else {
        await addSchedule(scheduleData);
        message.success("Schedule added successfully");
      }
      loadSchedules();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save schedule:", error);
      message.error("Failed to save schedule");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateSchedule(id, { status });
      message.success("Status updated successfully");
      loadSchedules();
    } catch (error) {
      console.error("Failed to update status:", error);
      message.error("Failed to update status");
    }
  };

  const columns = [
    {
      title: "Rider Details",
      dataIndex: "riderId",
      key: "riderId",
      render: (riderId) => <ShowUserDetails id={riderId} />,
    },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Time", dataIndex: "time", key: "time" },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Select
          defaultValue={text}
          style={{ width: 120 }}
          onChange={(value) => handleStatusUpdate(record.id, value)}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Completed">Completed</Option>
          <Option value="Cancelled">Cancelled</Option>
        </Select>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <React.Fragment>
          <Button style={{ marginRight: 8 }} onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(record.id)} danger>
            Delete
          </Button>
        </React.Fragment>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleAdd}>
        Add Schedule
      </Button>
      <Table dataSource={schedules} columns={columns} rowKey="id" />

      <Modal
        title={currentSchedule ? "Edit Schedule" : "Add Schedule"}
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit}>
          <Form.Item
            name="riderId"
            label="Rider ID"
            rules={[{ required: true, message: "Please input rider ID" }]}
          >
            <Select>
              {riders.map((rider) => (
                <Option value={rider.id}>{rider.firstName}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select date" }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please select time" }]}
          >
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true, message: "Please input location" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NormalSchedules;
