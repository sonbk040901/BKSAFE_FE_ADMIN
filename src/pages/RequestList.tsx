import { Button, Card, Space, Statistic, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { Driver, Location, User } from "../types";
import UserInfoModal from "../components/Request/UserInfoModal";
import { useMemo, useState } from "react";
import DriversInfoModal from "../components/Request/DriversInfoModal";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const locationRender = (location: Location) => {
  const title = (
    <Space.Compact
      className="text-slate-950 border-2 border-red-950"
      direction="horizontal"
    >
      {location.address}
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
      <p className="overflow-hidden whitespace-nowrap overflow-ellipsis">{location.address}</p>
    </Tooltip>
  );
};

type Status = "pending" | "accepted" | "rejected" | "completed";

interface DataType {
  _id: React.Key;
  user: User;
  currentLocation: Location;
  startLocation: Location;
  endLocation?: Location;
  suggestedDriver: Driver[];
  driver?: Driver;
  status: Status;
  createdAt: string | Date;
}

const RequestList = () => {
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
  const acceptRequests = useMemo(() => {
    return data.filter((request) => request.status === "accepted");
  }, [data]);
  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: "Id",
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
      {
        title: "Current location",
        key: "currentLocation",
        dataIndex: "currentLocation",
        render: locationRender,
      },
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
        render: (driver?: Driver) => {
          if (!driver) return null;
          return (
            <Tooltip
              title={
                <p className="text-zinc-950">{`View ${driver.fullname}'s info`}</p>
              }
              color="white"
            >
              <Button type="link">{driver.fullname}</Button>
            </Tooltip>
          );
        },
      },
      {
        title: "Status",
        key: "status",
        dataIndex: "status",
        render: (status: Status) => {
          let color = "geekblue";
          if (status === "rejected") {
            color = "volcano";
          } else if (status === "completed") {
            color = "green";
          }
          return (
            <Tag
              color={color}
              key={status}
            >
              {status.toUpperCase()}
            </Tag>
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
    [],
  );
  return (
    <Space
      className="w-full h-full"
      direction="vertical"
    >
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
        scroll={{ x: 1200, scrollToFirstRowOnChange: true, y: 400 }}
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
