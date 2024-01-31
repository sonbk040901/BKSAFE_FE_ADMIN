import {
  Button,
  Card,
  Dropdown,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Driver, Location, User } from "../types";
import UserInfoModal from "../components/Request/UserInfoModal";
import { useMemo, useState } from "react";
import DriversInfoModal from "../components/Request/DriversInfoModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
const locationRender = (location: Location) => {
  const {
    address,
    // latLng: { lat, lng },
  } = location;
  const title = (
    <Space.Compact
      className="text-slate-950 border-2 border-red-950"
      direction="horizontal"
    >
      {/* <Table
        rowKey={(record) => record.address}
        columns={[
          { title: "Address", dataIndex: "address" },
          { title: "Lat", dataIndex: "lat" },
          { title: "Lng", dataIndex: "lng" },
        ]}
        dataSource={[{ address, lat, lng }]}
        pagination={false}
        scroll={{ x: 300 }}
      /> */}
      {address}
      {/* <Tooltip title="Lat">
        <Button
          type="dashed"
          className="flex-1 flex-shrink-0"
        >
          {location.latLng.lat}
        </Button>
      </Tooltip>
      <Tooltip title="Lng">
        <Button
          type="dashed"
          className="flex-1 flex-shrink-0"
        >
          {location.latLng.lng}
        </Button>
      </Tooltip> */}
    </Space.Compact>
  );
  return (
    <Tooltip
      title={title}
      color="white"
    >
      <p className="overflow-hidden whitespace-nowrap overflow-ellipsis">
        {location.address}
      </p>
    </Tooltip>
  );
};
type Status = "pending" | "accepted" | "rejected" | "completed";

