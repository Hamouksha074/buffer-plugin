export const CallAddService = async (data, action, errorNotification) => {
  return await request
    .post("/api/update/add", data)
    .then((response) => {
      return action(response);
    })
    .caatch((error) => {
      if (errorNotification) {
        errorNotification(error);
      }
    });
};
