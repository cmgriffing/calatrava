// DUPLICATED FROM types.ts
export interface DatastoreRecord {
  createdAt: number;
  modifiedAt: number;
}
// END DUPLICATES

export interface ErrorResponse {
  message?: string;
}

export interface EmptyResponse {}

export interface PostUserResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
    userId: string;
  };
}

export interface PostTeamResponse extends DatastoreRecord {
  teamId: string;
  userId: string;
  name: string;
}

export interface PostMealResponse extends DatastoreRecord {
  mealId: string;
  userId: string;
  name: string;
  unsplashImageData?: {
    thumbUrl: string;
    imageUrl: string;
    author: string;
    authorUrl: string;
  };
}

export interface GetMealsResponse {
  meals: PostMealResponse[];
}

export interface PostRestaurantResponse extends DatastoreRecord {
  restaurantId: string;
  userId: string;
  name: string;
}

export interface GetRestaurantsResponse {
  restaurants: PostRestaurantResponse[];
}

export interface PostPollResponse extends DatastoreRecord {
  pollId: string;
  teamId: string;
  userId: string;
  name: string;
}

export interface GetPollResponse extends DatastoreRecord {
  pollId: string;
  teamId: string;
  userId: string;
  name: string;
  mealOptions: PostMealResponse[];
  restaurantOptions: PostRestaurantResponse[];
}

export interface GetPollsResponse {
  polls: PostPollResponse[];
}

export interface GetTeamsResponse {
  ownedTeams: PostTeamResponse[];
  joinedTeams: PostTeamResponse[];
}

export interface PostTeammateResponse extends DatastoreRecord {
  userId: string;
  name: string;
  email: string;
  accepted: boolean;
}

export interface GetImageResponse {
  presignedUrl: string;
}

export interface GetSubscriptionResponse {
  userId: string;
  subscriptionId: string;
  subscriptionType: string;
  subscriptionTier: string;
  subscriptionVersion: string;
  marketplace: string;
  productId: string;
  createdAt: number;
  modifiedAt: number;
}

export interface GetSubscriptionsResponse {
  subscriptions: GetSubscriptionResponse[];
}

export interface PresignedPostResponse {
  url: string;
  fields: {
    Policy: string;
    "X-Amz-Algorithm": string;
    "X-Amz-Credential": string;
    "X-Amz-Date": string;
    "X-Amz-Signature": string;
    bucket: string;
    key: string;
  };
}

export interface ImageSearchResponse {
  searchResults: {
    id: string;
    created_at: string;
    width: number;
    height: number;
    color: string;
    blur_hash: string;
    likes: number;
    liked_by_user: boolean;
    description: string;
    user: {
      id: string;
      username: string;
      name: string;
      first_name: string;
      last_name: string;
      instagram_username: string;
      twitter_username: string;
      portfolio_url: string;
      profile_image: {
        small: string;
        medium: string;
        large: string;
      };
      links: {
        self: string;
        html: string;
        photos: string;
        likes: string;
      };
    };
    urls: {
      raw: string;
      full: string;
      regular: string;
      small: string;
      thumb: string;
    };
    links: {
      self: string;
      html: string;
      download: string;
    };
  }[];
}

export interface GetPollVotesResponse {}

export interface RestaurantSearchItem {
  rating: number;
  price: string;
  phone: string;
  id: string;
  alias: string;
  is_closed: boolean;
  categories?:
    | {
        alias: string;
        title: string;
      }[]
    | null;
  review_count: number;
  name: string;
  url: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  image_url: string;
  location: {
    city: string;
    country: string;
    address2: string;
    address3: string;
    state: string;
    address1: string;
    zip_code: string;
  };
  distance: number;
  transactions?: string[] | null;
}
export interface RestaurantSearchResponse {
  searchResults: RestaurantSearchItem[];
}

export interface GeolocationIpLookupResponse {
  ip: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country_code: string;
  country_code_iso3: string;
  country_name: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
  hostname: string;
}

export interface RestaurantDetailsResponse {
  id: string;
  alias: string;
  name: string;
  image_url: string;
  is_claimed: boolean;
  is_closed: boolean;
  url: string;
  phone: string;
  display_phone: string;
  review_count: number;
  categories?:
    | {
        alias: string;
        title: string;
      }[]
    | null;
  rating: number;
  location: {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    zip_code: string;
    country: string;
    state: string;
    display_address?: string[] | null;
    cross_streets: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  photos?: string[] | null;
  price: string;
  hours?:
    | {
        open?:
          | {
              is_overnight: boolean;
              start: string;
              end: string;
              day: number;
            }[]
          | null;
        hours_type: string;
        is_open_now: boolean;
      }[]
    | null;
  transactions?: null[] | null;
  special_hours?:
    | {
        date: string;
        is_closed?: null;
        start: string;
        end: string;
        is_overnight: boolean;
      }[]
    | null;
}
