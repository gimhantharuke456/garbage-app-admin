import React from "react";
import { Modal, Typography, Select, message } from "antd";
import { updateUser } from "../../Services/UserService";

const { Text } = Typography;
const { Option } = Select;
const RiderDetailsModal = ({
  open,
  onCancel,
  selectedRider,
  fetchUsersFromDb,
}) => {
  const handleStatusChange = async (newStatus, id) => {
    try {
      await updateUser(id, { status: newStatus === "Approved" });
      fetchUsersFromDb();
      message.success("Status updated successfully");
      // Update local state or global state here if needed
    } catch (error) {
      message.error(`Failed to update status: ${error.message}`);
    }
  };
  return (
    <Modal
      width={900}
      title="Rider Details"
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      {selectedRider && (
        <div>
          <p>
            <Text strong>First Name:</Text> {selectedRider.firstName}
          </p>
          <p>
            <Text strong>Last Name:</Text> {selectedRider.lastName}
          </p>
          <p>
            <Text strong>Email:</Text> {selectedRider.email}
          </p>
          <p>
            <Text strong>Role:</Text> {selectedRider.role}
          </p>
          <p>
            <Text strong>NIC:</Text> {selectedRider.nic}
          </p>
          <p>
            <Text strong>Address:</Text> {selectedRider.address}
          </p>

          <p>
            <Text strong>Status: {`  `}</Text>
            <Select
              defaultValue={selectedRider.status ? "Approved" : "Not Approved"}
              style={{ width: 120 }}
              onChange={(value) => handleStatusChange(value, selectedRider.id)}
            >
              <Option value="Approved">Approved</Option>
              <Option value="Not Approved">Reject</Option>
            </Select>
          </p>
        </div>
      )}
    </Modal>
  );
};

export default RiderDetailsModal;
