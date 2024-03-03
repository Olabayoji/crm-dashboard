import { Text } from "@/components/text";
import { User } from "@/graphql/schema.types";
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  ConfigProvider,
  Dropdown,
  Space,
  Tag,
  Tooltip,
  theme,
} from "antd";
import { MenuProps } from "antd/lib";
import React, { useMemo } from "react";
import { TextIcon } from "../text-icon";
import dayjs from "dayjs";
import { getDateColor } from "@/utilities";
import CustomAvatar from "@/components/custom.avatar";
import { useDelete, useNavigation } from "@refinedev/core";

type Props = {
  id: string;
  title: string;
  updatedAt: string;
  dueDate?: string;
  users?: {
    id: string;
    name: string;
    avatarUrl?: User["avatarUrl"];
  }[];
};

const ProjectCard = (props: Props) => {
  const { id, title, updatedAt, dueDate, users } = props;
  const { token } = theme.useToken();
  const { edit } = useNavigation();
  const { mutate: deleteTask } = useDelete();

  const dropdownItems = useMemo(() => {
    const dropdownItems: MenuProps["items"] = [
      {
        label: "View card",
        key: "1",
        icon: <EditOutlined />,
        onClick: () => edit("tasks", id, "replace"),
      },
      {
        danger: true,
        label: "Delete card",
        key: "2",
        icon: <DeleteOutlined />,
        onClick: () => {
          deleteTask({
            resource: "tasks",
            id,
            meta: {
              operation: "task",
            },
          });
        },
      },
    ];
    return dropdownItems;
  }, []);

  const dueDateOptions = useMemo(() => {
    if (dueDate) {
      const date = dayjs(dueDate);
      return {
        color: getDateColor({ date: dueDate }) as string,
        text: date.format("MMM D"),
      };
    }
    return null;
  }, [dueDate]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Tag: {
            colorText: token.colorTextSecondary,
          },
          Card: {
            headerBg: "transparent",
          },
        },
      }}
    >
      <Card
        size="small"
        title={<Text ellipsis={{ tooltip: title }}>{title} </Text>}
        onClick={() => edit("tasks", id, "replace")}
        extra={
          <Dropdown
            trigger={["click"]}
            menu={{
              items: dropdownItems,
              onPointerDown: (e) => {
                e.stopPropagation();
              },
              onClick: (e) => {
                e.domEvent.stopPropagation();
              },
            }}
            placement="bottom"
            arrow={{ pointAtCenter: true }}
          >
            <Button
              type="text"
              shape="circle"
              icon={<MoreOutlined style={{ transform: "rotate(90deg)" }} />}
              onPointerDown={(e) => {
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
            />
          </Dropdown>
        }
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <TextIcon style={{ marginRight: "4px" }} />
          {dueDateOptions && (
            <Tag
              style={{
                padding: "0 4px",
                marginInlineEnd: "0",
                backgroundColor:
                  dueDateOptions.color === "default" ? "transparent" : "unset",
              }}
              color={dueDateOptions.color}
              bordered={dueDateOptions.color !== "default"}
              icon={<ClockCircleOutlined style={{ fontSize: "12px" }} />}
            >
              {dueDateOptions.text}
            </Tag>
          )}
          {!!users?.length && (
            <Space
              wrap
              direction="horizontal"
              align="center"
              size={4}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginLeft: "auto",
                marginRight: "0",
              }}
            >
              {users.map((user) => (
                <Tooltip key={user.id} title={user.name}>
                  <CustomAvatar name={user.name} avatarUrl={user.avatarUrl} />
                </Tooltip>
              ))}
            </Space>
          )}
        </div>
      </Card>
    </ConfigProvider>
  );
};

export default ProjectCard;

export const ProjectCardMemo = React.memo(ProjectCard, (prev, next) => {
  return (
    prev.id === next.id &&
    prev.title === next.title &&
    prev.updatedAt === next.updatedAt &&
    prev.dueDate === next.dueDate &&
    prev.users === next.users &&
    prev.users?.length === next.users?.length
  );
});
