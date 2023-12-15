const scopes = {
  socket: {
    canCreateRoom: true,
    canJoinRoom: true,
    canPlayCard: true,
  },
  self: {
    canDeleteSelf: true,
    canDeleteOthers: false,
  },
};

export { scopes };
