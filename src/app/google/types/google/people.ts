import { GoogleResource } from '../google';

/** The source type for the data. */
export type SourceType =
  | 'SOURCE_TYPE_UNSPECIFIED'
  | 'ACCOUNT'
  | 'PROFILE'
  | 'DOMAIN_PROFILE'
  | 'CONTACT'
  | 'OTHER_CONTACT'
  | 'DOMAIN_CONTACT';

/** The type of the person object. */
export type ObjectType = 'OBJECT_TYPE_UNSPECIFIED' | 'PERSON' | 'PAGE';

/** The Google user type. */
export type UserType = 'USER_TYPE_UNKNOWN' | 'GOOGLE_USER' | 'GPLUS_USER' | 'GOOGLE_APPS_USER';

/** The content type of a biography. */
export type BiographyContentType = 'CONTENT_TYPE_UNSPECIFIED' | 'TEXT_PLAIN' | 'TEXT_HTML';

/** The age range of the person. */
export type AgeRange =
  | 'AGE_RANGE_UNSPECIFIED'
  | 'LESS_THAN_EIGHTEEN'
  | 'EIGHTEEN_TO_TWENTY_ONE'
  | 'OLDER_THAN_TWENTY_ONE';

/** Standard field types for categorized data. */
export type FieldType = 'home' | 'work' | 'other' | 'mobile' | 'fax' | 'pager' | string;

/** Metadata about a person. */
export interface PersonMetadata {
  /** The sources of data for the person. */
  readonly sources: readonly Source[];
  /** Output only. Any former resource names this person has had. */
  readonly previousResourceNames: readonly string[];
  /** Output only. Resource names of people linked to this resource. */
  readonly linkedPeopleResourceNames: readonly string[];
  /** Output only. True if the person resource has been deleted. */
  readonly deleted: boolean;
}

/** The source of a field. */
export interface Source {
  /** The source type. */
  readonly type: SourceType;
  /** The unique identifier within the source type. */
  readonly id: string;
  /** Only populated in person.metadata.sources. The HTTP entity tag of the source. */
  readonly etag: string;
  /** Output only. Last update timestamp in RFC3339 UTC "Zulu" format. */
  readonly updateTime: string;
  /** Output only. Metadata about a source of type PROFILE. */
  readonly profileMetadata: ProfileMetadata;
}

/** The metadata about a profile. */
export interface ProfileMetadata {
  /** Output only. The type of the person object. */
  readonly objectType: ObjectType;
  /** Output only. The user types. */
  readonly userTypes: readonly UserType[];
}

/** The metadata about a field. */
export interface FieldMetadata {
  /** True if the field is the primary field for the source. */
  readonly primary: boolean;
  /** Output only. True if the field is verified by the corresponding domain admin. */
  readonly verified: boolean;
  /** The source of the field. */
  readonly source: Source;
  /** Output only. True if the field is the primary field for the source. */
  readonly sourcePrimary: boolean;
}

/** A person's name. */
export interface Name {
  /** Metadata about the name. */
  readonly metadata: FieldMetadata;
  /** The display name formatted according to the locale. */
  readonly displayName: string;
  /** The display name with the last name first. */
  readonly displayNameLastFirst: string;
  /** The family name (last name). */
  readonly familyName: string;
  /** The given name (first name). */
  readonly givenName: string;
  /** The middle name(s). */
  readonly middleName: string;
  /** The honorific prefixes, such as 'Mrs.' or 'Dr.' */
  readonly honorificPrefix: string;
  /** The honorific suffixes, such as 'M.B.A.' */
  readonly honorificSuffix: string;
  /** The phonetic family name. */
  readonly phoneticFamilyName: string;
  /** The phonetic given name. */
  readonly phoneticGivenName: string;
  /** The phonetic middle name. */
  readonly phoneticMiddleName: string;
  /** The phonetic honorific prefix. */
  readonly phoneticHonorificPrefix: string;
  /** The phonetic honorific suffix. */
  readonly phoneticHonorificSuffix: string;
}

