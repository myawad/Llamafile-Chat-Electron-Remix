export default {
  packagerConfig: {
    asar: true,
    extraFiles: ["./drizzle"],
    icon: "./public/favicon",
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      