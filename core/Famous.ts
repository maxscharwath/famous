import { Website } from './Website'
import { $fetch, FetchError, FetchOptions } from 'ohmyfetch'

export enum QueryStatus {
  UNKNOWN = 'UNKNOWN', //Error Occurred While Trying To Detect Username
  CLAIMED = 'CLAIMED', //Username Detected
  AVAILABLE = 'AVAILABLE', // Username Not Detected
  ILLEGAL = 'ILLEGAL', //Username Not Allowable For This Site
}

type ResponseData = {
  headers: Headers,
  statusCode: number,
  data:string
}

export type Response = {
  url_main:string;
  url_user:string;
  status:QueryStatus;
  http_status: number|null;
}

async function getResponse (username: string, website: Website): Promise<ResponseData> {
  const url = website.urlProbe ?
    website.urlProbe.replace('{}', username) :
    website.url.replace('{}', username)

  const options: FetchOptions = {
    method: 'GET',
    redirect: 'follow',
    cache: 'no-cache',
    responseType: 'text',
  }
  if (website.errorType === 'status_code') {
    options.method = 'HEAD';
  }
  if (website.errorType === 'response_url') {
    //no redirect
    options.redirect = 'manual';
  }
  if (website.request_method) {
    options.method = website.request_method;
    if (website.request_payload) {
      options.body = JSON.stringify(website.request_payload).replaceAll('{}', username)
    }
  }
  const {response,data} = await $fetch.raw(url, options)
    .then(async (response) => ({ response, data: response._data }))
    .catch((e: FetchError) => {
      return ({ response: e.response, data: e.data })
    })

  return {
    headers: response?.headers,
    statusCode:response?.status,
    data
  }
}

export async function checkUsername (username: string, website: Website): Promise<Response> {
  const responseData:Response = {
    http_status: null,
    status: QueryStatus.UNKNOWN,
    url_main: website.urlMain.replace('{}', username),
    url_user: website.url?.replace('{}', username)
  }

  if(website.regexCheck && !new RegExp(website.regexCheck).test(username)) {
    responseData.status = QueryStatus.ILLEGAL;
    return responseData;
  }

  const response = await getResponse(username, website);

  responseData.status = (() => {
    if (website.errorType === 'message') {
      if (!response.data) {
        return QueryStatus.UNKNOWN;
      }
      let flag = true;
      const messages = Array.isArray(website.errorMsg) ? website.errorMsg : [website.errorMsg];
      for (const message of messages) {
        if (response.data.includes(message)) {
          flag = false;
          break;
        }
      }
      return flag ? QueryStatus.CLAIMED : QueryStatus.AVAILABLE;
    }
      if (website.errorType === 'status_code') {
      if (response.statusCode === website.errorCode) {
        return QueryStatus.AVAILABLE;
      } else if (!(response.statusCode >= 300 || response.statusCode < 200)) {
        return QueryStatus.CLAIMED;
      }
      return  QueryStatus.AVAILABLE;
    }
    if (website.errorType === 'response_url') {
      return response.statusCode >= 200 && response.statusCode < 300 ? QueryStatus.CLAIMED : QueryStatus.AVAILABLE
    }
  })()

  return {
    ...responseData,
    http_status: response.statusCode,
  };
}

export async function downloadList(){
  const url="https://raw.githubusercontent.com/sherlock-project/sherlock/master/sherlock/resources/data.json"
  return $fetch<Record<string, Website>>(url,{
    parseResponse: JSON.parse
  })
}
