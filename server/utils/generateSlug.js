export const generateSlug = (text = "") => {
     return text
       .toString()
       .toLowerCase()
       .trim()
       .replace(/&/g, "-and-")        // replace &
       .replace(/[\s\W-]+/g, "-")     // replace spaces & special chars
       .replace(/^-+|-+$/g, "");      // remove starting/ending -
   };