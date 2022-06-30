import axios from "axios"
const baseURL = "https://worldtimeapi.org/api/timezone/"
const apiHelper = axios.create({
  baseURL
})

export default {
  LocalTimeAPI(area) {
    return apiHelper.get(area)
  }
}