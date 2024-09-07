import postcssPresetEnv from "postcss-preset-env";
import autoprefixer from "autoprefixer";
import postcssMixins from "postcss-mixins"

export default {
  plugins: [postcssMixins(), postcssPresetEnv(), autoprefixer(), ],
};
