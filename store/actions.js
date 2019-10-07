let apiUrl = 'https://api.exchangeratesapi.io/latest?base=USD'
export default {
  fetchRates({commit}) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: apiUrl,
        method: 'get'
      })
      .then(resp => {
        if(resp.status === 200) {
          console.table(resp.data.rates)
          commit('SET_RATES', resp.data.rates)
          resolve(resp)
        } 
        else {
          reject(resp.results)
        }
      })
      .catch(err => {
          reject(err)
      })
    })
  },
  changeBaseRates({commit}, baseApi) {
    return new Promise((resolve, reject) => {
      this.$axios({
        url: baseApi,
        method: 'get'
      })
      .then(resp => {
        console.log(baseApi)
        if(resp.status === 200) {
          console.table(resp.data.rates)
          commit('SET_RATES', resp.data.rates)
          resolve(resp)
        } 
        else {
          reject(resp.results)
        }
      })
      .catch(err => {
          reject(err)
      })
    })
  }
}

