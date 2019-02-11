import Vuex from 'vuex'

export default function plugin(store) {
  store.mapAll = mapAll.bind(store)
}

function mapAll(type) {
  if (!['state', 'getters', 'mutations', 'actions'].includes(type))
    throw new RangeError('[Vuex:mapAll()] Invalid mapper type')

  const mapperKey = 'map' + type[0].toUpperCase() + type.slice(1)
  if (!['mapState', 'mapGetters', 'mapMutations', 'mapActions'].includes(mapperKey))
    throw new RangeError('[Vuex:mapAll()] Invalid mapperKey')

  const keys = Object.keys(this[type])
  if (!keys || !keys.length)
    return []

  return Vuex[mapperKey](keys)
}