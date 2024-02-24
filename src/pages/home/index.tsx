import {
  DealsChart,
  LatestActivities,
  TotalCountCard,
  UpcomingEvents,
} from "@/components";
import { DASHBOARD_TOTAL_COUNTS_QUERY } from "@/graphql/queries";
import { useCustom } from "@refinedev/core";
import { Col, Row } from "antd";
import React from "react";

export const Home = () => {
  const { data, isLoading: loading } = useCustom({
    url: "",
    method: "get",
    meta: {
      gqlQuery: DASHBOARD_TOTAL_COUNTS_QUERY,
    },
  });
  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
          <TotalCountCard
            resource="companies"
            loading={loading}
            totalCount={data?.data.companies.totalCount}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
          <TotalCountCard
            resource="contacts"
            loading={loading}
            totalCount={data?.data.contacts.totalCount}
          />
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={8}>
          <TotalCountCard
            resource="deals"
            loading={loading}
            totalCount={data?.data.deals.totalCount}
          />
        </Col>
      </Row>
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={8}
          style={{ height: "460px", overflow: "hidden" }}
        >
          <UpcomingEvents />
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={16}
          style={{ height: "460px" }}
        >
          <DealsChart />
        </Col>
      </Row>
      <Row gutter={[32, 32]} style={{ marginTop: "32px" }}>
        <Col xs={24}>
          <LatestActivities />
        </Col>
      </Row>
    </div>
  );
};
