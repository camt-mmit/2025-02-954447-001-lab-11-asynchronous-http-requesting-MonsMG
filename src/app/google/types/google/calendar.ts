import { GoogleResource } from '../google';
import { DeepPartial } from '../utils';

/**
 * วันที่ในรูปแบบ "yyyy-mm-dd" อ้างอิงตามมาตรฐาน RFC 3339
 */
export type date = string;

/**
 * วันเวลาและวันที่ รูปแบบรวมกัน (ตามมาตรฐาน RFC 3339)
 * ต้องระบุ Time zone offset เสมอ ยกเว้นจะใช้ฟิลด์ timeZone แยกต่างหาก
 */
export type datetime = string;

export interface NestedDateTime {
  /** The time, as a combined date-time value (formatted according to RFC 3339). */
  readonly dateTime: datetime;
  /** The time zone in which the time is specified. (e.g. "Europe/Zurich"). */
  readonly timeZone: string;
}

export interface NestedDateOnly {
  /** The date, in the format "yyyy-mm-dd", as defined by RFC 3339. */
  readonly date: date;
  /** The time zone in which the time is specified. */
  readonly timeZone: string;
}

/**
 * ตัวแทนเวลาเริ่มหรือสิ้นสุดของกิจกรรม โดยเลือกได้ว่าจะเป็นแค่วันที่ (NestedDateOnly) หรือเต็มรูปแบบ (NestedDateTime)
 */
export type NestedDate = NestedDateTime | NestedDateOnly;

/**
 * Specific type of the event.
 */
export type EventType =
  | 'birthday'
  | 'default'
  | 'focusTime'
  | 'fromGmail'
  | 'outOfOffice'
  | 'workingLocation';

export interface CalendarResource<K extends string> extends GoogleResource {
  /** Type of the resource. */
  readonly kind: `calendar#${K}`;
}

// -------------------- EventResource --------------------

/**
 * ตัวแทนของทรัพยากรกิจกรรมบน Google Calendar
 */