/** A person's physical address. */
export interface Address {
  /** Metadata about the address. */
  readonly metadata: FieldMetadata;
  /** The complete address as a single string. */
  readonly formattedValue: string;
  /** The type of the address. Custom or one of 'home', 'work', 'other'. */
  readonly type: FieldType;
  /** Output only. The type translated and formatted in the viewer's locale. */
  readonly formattedType: string;
  /** The street address. */
  readonly streetAddress: string;
  /** The extended address. */
  readonly extendedAddress: string;
  /** The city. */
  readonly city: string;
  /** The region (state/province). */
  readonly region: string;
  /** The postal code. */
  readonly postalCode: string;
  /** The country. */
  readonly country: string;
  /** The ISO 3166-1 alpha-2 country code. */
  readonly countryCode: string;
}

/** A person's phone number. */
export interface PhoneNumber {
  /** Metadata about the phone number. */
  readonly metadata: FieldMetadata;
  /** The phone number. */
  readonly value: string;
  /** Output only. The phone number in canonical E.164 format. */
  readonly canonicalForm: string;
  /** The type of the phone number. Custom or 'home', 'work', 'mobile', etc. */
  readonly type: FieldType;
  /** Output only. The type translated and formatted in the viewer's locale. */
  readonly formattedType: string;
}

/** Represents a whole or partial calendar date. */
export interface DateObject {
  /** Year of date. Must be from 1 to 9999. */
  readonly year: number;
  /** Month of year. Must be from 1 to 12. */
  readonly month: number;
  /** Day of month. Must be from 1 to 31. */
  readonly day: number;
}

/** A person's email address. */
export interface EmailAddress {
  /** Metadata about the email address. */
  readonly metadata: FieldMetadata;
  /** The email address. */
  readonly value: string;
  /** The type of the email address. Custom or 'home', 'work', 'other'. */
  readonly type: FieldType;
  /** Output only. The type translated and formatted in the viewer's locale. */
  readonly formattedType: string;
  /** The display name of the email address. */
  readonly displayName: string;
}

/** A person's past or current organization. */
export interface Organization {
  /** Metadata about the organization. */
  readonly metadata: FieldMetadata;
  /** The type of the organization. Custom or 'work', 'school'. */
  readonly type: FieldType;
  /** Output only. The type translated and formatted in the viewer's locale. */
  readonly formattedType: string;
  /** The start date when the person joined the organization. */
  readonly startDate: DateObject;
  /** The end date when the person left the organization. */
  readonly endDate: DateObject;
  /** True if the person is currently part of the organization. */
  readonly current: boolean;
  /** The name of the organization. */
  readonly name: string;
  /** The phonetic name of the organization. */
  readonly phoneticName: string;
  /** The person's department at the organization. */
  readonly department: string;
  /** The person's title at the organization. */
  readonly title: string;
  /** The person's job description at the organization. */
  readonly jobDescription: string;
  /** The symbol of the organization. */
  readonly symbol: string;
  /** The location of the organization. */
  readonly location: string;
  /** The domain name associated with the organization. */
  readonly domain: string;
}

/** A person's birthday. */
export interface Birthday {
  /** Metadata about the birthday. */
  readonly metadata: FieldMetadata;
  /** The date of the birthday. */
  readonly date: DateObject;
  /** A free-form description of the birthday. */
  readonly text: string;
}

/** A person's gender. */
export interface Gender {
  /** Metadata about the gender. */
  readonly metadata: FieldMetadata;
  /** The gender for the person. Custom or 'male', 'female', 'other'. */
  readonly value: string;
  /** Output only. The value translated and formatted in the viewer's locale. */
  readonly formattedValue: string;
  /** The pronoun used to address the person. */
  readonly addressMeAs: string;
}

/** A person's photo. */
export interface Photo {
  /** Metadata about the photo. */
  readonly metadata: FieldMetadata;
  /** The URL of the photo. */
  readonly url: string;
}

/** A person's biography. */
export interface Biography {
  /** Metadata about the biography. */
  readonly metadata: FieldMetadata;
  /** The short biography. */
  readonly value: string;
  /** The content type of the biography. */
  readonly contentType: BiographyContentType;
}

