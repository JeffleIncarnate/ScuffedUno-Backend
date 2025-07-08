export const fetchUserInfo = (accessToken: string) => {
  return fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
