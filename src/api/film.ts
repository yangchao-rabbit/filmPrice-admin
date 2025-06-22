import request from '@/utils/request'

export interface Film {
    id: string
    name: string
    alias: string
    brand: string
    iso: string
    type: string
    format: string
    image?: string
    desc?: string
    created_at?: string
    updated_at?: string
}

export interface FilmLink {
    id: string
    film_id: string
    platform: string
    name: string
    url: string
    is_active: boolean
    film?: Film
    price?: FilmPrice[]
}

export interface FilmPrice {
    id: string
    link_id: string
    price: number
}

export interface FilmPriceHistory {
    id: string
    link_id: string
    price: number
    checked_at: string
}

export const FilmListAPI = (params: object) => request.get('/api/film', { params })

export const FilmDetailAPI = (id: string) => request.get(`/api/film/${id}`)

export const FilmCreateAPI = (data: object) => request.post('/api/film', data)

export const FilmUpdateAPI = (id: string, data: object) => request.put(`/api/film/${id}`, data)

export const FilmDeleteAPI = (id: string) => request.delete(`/api/film/${id}`)

export const FilmPriceListAPI = (params: object) => request.get('/api/film/price', { params })

export const FilmPriceDetailAPI = (id: string) => request.get(`/api/film/price/${id}`)

export const FilmPriceCreateAPI = (data: object) => request.post('/api/film/price', data)

export const FilmPriceUpdateAPI = (id: string, data: object) => request.put(`/api/film/price/${id}`, data)

export const FilmPriceDeleteAPI = (id: string) => request.delete(`/api/film/price/${id}`)

export const FilmPriceHistoryListAPI = (params: object) => request.get('/api/film/price-history', { params })

export const FilmPriceHistoryDetailAPI = (id: string) => request.get(`/api/film/price-history/${id}`)

export const FilmPriceHistoryCreateAPI = (data: object) => request.post('/api/film/price-history', data)

export const FilmPriceHistoryUpdateAPI = (id: string, data: object) => request.put(`/api/film/price-history/${id}`, data)

export const FilmPriceHistoryDeleteAPI = (id: string) => request.delete(`/api/film/price-history/${id}`)

export const FilmLinkListAPI = (params: object) => request.get('/api/film/link', { params })

export const FilmLinkDetailAPI = (id: string) => request.get(`/api/film/link/${id}`)

export const FilmLinkCreateAPI = (data: object) => request.post('/api/film/link', data)

export const FilmLinkUpdateAPI = (id: string, data: object) => request.put(`/api/film/link/${id}`, data)

export const FilmLinkDeleteAPI = (id: string) => request.delete(`/api/film/link/${id}`)