/** A person's age range. */
export interface AgeRangeType {
  /** Metadata about the age range. */
  readonly metadata: FieldMetadata;
  /** The age range. */
  readonly ageRange: AgeRange;
}

/** A person's group membership. */
export interface Membership {
  /** Metadata about the membership. */
  readonly metadata: FieldMetadata;
  /** The contact group membership. */
  readonly contactGroupMembership: {
    /** The contact group ID. */
    readonly contactGroupId: string;
    /** The resource name for the contact group. */
    readonly contactGroupResourceName: string;
  };
  /** The domain membership. */
  readonly domainMembership: {
    /** True if the person is in the viewer's Google Workspace domain. */
    readonly inViewerDomain: boolean;
  };
}

/** A person's instant messaging client. */
export interface ImClient {
  /** Metadata about the IM client. */
  readonly metadata: FieldMetadata;
  /** The user name used in the IM client. */
  readonly username: string;
  /** The type of the IM client. Custom or 'home', 'work', 'other'. */
  readonly type: FieldType;
  /** Output only. The type translated and formatted in the viewer's locale. */
  readonly formattedType: string;
  /** The protocol of the IM client. Custom or 'aim', 'msn', 'yahoo', 'skype', etc. */
  readonly protocol: string;
  /** Output only. The protocol translated and formatted in the viewer's locale. */
  readonly formattedProtocol: string;
}

/** A person's associated URL. */
export interface Url {
  /** Metadata about the URL. */
  readonly metadata: FieldMetadata;
  /** The URL. */
  readonly value: string;
  /** The type of the URL. Custom or 'home', 'work', 'blog', 'profile', etc. */
  readonly type: FieldType;
  /** Output only. The type translated and formatted in the viewer's locale. */
  readonly formattedType: string;
}

/** A person's occupation. */
export interface Occupation {
  /** Metadata about the occupation. */
  readonly metadata: FieldMetadata;
  /** The occupation; for example, 'Software Engineer'. */
  readonly value: string;
}

/** A person's interest. */
export interface Interest {
  /** Metadata about the interest. */
  readonly metadata: FieldMetadata;
  /** The interest; for example, 'Skiing'. */
  readonly value: string;
}

/** A person's skill. */
export interface Skill {
  /** Metadata about the skill. */
  readonly metadata: FieldMetadata;
  /** The skill; for example, 'JavaScript'. */
  readonly value: string;
}

/** A person's location. */
export interface Location {
  /** Metadata about the location. */
  readonly metadata: FieldMetadata;
  /** The free-form value of the location. */
  readonly value: string;
  /** The type of the location. Custom or 'home', 'work'. */
  readonly type: FieldType;
  /** True if the location is the person's current location. */
  readonly current: boolean;
}

/** A person's relation to another person. */
export interface Relation {
  /** Metadata about the relation. */
  readonly metadata: FieldMetadata;
  /** The name of the other person this relation refers to. */
  readonly person: string;
  /** The type of the relation. Custom or 'spouse', 'child', 'mother', etc. */
  readonly type: string;
  /** Output only. The type translated and formatted in the viewer's locale. */
  readonly formattedType: string;
}

/** A person's event. */
export interface Event {
  /** Metadata about the event. */
  readonly metadata: FieldMetadata;
  /** The date of the event. */
  readonly date: DateObject;
  /** The type of the event. Custom or 'anniversary', 'other'. */
  readonly type: string;
  /** Output only. The type translated and formatted in the viewer's locale. */
  readonly formattedType: string;
}

/** A person's external ID. */
export interface ExternalId {
  /** Metadata about the external ID. */
  readonly metadata: FieldMetadata;
  /** The value of the external ID. */
  readonly value: string;
  /** The type of the external ID. Custom or 'account', 'customer', 'network'. */
  readonly type: string;
  /** Output only. The type translated and formatted in the viewer's locale. */
  readonly formattedType: string;
}

