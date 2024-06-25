import { StarFilled } from "@ant-design/icons";
import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
  MarkerF,
} from "@react-google-maps/api";
import { Modal, ModalProps, Space } from "antd";
import { useEffect, useRef, useState, type FC } from "react";
import { Booking } from "../../api/types";
import useLocalStorage from "../../hooks/useLocalStorage";
import { subcribe } from "../../socket";
import { getTagStatus } from "../../utils";
import timeDiff from "../../utils/timeDiff";
import AccInfoCard from "./AccInfoCard";
import BookingInfoCard from "./BookingInfoCard";
import { InfoItemProps } from "./InfoItem";
import driverPin from "../../assets/images/driver-pin.png";
import userPin from "../../assets/images/user-pin.png";
import homePin from "../../assets/images/home-pin.png";
import dropOffPin from "../../assets/images/drop-off-pin.png";
interface BookingDetailModalProps extends ModalProps {
  booking?: Booking;
}

const renderTime = (value?: string) => {
  if (!value) return "Chưa có";
  const [diff, dateStr] = timeDiff(value);
  return (
    <div>
      {dateStr} ({diff})
    </div>
  );
};

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
    // notes,
    note,
    price,
    driver,
    // updatedAt,
    createdAt,
    review,
  } = booking || {};
  const [apiKey] = useLocalStorage("apiKey", "");
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    language: "vi",
    region: "VN",
    version: "3",
  });
  const mapRef = useRef<GoogleMap>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult>();
  const [driverLocation, setDriverLocation] = useState(driver?.location);
  const userItems: InfoItemProps[] = [
    {
      label: "Tên người đặt",
      value: user?.fullName,
    },
    {
      label: "Số điện thoại",
      value: user?.phone,
    },
    {
      label: "Email",
      value: user?.email,
    },
  ];
  const driverItems: InfoItemProps[] = [
    {
      label: "Tên tài xế",
      value: driver?.fullName,
    },
    {
      label: "Số điện thoại",
      value: driver?.phone,
    },
    {
      label: "Email",
      value: driver?.email,
    },
    {
      label: "Đánh giá",
      value: (
        <Space>
          <span>{driver && +driver.rating.toFixed(2)}</span>
          <StarFilled className="text-yellow-400" />
        </Space>
      ),
    },
  ];
  const bookingItems: InfoItemProps[] = [
    { label: "Điểm bắt đầu", value: locations?.[0]?.address },
    {
      label: "Điểm đến tiếp theo",
      value: locations?.find((l) => l.id === nextLocationId)?.address,
    },
    {
      label: "Điểm kết thúc",
      value: locations?.[locations.length - 1]?.address,
    },
    {
      label: "Giá",
      value: price?.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
    },
    { label: "Ghi chú", value: note || "Không có" },
    {
      label: "Thời gian đặt",
      value: createdAt,
      render: renderTime,
    },
    {
      label: "Thời gian bắt đầu",
      value: startTime,
      render: renderTime,
    },
    {
      label: "Thời gian kết thúc",
      value: endTime,
      render: renderTime,
    },
    {
      label: "Trạng thái",
      value: status && getTagStatus(status),
    },
    {
      label: "Đánh giá",
      value: rating ? (
        <>
          <span className="space-x-1">
            <span>{+rating.toFixed(2)}</span>
            <StarFilled className="text-yellow-400" />
          </span>{" "}
          ({review})
        </>
      ) : (
        "Chưa có"
      ),
    },
  ];
  useEffect(() => {
    if (!locations) return;
    const directionService = new google.maps.DirectionsService();
    void directionService.route(
      {
        origin: { lat: locations[0].latitude, lng: locations[0].longitude },
        destination: {
          lat: locations[locations.length - 1].latitude,
          lng: locations[locations.length - 1].longitude,
        },
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: locations.slice(1, -1).map((location) => ({
          location: { lat: location.latitude, lng: location.longitude },
        })),
        language: "vi",
        region: "VN",
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result ?? undefined);
        }
      },
    );
  }, [locations]);
  useEffect(() => {
    if (!booking || booking.status !== "DRIVING") return;
    return subcribe("booking/current-driver-location", setDriverLocation);
  }, [booking]);
  return (
    <Modal
      {...props}
      title={`Thông tin chi tiết yêu cầu đặt xe #${id || ""}`}
      footer={null}
      open={!!booking}
      width={1300}
    >
      <Space
        direction="vertical"
        className="w-full"
      >
        <div className="flex gap-2 flex-[2]">
          <AccInfoCard
            title="Thông tin người đặt"
            items={userItems}
            avatar={user?.avatar ?? undefined}
          />
          {driver ? (
            <AccInfoCard
              title="Thông tin tài xế"
              items={driverItems}
              avatar={driver?.avatar ?? undefined}
            />
          ) : (
            <div className="flex-1"></div>
          )}
        </div>
        <div className="flex gap-2">
          <BookingInfoCard
            className="flex-1"
            items={bookingItems}
          />
          {isLoaded && (
            <GoogleMap
              ref={mapRef}
              mapContainerStyle={{ flex: 1, borderRadius: "0.5rem" }}
              zoom={10}
              center={{
                lat: 21.007326,
                lng: 105.847328,
              }}
              options={{
                scaleControl: false,
                streetViewControl: false,
                zoomControl: false,
                fullscreenControl: false,
                mapTypeControl: false,
              }}
            >
              {locations &&
                locations.map((lovation, index, arr) => {
                  const iconUrl =
                    index === 0
                      ? userPin
                      : index === arr.length - 1
                      ? homePin
                      : dropOffPin;
                  return (
                    <MarkerF
                      key={lovation.id}
                      position={{
                        lat: lovation.latitude,
                        lng: lovation.longitude,
                      }}
                      title={lovation.address}
                      icon={{
                        url: iconUrl,
                        scaledSize: new google.maps.Size(30, 30),
                      }}
                    />
                  );
                })}
              {driverLocation && (
                <MarkerF
                  position={{
                    lat: driverLocation.latitude,
                    lng: driverLocation.longitude,
                  }}
                  title="Vị trí tài xế"
                  icon={{
                    url: driverPin,
                    scaledSize: new google.maps.Size(30, 30),
                  }}
                />
              )}
              <DirectionsRenderer
                directions={directions}
                options={{
                  polylineOptions: { strokeColor: "hotpink" },
                  suppressMarkers: true,
                }}
              />
            </GoogleMap>
          )}
        </div>
      </Space>
    </Modal>
  );
};

export default BookingDetailModal;
