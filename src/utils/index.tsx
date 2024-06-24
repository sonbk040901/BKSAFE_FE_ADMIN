import { Tag } from "antd";
import { Booking } from "../api/types";

export const getTagStatus = (status: Booking["status"]) => {
  switch (status) {
    case "PENDING":
      return <Tag color="warning">Đang chờ</Tag>;
    case "ACCEPTED":
      return <Tag color="blue">Đang tìm tài xế</Tag>;
    case "RECEIVED":
      return <Tag color="cyan">Đang đến</Tag>;
    case "REJECTED":
      return <Tag color="volcano">Đã từ chối</Tag>;
    case "CANCELLED":
      return <Tag color="red">Đã hủy</Tag>;
    case "DRIVING":
      return <Tag color="purple">Đang thực hiện</Tag>;
    case "COMPLETED":
      return <Tag color="green">Kết thúc</Tag>;
    case "TIMEOUT":
      return <Tag color="magenta">Hết thời gian</Tag>;
    default:
      break;
  }
};