/** A person's nickname. */
export interface Nickname {
  /** Metadata about the nickname. */
  readonly metadata: FieldMetadata;
  /** The nickname. */
  readonly value: string;
  /** The type of the nickname. */
  readonly type: 'DEFAULT' | 'MAIDEN_NAME' | 'INITIALS' | 'GPLUS' | 'OTHER_NAME';
}

/** A person's file-as. */
export interface FileAs {
  /** Metadata about the file-as. */
  readonly metadata: FieldMetadata;
  /** The file-as value. */
  readonly value: string;
}

/** A person's locale preference. */
export interface Locale {
  /** Metadata about the locale. */
  readonly metadata: FieldMetadata;
  /** The Unicode BCP 47 language tag, such as 'en-US'. */
  readonly value: string;
}

/** A person's miscellaneous keyword. */
export interface MiscKeyword {
  /** Metadata about the miscellaneous keyword. */
  readonly metadata: FieldMetadata;
  /** The value of the miscellaneous keyword. */
  readonly value: string;
  /** The type of the miscellaneous keyword. */
  readonly type:
    | 'TYPE_UNSPECIFIED'
    | 'OUTLOOK_BILLING_INFORMATION'
    | 'OUTLOOK_DIRECTORY_SERVER'
    | 'OUTLOOK_KEYWORD'
    | 'OUTLOOK_MILEAGE'
    | 'OUTLOOK_PRIORITY'
    | 'OUTLOOK_SENSITIVITY'
    | 'OUTLOOK_USER';
}

/** Arbitrary client data that is owned by the client. */
export interface ClientData {
  /** Metadata about the client data. */
  readonly metadata: FieldMetadata;
  /** The client-specified key of the client data. */
  readonly key: string;
  /** The client-specified value of the client data. */
  readonly value: string;
}

/** A person's user-defined data. */
export interface UserDefined {
  /** Metadata about the user-defined data. */
  readonly metadata: FieldMetadata;
  /** The end user specified key of the user-defined data. */
  readonly key: string;
  /** The end user specified value of the user-defined data. */
  readonly value: string;
}

/** A person's SIP address. */
export interface SipAddress {
  /** Metadata about the SIP address. */
  readonly metadata: FieldMetadata;
  /** The SIP address in the form 'sip:user@host'. */
  readonly value: string;
  /** The type of the SIP address. Custom or 'home', 'work', 'other'. */
  readonly type: FieldType;
  /** Output only. The type translated and formatted in the viewer's locale. */
  readonly formattedType: string;
}

/** A person's cover photo. */
export interface CoverPhoto {
  /** Metadata about the cover photo. */
  readonly metadata: FieldMetadata;
  /** The URL of the cover photo. */
  readonly url: string;
  /** True if the cover photo is the default cover photo. */
  readonly default: boolean;
}

/**
 * Information about a person merged from various data sources.
 * @see https://developers.google.com/people/api/rest/v1/people
 */
