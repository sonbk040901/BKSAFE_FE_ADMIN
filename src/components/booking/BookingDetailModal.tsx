import { Modal, ModalProps } from "antd";
import type { FC } from "react";
import { Booking } from "../../api/types";

interface BookingDetailModalProps extends ModalProps {
  booking?: Booking;
}

const BookingDetailModal: FC<BookingDetailModalProps> = ({
  booking,
  ...props
}) => {
  const {
    id,
    locations,
    startTime,
    endTime,
    user,
    status,
    rating,
    nextLocationId,
    notes,
    note,
    price,
    driver,
    updatedAt,
    createdAt,
  } = booking || {};
  return (
    <Modal
      {...props}
      title={`Thông tin chi tiết yêu cầu đặt xe #${id || ""}`}
      footer={null}
      open={!!booking}
    ></Modal>
  );
};

export default BookingDetailModal;
