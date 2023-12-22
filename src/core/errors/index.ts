import * as OtherErrors from "./other";
import * as PostErrors from "./post";
import * as AuthErrors from "./auth";

export default {
   ...OtherErrors,
   ...PostErrors,
   ...AuthErrors,
};
