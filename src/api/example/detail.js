// eslint-disable-next-line no-unused-vars
import { createAPI, createFormAPI } from '@/utils/request'

export const list = data => createAPI('/details/list', 'get', data)