export interface Person extends GoogleResource {
  /** The resource name for the person, assigned by the server. Form: `people/{person_id}`. */
  readonly resourceName: `people/${string}`;
  /** Output only. Metadata about the person. */
  readonly metadata: PersonMetadata;
  /** The person's names. This field is a singleton for contact sources. */
  readonly names: readonly Name[];
  /** The person's nicknames. */
  readonly nicknames: readonly Nickname[];
  /** Output only. The person's photos. */
  readonly photos: readonly Photo[];
  /** Output only. The person's cover photos. */
  readonly coverPhotos: readonly CoverPhoto[];
  /** The person's genders. This field is a singleton for contact sources. */
  readonly genders: readonly Gender[];
  /** The person's birthdays. This field is a singleton for contact sources. */
  readonly birthdays: readonly Birthday[];
  /** Output only. The person's age ranges. */
  readonly ageRanges: readonly AgeRangeType[];
  /** The person's biographies. This field is a singleton for contact sources. */
  readonly biographies: readonly Biography[];
  /** The person's email addresses. Limited to 100 for list operations. */
  readonly emailAddresses: readonly EmailAddress[];
  /** The person's phone numbers. Limited to 100 for list operations. */
  readonly phoneNumbers: readonly PhoneNumber[];
  /** The person's street addresses. */
  readonly addresses: readonly Address[];
  /** The person's instant messaging clients. */
  readonly imClients: readonly ImClient[];
  /** The person's SIP addresses. */
  readonly sipAddresses: readonly SipAddress[];
  /** The person's associated URLs. */
  readonly urls: readonly Url[];
  /** The person's past or current organizations. */
  readonly organizations: readonly Organization[];
  /** The person's occupations. */
  readonly occupations: readonly Occupation[];
  /** The person's interests. */
  readonly interests: readonly Interest[];
  /** The person's skills. */
  readonly skills: readonly Skill[];
  /** The person's locations. */
  readonly locations: readonly Location[];
  /** The person's group memberships. */
  readonly memberships: readonly Membership[];
  /** The person's relations. */
  readonly relations: readonly Relation[];
  /** The person's events. */
  readonly events: readonly Event[];
  /** The person's external IDs. */
  readonly externalIds: readonly ExternalId[];
  /** The person's file-ases. */
  readonly fileAses: readonly FileAs[];
  /** The person's locale preferences. */
  readonly locales: readonly Locale[];
  /** The person's miscellaneous keywords. */
  readonly miscKeywords: readonly MiscKeyword[];
  /** The person's client data. */
  readonly clientData: readonly ClientData[];
  /** The person's user defined data. */
  readonly userDefined: readonly UserDefined[];
}

// ---------- Search Contacts ----------
/**
 * Available fields that can be returned in the Person resource.
 * These are used to populate the readMask.
 * @see https://developers.google.com/people/api/rest/v1/people#resource:-person
 */
export type PersonFieldMask =
  | 'addresses'
  | 'ageRanges'
  | 'biographies'
  | 'birthdays'
  | 'calendarUrls'
  | 'clientData'
  | 'coverPhotos'
  | 'emailAddresses'
  | 'events'
  | 'externalIds'
  | 'fileAses'
  | 'genders'
  | 'imClients'
  | 'interests'
  | 'locales'
  | 'locations'
  | 'memberships'
  | 'metadata'
  | 'miscKeywords'
  | 'names'
  | 'nicknames'
  | 'occupations'
  | 'organizations'
  | 'phoneNumbers'
  | 'photos'
  | 'relations'
  | 'sipAddresses'
  | 'skills'
  | 'urls'
  | 'userDefined';

/**
 * The source types to return for search.
 * @see https://developers.google.com/people/api/rest/v1/people/searchContacts#query-parameters
 */
export type ReadSourceType =
  | 'READ_SOURCE_TYPE_UNSPECIFIED'
  | 'READ_SOURCE_TYPE_CONTACT'
  | 'READ_SOURCE_TYPE_PROFILE';

/**
 * Options for the people.searchContacts method.
 */
export interface SearchContactsOptions {
  /**
   * **Required**. The plain-text query for the request.
   * Matches prefix phrases of names, nicknames, email addresses, phone numbers, and organizations.
   */
  readonly query: string;

  /**
   * **Required**. A field mask to restrict which fields on each person are returned.
   * Multiple fields can be specified as a comma-separated string.
   * @example "names,emailAddresses,phoneNumbers"
   */ readonly readMasks: readonly PersonFieldMask[];

  /**
   * _Optional_. The number of results to return.
   * Defaults to 10 if not set. Maximum value is 30.
   */
  readonly pageSize?: number;

  /**
   * _Optional_. A mask of what source types to return.
   * Defaults to READ_SOURCE_TYPE_CONTACT if not set.
   */
  readonly sources?: readonly ReadSourceType[];
}

/**
 * The response to a search request for the authenticated user, given a query.
 * @see https://developers.google.com/people/api/rest/v1/SearchResponse
 */
export interface SearchContactsResponse {
  /** The list of search results. Each result contains the person resource matched. */
  readonly results: readonly SearchContactResult[];
}

/**
 * A result of a search query.
 * @see https://developers.google.com/people/api/rest/v1/SearchResponse#SearchResult
 */
export interface SearchContactResult {
  /** The person resource that matched the search query. */
  readonly person: Person;
}
