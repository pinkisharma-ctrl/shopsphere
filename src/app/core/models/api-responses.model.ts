// Login Response
export interface LoginResponse {
    access_token: string;
    refresh_token: string;
  }
  
  // User Object
  export interface User {
    id: number;
    email: string;
    name: string;
    avatar: string;
  }


  /**
   *     "id": 1,
    "email": "john@mail.com",
    "password": "changeme",
    "name": "Jhon",
    "role": "customer",
    "avatar": "https://i.imgur.com/LDOO4Qs.jpg",
    "creationAt": "2025-04-23T02:03:52.000Z",
    "updatedAt": "2025-04-23T02:03:52.000Z"
   */
  
  // Product Object (optional if you're fetching products too)
  export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }
  