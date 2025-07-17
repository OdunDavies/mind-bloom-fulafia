export interface Message {
    id: string;
    from: string;   // email or id of sender
    to: string;     // email or id of recipient
    content: string;
    timestamp: string;
  }