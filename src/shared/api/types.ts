export type GetCentersResponse = {
  available_centers: string[];
};

export type GetCenterAvailabilityParams = {
  center: string;
};

export type GetCenterAvailabilityResponse = {
  begin: string;
  end: string;
};

export type GetResultParams = {
  center: string;
  begin: string;
  end: string;
  min_lat: number;
  max_lat: number;
  min_lon: number;
  max_lon: number;
  geomag: string;
  send_rec: boolean;
  send_wmt: boolean;
};
