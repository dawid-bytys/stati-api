import { ExecutionContext, Injectable } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest<T = unknown>(context: ExecutionContext): T {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req
  }
}
