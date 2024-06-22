import { useMutation, useQuery } from "@tanstack/react-query";
import { Form, Switch } from "antd";
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
    isPending,
    mutate,
  } = useMutation({
    mutationFn: bookingApi.changeFindDriverMode,
  });
  return (
    <Form.Item label="Chế độ tìm tài xế">
      <Switch
        loading={isLoading || isPending}
        checked={data}
        onChange={(e) => {
          mutate(e);
        }}
        id="switch-mode"
        checkedChildren="Tự động"
        unCheckedChildren="Thủ công"
      />
    </Form.Item>
  );
};

export default SwitchMode;
