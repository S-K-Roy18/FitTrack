/**
 * food-log controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::food-log.food-log', ({strapi})=>({
    async create(ctx) {
        const user =ctx.state.user

        if(!user) return ctx.unauthorized('Login required')
            const body= ctx.request.body.data;
        body.users_permissions_user = user.id;

        const entry = await strapi.entityService.create(
            "api::food-log.food-log", {
                data: body,
                populate: ["users_permissions_user"]
            }
        )
        return entry;
    },
    async find(ctx) {
  const user = ctx.state.user;

  // ✅ prevent crash
  if (!user) {
    return [];
  }

  const result = await strapi.entityService.findMany(
    "api::food-log.food-log",
    {
      filters: {
        users_permissions_user: {
          id: user.id,
        },
      },
      populate: ["users_permissions_user"],
    }
  );

  // 🔥 FLATTEN DATA (VERY IMPORTANT)
const formatted = result.map((item: any) => ({
  id: item.id,
  documentId: item.documentId,
  name: item.name,
  calories: item.calories,
  mealType: item.mealType,
  createdAt: item.createdAt,
}));

return formatted;
},
    async findOne(ctx) {
        const user =ctx.state.user;
        if (!user) {
             return ctx.unauthorized("Login required");
        }
        const {id} = ctx.params;

        const result = await strapi.entityService.findMany(
            "api::food-log.food-log", {
                filters: {id, users_permissions_user:{id: user.id}},
                populate: ["users_permissions_user"]
            }
        )
        if(!result.length) return ctx.notFound("Not found or not yours")
        return result[0];
    }

}));

