export const mode = "jit";
export const content = [
  "./src/**/*.{js,jsx,ts,tsx}",
  "./public/index.html",
  "node_modules/flowbite-react/lib/esm/**/*.js",
];
export const media = false;
export const theme = {
  extend: {},
};
export const variants = {
  extend: {},
};
export const plugins = [require("flowbite/plugin")];
