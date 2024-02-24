/**
 * @file The prettier config.
 */

import {prettierConfigGenerator} from "@logicer/prettier-config";
import {options} from "./eslint.config.js";

export default prettierConfigGenerator(options);