interface DataType {
  _id: string;
  user: User;
  currentLocation: Location;
  startLocation: Location;
  endLocation?: Location;
  suggestedDriver: Driver[];
  driver?: Driver;
  status: Status;
  createdAt: string | Date;
  locations: LocationV[];
}
type LocationV = {
  address: string;
  longitude: number;
  latitude: number;
  type: "stop" | "dropoff" | "pickup";
  _id: string;
};
const RequestList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [user, setUser] = useState<User>();
  const [drivers, setDrivers] = useState<Driver[]>();
  const { data, refetch, isFetching } = useQuery(
    ["requestList"],
    () =>
      axios.get("http://localhost:3000/api/request/getAll").then((res) => {
        const data = res.data as { data: DataType[] };
        return data.data;
      }),
    { initialData: [] },
  );
  const { mutate: acceptRequest } = useMutation({
    mutationFn: (data: { reqId: string; driverId: string }) =>
      axios
        .post("http://localhost:3000/api/request/accept", data)
        .then(() => refetch())
        .then(() => messageApi.success("Accept request successfully!")),
  });
  const { mutate: changeStatus } = useMutation({
    mutationFn: (data: { reqId: string; status: Status }) =>
      axios
        .patch("http://localhost:3000/api/request/status", data)
        .then(() => refetch())
        .then(() => messageApi.success("Change status successfully!")),
  });
  const acceptRequests = useMemo(() => {
    return data.filter((request) => request.status === "accepted");
  }, [data]);
  const handleChange = (rid: string, did: string) => {
    acceptRequest({ reqId: rid, driverId: did });
  };
  const handleChangeStatus = (rid: string, status: Status) => {
    changeStatus({ reqId: rid, status });
  };
  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: "",
        key: "_id",
        dataIndex: "_id",
        width: 50,
        render: (_, record, i) => {
          return (
            <Tooltip
              color="white"
              title={<p className="text-slate-950">{record._id}</p>}
            >
              {i + 1}
            </Tooltip>
          );
        },
      },
      {
        title: "User",
        key: "user",
        dataIndex: "user",
        render: (user: User) => (
          <Tooltip
            title={
              <p className="text-zinc-950">{`View ${user.fullname}'s info`}</p>
            }
            color="white"
          >
            <Button
              type="link"
              onClick={() => setUser(user)}
            >
              {user.fullname}
            </Button>
          </Tooltip>
        ),
      },
      // {
      //   title: "Current location",
      //   key: "currentLocation",
      //   dataIndex: "currentLocation",
      //   // render: locationRender,
      // },
      {
        title: "Start location",
        key: "startLocation",
        dataIndex: "startLocation",
        render: locationRender,
      },
      {
        title: "End location",
        key: "endLocation",
        dataIndex: "endLocation",
        render: locationRender,
      },
      {
        title: "Stop locations",
        key: "locations",
        dataIndex: "locations",
        render: (locations: LocationV[]) => {
          return (
            <Dropdown
              placement="bottomRight"
              menu={{
                items: locations
                  .filter((l) => l.type === "stop")
                  .map((l) => ({ key: l._id, label: l.address })),
              }}
            >
              <Button type="link">{locations.length - 2}</Button>
            </Dropdown>
          );
        },
      },
      {
        title: "Suggested drivers",
        key: "suggestedDriver",
        dataIndex: "suggestedDriver",
        render: (drivers: Driver[]) => (
          <Tooltip
            color="white"
            title={
              <p className="text-slate-950">Number of suggested drivers</p>
            }
          >
            <Button
              type="link"
              onClick={() => setDrivers(drivers)}
            >
              {drivers.length}
            </Button>
          </Tooltip>
        ),
      },
      {
        title: "Driver",
        key: "driver",
        dataIndex: "driver",
        render: (driver: Driver, record: DataType) => {
          return (
            <Select
              defaultValue={driver ? driver.fullname : null}
              style={{ width: "100%" }}
              onChange={(value) => {
                handleChange(record._id, value);
              }}
              options={record.suggestedDriver.map((driver) => ({
                label: driver.fullname,
                value: driver._id,
              }))}
            />
          );
        },
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
        render: (status: Status, record: DataType) => {
          return (
            <Select
              value={status}
              style={{ width: "100%" }}
              onChange={(value) => {
                handleChangeStatus(record._id, value);
              }}
            >
              <Select.Option value="pending">
                <Tag color="geekblue">PENDING</Tag>
              </Select.Option>
              <Select.Option value="accepted">
                <Tag color="blue">ACCEPTED</Tag>
              </Select.Option>
              <Select.Option value="driving">
                <Tag color="orange">DRIVING</Tag>
              </Select.Option>
              <Select.Option value="rejected">
                <Tag color="volcano">REJECTED</Tag>
              </Select.Option>
              <Select.Option value="completed">
                <Tag color="green">COMPLETED</Tag>
              </Select.Option>
            </Select>
          );
        },
        filters: [
          {
            text: "Pending",
            value: "pending",
          },
          {
            text: "Accepted",
            value: "accepted",
          },
          {
            text: "Rejected",
            value: "rejected",
          },
          {
            text: "Completed",
            value: "completed",
          },
        ],
        onFilter: (value: string | number | boolean, record: DataType) =>
          record.status === value,
      },
      {
        title: "Created at",
        key: "createdAt",
        dataIndex: "createdAt",
        render: (createdAt: string | Date) => {
          const date = new Date(createdAt);
          const now = new Date();
          const diff = now.getTime() - date.getTime();
          let html: JSX.Element;
          if (diff < 1000 * 60) {
            html = <p>Just now</p>;
          } else if (diff < 1000 * 60 * 60) {
            html = <p>{Math.floor(diff / (1000 * 60))} minutes ago</p>;
          } else if (diff < 1000 * 60 * 60 * 24) {
            html = <p>{Math.floor(diff / (1000 * 60 * 60))} hours ago</p>;
          } else if (diff < 1000 * 60 * 60 * 24 * 7) {
            html = <p>{Math.floor(diff / (1000 * 60 * 60 * 24))} days ago</p>;
          } else html = <p>{date.toLocaleString()}</p>;
          return (
            <Tooltip
              color="white"
              title={<p className="text-slate-950">{createdAt.toString()}</p>}
            >
              {html}
            </Tooltip>
          );
        },
        filters: [
          {
            text: "Recent",
            value: "recent",
          },
          { text: "Today", value: "today" },
          {
            text: "Old",
            value: "old",
          },
        ],
        onFilter: (value: string | number | boolean, record: DataType) => {
          const date = new Date(record.createdAt);
          const now = new Date();
          const diff = now.getTime() - date.getTime();
          if (value === "recent") {
            return diff < 1000 * 60 * 60;
          } else if (value === "today") {
            return (
              date.getDate() === now.getDate() &&
              date.getMonth() === now.getMonth() &&
              date.getFullYear() === now.getFullYear()
            );
          } else if (value === "old") {
            return diff >= 1000 * 60 * 60 * 24;
          }
          return false;
        },
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  return (
    <Space
      className="w-full h-full"
      direction="vertical"
    >
      {contextHolder}
      <Space className="h-32">
        <Card>
          <Statistic
            title="Total request"
            value={data.length}
            loading={isFetching}
          />
        </Card>
        <Card>
          <Statistic
            title={<Tag color={"blue"}>ACCEPTED</Tag>}
            value={acceptRequests.length}
            loading={isFetching}
          />
        </Card>
        <Button
          type="primary"
          onClick={() => {
            void refetch();
          }}
        >
          Refetch
        </Button>
      </Space>
      <Table
        rowKey={(record) => record._id}
        columns={columns}
        dataSource={data}
        loading={isFetching}
        scroll={{ x: 1300, scrollToFirstRowOnChange: true, y: 350 }}
        pagination={{ pageSize: 5, responsive: false }}
      />
      <UserInfoModal
        user={user}
        onCancel={() => setUser(undefined)}
      />
      <DriversInfoModal
        drivers={drivers}
        onCancel={() => setDrivers(undefined)}
      />
    </Space>
  );
};

export default RequestList;
