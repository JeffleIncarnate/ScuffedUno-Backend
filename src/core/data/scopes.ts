export interface IScopes {
   socket: {
      canCreateRoom: boolean;
      canJoinRoom: boolean;
      canPlayCard: boolean;
   };
   self: {
      canDeleteSelf: boolean;
      canDeleteOthers: boolean;
      canCreateUSer: boolean;
   };
}

const generalScopes: IScopes = {
   socket: {
      canCreateRoom: true,
      canJoinRoom: true,
      canPlayCard: true,
   },
   self: {
      canDeleteSelf: true,
      canDeleteOthers: false,
      canCreateUSer: false,
   },
};

const createUserScopes: IScopes = {
   socket: {
      canCreateRoom: false,
      canJoinRoom: false,
      canPlayCard: false,
   },
   self: {
      canDeleteSelf: false,
      canDeleteOthers: false,
      canCreateUSer: true,
   },
};

export { generalScopes, createUserScopes };
