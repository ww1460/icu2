
export const tableOption = {
   border: true,
   index: true,
   indexLabel: '序号',
   stripe: true,
   viewBtn:false,
   addBtn:false,
   editBtn:false,
   delBtn:false,
   menu:false,
   menuAlign: 'center',
   align: 'center',
   column: [
     {
       label: '新入科患者',
       prop: 'newDeptPatient',
     },
   
     {
       label: '在科患者人数',
       prop: 'deptPatient',
     },
     {
      label: '器官患者人数',
      prop: 'tracheaPatient',
      width:160,   
    },
     {
       label: '留置导尿管患者人数',
       prop: 'indwellingCatheterPatient',
       width:160,   
     },
     {
       label: '动静脉插管患者人数',
       prop: 'arteriovenouPatient',   
       width:160,    
     },
     {
       label: '使用呼吸机患者人数',
       prop:'respiratorUsePatient',
       width:160,
     },
      {
       label: '记录时间',
       prop:'recordTime', 
       type:"datetime",
       format: 'yyyy-MM-dd',
      valueFormat: 'yyyy-MM-dd',
     },
   ]
 }
 