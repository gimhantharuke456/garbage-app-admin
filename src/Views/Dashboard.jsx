import React, { useEffect, useState } from "react";
import { Layout, Menu, Spin } from "antd";
import state from "../Store";
import Riders from "../Components/Riders";
import { useSnapshot } from "valtio";
import { fetchUsers } from "../Services/UserService";
import Schedules from "../Components/Schedules";
import ScheduleManager from "../Components/ScheduleManager";
import { Reviews } from "../Components/Reviews";
import NormalSchedules from "../Components/NormalSchedules";
import Complains from "../Components/Complains";

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const snap = useSnapshot(state);
  const [collapsed, setCollapsed] = React.useState(false);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  const onDashboardItemClicked = (index) => {
    state.activeIndex = index;
  };

  const fetchUsersFromDb = async () => {
    try {
      setLoading(true);
      const users = await fetchUsers();
      state.users = users;
      const riders = users.filter((user) => user.role === "Rider");
      const passangers = users.filter((user) => user.role === "Passenger");
      state.riders = riders;
      state.passengers = passangers;
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersFromDb();
  }, []);

  if (loading) {
    return (
      <div>
        <p>Please wait your content is loading</p>
        <Spin />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item
            onClick={() => {
              onDashboardItemClicked(1);
            }}
            key="1"
          >
            Riders
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDashboardItemClicked(3);
            }}
            key="2"
          >
            Requests
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDashboardItemClicked(2);
            }}
            key="3"
          >
            Emergency Schedules
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDashboardItemClicked(4);
            }}
            key="4"
          >
            Reviews
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDashboardItemClicked(5);
            }}
            key="5"
          >
            Schedules
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDashboardItemClicked(6);
            }}
            key="6"
          >
            Complains
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 0 }} />
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: 24, minHeight: 360 }}>
            {snap.activeIndex === 1 && (
              <Riders fetchUsersFromDb={fetchUsersFromDb} />
            )}

            {snap.activeIndex === 2 && <ScheduleManager />}
            {snap.activeIndex === 3 && <Schedules />}
            {snap.activeIndex === 4 && <Reviews />}
            {snap.activeIndex === 5 && <NormalSchedules />}
            {snap.activeIndex === 6 && <Complains />}
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>Ride Share Admin</Footer>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
