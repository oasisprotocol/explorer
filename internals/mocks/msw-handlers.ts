import { http, HttpResponse } from 'msw'
import { runtimeStatusResponse, statusResponse } from './api'

export const handlers = [
  http.get(process.env.REACT_APP_API!, () => HttpResponse.json(statusResponse)),
  http.get(`${process.env.REACT_APP_API}sapphire/status`, () => HttpResponse.json(runtimeStatusResponse)),
]

export const statusApiFailureHandler = [http.get(process.env.REACT_APP_API!, () => HttpResponse.error())]
