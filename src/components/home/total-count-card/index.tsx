import { Text } from "@/components/text";
import { totalCountVariants } from "@/constants";
import { Area, AreaConfig } from "@ant-design/plots";
import { Card, Skeleton } from "antd";
import { FC } from "react";

type Props = {
  resource: "companies" | "contacts" | "deals";
  loading: boolean;
  totalCount: number;
};

const TotalCountCard: FC<Props> = ({ loading, resource, totalCount }) => {
  const { primaryColor, secondaryColor, icon, title } =
    totalCountVariants[resource];

  const config: AreaConfig = {
    data: totalCountVariants[resource].data,
    xField: "index",
    yField: "value",
    appendPadding: [1, 0, 0, 0],
    padding: 0,
    syncViewPadding: true,
    autoFit: true,
    tooltip: false,
    xAxis: false,
    animation: true,

    yAxis: {
      tickCount: 12,
      label: {
        style: {
          stroke: "transparent",
        },
      },
      grid: {
        line: {
          style: {
            stroke: "transparent",
          },
        },
      },
    },
    // yAxis: false,
    smooth: true,
    line: { color: primaryColor },
    areaStyle: () => {
      return { fill: `l(270) 0:#fff 0.2${secondaryColor} 1:${primaryColor}` };
    },
  };
  return (
    <Card
      style={{ height: "96px", padding: 0 }}
      styles={{
        body: {
          padding: "8px 8px 8px 12px",
          overflow: "hidden",
          isolation: "isolate",
        },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          whiteSpace: "nowrap",
        }}
      >
        {icon}
        <Text size="md" className="secondary" style={{ marginLeft: "8px" }}>
          {title}
        </Text>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          overflow: "hidden",
        }}
      >
        <Text
          size="xxxl"
          strong
          style={{
            flex: 1,
            whiteSpace: "nowrap",
            flexShrink: 0,
            textAlign: "start",
            marginLeft: "48px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {loading ? <Skeleton.Button /> : <>{totalCount} </>}
        </Text>
        <Area {...config} />
      </div>
    </Card>
  );
};

export default TotalCountCard;
