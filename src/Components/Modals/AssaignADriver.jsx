import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  DatePicker,
  TimePicker,
  Select,
} from "antd";
import { useSnapshot } from "valtio";
import state from "../../Store";
import moment from "moment";
import { addSchedule } from "../../Services/ScheduleService";
const { Option } = Select;

const AssignADriver = ({ open, onClose, selectedRequest }) => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const riders = snap.riders;
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const formattedValues = {
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD") : undefined,
        time: values.time ? values.time.format("HH:mm") : undefined,
        ...selectedRequest,
      };
      await addSchedule(formattedValues);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      form.resetFields();
    }
    onClose();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const disabledDate = (current) => {
    // Can not select days before today
    return current && current < moment().startOf("day");
  };

  return (
    <Modal
      title="Create a Schedule for This Request"
      open={open}
      footer={null}
      onCancel={onClose}
    >
      <Form
        form={form}
        name="assign_driver"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          name="riderId"
          rules={[{ required: true, message: "Please input the Rider ID!" }]}
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
          rules={[{ required: true, message: "Please select date!" }]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            disabledDate={disabledDate}
            placeholder="Select date"
          />
        </Form.Item>

        <Form.Item
          name="time"
          rules={[{ required: true, message: "Please select time!" }]}
        >
          <TimePicker format="HH:mm" placeholder="Select time" />
        </Form.Item>

        <Form.Item name="note" rules={[{ required: false }]}>
          <Input.TextArea placeholder="Additional Notes" />
        </Form.Item>

        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AssignADriver;
