import axios, { AxiosResponse } from 'axios';
import { format, addDays } from 'date-fns';
import type {
  NEOFeedResponse,
  APODResponse,
  NearEarthObject,
  MeteorEvent,
} from '@/types/meteor';

const NASA_API_BASE = 'https://api.nasa.gov';
const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

class NASAApiService {
  private api = axios.create({
    baseURL: NASA_API_BASE,
    timeout: 10000,
    params: {
      api_key: API_KEY,
    },
  });

  /**
   * Get Near Earth Objects for a specific date range
   */
  async getNearEarthObjects(
    startDate: Date = new Date(),
    endDate: Date = addDays(new Date(), 7)
  ): Promise<NEOFeedResponse> {
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');

      const response: AxiosResponse<NEOFeedResponse> = await this.api.get(
        '/neo/rest/v1/feed',
        {
          params: {
            start_date: formattedStartDate,
            end_date: formattedEndDate,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching Near Earth Objects:', error);
      throw new Error('Failed to fetch meteor data');
    }
  }

  /**
   * Get detailed information about a specific Near Earth Object
   */
  async getNearEarthObjectDetails(neoId: string): Promise<NearEarthObject> {
    try {
      const response: AxiosResponse<NearEarthObject> = await this.api.get(
        `/neo/rest/v1/neo/${neoId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching NEO details:', error);
      throw new Error('Failed to fetch meteor details');
    }
  }

  /**
   * Get Astronomy Picture of the Day
   */
  async getAstronomyPictureOfDay(date?: Date): Promise<APODResponse> {
    try {
      const params: any = {};
      if (date) {
        params.date = format(date, 'yyyy-MM-dd');
      }

      const response: AxiosResponse<APODResponse> = await this.api.get(
        '/planetary/apod',
        { params }
      );

      return response.data;
    } catch (error) {
      console.error('Error fetching APOD:', error);
      throw new Error('Failed to fetch astronomy picture');
    }
  }

  /**
   * Get potentially hazardous asteroids
   */
  async getPotentiallyHazardousAsteroids(): Promise<NearEarthObject[]> {
    try {
      const neoData = await this.getNearEarthObjects();
      const hazardousObjects: NearEarthObject[] = [];

      Object.values(neoData.near_earth_objects).forEach((dateObjects) => {
        hazardousObjects.push(
          ...dateObjects.filter((neo) => neo.is_potentially_hazardous_asteroid)
        );
      });

      return hazardousObjects;
    } catch (error) {
      console.error('Error fetching hazardous asteroids:', error);
      throw new Error('Failed to fetch hazardous asteroids');
    }
  }

  /**
   * Transform NASA NEO data into our simplified MeteorEvent format
   */
  transformToMeteorEvents(neoData: NEOFeedResponse): MeteorEvent[] {
    const meteorEvents: MeteorEvent[] = [];

    Object.entries(neoData.near_earth_objects).forEach(([date, objects]) => {
      objects.forEach((neo) => {
        const approachData = neo.close_approach_data[0]; // Get the closest approach
        if (approachData) {
          meteorEvents.push({
            id: neo.id,
            name: neo.name,
            date,
            estimatedSize: {
              min: neo.estimated_diameter.kilometers.estimated_diameter_min,
              max: neo.estimated_diameter.kilometers.estimated_diameter_max,
              unit: 'km',
            },
            velocity: {
              value: parseFloat(approachData.relative_velocity.kilometers_per_hour),
              unit: 'km/h',
            },
            distance: {
              value: parseFloat(approachData.miss_distance.kilometers),
              unit: 'km',
            },
            isHazardous: neo.is_potentially_hazardous_asteroid,
            approachDate: approachData.close_approach_date_full,
          });
        }
      });
    });

    return meteorEvents.sort(
      (a, b) => new Date(a.approachDate).getTime() - new Date(b.approachDate).getTime()
    );
  }

  /**
   * Get meteors approaching today
   */
  async getTodaysMeteors(): Promise<MeteorEvent[]> {
    try {
      const today = new Date();
      const neoData = await this.getNearEarthObjects(today, today);
      return this.transformToMeteorEvents(neoData);
    } catch (error) {
      console.error("Error fetching today's meteors:", error);
      throw new Error("Failed to fetch today's meteors");
    }
  }

  /**
   * Get meteors for the next week
   */
  async getUpcomingMeteors(): Promise<MeteorEvent[]> {
    try {
      const neoData = await this.getNearEarthObjects();
      return this.transformToMeteorEvents(neoData);
    } catch (error) {
      console.error('Error fetching upcoming meteors:', error);
      throw new Error('Failed to fetch upcoming meteors');
    }
  }
}

export const nasaApi = new NASAApiService();
export default nasaApi;