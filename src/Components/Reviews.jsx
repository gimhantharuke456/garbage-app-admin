import React, { useEffect, useState } from "react";
import { fetchAllReviews } from "../Services/ReviewService";
import { Table, Tag } from "antd";
import { useSnapshot } from "valtio";
import state from "../Store";
import { render } from "@testing-library/react";

export const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const snap = useSnapshot(state);
  const riders = snap.riders;

  useEffect(() => {
    const getReviews = async () => {
      try {
        const reviewData = await fetchAllReviews();
        // Assuming reviewData contains an array of review objects
        // and each review object has a `scores` object with questionId: score pairs
        const enrichedReviews = reviewData.map((review) => ({
          ...review,
          totalScore: Object.values(review.scores).reduce(
            (acc, value) => acc + value,
            0
          ),
        }));
        setReviews(enrichedReviews);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        // Handle the error as you see fit
      }
    };

    getReviews();
  }, []);

  const columns = [
    {
      title: "Rider",
      dataIndex: "riderId",
      key: "riderId",
      render(_, record) {
        const rider = riders.find((rider) => rider.id === record.riderId);
        if (rider) {
          return <p>{`${rider?.firstName} ${rider?.lastName}`}</p>;
        }
        return <p>N/A</p>;
      },
    },

    {
      title: "Total Score",
      dataIndex: "totalScore",
      key: "totalScore",
      render: (text, record) => (
        <Tag color={record.totalScore < 10 ? "red" : "green"}>{text}</Tag>
      ),
    },
  ];

  return <Table columns={columns} dataSource={reviews} rowKey="id" />;
};
