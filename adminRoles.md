Steps to configure and test the Role-Based Access Control successfully:

    1. Create a list of permissions you'd like to create: Post /api/admin/permissions. Ensure your req.body.code matches the PERMISSION_CODE in your environment variable.
    
    2. Hit the Get /api/admin/permissions to fetch the list of all available permissions. You'll be making use of the _ids to create the roles.
