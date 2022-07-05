import axios from "axios"
const baseURL = "https://worldtimeapi.org/api/timezone/"
const apiHelper = axios.create({
  baseURL
})

export default {
  validAreaList() {
    return apiHelper.get()
  },
  localTimeAPI(area) {
    return apiHelper.get(area)
  }
}