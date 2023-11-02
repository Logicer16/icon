import autoPrefixer from "autoprefixer";
// import {Config} from "postcss-load-config";
import tailWindCSS from "tailwindcss";

const config = {
  plugins: [
    //Some plugins, like tailwindcss/nesting, need to run before Tailwind,
    tailWindCSS(),
    //But others, like autoprefixer, need to run after,
    autoPrefixer()
  ]
};

export default config;
