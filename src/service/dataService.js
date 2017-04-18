/**
 * Created by Qiaomu on 2017/4/16.
 */

import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

const dataServerUrl = "http://127.0.0.1:5000";
const $http = Vue.http

function test (callback) {
  const url = `${dataServerUrl}/test`
  $http.get(url).then(response => {
    callback(response.data)
  }, errResponse => {
    console.log(errResponse)
  })
}

function readMap (mapId, callback) {
  const url = `${dataServerUrl}/getStationMap`
  $http.post(url, {'StationId': mapId}).then(response => {
    callback(response.data)
  }, errResponse => {
    console.log(errResponse)
  })
}

function rendLegendConfiguration(mapId, callback){
  const url = `${dataServerUrl}/getLegendConfiguration`
  $http.post(url, {'StationId': mapId}).then(response => {
    callback(response.data)
  }, errResponse => {
    console.log(errResponse)
  })
}

export default{
  readMap,
  test,
  rendLegendConfiguration
}
