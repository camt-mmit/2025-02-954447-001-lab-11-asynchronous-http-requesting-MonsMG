/**
 * The HTTP entity tag of the resource. Used for web cache validation.
 */
export type etag = string;

export interface GoogleResource {
  /** The HTTP entity tag of the resource. Used for web cache validation. */
  readonly etag: etag;
}