export interface EventResource extends CalendarResource<'event'> {
  /** Opaque identifier of the event. */
  readonly id: string;
  /** Status of the event. Optional. Possible values are "confirmed", "tentative", "cancelled". */
  readonly status: 'confirmed' | 'tentative' | 'cancelled';
  /** An absolute link to this event in the Google Calendar Web UI. Read-only. */
  readonly htmlLink: string;
  /** Creation time of the event (as a RFC3339 timestamp). Read-only. */
  readonly created: datetime;
  /** Last modification time of the event (as a RFC3339 timestamp). Read-only. */
  readonly updated: datetime;
  /** Title of the event. */
  readonly summary: string;
  /** Description of the event. Can contain HTML. Optional. */
  readonly description: string;
  /** Geographic location of the event as free-form text. Optional. */
  readonly location: string;
  /** The color of the event. This is an ID referring to an entry in the event section of the colors resource. */
  readonly colorId: string;
  /** The creator of the event. */
  readonly creator: {
    /** The creator's Profile ID, if available. */
    readonly id: string;
    /** The creator's email address, if available. */
    readonly email: string;
    /** The creator's name, if available. */
    readonly displayName: string;
    /** Whether the creator corresponds to the calendar on which this copy of the event appears. */
    readonly self: boolean;
  };
  /** The organizer of the event. */
  readonly organizer: {
    /** The organizer's Profile ID, if available. */
    readonly id: string;
    /** The organizer's email address, if available. */
    readonly email: string;
    /** The organizer's name, if available. */
    readonly displayName: string;
    /** Whether the organizer corresponds to the calendar on which this copy of the event appears. */
    readonly self: boolean;
  };
  /** The (inclusive) start time of the event. */
  readonly start: NestedDate;
  /** The (exclusive) end time of the event. */
  readonly end: NestedDate;
  /** Whether the end time is actually unspecified. */
  readonly endTimeUnspecified: boolean;
  /** List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event. */
  readonly recurrence: readonly string[];
  /** For an instance of a recurring event, this is the id of the recurring event to which this instance belongs. */
  readonly recurringEventId: string;
  /** For an instance of a recurring event, this is the time at which this instance would start according to the recurrence data. */
  readonly originalStartTime: {
    /** The date, in the format "yyyy-mm-dd", as defined by RFC 3339. */
    readonly date: date;
    /** The time, as a combined date-time value (formatted according to RFC 3339). */
    readonly dateTime: datetime;
    /** The time zone in which the time is specified. */
    readonly timeZone: string;
  };
  /** Whether the event blocks time on the calendar. */
  readonly transparency: 'opaque' | 'transparent';
  /** Visibility of the event. */
  readonly visibility: 'default' | 'public' | 'private' | 'confidential';
  /** Event unique identifier as defined in RFC 5545. It is used to uniquely identify events across calendaring systems. */
  readonly iCalUID: string;
  /** Sequence number as per iCalendar. */
  readonly sequence: number;
  /** The attendees of the event. */
  readonly attendees: readonly {
    /** The attendee's Profile ID, if available. */
    readonly id: string;
    /** The attendee's email address, if available. This field must be present when adding an attendee. */
    readonly email: string;
    /** The attendee's name, if available. */
    readonly displayName: string;
    /** Whether this is the organizer of the event. Read-only. */
    readonly organizer: boolean;
    /** Whether this entry represents the calendar on which this copy of the event appears. Read-only. */
    readonly self: boolean;
    /** Whether the attendee is a resource. Can only be set during writing. */
    readonly resource: boolean;
    /** Whether this is an optional attendee. */
    readonly optional: boolean;
    /** The attendee's response status. */
    readonly responseStatus: 'needsAction' | 'declined' | 'tentative' | 'accepted';
    /** The attendee's response comment. */
    readonly comment: string;
    /** Number of additional guests the attendee receives. */
    readonly additionalGuests: number;
  }[];
  /** Whether attendees may have been omitted from the response. */
  readonly attendeesOmitted: boolean;
  /** Extended properties of the event. */
  readonly extendedProperties: {
    /** Properties that are private to the copy of the event that appears on this calendar. */
    readonly private: Readonly<Record<string, string>>;
    /** Properties that are shared between all copies of the event on other attendees' calendars. */
    readonly shared: Readonly<Record<string, string>>;
  };
  /** An absolute link to the Google Hangout associated with this event. Read-only. */
  readonly hangoutLink: string;
  /** Information about the conference for this event. */
  readonly conferenceData: {
    /** A request to generate a new conference and attach it to this event. */
    readonly createRequest: {
      /** The ID generated by the client which uniquely identifies the conference create request. */
      readonly requestId: string;
      /** The conference solution, such as Hangouts or Google Meet. */
      readonly conferenceSolutionKey: {
        /** The type of conference solution. */
        readonly type: 'eventHangout' | 'eventNamedHangout' | 'hangoutsMeet' | 'addOn';
      };
      /** The status of the conference create request. */
      readonly status: {
        /** The current status of the conference create request. */
        readonly statusCode: 'pending' | 'success' | 'failure';
      };
    };
    /** Information about individual conference entry points, such as URLs or phone numbers. */
    readonly entryPoints: readonly {
      /** The type of the conference entry point. */
      readonly entryPointType: 'video' | 'phone' | 'sip' | 'more';
      /** The ID to access the conference. */
      readonly uri: string;
      /** The label for the entry point. */
      readonly label: string;
      /** The PIN code to access the conference. */
      readonly pin: string;
      /** The access code to access the conference. */
      readonly accessCode: string;
      /** The meeting code to access the conference. */
      readonly meetingCode: string;
      /** The passcode to access the conference. */
      readonly passcode: string;
      /** The password to access the conference. */
      readonly password: string;
    }[];
    /** The conference solution that was applied. */
    readonly conferenceSolution: {
      /** The key which uniquely identifies the conference solution. */
      readonly key: {
        /** The type of conference solution. */
        readonly type: string;
      };
      /** The user-visible name of the conference solution. */
      readonly name: string;
      /** The user-visible icon for the conference solution. */
      readonly iconUri: string;
    };
    /** The ID of the conference. */
    readonly conferenceId: string;
    /** The signature of the conference data. */
    readonly signature: string;
    /** Additional notes for the conference. */
    readonly notes: string;
  };
  /** A gadget that extends this event. */
  readonly gadget: {
    /** The gadget's URL. */
    readonly link: string;
    /** The gadget's icon URL. */
    readonly iconLink: string;
    /** The gadget's width in pixels. */
    readonly width: number;
    /** The gadget's height in pixels. */
    readonly height: number;
    /** Preferences for the gadget. */
    readonly preferences: Readonly<Record<string, string>>;
  };
  /** Whether anyone can invite themselves to the event (deprecated). */
  readonly anyoneCanAddSelf: boolean;
  /** Whether attendees other than the organizer can invite others to the event. */
  readonly guestsCanInviteOthers: boolean;
  /** Whether attendees other than the organizer can modify the event. */
  readonly guestsCanModify: boolean;
  /** Whether attendees other than the organizer can see who the other attendees are. */
  readonly guestsCanSeeOtherGuests: boolean;
  /** Whether this is a private copy of the event. */
  readonly privateCopy: boolean;
  /** Whether the event is locked. */
  readonly locked: boolean;
  /** Information about the event's reminders for the authenticated user. */
  readonly reminders: {
    /** Whether the default reminders of the calendar apply to the event. */
    readonly useDefault: boolean;
    /** If useDefault is false, the list of overrides (up to 5) for this event. */
    readonly overrides: readonly {
      /** The method used by this reminder. */
      readonly method: 'email' | 'popup';
      /** Number of minutes before the start of the event. */
      readonly minutes: number;
    }[];
  };
  /** Source from which the event was created. */
  readonly source: {
    /** URL of the source. */
    readonly url: string;
    /** Title of the source. */
    readonly title: string;
  };
  /** Properties for a working location event. */
  readonly workingLocationProperties: {
    /** Type of working location. */
    readonly type: 'homeOffice' | 'officeLocation' | 'customLocation';
    /** If type is homeOffice, this field is present. */
    readonly homeOffice: unknown;
    /** If type is customLocation, this field contains information about the location. */
    readonly customLocation: {
      /** The user-visible label for the custom location. */
      readonly label: string;
    };
    /** If type is officeLocation, this field contains information about the office. */
    readonly officeLocation: {
      /** ID of the building. */
      readonly buildingId: string;
      /** ID of the floor. */
      readonly floorId: string;
      /** ID of the floor section. */
      readonly floorSectionId: string;
      /** ID of the desk. */
      readonly deskId: string;
      /** The user-visible label for the office location. */
      readonly label: string;
    };
  };
  /** Properties for an out of office event. */
  readonly outOfOfficeProperties: {
    /** Whether to decline new or existing invitations. */
    readonly autoDeclineMode: string;
    /** Response message for invitations that are declined. */
    readonly declineMessage: string;
  };
  /** Properties for a focus time event. */
  readonly focusTimeProperties: {
    /** Whether to decline new or existing invitations. */
    readonly autoDeclineMode: string;
    /** Response message for invitations that are declined. */
    readonly declineMessage: string;
    /** Status for chat/instant messaging during focus time. */
    readonly chatStatus: string;
  };
  /** File attachments for the event. */
  readonly attachments: readonly {
    /** URL to the file. */
    readonly fileUrl: string;
    /** Title of the attachment. */
    readonly title: string;
    /** Internet Media Type (MIME type) of the file. */
    readonly mimeType: string;
    /** URL link to an icon which represents the file type. */
    readonly iconLink: string;
    /** ID of the file. */
    readonly fileId: string;
  }[];
  /** Properties for a birthday event. */
  readonly birthdayProperties: {
    /** Resource name of the contact this birthday event is associated with. */
    readonly contact: string;
    /** Type of the birthday event. */
    readonly type: 'anniversary' | 'birthday' | 'custom' | 'other' | 'self';
    /** Custom type name, if type is "custom". */
    readonly customTypeName: string;
  };
  /** Specific type of the event. */
  readonly eventType: EventType;
}

