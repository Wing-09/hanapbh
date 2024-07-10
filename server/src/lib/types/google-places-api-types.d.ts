export type GooglePlacesAPINearbyResponse = {
  next_page_token: string;
  results: [
    {
      business_status:
        | "OPERATIONAL"
        | "CLOSED_TEMPORARILY"
        | "CLOSED_PERMANENTLY";
      geometry: {
        location: {
          lat: number;
          lng: number;
        };
      };
      place_id: string;
      name: string;
      photos: [
        {
          height: number;
          photo_reference: string;
          width: number;
        }
      ];
      vicinity: string;
    }
  ];
};
