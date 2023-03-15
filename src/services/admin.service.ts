import { v4 as uuid } from "uuid";
import config from "config";
import log from "../logger";
import Permission, { PermissionDocument } from "../models/permission.model";
import Role from "../models/role.model";
import User from "../models/user.model";
import UserRole from "../models/roleType.model";

interface Response {
  code: number;
  status: boolean;
  message?: any;
}
const defaultResponse: Response = {
  code: 400,
  status: false,
  message: "Invalid Permission Code provided",
};

export async function createPermission(
  permission: string,
  description: string
) {
  const defaultResponse: Response = {
    code: 400,
    status: false,
    message: "Permisison Name Already Exists",
  };
  const permExists = await Permission.findOne({ name: permission });
  if (permExists) {
    return defaultResponse;
  }

  const data = await Permission.create({ name: permission, description });

  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = data as any;

  return defaultResponse;
}

export async function createPermissions(
  permissions: any,
  permissionCode: string
) {
  const permCode = config.get("permissionCode");

  const defaultResponse: Response = {
    code: 400,
    status: false,
    message: "Invalid Permission Code provided",
  };
  if (permCode !== permissionCode) {
    return defaultResponse;
  }
  if (!permissions || permissions.length < 1) {
    defaultResponse.message = "Incorrect Permission Data Provided";
    return defaultResponse;
  }
  const data = await Permission.insertMany(permissions);
  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = data as any;

  return defaultResponse;
}

export async function getPermissions() {
  const defaultResponse: Response = {
    code: 404,
    status: false,
    message: "No Permission Found",
  };
  const data = await Permission.find().select("_id name description");
  if (data.length < 1) return defaultResponse;

  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = data as any;
  return defaultResponse;
}

export async function createRole(role: string, permission: string) {
  let groupId = uuid();
  const pExists = await Permission.findOne({ _id: permission });
  if (!pExists) {
    defaultResponse.message = "Permission with ID does not exist";
    return defaultResponse;
  }

  const newRole = role.trim().replace(/ /g, "-").toLowerCase();

  const roleExists = await Role.find({ roleName: newRole });
  if (roleExists.length > 0) {
    //ole Exists. Will use the group ID
    groupId = roleExists[0].groupId;
  }
  const dataExists = await Role.findOne({
    roleName: newRole,
    permissionId: permission,
  });
  if (dataExists) {
    //Role exists
    log.info("Role with permission exists");
    defaultResponse.message = "Role with Permission already Exists";
    return defaultResponse;
  }
  log.info(
    "Role does not exist... Generating a new grouId in 3...2...1.... done!"
  );
  const roleData = await Role.create({
    roleName: newRole,
    permissionId: permission,
    groupId,
  });
  defaultResponse.status = true;
  defaultResponse.code = 200;
  defaultResponse.message = "Role and Permission Added";
  log.info("Single Role and Permission created");
  return defaultResponse;
}

export async function createRoles(role: string, permissions: string[]) {
  let groupId = uuid();
  let permissionNames = [];
  const permissionExists = await Permission.find({ _id: { $in: permissions } });
  if (permissionExists.length < 1) {
    defaultResponse.message = "Permission not found";
    return defaultResponse;
  }

  const newRole = role.trim().replace(/ /g, "-").toLowerCase();

  const roleExists = await Role.find({ roleName: newRole });
  if (roleExists.length > 0) {
    //means the role already exists. will use the groupId instead
    //of creating a new groupid
    groupId = roleExists[0].groupId;
  }
  for (let i = 0; i < permissionExists.length; i++) {
    const dataExists = await Role.findOne({
      roleName: newRole,
      permissionId: permissionExists[i]._id,
    });
    if (dataExists) {
      log.info("Role with permission already exists");
      defaultResponse.message = "Role with Permission already exists";
      return defaultResponse;
    }
    log.info("Role does not exist, generated a new group id");
    await Role.create({
      roleName: newRole,
      permissionId: permissionExists[i]._id,
      groupId,
    });
    permissionNames.push(permissionExists[i].name);
  }
  //admin with new role and permissions created
  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = "Role and PErmissions added";

  return defaultResponse;
}

