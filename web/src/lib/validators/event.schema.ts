import { NextApiRequest, NextApiResponse } from 'next';
import { EventTypes } from '@/types/event.types';

// Mock database - replace with your actual database
const mockEvents: EventTypes[] = [
  {
    id: 1,
    organizerId: 101,
    eventName: "Summer Music Festival",
    description: "A fantastic outdoor music festival featuring local and international artists.",
    category: "Music",
    location: "Central Park, New York",
    price: "$75",
    startDate: "2024-08-15T18:00:00Z",
    endDate: "2024-08-15T23:00:00Z",
    totalSeats: 5000,
    availableSeats: 3200,
    imageUrl: "/images/music-festival.jpg",
    status: "ACTIVE"
  },
  {
    id: 2,
    organizerId: 102,
    eventName: "Tech Conference 2024",
    description: "Annual technology conference with industry leaders and innovators.",
    category: "Technology",
    location: "Convention Center, San Francisco",
    price: "$299",
    startDate: "2024-09-20T09:00:00Z",
    endDate: "2024-09-22T17:00:00Z",
    totalSeats: 1000,
    availableSeats: 150,
    imageUrl: "/images/tech-conference.jpg",
    status: "ACTIVE"
  },
  {
    id: 3,
    organizerId: 103,
    eventName: "Food & Wine Expo",
    description: "Culinary experience featuring the best local restaurants and wineries.",
    category: "Food & Drink",
    location: "Downtown Exhibition Hall, Chicago",
    price: "$45",
    startDate: "2024-10-05T12:00:00Z",
    endDate: "2024-10-05T20:00:00Z",
    totalSeats: 800,
    availableSeats: 650,
    imageUrl: "/images/food-expo.jpg",
    status: "ACTIVE"
  }
];

// Pages Router Version
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  try {
    switch (method) {
      case 'GET':
        // Get all events or filter by query parameters
        let filteredEvents = mockEvents;
        
        if (query.status) {
          filteredEvents = filteredEvents.filter(event => 
            event.status === query.status
          );
        }
        
        if (query.category) {
          filteredEvents = filteredEvents.filter(event => 
            event.category.toLowerCase().includes((query.category as string).toLowerCase())
          );
        }

        if (query.organizerId) {
          filteredEvents = filteredEvents.filter(event => 
            event.organizerId === parseInt(query.organizerId as string)
          );
        }

        res.status(200).json(filteredEvents);
        break;

      case 'POST':
        // Create new event
        const newEvent: EventTypes = {
          id: mockEvents.length + 1,
          ...req.body,
        };
        
        mockEvents.push(newEvent);
        res.status(201).json(newEvent);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}