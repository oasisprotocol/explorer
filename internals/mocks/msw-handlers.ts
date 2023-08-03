import { rest } from 'msw'
import { runtimeStatusResponse, statusResponse } from './api'

export const handlers = [
  rest.get(process.env.REACT_APP_API!, (req, res, ctx) => res(ctx.json(statusResponse))),
  rest.get(`${process.env.REACT_APP_API}sapphire/status`, (req, res, ctx) =>
    res(ctx.json(runtimeStatusResponse)),
  ),
]
