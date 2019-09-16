import moment from "moment";
import { TrsactionRow } from "./App";

export const columns = [
  {
    dataField: "id",
    text: "ID",
    sort: true,
    headerStyle: { width: '40px' },
    style: { width: '40px' },
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
    headerStyle: { width: '150px' },
    style: { width: '150px' },
  },
  {
    dataField: "買賣別",
    text: "買賣別",
    style: (cell: string) => { return cell === "買" ? {color: 'red'} : {color: 'green'} }
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
    style: (cell: number) => { return cell > 0 ? {color: 'white', backgroundColor: '#e25252'} : (cell < 0 ? {color: 'white', backgroundColor: '#6cdf6cc2'} : {}) }
  }
];

export const groupColumns = [
  {
    dataField: "股票",
    text: "股票",
    sort: true,
    headerStyle: { width: '150px' },
    style: { width: '150px' },
  },
  {
    dataField: "市價",
    text: "市價",
    sort: true,
    headerStyle: { width: '150px' },
    style: { width: '150px' },
  },
  {
    dataField: "平均價",
    text: "平均價",
    sort: true,
    headerStyle: { width: '150px' },
    style: { width: '150px' },
  },
  {
    dataField: "股數",
    text: "股數",
    sort: true,
    headerStyle: { width: '150px' },
    style: { width: '150px' },
  },
  {
    dataField: "目前損益",
    text: "目前損益",
    sort: true,
    headerStyle: { width: '150px' },
    style: { width: '150px' },
    formatter: (cell: string, row: TrsactionRow) => {
      return  row.平均價 ? `${Math.round((row.市價 - row.平均價)/row.平均價*10000)/100}%`: 'N/A';
    }
  },
  {
    dataField: "未實現損益",
    text: "未實現損益",
    sort: true,
    headerStyle: { width: '150px' },
    style: { width: '150px' },
    formatter: (cell: string, row: TrsactionRow) => {
      return Math.round((row.市價 - row.平均價)*row.股數)
    }
  },
  {
    dataField: "損益",
    text: "已實現損益",
    sort: true,
    headerStyle: { width: '150px' },
    style: { width: '150px' },
  }
];
