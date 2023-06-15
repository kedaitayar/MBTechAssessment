import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {GOOGLE_API_KEY} from '@env';

interface GeoCodingResponse {
  results: Result[];
  status:
    | 'OK'
    | 'ZERO_RESULTS'
    | 'OVER_DAILY_LIMIT'
    | 'OVER_QUERY_LIMIT'
    | 'REQUEST_DENIED'
    | 'INVALID_REQUEST'
    | 'UNKNOWN_ERROR';
}

export interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  plus_code?: PlusCode;
  types: string[];
}

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Geometry {
  bounds?: Viewport;
  location: Location;
  location_type: string;
  viewport: Viewport;
}

interface Location {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Location;
  southwest: Location;
}

interface PlusCode {
  compound_code: string;
  global_code: string;
}

export const googleMapsApi = createApi({
  reducerPath: 'mapsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://maps.googleapis.com/maps/api/',
  }),
  endpoints: build => ({
    getPlaceAutocomplete: build.query<
      {
        predictions: {
          description: string;
          place_id: string;
          structured_formatting?: {
            main_text?: string;
            secondary_text?: string;
          };
        }[];
        status: string;
      },
      {input: string}
    >({
      query: arg => {
        return {
          url: 'place/autocomplete/json',
          params: {
            input: arg.input,
            components: 'country:my',
            key: GOOGLE_API_KEY,
          },
        };
      },
    }),
    getGeoCodingPlaceId: build.query<GeoCodingResponse, {placeId: string}>({
      query: arg => {
        return {
          url: 'geocode/json',
          params: {
            place_id: arg.placeId,
            key: GOOGLE_API_KEY,
          },
        };
      },
    }),
  }),
});

export const {useGetPlaceAutocompleteQuery, useGetGeoCodingPlaceIdQuery} =
  googleMapsApi;
