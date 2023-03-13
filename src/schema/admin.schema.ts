import { object, string, TypeOf, array } from "zod";

export const createPermissionSchema = object({
  body: object({
    permission: string({ required_error: "Permission is required" }),
    description: string({ required_error: "Description is required" }),
  }),
});

export const createPermissionsSchema = object({
  body: object({
    permissions: array(
      object({
        name: string({ required_error: "Name is required" }),
        description: string({ required_error: "description is required" }),
      })
    ).nonempty(),
    code: string({ required_error: "Permission is required" }),
  }),
});