/**
 * Required nested date object for events.insert.
 */
export interface NestedDateOnlyRequired extends DeepPartial<NestedDateOnly> {
  /** The date, in the format "yyyy-mm-dd", as defined by RFC 3339. */
  readonly date: NestedDateOnly['date'];
}

/**
 * Required nested date-time object for events.insert.
 */
export interface NestedDateTimeRequired extends DeepPartial<NestedDateTime> {
  /** The time, as a combined date-time value (formatted according to RFC 3339). */
  readonly dateTime: NestedDateTime['dateTime'];
}

/**
 * Union of required start/end time formats for insertion.
 */
export type NestedDateRequired = NestedDateOnlyRequired | NestedDateTimeRequired;

/**
 * Request body for inserting an event.
 */
export interface EventResourceInsertBody extends DeepPartial<EventResource> {
  /** The (inclusive) start time of the event. */
  readonly start: NestedDateRequired;
  /** The (exclusive) end time of the event. */
  readonly end: NestedDateRequired;
}

/**
 * Parameter options for the events.insert method.
 */
export interface EventResourceInsertOptions {
  /** Calendar identifier. Use "primary" for the logged-in user. */
  readonly calendarId: string;

  /** The event data to insert. */
  readonly body: EventResourceInsertBody;

  /** Query parameters for the insert request. */
  readonly params?: {
    /** Version of conference data supported by the client. */
    readonly conferenceDataVersion?: number;
    /** The maximum number of attendees to include in the response. */
    readonly maxAttendees?: number;
    /** Whether to send notifications about the creation of the new event (deprecated). */
    readonly sendNotifications: boolean;
    /** Whether to send updates to attendees. */
    readonly sendUpdates?: 'all' | 'externalOnly' | 'none';
    /** Whether the client supports attachments. */
    readonly supportsAttachments?: boolean;
  };
}

