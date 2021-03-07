import {rite_aids} from '../lib/rite-aids'

class RiteAidStore {
  constructor(data) {
    Object.assign(this, data)
  }

  hasSlots = () => this.results.Data.slots["1"]

  signUpUrl = "https://www.riteaid.com/pharmacy/covid-qualifier"
}


const Index = ({stores, timestamp}) =>
  <ul>
    <p>{timestamp}</p>
    {stores.map((store, i) => {
      store = new RiteAidStore(store)
      return <li key={i}>Rite Aid #{store.storeNumber} ({store.fullZipCode}) {store.locationDescription} {store.hasSlots() ?
        <a href={store.signUpUrl}>⭐ AVAILABLE</a> : null}</li>
    })}
  </ul>

export async function getServerSideProps() {
  const stores = await Promise.all(rite_aids.Data.stores.map(async (store) => {
    const res = await fetch(`https://www.riteaid.com/services/ext/v2/vaccine/checkSlots?storeNumber=${store.storeNumber}`)
    store.results = await res.json()
    return store
  }))

  return {props: {stores, timestamp: Date.now()}}
}

export default Index
