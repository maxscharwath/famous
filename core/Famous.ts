import { Website } from './Website'
import { Dispatcher, request } from 'undici'

export enum QueryStatus {
  UNKNOWN = 'UNKNOWN', //Error Occurred While Trying To Detect Username
  CLAIMED = 'CLAIMED', //Username Detected
  AVAILABLE = 'AVAILABLE', // Username Not Detected
  ILLEGAL = 'ILLEGAL', //Username Not Allowable For This Site
}

type ResponseData = Pick<Dispatcher.ResponseData, "headers"> & Pick<Dispatcher.ResponseData, "statusCode">  & {data:string}

type Response = {
  url_main:string;
  url_user:string;
  status:QueryStatus;
  http_status: number|null;
}

export async function downloadWebsiteList (): Promise<Record<string, Website>> {
  const { body } = await request('https://raw.githubusercontent.com/sherlock-project/sherlock/master/sherlock/resources/data.json')
  return body.json();
}

async function getResponse (username: string, website: Website): Promise<ResponseData> {
  const url = website.urlProbe ?
    website.urlProbe.replace('{}', username) :
    website.url.replace('{}', username)

  const options: Partial<Dispatcher.RequestOptions> = {
    method: 'GET',
    maxRedirections: 5,
  }
  if (website.errorType === 'status_code') {
    options.method = 'HEAD';
  }
  if (website.errorType === 'response_url') {
    options.maxRedirections = 0;
  }
  if (website.request_method) {
    options.method = website.request_method;
    if (website.request_payload) {
      options.body = JSON.stringify(website.request_payload).replaceAll('{}', username)
    }
  }
  const response = await request(url, options);
  return {
    headers: response.headers,
    statusCode:response.statusCode,
    data: await response.body.text()
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
