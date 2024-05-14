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
  const {} = booking || {};
  return (
    <Modal
      {...props}
      open={!!booking}
    ></Modal>
  );
};

export default BookingDetailModal;
