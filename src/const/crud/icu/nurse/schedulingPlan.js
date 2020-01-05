
//  过滤器
var sechFl = {
  screening: [
    { value: 1, label: '早班' },
    { value: 2, label: '小夜' },
    { value: 3, label: '大夜' },
    { value: 4, label: '白班' },
    { value: 5, label: '休息' }
  ]
}

export const tableOption = {
  border: true,
  // index: true,
  // indexLabel: '日期',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  menu: false,
  column: [
    {
      label: '日期',
      prop: 'dateTime',
      //静态字典  根据后台传过来的0 1 2 3 4 来渲染不同的数据
      // dicData: sechFl.screening
      // 传过来的数据中  shift 都是字符串 "班次"

    },
    {
      label: '周一',
      prop: 'Monday',
      dicData: sechFl.screening

    },
    {
      label: '周二',
      prop: 'Tuesday',
      dicData: sechFl.screening

    },
    {
      label: '周三',
      prop: 'Wednesday',
      dicData: sechFl.screening
    },
    {
      label: '周四',
      prop: 'Thursday',
      dicData: sechFl.screening

    },
    {
      label: '周五',
      dicData: sechFl.screening
    },
    {
      label: '周六',
      dicData: sechFl.screening

    },
    {
      label: '周日',
      dicData: sechFl.screening
    }
  ]
}
