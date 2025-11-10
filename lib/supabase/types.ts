export interface Database {
  public: {
    Tables: {
      possible_events: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          created_at?: string;
        };
      };
    };
  };
}

export type PossibleEvent = Database["public"]["Tables"]["possible_events"]["Row"];

export type PossibleEventInsert = Database["public"]["Tables"]["possible_events"]["Insert"];

export interface User {
  id: string;
  email?: string;
}

