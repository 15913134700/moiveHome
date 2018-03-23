import moment from 'moment'

const YYYY_MM_DD_HH_MM = "YYYY/MM/DD HH:mm"

export function format(dateString, formator = YYYY_MM_DD_HH_MM) {
    return moment(dateString).format(formator)
}