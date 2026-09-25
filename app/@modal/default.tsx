// Required fallback for the @modal parallel route slot. Next.js renders
// this whenever the current URL doesn't match the intercepted
// `(.)products/[id]` route (i.e. on every other page, and on a hard
// navigation/refresh even for a product URL). Returning null means the
// slot simply renders nothing in those cases.
export default function Default() {
  return null;
}