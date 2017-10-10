import queryString from 'query-string'
import _ from 'lodash'
import Mock from 'mockjs'
import config from './config'

export function get(url, params) {
    url = config.api.base + url
    if (params) {
        url += '?' + queryString.stringify(params)
    }

    return fetch(url)
        .then(x => x.json())
        .then(x => Mock.mock(x));
}

export function post(url, body) {
    url = config.api.base + url
    var options = _.extend(config.header, {
        body: JSON.stringify(body)
    })
    return fetch(url, options)
        .then(x => x.json())
        .then(x => Mock.mock(x));
}