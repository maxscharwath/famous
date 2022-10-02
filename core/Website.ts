import { HttpMethod } from 'undici/types/dispatcher'

type WebsiteBase = {
  regexCheck?: string;
  url: string;
  urlMain: string;
  urlProbe?: string;
  username_claimed: string;
  username_unclaimed: string;
  request_method?: HttpMethod;
  request_payload?: any
}

export type WebsiteStatusCode = WebsiteBase & {
  errorType: 'status_code';
  errorCode?: number;
}

export type WebsiteMessage = WebsiteBase & {
  errorType: 'message';
  errorMsg: string | string[];
}

export type WebsiteResponseUrl = WebsiteBase & {
  errorType: 'response_url';
  errorUrl: string;
}

export type Website = WebsiteStatusCode | WebsiteMessage | WebsiteResponseUrl;
