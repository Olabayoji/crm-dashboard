import CustomAvatar from "@/components/custom.avatar";
import LatestActivitiesSkeleton from "@/components/layout/skeleton/latest-activities";
import { Text } from "@/components/text";
import {
  DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
  DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
} from "@/graphql/queries";
import { UnorderedListOutlined } from "@ant-design/icons";
import { useList } from "@refinedev/core";
import { Card, List, Space } from "antd";
import dayjs from "dayjs";

const LatestActivities = () => {
  const {
    data: audit,
    isLoading: loadingAudit,
    isError,
  } = useList({
    resource: "audits",
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY,
    },
  });
  const dealIds = audit?.data?.map((item) => item.targetId);

  const { data: deals, isLoading: dealLoading } = useList({
    resource: "deals",
    queryOptions: { enabled: !!dealIds?.length },
    pagination: {
      mode: "off",
    },
    filters: [{ field: "id", operator: "in", value: dealIds }],
    meta: {
      gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY,
    },
  });

  if (isError) {
    return null;
  }
  const isLoading = dealLoading || loadingAudit;
  return (
    <Card
      styles={{ head: { padding: "16px" }, body: { padding: "0 1rem" } }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UnorderedListOutlined />
          <Text size="sm" style={{ marginLeft: "0.5rem" }}>
            Latest Activities
          </Text>
        </div>
      }
    >
      {isLoading ? (
        <List
          itemLayout="horizontal"
          dataSource={Array.from({ length: 5 }).map((_, i) => ({ id: i }))}
          renderItem={(item, index) => <LatestActivitiesSkeleton key={index} />}
        ></List>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={audit?.data}
          renderItem={(item) => {
            const deal = deals?.data.find((deal) => deal.id == item.targetId);
            return (
              <List.Item>
                <List.Item.Meta
                  title={dayjs(deal?.createdAt).format("MMM DD, YYYY - HH:mm")}
                  avatar={
                    <CustomAvatar
                      size={48}
                      shape="square"
                      name={deal?.company.name}
                      src={deal?.company.avatarUrl}
                    />
                  }
                  description={
                    <Space>
                      <Text strong>{deal?.user?.name}</Text>
                      <Text>
                        {item.action === "CREATE" ? "created" : "moved"}
                      </Text>
                      <Text strong>{deal?.title}</Text>
                      <Text>deal</Text>
                      <Text>{item.action === "CREATE" ? "in" : "to"}</Text>
                      <Text strong>{deal?.stage.title}</Text>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        ></List>
      )}
    </Card>
  );
};
export default LatestActivities;
