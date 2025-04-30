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

  export interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
  }
  