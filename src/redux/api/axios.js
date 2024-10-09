// import axios from "axios";

// export const MAINURL = "http://185.203.238.200:8000/";
// export const MAINURLSOCKET = "ws://185.203.238.200:8000";

// const instance = axios.create({
//   baseURL: MAINURL,
// });

// export default instance;

import axios from "axios";

export const MAINURL = "http://api.ntsi.u-smart.uz/";
export const MAINURLSOCKET = "ws://api.ntsi.u-smart.uz/";

const instance = axios.create({
  baseURL: MAINURL,
});

export default instance;
