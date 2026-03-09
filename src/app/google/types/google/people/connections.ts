import { Person, PersonFieldMask, ReadSourceType } from '../people';

/**
 * The order in which a list of connections should be sorted.
 * @see https://developers.google.com/people/api/rest/v1/people.connections/list#SortOrder
 */
export type SortOrder =
  | 'LAST_MODIFIED_ASCENDING'
  | 'LAST_MODIFIED_DESCENDING'
  | 'FIRST_NAME_ASCENDING'
  | 'LAST_NAME_ASCENDING';

/**
 * Options for the people.connections.list method.
 * @see https://developers.google.com/people/api/rest/v1/people.connections/list#query-parameters
 */
export interface ListConnectionsOptions {
  /**
   * **Required**. A field mask to restrict which fields on each person are returned.
   * Multiple fields can be specified as a comma-separated string or array.
   * @example "names,emailAddresses"
   */
  readonly personFields: readonly PersonFieldMask[];

  /**
   * _Optional_. The number of connections to include in the response.
   * Valid values are between 1 and 1000, inclusive. Defaults to 100.
   */
  readonly pageSize?: number;

  /**
   * _Optional_. A page token, received from a previous response `nextPageToken`.
   * Provide this to retrieve the subsequent page.
   */
  readonly pageToken?: string;

  /**
   * _Optional_. The order in which the connections should be sorted.
   * Defaults to `LAST_MODIFIED_ASCENDING`.
   */
  readonly sortOrder?: SortOrder;

  /**
   * _Optional_. Whether the response should return `nextSyncToken` on the last page of results.
   * Used to get incremental changes since the last request.
   */
  readonly requestSyncToken?: boolean;

  /**
   * _Optional_. A sync token received from a previous response `nextSyncToken`.
   * Provide this to retrieve only the resources changed since the last request.
   */
  readonly syncToken?: string;

  /**
   * _Optional_. A mask of what source types to return.
   * Defaults to `READ_SOURCE_TYPE_CONTACT` and `READ_SOURCE_TYPE_PROFILE`.
   */
  readonly sources?: readonly ReadSourceType[];
}

/**
 * The response to a request for the authenticated user's connections.
 * @see https://developers.google.com/people/api/rest/v1/people.connections/list#response-body
 */
export interface ListConnectionsResponse {
  /** The list of people that the requestor is connected to. */
  readonly connections: readonly Person[];

  /**
   * A token, which can be sent as `pageToken` to retrieve the next page.
   * If this field is omitted, there are no subsequent pages.
   */
  readonly nextPageToken?: string;

  /**
   * A token, which can be sent as `syncToken` to retrieve changes since the last request.
   * Only the last page of a paginated response will contain this field.
   */
  readonly nextSyncToken?: string;

  /**
   * The total number of items in the list without pagination.
   */
  readonly totalItems: number;
}
