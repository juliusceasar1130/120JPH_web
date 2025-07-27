//定义RP筛选DTO
export interface rockPanelDto {
  skidNumber: string
  carType: string
  carNumber: string
  eva: string
  startTime: string
  endTime: string
  imgList?: string
  orderBy?: order
  pos?: string
}
export interface order {
  prop: string
  order: string
}

//定义返回父接口
export interface ResponseData {
  code: number
  message: string
  ok: boolean //没有用
}
//定义筛选返回后的清单，没有做
//定义通过ID获得记录的图片集
export interface Image {
  name: string
  url: string
}
export interface ImageListResponseData extends ResponseData {
  data: Image[]
}
//定义dialogInfo的形式
export interface dialogInfoType {
  Nr: number
  SkidNumber: string
  CarNumber: string
  imgList: Image[]
}
//定义最后一辆车的数据
export interface lefcarinfo {
  carnumber: number
  cartype: string
  date: string
  eva: string
  nr: number
  skidnumber: string
}
export interface rightcarinfo {
  carnumber: number
  cartype: string
  date: string
  eva: string
  nr: number
  skidnumber: string
}

//自定义图表数据类型

// export const chartDataL = {
//   textData: '2024.4.25L',
//   legendData: ['5-6点', '7-8 点', '9-10点', '11-12点', '13-14点'],
//   xAxisData: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
//   yAxisData: ['1', '3', '5', '7', '9', '11', '13', '15','17','19'],
//   seriesData: ['5-6点', '7-8点', '9-10点', '11-12点', '13-14点'],
//   randomData: {
//     generateRandomData1: [3, 4, 3, 5, 6, 7, 8, 3, 4, 3, 2, 4],
//     generateRandomData2: [6, 4, 5, 5, 6, 7, 8, 7, 2, 5, 1, 3],
//     generateRandomData3: [5, 5, 6, 7, 8, 9, 8, 5, 4, 3, 5, 4],
//     generateRandomData4: [6, 7, 8, 9, 6, 7, 5, 6, 7, 8, 9, 8],
//     generateRandomData5: [2, 6, 7, 8, 6, 7, 8, 4, 4, 3, 4, 4],
//   },
// }

// export const chartDataR = {
//   textData: '2024.4.25R',
//   legendData: ['5-6点', '7-8点', '9-10点', '11-12点', '13-14点'],
//   xAxisData: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
//   yAxisData: ['1', '3', '5', '7', '9', '11', '13', '15','17','19'],
//   seriesData: ['5-6点', '7-8点', '9-10点', '11-12点', '13-14点'],
//   randomData: {
//     generateRandomData1: [3, 4, 3, 5, 6, 7, 8, 3, 4, 4, 2, 4],
//     generateRandomData2: [6, 4, 5, 5, 6, 7, 8, 7, 2, 5, 1, 3],
//     generateRandomData3: [5, 5, 6, 7, 8, 9, 8, 5, 4, 2, 5, 4],
//     generateRandomData4: [6, 7, 8, 9, 6, 7, 5, 6, 7, 5, 2, 8],
//     generateRandomData5: [2, 6, 7, 8, 6, 7, 8, 4, 4, 1, 4, 4],
//   },
// }