import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

const getCurrentUserByContext = (context: ExecutionContext) => {
  if (context.getType() === 'http') {
    const request = context.switchToHttp().getRequest();
    return request.user;
  } else if (context.getType<GqlContextType>() === 'graphql') {
    const ctx = GqlExecutionContext.create(context).getContext();
    return ctx.req.user;
  }
};

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
