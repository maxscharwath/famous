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

type Response = {
  url_main:string;
  url_user:string;
  status:QueryStatus;
  http_status: number|null;
}

async function getResponse (username: string, website: Website): Promise<ResponseData> {
  const url = website.urlProbe ?
    website.urlProbe.replace('{}', username) :
    website.url.replace('{}', username)

  const options: FetchOptions<"json"> = {
    method: 'GET',
    redirect: 'follow',
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
  const response = await $fetch.raw(url, options).catch((e:FetchError) => e.response)
  const data = response.bodyUsed ? null : await response.text()
  return {
    headers: response.headers,
    statusCode:response.status,
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

  if (website.errorType === 'message') {
    responseData.status = (response.data).includes(website.errorMsg) ? QueryStatus.AVAILABLE : QueryStatus.CLAIMED
  } else {
    responseData.status = (response.statusCode > 200 && response.statusCode < 300) ? QueryStatus.CLAIMED : QueryStatus.AVAILABLE
  }

  return {
    ...responseData,
    http_status: response.statusCode,
  };
}
