import { useMutation, useQuery } from "@tanstack/react-query";
import { Switch } from "antd";
import { bookingApi } from "../../api";

const SwitchMode = () => {
  const { data: mode, isLoading } = useQuery({
    queryFn: bookingApi.getFindDriverMode,
    refetchOnWindowFocus: false,
    initialData: false,
    queryKey: ["findDriverMode"],
  });
  const {
    data = mode,
    isLoading: isUpdating,
    mutate,
  } = useMutation({
    mutationFn: bookingApi.changeFindDriverMode,
  });
  return (
    <div className="space-x-1">
      <label htmlFor="switch-mode">Chế độ tìm</label>
      <Switch
        loading={isLoading || isUpdating}
        checked={data}
        onChange={(e) => {
          mutate(e);
        }}
        id="switch-mode"
        checkedChildren="Tự động"
        unCheckedChildren="Thủ công"
      />
    </div>
  );
};

export default SwitchMode;