// -------------------- EventsResource --------------------

/**
 * A list of events returned by events.list.
 */
export interface EventsResource extends CalendarResource<'events'> {
  /** Title of the calendar. */
  readonly summary: string;
  /** Description of the calendar. */
  readonly description: string;
  /** Last modification time of the calendar (as a RFC3339 timestamp). Read-only. */
  readonly updated: datetime;
  /** The time zone of the calendar. */
  readonly timeZone: string;
  /** The user's access role for this calendar. */
  readonly accessRole: 'none' | 'freeBusyReader' | 'reader' | 'writer' | 'owner';
  /** The default reminders on the calendar for the authenticated user. */
  readonly defaultReminders: readonly {
    /** The method used by this reminder. */
    readonly method: string;
    /** Number of minutes before the start of the event. */
    readonly minutes: number;
  }[];
  /** Token used to access the next page of this result. */
  readonly nextPageToken?: string;
  /** Token used to retrieve only changed entries since this result was returned. */
  readonly nextSyncToken?: string;
  /** List of events on the calendar. */
  readonly items: readonly EventResource[];
}

/**
 * Options for filtering and paginating the events.list request.
 */
export interface EventsResourceQueryOptions {
  /** Calendar identifier. */
  readonly calendarId: string;

  /** Query parameters for the list request. */
  readonly params?: {
    /** Event types to return. */
    readonly eventTypes?: readonly EventType[];
    /** Specifies an event's iCalendar UID to filter by. */
    readonly iCalUID?: string;
    /** The maximum number of attendees to include in the response. */
    readonly maxAttendees?: number;
    /** Maximum number of events returned on one result page. */
    readonly maxResults?: number;
    /** The order of the events returned in the result. */
    readonly orderBy?: 'startTime' | 'updated';
    /** Token specifying which result page to return. */
    readonly pageToken?: string;
    /** Extended properties constraint for private properties. */
    readonly privateExtendedProperty?: readonly string[];
    /** Free text search terms to find events matching in any field. */
    readonly q?: string;
    /** Extended properties constraint for shared properties. */
    readonly sharedExtendedProperty?: readonly string[];
    /** Whether to include deleted events in the result. */
    readonly showDeleted?: boolean;
    /** Whether to include hidden invitations in the result. */
    readonly showHiddenInvitations?: boolean;
    /** Whether to expand recurring events into instances. */
    readonly singleEvents?: boolean;
    /** Token obtained from the nextSyncToken field. */
    readonly syncToken?: string;
    /** Upper bound (exclusive) for an event's start time. */
    readonly timeMax?: datetime;
    /** Lower bound (inclusive) for an event's end time. */
    readonly timeMin?: datetime;
    /** Time zone used in the response. */
    readonly timeZone?: string;
    /** Lower bound for an event's last modification time. */
    readonly updatedMin?: datetime;
  };
}
