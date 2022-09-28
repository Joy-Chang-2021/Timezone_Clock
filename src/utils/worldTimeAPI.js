import axios from "axios"
const baseURL = "https://worldtimeapi.org/api/timezone/"
const apiHelper = axios.create({
  baseURL
})

export default {
  localTimeAPI(area) {
    return apiHelper.get(area)
  }
}