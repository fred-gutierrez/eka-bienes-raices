export interface Post {
  "attachments/data/0/subattachments/data/0/media/image/src": string,
  "attachments/data/0/subattachments/data/1/media/image/src": string,
  "attachments/data/0/subattachments/data/2/media/image/src": string,
  "attachments/data/0/subattachments/data/3/media/image/src": string,
  "attachments/data/0/subattachments/data/4/media/image/src": string,
  message: string;
  id: string;
  supaId: number;
}

export type Interior = {
  ifStatement: number | boolean;
  icon: any;
  desc: string;
  display: number;
};

export type Property = {
  propType: string;
  icon: any;
};
