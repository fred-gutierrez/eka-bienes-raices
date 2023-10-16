export interface Post {
  attachments: {
    data: {
      subattachments: {
        data: {
          media: {
            image: {
              src: string;
            };
          };
        }[];
      };
    }[];
  };
  message: string;
  id: string;
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
