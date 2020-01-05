import request from '@/router/axios'

export function fetchwaiting(query) {
  return request({
    url: '/icu/hispatient/page',
    method: 'get',
    params: query
  })
}

export function patientId_entryState() {
  return request({
    url: '/admin/dict/type/patientId_entryState',
    method: 'get'
  })
}

export function putPatpatient(obj) {
  return request({
    url: '/icu/patpatient',
    method: 'put',
    data: obj
  })
}

export function patientId(id) {
  return request({
    url: '/icu/patpatient/patientId/' + id,
    method: 'get'
  })
}

export function nursepatientcorrelation(query) {
  return request({
    url: '/icu/nursepatientcorrelation/page',
    method: 'get',
    params: query
  })
}
export function patientInScience(query) {
  return request({
    url: '/icu/patpatient/patientInScience/' + query,
    method: 'get'
  })
}
export function fetchalready(query) {
  return request({
    url: '/icu/patpatient/inSciencePatientAll',
    method: 'get',
    params: query
  })
}
export function fetchbeds(obj) {
  return request({
    url: '/icu/hospitalBed/page',
    method: 'get',
    params: obj
  })
}

export function bedRecord(bedId, patientId) {
  return request({
    url: '/icu/bedRecord/add',
    method: 'post',
    data: {
      bedId: bedId,
      patientId: patientId
    }
  })
}

export function bedRecordchangeBed(bedId, patientId) {
  return request({
    url: '/icu/bedRecord/changeBed',
    method: 'post',
    data: {
      bedId: bedId,
      patientId: patientId
    }
  })
}

export function addalready(obj) {
  return request({
    url: '/icu/device/add',
    method: 'post',
    data: obj
  })
}

export function delwaiting(id) {
  return request({
    url: '/icu/hispatient/enrolledPatient',
    method: 'post',
    data: id
  })
}
export function operationBtn(flowName, id) {
  return request({
    url: '/icu/processrecord/selectPatient',
    method: 'post',
    data: {
      flowName: flowName,
      patientId: id
    }
  })
}
export function pharmacyIp(N) {
  return request({
    url: '/icu/pharmacy/ip/',
    method: 'get',
    params: {
      type: N
    }
  })
}