export async function allRoles() {
  const pipeline = [
    {
      $lookup: {
        from: "permissions",
        localField: "permissionId",
        foreignField: "_id",
        as: "permissionId",
      },
    },
    {
      $group: {
        _id: {
          roleName: "$roleName",
          groupId: "$groupId",
        },
        permissions: {
          $push: "$permissionId.name",
        },
      },
    },
  ];

  const roles = await Role.aggregate(pipeline);

  if (roles.length < 1) {
    defaultResponse.code = 404;
    defaultResponse.message = "No Role found";

    return defaultResponse;
  }

  log.info("THese are the roles and permissions");
  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = roles;

  return defaultResponse;
}

export async function findRole(role: string) {
  const pipeline = [
    {
      $lookup: {
        from: "permissions",
        localField: "permissionId",
        foreignField: "_id",
        as: "permissionId",
      },
    },
    {
      $match: {
        groupId: role,
      },
    },
    {
      $group: {
        _id: {
          roleName: "$roleName",
          groupId: "$groupId",
        },
        permissions: {
          $push: "$permissionId.name",
        },
      },
    },
  ];

  const roles = await Role.aggregate(pipeline);

  if (roles.length < 1) {
    defaultResponse.code = 404;
    defaultResponse.message = "No Role found";

    return defaultResponse;
  }
  log.info("This is the role and permissions");
  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = roles;

  return defaultResponse;
}

export async function getRole() {
  const roles = await Role.find()
    .populate({
      path: "permissionId",
      select: "_id name description",
      options: { lean: true },
    })
    .select("roleName groupId");

  if (roles.length < 1) {
    defaultResponse.message = "No role found";
    defaultResponse.code = 404;
  }

  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = roles;

  return defaultResponse;
}

export async function updateRole(role: string, permissions: string[]) {
  let groupId = uuid();
  let permNames = [];
  const permExists = await Permission.find({ _id: { $in: permissions } });
  if (permExists.length < 1) {
    defaultResponse.code = 404;
    defaultResponse.message = "No Permission with ID found found";

    return defaultResponse;
  }

  const newRole = role.trim().replace(/ /g, "-").toLowerCase();

  const roleExists = await Role.find({ roleName: newRole });
  if (roleExists.length > 0) {
    log.info(`Role ${role} already Exists, using the groupId`);
    groupId = roleExists[0].groupId;
  }
  for (let i = 0; i < permExists.length; i++) {
    const dataExists = await Role.findOne({
      roleName: newRole,
      permissionId: permExists[i]._id,
    });
    if (dataExists) {
      log.info(
        `Role ${role} with permission ${permExists[i].name} already exists`
      );
      defaultResponse.code = 404;
      defaultResponse.message = "Role with Permission exists already";

      return defaultResponse;
    }
    log.info(`Role ${role} does not exist, generated new groupId`);
    await Role.updateOne(
      { roleName: newRole },
      {
        roleName: newRole,
        permissionId: permExists[i]._id,
        groupId,
      }
    );
    permNames.push(permExists[i].name);

    defaultResponse.code = 200;
    defaultResponse.status = true;
    defaultResponse.message = {
      role: newRole,
      permissions: permNames,
      message: "Roles and Permissions Updated",
    };
  }
}

export async function grantRole(roleGroup: string, user: string) {
  const userData = await User.findOne({ email: user });

  if (!userData) {
    defaultResponse.code = 404;
    defaultResponse.message = "User with email does not exist";
    return defaultResponse;
  }

  const role = await Role.findOne({ groupId: roleGroup });
  if (!role) {
    defaultResponse.code = 404;
    defaultResponse.message = "No Role found";
    return defaultResponse;
  }

  userData.isAdmin = true;

  const userRoleData = await UserRole.findByIdAndUpdate(
    { user: userData._id },
    {
      user: userData._id,
      roleGroupId: roleGroup,
    },
    { upsert: true }
  );

  userData.adminRole = role.groupId;

  await User.updateOne({ email: user }, userData);

  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = "Role successfully assigned";
}

export async function revokeRole(userId: string) {
  const userData = await User.findOne({ _id: userId });
  if (!userData) {
    defaultResponse.code = 404;
    defaultResponse.message = "No User found";

    return defaultResponse;
  }

  userData.isAdmin = false;

  const userRoleData = await UserRole.findOneAndDelete({ user: userId });

  const oldRole = userData.adminRole;

  userData.adminRole = "user";

  await User.updateOne({ _id: userId }, userData);
  log.info("User Admin Right Revoked");

  defaultResponse.code = 200;
  defaultResponse.status = true;
  defaultResponse.message = "Role successfully revoked";

  return defaultResponse;
}
