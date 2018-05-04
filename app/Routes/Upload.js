const Route = use("Route");
const Helpers = use("Helpers");
const Env = use("Env");
Route.post("upload", async ({ request, response }) => {
  const profilePics = request.file("file", {
    types: ["image"],
    size: "2mb"
  });
  await profilePics.move(Helpers.tmpPath("uploads"), {
    name: `${new Date().getTime()}.${profilePics.subtype}`
  });

  if (!profilePics.moved()) {
    return profilePics.errors();
  }
  return `${Env.get("APP_URL")}/download/${profilePics.fileName}`.toString();
});

Route.get("download/:fileId", async ({ params, response }) => {
  response.download(Helpers.tmpPath(`uploads/${params.fileId}`));
});
