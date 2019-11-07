import moment from "moment";
import { TransactionRow } from "./App";
import { Badge, Button } from "react-bootstrap";
import React from "react";

export const upDownFormat = (cell: number, row: TransactionRow) => {
  const value =
    cell > 0 ? (
      <Badge variant="danger">{numberFormat(cell)}</Badge>
    ) : cell < 0 ? (
      <Badge variant="success">{numberFormat(cell)}</Badge>
    ) : (
      <Badge variant="light">0</Badge>
    );
  return <h5>{value}</h5>;
};

export const upDownFormatPercentage = (cell: number, row: TransactionRow) => {
  const value =
    cell > 0 ? (
      <Badge variant="danger">{cell}%</Badge>
    ) : cell < 0 ? (
      <Badge variant="success">{cell}%</Badge>
    ) : (
      <Badge variant="light">0%</Badge>
    );
  return <h5>{value}</h5>;
};

export const numberFormat = (value: number, fixed = 0) => {
  return (value || 0).toFixed(fixed);
};

export const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
    headerStyle: { width: "40px" },
    style: { width: "40px" }
  },
  {
    dataField: "成交",
    text: "成交日期",
    formatter: (cell: Date) => moment(cell).format("YYYY-MM-DD"),
    sort: true
  },
  {
    dataField: "股票",
    text: "股票",
    sort: true,
    headerStyle: { width: "120px" },
    style: { width: "120px" }
  },
  {
    dataField: "買賣別",
    text: "買賣別",
    style: (cell: string) => {
      return cell === "買" ? { color: "red" } : { color: "green" };
    }
  },
  {
    dataField: "成交_1",
    text: "成交量",
    sort: true
  },
  {
    dataField: "成交價",
    text: "成交價"
  },
  { dataField: "價金", text: "價金", sort: true },
  {
    dataField: "手續費",
    text: "手續費",
    sort: true
  },
  {
    dataField: "交易稅",
    text: "交易稅",
    sort: true
  },
  {
    dataField: "應收",
    text: "應收",
    sort: true
  },
  {
    dataField: "損益",
    text: "損益",
    sort: true,
    // style: (cell: number) => { return cell > 0 ? {color: 'white', backgroundColor: '#e25252'} : (cell < 0 ? {color: 'white', backgroundColor: '#6cdf6cc2'} : {}) }
    formatter: upDownFormat
  }
];

export const groupColumns = (
  setModalShow: (v: boolean) => void,
  setStockDetail: (detail: TransactionRow[]) => void
) => [
  {
    dataField: "股票",
    text: "股票",
    sort: true,
    headerStyle: { width: "120px" },
    style: { width: "120px" },
    formatter: (cell: string, row: TransactionRow) => {
      const onClick = (e: any) => {
        setStockDetail(row.明細);
        setModalShow(true);
      };
      return (
        <Button variant="link" onClick={onClick}>
          {cell}
        </Button>
      );
    }
  },
  {
    dataField: "市價",
    text: "市價",
    sort: true,
    headerStyle: { width: "50px" },
    style: { width: "50px" }
  },
  {
    dataField: "均價",
    text: "均價",
    sort: true,
    headerStyle: { width: "50px" },
    style: { width: "50px" },
    formatter: (cell: number, row: TransactionRow) => {
      if (cell > 0) {
        const value =
          row.市價 && row.市價 > cell ? (
            <Badge variant="danger">{numberFormat(cell, 2)}</Badge>
          ) : row.市價 && row.市價 < cell ? (
            <Badge variant="success">{numberFormat(cell, 2)}</Badge>
          ) : (
            <Badge variant="light">{numberFormat(cell, 2)}</Badge>
          );
        return value;
      }
      return 0;
    }
  },
  {
    dataField: "成本",
    text: "成本",
    align: "right",
    headerAlign: "right",
    sort: true,
    headerStyle: { width: "90px" },
    style: { width: "90px" },
    formatter: numberFormat
  },
  {
    dataField: "股數",
    text: "股數",
    align: "right",
    headerAlign: "right",
    sort: true,
    headerStyle: { width: "90px" },
    style: { width: "90px" },
    formatter: numberFormat
  },
  {
    dataField: "市值",
    text: "市值 ",
    sort: true,
    align: "right",
    headerAlign: "right",
    headerStyle: { width: "90px" },
    style: { width: "90px" },
    formatter: numberFormat
  },
  {
    dataField: "目前損益",
    text: "損益%",
    align: "right",
    headerAlign: "right",
    sort: true,
    headerStyle: { width: "90px" },
    style: { width: "90px" },
    formatter: upDownFormatPercentage
  },
  {
    dataField: "未實現損益",
    text: "未實現損益",
    align: "right",
    headerAlign: "right",
    sort: true,
    headerStyle: { width: "90px" },
    style: { width: "90px" },
    formatter: upDownFormat
  },
  {
    dataField: "損益",
    text: "已實現損益",
    align: "right",
    headerAlign: "right",
    sort: true,
    headerStyle: { width: "90px" },
    style: { width: "90px" },
    formatter: upDownFormat
  },
  {
    dataField: "配息",
    text: "配息",
    align: "right",
    headerAlign: "right",
    sort: true,
    headerStyle: { width: "90px" },
    style: { width: "90px" },
    formatter: upDownFormat
  }
];

export const detailColumns = [
  ...columns,
  {
    dataField: "庫存數",
    text: "庫存數",
    sort: true
  },
  {
    dataField: "未實現損益",
    text: "未實現損益 ",
    sort: true,
    formatter: upDownFormat
  }
];
