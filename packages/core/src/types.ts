export type TrackerEventProperties = Record<string, unknown>;

export type SearchFilterAttribute = {
  field: string;
  value: string | string[];
};

export type DocumentAttribute = {
  index: string;
  id: string;
};

export type ResultItemAttribute = {
  document: DocumentAttribute;
  page: {
    url: string;
  };
};

type SortAttribute = {
  name: string;
  direction?: "asc" | "desc";
};

export type SearchEventAttribute = {
  query: string;
  filters?: SearchFilterAttribute[];
  search_application?: string;
  page?: {
    current: number;
    size: number;
  };
  sort?: SortAttribute | SortAttribute[];
  results?: {
    items: ResultItemAttribute[];
    total_results: number;
  };
};

export type PageEventAttribute = {
  referrer?: string;
  url: string;
  title?: string;
};

export type UserEventAttribute = {
  id: string;
};

export type SessionEventAttribute = {
  id: string;
};

export type EventProperties = {
  search?: SearchEventAttribute;
  page?: PageEventAttribute;
  document?: DocumentAttribute;
  session?: SessionEventAttribute;
  user?: UserEventAttribute;
};

export type DataProvider = (
  eventType: TrackerEventType,
  event: EventProperties
) => EventProperties;

export type TrackerEventType = "page_view" | "search" | "search_click";

export interface TrackerOptions {
  /**
   * @description Required. collection name that you have setup.
   */
  collectionName: string;
  /**
   * @description Required. The api key thats provided when setting up an analytics collection. See integration page to create one.
   */
  apiKey: string;
  endpoint: string;
  dataProviders?: Record<string, DataProvider>;
  user?: {
    /**
     * @description value of the user token
     * @default EA_UID
     */
    token?: string | (() => string);
    /**
     * @description length of time for the user token
     * @default 24hrs
     */
    lifetime?: number;
  };
  session?: {
    /**
     * @description length of time for the session
     * @default 30 minutes
     */
    lifetime?: number;
  };
  /**
   * @description When debug is true, will add the querystring debug to the request.
   * @default false
   */
  debug?: boolean;
}

export interface SearchEventInputProperties {
  search: SearchEventAttribute;
}

interface BaseSearchEventInputProperties {
  search: SearchEventAttribute;
  document?: DocumentAttribute;
  page?: PageEventAttribute;
}

interface SearchClickEventInputWithDocumentProperties
  extends BaseSearchEventInputProperties {
  document: DocumentAttribute;
}

interface SearchClickEventInputWithPageProperties
  extends BaseSearchEventInputProperties {
  page: PageEventAttribute;
}

export type SearchClickEventInputProperties =
  | SearchClickEventInputWithPageProperties
  | SearchClickEventInputWithDocumentProperties;

export interface PageViewInputProperties {
  document?: DocumentAttribute;
}

export type EventInputProperties =
  | SearchClickEventInputProperties
  | SearchEventInputProperties
  | PageViewInputProperties;
