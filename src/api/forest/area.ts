import request from '@/utils/request'
import { Area, AreaAttrs, AreaConditions } from './types/area'
import { PageResult } from '../types'

export const getAreasByFarm = (farmId: number) => {
  return request<Area[]>({
    method: 'GET',
    url: '/forest/areas',
    params: {
      farmId
    }
  })
}

export const getAreasByConditions = (params: AreaConditions) => {
  return request<PageResult<Area>>({
    method: 'GET',
    url: '/forest/areas/by-conditions',
    params
  })
}

export const deleteArea = (id: number) => {
  return request<Area>({
    method: 'DELETE',
    url: `/forest/areas/${id}`
  })
}

export const getAreaById = (id: number) => {
  return request<Area>({
    method: 'GET',
    url: `/forest/areas/${id}`
  })
}

export const createArea = (data: AreaAttrs) => {
  return request<Area>({
    method: 'POST',
    url: '/forest/areas',
    data
  })
}

export const updateArea = (id: number, data: AreaAttrs) => {
  return request<Area>({
    method: 'PATCH',
    url: `/forest/areas/${id}`,
    data
  })
}
