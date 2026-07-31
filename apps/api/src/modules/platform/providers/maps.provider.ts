import { Injectable } from '@nestjs/common';

export interface GeocodeInput {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  countryCode: string;
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
}

export interface MapsProvider {
  geocode(input: GeocodeInput): Promise<GeocodeResult>;
  reverseGeocode(lat: number, lng: number): Promise<string>;
  calculateDistance(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
  ): Promise<number>;
  calculateEta(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
  ): Promise<number>;
}

@Injectable()
export class StubMapsProvider implements MapsProvider {
  async geocode(input: GeocodeInput): Promise<GeocodeResult> {
    // Stub implementation
    return {
      latitude: 0,
      longitude: 0,
    };
  }

  async reverseGeocode(lat: number, lng: number): Promise<string> {
    return '123 Fake Street, City, Country';
  }

  async calculateDistance(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
  ): Promise<number> {
    return 10; // in km
  }

  async calculateEta(
    originLat: number,
    originLng: number,
    destLat: number,
    destLng: number,
  ): Promise<number> {
    return 30; // in minutes
  }
}
