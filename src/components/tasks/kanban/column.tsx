import { Text } from "@/components/text";
import { PlusOutlined } from "@ant-design/icons";
import { UseDraggableArguments, useDroppable } from "@dnd-kit/core";
import { Badge, Button, Space } from "antd";
import React, { FC } from "react";

type Props = {
  children?: React.ReactNode;
  id: string;
  data?: UseDraggableArguments["data"];
  title: string;
  description?: React.ReactNode;
  count: number;
  onAddClick?: (args: { id: string }) => void;
};
const KanbanColumn: FC<Props> = ({
  children,
  count,
  data,
  description,
  id,
  title,
  onAddClick,
}) => {
  const { isOver, setNodeRef, active } = useDroppable({
    id: id,
    data: data,
  });

  const onAddClickHandler = () => {
    onAddClick?.({ id });
  };
  return (
    <div
      ref={setNodeRef}
      style={{ display: "flex", flexDirection: "column", padding: "0 16px" }}
    >
      <div style={{ padding: "12px", height: "100%" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Space>
            <Text
              ellipsis={{ tooltip: title }}
              size="xs"
              strong
              style={{ textTransform: "uppercase", whiteSpace: "nowrap" }}
            >
              {title}
            </Text>
            {!!count && <Badge color="cyan" count={count} />}
          </Space>
          <Button
            shape="circle"
            icon={<PlusOutlined />}
            onClick={onAddClickHandler}
          />
        </Space>
        <div
          style={{
            overflowY: active ? "unset" : "auto",

            border: "2px dashed transparent",
            borderColor: isOver ? "#000040" : "transparent",
            borderRadius: "4px",
            height: "100%",
          }}
        >
          <div
            style={{
              marginTop: "12px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
