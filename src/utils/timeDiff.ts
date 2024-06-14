export default function timeDiff(dateStr: string | Date) {
  const date = new Date(dateStr);
  const dateFormated = date.toLocaleString("vi", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 1000 * 60) {
    return ["Vừa xong", dateFormated];
  }
  if (diff < 1000 * 60 * 60) {
    return [`${Math.floor(diff / (1000 * 60))} phút trước`, dateFormated];
  }
  if (diff < 1000 * 60 * 60 * 24) {
    return [`${Math.floor(diff / (1000 * 60 * 60))} giờ trước`, dateFormated];
  }
  if (diff < 1000 * 60 * 60 * 24 * 7) {
    return [
      `${Math.floor(diff / (1000 * 60 * 60 * 24))} ngày trước`,
      dateFormated,
    ];
  }
  if (diff < 1000 * 60 * 60 * 24 * 31) {
    return [
      `${Math.floor(diff / (1000 * 60 * 60 * 24 * 7))} tuần trước`,
      dateFormated,
    ];
  }
  return [dateFormated, dateFormated] as const;
}
