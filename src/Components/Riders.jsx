import React, { useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Space,
  Modal,
  Form,
  Input,
  Switch,
} from "antd";
import { deleteUser, addUser, updateUser } from "../Services/UserService";
import { useSnapshot } from "valtio";
import state from "../Store";
import {
  DeleteOutlined,
  EyeFilled,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import RiderDetailsModal from "./Modals/RiderDetailsModal";

const Riders = ({ fetchUsersFromDb }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRider, setCurrentRider] = useState(null);
  const [form] = Form.useForm();
  const [viewRiderModalOpened, setViewRiderModalOpened] = useState(false);
  const [selectedRider, setSelectedRider] = useState();
  const snap = useSnapshot(state);
  // Function to handle delete operation
  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsersFromDb();
      message.success("Rider deleted successfully");
    } catch (error) {
      message.error("Failed to delete rider: " + error.message);
    }
  };

  const showModal = (rider) => {
    form.setFieldsValue(rider ? rider : { status: false });
    setCurrentRider(rider);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };
  const handleFormSubmit = async (values) => {
    try {
      if (currentRider) {
        await updateUser(currentRider.id, {
          ...values,
          role: "Rider",
        });
      } else {
        addUser({
          ...values,
          role: "Rider",
        });
      }
      fetchUsersFromDb();
      setIsModalVisible(false);
      message.success(
        "Rider " + (currentRider ? "updated" : "added") + " successfully"
      );
    } catch (error) {
      message.error("Operation failed: " + error.message);
    }
    //form.resetFields();
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (status ? "Approved" : "Not Approved"),
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "NIC",
      dataIndex: "nic",
      key: "nic",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button onClick={() => showModal(record)} type="dashed">
            <EditOutlined />
          </Button>
          <Button
            onClick={() => {
              setSelectedRider(record);
              setViewRiderModalOpened(true);
            }}
            type="dashed"
          >
            <EyeFilled />
          </Button>
          <Popconfirm
            title="Are you sure delete this rider?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button
        onClick={() => showModal(null)}
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
      >
        Add Rider
      </Button>
      <Table columns={columns} dataSource={snap.riders} rowKey="id" />
      <Modal
        title={currentRider ? "Edit Rider" : "Add Rider"}
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleFormSubmit} layout="vertical">
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="nic" label="NIC" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status" valuePropName="checked">
            <Switch />
          </Form.Item>
          <p>Note: Default Password for rider is rider123</p>
        </Form>
      </Modal>
      <RiderDetailsModal
        fetchUsersFromDb={fetchUsersFromDb}
        open={viewRiderModalOpened}
        onCancel={() => {
          setViewRiderModalOpened(false);
        }}
        selectedRider={selectedRider}
      />
    </div>
  );
};

export default Riders;