export function patientIdSelect(patientId) {
  return request({
    url: '/icu/patpatient/patientIdSelect/' + patientId,
    method: 'get'
  })
}
export function getByPatientId(patientId) {
  return request({
    url: '/icu/patpatient/getByPatientId/' + patientId,
    method: 'get'
  })
}
export function entranceAssessRecord(obj) {
  return request({
    url: '/icu/entranceAssessRecord/add',
    method: 'post',
    data: {
      patientId: obj.patientId,
      allergenicFood: obj.allergenicFood,
      allergenicFoodRemarks: obj.allergenicFoodRemarks,
      communicationBarriers: obj.communicationBarriers,
      communicationBarriersRemarks: obj
        .communicationBarriersRemarks,
      dataSource: obj.dataSource,
      dataSourceRemarks: obj.dataSourceRemarks,
      drugAllergy: obj.drugAllergy,
      drugAllergyRemarks: obj.drugAllergyRemarks,
      entranceDiagnose: obj.entranceDiagnose,
      entrancePathway: obj.entrancePathway,
      familyHistory: obj.familyHistory,
      familyHistoryRemarks: obj.familyHistoryRemarks,
      otherAllergens: obj.otherAllergens,
      otherAllergensRemarks: obj.otherAllergensRemarks,
      patientAddress: obj.patientAddress,
      patientCostSource: obj.patientCostSource,
      patientCulture: obj.patientCulture,
      patientDrink: obj.patientDrink,
      patientDrinkRemarks: obj.patientDrinkRemarks,
      patientDwellingState: obj.patientDwellingState,
      patientEconomySource: obj.patientEconomySource,
      patientMarriage: obj.patientMarriage,
      patientNation: obj.patientNation,
      patientPhone: obj.patientPhone,
      patientProfession: obj.patientProfession,
      patientReligionDemand: obj.patientReligionDemand,
      patientReligionDemandRemarks: obj
        .patientReligionDemandRemarks,
      patientReligionFaith: obj.patientReligionFaith,
      patientSmoke: obj.patientSmoke,
      patientSmokeRemarks: obj.patientSmokeRemarks,
      previousHistory: obj.previousHistory,
      previousHistoryRemarks: obj.previousHistoryRemarks,
      skinCase: obj.skinCase,
      skinCaseRemarks: obj.skinCaseRemarks,
      socialSupportRemarks: obj.socialSupportRemarks,
      specialCrowd: obj.specialCrowd,
      socialSupport: obj.socialSupport,
      specialCrowdRemarks: obj.specialCrowdRemarks,
      treatmentCompliance: obj.treatmentCompliance
    }
  })
}
export function entranceAssessRecordUpdate(obj, id) {
  return request({
    url: '/icu/entranceAssessRecord/update',
    method: 'post',
    data: {
      id: id,
      patientId: obj.patientId,
      allergenicFood: obj.allergenicFood,
      allergenicFoodRemarks: obj.allergenicFoodRemarks,
      communicationBarriers: obj.communicationBarriers,
      communicationBarriersRemarks: obj
        .communicationBarriersRemarks,
      dataSource: obj.dataSource,
      dataSourceRemarks: obj.dataSourceRemarks,
      drugAllergy: obj.drugAllergy,
      drugAllergyRemarks: obj.drugAllergyRemarks,
      entranceDiagnose: obj.entranceDiagnose,
      entrancePathway: obj.entrancePathway,
      familyHistory: obj.familyHistory,
      familyHistoryRemarks: obj.familyHistoryRemarks,
      otherAllergens: obj.otherAllergens,
      otherAllergensRemarks: obj.otherAllergensRemarks,
      patientAddress: obj.patientAddress,
      patientCostSource: obj.patientCostSource,
      patientCulture: obj.patientCulture,
      patientDrink: obj.patientDrink,
      patientDrinkRemarks: obj.patientDrinkRemarks,
      patientDwellingState: obj.patientDwellingState,
      patientEconomySource: obj.patientEconomySource,
      patientMarriage: obj.patientMarriage,
      patientNation: obj.patientNation,
      patientPhone: obj.patientPhone,
      patientProfession: obj.patientProfession,
      patientReligionDemand: obj.patientReligionDemand,
      patientReligionDemandRemarks: obj
        .patientReligionDemandRemarks,
      patientReligionFaith: obj.patientReligionFaith,
      patientSmoke: obj.patientSmoke,
      patientSmokeRemarks: obj.patientSmokeRemarks,
      previousHistory: obj.previousHistory,
      previousHistoryRemarks: obj.previousHistoryRemarks,
      skinCase: obj.skinCase,
      skinCaseRemarks: obj.skinCaseRemarks,
      socialSupportRemarks: obj.socialSupportRemarks,
      specialCrowd: obj.specialCrowd,
      socialSupport: obj.socialSupport,
      specialCrowdRemarks: obj.specialCrowdRemarks,
      treatmentCompliance: obj.treatmentCompliance
    }
  })
}

export function getByPatient(patientId) {
  return request({
    url: '/icu/entranceAssessRecord/getByPatient/' + patientId,
    method: 'get'
  })
}

export function processAdd(flowName, obj) {
  return request({
    url: '/icu/processrecord/add',
    method: 'post',
    data: {
      flowName: flowName,
      patientId: obj
    }
  })
}
export function nursepatientrecordAdd(onlyDutyNurse, nurseId, patientsPatientId) {
  return request({
    url: '/icu/nursepatientrecord/add',
    method: 'post',
    data: {
      onlyDutyNurse: onlyDutyNurse,
      nurseId: nurseId,
      patientId: patientsPatientId
    }
  })
}
export function nursepatientrecordUpdate(onlyDutyNurse, nurseId, patientsPatientId) {
  return request({
    url: '/icu/nursepatientrecord/update',
    method: 'post',
    data: {
      onlyDutyNurse: onlyDutyNurse,
      nurseId: nurseId,
      patientId: patientsPatientId
    }
  })
}
export function nursepatientrecordPreJump(obj) {
  return request({
    url: '/icu/nursepatientrecord/preJump',
    method: 'post',
    data: {
      patientId: obj
    }
  })
}

export function addTiming(obj) {
  return request({
    url: '/icu/timingexecution/updateList',
    method: 'post',
    data: obj
  })
}

export function addTasks(obj) {
  return request({
    url: '/icu/subtask/nursingScheme',
    method: 'post',
    data: obj
  })
}

export function getTaskTemplate() {
  return request({
    url: '/icu/template/selectTaskPreJump',
    method: 'post',
    data: {}
  })
}

export function nurseInfo() {
  return request({
    url: '/icu/nurse/nurseInfo',
    method: 'post'
  })
}

export function putObj(flowName, id, specificStepId) {
  return request({
    url: '/icu/processrecord/update',
    method: 'post',
    data: {
      flowName: flowName,
      id: id,
      specificStepId: specificStepId
    }
  })
}
export function selectAll() {
  return request({
    url: '/icu/template/selectAll',
    method: 'get'
  })
}

