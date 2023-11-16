import autoPrefixer from "autoprefixer";
import tailWindCSS from "tailwindcss";
import tailWindCSSNesting from "tailwindcss/nesting/index.js";

const config = {
  plugins: [tailWindCSSNesting(), tailWindCSS(), autoPrefixer()]
};

export default config;
