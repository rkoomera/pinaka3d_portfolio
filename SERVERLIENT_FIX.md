# ServerClient.ts Fix

## Problem

The `serverClient.ts` file had several linter errors:

1. Naming conflicts with the imported `createClient` function and the exported function of the same name
2. Missing import for `CookieOptions` type
3. Type errors in function calls

## Solution

We made the following changes to fix these issues:

1. **Renamed Imports and Functions**:
   - Renamed the imported `createClient` to `supabaseCreateClient` to avoid naming conflicts
   - Renamed the exported `createClient` function to `createDirectClient` for clarity
   - Imported `createServerClient` as `createSSRClient` to avoid naming conflicts

2. **Added Missing Imports**:
   - Added the import for `CookieOptions` type from `@supabase/ssr`

3. **Fixed Type Errors**:
   - Added proper type annotations to function calls
   - Added `<Database>` type parameter to `supabaseCreateClient` calls

4. **Updated References**:
   - Updated imports in `lib/services/contact.ts` to use the renamed functions
   - Updated imports in `app/api/contact/direct-test/route.ts` to use the renamed functions

## Files Changed

1. `lib/supabase/serverClient.ts` - Fixed naming conflicts and type errors
2. `lib/services/contact.ts` - Updated imports
3. `app/api/contact/direct-test/route.ts` - Updated imports

## Result

The linter errors in `serverClient.ts` have been resolved, and the code now properly uses the renamed functions. The contact form submission should continue to work correctly with these changes. 